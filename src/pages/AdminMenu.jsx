import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addMenuItem, updateMenuItem, deleteMenuItem, toggleMenuItem } from "../store/slices/menuSlice";
import { useToast } from "../context/ToastContext";
import { useTheme } from "../context/ThemeContext";
import { FiLogOut, FiEdit2, FiTrash2, FiPlus, FiCamera, FiSun, FiMoon, FiGrid, FiList } from "react-icons/fi";

const CATEGORIES = {
  main_dishes: "Asosiy taomlar",
  salads: "Salatlar",
  desserts: "Desertlar",
  drinks: "Ichimliklar",
};

const EMPTY_FORM = { name: "", category: "main_dishes", price: "", description: "", image_url: "" };

function formatUZS(amount) {
  return amount.toLocaleString("uz-UZ") + " UZS";
}

export default function AdminMenu() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { dark, toggle } = useTheme();
  const items = useSelector((state) => state.menu.items);
  const fileInputRef = useRef(null);

  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("admin_logged_in")) navigate("/");
  }, []);

  function handleLogout() {
    localStorage.removeItem("admin_logged_in");
    navigate("/");
  }

  function openAdd() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setImagePreview("");
    setShowForm(true);
  }

  function openEdit(item) {
    setEditing(item.id);
    setForm({ name: item.name, category: item.category, price: item.price, description: item.description, image_url: item.image_url });
    setImagePreview(item.image_url);
    setShowForm(true);
  }

  function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) return showToast("Rasm 10MB dan kichik bo'lishi kerak!", "error");
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImagePreview(ev.target.result);
      setForm((f) => ({ ...f, image_url: ev.target.result }));
    };
    reader.readAsDataURL(file);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const data = { ...form, price: parseFloat(form.price) };
    if (!data.name || !data.price || isNaN(data.price)) return showToast("Iltimos barcha maydonlarni to'ldiring!", "error");
    if (editing) {
      dispatch(updateMenuItem({ ...data, id: editing, available: items.find(i => i.id === editing)?.available ?? true }));
      showToast("Taom yangilandi ✓");
    } else {
      dispatch(addMenuItem(data));
      showToast("Taom qo'shildi ✓");
    }
    setShowForm(false);
    setEditing(null);
    setForm(EMPTY_FORM);
    setImagePreview("");
  }

  function handleDelete() {
    dispatch(deleteMenuItem(deleteId));
    setDeleteId(null);
    showToast("Taom o'chirildi ✓");
  }

  const filtered = filter === "all" ? items : items.filter((i) => i.category === filter);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">

      {}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-sm w-full border border-gray-100 dark:border-gray-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Taomni o'chirish</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">Bu amalni bekor qilib bo'lmaydi.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 border border-gray-200 dark:border-gray-700 rounded-xl py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800">Bekor</button>
              <button onClick={handleDelete} className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-xl py-2.5 text-sm font-medium">O'chirish</button>
            </div>
          </div>
        </div>
      )}

      {}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto border border-gray-100 dark:border-gray-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{editing ? "Taomni tahrirlash" : "Yangi taom qo'shish"}</h3>
            <form onSubmit={handleSubmit} className="space-y-3">

              {}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Rasm</label>
                <div
                  onClick={() => fileInputRef.current.click()}
                  className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden cursor-pointer hover:border-orange-300 transition-colors"
                >
                  {imagePreview ? (
                    <div className="relative">
                      <img src={imagePreview} alt="preview" className="w-full h-48 object-cover" />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <span className="text-white font-medium text-sm flex items-center gap-1"><FiCamera size={14}/> Rasmni almashtirish</span>
                      </div>
                    </div>
                  ) : (
                    <div className="h-48 flex flex-col items-center justify-center text-gray-400 dark:text-gray-600">
                      <FiCamera size={36} className="mb-2"/>
                      <span className="text-sm font-medium">Rasm yuklash uchun bosing</span>
                      <span className="text-xs mt-1">JPG, PNG — max 10MB</span>
                    </div>
                  )}
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                <p className="text-xs text-gray-400 mt-1 text-center">Yoki URL kiriting:</p>
                <input
                  type="url"
                  value={form.image_url.startsWith("data:") ? "" : form.image_url}
                  onChange={(e) => { setForm(f => ({ ...f, image_url: e.target.value })); setImagePreview(e.target.value); }}
                  placeholder="https://............."
                  className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-300 mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Taom nomi *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Masalan: Kabob" className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-300" />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Kategoriya *</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-300">
                  {Object.entries(CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Narxi (UZS) *</label>
                <input type="number" min="0" step="0.01" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="100.000" className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-300" />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Tavsif</label>
                <textarea rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Taom haqida qisqacha..." className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none" />
              </div>

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => { setShowForm(false); setEditing(null); setForm(EMPTY_FORM); setImagePreview(""); }} className="flex-1 border border-gray-200 dark:border-gray-700 rounded-xl py-2.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800">Bekor</button>
                <button type="submit" className="flex-1 bg-orange-500 hover:bg-orange-600 text-white rounded-xl py-2.5 text-sm font-bold">{editing ? "Saqlash" : "Qo'shish"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Menyu Boshqarish</h1>
            <p className="text-sm text-gray-400">{items.length} ta taom</p>
          </div>
          <div className="flex gap-2 flex-wrap justify-end">
            <button onClick={openAdd} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1"><FiPlus size={14}/> Taom qo'shish</button>
            <button onClick={() => navigate("/admin/kitchen")} className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-1"><FiGrid size={14}/> Oshxona</button>
            <button onClick={() => navigate("/admin/tables")} className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-1"><FiList size={14}/> Stollar</button>
            <button onClick={toggle} className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800">
              {dark ? <FiSun size={16}/> : <FiMoon size={16}/>}
            </button>
            <button onClick={handleLogout} className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-1"><FiLogOut size={14}/> Chiqish</button>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 pb-3 flex gap-2 overflow-x-auto">
          <button onClick={() => setFilter("all")} className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === "all" ? "bg-orange-500 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"}`}>Hammasi ({items.length})</button>
          {Object.entries(CATEGORIES).map(([k, v]) => (
            <button key={k} onClick={() => setFilter(k)} className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === k ? "bg-orange-500 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"}`}>
              {v} ({items.filter(i => i.category === k).length})
            </button>
          ))}
        </div>
      </div>

      {}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <div key={item.id} className={`bg-white dark:bg-gray-900 rounded-2xl border overflow-hidden ${item.available ? "border-gray-100 dark:border-gray-800" : "border-gray-100 dark:border-gray-800 opacity-60"}`}>
              <div className="relative">
                <img src={item.image_url} alt={item.name} className="w-full h-40 object-cover bg-gray-100 dark:bg-gray-800" onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400"; }} />
                {!item.available && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="text-white font-bold text-sm bg-black/60 px-3 py-1 rounded-full">Mavjud emas</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm">{item.name}</h3>
                  <span className="font-bold text-orange-500 text-xs ml-2">{formatUZS(item.price)}</span>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">{CATEGORIES[item.category]}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{item.description}</p>
                <div className="flex gap-2">
                  <button onClick={() => dispatch(toggleMenuItem(item.id))} className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-colors ${item.available ? "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800" : "border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"}`}>
                    {item.available ? "O'chirish" : "Yoqish"}
                  </button>
                  <button onClick={() => openEdit(item)} className="border border-blue-100 dark:border-blue-900/30 rounded-lg px-2.5 py-1.5 text-xs text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"><FiEdit2 size={12}/></button>
                  <button onClick={() => setDeleteId(item.id)} className="border border-red-100 dark:border-red-900/30 rounded-lg px-2.5 py-1.5 text-xs text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"><FiTrash2 size={12}/></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}