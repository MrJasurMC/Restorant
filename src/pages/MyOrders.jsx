import { useSearchParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { markNotificationRead } from "../store/slices/ordersSlice";
import { FiArrowLeft, FiClock, FiCheckCircle, FiPackage, FiTruck, FiBell, FiCheck } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";

const STATUS = {
  received:    { label: "Qabul qilindi",  color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",       icon: <FiClock size={14} /> },
  preparing:   { label: "Tayyorlanmoqda", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400", icon: <FiPackage size={14} /> },
  ready:       { label: "Tayyor!",        color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",    icon: <FiCheckCircle size={14} /> },
  delivered:   { label: "Yetkazildi",     color: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",           icon: <FiTruck size={14} /> },
  tugallangan: { label: "Tugallandi",     color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",    icon: <FiCheck size={14} /> },
};

function formatUZS(amount) {
  return amount.toLocaleString("uz-UZ") + " UZS";
}

export default function MyOrders() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { dark } = useTheme();
  const tableNumber = parseInt(searchParams.get("table") || "1");
  const { list, itemsMap, notifications = [] } = useSelector((state) => state.orders);
  const orders = list.filter((o) => o.table_number === tableNumber);
  const myNotifs = notifications.filter((n) => n.table_number === tableNumber);
  const unreadNotifs = myNotifs.filter((n) => !n.read);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <button onClick={() => navigate(`/waiter/menu?table=${tableNumber}`)} className="text-sm text-gray-500 dark:text-gray-400 hover:text-orange-500 mb-2 flex items-center gap-1">
            <FiArrowLeft size={14} /> Menyuga qaytish
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mening buyurtmalarim</h1>
              <p className="text-sm text-gray-400">{tableNumber}-stol</p>
            </div>
            {unreadNotifs.length > 0 && (
              <div className="flex items-center gap-1 bg-green-500 text-white px-3 py-1.5 rounded-full text-sm font-bold animate-pulse">
                <FiBell size={14} /> {unreadNotifs.length} yangi
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {unreadNotifs.length > 0 && (
          <div className="space-y-2">
            {unreadNotifs.map((notif) => (
              <div key={notif.id} className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FiBell className="text-green-500" size={20} />
                  <div>
                    <p className="font-semibold text-green-800 dark:text-green-300 text-sm">{notif.message}</p>
                    <p className="text-xs text-green-600 dark:text-green-500 mt-0.5">{new Date(notif.created_at).toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" })}</p>
                  </div>
                </div>
                <button onClick={() => dispatch(markNotificationRead(notif.id))} className="text-xs text-green-600 dark:text-green-400 border border-green-300 dark:border-green-700 rounded-lg px-3 py-1.5 hover:bg-green-100 dark:hover:bg-green-900/40 font-medium">
                  <FiCheck size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiPackage className="text-gray-300 dark:text-gray-600" size={28} />
            </div>
            <p className="text-gray-400 dark:text-gray-600 mb-4">Hozircha buyurtmalar yo'q</p>
            <button onClick={() => navigate(`/waiter/menu?table=${tableNumber}`)} className="bg-orange-500 text-white px-6 py-2 rounded-xl font-semibold hover:bg-orange-600 transition-colors">
              Menyu ko'rish
            </button>
          </div>
        ) : orders.map((order) => {
          const s = STATUS[order.status] || STATUS.received;
          const items = itemsMap[order.id] || [];
          const time = new Date(order.created_at).toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" });
          return (
            <div key={order.id} className={`bg-white dark:bg-gray-900 rounded-2xl border overflow-hidden ${order.status === "tugallangan" ? "border-green-200 dark:border-green-900/40" : "border-gray-100 dark:border-gray-800"}`}>
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${s.color}`}>
                    {s.icon} {s.label}
                  </span>
                  <span className="text-sm text-gray-400">{time}</span>
                </div>
                <span className="text-xl font-bold text-orange-500">{formatUZS(order.total_price)}</span>
              </div>
              {order.customer && (
                <div className="px-5 pt-3 pb-2 flex gap-4 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50">
                  <span>{order.customer.name}</span>
                  <span>{order.customer.phone}</span>
                  <span>{order.customer.people} kishi</span>
                </div>
              )}
              <div className="px-5 py-3 space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img src={item.menu_items?.image_url} alt={item.menu_items?.name} className="w-12 h-12 rounded-xl object-cover bg-gray-100" onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100"; }} />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 dark:text-white text-sm">{item.menu_items?.name}</p>
                      <p className="text-xs text-gray-400">{item.quantity} x {formatUZS(item.item_price)}</p>
                    </div>
                    <span className="font-bold text-gray-700 dark:text-gray-300 text-sm">{formatUZS(item.quantity * item.item_price)}</span>
                  </div>
                ))}
                {order.notes && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-900/40 rounded-xl px-3 py-2 text-sm text-yellow-700 dark:text-yellow-400">
                    {order.notes}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )
}