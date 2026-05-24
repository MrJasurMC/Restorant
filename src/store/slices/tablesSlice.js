import { createSlice } from "@reduxjs/toolkit";

const DEFAULT_TABLES = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  table_number: i + 1,
  is_active: true,
  created_at: new Date().toISOString(),
}));

function loadTables() {
  try {
    const saved = localStorage.getItem("fo_tables");
    return saved ? JSON.parse(saved) : DEFAULT_TABLES;
  } catch { return DEFAULT_TABLES; }
}

function saveTables(list) {
  localStorage.setItem("fo_tables", JSON.stringify(list));
}

const tablesSlice = createSlice({
  name: "tables",
  initialState: { list: loadTables() },
  reducers: {
    addTable: (state, action) => {
      const num = action.payload;
      if (state.list.find((t) => t.table_number === num)) return;
      state.list.push({ id: Date.now(), table_number: num, is_active: true, created_at: new Date().toISOString() });
      state.list.sort((a, b) => a.table_number - b.table_number);
      saveTables(state.list);
    },
    toggleTable: (state, action) => {
      const t = state.list.find((t) => t.id === action.payload);
      if (t) t.is_active = !t.is_active;
      saveTables(state.list);
    },
    deleteTable: (state, action) => {
      state.list = state.list.filter((t) => t.id !== action.payload);
      saveTables(state.list);
    },
  },
});

export const { addTable, toggleTable, deleteTable } = tablesSlice.actions;
export default tablesSlice.reducer;
