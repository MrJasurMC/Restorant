import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiGrid, FiLogOut, FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";

export default function WaiterTables() {
  const navigate = useNavigate();
  const { dark, toggle } = useTheme();
  const tables = useSelector(s => s.tables.list.filter(t => t.is_active));

  const session = (() => {
    try { return JSON.parse(sessionStorage.getItem("waiter_session")); } catch { return null; }
  })();

  useEffect(() => {
    if (!session) navigate("/waiter/login");
  }, []);

  function logout() {
    sessionStorage.removeItem("waiter_session");
    navigate("/");
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Stol tanlash</h1>
            <p className="text-sm text-orange-500 font-medium">{session.name}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={toggle} className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
              {dark ? <FiSun size={16} /> : <FiMoon size={16} />}
            </button>
            <button onClick={logout} className="flex items-center gap-1 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800">
              <FiLogOut size={14} /> Chiqish
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        {tables.length === 0 ? (
          <p className="text-center text-gray-400 py-20">Faol stollar yo'q. Admindan stol qo'shishini so'rang.</p>
        ) : (
          <>
            <p className="text-sm text-gray-400 mb-4">{tables.length} ta faol stol</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {tables.map(t => (
                <button
                  key={t.id}
                  onClick={() => navigate(`/waiter/menu?table=${t.table_number}`)}
                  className="aspect-square bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 hover:border-orange-400 hover:shadow-md rounded-2xl flex flex-col items-center justify-center transition-all hover:scale-105 active:scale-95"
                >
                  <span className="text-3xl font-bold text-gray-800 dark:text-white">{t.table_number}</span>
                  <span className="text-xs text-gray-400 mt-1">Stol</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
