import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import store from "./store";
import { ToastProvider } from "./context/ToastContext";
import { ThemeProvider } from "./context/ThemeContext";

import Index from "./pages/Index";

import WaiterLogin from "./pages/WaiterLogin";
import WaiterTables from "./pages/WaiterTables";
import WaiterMenu from "./pages/WaiterMenu";
import MyOrders from "./pages/MyOrders";

import ChefLogin from "./pages/ChefLogin";
import ChefKitchen from "./pages/ChefKitchen";

import AdminAuth from "./pages/AdminAuth";
import AdminDashboard from "./pages/AdminDashboard";
import AdminKitchen from "./pages/AdminKitchen";
import AdminTables from "./pages/AdminTables";
import AdminMenu from "./pages/AdminMenu";
import AdminStaff from "./pages/AdminStaff";

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              {}
              <Route path="/" element={<Index />} />

              {}
              <Route path="/waiter/login" element={<WaiterLogin />} />
              <Route path="/waiter/tables" element={<WaiterTables />} />
              <Route path="/waiter/menu" element={<WaiterMenu />} />
              <Route path="/waiter/orders" element={<MyOrders />} />

              {}
              <Route path="/chef/login" element={<ChefLogin />} />
              <Route path="/chef/kitchen" element={<ChefKitchen />} />

              {}
              <Route path="/admin/auth" element={<AdminAuth />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/kitchen" element={<AdminKitchen />} />
              <Route path="/admin/tables" element={<AdminTables />} />
              <Route path="/admin/menu" element={<AdminMenu />} />
              <Route path="/admin/staff" element={<AdminStaff />} />

              <Route path="*" element={<div className="min-h-screen flex items-center justify-center text-2xl font-bold">404</div>} />
            </Routes>
          </BrowserRouter>
          <ToastContainer position="top-right" autoClose={2500} hideProgressBar={false} closeOnClick pauseOnHover theme="light" />
        </ToastProvider>
      </ThemeProvider>
    </Provider>
  );
}
