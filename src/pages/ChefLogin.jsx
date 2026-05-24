import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiArrowLeft, FiCoffee, FiSun, FiMoon, FiDelete } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";

export default function ChefLogin() {
  const navigate = useNavigate();
  const { dark, toggle } = useTheme();
  const staff = useSelector(s => s.staff.list);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  function press(digit) { if (pin.length < 6) setPin(p => p + digit); }
  function del() { setPin(p => p.slice(0, -1)); setError(""); }

  function submit() {
    if (pin.length !== 6) return setError("6 xonali PIN kiriting");
    const member = staff.find(s => s.pin === pin && s.role === "chef" && s.active);
    if (!member) return setError("Noto'g'ri PIN yoki hisob faol emas");
    sessionStorage.setItem("chef_session", JSON.stringify({ id: member.id, name: member.name, role: "chef" }));
    navigate("/chef/kitchen");
  }

  const keys = ["1","2","3","4","5","6","7","8","9","","0","del"];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col transition-colors">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-green-500 transition-colors">
          <FiArrowLeft size={18} /> Back
        </button>
        <button onClick={toggle} className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
          {dark ? <FiSun size={18} /> : <FiMoon size={18} />}
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-xs">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <FiCoffee size={28} className="text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Chef Login</h1>
            <p className="text-sm text-gray-400 mt-1">6 xonali PIN kiriting</p>
          </div>

          <div className="flex gap-3 justify-center mb-6">
            {Array.from({length: 6}).map((_, i) => (
              <div key={i} className={`w-4 h-4 rounded-full border-2 transition-all ${
                i < pin.length ? "bg-green-500 border-green-500" : "border-gray-300 dark:border-gray-600"
              }`} />
            ))}
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl text-sm bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900/30 text-center">
              {error}
            </div>
          )}

          <div className="grid grid-cols-3 gap-3 mb-5">
            {keys.map((k, i) => (
              k === "" ? <div key={i} /> :
              k === "del" ? (
                <button key={i} onClick={del} className="aspect-square flex items-center justify-center rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors active:scale-95">
                  <FiDelete size={20} />
                </button>
              ) : (
                <button key={i} onClick={() => press(k)} className="aspect-square flex items-center justify-center rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-green-50 hover:border-green-300 dark:hover:bg-green-900/20 dark:hover:border-green-700 transition-colors text-2xl font-bold active:scale-95">
                  {k}
                </button>
              )
            ))}
          </div>

          <button
            onClick={submit}
            disabled={pin.length !== 6}
            className={`w-full py-3.5 rounded-2xl font-bold text-white transition-all ${pin.length === 6 ? "bg-green-500 hover:bg-green-600 shadow-lg" : "bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed"}`}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
