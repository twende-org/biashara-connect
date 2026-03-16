import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import shopsReducer from "./shopsSlice";
import productsReducer from "./productsSlice";
import salesReducer from "./salesSlice";
import suppliersReducer from "./suppliersSlice";
import expensesReducer from "./expensesSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    shops: shopsReducer,
    products: productsReducer,
    sales: salesReducer,
    suppliers: suppliersReducer,
    expenses: expensesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
