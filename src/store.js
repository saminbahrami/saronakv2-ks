const STORAGE_KEY = "saronak_products_v1";
const SESSION_KEY = "saronak_admin_session";

const defaultProducts = [
  { id: 1, name: "کراپ تاپ نخی یقه گرد", category: "کراپ تاپ", description: "کراپ تاپ نخی با دوخت تمیز و راحتی بالا، مناسب استفاده روزمره.", price: 480000, wholesalePrice: 340000, minWholesaleQty: 10, oldPrice: 620000, stock: 45, sizes: ["S", "M", "L"], image: "https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&w=800&q=85", badge: "پرفروش", rating: 4.8, colors: ["#e8c5c5", "#7a9b5c", "#f5f0e6", "#5d2e46"], active: true },
  { id: 2, name: "تاپ آستین بلند کشباف", category: "تاپ", description: "تاپ کشباف با آستین بلند و فرم بدنی مناسب فصل سرد.", price: 690000, wholesalePrice: 480000, minWholesaleQty: 10, oldPrice: 850000, stock: 32, sizes: ["S", "M", "L", "XL"], image: "https://images.unsplash.com/photo-1564257577015-6c5b0e1c8f37?auto=format&fit=crop&w=800&q=85", badge: "جدید", rating: 4.6, colors: ["#f5f0e6", "#26302a", "#7a9b5c"], active: true },
  { id: 3, name: "دامن پلیسه میدی", category: "دامن", description: "دامن پلیسه میدی با پارچه درجه یک، مناسب مجالس و مهمانی‌ها.", price: 1290000, wholesalePrice: 890000, minWholesaleQty: 5, oldPrice: 1590000, stock: 18, sizes: ["S", "M", "L"], image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=800&q=85", badge: "ترند", rating: 4.9, colors: ["#5d2e46", "#26302a", "#e8c5c5"], active: true },
  { id: 4, name: "دامن ساتن بلند", category: "دامن", description: "دامن ساتن بلند با درخشش ملایم و راحتی فوق‌العاده.", price: 1590000, wholesalePrice: 1100000, minWholesaleQty: 5, oldPrice: 1890000, stock: 12, sizes: ["M", "L", "XL"], image: "https://images.unsplash.com/photo-1582142306909-195724d33ffc?auto=format&fit=crop&w=800&q=85", badge: "ویژه", rating: 4.7, colors: ["#e8c5c5", "#f5f0e6", "#7a9b5c"], active: true },
  { id: 5, name: "شورت نخی راحتی", category: "شورت", description: "شورت نخی راحتی با کش دور کمر، مناسب استفاده روزمره.", price: 220000, wholesalePrice: 150000, minWholesaleQty: 20, oldPrice: 280000, stock: 87, sizes: ["S", "M", "L", "XL"], image: "https://images.unsplash.com/photo-1620799139507-2a76f79a2f4d?auto=format&fit=crop&w=800&q=85", badge: "اقتصادی", rating: 4.5, colors: ["#f5f0e6", "#e8c5c5", "#26302a"], active: true },
  { id: 6, name: "ست سوتین و شورت توری", category: "ست", description: "ست سوتین و شورت توری با کیفیت بالا و طراحی زنانه.", price: 890000, wholesalePrice: 620000, minWholesaleQty: 8, oldPrice: 1150000, stock: 24, sizes: ["S", "M", "L"], image: "https://images.unsplash.com/photo-1583846992782-b05d6f0f2fbb?auto=format&fit=crop&w=800&q=85", badge: "محبوب", rating: 4.9, colors: ["#5d2e46", "#26302a", "#e8c5c5"], active: true },
  { id: 7, name: "سوتین بدون درز", category: "سوتین", description: "سوتین بدون درز با راحتی بالا و فرم‌دهی طبیعی.", price: 590000, wholesalePrice: 410000, minWholesaleQty: 12, oldPrice: 720000, stock: 38, sizes: ["S", "M", "L", "XL"], image: "https://images.unsplash.com/photo-1566206091558-7f218b696731?auto=format&fit=crop&w=800&q=85", badge: "جدید", rating: 4.6, colors: ["#f5f0e6", "#e8c5c5", "#7a9b5c"], active: true },
  { id: 8, name: "کراپ تاپ کشباف یقه‌اسکی", category: "کراپ تاپ", description: "کراپ تاپ کشباف با یقه اسکی، مناسب فصل سرد.", price: 550000, wholesalePrice: 380000, minWholesaleQty: 10, oldPrice: 690000, stock: 29, sizes: ["S", "M", "L"], image: "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?auto=format&fit=crop&w=800&q=85", badge: "ترند", rating: 4.7, colors: ["#7a9b5c", "#5d2e46", "#26302a"], active: true },
  { id: 9, name: "تاپ اسپرت ورزشی", category: "تاپ", description: "تاپ اسپرت با پارچه تنفسی، مناسب باشگاه و پیاده‌روی.", price: 450000, wholesalePrice: 310000, minWholesaleQty: 15, oldPrice: 570000, stock: 52, sizes: ["S", "M", "L", "XL"], image: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=800&q=85", badge: "اسپرت", rating: 4.4, colors: ["#26302a", "#7a9b5c", "#e8c5c5"], active: true },
  { id: 10, name: "دامن جین کوتاه", category: "دامن", description: "دامن جین کوتاه با فرم راسته و دوخت مقاوم.", price: 1450000, wholesalePrice: 1050000, minWholesaleQty: 5, oldPrice: 1750000, stock: 16, sizes: ["S", "M", "L"], image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=85", badge: "پرفروش", rating: 4.8, colors: ["#3b4a5a", "#26302a"], active: true },
  { id: 11, name: "شورت ورزشی کشی", category: "شورت", description: "شورت ورزشی با کمر کشی و پارچه سبک.", price: 320000, wholesalePrice: 220000, minWholesaleQty: 20, oldPrice: 400000, stock: 74, sizes: ["S", "M", "L", "XL"], image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=800&q=85", badge: "اسپرت", rating: 4.5, colors: ["#26302a", "#7a9b5c", "#e8c5c5"], active: true },
  { id: 12, name: "ست سوتین ابریشمی لوکس", category: "ست", description: "ست سوتین ابریشمی با طراحی لوکس و حس لطیف.", price: 1100000, wholesalePrice: 780000, minWholesaleQty: 5, oldPrice: 1350000, stock: 9, sizes: ["S", "M", "L"], image: "https://images.unsplash.com/photo-1571945153237-4929e783af4a?auto=format&fit=crop&w=800&q=85", badge: "ویژه", rating: 5.0, colors: ["#5d2e46", "#e8c5c5", "#f5f0e6"], active: true },
];

let products = load();
const listeners = new Set();

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length) return parsed;
    }
  } catch (e) {
    console.warn("خطا در خواندن محصولات:", e);
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProducts));
  } catch {}
  return [...defaultProducts];
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (e) {
    alert("حجم داده‌ها زیاده. لطفاً تصاویر کم‌حجم‌تر انتخاب کن.");
  }
  listeners.forEach((fn) => fn(products));
}

export function getProducts() {
  return products;
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function addProduct(data) {
  const id = Date.now();
  const next = { ...data, id };
  products = [next, ...products];
  persist();
  return id;
}

export function updateProduct(id, patch) {
  products = products.map((p) => (p.id === id ? { ...p, ...patch, id } : p));
  persist();
}

export function deleteProduct(id) {
  products = products.filter((p) => p.id !== id);
  persist();
}

export function resetProducts() {
  products = [...defaultProducts];
  persist();
}

export function exportProducts() {
  return JSON.stringify(products, null, 2);
}

export function importProducts(json) {
  const parsed = JSON.parse(json);
  if (!Array.isArray(parsed)) throw new Error("فرمت نامعتبر");
  products = parsed;
  persist();
}

/* ========== AUTH (ساده و بدون بک‌اند) ========== */
export const ADMIN_PASSWORD = "saronak1404";

export function isLoggedIn() {
  return sessionStorage.getItem(SESSION_KEY) === "1";
}

export function login(password) {
  if (password === ADMIN_PASSWORD) {
    sessionStorage.setItem(SESSION_KEY, "1");
    return true;
  }
  return false;
}

export function logout() {
  sessionStorage.removeItem(SESSION_KEY);
}