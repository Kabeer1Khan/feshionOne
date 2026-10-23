import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  Shirt,
  Star,
} from "lucide-react";
import {
  CATEGORIES,
  PRODUCTS,
  formatPrice,
  getProduct,
} from "../data/products";
import { getMeta } from "../data/productMeta";
import useCart from "../hooks/useCart";
import useWishlist from "../hooks/useWishlist";
import SmartImage from "../components/SmartImage";
import SizeGuideModal from "../components/SizeGuideModal";
import RelatedProducts from "../components/RelatedProducts";
import EffortlessBanner from "../components/EffortlessBanner";

// Navbar fixed hai, isliye page ke upar itni jagah chhodni hai. Gap zyada/kam dikhe to yahan badlo.
const NAV_OFFSET = "pt-28 sm:pt-32";
const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";
const MAX_QTY = 10;

const sized = (url, w, h) => url.replace("w=800&h=960", `w=${w}&h=${h}`);

// 4 gallery slots. Har slot ke paas fallback list hoti hai.
// Apni local images lagani ho to products.js mein product par `gallery: [img1, img2, img3, img4]` add kar dena.
function buildGallery(product) {
  if (product.gallery?.length) return product.gallery.map((u) => [u]);
  const own = [...product.images];
  const extra = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id,
  )
    .map((p) => p.images[0])
    .find((u) => !own.includes(u));
  const urls = (extra ? [...own, extra] : own).slice(0, 4);
  return urls.map((u, i) => [u, ...urls.filter((_, j) => j !== i)]);
}

