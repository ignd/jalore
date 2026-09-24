/* ==========================================================
   JALORÉ — boutique
   Site conçu & développé par ETIC TECHNOLOGIES
   ========================================================== */

// ⚙️ Configuration boutique — mettre ici le numéro WhatsApp de Jaloré
// au format international sans "+" ni espaces (ex : 221771234567).
const CONFIG = {
  whatsapp: "",
  currency: "FCFA",
};

const PRICES = { tshirt: 7000, pull: 12000, ensemble: 20000 };
const CAT_LABEL = { tshirt: "T-shirt", pull: "Pull / Hoodie", ensemble: "Ensemble" };
const SIZES = ["S", "M", "L", "XL", "XXL"];
const IMG = (n) => `assets/img/${n}.jpg`;

const PRODUCTS = [
  { id: "tee-neon", cat: "tshirt", name: "Tee Signature Néon", color: "Noir · logo néon", swatch: "#111", badge: "Nouveau",
    imgs: ["tee-noir-neon", "tee-noir-neon-mur"],
    desc: "Le classique Jaloré : t-shirt noir, signature néon qui ne passe pas inaperçue. Pour ceux qui brillent même dans le noir." },
  { id: "tee-peche", cat: "tshirt", name: "Tee Signature Pêche", color: "Noir · logo pêche", swatch: "#111",
    imgs: ["tee-noir-peche", "tee-noir-blanc"],
    desc: "Noir profond, signature pêche contourée. Sobre, élégant, assumé." },
  { id: "tee-royal", cat: "tshirt", name: "Tee Royal", color: "Bleu roi · logo blanc", swatch: "#2446a8",
    imgs: ["tee-bleu-roi", "tees-plies"],
    desc: "Un bleu roi éclatant pour ceux qui marchent la tête haute. Coupe longue et confortable." },
  { id: "tee-pure", cat: "tshirt", name: "Tee Pure", color: "Blanc · logo rouge", swatch: "#f3f3f3",
    imgs: ["tee-blanc-rouge"],
    desc: "Blanc pur, signature rouge sang. La page blanche de ton histoire — signée." },
  { id: "tee-sang", cat: "tshirt", name: "Tee Sang", color: "Rouge · logo blanc", swatch: "#b3121a", badge: "Signature",
    imgs: ["tee-rouge", "tees-plies"],
    desc: "Rouge intense, comme la passion qui te fait avancer. 0 excuses." },

  { id: "hoodie-classic", cat: "pull", name: "Hoodie Classic", color: "Gris chiné · logo noir", swatch: "#c9c9c9", badge: "Signature",
    imgs: ["pull-gris-noir"],
    desc: "Le hoodie iconique. Molleton doux, capuche ajustable, poche kangourou et étiquette « Made in Senegal »." },
  { id: "hoodie-sunset", cat: "pull", name: "Hoodie Sunset", color: "Orange · logo noir", swatch: "#e0703a", badge: "Nouveau",
    imgs: ["pull-orange"],
    desc: "L'orange du coucher de soleil sur Dakar. Chaud, lumineux, impossible à ignorer." },
  { id: "hoodie-lion", cat: "pull", name: "Hoodie Lion Rouge", color: "Rouge · logo noir", swatch: "#d93a36",
    imgs: ["pull-rouge"],
    desc: "Rouge lion. Pour ceux qui portent leurs griffes avec fierté." },
  { id: "hoodie-braise", cat: "pull", name: "Hoodie Braise", color: "Gris chiné · logo rouge", swatch: "#c9c9c9",
    imgs: ["pull-gris-rouge"],
    desc: "Base grise, signature rouge braise. Le feu intérieur, en toute discrétion." },
  { id: "hoodie-ocean", cat: "pull", name: "Hoodie Océan", color: "Gris chiné · logo bleu", swatch: "#c9c9c9",
    imgs: ["pull-gris-bleu"],
    desc: "Gris et bleu Atlantique. Calme en surface, puissant en profondeur." },
  { id: "hoodie-cuivre", cat: "pull", name: "Hoodie Cuivre", color: "Gris chiné · logo cuivre", swatch: "#c9c9c9",
    imgs: ["pull-gris-orange"],
    desc: "Signature cuivrée sur gris chiné. Chaleureux et raffiné." },

  { id: "ensemble-anthracite", cat: "ensemble", name: "Ensemble Anthracite", color: "Hoodie + jogging · gris", swatch: "#5b5d61", badge: "Le + complet",
    imgs: ["ensemble-gris"],
    desc: "Le hoodie et le jogging assortis, signature blanche. Le look complet Jaloré, du matin au soir." },
].map((p) => ({ ...p, price: PRICES[p.cat] }));

