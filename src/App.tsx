import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowLeftRight,
  ArrowUpLeft,
  Check,
  ChevronDown,
  Heart,
  Menu,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Star,
  Truck,
  X,
} from "lucide-react";
import "./index.css";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  image: string;
  badge?: string;
  tone: string;
};
type CartLine = { product: Product; quantity: number };

const products: Product[] = [
  { id: 1, name: "حقيبة كتف جلدية", category: "حقائب", price: 289, oldPrice: 360, image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85", badge: "الأكثر مبيعاً", tone: "#f2e9df" },
  { id: 2, name: "ساعة كلاسيكية — ذهبي", category: "إكسسوارات", price: 425, image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=900&q=85", badge: "وصل حديثاً", tone: "#e9e7e1" },
  { id: 3, name: "نظارة شمسية أورا", category: "إكسسوارات", price: 195, oldPrice: 240, image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=85", tone: "#e8e8e4" },
  { id: 4, name: "حذاء يومي — عاجي", category: "أحذية", price: 345, image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=85", badge: "اختيارنا", tone: "#ede9e2" },
  { id: 5, name: "حقيبة ميني كلاود", category: "حقائب", price: 230, image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=85", tone: "#ece6e0" },
  { id: 6, name: "سوار لين — فضي", category: "إكسسوارات", price: 155, image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=900&q=85", tone: "#e8e6e2" },
  { id: 7, name: "حذاء سنيكرز ستوديو", category: "أحذية", price: 390, oldPrice: 450, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85", badge: "خصم ١٣٪", tone: "#eee9e4" },
  { id: 8, name: "محفظة جلدية صغيرة", category: "حقائب", price: 175, image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=85", tone: "#e9e5df" },
];
const categories = ["الكل", "حقائب", "إكسسوارات", "أحذية"];
const formatPrice = (price: number) => `${price.toLocaleString("ar-SA")} ر.س`;

export default function App() {
  const [cart, setCart] = useState<CartLine[]>(() => {
    try { return JSON.parse(localStorage.getItem("nova-cart") || "[]") as CartLine[]; } catch { return []; }
  });
  const [category, setCategory] = useState("الكل");
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [toast, setToast] = useState("");
  const [sort, setSort] = useState("featured");
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => { localStorage.setItem("nova-cart", JSON.stringify(cart)); }, [cart]);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const visibleProducts = useMemo(() => {
    const list = products.filter((p) => (category === "الكل" || p.category === category) && p.name.includes(query.trim()));
    if (sort === "price-low") return [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-high") return [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [category, query, sort]);
  const itemCount = cart.reduce((sum, line) => sum + line.quantity, 0);
  const subtotal = cart.reduce((sum, line) => sum + line.product.price * line.quantity, 0);

  function addToCart(product: Product) {
    setCart((current) => {
      const existing = current.find((line) => line.product.id === product.id);
      return existing
        ? current.map((line) => line.product.id === product.id ? { ...line, quantity: line.quantity + 1 } : line)
        : [...current, { product, quantity: 1 }];
    });
    setToast("أُضيف المنتج إلى حقيبتك");
  }
  function changeQuantity(id: number, amount: number) {
    setCart((current) => current.map((line) => line.product.id === id ? { ...line, quantity: line.quantity + amount } : line).filter((line) => line.quantity > 0));
  }
  function toggleFavorite(id: number) {
    setFavorites((current) => current.includes(id) ? current.filter((value) => value !== id) : [...current, id]);
  }

  return (
    <div className="store" dir="rtl">
      <div className="announcement"><span>توصيل مجاني للطلبات فوق ٣٠٠ ر.س</span><span className="announcement-sep">✦</span><span>تسوّق مجموعتنا الجديدة الآن</span><ArrowLeft size={14} /></div>
      <header className="header">
        <button className="mobile-menu icon-button" aria-label="القائمة"><Menu /></button>
        <nav className="nav-links"><a href="#collection">تسوّق</a><a href="#collection">المجموعات</a><a href="#about">قصتنا</a><a href="#footer">تواصل معنا</a></nav>
        <a className="brand" href="#top" aria-label="نوفا الرئيسية">NOVA<span>.</span></a>
        <div className="header-actions">
          <button className="icon-button" aria-label="بحث" onClick={() => setSearchOpen((open) => !open)}><Search /></button>
          <button className="icon-button favorite-head" aria-label="المفضلة" onClick={() => setToast(favorites.length ? `لديك ${favorites.length} منتجات في المفضلة` : "قائمة المفضلة فارغة")}><Heart />{favorites.length > 0 && <i>{favorites.length}</i>}</button>
          <button className="icon-button bag-button" aria-label="حقيبة التسوق" onClick={() => setCartOpen(true)}><ShoppingBag />{itemCount > 0 && <i>{itemCount}</i>}</button>
        </div>
      </header>
      {searchOpen && <div className="search-strip"><Search size={18} /><input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ابحث عن منتجك المفضل..." /><button onClick={() => { setQuery(""); setSearchOpen(false); }} aria-label="إغلاق البحث"><X size={18} /></button></div>}

      <main id="top">
        <section className="hero">
          <img className="hero-image" src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2200&q=90" alt="مجموعة أزياء وإكسسوارات نوفا" />
          <div className="hero-shade" />
          <div className="hero-content"><span className="eyebrow light"><Sparkles size={14} /> مجموعة الموسم الجديد</span><h1>تفاصيل صغيرة،<br />أناقة <em>كبيرة.</em></h1><p>قطع مختارة بعناية لترافقك في كل لحظة،<br className="desktop-break" /> بجودة تحبينها وأسلوب يشبهك.</p><a className="button button-light" href="#collection">اكتشفي المجموعة <ArrowLeft size={17} /></a></div>
          <div className="hero-count"><span>01</span><i /> 03</div>
          <div className="hero-note">صُنعت لتدوم <span>—</span> اختيرت لك</div>
        </section>

        <section className="benefits" aria-label="مميزات التسوق"><div><Truck /><span><b>توصيل سريع</b><small>لكل أنحاء المملكة</small></span></div><div><ArrowLeftRight /><span><b>استبدال سهل</b><small>خلال ١٤ يوماً</small></span></div><div><Check /><span><b>دفع آمن</b><small>تجربة تسوق موثوقة</small></span></div><div><Star /><span><b>جودة مختارة</b><small>تفاصيل تصنع الفرق</small></span></div></section>

        <section className="collection section-wrap" id="collection">
          <div className="section-heading"><div><span className="eyebrow">مختارة لك</span><h2>قطع تستحق <em>الاقتناء</em></h2></div><a className="text-link" href="#collection">تسوقي كل المنتجات <ArrowLeft size={16} /></a></div>
          <div className="collection-tools"><div className="category-tabs">{categories.map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div><label className="sort-select"><SlidersHorizontal size={15} /><select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="ترتيب المنتجات"><option value="featured">ترتيب حسب: الأبرز</option><option value="price-low">السعر: من الأقل</option><option value="price-high">السعر: من الأعلى</option></select><ChevronDown size={14} /></label></div>
          <div className="product-grid">{visibleProducts.map((product) => <article className="product-card" key={product.id}>
            <div className="product-photo" style={{ backgroundColor: product.tone }} onClick={() => setSelected(product)} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && setSelected(product)}>
              <img src={product.image} alt={product.name} loading="lazy" />{product.badge && <span className="product-badge">{product.badge}</span>}
              <button className={`favorite-button ${favorites.includes(product.id) ? "is-favorite" : ""}`} aria-label="أضف للمفضلة" onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id); }}><Heart size={17} fill={favorites.includes(product.id) ? "currentColor" : "none"} /></button>
              <button className="quick-add" onClick={(e) => { e.stopPropagation(); addToCart(product); }}>أضيفي إلى الحقيبة <Plus size={15} /></button>
            </div>
            <button className="product-info" onClick={() => setSelected(product)}><span className="product-category">{product.category}</span><span className="product-name">{product.name}</span><span className="product-price">{formatPrice(product.price)} {product.oldPrice && <del>{formatPrice(product.oldPrice)}</del>}</span></button>
          </article>)}</div>
          {visibleProducts.length === 0 && <p className="empty-results">لم نعثر على منتجات مطابقة. جرّبي كلمة بحث أخرى.</p>}
          <a className="button button-outline all-products" href="#collection">اكتشفي جميع القطع <ArrowLeft size={16} /></a>
        </section>

        <section className="editorial section-wrap" id="about"><div className="editorial-image"><img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=85" alt="أناقة يومية من نوفا" loading="lazy" /><span className="image-caption">NOVA — EST. 2024</span></div><div className="editorial-copy"><span className="eyebrow">فلسفة نوفا</span><h2>أسلوبكِ،<br />بكل <em>بساطة.</em></h2><p>نؤمن أن الأناقة الحقيقية لا تحتاج إلى ضجيج. لهذا نختار لكِ قطعاً عملية، جميلة، ومصممة لتكون جزءاً من حكايتك كل يوم.</p><a className="text-link" href="#footer">اكتشفي قصتنا <ArrowLeft size={16} /></a><span className="editorial-mark">N.</span></div></section>

        <section className="newsletter"><span className="eyebrow light">رسائل من نوفا</span><h2>كوني أول من <em>يعرف.</em></h2><p>اشتركي لتصلك أحدث المجموعات والعروض الخاصة.</p><form onSubmit={(e) => { e.preventDefault(); if (email.includes("@")) { setSubscribed(true); setEmail(""); } }}><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="بريدك الإلكتروني" aria-label="بريدك الإلكتروني" /><button type="submit">{subscribed ? "تم الاشتراك ✓" : "اشتركي الآن"}<ArrowLeft size={16} /></button></form><small>بانضمامك توافقين على سياسة الخصوصية الخاصة بنا.</small></section>
      </main>

      <footer className="footer" id="footer"><div className="footer-top"><div className="footer-brand"><a className="brand" href="#top">NOVA<span>.</span></a><p>اختيارات يومية، بتفاصيل تدوم.</p><div className="socials"><a href="#footer" aria-label="انستغرام">ig</a><a href="#footer" aria-label="تيك توك">tk</a><a href="#footer" aria-label="سناب شات">sc</a></div></div><div className="footer-column"><b>تسوقي</b><a href="#collection">وصل حديثاً</a><a href="#collection">الأكثر مبيعاً</a><a href="#collection">حقائب</a><a href="#collection">إكسسوارات</a></div><div className="footer-column"><b>مساعدتك</b><a href="#footer">الشحن والتوصيل</a><a href="#footer">الاستبدال والاسترجاع</a><a href="#footer">الأسئلة الشائعة</a><a href="mailto:hello@nova.example">تواصلي معنا</a></div><div className="footer-column"><b>نوفا</b><a href="#about">قصتنا</a><a href="#footer">سياسة الخصوصية</a><a href="#footer">الشروط والأحكام</a><span>السبت – الخميس، ٩ص إلى ٥م</span></div></div><div className="footer-bottom"><span>© ٢٠٢٤ نوفا. جميع الحقوق محفوظة.</span><span>صُنع بكل عناية <Heart size={13} /></span><span>السعودية · ر.س</span></div></footer>

      {cartOpen && <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && setCartOpen(false)}><aside className="cart-drawer" dir="rtl"><div className="drawer-heading"><div><span className="eyebrow">اختيارا��ك</span><h3>حقيبة التسوق <small>({itemCount})</small></h3></div><button className="icon-button" onClick={() => setCartOpen(false)} aria-label="إغلاق"><X /></button></div>{cart.length === 0 ? <div className="cart-empty"><ShoppingBag size={36} /><h3>حقيبتك فارغة</h3><p>اكتشفي القطع التي اخترناها لك.</p><button className="button button-dark" onClick={() => setCartOpen(false)}>ابدئي التسوق <ArrowLeft size={16} /></button></div> : <><div className="cart-lines">{cart.map(({ product, quantity }) => <div className="cart-line" key={product.id}><img src={product.image} alt={product.name} /><div className="cart-line-info"><b>{product.name}</b><span>{formatPrice(product.price)}</span><div className="quantity"><button aria-label="تقليل الكمية" onClick={() => changeQuantity(product.id, -1)}><Minus size={13} /></button><span>{quantity}</span><button aria-label="زيادة الكمية" onClick={() => changeQuantity(product.id, 1)}><Plus size={13} /></button></div></div><button className="remove-line" aria-label="حذف المنتج" onClick={() => setCart((current) => current.filter((line) => line.product.id !== product.id))}><X size={15} /></button></div>)}</div><div className="cart-summary"><p><span>المجموع</span><b>{formatPrice(subtotal)}</b></p><small>تُحسب تكلفة الشحن عند إتمام الطلب.</small><button className="button button-dark checkout-button" onClick={() => { setCartOpen(false); setToast("سيتم تفعيل الدفع الإلكتروني عند ربط بوابة الدفع"); }}>إتمام الطلب <ArrowLeft size={16} /></button><button className="continue-shopping" onClick={() => setCartOpen(false)}>متابعة التسوق</button></div></>}</aside></div>}
      {selected && <div className="overlay modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && setSelected(null)}><section className="product-modal" dir="rtl"><button className="modal-close icon-button" onClick={() => setSelected(null)} aria-label="إغلاق"><X /></button><img src={selected.image} alt={selected.name} /><div className="modal-info"><span className="eyebrow">{selected.category}</span><h2>{selected.name}</h2><div className="modal-price">{formatPrice(selected.price)} {selected.oldPrice && <del>{formatPrice(selected.oldPrice)}</del>}</div><div className="rating"><span>★★★★★</span> <small>(١٢ تقييم)</small></div><p>قطعة مختارة بعناية تجمع بين التصميم العملي والتفاصيل الأنيقة. أضيفي لمسة مميزة إلى إطلالتك اليومية.</p><div className="modal-delivery"><Truck size={18} /><span>توصيل مجاني للطلبات فوق ٣٠٠ ر.س</span></div><button className="button button-dark modal-add" onClick={() => { addToCart(selected); setSelected(null); setCartOpen(true); }}>أضيفي إلى الحقيبة <ShoppingBag size={17} /></button><button className="modal-fav" onClick={() => toggleFavorite(selected.id)}><Heart size={16} />{favorites.includes(selected.id) ? "أُضيفت إلى المفضلة" : "أضيفي إلى المفضلة"}</button></div></section></div>}
      {toast && <div className="toast"><Check size={17} />{toast}</div>}
      <a className="back-top" href="#top" aria-label="العودة للأعلى"><ArrowUpLeft size={18} /></a>
    </div>
  );
}
