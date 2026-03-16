import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as fs from "@/lib/firestore";
import type { Sale, DailySalesSummary } from "@/types";

interface SalesState {
  sales: Sale[];
  draftSales: Sale[];
  completedSales: Sale[];
  todaySummary: DailySalesSummary | null;
  rangeSummaries: DailySalesSummary[];
  selectedDate: string;
  loading: boolean;
  summaryLoading: boolean;
  /** Last completed sale for receipt display */
  lastCompletedSale: Sale | null;
}

const today = () => new Date().toISOString().split("T")[0];

const initialState: SalesState = {
  sales: [],
  draftSales: [],
  completedSales: [],
  todaySummary: null,
  rangeSummaries: [],
  selectedDate: today(),
  loading: false,
  summaryLoading: false,
  lastCompletedSale: null,
};

/** Fetch sales for a specific date */
export const fetchSalesByDate = createAsyncThunk(
  "sales/fetchByDate",
  async ({ shopId, date }: { shopId: string; date: string }) => {
    const sales = await fs.getSalesByDate(shopId, date);
    return { sales, date };
  }
);

/** Fetch today's sales */
export const fetchSales = createAsyncThunk(
  "sales/fetch",
  async (shopId: string) => {
    const dateStr = today();
    const sales = await fs.getSalesByDate(shopId, dateStr);
    return { sales, date: dateStr };
  }
);

export const fetchTodaySummary = createAsyncThunk(
  "sales/fetchTodaySummary",
  async (shopId: string) => {
    const dateStr = today();
    return await fs.getDailySummary(shopId, dateStr);
  }
);

export const fetchSummariesForRange = createAsyncThunk(
  "sales/fetchSummariesRange",
  async ({ shopId, startDate, endDate }: { shopId: string; startDate: string; endDate: string }) => {
    return await fs.getSummariesForRange(shopId, startDate, endDate);
  }
);

export const fetchSalesForRange = createAsyncThunk(
  "sales/fetchRange",
  async ({ shopId, startDate, endDate }: { shopId: string; startDate: string; endDate: string }) => {
    return await fs.getSalesForRange(shopId, startDate, endDate);
  }
);

/** Create a completed sale (atomic: sale + summary + stock) */
export const createSale = createAsyncThunk(
  "sales/create",
  async (data: Omit<Sale, "id"> & { profit?: number }) => {
    const profit = data.profit ?? (data.buyingPrice
      ? (data.totalPrice - data.buyingPrice * data.quantity)
      : Math.round(data.totalPrice * 0.3));
    const { profit: _p, ...saleData } = data;
    const id = await fs.addSaleWithSummary(saleData, profit);
    return {
      sale: { ...saleData, id, status: "completed" as const } as Sale,
      profit,
    };
  }
);

/** Create a draft sale (no stock/summary impact) */
export const createDraftSale = createAsyncThunk(
  "sales/createDraft",
  async (data: Omit<Sale, "id">) => {
    const id = await fs.addDraftSale(data);
    return { ...data, id, status: "draft" as const } as Sale;
  }
);

/** Confirm a draft sale (atomic: mark completed + stock + summary) */
export const confirmDraft = createAsyncThunk(
  "sales/confirmDraft",
  async ({ sale }: { sale: Sale }) => {
    const profit = sale.buyingPrice
      ? (sale.totalPrice - sale.buyingPrice * sale.quantity)
      : Math.round(sale.totalPrice * 0.3);
    await fs.confirmDraftSale(sale.shopId, sale.date, sale.id, profit);
    return { sale: { ...sale, status: "completed" as const }, profit };
  }
);

/** Delete a draft sale */
export const deleteDraft = createAsyncThunk(
  "sales/deleteDraft",
  async ({ shopId, date, saleId }: { shopId: string; date: string; saleId: string }) => {
    await fs.deleteDraftSale(shopId, date, saleId);
    return saleId;
  }
);

function splitSales(sales: Sale[]) {
  const drafts: Sale[] = [];
  const completed: Sale[] = [];
  for (const s of sales) {
    if (s.status === "draft") drafts.push(s);
    else completed.push(s);
  }
  return { drafts, completed };
}