/* ---------- Utilitaires ---------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const fmt = (n) => n.toLocaleString("fr-FR").replace(/ | /g, " ") + " " + CONFIG.currency;
const byId = (id) => PRODUCTS.find((p) => p.id === id);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const store = {
  get() { try { return JSON.parse(localStorage.getItem("jalore-cart")) || []; } catch { return []; } },
  set(v) { try { localStorage.setItem("jalore-cart", JSON.stringify(v)); } catch {} },
};
let cart = store.get().filter((l) => byId(l.id));

let toastTimer;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
}

function waLink(text) {
  // api.whatsapp.com plutôt que wa.me : la redirection wa.me abîme les emojis
  const phone = CONFIG.whatsapp ? `phone=${CONFIG.whatsapp}&` : "";
  return `https://api.whatsapp.com/send?${phone}text=${encodeURIComponent(text)}`;
}

/* ---------- Loader ---------- */
window.addEventListener("load", () => {
  setTimeout(() => $("#loader").classList.add("done"), 1300);
});

/* ---------- Header / menu ---------- */
const header = $("#header");
window.addEventListener("scroll", () => header.classList.toggle("scrolled", scrollY > 30), { passive: true });

const burger = $("#burger"), nav = $("#nav");
function toggleMenu(force) {
  const open = force ?? !nav.classList.contains("open");
  nav.classList.toggle("open", open);
  burger.setAttribute("aria-expanded", open);
  document.body.classList.toggle("lock", open);
}
burger.addEventListener("click", () => toggleMenu());
$$(".nav a").forEach((a) => a.addEventListener("click", () => toggleMenu(false)));

/* ---------- Boutique ---------- */
let filter = "all", sort = "default";

function renderGrid() {
  let list = PRODUCTS.filter((p) => filter === "all" || p.cat === filter);
  if (sort === "asc") list = [...list].sort((a, b) => a.price - b.price);
  if (sort === "desc") list = [...list].sort((a, b) => b.price - a.price);

  $("#grid").innerHTML = list.map((p, i) => `
    <article class="product" data-id="${p.id}" style="animation-delay:${i * 50}ms" tabindex="0" aria-label="${esc(p.name)}, ${fmt(p.price)}">
      <div class="p-media">
        ${p.badge ? `<span class="badge">${esc(p.badge)}</span>` : ""}
        <img src="${IMG(p.imgs[0])}" alt="${esc(p.name)} — ${esc(p.color)}" loading="lazy">
        ${p.imgs[1] ? `<img class="alt" src="${IMG(p.imgs[1])}" alt="" loading="lazy">` : ""}
        <button class="quick" data-quick="${p.id}">Choisir ma taille</button>
      </div>
      <div class="p-info">
        <div>
          <h3>${esc(p.name)}</h3>
          <span class="p-cat"><i class="swatch" style="background:${p.swatch}"></i>${esc(p.color)}</span>
        </div>
        <span class="p-price">${fmt(p.price)}</span>
      </div>
    </article>`).join("");
}

function setFilter(f) {
  filter = f;
  $$(".chip").forEach((c) => c.classList.toggle("active", c.dataset.filter === f));
  renderGrid();
}

$$(".chip").forEach((c) => c.addEventListener("click", () => setFilter(c.dataset.filter)));
$$(".cat, [data-go]").forEach((c) => c.addEventListener("click", (e) => {
  setFilter(c.dataset.filter || c.dataset.go);
  if (c.classList.contains("cat")) {
    e.preventDefault();
    $("#collection").scrollIntoView({ behavior: "smooth" });
  }
}));
$("#sort").addEventListener("change", (e) => { sort = e.target.value; renderGrid(); });

$("#grid").addEventListener("click", (e) => {
  const card = e.target.closest(".product");
  if (card) openModal(card.dataset.id);
});
$("#grid").addEventListener("keydown", (e) => {
  const card = e.target.closest(".product");
  if (card && (e.key === "Enter" || e.key === " ") && e.target === card) { e.preventDefault(); openModal(card.dataset.id); }
});

/* ---------- Fiche produit ---------- */
const modal = $("#modal");
let current = null, size = null, qty = 1, lastFocus = null;

