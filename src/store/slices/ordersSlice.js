import { createSlice } from "@reduxjs/toolkit";

function loadOrders() {
  try {
    const saved = localStorage.getItem("fo_orders");
    return saved ? JSON.parse(saved) : { list: [], itemsMap: {}, notifications: [] };
  } catch { return { list: [], itemsMap: {}, notifications: [] }; }
}

function saveOrders(list, itemsMap, notifications) {
  localStorage.setItem("fo_orders", JSON.stringify({ list, itemsMap, notifications }));
}

const saved = loadOrders();

const ordersSlice = createSlice({
  name: "orders",
  initialState: { list: saved.list, itemsMap: saved.itemsMap, notifications: saved.notifications || [] },
  reducers: {
    placeOrder: (state, action) => {
      const { tableNumber, cart, notes, total, customer, waiter, orderType } = action.payload;
      const order = {
        id: Date.now(),
        table_number: tableNumber,
        total_price: total,
        notes,
        customer,
        waiter: waiter || null,
        order_type: orderType || "dine_in",
        status: "received",
        created_at: new Date().toISOString(),
      };
      const items = cart.map((i, idx) => ({
        id: Date.now() + idx,
        order_id: order.id,
        quantity: i.qty,
        item_price: i.price,
        menu_items: { name: i.name, image_url: i.image_url },
      }));
      state.list.unshift(order);
      state.itemsMap[order.id] = items;
      saveOrders(state.list, state.itemsMap, state.notifications);
    },
    updateOrderStatus: (state, action) => {
      const { orderId, status } = action.payload;
      const order = state.list.find((o) => o.id === orderId);
      if (order) order.status = status;
      saveOrders(state.list, state.itemsMap, state.notifications);
    },
    completeOrder: (state, action) => {
      const { orderId } = action.payload;
      const order = state.list.find((o) => o.id === orderId);
      if (order) {
        order.status = "tugallangan";
        state.notifications.push({
          id: Date.now(),
          orderId,
          table_number: order.table_number,
          message: `${order.table_number}-stol buyurtmasi tayyor va yetkazildi! 🎉`,
          created_at: new Date().toISOString(),
          read: false,
        });
      }
      saveOrders(state.list, state.itemsMap, state.notifications);
    },
    markNotificationRead: (state, action) => {
      const notif = state.notifications.find((n) => n.id === action.payload);
      if (notif) notif.read = true;
      saveOrders(state.list, state.itemsMap, state.notifications);
    },
  },
});

export const { placeOrder, updateOrderStatus, completeOrder, markNotificationRead } = ordersSlice.actions;
export default ordersSlice.reducer;
