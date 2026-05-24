import { configureStore } from "@reduxjs/toolkit";
import menuReducer from "./slices/menuSlice";
import cartReducer from "./slices/cartSlice";
import ordersReducer from "./slices/ordersSlice";
import tablesReducer from "./slices/tablesSlice";
import staffReducer from "./slices/staffSlice";

const store = configureStore({
  reducer: {
    menu: menuReducer,
    cart: cartReducer,
    orders: ordersReducer,
    tables: tablesReducer,
    staff: staffReducer,
  },
});

export default store;