const salesSlice = createSlice({
  name: "sales",
  initialState,
  reducers: {
    setSelectedDate(state, action) {
      state.selectedDate = action.payload;
    },
    clearLastCompletedSale(state) {
      state.lastCompletedSale = null;
    },
  },
  extraReducers: (builder) => {
    // fetchSales & fetchSalesByDate
    builder.addCase(fetchSales.pending, (s) => { s.loading = true; });
    builder.addCase(fetchSales.fulfilled, (s, a) => {
      s.loading = false;
      s.sales = a.payload.sales;
      const { drafts, completed } = splitSales(a.payload.sales);
      s.draftSales = drafts;
      s.completedSales = completed;
      s.selectedDate = a.payload.date;
    });
    builder.addCase(fetchSales.rejected, (s) => { s.loading = false; });

    builder.addCase(fetchSalesByDate.pending, (s) => { s.loading = true; });
    builder.addCase(fetchSalesByDate.fulfilled, (s, a) => {
      s.loading = false;
      s.sales = a.payload.sales;
      const { drafts, completed } = splitSales(a.payload.sales);
      s.draftSales = drafts;
      s.completedSales = completed;
      s.selectedDate = a.payload.date;
    });
    builder.addCase(fetchSalesByDate.rejected, (s) => { s.loading = false; });

    // Today summary
    builder.addCase(fetchTodaySummary.pending, (s) => { s.summaryLoading = true; });
    builder.addCase(fetchTodaySummary.fulfilled, (s, a) => {
      s.summaryLoading = false;
      s.todaySummary = a.payload;
    });
    builder.addCase(fetchTodaySummary.rejected, (s) => { s.summaryLoading = false; });

    // Range summaries
    builder.addCase(fetchSummariesForRange.fulfilled, (s, a) => {
      s.rangeSummaries = a.payload;
    });

    // Range sales
    builder.addCase(fetchSalesForRange.pending, (s) => { s.loading = true; });
    builder.addCase(fetchSalesForRange.fulfilled, (s, a) => {
      s.loading = false;
      s.sales = a.payload;
      const { drafts, completed } = splitSales(a.payload);
      s.draftSales = drafts;
      s.completedSales = completed;
    });
    builder.addCase(fetchSalesForRange.rejected, (s) => { s.loading = false; });

    // createSale — add to completed + update summary
    builder.addCase(createSale.fulfilled, (s, a) => {
      s.sales.unshift(a.payload.sale);
      s.completedSales.unshift(a.payload.sale);
      s.lastCompletedSale = a.payload.sale;
      if (s.todaySummary) {
        s.todaySummary.totalSales += a.payload.sale.totalPrice;
        s.todaySummary.transactions += 1;
        s.todaySummary.profit += a.payload.profit;
      } else {
        s.todaySummary = {
          date: a.payload.sale.date,
          totalSales: a.payload.sale.totalPrice,
          transactions: 1,
          profit: a.payload.profit,
        };
      }
    });

    // createDraftSale
    builder.addCase(createDraftSale.fulfilled, (s, a) => {
      s.sales.unshift(a.payload);
      s.draftSales.unshift(a.payload);
    });

    // confirmDraft
    builder.addCase(confirmDraft.fulfilled, (s, a) => {
      const { sale, profit } = a.payload;
      // Remove from drafts
      s.draftSales = s.draftSales.filter(d => d.id !== sale.id);
      // Add to completed
      s.completedSales.unshift(sale);
      s.lastCompletedSale = sale;
      // Update in sales array
      const idx = s.sales.findIndex(x => x.id === sale.id);
      if (idx >= 0) s.sales[idx] = sale;
      // Update summary
      if (s.todaySummary) {
        s.todaySummary.totalSales += sale.totalPrice;
        s.todaySummary.transactions += 1;
        s.todaySummary.profit += profit;
      } else {
        s.todaySummary = {
          date: sale.date,
          totalSales: sale.totalPrice,
          transactions: 1,
          profit,
        };
      }
    });

    // deleteDraft
    builder.addCase(deleteDraft.fulfilled, (s, a) => {
      s.draftSales = s.draftSales.filter(d => d.id !== a.payload);
      s.sales = s.sales.filter(x => x.id !== a.payload);
    });
  },
});

export const { setSelectedDate, clearLastCompletedSale } = salesSlice.actions;
export default salesSlice.reducer;
