import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiLogIn, FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";

const ADMIN_EMAIL = "jasurbek@gmail.com";
const ADMIN_PASSWORD = "Jasurbek";

export default function AdminAuth() {
  const navigate = useNavigate();
  const { dark, toggle } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem("admin_logged_in", "true");
      navigate("/admin/dashboard");
    } else {
      setError("Email yoki parol noto'g'ri!");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4 transition-colors">
      <button onClick={toggle} className="absolute top-4 right-4 p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
        {dark ? <FiSun size={18} /> : <FiMoon size={18} />}
      </button>
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 w-full max-w-sm p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
            <FiLogIn size={28} className="text-orange-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Kitchen Admin</h1>
          <p className="text-sm text-gray-400 mt-1">Oshxona paneliga kirish</p>
        </div>
        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl text-sm bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900/30">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-3 text-gray-400" size={16} />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@gmail.com" required className="w-full border border-gray-200 dark:border-gray-700 rounded-xl pl-9 pr-4 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-300" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Parol</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-3 text-gray-400" size={16} />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required className="w-full border border-gray-200 dark:border-gray-700 rounded-xl pl-9 pr-4 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-300" />
            </div>
          </div>
          <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
            <FiLogIn size={16} /> Kirish
          </button>
        </form>
      </div>
    </div>
  );
}
