import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as fs from "@/lib/firestore";
import type { Sale, DailySalesSummary } from "@/types";

interface SalesState {
  /** Sales for the currently viewed date */
  sales: Sale[];
  /** Today's summary (single doc read for dashboard) */
  todaySummary: DailySalesSummary | null;
  /** Summaries for a date range (for charts / reports) */
  rangeSummaries: DailySalesSummary[];
  /** Currently selected date for viewing sales */
  selectedDate: string;
  loading: boolean;
  summaryLoading: boolean;
}

const today = () => new Date().toISOString().split("T")[0];

const initialState: SalesState = {
  sales: [],
  todaySummary: null,
  rangeSummaries: [],
  selectedDate: today(),
  loading: false,
  summaryLoading: false,
};

/** Fetch sales for a specific date */
export const fetchSalesByDate = createAsyncThunk(
  "sales/fetchByDate",
  async ({ shopId, date }: { shopId: string; date: string }) => {
    const sales = await fs.getSalesByDate(shopId, date);
    return { sales, date };
  }
);

/** Fetch today's sales (convenience) */
export const fetchSales = createAsyncThunk(
  "sales/fetch",
  async (shopId: string) => {
    const dateStr = today();
    const sales = await fs.getSalesByDate(shopId, dateStr);
    return { sales, date: dateStr };
  }
);

/** Fetch daily summary only (single doc read — for dashboard) */
export const fetchTodaySummary = createAsyncThunk(
  "sales/fetchTodaySummary",
  async (shopId: string) => {
    const dateStr = today();
    return await fs.getDailySummary(shopId, dateStr);
  }
);

/** Fetch summaries for a date range (for weekly/monthly charts) */
export const fetchSummariesForRange = createAsyncThunk(
  "sales/fetchSummariesRange",
  async ({ shopId, startDate, endDate }: { shopId: string; startDate: string; endDate: string }) => {
    return await fs.getSummariesForRange(shopId, startDate, endDate);
  }
);

/** Fetch sales for a date range (detailed records) */
export const fetchSalesForRange = createAsyncThunk(
  "sales/fetchRange",
  async ({ shopId, startDate, endDate }: { shopId: string; startDate: string; endDate: string }) => {
    return await fs.getSalesForRange(shopId, startDate, endDate);
  }
);

/** Create a sale — atomically writes sale + updates daily summary */
export const createSale = createAsyncThunk(
  "sales/create",
  async (data: Omit<Sale, "id"> & { profit?: number }) => {
    const profit = data.profit ?? (data.buyingPrice
      ? (data.totalPrice - data.buyingPrice * data.quantity)
      : Math.round(data.totalPrice * 0.3));
    const { profit: _p, ...saleData } = data;
    const id = await fs.addSaleWithSummary(saleData, profit);
    return {
      sale: { ...saleData, id } as Sale,
      profit,
    };
  }
);

const salesSlice = createSlice({
  name: "sales",
  initialState,
  reducers: {
    setSelectedDate(state, action) {
      state.selectedDate = action.payload;
    },
  },
  extraReducers: (builder) => {
    // fetchSales & fetchSalesByDate
    builder.addCase(fetchSales.pending, (s) => { s.loading = true; });
    builder.addCase(fetchSales.fulfilled, (s, a) => {
      s.loading = false;
      s.sales = a.payload.sales;
      s.selectedDate = a.payload.date;
    });
    builder.addCase(fetchSales.rejected, (s) => {
      s.loading = false;
    });
    builder.addCase(fetchSalesByDate.pending, (s) => { s.loading = true; });
    builder.addCase(fetchSalesByDate.fulfilled, (s, a) => {
      s.loading = false;
      s.sales = a.payload.sales;
      s.selectedDate = a.payload.date;
    });
    builder.addCase(fetchSalesByDate.rejected, (s) => {
      s.loading = false;
    });

    // Today summary
    builder.addCase(fetchTodaySummary.pending, (s) => { s.summaryLoading = true; });
    builder.addCase(fetchTodaySummary.fulfilled, (s, a) => {
      s.summaryLoading = false;
      s.todaySummary = a.payload;
    });
    builder.addCase(fetchTodaySummary.rejected, (s) => {
      s.summaryLoading = false;
    });

    // Range summaries
    builder.addCase(fetchSummariesForRange.fulfilled, (s, a) => {
      s.rangeSummaries = a.payload;
    });

    // Range sales
    builder.addCase(fetchSalesForRange.pending, (s) => { s.loading = true; });
    builder.addCase(fetchSalesForRange.fulfilled, (s, a) => {
      s.loading = false;
      s.sales = a.payload;
    });
    builder.addCase(fetchSalesForRange.rejected, (s) => {
      s.loading = false;
    });

    // createSale — optimistically add to list and update local summary
    builder.addCase(createSale.fulfilled, (s, a) => {
      s.sales.unshift(a.payload.sale);
      // Update local today summary
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
  },
});

export const { setSelectedDate } = salesSlice.actions;
export default salesSlice.reducer;
