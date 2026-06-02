import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTheme } from "../context/ThemeContext";
import { FiLogOut, FiSun, FiMoon, FiList, FiGrid, FiUsers, FiShoppingBag, FiUser, FiCoffee, FiTrendingUp } from "react-icons/fi";

function formatUZS(n) { return n.toLocaleString("uz-UZ") + " UZS"; }

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { dark, toggle } = useTheme();
  const { list: orders = [], itemsMap = {} } = useSelector(s => s.orders);
  const staff = useSelector(s => s.staff.list);
  const [view, setView] = useState("overview");

  useEffect(() => {
    if (!localStorage.getItem("admin_logged_in")) navigate("/admin/auth");
  }, []);

  function logout() {
    localStorage.removeItem("admin_logged_in");
    navigate("/");
  }

  const totalOrders = orders.length;
  const activeOrders = orders.filter(o => o.status !== "tugallangan" && o.status !== "delivered").length;
  const totalRevenue = orders.filter(o => o.status === "tugallangan").reduce((sum, o) => sum + o.total_price, 0);
  const waiters = staff.filter(s => s.role === "waiter");
  const chefs = staff.filter(s => s.role === "chef");

  const waiterStats = waiters.map(w => {
    const myOrders = orders.filter(o => o.waiter?.id === w.id);
    const revenue = myOrders.filter(o => o.status === "tugallangan").reduce((sum, o) => sum + o.total_price, 0);
    return { ...w, orderCount: myOrders.length, revenue };
  }).sort((a, b) => b.orderCount - a.orderCount);

  const STATUS_COLOR = {
    received:     "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    preparing:    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    ready:        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    delivered:    "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
    finished:  "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  };
  const STATUS_LABEL = { received: "Yangi", preparing: "Tayyorlanmoqda", ready: "Tayyor", delivered: "Yetkazildi", finished: "Tugallandi" };

  const ORDER_TYPE_BADGE = {
    dine_in:  "bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
    takeaway: "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Paneli</h1>
            <p className="text-sm text-gray-400">{activeOrders} ta aktiv buyurtma · {totalOrders} ta jami</p>
          </div>
          <div className="flex gap-2 flex-wrap justify-end">
            <button onClick={toggle} className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800">
              {dark ? <FiSun size={16} /> : <FiMoon size={16} />}
            </button>
            <button onClick={() => navigate("/admin/menu")} className="hidden sm:flex items-center gap-1 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"><FiList size={14}/> Menyu</button>
            <button onClick={() => navigate("/admin/tables")} className="hidden sm:flex items-center gap-1 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"><FiGrid size={14}/> Stollar</button>
            <button onClick={() => navigate("/admin/staff")} className="flex items-center gap-1 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"><FiUsers size={14}/> Xodimlar</button>
            <button onClick={logout} className="flex items-center gap-1 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"><FiLogOut size={14}/> Chiqish</button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: <FiShoppingBag size={22}/>, num: activeOrders, label: "Aktiv Buyurtmalar", color: "text-blue-500" },
            { icon: <FiTrendingUp size={22}/>, num: formatUZS(totalRevenue), label: "Daromad (tugallangan)", color: "text-green-500" },
            { icon: <FiUser size={22}/>, num: waiters.length, label: "Ofitsantlar", color: "text-orange-500" },
            { icon: <FiCoffee size={22}/>, num: chefs.length, label: "Oshpazlar", color: "text-purple-500" },
          ].map(s => (
            <div key={s.label} className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
              <div className={`${s.color} mb-2`}>{s.icon}</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white truncate">{s.num}</div>
              <div className="text-sm text-gray-400 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-800 flex items-center gap-2">
            <FiUser className="text-orange-500" size={18} />
            <h2 className="font-bold text-gray-900 dark:text-white">Ofitsant Samaradorligi</h2>
          </div>
          {waiterStats.length === 0 ? (
            <p className="px-6 py-8 text-gray-400 text-sm">Hozircha ofitsant yo'q. <button onClick={() => navigate("/admin/staff")} className="text-orange-500 underline">Xodim qo'shish</button></p>
          ) : (
            <div className="divide-y divide-gray-50 dark:divide-gray-800">
              {waiterStats.map((w, i) => (
                <div key={w.id} className="px-6 py-4 flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-500 font-bold text-sm flex-shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white truncate">{w.name}</p>
                    <p className="text-xs text-gray-400">PIN: {w.pin} · {w.active ? <span className="text-green-500">Faol</span> : <span className="text-red-400">Nofaol</span>}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-gray-900 dark:text-white">{w.orderCount} ta buyurtma</p>
                    <p className="text-xs text-green-500">{formatUZS(w.revenue)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-800 flex items-center gap-2">
            <FiShoppingBag className="text-blue-500" size={18} />
            <h2 className="font-bold text-gray-900 dark:text-white">Barcha Buyurtmalar</h2>
            <span className="ml-auto text-sm text-gray-400">{orders.length} ta jami</span>
          </div>
          {orders.length === 0 ? (
            <p className="px-6 py-8 text-gray-400 text-sm text-center">Hozircha buyurtmalar yo'q.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/50">
                    <th className="px-5 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Stol</th>
                    <th className="px-5 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Turi</th>
                    <th className="px-5 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Ofitsant</th>
                    <th className="px-5 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Taomlar</th>
                    <th className="px-5 py-3 text-right font-medium text-gray-500 dark:text-gray-400">Jami</th>
                    <th className="px-5 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Holat</th>
                    <th className="px-5 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Vaqt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                  {orders.map(o => {
                    const items = itemsMap[o.id] || [];
                    const ot = o.order_type || "dine_in";
                    return (
                      <tr key={o.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="px-5 py-3 font-bold text-gray-900 dark:text-white">#{o.table_number}</td>
                        <td className="px-5 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ORDER_TYPE_BADGE[ot] || ORDER_TYPE_BADGE.dine_in}`}>
                            {ot === "takeaway" ? " Olib ket" : "Restoranda"}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-gray-600 dark:text-gray-400">{o.waiter?.name || "—"}</td>
                        <td className="px-5 py-3 text-gray-500 dark:text-gray-400">
                          {items.slice(0, 2).map(i => `${i.quantity}× ${i.menu_items?.name}`).join(", ")}
                          {items.length > 2 && <span className="text-gray-400"> +{items.length - 2} ta ko'proq</span>}
                        </td>
                        <td className="px-5 py-3 text-right font-bold text-orange-500">{formatUZS(o.total_price)}</td>
                        <td className="px-5 py-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLOR[o.status] || STATUS_COLOR.received}`}>
                            {STATUS_LABEL[o.status] || o.status}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-gray-400 whitespace-nowrap">
                          {new Date(o.created_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}