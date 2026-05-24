import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart, updateQty, setNotes, clearCart, selectCartTotal, selectCartCount } from "../store/slices/cartSlice";
import { placeOrder } from "../store/slices/ordersSlice";
import { useToast } from "../context/ToastContext";
import { useTheme } from "../context/ThemeContext";
import { FiShoppingCart, FiArrowLeft, FiClipboard, FiTrash2, FiPlus, FiMinus, FiSun, FiMoon, FiX, FiUser, FiPhone, FiLock } from "react-icons/fi";

const CATEGORIES = {
  main_dishes: "Asosiy taomlar",
  salads: "Salatlar",
  desserts: "Desertlar",
  drinks: "Ichimliklar",
};

export default function WaiterMenu() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const waiterSession = (() => { try { return JSON.parse(sessionStorage.getItem("waiter_session")); } catch { return null; } })();
  useEffect(() => { if (!waiterSession) navigate("/waiter/login"); }, []);
  const { showToast } = useToast();
  const { dark, toggle } = useTheme();

  const tableNumber = parseInt(searchParams.get("table") || "1");
  const [category, setCategory] = useState("main_dishes");
  const [cartOpen, setCartOpen] = useState(false);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [customer, setCustomer] = useState({ name: "", phone: "", people: "1" });
  const [orderType, setOrderType] = useState("dine_in");

  const menuItems = useSelector((state) => state.menu.items.filter(i => i.available));
  const { items: cartItems = [], notes } = useSelector((state) => state.cart);
  const total = useSelector(selectCartTotal);
  const cartCount = useSelector(selectCartCount);

  const tables = useSelector((state) => state.tables.list);
  const currentTable = tables.find((t) => t.table_number === tableNumber);
  const isTableLocked = currentTable && !currentTable.is_active;

  function handleAddToCart(item) {
    if (isTableLocked) return showToast("Stol yopilgan!", "error");
    dispatch(addToCart(item));
    showToast(`${item.name} savatchaga qo'shildi 🛒`);
  }

  function handleCheckout() {
    if (cartItems.length === 0) return showToast("Savatcha bo'sh!", "error");
    if (isTableLocked) return showToast("Stol yopilgan!", "error");
    setCartOpen(false);
    setShowCustomerForm(true);
  }

  function handlePlaceOrder(e) {
    e.preventDefault();
    if (!customer.name.trim()) return showToast("Ismingizni kiriting!", "error");
    if (!customer.phone.trim()) return showToast("Telefon raqamingizni kiriting!", "error");
    dispatch(placeOrder({ tableNumber, cart: cartItems, notes, total, customer, waiter: waiterSession, orderType }));
    dispatch(clearCart());
    setShowCustomerForm(false);
    setCustomer({ name: "", phone: "", people: "1" });
    showToast("Buyurtma qabul qilindi!");
    setTimeout(() => navigate(`/my-orders?table=${tableNumber}`), 800);
  }

  const filtered = menuItems.filter((i) => i.category === category);

  if (isTableLocked) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <div className="text-center max-w-sm w-full">
          <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-gray-700">
            <FiLock size={40} className="text-orange-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">{tableNumber}-stol yopildi</h1>
          <p className="text-gray-400 mb-8 text-sm leading-relaxed">
            Bu stol admin tomonidan yopildi.<br />
            Iltimos, xodimga murojaat qiling yoki boshqa stolni tanlang.
          </p>
          <button
            onClick={() => navigate("/waiter/tables")}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <FiArrowLeft size={16} /> Boshqa stol tanlash
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">

      {}
      {showCustomerForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Buyurtmachi ma'lumotlari</h3>
              <button onClick={() => setShowCustomerForm(false)} className="text-gray-400 hover:text-gray-600"><FiX size={20} /></button>
            </div>

            {}
            <div className="bg-orange-50 dark:bg-gray-800 rounded-xl p-4 mb-5">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Buyurtma xulosasi:</p>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>{item.name} x{item.qty}</span>
                    <span className="font-semibold">{`${(item.price * item.qty).toLocaleString("uz-UZ")} UZS`}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-orange-200 dark:border-gray-700 mt-2 pt-2 flex justify-between font-bold text-orange-500">
                <span>Jami:</span>
                <span>{`${total.toLocaleString("uz-UZ")} UZS`}</span>
              </div>
            </div>

            <form onSubmit={handlePlaceOrder} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <FiUser className="inline mr-1" />Ismingiz *
                </label>
                <input
                  value={customer.name}
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  placeholder="Ism Familiya"
                  className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <FiPhone className="inline mr-1" />Telefon *
                </label>
                <input
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  placeholder="+998 ** *** ** **"
                  className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Necha kishi?
                </label>
                <select
                  value={customer.people}
                  onChange={(e) => setCustomer({ ...customer, people: e.target.value })}
                  className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-300"
                >
                  {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n} kishi</option>)}
                </select>
              </div>
              {}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Order Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => setOrderType("dine_in")} className={`py-2.5 rounded-xl text-sm font-semibold border-2 transition-colors ${orderType === "dine_in" ? "border-orange-400 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400" : "border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400"}`}>
                    Dine In
                  </button>
                  <button type="button" onClick={() => setOrderType("takeaway")} className={`py-2.5 rounded-xl text-sm font-semibold border-2 transition-colors ${orderType === "takeaway" ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" : "border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400"}`}>
                    Takeaway
                  </button>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowCustomerForm(false)} className="flex-1 border border-gray-200 dark:border-gray-700 rounded-xl py-3 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800">
                  Bekor
                </button>
                <button type="submit" className="flex-1 bg-orange-500 hover:bg-orange-600 text-white rounded-xl py-3 text-sm font-bold transition-colors">
                  Buyurtma berish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {}
      {cartOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="flex-1 bg-black/40" onClick={() => setCartOpen(false)} />
          <div className="w-full max-w-sm bg-white dark:bg-gray-900 flex flex-col h-full shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b dark:border-gray-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Savatcha</h2>
              <button onClick={() => setCartOpen(false)} className="text-gray-400 hover:text-gray-600"><FiX size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {cartItems.length === 0 ? (
                <p className="text-gray-400 text-center py-10">Savatcha bo'sh</p>
              ) : cartItems.map((item) => (
                <div key={item.id} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-gray-800 dark:text-white text-sm">{item.name}</span>
                    <button onClick={() => dispatch(removeFromCart(item.id))} className="text-gray-300 hover:text-red-400 ml-2"><FiTrash2 size={14} /></button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button onClick={() => dispatch(updateQty({ id: item.id, delta: -1 }))} className="w-7 h-7 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400"><FiMinus size={12} /></button>
                      <span className="font-bold w-5 text-center text-gray-900 dark:text-white">{item.qty}</span>
                      <button onClick={() => dispatch(updateQty({ id: item.id, delta: 1 }))} className="w-7 h-7 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400"><FiPlus size={12} /></button>
                    </div>
                    <span className="font-bold text-orange-500">{`${(item.price * item.qty).toLocaleString("uz-UZ")} UZS`}</span>
                  </div>
                </div>
              ))}
              {cartItems.length > 0 && (
                <div className="mt-4">
                  <label className="text-sm text-gray-500 dark:text-gray-400 block mb-1">Izoh (ixtiyoriy)</label>
                  <textarea rows={3} value={notes} onChange={(e) => dispatch(setNotes(e.target.value))} placeholder="Maxsus xohishlar..." className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                </div>
              )}
            </div>
            {cartItems.length > 0 && (
              <div className="p-5 border-t dark:border-gray-800">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-500 dark:text-gray-400">Jami:</span>
                  <span className="text-2xl font-bold text-orange-500">{`${total.toLocaleString("uz-UZ")} UZS`}</span>
                </div>
                <button onClick={handleCheckout} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors">
                  Davom etish →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {}
      <div className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => navigate("/waiter/tables")} className="text-sm text-gray-500 dark:text-gray-400 hover:text-orange-500 flex items-center gap-1"><FiArrowLeft size={14} /> Stollar</button>
            <div className="flex items-center gap-2">
              <button onClick={toggle} className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"><FiSun size={14} className={dark ? "" : "hidden"} /><FiMoon size={14} className={dark ? "hidden" : ""} /></button>
              <button onClick={() => navigate(`/my-orders?table=${tableNumber}`)} className="text-sm text-gray-500 dark:text-gray-400 hover:text-orange-500 flex items-center gap-1"><FiClipboard size={14} /> Buyurtmalarim</button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Boom Boom</h1>
              <p className="text-sm text-gray-400">Table {tableNumber} · <span className="text-orange-500 font-medium">{waiterSession?.name}</span></p>
            </div>
            <button onClick={() => setCartOpen(true)} className="relative bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl font-semibold flex items-center gap-2 transition-colors">
              <FiShoppingCart size={16} /> Savatcha
              {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">{cartCount}</span>}
            </button>
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-4 pb-3 flex gap-2 overflow-x-auto">
          {Object.entries(CATEGORIES).map(([key, label]) => (
            <button key={key} onClick={() => setCategory(key)} className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${category === key ? "bg-orange-500 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {filtered.length === 0 ? (
          <p className="text-center text-gray-400 py-16">Bu kategoriyada taomlar yo'q</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((item) => (
              <div key={item.id} className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow flex flex-col">
                <div className="w-full h-48 overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80"; }}
                  />
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-gray-900 dark:text-white flex-1 pr-2">{item.name}</h3>
                    <span className="font-bold text-orange-500 whitespace-nowrap">{`${item.price.toLocaleString("uz-UZ")} UZS`}</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 flex-1">{item.description}</p>
                  <button onClick={() => handleAddToCart(item)} className="w-full bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-500 hover:text-white text-orange-500 font-semibold py-2 rounded-xl transition-colors border border-orange-200 dark:border-orange-800 flex items-center justify-center gap-2">
                    <FiPlus size={16} /> Qo'shish
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
