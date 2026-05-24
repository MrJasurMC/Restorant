import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateOrderStatus, completeOrder } from "../store/slices/ordersSlice";
import { useToast } from "../context/ToastContext";
import { useTheme } from "../context/ThemeContext";
import { useEffect } from "react";
import { FiLogOut, FiGrid, FiList, FiCheck, FiSun, FiMoon } from "react-icons/fi";

const STATUS_STYLE = {
  received:  { label: "Qabul qilindi",  bg: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  preparing: { label: "Tayyorlanmoqda", bg: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  ready:     { label: "Tayyor",         bg: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  delivered: { label: "Yetkazildi",     bg: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400" },
};

function timeSince(dateStr) {
  const mins = Math.floor((Date.now() - new Date(dateStr)) / 60000);
  if (mins < 1) return "Hozir";
  if (mins < 60) return `${mins} daq oldin`;
  return `${Math.floor(mins / 60)} soat oldin`;
}

function formatUZS(amount) {
  return amount.toLocaleString("uz-UZ") + " UZS";
}

export default function AdminKitchen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { dark, toggle } = useTheme();
  const { list: orders = [], itemsMap = {} } = useSelector((state) => state.orders);

  useEffect(() => {
    if (!localStorage.getItem("admin_logged_in")) navigate("/admin/auth");
  }, []);

  function handleStatusChange(orderId, status) {
    dispatch(updateOrderStatus({ orderId, status }));
    showToast("Status yangilandi ✓");
  }

  function handleComplete(orderId) {
    dispatch(completeOrder({ orderId }));
    showToast("Buyurtma tugallandi! ");
  }

  function handleLogout() {
    localStorage.removeItem("admin_logged_in");
    navigate("/");
  }

  const active = orders.filter(o => o.status !== "delivered" && o.status !== "tugallangan");
  const done = orders.filter(o => o.status === "tugallangan");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Oshxona Paneli</h1>
            <p className="text-sm text-gray-400">{active.length} ta aktiv · {done.length} ta tugallangan</p>
          </div>
          <div className="flex gap-2 flex-wrap justify-end">
            <button onClick={toggle} className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800">
              {dark ? <FiSun size={16}/> : <FiMoon size={16}/>}
            </button>
            <button onClick={() => navigate("/admin/dashboard")} className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-1">Dashboard</button>
            <button onClick={() => navigate("/admin/menu")} className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-1"><FiList size={14}/> Menyu</button>
            <button onClick={() => navigate("/admin/tables")} className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-1"><FiGrid size={14}/> Stollar</button>
            <button onClick={handleLogout} className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-1"><FiLogOut size={14}/> Chiqish</button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {active.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4 flex justify-center"><FiCheck className="text-green-400" size={56}/></div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-white">Hozircha aktiv buyurtma yo'q</h3>
            <p className="text-gray-400 mt-1">Mijozlar buyurtma berganida shu yerda ko'rinadi</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {active.map((order) => {
              const s = STATUS_STYLE[order.status] || STATUS_STYLE.received;
              const items = itemsMap[order.id] || [];
              return (
                <div key={order.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-50 dark:border-gray-800 flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{order.table_number}-stol</h3>
                      <p className="text-xs text-gray-400 mt-0.5">{new Date(order.created_at).toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" })} · {timeSince(order.created_at)}</p>
                      {order.customer && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">👤 {order.customer.name} · {order.customer.people} kishi</p>}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${s.bg}`}>{s.label}</span>
                  </div>
                  <div className="px-5 py-3 space-y-2 max-h-48 overflow-y-auto">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2 text-sm">
                        <span className="font-medium text-gray-800 dark:text-white">{item.quantity}× {item.menu_items?.name}</span>
                        <span className="text-gray-500 font-semibold">{formatUZS(item.item_price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  {order.notes && <div className="mx-5 mb-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-900/30 rounded-xl px-3 py-2 text-xs text-yellow-700 dark:text-yellow-400">{order.notes}</div>}
                  <div className="px-5 pb-5">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Jami</span>
                      <span className="font-bold text-orange-500 text-lg">{formatUZS(order.total_price)}</span>
                    </div>
                    <select value={order.status} onChange={(e) => handleStatusChange(order.id, e.target.value)} className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-300 mb-2">
                      {Object.entries(STATUS_STYLE).map(([val, { label }]) => <option key={val} value={val}>{label}</option>)}
                    </select>
                    {order.status === "ready" && (
                      <button
                        onClick={() => handleComplete(order.id)}
                        className="w-full bg-green-500 hover:bg-green-600 text-white rounded-xl py-2.5 text-sm font-bold flex items-center justify-center gap-2 transition-colors"
                      >
                        <FiCheck size={16}/> Tayyor — Tugallanganlar
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {}
        {done.length > 0 && (
          <div className="mt-12">
            <h2 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
              <FiCheck className="text-green-500" size={20}/> Tugallanganlar ({done.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {done.map((order) => {
                const items = itemsMap[order.id] || [];
                return (
                  <div key={order.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-green-100 dark:border-green-900/30 overflow-hidden opacity-75">
                    <div className="px-5 py-3 flex justify-between items-center border-b border-gray-50 dark:border-gray-800">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{order.table_number}-stol</h3>
                        <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" })}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 flex items-center gap-1">
                        <FiCheck size={10}/> Tugallandi
                      </span>
                    </div>
                    <div className="px-5 py-3 space-y-1.5">
                      {items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                          <span>{item.quantity}× {item.menu_items?.name}</span>
                          <span>{formatUZS(item.item_price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="px-5 pb-3 flex justify-between items-center">
                      <span className="text-sm text-gray-400">Jami</span>
                      <span className="font-bold text-orange-500">{formatUZS(order.total_price)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
