import { createSlice } from "@reduxjs/toolkit";

const DEFAULT_MENU = [

  { id: 1, name: "Margherita Pizza", category: "main_dishes", price: 12.99, description: "Klassik italyan pizza, pomidor sousi va mozzarella bilan", image_url: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600", available: true },
  { id: 2, name: "Burger Deluxe", category: "main_dishes", price: 9.99, description: "Juicy mol go'shti, pishloq va yangi sabzavotlar bilan", image_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600", available: true },
  { id: 3, name: "Ramen Soup", category: "main_dishes", price: 11.99, description: "Yapon uslubida issiq sho'rva, tuxum va go'sht bilan", image_url: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600", available: true },
  { id: 4, name: "Grilled Chicken", category: "main_dishes", price: 14.99, description: "Tandirda pishirilgan tovuq, sabzavotlar bilan", image_url: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=600", available: true },
  { id: 5, name: "Beef Steak", category: "main_dishes", price: 24.99, description: "Medium pishirilgan mol go'shti steyki, kartoshka bilan", image_url: "https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=600", available: true },
  { id: 6, name: "Spaghetti Carbonara", category: "main_dishes", price: 13.99, description: "Italyan spagetti, tuxum, pishloq va bekon bilan", image_url: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=600", available: true },
  { id: 7, name: "Shrimp Tacos", category: "main_dishes", price: 15.99, description: "Qisqichbaqa bilan to'ldirilgan meksika takosi", image_url: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600", available: true },
  { id: 8, name: "BBQ Ribs", category: "main_dishes", price: 22.99, description: "Tandirda pishirilgan qovurg'a, BBQ sousi bilan", image_url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600", available: true },
  { id: 9, name: "Salmon Fillet", category: "main_dishes", price: 19.99, description: "Limon va ko'k sousi bilan pishirilgan losos", image_url: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600", available: true },
  { id: 10, name: "Mushroom Risotto", category: "main_dishes", price: 16.99, description: "Kremli italyan rizi, qo'ziqorin bilan", image_url: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600", available: true },
  { id: 11, name: "Lamb Chops", category: "main_dishes", price: 26.99, description: "O'tda pishirilgan qo'y go'shti, rozmarinli sousi bilan", image_url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600", available: true },
  { id: 12, name: "Fish & Chips", category: "main_dishes", price: 13.49, description: "Ingliz uslubida qovurilgan baliq va kartoshka", image_url: "https://images.unsplash.com/photo-1614777986387-7b1eff988399?w=600", available: true },

  { id: 13, name: "Caesar Salad", category: "salads", price: 7.99, description: "Yangi ko'k salat, parmezan va krutonlar bilan", image_url: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=600", available: true },
  { id: 14, name: "Greek Salad", category: "salads", price: 8.99, description: "Pomidor, bodring, zaytun va feta pishloq bilan", image_url: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600", available: true },
  { id: 15, name: "Avocado Salad", category: "salads", price: 9.99, description: "Avokado, pomidor, limon sousi bilan", image_url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600", available: true },
  { id: 16, name: "Tuna Salad", category: "salads", price: 10.99, description: "Tuna baliqi, sabzavotlar va zaytun yog'i bilan", image_url: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600", available: true },
  { id: 17, name: "Quinoa Bowl", category: "salads", price: 11.99, description: "Kinoa, avokado, pomidor va limon zaytun yog'i bilan", image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600", available: true },
  { id: 18, name: "Caprese Salad", category: "salads", price: 9.49, description: "Yangi mozzarella, pomidor va rayhon barglari bilan", image_url: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=600", available: true },

  { id: 19, name: "Cheesecake", category: "desserts", price: 5.99, description: "Yumshoq va kremli klassik cheesecake", image_url: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600", available: true },
  { id: 20, name: "Chocolate Brownie", category: "desserts", price: 4.99, description: "Issiq shokoladli brauning, muzqaymoq bilan", image_url: "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=600", available: true },
  { id: 21, name: "Tiramisu", category: "desserts", price: 6.49, description: "Italyan klassik desserti, kofe va mascarpone bilan", image_url: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600", available: true },
  { id: 22, name: "Pancakes", category: "desserts", price: 6.99, description: "Yumshoq krep, asal va meva bilan", image_url: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=600", available: true },
  { id: 23, name: "Ice Cream", category: "desserts", price: 3.99, description: "3 xil ta'mli muzqaymoq", image_url: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=600", available: true },
  { id: 24, name: "Creme Brulee", category: "desserts", price: 7.49, description: "Karamelizatsiya qilingan kremli frantsuz desserti", image_url: "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=600", available: true },
  { id: 25, name: "Chocolate Lava Cake", category: "desserts", price: 7.99, description: "Ichki shokolad oqadigan issiq keks", image_url: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=600", available: true },
  { id: 26, name: "Baklava", category: "desserts", price: 5.49, description: "Yong'oq va asal bilan to'ldirilgan sharqona desert", image_url: "https://images.unsplash.com/photo-1519676867240-f03562e64548?w=600", available: true },
  { id: 27, name: "Waffles", category: "desserts", price: 6.99, description: "Krem, rezavor mevalar va shakar kukuni bilan", image_url: "https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=600", available: true },
  { id: 28, name: "Macaron Set", category: "desserts", price: 8.99, description: "6 ta turli ta'mdagi frantsuz makaroni", image_url: "https://images.unsplash.com/photo-1558326567-98ae2405596b?w=600", available: true },

  { id: 29, name: "Fresh Orange Juice", category: "drinks", price: 3.99, description: "Yangi siqilgan apelsin sharbati", image_url: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=600", available: true },
  { id: 30, name: "Lemonade", category: "drinks", price: 3.49, description: "Limon va yalpiz bilan tayyorlangan limonad", image_url: "https://images.unsplash.com/photo-1523677011781-c91d1bbe2f9e?w=600", available: true },
  { id: 31, name: "Cappuccino", category: "drinks", price: 4.49, description: "Italyan uslubida kapuchino", image_url: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600", available: true },
  { id: 32, name: "Mango Smoothie", category: "drinks", price: 5.49, description: "Yangi mango va yogurt bilan tayyorlangan smoothie", image_url: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=600", available: true },
  { id: 33, name: "Matcha Latte", category: "drinks", price: 5.99, description: "Yapon matcha choy va sut bilan", image_url: "https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?w=600", available: true },
  { id: 34, name: "Cola / Pepsi", category: "drinks", price: 2.49, description: "Sovuq gazlangan ichimlik, muz bilan", image_url: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600", available: true },
  { id: 35, name: "Strawberry Milkshake", category: "drinks", price: 5.99, description: "Qulupnay va slivki bilan tayyorlangan milkshake", image_url: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=600", available: true },
  { id: 36, name: "Iced Coffee", category: "drinks", price: 4.99, description: "Sovuq kofe, muz va sut bilan", image_url: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600", available: true },
  { id: 37, name: "Mineral Water", category: "drinks", price: 1.99, description: "Toza mineral suv (0.5L)", image_url: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=600", available: true },
];

function loadMenu() {
  try {
    const saved = localStorage.getItem("fo_menu");
    return saved ? JSON.parse(saved) : DEFAULT_MENU;
  } catch { return DEFAULT_MENU; }
}

function saveMenu(items) {
  localStorage.setItem("fo_menu", JSON.stringify(items));
}

const menuSlice = createSlice({
  name: "menu",
  initialState: { items: loadMenu() },
  reducers: {
    addMenuItem: (state, action) => {
      state.items.push({ ...action.payload, id: Date.now(), available: true });
      saveMenu(state.items);
    },
    updateMenuItem: (state, action) => {
      const idx = state.items.findIndex((i) => i.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
      saveMenu(state.items);
    },
    deleteMenuItem: (state, action) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
      saveMenu(state.items);
    },
    toggleMenuItem: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) item.available = !item.available;
      saveMenu(state.items);
    },
  },
});

export const { addMenuItem, updateMenuItem, deleteMenuItem, toggleMenuItem } = menuSlice.actions;
export default menuSlice.reducer;
