import { useEffect, useMemo, useRef, useState } from "react";
import {
  addProduct,
  updateProduct,
  deleteProduct,
  resetProducts,
  exportProducts,
  importProducts,
  isLoggedIn,
  login,
  logout,
  getProducts,
  subscribe,
} from "./store";
import "./AdminPanel.css";

const CATEGORIES = [
  "کراپ تاپ",
  "تاپ",
  "دامن",
  "شورت",
  "سوتین",
  "ست",
  "اکسسوری",
  "سایر",
];

const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "فری‌سایز"];

const BADGES = [
  "",
  "پرفروش",
  "جدید",
  "ترند",
  "ویژه",
  "محبوب",
  "اقتصادی",
  "اسپرت",
  "تخفیف‌دار",
];

const emptyProduct = {
  name: "",
  category: "کراپ تاپ",
  description: "",
  price: "",
  wholesalePrice: "",
  minWholesaleQty: 5,
  oldPrice: "",
  stock: "",
  sizes: [],
  colors: ["#e8c5c5", "#7a9b5c", "#5d2e46"],
  image: "",
  badge: "",
  rating: 4.5,
  active: true,
};

const formatPrice = (v) =>
  v ? new Intl.NumberFormat("fa-IR").format(Number(v)) + " ت" : "—";

