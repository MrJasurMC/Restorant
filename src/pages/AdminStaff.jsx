import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addStaff, updateStaff, deleteStaff, toggleStaff } from "../store/slices/staffSlice";
import { useToast } from "../context/ToastContext";
import { useTheme } from "../context/ThemeContext";
import { FiLogOut, FiPlus, FiEdit2, FiTrash2, FiSun, FiMoon, FiUser, FiUsers, FiCoffee, FiGrid, FiList, FiShield, FiArrowLeft } from "react-icons/fi";

const EMPTY = { name: "", role: "waiter", pin: "" };

function generatePin(role) {
  const prefix = role === "waiter" ? "1" : "2";
  return prefix + String(Math.floor(Math.random() * 99999)).padStart(5, "0");
}

export default function AdminStaff() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { dark, toggle } = useTheme();
  const staff = useSelector(s => s.staff.list);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [deleteId, setDeleteId] = useState(null);
  const [tab, setTab] = useState("all");

  useEffect(() => {
    if (!localStorage.getItem("admin_logged_in")) navigate("/admin/auth");
  }, []);

  function openAdd() {
    setEditing(null);
    const newPin = generatePin("waiter");
    setForm({ ...EMPTY, pin: newPin });
    setShowForm(true);
  }

  function openEdit(member) {
    setEditing(member.id);
    setForm({ name: member.name, role: member.role, pin: member.pin });
    setShowForm(true);
  }

  function handleRoleChange(role) {
    setForm(f => ({ ...f, role, pin: generatePin(role) }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) return showToast("Name required!", "error");
    if (form.pin.length !== 6 || !/^\d{6}$/.test(form.pin)) return showToast("PIN must be exactly 6 digits", "error");

    const conflict = staff.find(s => s.pin === form.pin && s.id !== editing);
    if (conflict) return showToast("This PIN is already taken!", "error");

    if (editing) {
      dispatch(updateStaff({ ...form, id: editing, active: staff.find(s => s.id === editing)?.active ?? true }));
      showToast("Staff updated ✓");
    } else {
      dispatch(addStaff(form));
      showToast("Staff added ✓");
    }
    setShowForm(false);
    setEditing(null);
    setForm(EMPTY);
  }

  function logout() {
    localStorage.removeItem("admin_logged_in");
    navigate("/");
  }

  const filtered = tab === "all" ? staff : staff.filter(s => s.role === tab);
  const waiters = staff.filter(s => s.role === "waiter");
  const chefs = staff.filter(s => s.role === "chef");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      {}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-sm w-full border border-gray-100 dark:border-gray-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Delete Staff</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 border border-gray-200 dark:border-gray-700 rounded-xl py-2.5 text-sm text-gray-600 dark:text-gray-400">Cancel</button>
              <button onClick={() => { dispatch(deleteStaff(deleteId)); setDeleteId(null); showToast("Deleted"); }} className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-xl py-2.5 text-sm font-medium">Delete</button>
            </div>
          </div>
        </div>
      )}

      {}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-sm border border-gray-100 dark:border-gray-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5">{editing ? "Edit Staff" : "Add Staff"}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Full Name *</label>
                <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="e.g. Ali Karimov" className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-300" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">Role *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => handleRoleChange("waiter")} className={`py-2.5 rounded-xl text-sm font-semibold border-2 flex items-center justify-center gap-1.5 transition-colors ${form.role === "waiter" ? "border-orange-400 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400" : "border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400"}`}>
                    <FiUser size={14} /> Waiter
                  </button>
                  <button type="button" onClick={() => handleRoleChange("chef")} className={`py-2.5 rounded-xl text-sm font-semibold border-2 flex items-center justify-center gap-1.5 transition-colors ${form.role === "chef" ? "border-green-400 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400" : "border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400"}`}>
                    <FiCoffee size={14} /> Chef
                  </button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">6-Digit PIN *</label>
                <div className="flex gap-2">
                  <input
                    value={form.pin}
                    onChange={e => setForm(f => ({...f, pin: e.target.value.replace(/\D/g,"").slice(0,6)}))}
                    placeholder="100001"
                    className="flex-1 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-300 font-mono tracking-widest"
                    maxLength={6}
                  />
                  <button type="button" onClick={() => setForm(f => ({...f, pin: generatePin(f.role)}))} className="px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 whitespace-nowrap">
                    Random
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">Waiters: 1xxxxx · Chefs: 2xxxxx (convention only)</p>
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="flex-1 border border-gray-200 dark:border-gray-700 rounded-xl py-2.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800">Cancel</button>
                <button type="submit" className="flex-1 bg-orange-500 hover:bg-orange-600 text-white rounded-xl py-2.5 text-sm font-bold">{editing ? "Save" : "Add"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/admin/kitchen")} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <FiArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Staff</h1>
              <p className="text-sm text-gray-400">{waiters.length} waiters · {chefs.length} chefs</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={toggle} className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-400">
              {dark ? <FiSun size={16} /> : <FiMoon size={16} />}
            </button>
            <button onClick={openAdd} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1">
              <FiPlus size={14} /> Add
            </button>
            <button onClick={logout} className="flex items-center gap-1 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800">
              <FiLogOut size={14} /> Logout
            </button>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 pb-3 flex gap-2">
          {[["all","All"], ["waiter","Waiters"], ["chef","Chefs"]].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${tab === key ? "bg-orange-500 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"}`}>
              {label} ({key === "all" ? staff.length : staff.filter(s => s.role === key).length})
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <FiUsers className="text-gray-300 dark:text-gray-600 mx-auto mb-3" size={48} />
            <p className="text-gray-400">No staff yet</p>
            <button onClick={openAdd} className="mt-4 bg-orange-500 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-orange-600">Add first staff</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(member => (
              <div key={member.id} className={`bg-white dark:bg-gray-900 rounded-2xl border p-5 ${member.active ? "border-gray-100 dark:border-gray-800" : "border-gray-100 dark:border-gray-800 opacity-60"}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${member.role === "waiter" ? "bg-orange-100 dark:bg-orange-900/30 text-orange-500" : "bg-green-100 dark:bg-green-900/30 text-green-500"}`}>
                      {member.role === "waiter" ? <FiUser size={18} /> : <FiCoffee size={18} />}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">{member.name}</p>
                      <p className={`text-xs capitalize font-medium ${member.role === "waiter" ? "text-orange-500" : "text-green-500"}`}>{member.role}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${member.active ? "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400" : "bg-red-100 text-red-500 dark:bg-red-900/20 dark:text-red-400"}`}>
                    {member.active ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-2 mb-4 flex items-center justify-between">
                  <span className="text-xs text-gray-400">PIN</span>
                  <span className="font-mono font-bold text-gray-900 dark:text-white text-lg tracking-widest">{member.pin}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => dispatch(toggleStaff(member.id))} className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-colors ${member.active ? "border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800" : "border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"}`}>
                    {member.active ? "Deactivate" : "Activate"}
                  </button>
                  <button onClick={() => openEdit(member)} className="border border-blue-100 dark:border-blue-900/30 rounded-lg px-2.5 py-1.5 text-xs text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                    <FiEdit2 size={12} />
                  </button>
                  <button onClick={() => setDeleteId(member.id)} className="border border-red-100 dark:border-red-900/30 rounded-lg px-2.5 py-1.5 text-xs text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                    <FiTrash2 size={12} />
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
