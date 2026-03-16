import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as fs from "@/lib/firestore";
import type { Product } from "@/types";

interface ProductsState {
  products: Product[];
  loading: boolean;
}

const initialState: ProductsState = { products: [], loading: false };

export const fetchProducts = createAsyncThunk("products/fetch", async (shopId: string) => {
  return await fs.getProducts(shopId);
});

export const createProduct = createAsyncThunk("products/create", async (data: Omit<Product, "id">) => {
  const id = await fs.addProduct(data);
  return { ...data, id } as Product;
});

export const editProduct = createAsyncThunk("products/edit", async ({ id, data }: { id: string; data: Partial<Product> }) => {
  await fs.updateProduct(id, data);
  return { id, data };
});

export const removeProduct = createAsyncThunk("products/remove", async (id: string) => {
  await fs.deleteProduct(id);
  return id;
});

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProducts.pending, (state) => { state.loading = true; });
    builder.addCase(fetchProducts.fulfilled, (state, action) => { state.loading = false; state.products = action.payload; });
    builder.addCase(fetchProducts.rejected, (state) => { state.loading = false; });
    builder.addCase(createProduct.fulfilled, (state, action) => { state.products.push(action.payload); });
    builder.addCase(editProduct.fulfilled, (state, action) => {
      const idx = state.products.findIndex((p) => p.id === action.payload.id);
      if (idx !== -1) state.products[idx] = { ...state.products[idx], ...action.payload.data };
    });
    builder.addCase(removeProduct.fulfilled, (state, action) => {
      state.products = state.products.filter((p) => p.id !== action.payload);
    });
  },
});

export default productsSlice.reducer;
