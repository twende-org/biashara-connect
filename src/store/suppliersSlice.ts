import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as fs from "@/lib/firestore";
import type { Supplier } from "@/types";

interface SuppliersState {
  suppliers: Supplier[];
  loading: boolean;
}

const initialState: SuppliersState = { suppliers: [], loading: false };

export const fetchSuppliers = createAsyncThunk("suppliers/fetch", async (ownerId: string) => {
  return await fs.getSuppliers(ownerId);
});

export const createSupplier = createAsyncThunk("suppliers/create", async (data: Omit<Supplier, "id">) => {
  const id = await fs.addSupplier(data);
  return { ...data, id } as Supplier;
});

export const editSupplier = createAsyncThunk("suppliers/edit", async ({ id, data }: { id: string; data: Partial<Supplier> }) => {
  await fs.updateSupplier(id, data);
  return { id, data };
});

export const removeSupplier = createAsyncThunk("suppliers/remove", async (id: string) => {
  await fs.deleteSupplier(id);
  return id;
});

const suppliersSlice = createSlice({
  name: "suppliers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchSuppliers.pending, (state) => { state.loading = true; });
    builder.addCase(fetchSuppliers.fulfilled, (state, action) => { state.loading = false; state.suppliers = action.payload; });
    builder.addCase(fetchSuppliers.rejected, (state) => { state.loading = false; });
    builder.addCase(createSupplier.fulfilled, (state, action) => { state.suppliers.push(action.payload); });
    builder.addCase(editSupplier.fulfilled, (state, action) => {
      const idx = state.suppliers.findIndex((s) => s.id === action.payload.id);
      if (idx !== -1) state.suppliers[idx] = { ...state.suppliers[idx], ...action.payload.data };
    });
    builder.addCase(removeSupplier.fulfilled, (state, action) => {
      state.suppliers = state.suppliers.filter((s) => s.id !== action.payload);
    });
  },
});

export default suppliersSlice.reducer;
