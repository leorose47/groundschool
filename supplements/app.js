/* Tropos: storefront logic (catalog, quiz, cart, modal) */
(() => {
  "use strict";

  /* ───────────────────────── Catalog ───────────────────────── */
  const SUB_OFF = 0.20;        // subscribe & save on single products
  const STACK_SUB_OFF = 0.10;  // extra off a stack/bundle when subscribed
  const BUNDLE_OFF = 0.15;     // personal bundle built by the survey
  const FREE_SHIP = 60;
  const SHIPPING = 5.95;

  const GOALS = {
    strength:  "Strength",
    energy:    "Energy",
    sleep:     "Sleep",
    stress:    "Stress",
    focus:     "Focus",
    heart:     "Heart & longevity",
    recovery:  "Recovery",
    essentials:"Daily essentials",
  };

  const PRODUCTS = [
    {
      id: "foundation", lbl: "50 mcg VITAMIN D3", num: "01", name: "Foundation", kind: "Daily multivitamin", shape: "bottle", color: "#e9e9e7", labelInk: "#1a1a1a",
      purpose: "The nutrients most men run low on, in forms your body actually uses.",
      price: 34, servings: 30, form: "2 capsules", tag: "Bestseller",
      goals: ["essentials", "energy", "heart"],
      key: [["Vitamin D3", "50 mcg"], ["Zinc", "15 mg"], ["Vitamin K2 (MK-7)", "100 mcg"]],
      benefits: ["Supports immune function and energy metabolism*", "Supports healthy testosterone levels already in the normal range*", "Methylated B vitamins for better absorption"],
      facts: [
        ["Vitamin C (as ascorbic acid)", "90 mg", "100%"],
        ["Vitamin D3 (as cholecalciferol)", "50 mcg (2,000 IU)", "250%"],
        ["Vitamin K2 (as menaquinone-7)", "100 mcg", "83%"],
        ["Folate (as L-methylfolate)", "400 mcg DFE", "100%"],
        ["Vitamin B12 (as methylcobalamin)", "250 mcg", "10,417%"],
        ["Iodine (from potassium iodide)", "150 mcg", "100%"],
        ["Zinc (as zinc bisglycinate)", "15 mg", "136%"],
        ["Selenium (as L-selenomethionine)", "70 mcg", "127%"],
        ["Boron (as boron glycinate)", "3 mg", "†"],
      ],
      other: "Hypromellose (capsule), rice hull concentrate.",
      take: "2 capsules daily with a meal that contains some fat.",
      free: ["Vegan", "Gluten free", "Non-GMO"],
      caution: "Contains vitamin K2. If you take blood thinners such as warfarin, speak with your doctor before use.",
    },
    {
      id: "omega", lbl: "1,000 mg EPA", num: "02", name: "Omega", kind: "Fish oil · EPA + DHA", shape: "bottle", color: "#e4e4e2", labelInk: "#1a1a1a",
      purpose: "High-potency omega-3s from small, wild-caught fish. No fishy burps.",
      price: 32, servings: 30, form: "2 softgels",
      goals: ["heart", "recovery", "focus"],
      key: [["EPA", "1,000 mg"], ["DHA", "500 mg"], ["Total omega-3", "1,600 mg"]],
      benefits: ["Supports heart and cardiovascular health*", "Supports brain function and mood*", "Re-esterified triglyceride form for better absorption"],
      facts: [
        ["Calories", "20", ""],
        ["Total fat", "2 g", "3%"],
        ["Fish oil concentrate", "2,000 mg", "†"],
        ["Total omega-3 fatty acids", "1,600 mg", "†"],
        ["  EPA (eicosapentaenoic acid)", "1,000 mg", "†"],
        ["  DHA (docosahexaenoic acid)", "500 mg", "†"],
      ],
      other: "Fish oil (anchovy, sardine), softgel (bovine gelatin, glycerin, water), natural lemon oil, rosemary extract.",
      take: "2 softgels daily with food.",
      free: ["Gluten free", "IFOS 5-star", "Mercury tested"],
      caution: "Contains fish. If you take blood thinners, speak with your doctor before use.",
    },
    {
      id: "creatine", lbl: "5 g CREATINE", num: "03", name: "Creatine", kind: "Micronized monohydrate", shape: "tub", color: "#ebebe9", labelInk: "#1a1a1a",
      purpose: "The most researched supplement in sports nutrition. One scoop, nothing else.",
      price: 29, servings: 60, form: "1 scoop (5 g)", tag: "Most studied",
      goals: ["strength", "recovery", "focus"],
      key: [["Creatine monohydrate", "5 g"], ["Flavor", "None"], ["Servings", "60"]],
      benefits: ["Supports strength and power output during training*", "Supports lean muscle when paired with resistance training*", "Emerging research on cognitive performance*"],
      facts: [["Creatine monohydrate (micronized)", "5 g", "†"]],
      other: "None.",
      take: "1 scoop (5 g) daily in water or any drink. Timing doesn't matter. Consistency does.",
      free: ["Vegan", "Unflavored", "Single ingredient"],
      caution: "Drink plenty of water. If you have kidney disease, speak with your doctor before use.",
    },
    {
      id: "magnesium", lbl: "200 mg MAGNESIUM", num: "04", name: "Magnesium", kind: "Bisglycinate", shape: "bottle", color: "#dededc", labelInk: "#1a1a1a",
      purpose: "The gentle, well-absorbed form of a mineral most men don't get enough of.",
      price: 24, servings: 30, form: "2 capsules",
      goals: ["sleep", "recovery", "stress"],
      key: [["Magnesium (elemental)", "200 mg"], ["Form", "Bisglycinate"], ["Stomach", "Gentle"]],
      benefits: ["Supports muscle relaxation and recovery*", "Supports restful sleep*", "Chelated form, easy on digestion"],
      facts: [["Magnesium (as magnesium bisglycinate chelate)", "200 mg", "48%"]],
      other: "Hypromellose (capsule), rice hull concentrate.",
      take: "2 capsules in the evening, with or without food.",
      free: ["Vegan", "Gluten free", "Non-GMO"],
      caution: "If you have kidney disease, speak with your doctor before use.",
    },
    {
      id: "ashwagandha", lbl: "600 mg ASHWAGANDHA", num: "05", name: "Calm", kind: "Ashwagandha root extract", shape: "bottle", color: "#e2e2e0", labelInk: "#1a1a1a",
      purpose: "A clinically studied adaptogen for staying level when life isn't.",
      price: 28, servings: 30, form: "1 capsule",
      goals: ["stress", "sleep", "strength"],
      key: [["Ashwagandha root extract", "600 mg"], ["Withanolides", "5%"], ["Part used", "Root only"]],
      benefits: ["Supports a healthy response to everyday stress*", "Supports sleep quality*", "Full-spectrum root extract, standardized"],
      facts: [["Ashwagandha root extract (Withania somnifera) standardized to 5% withanolides", "600 mg", "†"]],
      other: "Hypromellose (capsule).",
      take: "1 capsule daily, morning or evening. Cycle 8 weeks on, 2 weeks off.",
      free: ["Vegan", "Gluten free", "Root only"],
      caution: "Not for use with thyroid medication, sedatives, immunosuppressants, or if you have a thyroid or autoimmune condition. Speak with your doctor first.",
    },
    {
      id: "protein", lbl: "25 g PROTEIN", num: "06", name: "Protein", kind: "Grass-fed whey isolate", shape: "tub", color: "#d9d9d7", labelInk: "#1a1a1a",
      purpose: "25 g of clean protein per scoop. Mixes smooth, tastes like real vanilla.",
      price: 54, servings: 30, form: "1 scoop (30 g)",
      goals: ["strength", "recovery"],
      key: [["Protein", "25 g"], ["Sugar", "0 g"], ["Calories", "110"]],
      benefits: ["Supports muscle growth and repair*", "Cold-processed isolate from grass-fed cows", "Sweetened with monk fruit. No sucralose"],
      facts: [
        ["Calories", "110", ""],
        ["Total fat", "0.5 g", "1%"],
        ["Total carbohydrate", "1 g", "<1%"],
        ["  Total sugars", "0 g", ""],
        ["Protein", "25 g", "50%"],
        ["Sodium", "50 mg", "2%"],
        ["Calcium", "120 mg", "9%"],
      ],
      other: "Grass-fed whey protein isolate (milk), natural vanilla flavor, sunflower lecithin, monk fruit extract, sea salt.",
      take: "1 scoop in 8–10 oz of water or milk. Use after training or to top up protein at any meal.",
      free: ["Gluten free", "No added sugar", "Hormone free"],
      caution: "Contains milk.",
    },
    {
      id: "hydrate", lbl: "1,000 mg SODIUM", num: "07", name: "Hydrate", kind: "Electrolyte drink mix", shape: "tub", color: "#e6e6e4", labelInk: "#1a1a1a",
      purpose: "Real electrolyte doses for training, heat and early mornings. Zero sugar.",
      price: 30, servings: 30, form: "1 stick",
      goals: ["energy", "recovery"],
      key: [["Sodium", "1,000 mg"], ["Potassium", "200 mg"], ["Sugar", "0 g"]],
      benefits: ["Replaces what you lose in sweat*", "Supports hydration and muscle function*", "Lightly flavored citrus-salt, no dyes"],
      facts: [
        ["Calories", "5", ""],
        ["Total carbohydrate", "1 g", "<1%"],
        ["Sodium (as sodium chloride, sodium citrate)", "1,000 mg", "43%"],
        ["Potassium (as potassium chloride)", "200 mg", "4%"],
        ["Magnesium (as magnesium malate)", "60 mg", "14%"],
      ],
      other: "Citric acid, natural citrus flavor, stevia leaf extract.",
      take: "1 stick in 16–32 oz of water. Before or during training, or first thing in the morning.",
      free: ["Vegan", "Zero sugar", "No dyes"],
      caution: "High in sodium. If you're on a sodium-restricted diet or have high blood pressure, speak with your doctor first.",
    },
    {
      id: "rest", lbl: "3 g GLYCINE", num: "08", name: "Rest", kind: "Non-habit-forming sleep", shape: "bottle", color: "#dcdcda", labelInk: "#1a1a1a",
      purpose: "Wind down without melatonin. Wake up without the fog.",
      price: 32, servings: 30, form: "3 capsules",
      goals: ["sleep", "stress"],
      key: [["Glycine", "3 g"], ["L-theanine", "200 mg"], ["Apigenin", "50 mg"]],
      benefits: ["Supports falling asleep and sleep quality*", "Melatonin-free: no grogginess or tolerance", "Pairs well with Magnesium"],
      facts: [
        ["Glycine", "3 g", "†"],
        ["L-Theanine", "200 mg", "†"],
        ["Apigenin (from chamomile extract)", "50 mg", "†"],
      ],
      other: "Hypromellose (capsule).",
      take: "3 capsules 30–60 minutes before bed.",
      free: ["Vegan", "Melatonin free", "Gluten free"],
      caution: "Don't combine with sedatives or alcohol. Speak with your doctor if you take medication.",
    },
    {
      id: "focus", lbl: "100 mg CAFFEINE", num: "09", name: "Focus", kind: "Caffeine + L-theanine", shape: "bottle", color: "#d6d6d4", labelInk: "#1a1a1a",
      purpose: "A clean, steady lift. About one cup of coffee, without the crash.",
      price: 30, servings: 30, form: "1 capsule",
      goals: ["focus", "energy"],
      key: [["Natural caffeine", "100 mg"], ["L-theanine", "200 mg"], ["L-tyrosine", "500 mg"]],
      benefits: ["Supports alertness and concentration*", "Theanine smooths out the caffeine edge*", "Caffeine from green coffee beans"],
      facts: [
        ["L-Tyrosine", "500 mg", "†"],
        ["L-Theanine", "200 mg", "†"],
        ["Natural caffeine (from green coffee bean)", "100 mg", "†"],
      ],
      other: "Hypromellose (capsule), rice hull concentrate.",
      take: "1 capsule in the morning or early afternoon. Avoid within 8 hours of bed.",
      free: ["Vegan", "Gluten free", "No sugar"],
      caution: "Contains 100 mg caffeine. Don't combine with other stimulants. Not for use if you're sensitive to caffeine or take MAOIs.",
    },
  ];
  const P = Object.fromEntries(PRODUCTS.map(p => [p.id, p]));

  const STACKS = [
    { id: "s-foundation", name: "The Foundation Stack", for: "Cover the basics: daily nutrients, omega-3s and magnesium.", items: ["foundation", "omega", "magnesium"], off: 0.15 },
    { id: "s-strength",   name: "The Strength Stack",   for: "For lifting 3+ days a week and recovering properly between.", items: ["creatine", "protein", "hydrate", "foundation"], off: 0.20 },
    { id: "s-sleep",      name: "The Recovery Stack",    for: "Better sleep, calmer evenings and steadier days.", items: ["magnesium", "rest", "ashwagandha"], off: 0.15 },
    { id: "s-focus",      name: "The Performance Stack", for: "Sharp mornings and long days of deep work.", items: ["focus", "omega", "creatine"], off: 0.15 },
  ];
  const S = Object.fromEntries(STACKS.map(s => [s.id, s]));

  /* ───────────────────────── Helpers ───────────────────────── */
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const money = n => "$" + n.toFixed(2).replace(/\.00$/, "");
  const money2 = n => "$" + n.toFixed(2);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const stackBase = s => s.items.reduce((t, id) => t + P[id].price, 0);
  const stackPrice = s => Math.round(stackBase(s) * (1 - s.off));
  const bundleBase = ids => ids.reduce((t, id) => t + P[id].price, 0);

  let toastTimer;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2400);
  }

  /* Product imagery: studio renders in img/ (swap for real photography 1:1) */
  function art(p) {
    return `<img src="img/${p.id}.webp" alt="Tropos ${esc(p.name)}, ${esc(p.kind)}" width="800" height="1000" loading="lazy" decoding="async">`;
  }

  function factsPanel(p) {
    const rows = p.facts.map(([n, a, dv]) => {
      const indent = n.startsWith("  ");
      return `<tr><td${indent ? ' style="padding-left:14px"' : ""}>${esc(n.trim())}</td><td>${esc(a)}</td><td>${esc(dv)}</td></tr>`;
    }).join("");
    return `<div class="facts">
      <h4 class="facts-title">Supplement Facts</h4>
      <div class="facts-serv">Serving size: ${esc(p.form)}<br>Servings per container: ${p.servings}</div>
      <table>
        <thead><tr><th>Amount per serving</th><th></th><th>% Daily Value</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <div class="facts-foot">† Daily Value not established.</div>
      <div class="facts-other"><strong>Other ingredients:</strong> ${esc(p.other)}</div>
    </div>`;
  }

  /* ───────────────────────── Cart state ───────────────────────── */
  // line: { key, type: 'product'|'stack'|'bundle', id, items?, qty, sub, freq }
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem("tropos-cart") || "[]").filter(l => (l.type === "bundle" ? Array.isArray(l.items) && l.items.length && l.items.every(i => P[i]) : l.type === "product" ? P[l.id] : S[l.id])); } catch { cart = []; }
  const save = () => { try { localStorage.setItem("tropos-cart", JSON.stringify(cart)); } catch {} };

  function linePricing(l) {
    if (l.type === "product") {
      const full = P[l.id].price;
      const each = l.sub ? full * (1 - SUB_OFF) : full;
      return { full: full * l.qty, now: each * l.qty };
    }
    if (l.type === "bundle") {
      const full = bundleBase(l.items);
      const each = full * (1 - BUNDLE_OFF) * (l.sub ? 1 - STACK_SUB_OFF : 1);
      return { full: full * l.qty, now: each * l.qty };
    }
    const s = S[l.id];
    const full = stackBase(s);
    const each = stackPrice(s) * (l.sub ? 1 - STACK_SUB_OFF : 1);
    return { full: full * l.qty, now: each * l.qty };
  }

  function addToCart(type, id, { sub = true, qty = 1, silent = false, items } = {}) {
    if (type === "bundle") cart = cart.filter(l => l.type !== "bundle"); // one personal bundle at a time
    const existing = type !== "bundle" && cart.find(l => l.type === type && l.id === id && l.sub === sub);
    if (existing) existing.qty += qty;
    else cart.push({ key: type + ":" + id + ":" + Date.now() + Math.random().toString(36).slice(2, 6), type, id, items, qty, sub, freq: 30 });
    save();
    renderCart();
    const c = $("#cartCount");
    c.classList.remove("bump"); void c.offsetWidth; c.classList.add("bump");
    if (!silent) toast(`${type === "product" ? P[id].name : type === "bundle" ? "Your bundle" : S[id].name} added${sub ? " · subscribe & save" : ""}`);
  }

  function renderCart() {
    const count = cart.reduce((n, l) => n + l.qty, 0);
    $("#cartCount").textContent = count;

    let full = 0, now = 0, anySub = false;
    cart.forEach(l => { const pr = linePricing(l); full += pr.full; now += pr.now; if (l.sub) anySub = true; });
    const freeShip = anySub || now >= FREE_SHIP;
    const ship = cart.length === 0 || freeShip ? 0 : SHIPPING;

    const meter = $("#shipMeter");
    if (!cart.length) meter.innerHTML = `Free shipping on subscriptions and orders over ${money(FREE_SHIP)}.`;
    else if (freeShip) meter.innerHTML = `<strong>You've unlocked free shipping.</strong><div class="bar"><div style="width:100%"></div></div>`;
    else meter.innerHTML = `You're <strong>${money2(FREE_SHIP - now)}</strong> away from free shipping. Or subscribe to any item.<div class="bar"><div style="width:${Math.min(100, (now / FREE_SHIP) * 100)}%"></div></div>`;

    const body = $("#cartItems");
    if (!cart.length) {
      body.innerHTML = `<div class="empty"><h4>Your cart is empty</h4><p>Not sure where to start? The survey takes two minutes and builds your bundle for you.</p><a href="#quiz" class="btn btn-primary btn-sm" data-close>Take the survey</a></div>`;
      $("#cartFoot").innerHTML = "";
      return;
    }

    body.innerHTML = cart.map(l => {
      const isP = l.type === "product";
      const item = isP ? P[l.id] : l.type === "bundle" ? { name: "Your Tropos bundle", items: l.items } : S[l.id];
      const pr = linePricing(l);
      const sub = isP ? `${esc(item.kind)} · ${item.servings}-day supply` : item.items.map(i => P[i].name).join(" + ");
      const media = isP ? art(item) : art(P[item.items[0]]);
      const offLabel = isP ? "Save 20%" : "Extra 10%";
      return `<div class="line" data-key="${l.key}">
        <div class="line-media">${media}</div>
        <div>
          <div class="line-top">
            <div><h4>${esc(item.name)}</h4><div class="line-sub">${sub}</div></div>
            <div class="line-price">${pr.full > pr.now ? `<s>${money2(pr.full)}</s>` : ""}${money2(pr.now)}</div>
          </div>
          <div class="purchase-toggle" role="group" aria-label="Purchase type">
            <button class="${l.sub ? "on" : ""}" data-act="sub" data-val="1">Subscribe · ${offLabel}</button>
            <button class="${l.sub ? "" : "on"}" data-act="sub" data-val="0">One-time</button>
          </div>
          ${l.sub ? `<div class="freq">Deliver every <select data-act="freq" aria-label="Delivery frequency">${[30, 60, 90].map(d => `<option value="${d}" ${l.freq == d ? "selected" : ""}>${d} days</option>`).join("")}</select></div>` : ""}
          <div class="line-controls">
            <div class="qty"><button data-act="dec" aria-label="Decrease">−</button><span>${l.qty}</span><button data-act="inc" aria-label="Increase">+</button></div>
            <button class="line-remove" data-act="remove">Remove</button>
          </div>
        </div>
      </div>`;
    }).join("");

    $("#cartFoot").innerHTML = `
      <div class="sum-row"><span>Subtotal</span><span>${money2(full)}</span></div>
      ${full > now ? `<div class="sum-row save"><span>Bundle &amp; subscription savings</span><span>−${money2(full - now)}</span></div>` : ""}
      <div class="sum-row"><span>Shipping</span><span>${ship ? money2(ship) : "Free"}</span></div>
      <div class="sum-row total"><span>Total</span><span>${money2(now + ship)}</span></div>
      <button class="btn btn-primary btn-block" id="checkoutBtn">Checkout</button>
      <p class="fine">${anySub ? "Subscriptions renew automatically. Skip, pause or cancel any time." : "30-day money-back guarantee on your first order."}</p>`;
  }

  $("#cartItems").addEventListener("click", e => {
    const btn = e.target.closest("[data-act]");
    if (!btn || btn.tagName === "SELECT") return;
    const line = cart.find(l => l.key === btn.closest(".line").dataset.key);
    if (!line) return;
    const act = btn.dataset.act;
    if (act === "inc") line.qty++;
    if (act === "dec") line.qty = Math.max(1, line.qty - 1);
    if (act === "remove") cart = cart.filter(l => l !== line);
    if (act === "sub") line.sub = btn.dataset.val === "1";
    save(); renderCart();
  });
  $("#cartItems").addEventListener("change", e => {
    if (e.target.dataset.act !== "freq") return;
    const line = cart.find(l => l.key === e.target.closest(".line").dataset.key);
    if (line) { line.freq = +e.target.value; save(); }
  });
  $("#cartFoot").addEventListener("click", e => {
    if (e.target.id !== "checkoutBtn") return;
    toast("Demo store: checkout isn't connected yet.");
  });

  /* Drawer open/close */
  const drawer = $("#cart"), scrim = $("#scrim"), modal = $("#modal");
  function openCart() { drawer.classList.add("open"); scrim.classList.add("show"); drawer.setAttribute("aria-hidden", "false"); document.body.classList.add("locked"); }
  function closeCart() { drawer.classList.remove("open"); scrim.classList.remove("show"); drawer.setAttribute("aria-hidden", "true"); if (!modal.classList.contains("open")) document.body.classList.remove("locked"); }
  $("#cartBtn").addEventListener("click", openCart);
  scrim.addEventListener("click", closeCart);
  drawer.addEventListener("click", e => { if (e.target.closest("[data-close]")) closeCart(); });

  /* ───────────────────────── Shop ───────────────────────── */
  function renderShop() {
    const filters = [["all", "All"], ...Object.entries(GOALS)];
    $("#filters").innerHTML = filters.map(([k, v], i) => `<button class="chip ${i === 0 ? "active" : ""}" data-filter="${k}" role="tab" aria-selected="${i === 0}">${v}</button>`).join("");

    $("#productGrid").innerHTML = PRODUCTS.map(p => `
      <article class="card" data-goals="${p.goals.join(" ")}">
        <div class="card-media" style="background:${p.color}" data-open="${p.id}" role="button" tabindex="0" aria-label="View ${esc(p.name)} details">
          <span class="card-num">${p.num}</span>
          ${p.tag ? `<span class="card-tag">${p.tag}</span>` : ""}
          ${art(p)}
        </div>
        <div class="card-body">
          <div class="card-top">
            <h3>${esc(p.name)}</h3>
            <div class="card-price">${money(p.price * (1 - SUB_OFF))}<small>or ${money(p.price)} once</small></div>
          </div>
          <p class="card-purpose">${esc(p.kind)}</p>
          <ul class="key-doses">${p.key.map(([k, v]) => `<li><span>${esc(k)}</span><span>${esc(v)}</span></li>`).join("")}</ul>
          <p class="card-meta">${p.servings} servings · ${esc(p.form)} · ${p.free.slice(0, 2).join(" · ")}</p>
          <div class="card-actions">
            <button class="btn btn-ghost btn-sm" data-open="${p.id}">Label &amp; details</button>
            <button class="btn btn-primary btn-sm" data-add="${p.id}">Add</button>
          </div>
        </div>
      </article>`).join("");
  }

  $("#filters").addEventListener("click", e => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    $$(".chip").forEach(c => { c.classList.toggle("active", c === chip); c.setAttribute("aria-selected", c === chip); });
    const f = chip.dataset.filter;
    $$("#productGrid .card").forEach(card => card.classList.toggle("hide", f !== "all" && !card.dataset.goals.split(" ").includes(f)));
  });

  document.addEventListener("click", e => {
    const add = e.target.closest("[data-add]");
    if (add) { addToCart("product", add.dataset.add); return; }
    const addStack = e.target.closest("[data-add-stack]");
    if (addStack) { addToCart("stack", addStack.dataset.addStack); return; }
    const open = e.target.closest("[data-open]");
    if (open) openModal(open.dataset.open);
  });
  document.addEventListener("keydown", e => {
    if ((e.key === "Enter" || e.key === " ") && e.target.matches(".card-media")) { e.preventDefault(); openModal(e.target.dataset.open); }
    if (e.key === "Escape") { closeModal(); closeCart(); }
  });

  /* ───────────────────────── Stacks ───────────────────────── */
  function renderStacks() {
    $("#stackGrid").innerHTML = STACKS.map(s => {
      const base = stackBase(s), price = stackPrice(s);
      return `<article class="stack">
        <div class="stack-top">
          <div><h3>${esc(s.name)}</h3><p class="stack-for">${esc(s.for)}</p></div>
          <span class="save-pill">Save ${Math.round(s.off * 100)}%</span>
        </div>
        <div class="stack-bottles">${s.items.map(id => `<span class="${P[id].shape}">${art(P[id])}</span>`).join("")}</div>
        <ul class="stack-items">${s.items.map(id => `<li><span>${P[id].name} · ${esc(P[id].kind)}</span><span>${money(P[id].price)}</span></li>`).join("")}</ul>
        <div class="stack-foot">
          <div class="stack-price"><strong>${money(price)}</strong><s>${money(base)}</s><small>${money(price * (1 - STACK_SUB_OFF))} per delivery with subscription</small></div>
          <button class="btn btn-primary btn-sm" data-add-stack="${s.id}">Add stack</button>
        </div>
      </article>`;
    }).join("");
  }

  /* ───────────────────────── Product modal ───────────────────────── */
  let modalSub = true;
  function openModal(id) {
    const p = P[id];
    if (!p) return;
    modalSub = true;
    const panel = $("#modalPanel");
    const pairs = STACKS.filter(s => s.items.includes(id)).flatMap(s => s.items).filter((x, i, a) => x !== id && a.indexOf(x) === i).slice(0, 3);
    panel.innerHTML = `
      <button class="icon-btn modal-close" data-close-modal aria-label="Close">✕</button>
      <div class="pd">
        <div class="pd-media" style="background:${p.color}">${art(p)}<div class="pd-badges">${p.free.map(f => `<span>${esc(f)}</span>`).join("")}<span>3rd-party tested</span></div></div>
        <div class="pd-info">
          <p class="eyebrow">${p.num} · ${esc(p.kind)}</p>
          <h2 id="modalTitle">${esc(p.name)}</h2>
          <p class="pd-purpose">${esc(p.purpose)}</p>
          <ul class="pd-benefits">${p.benefits.map(b => `<li>${esc(b)}</li>`).join("")}</ul>
          <div class="buy-opts" role="radiogroup" aria-label="Purchase option">
            <button class="buy-opt on" data-buy="1" role="radio" aria-checked="true"><span><strong>Subscribe &amp; save 20%</strong><small>Ships every 30 days · free shipping · cancel any time</small></span><span class="p"><s>${money(p.price)}</s>${money2(p.price * (1 - SUB_OFF))}</span></button>
            <button class="buy-opt" data-buy="0" role="radio" aria-checked="false"><span><strong>One-time purchase</strong><small>${p.servings}-day supply</small></span><span class="p">${money2(p.price)}</span></button>
          </div>
          <button class="btn btn-primary btn-block" id="modalAdd">Add to cart</button>
          <div class="pd-tabs">
            <details open><summary>Supplement facts</summary><div class="tab-body">${factsPanel(p)}</div></details>
            <details><summary>How to take</summary><div class="tab-body"><p>${esc(p.take)}</p>${p.caution ? `<div class="caution"><strong>Caution:</strong> ${esc(p.caution)}</div>` : ""}</div></details>
            <details><summary>Testing &amp; sourcing</summary><div class="tab-body"><p>Made in an NSF-certified, cGMP facility. Every batch is tested by an independent ISO 17025-accredited lab for identity, potency, microbes and heavy metals (lead, mercury, cadmium, arsenic).</p><p>Find the lot number on the bottom of your ${p.shape === "tub" ? "tub" : "bottle"} to see that batch's results.</p></div></details>
            ${pairs.length ? `<details><summary>Pairs well with</summary><div class="tab-body"><p>${pairs.map(x => `<a href="#" data-open="${x}" style="text-decoration:underline">${P[x].name}</a>`).join(", ")}</p></div></details>` : ""}
          </div>
        </div>
      </div>`;
    modal.setAttribute("aria-labelledby", "modalTitle");
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("locked");
    panel.scrollTop = 0;
    $("#modalAdd").onclick = () => { addToCart("product", id, { sub: modalSub }); closeModal(); };
    $(".modal-close", panel).focus();
  }
  function closeModal() {
    if (!modal.classList.contains("open")) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    if (!drawer.classList.contains("open")) document.body.classList.remove("locked");
  }
  modal.addEventListener("click", e => {
    if (e.target === modal || e.target.closest("[data-close-modal]")) { closeModal(); return; }
    const opt = e.target.closest("[data-buy]");
    if (opt) {
      modalSub = opt.dataset.buy === "1";
      $$("[data-buy]", modal).forEach(b => { const on = b === opt; b.classList.toggle("on", on); b.setAttribute("aria-checked", on); });
    }
    if (e.target.closest("a[data-open]")) e.preventDefault();
  });

  /* ───────────────────────── Quiz ───────────────────────── */
  const QUESTIONS = [
    { name: "goals", type: "checkbox", max: 3, title: "What are you working on?", help: "Pick up to three. We'll prioritize in that order.", cols: 2, options: [
      ["strength", "Build strength & muscle", "Lifting, sport, getting stronger"],
      ["energy", "More daily energy", "Fewer afternoon slumps"],
      ["sleep", "Sleep deeper", "Fall asleep faster, wake up rested"],
      ["stress", "Handle stress better", "Feel calmer and more even"],
      ["focus", "Sharper focus", "Long stretches of deep work"],
      ["heart", "Heart & long-term health", "Playing the long game"],
      ["recovery", "Recover faster", "Less soreness between sessions"],
      ["essentials", "Cover nutritional gaps", "A solid daily baseline"],
    ] },
    { name: "age", type: "radio", title: "How old are you?", help: "Nutrient needs shift with age.", cols: 4, options: [
      ["u30", "Under 30"], ["30s", "30–39"], ["40s", "40–49"], ["50p", "50+"],
    ] },
    { name: "training", type: "radio", title: "How often do you train?", help: "Any structured exercise counts: lifting, running, sport, classes.", cols: 2, options: [
      ["0", "Rarely", "Less than once a week"], ["1", "1–2 days a week", "Staying active"],
      ["3", "3–4 days a week", "Consistent routine"], ["5", "5+ days a week", "Training hard"],
    ] },
    { name: "sleep", type: "radio", title: "How's your sleep, honestly?", cols: 2, options: [
      ["good", "Solid", "Fall asleep easily, wake up rested"], ["ok", "Hit or miss", "Some good nights, some not"],
      ["poor", "Rough", "Trouble falling or staying asleep"], ["short", "Not enough of it", "Schedule cuts it short"],
    ] },
    { name: "stress", type: "radio", title: "Day to day, how stressed do you feel?", cols: 4, options: [
      ["low", "Low"], ["mod", "Moderate"], ["high", "High"], ["vhigh", "Very high"],
    ] },
    { name: "diet", type: "radio", title: "Which best describes how you eat?", cols: 2, options: [
      ["omni", "I eat most things", "Meat, fish, dairy"], ["nofish", "Rarely eat fish", "Fewer than 2 servings a week"],
      ["veg", "Vegetarian", "No meat or fish"], ["vegan", "Vegan", "No animal products"],
    ] },
    { name: "extras", type: "checkbox", title: "Anything else we should know?", help: "Optional. Select any that apply.", cols: 2, optional: true, options: [
      ["caffeine", "I'm sensitive to caffeine", "Or already drink a lot of it"],
      ["indoors", "I spend most days indoors", "Limited sun exposure"],
      ["sweat", "I sweat a lot", "Hot climate, long sessions, sauna"],
      ["meds", "I take prescription medication", "We'll flag anything to check with your doctor"],
    ] },
  ];

  const form = $("#quizForm");
  let step = 0;

  function renderQuiz() {
    form.innerHTML = QUESTIONS.map((q, i) => `
      <fieldset class="quiz-step ${i === 0 ? "active" : ""}" data-step="${i}" style="border:0;margin:0;min-width:0">
        <p class="q-count">Question ${i + 1} of ${QUESTIONS.length}</p>
        <legend class="q-title" style="padding:0">${esc(q.title)}</legend>
        ${q.help ? `<p class="q-help">${esc(q.help)}</p>` : `<div style="height:20px"></div>`}
        <div class="options ${q.cols === 4 ? "cols-4" : ""}">
          ${q.options.map(([v, t, s]) => `<div class="opt">
            <input type="${q.type}" id="q-${q.name}-${v}" name="${q.name}" value="${v}">
            <label for="q-${q.name}-${v}"><span class="box"></span><span class="opt-text"><strong>${esc(t)}</strong>${s ? `<small>${esc(s)}</small>` : ""}</span></label>
          </div>`).join("")}
        </div>
        <p class="q-error" aria-live="polite"></p>
        <div class="q-nav">
          <button type="button" class="q-back" data-q="back" ${i === 0 ? "disabled" : ""}>← Back</button>
          <button type="button" class="btn btn-primary" data-q="next">${i === QUESTIONS.length - 1 ? "Build my bundle" : "Continue"} <span aria-hidden="true">→</span></button>
        </div>
      </fieldset>`).join("");
    updateBar();
  }

  function updateBar() { $("#quizBar").style.width = `${(step / QUESTIONS.length) * 100}%`; }

  function values(name) { return $$(`input[name="${name}"]:checked`, form).map(i => i.value); }

  form.addEventListener("change", e => {
    const q = QUESTIONS.find(q => q.name === e.target.name);
    if (q && q.max && values(q.name).length > q.max) {
      e.target.checked = false;
      $(".quiz-step.active .q-error", form).textContent = `Pick up to ${q.max}. Unselect one to swap.`;
      return;
    }
    $(".quiz-step.active .q-error", form).textContent = "";
    // radios auto-advance for a quicker flow
    if (q && q.type === "radio") setTimeout(() => go(1), 220);
  });

  form.addEventListener("click", e => {
    const b = e.target.closest("[data-q]");
    if (!b) return;
    go(b.dataset.q === "next" ? 1 : -1);
  });

  function go(dir) {
    const q = QUESTIONS[step];
    if (dir > 0 && !q.optional && values(q.name).length === 0) {
      $(".quiz-step.active .q-error", form).textContent = "Choose an option to continue.";
      return;
    }
    if (dir > 0 && step === QUESTIONS.length - 1) { showResult(); return; }
    step = Math.max(0, Math.min(QUESTIONS.length - 1, step + dir));
    $$(".quiz-step", form).forEach((el, i) => el.classList.toggle("active", i === step));
    updateBar();
  }

  function recommend(a) {
    const goals = a.goals;
    const has = g => goals.includes(g);
    const w = g => { const i = goals.indexOf(g); return i < 0 ? 0 : [1.3, 1.15, 1][i]; }; // first pick weighs most
    const ex = a.extras;
    const training = +a.training[0];
    const sleep = a.sleep[0], stress = a.stress[0], diet = a.diet[0], age = a.age[0];

    const r = {}; // id -> { score, why: [] }
    const add = (id, pts, why) => { (r[id] ||= { score: 0, why: [] }); r[id].score += pts; if (why) r[id].why.push(why); };

    // Foundation: everyone's baseline
    add("foundation", 3 + 3 * w("essentials"), has("essentials") ? "you want to <b>cover nutritional gaps</b>" : "it's the <b>foundation</b> every bundle is built on");
    if (ex.includes("indoors")) add("foundation", 2, "you're <b>mostly indoors</b>, so vitamin D matters more");
    if (diet === "vegan" || diet === "veg") add("foundation", 1, `B12 is hard to get on a <b>${diet === "vegan" ? "vegan" : "vegetarian"}</b> diet`);
    if (age === "40s" || age === "50p") add("foundation", 1, "zinc and D3 needs rise <b>after 40</b>");

    // Omega (fish oil: not for vegetarians/vegans)
    if (diet !== "veg" && diet !== "vegan") {
      if (has("heart")) add("omega", 4 * w("heart"), "you're focused on <b>heart &amp; long-term health</b>");
      if (diet === "nofish") add("omega", 3, "you <b>rarely eat fish</b>, the main source of EPA &amp; DHA");
      if (has("focus")) add("omega", 1.5 * w("focus"), "DHA supports <b>brain function</b>");
      if (has("recovery")) add("omega", 1.5 * w("recovery"), "omega-3s support <b>recovery</b>");
      if (age === "50p" || age === "40s") add("omega", 1);
    }

    // Creatine
    if (has("strength")) add("creatine", 4 * w("strength"), "it's the best-studied supplement for <b>strength</b>");
    if (training >= 3) add("creatine", 2, `you train <b>${training === 5 ? "5+" : "3–4"} days a week</b>`);
    if (has("focus")) add("creatine", 1 * w("focus"));
    if (has("recovery")) add("creatine", 1 * w("recovery"));

    // Magnesium
    if (has("sleep")) add("magnesium", 2.5 * w("sleep"), "it supports <b>restful sleep</b>");
    if (has("recovery")) add("magnesium", 2.5 * w("recovery"), "it supports <b>muscle recovery</b>");
    if (has("stress")) add("magnesium", 1.5 * w("stress"));
    if (training >= 5 || ex.includes("sweat")) add("magnesium", 1, "you lose more magnesium through <b>sweat</b>");
    if (sleep === "poor" || sleep === "ok") add("magnesium", 1);

    // Ashwagandha (skip if meds: flag instead)
    if (has("stress")) add("ashwagandha", 4 * w("stress"), "you want to <b>handle stress better</b>");
    if (stress === "high" || stress === "vhigh") add("ashwagandha", 2, `your stress is <b>${stress === "vhigh" ? "very high" : "high"}</b>`);
    if (has("sleep")) add("ashwagandha", 1 * w("sleep"));

    // Protein (whey: not for vegans)
    if (diet !== "vegan") {
      if (has("strength")) add("protein", 3 * w("strength"), "hitting your <b>protein target</b> drives muscle growth");
      if (has("recovery")) add("protein", 1.5 * w("recovery"));
      if (training >= 3) add("protein", 1);
    }

    // Hydrate
    if (ex.includes("sweat")) add("hydrate", 3.5, "you <b>sweat a lot</b>");
    if (training >= 5) add("hydrate", 2, "you're <b>training 5+ days</b> a week");
    if (has("energy")) add("hydrate", 1.5 * w("energy"), "mild dehydration is a common cause of <b>low energy</b>");

    // Rest
    if (has("sleep")) add("rest", 3.5 * w("sleep"), "you want to <b>sleep deeper</b>");
    if (sleep === "poor") add("rest", 2.5, "you said sleep has been <b>rough</b>");
    if (sleep === "ok") add("rest", 1);

    // Focus (not for caffeine-sensitive)
    if (!ex.includes("caffeine")) {
      if (has("focus")) add("focus", 3 * w("focus"), "you want <b>sharper focus</b>");
      if (has("energy")) add("focus", 2.5 * w("energy"), "you want <b>steadier energy</b> without the crash");
      if (sleep === "short") add("focus", 0.5);
    }

    const ranked = Object.entries(r)
      .map(([id, v]) => ({ id, ...v }))
      .filter(x => x.score >= 3 && x.why.length)
      .sort((a, b) => b.score - a.score);

    // Always keep Foundation, cap at 5, keep ranked order
    let picks = ranked.slice(0, 5);
    if (!picks.find(x => x.id === "foundation")) picks = [...picks.slice(0, 4), ranked.find(x => x.id === "foundation")];
    picks.sort((a, b) => b.score - a.score);
    const top = picks[0].score;
    return picks.map(x => ({ ...x, match: Math.min(99, Math.round(70 + 29 * (x.score / top))) }));
  }

  let lastPicks = [];
  function showResult() {
    const answers = Object.fromEntries(QUESTIONS.map(q => [q.name, values(q.name)]));
    const picks = recommend(answers);
    lastPicks = picks.map(p => p.id);
    const full = bundleBase(lastPicks);
    const once = full * (1 - BUNDLE_OFF);
    const subTotal = once * (1 - STACK_SUB_OFF);
    const goalNames = answers.goals.map(g => GOALS[g].toLowerCase());
    const goalText = goalNames.length > 1 ? goalNames.slice(0, -1).join(", ") + " and " + goalNames.slice(-1) : goalNames[0];

    const notes = [];
    if (answers.extras.includes("meds")) notes.push("Because you take prescription medication, please check this bundle with your doctor before starting. Each product page lists its cautions.");
    if (answers.diet[0] === "veg" || answers.diet[0] === "vegan") notes.push("Omega is made from fish oil, so we've left it out. A vegan algae omega-3 is coming soon.");
    if (answers.diet[0] === "vegan") notes.push("Protein is whey (dairy), so it's not included in your bundle.");
    if (answers.extras.includes("caffeine")) notes.push("We've left out Focus since you're caffeine-sensitive.");
    if (lastPicks.includes("ashwagandha")) notes.push("Calm (ashwagandha) isn't suitable with thyroid medication or autoimmune conditions.");

    $("#quizBar").style.width = "100%";
    form.hidden = true;
    const res = $("#quizResult");
    res.hidden = false;
    res.innerHTML = `
      <div class="result-head">
        <div>
          <p class="eyebrow">Your personal bundle</p>
          <h3>${picks.length} products for ${esc(goalText)}.</h3>
          <p>Ranked by how closely each matches your answers. Bought together they're ${Math.round(BUNDLE_OFF * 100)}% off, plus another ${Math.round(STACK_SUB_OFF * 100)}% when you subscribe.</p>
        </div>
        <button class="q-back" data-restart>↺ Retake survey</button>
      </div>
      <div class="result-list">
        ${picks.map(x => {
          const p = P[x.id];
          const why = x.why.slice(0, 2).join(", and ");
          return `<div class="result-item">
            <div class="mini">${art(p)}</div>
            <div>
              <span class="match">${x.match}% match</span>
              <h4>${esc(p.name)}<span>${esc(p.kind)}</span></h4>
              <p class="result-why">Because ${why}.</p>
              <button class="q-back" style="padding:4px 0 0;font-size:13px;text-decoration:underline" data-open="${p.id}">View label</button>
            </div>
            <div class="result-price">${money(p.price)}</div>
          </div>`;
        }).join("")}
      </div>
      <div class="result-foot">
        <div class="result-total"><strong>${money2(subTotal)}</strong>per month with subscription <s style="margin-left:6px">${money2(full)}</s><br><span class="muted">or ${money2(once)} one-time · you save ${money2(full - subTotal)} a month</span></div>
        <div class="result-actions">
          <button class="btn btn-ghost" data-add-picks="0">Buy once</button>
          <button class="btn btn-primary" data-add-picks="1">Subscribe to my bundle →</button>
        </div>
      </div>
      ${notes.length ? `<div class="result-note">${notes.map(esc).join("<br>")}</div>` : ""}
      <p class="result-note" style="background:none;padding:14px 0 0">These recommendations are general guidance, not medical advice.</p>`;
    $("#quiz").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  $("#quizResult").addEventListener("click", e => {
    if (e.target.closest("[data-restart]")) {
      form.reset(); form.hidden = false; $("#quizResult").hidden = true; step = 0;
      $$(".quiz-step", form).forEach((el, i) => el.classList.toggle("active", i === 0));
      updateBar();
      return;
    }
    const b = e.target.closest("[data-add-picks]");
    if (b) {
      const sub = b.dataset.addPicks === "1";
      addToCart("bundle", "personal", { sub, items: [...lastPicks], silent: true });
      toast(`Your ${lastPicks.length}-product bundle is in your cart`);
      openCart();
    }
  });

  /* ───────────────────────── Misc ───────────────────────── */
  $("#heroVisual").innerHTML = `<img src="img/group.webp" alt="The Tropos range: Creatine, Focus, Foundation, Magnesium and Protein" width="1985" height="592">`;
  $("#labelDemo").innerHTML = factsPanel(P.foundation);

  const burger = $("#burger"), links = $("#navLinks");
  burger.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    burger.setAttribute("aria-expanded", open);
  });
  links.addEventListener("click", e => { if (e.target.tagName === "A") { links.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); } });

  // Floating survey prompt: visible after the hero, hidden while the survey is on screen or done
  const floatCta = $("#floatCta");
  const seen = { hero: true, quiz: false };
  const syncFloat = () => floatCta.classList.toggle("show", !seen.hero && !seen.quiz && $("#quizResult").hidden);
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => { seen[en.target.dataset.watch] = en.isIntersecting; });
      syncFloat();
    }, { threshold: 0.15 });
    const hero = $(".hero"); hero.dataset.watch = "hero"; io.observe(hero);
    const quiz = $("#quiz"); quiz.dataset.watch = "quiz"; io.observe(quiz);
  }

  const nav = $("#nav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  $("#newsForm").addEventListener("submit", e => {
    e.preventDefault();
    e.target.reset();
    toast("You're on the list. Thanks!");
  });

  renderShop();
  renderStacks();
  renderQuiz();
  renderCart();
})();
