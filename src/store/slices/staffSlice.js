import { createSlice } from "@reduxjs/toolkit";

const DEFAULT_STAFF = [
  { id: 1, name: "Ali Waiter",    role: "waiter", pin: "100001", active: true },
  { id: 2, name: "Zulfiya",       role: "waiter", pin: "100002", active: true },
  { id: 3, name: "Bobur Chef",    role: "chef",   pin: "200001", active: true },
  { id: 4, name: "Nilufar Chef",  role: "chef",   pin: "200002", active: true },
];

function load() {
  try {
    const s = localStorage.getItem("fo_staff");
    return s ? JSON.parse(s) : DEFAULT_STAFF;
  } catch { return DEFAULT_STAFF; }
}
function save(list) { localStorage.setItem("fo_staff", JSON.stringify(list)); }

const staffSlice = createSlice({
  name: "staff",
  initialState: { list: load() },
  reducers: {
    addStaff: (state, { payload }) => {
      state.list.push({ ...payload, id: Date.now(), active: true });
      save(state.list);
    },
    updateStaff: (state, { payload }) => {
      const i = state.list.findIndex(s => s.id === payload.id);
      if (i !== -1) state.list[i] = payload;
      save(state.list);
    },
    deleteStaff: (state, { payload }) => {
      state.list = state.list.filter(s => s.id !== payload);
      save(state.list);
    },
    toggleStaff: (state, { payload }) => {
      const s = state.list.find(s => s.id === payload);
      if (s) s.active = !s.active;
      save(state.list);
    },
  },
});

export const { addStaff, updateStaff, deleteStaff, toggleStaff } = staffSlice.actions;
export default staffSlice.reducer;