function openModal(id) {
  current = byId(id); size = null; qty = 1;
  lastFocus = document.activeElement;
  $("#mCat").textContent = CAT_LABEL[current.cat];
  $("#mTitle").textContent = current.name;
  $("#mPrice").textContent = fmt(current.price);
  $("#mDesc").textContent = current.desc + " Coloris : " + current.color + ".";
  $("#qVal").textContent = qty;
  $("#mSizeLabel").textContent = "";
  setModalImg(0);
  $("#mThumbs").innerHTML = current.imgs.length > 1
    ? current.imgs.map((n, i) => `<button data-i="${i}" class="${i === 0 ? "active" : ""}" aria-label="Photo ${i + 1}"><img src="${IMG(n)}" alt=""></button>`).join("")
    : "";
  $("#mSizes").innerHTML = SIZES.map((s) => `<button data-size="${s}">${s}</button>`).join("");
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("lock");
  setTimeout(() => $(".close", modal).focus(), 50);
}
function setModalImg(i) {
  $("#mImg").src = IMG(current.imgs[i]);
  $("#mImg").alt = `${current.name} — ${current.color}`;
  $$("#mThumbs button").forEach((b) => b.classList.toggle("active", +b.dataset.i === i));
}
function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  if (!drawer.classList.contains("open")) document.body.classList.remove("lock");
  lastFocus?.focus?.();
}
$$("[data-close]", modal).forEach((el) => el.addEventListener("click", closeModal));
$("#mThumbs").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) setModalImg(+b.dataset.i); });
$("#mSizes").addEventListener("click", (e) => {
  const b = e.target.closest("button"); if (!b) return;
  size = b.dataset.size;
  $$("#mSizes button").forEach((x) => x.classList.toggle("active", x === b));
  $("#mSizeLabel").textContent = "· " + size;
});
$("#qMinus").addEventListener("click", () => { qty = Math.max(1, qty - 1); $("#qVal").textContent = qty; });
$("#qPlus").addEventListener("click", () => { qty = Math.min(20, qty + 1); $("#qVal").textContent = qty; });
$("#mAdd").addEventListener("click", () => {
  if (!size) {
    const s = $("#mSizes");
    s.classList.remove("shake"); void s.offsetWidth; s.classList.add("shake");
    toast("Choisis d'abord ta taille 👆");
    return;
  }
  addToCart(current.id, size, qty);
  closeModal();
  toast(`✓ ${current.name} (${size}) ajouté au panier`);
});

/* ---------- Panier ---------- */
const drawer = $("#drawer");

function addToCart(id, s, q) {
  const line = cart.find((l) => l.id === id && l.size === s);
  if (line) line.qty = Math.min(20, line.qty + q);
  else cart.push({ id, size: s, qty: q });
  saveCart();
  const c = $("#cartCount");
  c.classList.remove("bump"); void c.offsetWidth; c.classList.add("bump");
}
function saveCart() { store.set(cart); renderCart(); }
const cartTotal = () => cart.reduce((t, l) => t + byId(l.id).price * l.qty, 0);
const cartQty = () => cart.reduce((t, l) => t + l.qty, 0);

function renderCart() {
  const n = cartQty();
  const count = $("#cartCount");
  count.textContent = n;
  count.classList.toggle("show", n > 0);
  $("#cartEmpty").hidden = cart.length > 0;
  $("#cartTotal").textContent = fmt(cartTotal());
  $("#checkoutBtn").disabled = cart.length === 0;
  $("#cartItems").innerHTML = cart.map((l, i) => {
    const p = byId(l.id);
    return `<div class="cart-item">
      <img src="${IMG(p.imgs[0])}" alt="">
      <div>
        <h4>${esc(p.name)}</h4>
        <div class="meta">${esc(p.color)} · Taille ${l.size}</div>
        <div class="qty"><button data-dec="${i}" aria-label="Moins">−</button><span>${l.qty}</span><button data-inc="${i}" aria-label="Plus">+</button></div>
      </div>
      <div class="ci-right"><strong>${fmt(p.price * l.qty)}</strong><button class="remove" data-rm="${i}">Retirer</button></div>
    </div>`;
  }).join("");
}

$("#cartItems").addEventListener("click", (e) => {
  const t = e.target;
  if (t.dataset.inc) cart[+t.dataset.inc].qty = Math.min(20, cart[+t.dataset.inc].qty + 1);
  else if (t.dataset.dec) { const l = cart[+t.dataset.dec]; l.qty > 1 ? l.qty-- : cart.splice(+t.dataset.dec, 1); }
  else if (t.dataset.rm) cart.splice(+t.dataset.rm, 1);
  else return;
  saveCart();
  if (!cart.length) showStep("cart");
});