/* ------------------------------------------------------------------ */
/* Stars: rating ke hisaab se fill, load par animate hota hai          */
/* ------------------------------------------------------------------ */
function Stars({ value, on }) {
  const row = (cls) => (
    <span className={`flex gap-0.5 ${cls}`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star
          key={i}
          size={16}
          strokeWidth={0}
          fill="currentColor"
          className="shrink-0"
        />
      ))}
    </span>
  );
  return (
    <span className="relative inline-flex" aria-hidden="true">
      {row("text-[#e6d9cb]")}
      <span
        style={{
          width: on ? `${(value / 5) * 100}%` : "0%",
          transitionDelay: "700ms",
        }}
        className="absolute inset-y-0 left-0 overflow-hidden transition-[width] duration-[1400ms] ease-out"
      >
        {row("text-[#c9a27a]")}
      </span>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Accordion: smooth height open/close                                  */
/* ------------------------------------------------------------------ */
function Accordion({ items }) {
  const [open, setOpen] = useState(-1);
  return (
    <div className="divide-y divide-[#e8dfd5] border-y border-[#e8dfd5]">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.title}>
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? -1 : i)}
              className="group flex w-full cursor-pointer items-center justify-between gap-4 py-4 text-left"
            >
              <span className="text-sm font-semibold text-[#3b2a20] transition-colors duration-300 group-hover:text-[#c9a27a]">
                {item.title}
              </span>
              <ChevronDown
                size={18}
                strokeWidth={1.8}
                className={`shrink-0 text-[#5c4638] transition-transform duration-500 ${EASE} ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`grid transition-[grid-template-rows,opacity] duration-500 ${EASE} ${
                isOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="pb-5 text-sm leading-7 text-[#5c4638]">
                  {Array.isArray(item.body) ? (
                    <ul className="space-y-2">
                      {item.body.map((line) => (
                        <li key={line} className="flex gap-3">
                          <span
                            aria-hidden="true"
                            className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-[#c9a27a]"
                          />
                          {line}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>{item.body}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Product view (slug badalne par remount hota hai)                     */
/* ------------------------------------------------------------------ */
function ProductView({ product }) {
  const meta = useMemo(() => getMeta(product), [product]);
  const categoryLabel =
    CATEGORIES.find((c) => c.id === product.category)?.label || "Shop";
  const { ids: savedIds, toggle } = useWishlist();
  const { add } = useCart();
  const saved = savedIds.includes(product.id);

  const gallery = useMemo(() => buildGallery(product), [product]);
  const slides = useMemo(
    () => gallery.map((s) => s.map((u) => sized(u, 1200, 1600))),
    [gallery],
  );
  const thumbs = useMemo(
    () => gallery.map((s) => s.map((u) => sized(u, 240, 320))),
    [gallery],
  );

  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(0);
  const [colorIdx, setColorIdx] = useState(0);
  const [size, setSize] = useState(meta.defaultSize);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [zoomOn, setZoomOn] = useState(false);
  const [barOn, setBarOn] = useState(false);
  const [heartPop, setHeartPop] = useState(false);
  const [toast, setToast] = useState({
    text: "",
    href: "/cart",
    cta: "View cart",
    on: false,
    heart: false,
  });

  const frameRef = useRef(null);
  const zoomRef = useRef(null);
  const ctaRef = useRef(null);
  const touchX = useRef(null);
  const toastTimer = useRef(0);
  const addedTimer = useRef(0);

  const color = meta.colors[colorIdx];

  /* ---------- Page load: ek baar orchestrated entry ---------- */
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  useEffect(
    () => () => {
      clearTimeout(toastTimer.current);
      clearTimeout(addedTimer.current);
    },
    [],
  );

  useEffect(() => {
    if (!heartPop) return undefined;
    const t = setTimeout(() => setHeartPop(false), 320);
    return () => clearTimeout(t);
  }, [heartPop]);

  /* ---------- Main Add to Cart button screen se bahar ho to sticky bar aata hai ---------- */
  useEffect(() => {
    const el = ctaRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return undefined;
    const io = new IntersectionObserver(
      ([e]) => setBarOn(!e.isIntersecting && e.boundingClientRect.top < 0),
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* ---------- Helpers ---------- */
  const rv = (i) => ({
    style: { transitionDelay: mounted ? `${220 + i * 80}ms` : "0ms" },
    className: `transition-[opacity,translate] duration-[900ms] ${EASE} motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
      mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
    }`,
  });

  const showToast = (text, href, cta, heart = false) => {
    clearTimeout(toastTimer.current);
    setToast({ text, href, cta, on: true, heart });
    toastTimer.current = setTimeout(
      () => setToast((t) => ({ ...t, on: false })),
      3200,
    );
  };

  const go = (i) => setActive((i + slides.length) % slides.length);

  const handleAdd = () => {
    add({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.images[0],
      color: color.name,
      size,
      qty,
    });
    setAdded(true);
    clearTimeout(addedTimer.current);
    addedTimer.current = setTimeout(() => setAdded(false), 1900);
    showToast(`${qty} × ${product.name} added to cart`, "/cart", "View cart");
  };

  const handleWishlist = () => {
    toggle(product.id);
    setHeartPop(true);
    showToast(
      saved
        ? `${product.name} removed from wishlist`
        : `${product.name} saved to wishlist`,
      "/wishlist",
      "View",
      !saved,
    );
  };

  /* ---------- Image zoom (hover) + swipe (touch) ---------- */
  const moveOrigin = (e) => {
    const el = frameRef.current;
    const layer = zoomRef.current;
    if (!el || !layer) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    layer.style.transformOrigin = `${x}% ${y}%`;
  };
  const onEnter = (e) => {
    if (!window.matchMedia("(hover: hover)").matches) return;
    moveOrigin(e);
    setZoomOn(true);
  };
  const onTouchStart = (e) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > 45) go(active + (dx < 0 ? 1 : -1));
  };

  const accordionItems = [
    { title: "Details", body: meta.details },
    { title: "Materials & care", body: meta.care },
    { title: "Shipping & returns", body: meta.shipping },
  ];

  return (
    <main className={`bg-[#faf8f5] ${NAV_OFFSET} pb-28`}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* ================= Breadcrumb ================= */}
        <nav aria-label="Breadcrumb" {...rv(-2)}>
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-[#5c4638]">
            <li>
              <Link
                to="/"
                className="transition-colors duration-300 hover:text-[#c9a27a]"
              >
                Home
              </Link>
            </li>
            <ChevronRight
              size={14}
              className="text-[#b9aa9a]"
              aria-hidden="true"
            />
            <li>
              <Link
                to={`/shop?category=${product.category}`}
                className="transition-colors duration-300 hover:text-[#c9a27a]"
              >
                {categoryLabel}
              </Link>
            </li>
            <ChevronRight
              size={14}
              className="text-[#b9aa9a]"
              aria-hidden="true"
            />
            <li aria-current="page" className="font-medium text-[#3b2a20]">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="mt-6 grid gap-8 lg:mt-8 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          {/* ================= Gallery ================= */}
          <div
            style={{ transitionDelay: mounted ? "120ms" : "0ms" }}
            className={`flex flex-col-reverse gap-3 transition-[opacity,translate] duration-[1100ms] ${EASE} motion-reduce:translate-x-0 motion-reduce:opacity-100 motion-reduce:transition-none lg:sticky lg:top-28 lg:flex-row lg:gap-4 lg:self-start ${
              mounted
                ? "translate-x-0 opacity-100"
                : "-translate-x-10 opacity-0"
            }`}
          >
            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto p-1 [scrollbar-width:none] lg:flex-col lg:overflow-visible lg:p-0 [&::-webkit-scrollbar]:hidden">
              {thumbs.map((srcs, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Show image ${i + 1}`}
                  aria-current={i === active}
                  onClick={() => setActive(i)}
                  className={`relative aspect-[3/4] w-16 shrink-0 cursor-pointer overflow-hidden rounded-xl bg-[#eadfd3] transition-[translate,opacity,box-shadow] duration-300 hover:-translate-y-0.5 sm:w-20 ${
                    i === active
                      ? "opacity-100 ring-2 ring-[#3b2a20] ring-offset-2 ring-offset-[#faf8f5]"
                      : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <SmartImage sources={srcs} alt="" />
                </button>
              ))}
            </div>

            {/* Main image */}
            <div className="min-w-0 flex-1">
              <div
                ref={frameRef}
                onMouseEnter={onEnter}
                onMouseMove={moveOrigin}
                onMouseLeave={() => setZoomOn(false)}
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
                className="group/main relative aspect-[4/5] cursor-zoom-in overflow-hidden rounded-3xl bg-[#eadfd3] shadow-[0_30px_60px_-34px_rgba(59,42,32,0.5)] ring-1 ring-[#efe8df] lg:aspect-[3/4]"
              >
                <div
                  ref={zoomRef}
                  className={`absolute inset-0 transition-[scale] duration-500 ease-out ${
                    zoomOn ? "scale-[1.8]" : "scale-100"
                  }`}
                >
                  {slides.map((srcs, i) => (
                    <div
                      key={i}
                      className={`absolute inset-0 transition-[opacity,scale] duration-[900ms] ${EASE} ${
                        i === active
                          ? "scale-100 opacity-100"
                          : "pointer-events-none scale-[1.06] opacity-0"
                      }`}
                    >
                      <SmartImage
                        sources={srcs}
                        alt={`${product.name}, view ${i + 1}`}
                        eager={i === 0}
                      />
                    </div>
                  ))}
                </div>

                {slides.length > 1 && (
                  <>
                    <button
                      type="button"
                      aria-label="Previous image"
                      onClick={() => go(active - 1)}
                      className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-white/90 text-[#3b2a20] shadow-md transition-[opacity,background-color,scale] duration-300 hover:scale-110 hover:bg-white lg:opacity-0 lg:group-hover/main:opacity-100"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      type="button"
                      aria-label="Next image"
                      onClick={() => go(active + 1)}
                      className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-white/90 text-[#3b2a20] shadow-md transition-[opacity,background-color,scale] duration-300 hover:scale-110 hover:bg-white lg:opacity-0 lg:group-hover/main:opacity-100"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* ================= Details ================= */}
          <div className="min-w-0">
            {/* Title: word-mask reveal */}
            <h1
              aria-label={product.name}
              className="font-display text-4xl leading-[1.1] text-[#3b2a20] sm:text-[44px]"
            >
              {product.name.split(" ").map((w, i) => (
                <span
                  key={i}
                  aria-hidden="true"
                  className="mr-[0.26em] inline-block overflow-hidden align-bottom"
                >
                  <span
                    style={{
                      transitionDelay: mounted ? `${200 + i * 100}ms` : "0ms",
                    }}
                    className={`inline-block pb-1.5 transition-[translate] duration-[1000ms] ${EASE} motion-reduce:translate-y-0 ${
                      mounted ? "translate-y-0" : "translate-y-[115%]"
                    }`}
                  >
                    {w}
                  </span>
                </span>
              ))}
            </h1>

            <p
              {...rv(1)}
              className={`mt-5 text-2xl font-semibold text-[#3b2a20] ${rv(1).className}`}
            >
              {formatPrice(product.price)}
            </p>

            <div
              {...rv(2)}
              className={`mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 ${rv(2).className}`}
            >
              <Stars value={meta.rating} on={mounted} />
              <span className="text-sm text-[#5c4638]">
                <span className="font-medium text-[#3b2a20]">
                  {meta.rating.toFixed(1)}
                </span>{" "}
                <Link
                  to="/reviews"
                  className="underline-offset-4 transition-colors hover:text-[#c9a27a] hover:underline"
                >
                  ({meta.reviews} reviews)
                </Link>
              </span>
            </div>

            <p
              {...rv(3)}
              className={`mt-6 max-w-xl text-[15px] leading-7 text-[#5c4638] ${rv(3).className}`}
            >
              {meta.description}
            </p>

            {/* Color */}
            <div {...rv(4)} className={`mt-8 ${rv(4).className}`}>
              <p className="text-sm font-semibold text-[#3b2a20]">
                Color{" "}
                <span className="ml-2 font-normal text-[#5c4638]/80">
                  {color.name}
                </span>
              </p>
              <div className="mt-3 flex gap-4 p-1">
                {meta.colors.map((c, i) => (
                  <button
                    key={c.name}
                    type="button"
                    aria-label={c.name}
                    aria-pressed={i === colorIdx}
                    onClick={() => setColorIdx(i)}
                    style={{ backgroundColor: c.hex }}
                    className={`h-10 w-10 cursor-pointer rounded-full transition-[scale,box-shadow] duration-300 ${
                      i === colorIdx
                        ? "scale-105 ring-2 ring-[#3b2a20] ring-offset-[3px] ring-offset-[#faf8f5]"
                        : "ring-1 ring-[#e4dcd3] hover:scale-110"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Size */}
            <div {...rv(5)} className={`mt-7 ${rv(5).className}`}>
              <p className="text-sm font-semibold text-[#3b2a20]">
                Size{" "}
                <span className="ml-2 font-normal text-[#5c4638]/80">
                  {size}
                </span>
              </p>
              <div
                className={`mt-3 gap-2.5 ${meta.sizeKind === "one" ? "flex" : "grid grid-cols-5"}`}
                role="group"
                aria-label="Size"
              >
                {meta.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={s === size}
                    onClick={() => setSize(s)}
                    className={`grid h-11 cursor-pointer place-items-center rounded-xl border text-sm transition-[background-color,border-color,translate] duration-300 hover:-translate-y-0.5 ${
                      meta.sizeKind === "one" ? "px-6" : ""
                    } ${
                      s === size
                        ? "border-[#3b2a20] bg-[#efe6dc] font-semibold text-[#3b2a20]"
                        : "border-[#e4dcd3] bg-white text-[#5c4638] hover:border-[#3b2a20]"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {meta.sizeKind !== "one" && (
                <div className="mt-3 text-right">
                  <button
                    type="button"
                    onClick={() => setGuideOpen(true)}
                    className="cursor-pointer text-sm text-[#3b2a20] underline underline-offset-4 transition-colors duration-300 hover:text-[#c9a27a]"
                  >
                    Size Guide
                  </button>
                </div>
              )}
            </div>

            {/* Quantity + Add to cart */}
            <div
              {...rv(6)}
              className={`mt-7 flex items-stretch gap-3 ${rv(6).className}`}
            >
              <div className="flex h-14 w-32 shrink-0 items-center justify-between rounded-xl border border-[#e4dcd3] bg-white px-1.5">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  disabled={qty <= 1}
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="grid h-10 w-10 cursor-pointer place-items-center rounded-lg text-[#3b2a20] transition-colors hover:bg-[#f3ece4] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent"
                >
                  <Minus size={16} strokeWidth={1.8} />
                </button>
                <span
                  aria-live="polite"
                  className="w-6 text-center text-sm font-medium text-[#3b2a20]"
                >
                  {qty}
                </span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  disabled={qty >= MAX_QTY}
                  onClick={() => setQty((q) => Math.min(MAX_QTY, q + 1))}
                  className="grid h-10 w-10 cursor-pointer place-items-center rounded-lg text-[#3b2a20] transition-colors hover:bg-[#f3ece4] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent"
                >
                  <Plus size={16} strokeWidth={1.8} />
                </button>
              </div>

              <button
                ref={ctaRef}
                type="button"
                onClick={handleAdd}
                className="relative h-14 flex-1 cursor-pointer overflow-hidden rounded-xl bg-[#3b2a20] text-[15px] font-medium text-white shadow-[0_16px_30px_-16px_rgba(59,42,32,0.85)] transition-[background-color,scale] duration-300 before:absolute before:inset-y-0 before:-left-1/3 before:w-1/4 before:-translate-x-[200%] before:-skew-x-12 before:bg-white/15 before:transition-transform before:duration-700 hover:bg-[#5c4638] hover:before:translate-x-[700%] active:scale-[0.98]"
              >
                <span
                  className={`flex items-center justify-center transition-[translate,opacity] duration-500 ${EASE} ${
                    added
                      ? "-translate-y-6 opacity-0"
                      : "translate-y-0 opacity-100"
                  }`}
                >
                  Add to Cart
                </span>
                <span
                  aria-hidden={!added}
                  className={`absolute inset-0 flex items-center justify-center gap-2 transition-[translate,opacity] duration-500 ${EASE} ${
                    added
                      ? "translate-y-0 opacity-100"
                      : "translate-y-6 opacity-0"
                  }`}
                >
                  <Check size={18} strokeWidth={2.2} /> Added to cart
                </span>
              </button>
            </div>

            {/* Wishlist */}
            <div {...rv(7)} className={`mt-3 ${rv(7).className}`}>
              <button
                type="button"
                aria-pressed={saved}
                onClick={handleWishlist}
                className="group flex h-14 w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl bg-[#efe6dc] text-[15px] font-medium text-[#5c4638] transition-[background-color,scale] duration-300 hover:bg-[#e6d9cb] active:scale-[0.98]"
              >
                <Heart
                  size={18}
                  strokeWidth={1.8}
                  className={`transition-[scale,fill,color] duration-300 ${
                    saved ? "fill-[#3b2a20] text-[#3b2a20]" : "fill-transparent"
                  } ${heartPop ? "scale-150" : "scale-100 group-hover:scale-110"}`}
                />
                {saved ? "Saved to Wishlist" : "Add to Wishlist"}
              </button>
            </div>

            {/* Accordion */}
            <div {...rv(8)} className={`mt-9 ${rv(8).className}`}>
              <Accordion items={accordionItems} />
            </div>
          </div>
        </div>

        {/* ================= Related ================= */}
        <RelatedProducts product={product} />
        <EffortlessBanner />
      </div>

      {/* ================= Sticky add-to-cart bar ================= */}
      <div
        aria-hidden={!barOn}
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-[#e8dfd5] bg-white/90 backdrop-blur-md transition-[translate] duration-500 ${EASE} ${
          barOn ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6 lg:px-8">
          <div className="relative h-14 w-11 shrink-0 overflow-hidden rounded-lg bg-[#eadfd3]">
            <SmartImage sources={thumbs[0]} alt="" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-[#3b2a20]">
              {product.name}
            </p>
            <p className="truncate text-xs text-[#5c4638]">
              <span className="font-semibold text-[#3b2a20]">
                {formatPrice(product.price)}
              </span>
              <span className="ml-2">
                {color.name}, {size}
              </span>
            </p>
          </div>
          <button
            type="button"
            tabIndex={barOn ? 0 : -1}
            onClick={handleAdd}
            className="flex h-11 shrink-0 cursor-pointer items-center gap-2 rounded-xl bg-[#3b2a20] px-5 text-sm font-medium text-white transition-[background-color,scale] duration-300 hover:bg-[#5c4638] active:scale-95 sm:px-7"
          >
            {added ? <Check size={16} strokeWidth={2.2} /> : null}
            {added ? "Added" : "Add to Cart"}
          </button>
        </div>
      </div>

      {/* ================= Toast ================= */}
      <div
        role="status"
        aria-live="polite"
        className={`pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex justify-center px-4 transition-[opacity,translate] duration-500 ${EASE} ${
          toast.on ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
      >
        <div
          className={`flex max-w-full items-center gap-3 rounded-full bg-[#3b2a20] py-2.5 pl-5 pr-2.5 text-sm text-white shadow-xl ${
            toast.on ? "pointer-events-auto" : ""
          }`}
        >
          <Heart
            size={15}
            className={
              toast.heart ? "shrink-0 fill-[#c9a27a] text-[#c9a27a]" : "hidden"
            }
          />
          <span className="truncate">{toast.text}</span>
          <Link
            to={toast.href}
            tabIndex={toast.on ? 0 : -1}
            className="shrink-0 rounded-full bg-[#c9a27a] px-4 py-1.5 font-medium text-[#3b2a20] transition-colors hover:bg-[#d8b690]"
          >
            {toast.cta}
          </Link>
        </div>
      </div>

      <SizeGuideModal
        open={guideOpen}
        onClose={() => setGuideOpen(false)}
        kind={meta.sizeKind}
      />
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* Route component                                                      */
/* ------------------------------------------------------------------ */
export default function ProductDetail() {
  const { slug } = useParams();
  const product = useMemo(() => getProduct(slug), [slug]);

  // Naye product par hamesha top se shuru
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, [slug]);

  if (!product) {
    return (
      <main className={`bg-[#faf8f5] ${NAV_OFFSET} pb-24`}>
        <div className="mx-auto grid min-h-[55vh] max-w-xl place-items-center px-6 text-center">
          <div>
            <Shirt
              size={40}
              strokeWidth={1.3}
              className="mx-auto text-[#c9a27a]"
            />
            <h1 className="mt-5 font-display text-4xl text-[#3b2a20]">
              We can’t find that piece
            </h1>
            <p className="mt-3 text-[15px] leading-7 text-[#5c4638]">
              It may have sold out or the link may be old. Browse the full
              collection instead.
            </p>
            <Link
              to="/shop"
              className="mt-7 inline-flex h-12 items-center rounded-xl bg-[#3b2a20] px-7 text-sm font-medium text-white transition-colors duration-300 hover:bg-[#5c4638]"
            >
              Back to shop
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return <ProductView key={product.id} product={product} />;
}
