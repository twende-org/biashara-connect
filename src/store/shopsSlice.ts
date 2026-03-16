import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import * as fs from "@/lib/firestore";
import type { Shop } from "@/types";

interface ShopsState {
  shops: Shop[];
  currentShopId: string | null;
  loading: boolean;
}

const initialState: ShopsState = {
  shops: [],
  currentShopId: null,
  loading: false,
};

export const fetchShops = createAsyncThunk("shops/fetch", async (ownerId: string) => {
  return await fs.getShops(ownerId);
});

export const createShop = createAsyncThunk("shops/create", async (data: Omit<Shop, "id">) => {
  const id = await fs.addShop(data);
  return { ...data, id } as Shop;
});

export const editShop = createAsyncThunk("shops/edit", async ({ id, data }: { id: string; data: Partial<Shop> }) => {
  await fs.updateShop(id, data);
  return { id, data };
});

export const removeShop = createAsyncThunk("shops/remove", async (id: string) => {
  await fs.deleteShop(id);
  return id;
});

const shopsSlice = createSlice({
  name: "shops",
  initialState,
  reducers: {
    setCurrentShop(state, action: PayloadAction<string>) {
      state.currentShopId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchShops.pending, (state) => { state.loading = true; });
    builder.addCase(fetchShops.fulfilled, (state, action) => {
      state.loading = false;
      state.shops = action.payload;
      if (!state.currentShopId && action.payload.length > 0) {
        state.currentShopId = action.payload[0].id;
      }
    });
    builder.addCase(fetchShops.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(createShop.fulfilled, (state, action) => {
      state.shops.push(action.payload);
      if (!state.currentShopId) state.currentShopId = action.payload.id;
    });
    builder.addCase(editShop.fulfilled, (state, action) => {
      const idx = state.shops.findIndex((s) => s.id === action.payload.id);
      if (idx !== -1) state.shops[idx] = { ...state.shops[idx], ...action.payload.data };
    });
    builder.addCase(removeShop.fulfilled, (state, action) => {
      state.shops = state.shops.filter((s) => s.id !== action.payload);
      if (state.currentShopId === action.payload) {
        state.currentShopId = state.shops[0]?.id || null;
      }
    });
  },
});

export const { setCurrentShop } = shopsSlice.actions;
export default shopsSlice.reducer;
