import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [], notes: "" },
  reducers: {
    addToCart: (state, action) => {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) { existing.qty += 1; }
      else { state.items.push({ ...action.payload, qty: 1 }); }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    updateQty: (state, action) => {
      const { id, delta } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item) {
        item.qty += delta;
        if (item.qty <= 0) state.items = state.items.filter((i) => i.id !== id);
      }
    },
    setNotes: (state, action) => { state.notes = action.payload; },
    clearCart: (state) => { state.items = []; state.notes = ""; },
  },
});

export const { addToCart, removeFromCart, updateQty, setNotes, clearCart } = cartSlice.actions;
export const selectCartTotal = (state) => state.cart.items.reduce((sum, i) => sum + i.price * i.qty, 0);
export const selectCartCount = (state) => state.cart.items.reduce((sum, i) => sum + i.qty, 0);
export default cartSlice.reducer;