/* =============================================
   HOOK for products (used only inside admin)
============================================= */
function useStoreProducts() {
  const [items, setItems] = useState(getProducts());
  useEffect(() => {
    const unsub = subscribe(setItems);
    return unsub;
  }, []);
  return items;
}
/* =============================================
   LOGIN SCREEN
============================================= */
function LoginScreen({ onSuccess }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (login(password)) {
      onSuccess();
    } else {
      setError("رمز عبور اشتباه است");
      setPassword("");
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-login-card">
        <div className="admin-login-logo">
          <span className="logo-symbol">S</span>
          <div>
            <strong>ساروناک</strong>
            <small>ADMIN PANEL</small>
          </div>
        </div>

        <h2>ورود به پنل مدیریت</h2>
        <p>برای دسترسی، رمز عبور را وارد کنید.</p>

        <form onSubmit={submit}>
          <div className="admin-field">
            <label>رمز عبور</label>
            <div className="admin-password">
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="••••••••"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                aria-label="نمایش"
              >
                {show ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          {error && <div className="admin-error">{error}</div>}

          <button type="submit" className="admin-primary-btn">
            ورود به پنل
          </button>
        </form>

        <p className="admin-hint">
          رمز پیش‌فرض: <code>saronak1404</code>
        </p>
      </div>
    </div>
  );
}

/* =============================================
   DASHBOARD
============================================= */
function Dashboard({ products, onEdit, onNew }) {
  const stats = useMemo(() => {
    const total = products.length;
    const active = products.filter((p) => p.active).length;
    const totalStock = products.reduce(
      (s, p) => s + Number(p.stock || 0),
      0
    );
    const totalValue = products.reduce(
      (s, p) => s + Number(p.price || 0) * Number(p.stock || 0),
      0
    );
    const lowStock = products.filter(
      (p) => Number(p.stock) > 0 && Number(p.stock) < 10
    ).length;
    const outOfStock = products.filter(
      (p) => Number(p.stock) === 0
    ).length;
    return { total, active, totalStock, totalValue, lowStock, outOfStock };
  }, [products]);

  const lowStockList = products
    .filter((p) => Number(p.stock) < 10)
    .slice(0, 6);

  return (
    <div className="admin-dashboard">
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <span className="admin-stat-icon">📦</span>
          <div>
            <small>کل محصولات</small>
            <strong>{stats.total}</strong>
          </div>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-icon">✅</span>
          <div>
            <small>فعال</small>
            <strong>{stats.active}</strong>
          </div>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-icon">🧮</span>
          <div>
            <small>موجودی کل</small>
            <strong>{stats.totalStock}</strong>
          </div>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-icon">💰</span>
          <div>
            <small>ارزش انبار</small>
            <strong>{formatPrice(stats.totalValue)}</strong>
          </div>
        </div>
        <div className="admin-stat-card warn">
          <span className="admin-stat-icon">⚠️</span>
          <div>
            <small>موجودی کم</small>
            <strong>{stats.lowStock}</strong>
          </div>
        </div>
        <div className="admin-stat-card danger">
          <span className="admin-stat-icon">🚫</span>
          <div>
            <small>ناموجود</small>
            <strong>{stats.outOfStock}</strong>
          </div>
        </div>
      </div>

      <div className="admin-section-head">
        <h3>هشدار موجودی</h3>
        <button className="admin-primary-btn small" onClick={onNew}>
          + افزودن محصول
        </button>
      </div>

      {lowStockList.length === 0 ? (
        <div className="admin-empty-inline">
          همه محصولات موجودی کافی دارند ✦
        </div>
      ) : (
        <div className="admin-lowstock-list">
          {lowStockList.map((p) => (
            <div key={p.id} className="admin-lowstock-row">
              <img src={p.image} alt={p.name} />
              <div className="admin-lowstock-info">
                <strong>{p.name}</strong>
                <small>{p.category}</small>
              </div>
              <span
                className={`admin-stock-pill ${
                  Number(p.stock) === 0 ? "danger" : "warn"
                }`}
              >
                {Number(p.stock) === 0
                  ? "ناموجود"
                  : `${p.stock} عدد`}
              </span>
              <button
                className="admin-ghost-btn"
                onClick={() => onEdit(p)}
              >
                ویرایش
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* =============================================
   PRODUCTS LIST
============================================= */
function ProductsList({ products, onEdit, onNew }) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("همه");

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const q = query.trim().toLowerCase();
      const matchQ =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      const matchC = cat === "همه" || p.category === cat;
      return matchQ && matchC;
    });
  }, [products, query, cat]);

  const handleDelete = (p) => {
    if (
      window.confirm(
        `مطمئنی می‌خوای «${p.name}» رو حذف کنی؟ این عملیات برگشت‌پذیر نیست.`
      )
    ) {
      deleteProduct(p.id);
    }
  };

  return (
    <div className="admin-products">
      <div className="admin-toolbar">
        <input
          type="text"
          placeholder="جست‌وجو در محصولات..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select value={cat} onChange={(e) => setCat(e.target.value)}>
          <option value="همه">همه دسته‌ها</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <span className="admin-count">{filtered.length} محصول</span>
        <button className="admin-primary-btn small" onClick={onNew}>
          + محصول جدید
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="admin-empty-inline">محصولی پیدا نشد.</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>تصویر</th>
                <th>نام</th>
                <th>دسته</th>
                <th>تک‌فروشی</th>
                <th>عمده</th>
                <th>موجودی</th>
                <th>سایزها</th>
                <th>وضعیت</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="admin-thumb">
                      {p.image ? (
                        <img src={p.image} alt={p.name} />
                      ) : (
                        <span>?</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="admin-td-name">
                      <strong>{p.name}</strong>
                      <small>{p.badge || "—"}</small>
                    </div>
                  </td>
                  <td>{p.category}</td>
                  <td>{formatPrice(p.price)}</td>
                  <td>
                    {formatPrice(p.wholesalePrice)}
                    <br />
                    <small className="admin-mini">
                      حداقل {p.minWholesaleQty || 0} عدد
                    </small>
                  </td>
                  <td>
                    <span
                      className={`admin-stock-pill ${
                        Number(p.stock) === 0
                          ? "danger"
                          : Number(p.stock) < 10
                          ? "warn"
                          : "ok"
                      }`}
                    >
                      {p.stock || 0}
                    </span>
                  </td>
                  <td>
                    <div className="admin-sizes-mini">
                      {(p.sizes || []).map((s) => (
                        <span key={s}>{s}</span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <span
                      className={`admin-status-pill ${
                        p.active === false ? "off" : "on"
                      }`}
                    >
                      {p.active === false ? "غیرفعال" : "فعال"}
                    </span>
                  </td>
                  <td>
                    <div className="admin-row-actions">
                      <button
                        className="admin-ghost-btn"
                        onClick={() => onEdit(p)}
                      >
                        ویرایش
                      </button>
                      <button
                        className="admin-danger-btn"
                        onClick={() => handleDelete(p)}
                      >
                        حذف
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* =============================================
   PRODUCT FORM
============================================= */
function ProductForm({ editing, onDone, onCancel }) {
  const [form, setForm] = useState(emptyProduct);
  const [errors, setErrors] = useState({});
  const [newColor, setNewColor] = useState("#7a9b5c");
  const fileRef = useRef(null);

  useEffect(() => {
    if (editing) {
      setForm({
        ...emptyProduct,
        ...editing,
        sizes: editing.sizes || [],
        colors:
          editing.colors?.length > 0
            ? editing.colors
            : emptyProduct.colors,
      });
    } else {
      setForm(emptyProduct);
    }
    setErrors({});
  }, [editing]);

  const set = (key, value) =>
    setForm((f) => ({ ...f, [key]: value }));

  const toggleSize = (size) => {
    setForm((f) => ({
      ...f,
      sizes: f.sizes.includes(size)
        ? f.sizes.filter((s) => s !== size)
        : [...f.sizes, size],
    }));
  };

  const addColor = () => {
    if (!form.colors.includes(newColor)) {
      set("colors", [...form.colors, newColor]);
    }
  };

  const removeColor = (c) =>
    set("colors", form.colors.filter((x) => x !== c));

  const handleFile = (file) => {
    if (!file) return;
    if (file.size > 1.5 * 1024 * 1024) {
      alert("حجم تصویر باید کمتر از ۱.۵ مگابایت باشه.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => set("image", e.target.result);
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "نام محصول الزامی است";
    if (!form.price || Number(form.price) <= 0)
      e.price = "قیمت تک‌فروشی الزامی است";
    if (!form.stock && form.stock !== 0)
      e.stock = "موجودی الزامی است";
    if (form.sizes.length === 0)
      e.sizes = "حداقل یک سایز انتخاب کن";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = {
      ...form,
      price: Number(form.price),
      wholesalePrice: Number(form.wholesalePrice) || 0,
      oldPrice: Number(form.oldPrice) || 0,
      stock: Number(form.stock),
      minWholesaleQty: Number(form.minWholesaleQty) || 1,
      rating: Number(form.rating) || 4.5,
    };
    if (editing) {
      updateProduct(editing.id, payload);
    } else {
      addProduct(payload);
    }
    onDone();
  };

  return (
    <form className="admin-form" onSubmit={submit}>
      <div className="admin-form-head">
        <h3>{editing ? "ویرایش محصول" : "افزودن محصول جدید"}</h3>
        <button
          type="button"
          className="admin-ghost-btn"
          onClick={onCancel}
        >
          انصراف
        </button>
      </div>

      <div className="admin-form-grid">
        {/* نام */}
        <div className="admin-field full">
          <label>
            نام محصول <span>*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="مثلاً: کراپ تاپ نخی یقه گرد"
          />
          {errors.name && (
            <small className="admin-field-error">{errors.name}</small>
          )}
        </div>

        {/* دسته */}
        <div className="admin-field">
          <label>دسته‌بندی</label>
          <select
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* برچسب */}
        <div className="admin-field">
          <label>برچسب</label>
          <select
            value={form.badge}
            onChange={(e) => set("badge", e.target.value)}
          >
            {BADGES.map((b) => (
              <option key={b} value={b}>
                {b || "— بدون برچسب —"}
              </option>
            ))}
          </select>
        </div>

        {/* تک‌فروشی */}
        <div className="admin-field">
          <label>
            قیمت تک‌فروشی (تومان) <span>*</span>
          </label>
          <input
            type="number"
            value={form.price}
            onChange={(e) => set("price", e.target.value)}
            placeholder="480000"
          />
          {errors.price && (
            <small className="admin-field-error">{errors.price}</small>
          )}
        </div>

        {/* عمده */}
        <div className="admin-field">
          <label>قیمت عمده (تومان)</label>
          <input
            type="number"
            value={form.wholesalePrice}
            onChange={(e) => set("wholesalePrice", e.target.value)}
            placeholder="340000"
          />
        </div>

        {/* حداقل تعداد عمده */}
        <div className="admin-field">
          <label>حداقل تعداد عمده</label>
          <input
            type="number"
            value={form.minWholesaleQty}
            onChange={(e) => set("minWholesaleQty", e.target.value)}
            placeholder="10"
          />
        </div>

        {/* قیمت قبلی */}
        <div className="admin-field">
          <label>قیمت قبل از تخفیف</label>
          <input
            type="number"
            value={form.oldPrice}
            onChange={(e) => set("oldPrice", e.target.value)}
            placeholder="620000"
          />
        </div>

        {/* موجودی */}
        <div className="admin-field">
          <label>
            موجودی <span>*</span>
          </label>
          <input
            type="number"
            value={form.stock}
            onChange={(e) => set("stock", e.target.value)}
            placeholder="45"
          />
          {errors.stock && (
            <small className="admin-field-error">{errors.stock}</small>
          )}
        </div>

        {/* امتیاز */}
        <div className="admin-field">
          <label>امتیاز (۰ تا ۵)</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={form.rating}
            onChange={(e) => set("rating", e.target.value)}
          />
        </div>

        {/* توضیحات */}
        <div className="admin-field full">
          <label>توضیحات محصول</label>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="توضیح کوتاه درباره جنس، دوخت و کاربرد..."
          />
        </div>

        {/* سایزها */}
        <div className="admin-field full">
          <label>
            سایزها <span>*</span>
          </label>
          <div className="admin-chips">
            {SIZES.map((s) => (
              <button
                type="button"
                key={s}
                className={`admin-chip ${
                  form.sizes.includes(s) ? "active" : ""
                }`}
                onClick={() => toggleSize(s)}
              >
                {s}
              </button>
            ))}
          </div>
          {errors.sizes && (
            <small className="admin-field-error">{errors.sizes}</small>
          )}
        </div>

        {/* رنگ‌ها */}
        <div className="admin-field full">
          <label>رنگ‌ها</label>
          <div className="admin-colors-row">
            {form.colors.map((c) => (
              <button
                type="button"
                key={c}
                className="admin-color-chip"
                style={{ background: c }}
                onClick={() => removeColor(c)}
                title="حذف رنگ"
              >
                ×
              </button>
            ))}

            <div className="admin-color-add">
              <input
                type="color"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
              />
              <button
                type="button"
                className="admin-ghost-btn small"
                onClick={addColor}
              >
                + افزودن رنگ
              </button>
            </div>
          </div>
        </div>

        {/* تصویر */}
        <div className="admin-field full">
          <label>تصویر محصول</label>
          <div className="admin-image-row">
            <div className="admin-image-preview">
              {form.image ? (
                <img src={form.image} alt="preview" />
              ) : (
                <span>بدون تصویر</span>
              )}
            </div>
            <div className="admin-image-inputs">
              <input
                type="text"
                value={
                  form.image.startsWith("data:") ? "" : form.image
                }
                onChange={(e) => set("image", e.target.value)}
                placeholder="آدرس تصویر (URL)..."
              />
              <div className="admin-image-actions">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => handleFile(e.target.files[0])}
                />
                <button
                  type="button"
                  className="admin-ghost-btn"
                  onClick={() => fileRef.current?.click()}
                >
                  آپلود از سیستم
                </button>
                {form.image && (
                  <button
                    type="button"
                    className="admin-danger-btn"
                    onClick={() => set("image", "")}
                  >
                    حذف تصویر
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* وضعیت */}
        <div className="admin-field full">
          <label className="admin-switch">
            <input
              type="checkbox"
              checked={form.active !== false}
              onChange={(e) => set("active", e.target.checked)}
            />
            <span />
            نمایش محصول در فروشگاه
          </label>
        </div>
      </div>

      <div className="admin-form-actions">
        <button type="button" className="admin-ghost-btn" onClick={onCancel}>
          انصراف
        </button>
        <button type="submit" className="admin-primary-btn">
          {editing ? "ذخیره تغییرات" : "افزودن محصول"}
        </button>
      </div>
    </form>
  );
}

/* =============================================
   SETTINGS
============================================= */
function Settings() {
  const fileRef = useRef(null);

  const handleExport = () => {
    const json = exportProducts();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `saronak-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        importProducts(e.target.result);
        alert("محصولات با موفقیت ایمپورت شدند ✦");
      } catch (err) {
        alert("خطا در ایمپورت: " + err.message);
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (
      window.confirm(
        "همه تغییرات پاک می‌شود و محصولات به حالت اولیه برمی‌گردند. مطمئنی؟"
      )
    ) {
      resetProducts();
    }
  };

  return (
    <div className="admin-settings">
      <h3>تنظیمات و پشتیبان‌گیری</h3>

      <div className="admin-setting-card">
        <div>
          <strong>پشتیبان‌گیری از محصولات</strong>
          <small>یک فایل JSON از همه محصولات دانلود کن.</small>
        </div>
        <button className="admin-primary-btn small" onClick={handleExport}>
          دانلود پشتیبان
        </button>
      </div>

      <div className="admin-setting-card">
        <div>
          <strong>بازگردانی از فایل پشتیبان</strong>
          <small>فایل JSON را انتخاب کن تا محصولات جایگزین شوند.</small>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          style={{ display: "none" }}
          onChange={(e) => handleImport(e.target.files[0])}
        />
        <button
          className="admin-ghost-btn"
          onClick={() => fileRef.current?.click()}
        >
          انتخاب فایل
        </button>
      </div>

      <div className="admin-setting-card danger">
        <div>
          <strong>بازنشانی کامل</strong>
          <small>
            همه محصولات به حالت اولیه برمی‌گردند. غیرقابل بازگشت.
          </small>
        </div>
        <button className="admin-danger-btn" onClick={handleReset}>
          بازنشانی
        </button>
      </div>

      <div className="admin-setting-note">
        <strong>نکته امنیتی:</strong> رمز عبور و داده‌ها فقط در
        مرورگر همین دستگاه ذخیره می‌شوند. برای محیط واقعی باید به یک
        سرور و دیتابیس متصل شود.
      </div>
    </div>
  );
}

/* =============================================
   MAIN PANEL
============================================= */
export default function AdminPanel({ open, onClose }) {
  const [logged, setLogged] = useState(isLoggedIn());
  const [tab, setTab] = useState("dashboard");
  const [editing, setEditing] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const products = useStoreProducts();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      setFormOpen(false);
      setEditing(null);
    }
  }, [open]);

  if (!open) return null;

  const handleNew = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const handleEdit = (p) => {
    setEditing(p);
    setFormOpen(true);
  };

  const handleDone = () => {
    setFormOpen(false);
    setEditing(null);
    setTab("products");
  };

  const handleLogout = () => {
    logout();
    setLogged(false);
  };

  return (
    <div className="admin-shell" role="dialog" aria-modal="true">
      <div className="admin-overlay" onClick={onClose} />

      <div className="admin-window">
        {/* Topbar */}
        <div className="admin-topbar">
          <div className="admin-topbar-brand">
            <span className="admin-logo-dot" />
            <strong>پنل مدیریت ساروناک</strong>
          </div>

          <div className="admin-topbar-actions">
            {logged && (
              <button
                className="admin-ghost-btn small"
                onClick={handleLogout}
              >
                خروج
              </button>
            )}
            <button
              className="admin-close-btn"
              onClick={onClose}
              aria-label="بستن"
            >
              ×
            </button>
          </div>
        </div>

        {!logged ? (
          <LoginScreen onSuccess={() => setLogged(true)} />
        ) : (
          <div className="admin-body">
            {/* Sidebar */}
            <aside className="admin-sidebar">
              <button
                className={`admin-nav-item ${
                  tab === "dashboard" ? "active" : ""
                }`}
                onClick={() => {
                  setTab("dashboard");
                  setFormOpen(false);
                }}
              >
                <span>📊</span> داشبورد
              </button>
              <button
                className={`admin-nav-item ${
                  tab === "products" ? "active" : ""
                }`}
                onClick={() => {
                  setTab("products");
                  setFormOpen(false);
                }}
              >
                <span>📦</span> محصولات
              </button>
              <button
                className={`admin-nav-item ${
                  tab === "add" ? "active" : ""
                }`}
                onClick={() => {
                  setTab("add");
                  setEditing(null);
                  setFormOpen(true);
                }}
              >
                <span>➕</span> افزودن محصول
              </button>
              <button
                className={`admin-nav-item ${
                  tab === "settings" ? "active" : ""
                }`}
                onClick={() => {
                  setTab("settings");
                  setFormOpen(false);
                }}
              >
                <span>⚙️</span> تنظیمات
              </button>
            </aside>

            {/* Main */}
            <main className="admin-main">
              {formOpen ? (
                <ProductForm
                  editing={editing}
                  onDone={handleDone}
                  onCancel={() => {
                    setFormOpen(false);
                    setEditing(null);
                  }}
                />
              ) : (
                <>
                  {tab === "dashboard" && (
                    <Dashboard
                      products={products}
                      onEdit={handleEdit}
                      onNew={handleNew}
                    />
                  )}
                  {tab === "products" && (
                    <ProductsList
                      products={products}
                      onEdit={handleEdit}
                      onNew={handleNew}
                    />
                  )}
                  {tab === "settings" && <Settings />}
                </>
              )}
            </main>
          </div>
        )}
      </div>
    </div>
  );
}