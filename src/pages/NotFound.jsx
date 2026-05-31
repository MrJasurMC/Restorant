import { useNavigate } from "react-router-dom";
import { FiAlertTriangle, FiArrowLeft } from "react-icons/fi";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center px-4 transition-colors">
      <div className="text-center max-w-md w-full">
        <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiAlertTriangle size={36} className="text-orange-500" />
        </div>

        <h1 className="text-6xl font-bold text-orange-500 mb-2">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Sahifa topilmadi</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Siz qidirgan sahifa mavjud emas yoki ko'chirilgan. URL manzilini tekshiring va qayta urinib ko'ring.
        </p>

        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-2xl transition-colors"
        >
          <FiArrowLeft />
          Bosh sahifaga qaytish
        </button>
      </div>
    </div>
  );
}
