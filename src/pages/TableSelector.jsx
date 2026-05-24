import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiArrowLeft, FiSun, FiMoon, FiGrid } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";

export default function TableSelector() {
  const navigate = useNavigate();
  const { dark, toggle } = useTheme();
  const tables = useSelector((state) => state.tables.list.filter((t) => t.is_active));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-orange-500 transition-colors">
            <FiArrowLeft /> Orqaga
          </button>
          <button onClick={toggle} className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
            {dark ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>
        </div>
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiGrid size={28} className="text-orange-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Gourmet Restaurant</h1>
          <p className="text-gray-500 dark:text-gray-400">Buyurtma berish uchun stolingizni tanlang</p>
        </div>
        {tables.length === 0 ? (
          <p className="text-center text-gray-400 py-16">Hozircha faol stollar mavjud emas</p>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {tables.map((table) => (
              <button key={table.id} onClick={() => navigate(`/menu?table=${table.table_number}`)} className="aspect-square bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 hover:border-orange-400 hover:shadow-md rounded-2xl flex flex-col items-center justify-center transition-all hover:scale-105">
                <span className="text-3xl font-bold text-gray-800 dark:text-white">{table.table_number}</span>
                <span className="text-xs text-gray-400 mt-1">Stol</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
