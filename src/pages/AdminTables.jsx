import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addTable, toggleTable, deleteTable } from "../store/slices/tablesSlice";
import { useToast } from "../context/ToastContext";
import { useTheme } from "../context/ThemeContext";
import { FiLogOut, FiTrash2, FiList, FiGrid, FiSun, FiMoon, FiPlus, FiToggleLeft, FiToggleRight } from "react-icons/fi";

export default function AdminTables() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { dark, toggle } = useTheme();
  const tables = useSelector((state) => state.tables.list);
  const [newNumber, setNewNumber] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem("admin_logged_in")) navigate("/admin/auth");
  }, []);

  function handleAdd() {
    const num = parseInt(newNumber);
    if (!num || num < 1 || num > 100) return showToast("Stol raqami 1-100 orasida!", "error");
    if (tables.find((t) => t.table_number === num)) return showToast("Bu raqam allaqachon mavjud!", "error");
    dispatch(addTable(num));
    setNewNumber("");
    showToast(`${num}-stol qo'shildi`);
  }

  function handleLogout() {
    localStorage.removeItem("admin_logged_in");
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-sm w-full border border-gray-100 dark:border-gray-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Stolni o'chirish</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">Bu amalni bekor qilib bo'lmaydi.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 border border-gray-200 dark:border-gray-700 rounded-xl py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400">Bekor</button>
              <button onClick={() => { dispatch(deleteTable(deleteId)); setDeleteId(null); showToast("Stol o'chirildi"); }} className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-xl py-2.5 text-sm font-medium">O'chirish</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Stollarni Boshqarish</h1>
            <p className="text-sm text-gray-400">{tables.length} ta stol</p>
          </div>
          <div className="flex gap-2">
            <button onClick={toggle} className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800">
              {dark ? <FiSun size={16} /> : <FiMoon size={16} />}
            </button>
            <button onClick={() => navigate("/admin/menu")} className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-1"><FiList size={14} /> Menyu</button>
            <button onClick={() => navigate("/admin/kitchen")} className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-1"><FiGrid size={14} /> Oshxona</button>
            <button onClick={handleLogout} className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-1"><FiLogOut size={14} /> Chiqish</button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 mb-6">
          <h2 className="font-bold text-gray-900 dark:text-white mb-3">Yangi stol qo'shish</h2>
          <div className="flex gap-3">
            <input type="number" min="1" max="100" value={newNumber} onChange={(e) => setNewNumber(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAdd()} placeholder="Stol raqami" className="border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm w-48 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-300" />
            <button onClick={handleAdd} className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-1"><FiPlus size={14} /> Qo'shish</button>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {tables.map((table) => (
            <div key={table.id} className={`bg-white dark:bg-gray-900 rounded-2xl border p-5 text-center ${table.is_active ? "border-green-200 dark:border-green-900" : "border-gray-100 dark:border-gray-800 opacity-60"}`}>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{table.table_number}</div>
              <div className={`text-xs mb-3 flex items-center justify-center gap-1 ${table.is_active ? "text-green-500" : "text-gray-400"}`}>
                {table.is_active ? <FiToggleRight size={14} /> : <FiToggleLeft size={14} />}
                {table.is_active ? "Faol" : "Nofaol"}
              </div>
              <div className="flex gap-1">
                <button onClick={() => dispatch(toggleTable(table.id))} className="flex-1 border border-gray-200 dark:border-gray-700 rounded-lg py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800">
                  {table.is_active ? "O'chir" : "Yoq"}
                </button>
                <button onClick={() => setDeleteId(table.id)} className="border border-red-100 dark:border-red-900/30 rounded-lg px-2.5 py-1.5 text-xs text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"><FiTrash2 size={12} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
