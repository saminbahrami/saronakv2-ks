import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import AdminPanel from "./AdminPanel";
import { getProducts, subscribe } from "./store";

/* =============================================
   DATA
============================================= */

const categories = [
  { name: "همه", icon: "✦" },
  { name: "کراپ تاپ", icon: "◐" },
  { name: "تاپ", icon: "◇" },
  { name: "دامن", icon: "◈" },
  { name: "شورت", icon: "⌁" },
  { name: "سوتین", icon: "♡" },
  { name: "ست", icon: "✧" },
];

const formatPrice = (p) =>
  new Intl.NumberFormat("fa-IR").format(p) + " تومان";

/* =============================================
   HOOK
============================================= */
function useScrollReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("revealed");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    el.querySelectorAll("[data-reveal]").forEach((t) => obs.observe(t));
    return () => obs.disconnect();
  });
  return ref;
}

/* =============================================
   APP
============================================= */
function App() {
  const [activeCategory, setActiveCategory] = useState("همه");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [quickView, setQuickView] = useState(null);
  const [toast, setToast] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
const [products, setProducts] = useState(getProducts());

  const rootRef = useScrollReveal();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);
      setShowTop(window.scrollY > 600);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow =
      showCart || quickView ? "hidden" : "";
  }, [showCart, quickView]);
  useEffect(() => {
    const unsub = subscribe(setProducts);
    return unsub;
  }, []);

  const filteredProducts = useMemo(
    () =>
      products.filter((p) => {
        const catMatch =
          activeCategory === "همه" || p.category === activeCategory;
        const searchMatch = p.name
          .toLowerCase()
          .includes(search.trim().toLowerCase());
        return catMatch && searchMatch;
      }),
    [activeCategory, search]
  );

  const showToastMsg = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  const addToCart = (product) => {
    setCart((cur) => {
      const found = cur.find((i) => i.id === product.id);
      if (found) {
        return cur.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...cur, { ...product, quantity: 1 }];
    });
    showToastMsg(`«${product.name}» به سبد اضافه شد`);
  };

  const removeFromCart = (id) =>
    setCart((cur) => cur.filter((i) => i.id !== id));

  const changeQty = (id, delta) =>
    setCart((cur) =>
      cur
        .map((i) =>
          i.id === id ? { ...i, quantity: i.quantity + delta } : i
        )
        .filter((i) => i.quantity > 0)
    );

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = cart.reduce(
    (s, i) => s + i.price * i.quantity,
    0
  );

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenu(false);
  };

  return (
    <div className="app" ref={rootRef}>
      <div className="announcement">
        <div className="announcement-track">
          <span>✦ ارسال رایگان برای سفارش‌های بالای ۲ میلیون تومان</span>
          <span>✦ ۲۰٪ تخفیف اولین خرید با کد SARONAK20</span>
          <span>✦ بازگشت آسان تا ۷ روز</span>
          <span>✦ ارسال رایگان برای سفارش‌های بالای ۲ میلیون تومان</span>
          <span>✦ ۲۰٪ تخفیف اولین خرید با کد SARONAK20</span>
          <span>✦ بازگشت آسان تا ۷ روز</span>
        </div>
      </div>

      <header className={`header ${scrolled ? "scrolled" : ""}`}>
        <div className="header-inner">
          <button
            className="mobile-menu-button"
            onClick={() => setMobileMenu(!mobileMenu)}
            aria-label="منو"
          >
            <span />
            <span />
            <span />
          </button>

          <a className="logo" onClick={() => scrollTo("home")}>
            <span className="logo-symbol">S</span>
            <span className="logo-text">
              <strong>ساروناک</strong>
              <small>SARONAK</small>
            </span>
          </a>

          <nav className={`main-nav ${mobileMenu ? "open" : ""}`}>
            <a onClick={() => scrollTo("home")}>خانه</a>
            <a onClick={() => scrollTo("products")}>فروشگاه</a>
            <a onClick={() => scrollTo("categories")}>دسته‌بندی‌ها</a>
            <a onClick={() => scrollTo("discount")}>تخفیف‌ها</a>
            <a onClick={() => scrollTo("about")}>درباره ما</a>
          </nav>

          <div className="header-actions">
            <div className="search-box">
              <span className="search-icon">⌕</span>
              <input
                type="text"
                placeholder="جست‌وجوی محصول..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  className="search-clear"
                  onClick={() => setSearch("")}
                  aria-label="پاک کردن"
                >
                  ×
                </button>
              )}
            </div>

            <button
              className="cart-button"
              onClick={() => setShowCart(true)}
              aria-label="سبد خرید"
            >
              <span className="cart-icon">🛍</span>
              <span className="cart-label">سبد خرید</span>
              {cartCount > 0 && (
                <span className="cart-count">{cartCount}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-glow hero-glow-1" />
          <div className="hero-glow hero-glow-2" />
          <div className="hero-glow hero-glow-3" />

          <div className="hero-content">
            <span className="eyebrow">
              <i />
              کالکشن جدید بهار ۱۴۰۵
            </span>

            <h1>
              هر تکه،
              <br />
              <span>یک امضاست.</span>
            </h1>

            <p>
              پوشاک و اکسسوری زنانه با کیفیت بالا، طراحی مینیمال و
              رنگ‌بندی متفاوت. ساروناک جایی‌ست که استایل تو معنا پیدا
              می‌کند.
            </p>

            <div className="hero-buttons">
              <button
                className="primary-button"
                onClick={() => scrollTo("products")}
              >
                مشاهده محصولات
                <span>←</span>
              </button>
              <button
                className="secondary-button"
                onClick={() => scrollTo("categories")}
              >
                دسته‌بندی‌ها
              </button>
            </div>

            <div className="hero-stats">
              <div>
                <strong>+۵۰۰</strong>
                <span>محصول منتخب</span>
              </div>
              <div className="divider" />
              <div>
                <strong>+۱۲K</strong>
                <span>مشتری راضی</span>
              </div>
              <div className="divider" />
              <div>
                <strong>۴.۹</strong>
                <span>امتیاز کاربران</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-blob" />
            <div className="hero-image-wrapper">
              <img
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=90"
                alt="Saronak Collection"
              />
            </div>

            <div className="floating-card floating-top">
              <span className="floating-icon">✦</span>
              <div>
                <strong>ارسال سریع</strong>
                <small>۲۴ ساعت بعد</small>
              </div>
            </div>

            <div className="floating-card floating-bottom">
              <div className="rating-stars">★★★★★</div>
              <small>۴.۹ از ۱۲,۰۰۰ نظر</small>
            </div>

            <div className="hero-badge">۲۰٪ تخفیف</div>
          </div>
        </section>

        <section className="features-strip" data-reveal>
          <div className="feature-item">
            <span className="feature-icon">🚚</span>
            <div>
              <strong>ارسال رایگان</strong>
              <small>سفارش بالای ۲ میلیون</small>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">↺</span>
            <div>
              <strong>بازگشت آسان</strong>
              <small>تا ۷ روز</small>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🔒</span>
            <div>
              <strong>پرداخت امن</strong>
              <small>درگاه معتبر</small>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">♡</span>
            <div>
              <strong>پشتیبانی ۲۴/۷</strong>
              <small>همیشه در دسترس</small>
            </div>
          </div>
        </section>

        <section className="categories-section" id="categories">
          <div className="section-heading centered" data-reveal>
            <span className="eyebrow">انتخاب کن و بدرخش</span>
            <h2>دسته‌بندی‌های ساروناک</h2>
            <p>چیزی که دنبالشی، در چند قدمی توست.</p>
          </div>

          <div className="category-grid">
            {categories.slice(1).map((cat, i) => (
              <button
                className="category-card"
                key={cat.name}
                data-reveal
                style={{ "--delay": `${i * 0.06}s` }}
                onClick={() => {
                  setActiveCategory(cat.name);
                  scrollTo("products");
                }}
              >
                <span className="category-icon">{cat.icon}</span>
                <strong>{cat.name}</strong>
                <span className="category-arrow">←</span>
              </button>
            ))}
          </div>
        </section>

        <section className="products-section" id="products">
          <div className="section-heading" data-reveal>
            <div>
              <span className="eyebrow">منتخب ساروناک</span>
              <h2>محصولات محبوب</h2>
            </div>
            <p>جدیدترین انتخاب‌ها برای استایل روزمره و خاص تو.</p>
          </div>

          <div className="filter-row" data-reveal>
            <div className="filter-tabs">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  className={activeCategory === cat.name ? "active" : ""}
                  onClick={() => setActiveCategory(cat.name)}
                >
                  {cat.name}
                </button>
              ))}
            </div>
            <span className="product-result">
              {filteredProducts.length} محصول
            </span>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="products-grid">
              {filteredProducts.map((product, i) => (
                <article
                  className="product-card"
                  key={product.id}
                  data-reveal
                  style={{ "--delay": `${i * 0.05}s` }}
                >
                  <div className="product-image">
                    <img src={product.image} alt={product.name} />

                    {product.badge && (
                      <span className="product-badge">
                        {product.badge}
                      </span>
                    )}

                    <div className="product-hover-actions">
                      <button
                        className="quick-add"
                        onClick={() => addToCart(product)}
                      >
                        افزودن به سبد
                      </button>
                      <button
                        className="quick-view-btn"
                        onClick={() => setQuickView(product)}
                      >
                        نمایش سریع
                      </button>
                    </div>
                  </div>

                  <div className="product-info">
                    <span className="product-category">
                      {product.category}
                    </span>
                    <h3>{product.name}</h3>

                    <div className="product-colors">
                      {product.colors.map((c, idx) => (
                        <span key={idx} style={{ background: c }} />
                      ))}
                    </div>

                    <div className="product-bottom">
                      <div className="prices">
                        <strong>{formatPrice(product.price)}</strong>
                        {product.oldPrice && (
                          <del>{formatPrice(product.oldPrice)}</del>
                        )}
                      </div>
                      <div className="product-rating">
                        ★ {product.rating}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-products" data-reveal>
              <span>⌕</span>
              <h3>محصولی پیدا نشد</h3>
              <p>عبارت یا دسته‌بندی دیگری را امتحان کن.</p>
              <button
                className="primary-button"
                onClick={() => {
                  setSearch("");
                  setActiveCategory("همه");
                }}
              >
                نمایش همه محصولات
              </button>
            </div>
          )}
        </section>

        <section className="discount-section" id="discount" data-reveal>
          <div className="discount-glow" />
          <div className="discount-content">
            <span className="discount-label">پیشنهاد محدود</span>
            <h2>
              برای استایل جدیدت
              <br />
              <span>۲۰٪ تخفیف</span>
            </h2>
            <p>
              با خرید از کالکشن منتخب ساروناک، کد تخفیف اختصاصی خودت
              را دریافت کن. فقط تا پایان هفته.
            </p>
            <button
              className="light-button"
              onClick={() => scrollTo("products")}
            >
              خرید از کالکشن
              <span>←</span>
            </button>
          </div>
          <div className="discount-shape">
            <span>۲۰٪</span>
            <small>OFF</small>
          </div>
        </section>

        <section className="features-section" id="about">
          <div className="section-heading centered" data-reveal>
            <span className="eyebrow">چرا ساروناک؟</span>
            <h2>تجربه‌ای فراتر از خرید</h2>
            <p>چیزهایی که ما را متفاوت می‌کند.</p>
          </div>

          <div className="features-grid">
            {[
              { icon: "✦", title: "انتخاب دقیق", text: "هر محصول با دقت انتخاب می‌شود تا کیفیت و زیبایی کنار هم باشند." },
              { icon: "↝", title: "ارسال سریع", text: "سفارش تو با بسته‌بندی زیبا و در سریع‌ترین زمان ارسال می‌شود." },
              { icon: "♡", title: "تجربه شخصی", text: "خرید آنلاین برایت ساده، سریع و لذت‌بخش خواهد بود." },
              { icon: "◌", title: "پشتیبانی همراه", text: "قبل و بعد از خرید می‌توانی روی تیم ساروناک حساب کنی." },
            ].map((f, i) => (
              <div
                className="feature-card"
                key={i}
                data-reveal
                style={{ "--delay": `${i * 0.07}s` }}
              >
                <div className="feature-card-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="testimonials-section" data-reveal>
          <div className="section-heading centered">
            <span className="eyebrow">نظر مشتریان</span>
            <h2>دوستش داشتند</h2>
          </div>

          <div className="testimonials-grid">
            {[
              { name: "نگار ر.", role: "مشتری همیشگی", text: "کیفیت پارچه‌ها واقعاً عالیه. بعد از چند بار شست‌وشو هم رنگ و فرمشون حفظ شده." },
              { name: "هستی م.", role: "خریدار ست", text: "بسته‌بندی خیلی شیک و حرفه‌ای بود. حس خوبی داشت باز کردنش. حتماً باز خرید می‌کنم." },
              { name: "پریسا ک.", role: "مشتری جدید", text: "پشتیبانی سریع جواب داد و راهنمایی دقیق کرد. تجربه خرید بی‌نقص بود." },
            ].map((t, i) => (
              <div
                className="testimonial-card"
                key={i}
                style={{ "--delay": `${i * 0.08}s` }}
              >
                <div className="testimonial-stars">★★★★★</div>
                <p>«{t.text}»</p>
                <div className="testimonial-author">
                  <div className="author-avatar">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <strong>{t.name}</strong>
                    <small>{t.role}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="newsletter-section" data-reveal>
          <div className="newsletter-inner">
            <div className="newsletter-content">
              <span className="eyebrow">SARONAK CLUB</span>
              <h2>از کالکشن‌های جدید جا نمان.</h2>
              <p>
                برای دریافت خبرهای جدید، تخفیف‌ها و محصولات تازه،
                عضو باشگاه ساروناک شو.
              </p>
            </div>

            <form
              className="newsletter-form"
              onSubmit={(e) => {
                e.preventDefault();
                showToastMsg("عضویت شما با موفقیت ثبت شد ✦");
                e.target.reset();
              }}
            >
              <input
                type="email"
                placeholder="ایمیل خود را وارد کنید"
                required
                aria-label="ایمیل"
              />
              <button type="submit">عضویت</button>
            </form>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="logo footer-logo">
              <span className="logo-symbol">S</span>
              <span className="logo-text">
                <strong>ساروناک</strong>
                <small>SARONAK</small>
              </span>
            </div>
            <p>
              ساروناک، جایی برای پیدا کردن استایل شخصی تو. پوشاک و
              اکسسوری‌های منتخب با یک تجربه خرید ساده و متفاوت.
            </p>
            <div className="socials">
              <a href="#instagram" aria-label="اینستاگرام">IG</a>
              <a href="#telegram" aria-label="تلگرام">TG</a>
              <a href="#whatsapp" aria-label="واتساپ">WA</a>
            </div>
          </div>

          <div className="footer-column">
            <h3>فروشگاه</h3>
            <a onClick={() => scrollTo("products")}>همه محصولات</a>
            <a onClick={() => scrollTo("products")}>جدیدترین‌ها</a>
            <a onClick={() => scrollTo("discount")}>تخفیف‌ها</a>
            <a onClick={() => scrollTo("categories")}>دسته‌بندی‌ها</a>
          </div>

          <div className="footer-column">
            <h3>راهنما</h3>
            <a href="#size">راهنمای سایز</a>
            <a href="#shipping">روش‌های ارسال</a>
            <a href="#returns">شرایط بازگشت</a>
            <a href="#faq">سؤالات متداول</a>
          </div>

          <div className="footer-column">
            <h3>ارتباط با ما</h3>
            <a href="tel:+982100000000">۰۲۱-۰۰۰۰۰۰۰۰</a>
            <a href="mailto:hello@saronak.ir">hello@saronak.ir</a>
            <span>شنبه تا پنجشنبه، ۹ تا ۲۱</span>
          </div>
        </div>

      <div className="footer-bottom">
        <span>© ۱۴۰۵ ساروناک. تمام حقوق محفوظ است.</span>
        <span>
          ساخته شده با ♡ برای یک تجربه بهتر. ·{" "}
          <a
            onClick={() => setShowAdmin(true)}
            style={{ cursor: "pointer", textDecoration: "underline" }}
          >
            پنل مدیریت
          </a>
        </span>
      </div>
    </footer>
      <div
        className={`overlay ${showCart ? "visible" : ""}`}
        onClick={() => setShowCart(false)}
      />

      <aside className={`drawer cart-drawer ${showCart ? "open" : ""}`}>
        <div className="drawer-header">
          <div>
            <span className="eyebrow">YOUR BAG</span>
            <h2>سبد خرید</h2>
          </div>
          <button
            className="close-button"
            onClick={() => setShowCart(false)}
            aria-label="بستن"
          >
            ×
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="empty-state">
            <span>🛍</span>
            <h3>سبد خرید خالی است</h3>
            <p>محصول مورد علاقه‌ات را به سبد اضافه کن.</p>
            <button
              className="primary-button"
              onClick={() => {
                setShowCart(false);
                scrollTo("products");
              }}
            >
              مشاهده محصولات
            </button>
          </div>
        ) : (
          <>
            <div className="drawer-items">
              {cart.map((item) => (
                <div className="cart-item" key={item.id}>
                  <img src={item.image} alt={item.name} />
                  <div className="cart-item-info">
                    <h3>{item.name}</h3>
                    <span>{formatPrice(item.price)}</span>
                    <div className="qty-controls">
                      <button
                        onClick={() => changeQty(item.id, -1)}
                        aria-label="کاهش"
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => changeQty(item.id, 1)}
                        aria-label="افزایش"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    className="remove-item"
                    onClick={() => removeFromCart(item.id)}
                    aria-label="حذف"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div className="drawer-summary">
              <div className="summary-row">
                <span>جمع کل</span>
                <strong>{formatPrice(cartTotal)}</strong>
              </div>
              <div className="summary-row muted">
                <span>هزینه ارسال</span>
                <span>
                  {cartTotal > 2000000
                    ? "رایگان"
                    : "محاسبه در مرحله بعد"}
                </span>
              </div>
              <button className="checkout-button">
                ادامه و ثبت سفارش
                <span>←</span>
              </button>
            </div>
          </>
        )}
      </aside>

      <div
        className={`overlay ${quickView ? "visible" : ""}`}
        onClick={() => setQuickView(null)}
      />

      {quickView && (
        <div className="quick-view-modal">
          <div className="quick-view-content">
            <button
              className="close-button"
              onClick={() => setQuickView(null)}
              aria-label="بستن"
            >
              ×
            </button>

            <div className="quick-view-image">
              <img src={quickView.image} alt={quickView.name} />
            </div>

            <div className="quick-view-info">
              <span className="eyebrow">{quickView.category}</span>
              <h2>{quickView.name}</h2>

              <div className="quick-view-rating">
                ★ {quickView.rating} · {quickView.badge}
              </div>

              <p>
                کیفیت بالا، طراحی مینیمال و دوخت تمیز. این محصول از
                کالکشن جدید ساروناک است و در رنگ‌ها و سایزهای مختلف
                موجود می‌باشد.
              </p>

              <div className="quick-view-colors">
                <span>رنگ‌های موجود:</span>
                <div>
                  {quickView.colors.map((c, i) => (
                    <span
                      key={i}
                      style={{ background: c }}
                      className="color-dot"
                    />
                  ))}
                </div>
              </div>

              <div className="quick-view-prices">
                <strong>{formatPrice(quickView.price)}</strong>
                {quickView.oldPrice && (
                  <del>{formatPrice(quickView.oldPrice)}</del>
                )}
              </div>

              <div className="quick-view-actions">
                <button
                  className="primary-button"
                  onClick={() => {
                    addToCart(quickView);
                    setQuickView(null);
                  }}
                >
                  افزودن به سبد
                  <span>🛍</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={`toast ${toast ? "visible" : ""}`}>
        <span>✦</span>
        {toast}
      </div>

      <button
        className={`scroll-top ${showTop ? "visible" : ""}`}
        onClick={() =>
          window.scrollTo({ top: 0, behavior: "smooth" })
        }
        aria-label="بازگشت به بالا"
      >
        ↑
      </button>

      <button
        onClick={() => setShowAdmin(true)}
        aria-label="پنل مدیریت"
        style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: "#3f1f30",
          color: "#fff",
          fontSize: "22px",
          display: "grid",
          placeItems: "center",
          boxShadow: "0 14px 30px rgba(63, 31, 48, 0.35)",
          zIndex: 95,
          cursor: "pointer",
        }}
      >
        ⚙
      </button>

      <AdminPanel open={showAdmin} onClose={() => setShowAdmin(false)} />    </div>
  );
}

export default App;