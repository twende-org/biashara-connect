import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as fs from "@/lib/firestore";
import type { Expense } from "@/types";

interface ExpensesState {
  expenses: Expense[];
  loading: boolean;
}

const initialState: ExpensesState = { expenses: [], loading: false };

export const fetchExpenses = createAsyncThunk("expenses/fetch", async (shopId: string) => {
  return await fs.getExpenses(shopId);
});

export const createExpense = createAsyncThunk("expenses/create", async (data: Omit<Expense, "id">) => {
  const id = await fs.addExpense(data);
  return { ...data, id } as Expense;
});

export const editExpense = createAsyncThunk("expenses/edit", async ({ id, data }: { id: string; data: Partial<Expense> }) => {
  await fs.updateExpense(id, data);
  return { id, data };
});

export const removeExpense = createAsyncThunk("expenses/remove", async (id: string) => {
  await fs.deleteExpense(id);
  return id;
});

const expensesSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchExpenses.pending, (state) => { state.loading = true; });
    builder.addCase(fetchExpenses.fulfilled, (state, action) => { state.loading = false; state.expenses = action.payload; });
    builder.addCase(fetchExpenses.rejected, (state) => { state.loading = false; });
    builder.addCase(createExpense.fulfilled, (state, action) => { state.expenses.unshift(action.payload); });
    builder.addCase(editExpense.fulfilled, (state, action) => {
      const idx = state.expenses.findIndex(e => e.id === action.payload.id);
      if (idx >= 0) state.expenses[idx] = { ...state.expenses[idx], ...action.payload.data };
    });
    builder.addCase(removeExpense.fulfilled, (state, action) => {
      state.expenses = state.expenses.filter(e => e.id !== action.payload);
    });
  },
});

export default expensesSlice.reducer;