function openCart() {
  showStep("cart");
  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
  document.body.classList.add("lock");
}
function closeCart() {
  drawer.classList.remove("open");
  drawer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("lock");
}
$("#cartOpen").addEventListener("click", openCart);
$$("[data-close-cart]").forEach((el) => el.addEventListener("click", () => {
  closeCart();
  if (el.closest(".cart-empty")) $("#collection").scrollIntoView({ behavior: "smooth" });
}));

let step = "cart";
function showStep(s) {
  step = s;
  $("#stepCart").hidden = s !== "cart";
  $("#stepCheckout").hidden = s !== "checkout";
  $("#checkoutBtn").textContent = s === "cart" ? "Passer la commande" : "Confirmer sur WhatsApp";
}
$("#backToCart").addEventListener("click", () => showStep("cart"));
$("#checkoutBtn").addEventListener("click", () => {
  if (step === "cart") { showStep("checkout"); $("#stepCheckout input").focus(); return; }
  const form = $("#stepCheckout");
  if (!form.reportValidity()) return;
  submitOrder(new FormData(form));
});
$("#stepCheckout").addEventListener("submit", (e) => { e.preventDefault(); $("#checkoutBtn").click(); });

function submitOrder(data) {
  const ref = "JAL-" + Date.now().toString(36).toUpperCase().slice(-6);
  const lines = cart.map((l) => {
    const p = byId(l.id);
    return `• ${l.qty} × ${p.name} (${p.color}) — Taille ${l.size} — ${fmt(p.price * l.qty)}`;
  });
  const msg = [
    `🦁 *Nouvelle commande Jaloré* — ${ref}`,
    "",
    ...lines,
    "",
    `*Sous-total : ${fmt(cartTotal())}*`,
    "",
    `👤 ${data.get("name")}`,
    `📞 ${data.get("phone")}`,
    `📍 ${data.get("city")}${data.get("address") ? " — " + data.get("address") : ""}`,
    `💳 ${data.get("pay")}`,
    data.get("note") ? `📝 ${data.get("note")}` : "",
    "",
    "Since Your Birth ⏳",
  ].filter((l, i, a) => l !== "" || a[i - 1] !== "").join("\n");

  window.open(waLink(msg), "_blank", "noopener");
  $("#orderRef").textContent = ref;
  cart = []; saveCart();
  $("#stepCheckout").reset();
  closeCart();
  $("#success").classList.add("open");
  $("#success").setAttribute("aria-hidden", "false");
}
$("#successClose").addEventListener("click", () => {
  $("#success").classList.remove("open");
  $("#success").setAttribute("aria-hidden", "true");
});

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (modal.classList.contains("open")) closeModal();
  else if (drawer.classList.contains("open")) closeCart();
  else if (nav.classList.contains("open")) toggleMenu(false);
});

/* ---------- Contact ---------- */
$("#waContact").href = waLink("Bonjour Jaloré 🦁 ! J'ai une question sur vos articles.");

/* ---------- Lookbook ---------- */
$$(".look-nav .round").forEach((b) => b.addEventListener("click", () => {
  const track = $("#lookTrack");
  track.scrollBy({ left: +b.dataset.dir * track.clientWidth * 0.7, behavior: "smooth" });
}));

/* ---------- Animations au défilement ---------- */
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (!en.isIntersecting) return;
    en.target.classList.add("in");
    io.unobserve(en.target);
  });
}, { threshold: 0.15 });
$$(".reveal").forEach((el) => io.observe(el));

const counters = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (!en.isIntersecting) return;
    const el = en.target, end = +el.dataset.count;
    let v = 0;
    const tick = () => { el.textContent = v; if (v++ < end) setTimeout(tick, 180); };
    tick();
    counters.unobserve(el);
  });
}, { threshold: 0.6 });
$$("[data-count]").forEach((el) => counters.observe(el));

/* ---------- Effet 3D sur l'image du hero ---------- */
const tilt = $(".tilt");
if (tilt && matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)").matches) {
  const vis = $(".hero-visual");
  vis.addEventListener("mousemove", (e) => {
    const r = vis.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    tilt.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
  });
  vis.addEventListener("mouseleave", () => { tilt.style.transform = ""; });
}

/* ---------- Init ---------- */
$("#year").textContent = new Date().getFullYear();
renderGrid();
renderCart();
