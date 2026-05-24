import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSun, FiMoon, FiShield, FiUser, FiCoffee, FiArrowRight, FiLock } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";

export default function Index() {
  const navigate = useNavigate();
  const { dark, toggle } = useTheme();
  const [selected, setSelected] = useState(null);

  const roles = [
    {
      id: "admin",
      icon: <FiShield size={32} />,
      label: "Admin",
      desc: "Hamma narsaga ruxsati bor — buyurtmalar, xodimlar, menyu, stollar va boshqalar",
      active: "border-purple-400 dark:border-purple-600 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
      btn: "bg-purple-500 hover:bg-purple-600",
    },
    {
      id: "waiter",
      icon: <FiUser size={32} />,
      label: "Ofitsant / Ofitsantka",
      desc: "6 xonali PIN bilan kiring va buyurtmalar qabul qiling",
      active: "border-orange-400 dark:border-orange-600 bg-orange-50 dark:bg-orange-900/20 text-orange-500 dark:text-orange-400",
      btn: "bg-orange-500 hover:bg-orange-600",
    },
    {
      id: "chef",
      icon: <FiCoffee size={32} />,
      label: "Oshpaz",
      desc: "Kiruvchi buyurtmalarni ko'rish va ularning holatini yangilash",
      active: "border-green-400 dark:border-green-600 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
      btn: "bg-green-500 hover:bg-green-600",
    },
  ];

  function handleGo() {
    if (selected === "admin") navigate("/admin/auth");
    else if (selected === "waiter") navigate("/waiter/login");
    else if (selected === "chef") navigate("/chef/login");
  }

  const currentRole = roles.find(r => r.id === selected);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col transition-colors">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
        <span className="text-xl font-bold text-orange-500">Restarant</span>
        <button onClick={toggle} className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          {dark ? <FiSun size={18} /> : <FiMoon size={18} />}
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiLock size={36} className="text-orange-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Boshqaruvchilar uchun ro'llar</h1>
            <p className="text-gray-500 dark:text-gray-400">Rolingizni tanlang va kiring</p>
          </div>

          <div className="space-y-3 mb-8">
            {roles.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelected(r.id)}
                className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left ${selected === r.id
                    ? r.active + " shadow-md"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
              >
                <div className={`flex-shrink-0 ${selected === r.id ? "" : "text-gray-400 dark:text-gray-500"}`}>
                  {r.icon}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-gray-900 dark:text-white">{r.label}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{r.desc}</div>
                </div>
                {selected === r.id && (
                  <div className="w-6 h-6 rounded-full bg-current flex-shrink-0" style={{ backgroundColor: "currentColor" }}>
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                )}
              </button>
            ))}
          </div>

          <button
            onClick={handleGo}
            disabled={!selected}
            className={`w-full py-4 rounded-2xl font-bold text-white text-lg flex items-center justify-center gap-2 transition-all ${"bg-green-500 hover:bg-green-600"
              }`}
          >
            Davom etish <FiArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}
