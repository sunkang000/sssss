/* =========================================================
   Football Kit Shop - script.js
   ※ 상품 · 분류 · 등급 데이터는 이 파일 맨 위 배열에 모여 있습니다.
   ========================================================= */

/* ---------- 1. 분류 ---------- */
const CATEGORIES = [
  { id: "uniform", name: "유니폼" },
  { id: "boots",   name: "축구화" },
  { id: "ball",    name: "축구공" },
  { id: "gear",    name: "축구 용품" }
];

/* ---------- 2. 상품 (예시 8개, 팀 이름·브랜드는 가상) ----------
   brand: 팀 또는 제조사, info: 시즌·규격 등 한 줄 정보, sizes: 고를 수 있는 옵션 */
const PRODUCTS = [
  { id: 1, name: "한강 FC 26/27 홈 유니폼", brand: "한강 FC", info: "26/27 시즌", category: "uniform",
    price: 109000, stock: 30, sizes: ["S", "M", "L", "XL", "XXL"], image: "img/product-1.jpg",
    desc: "로열블루와 네이비 세로 줄무늬의 26/27 시즌 홈 유니폼입니다. 땀이 빨리 마르는 기능성 원단, 레귤러 핏." },
  { id: 2, name: "노르드 시티 26/27 어웨이 유니폼", brand: "노르드 시티", info: "26/27 시즌", category: "uniform",
    price: 109000, stock: 25, sizes: ["S", "M", "L", "XL", "XXL"], image: "img/product-2.jpg",
    desc: "화이트 바탕에 네이비 사선 띠를 넣은 어웨이 유니폼입니다. 브이넥, 레귤러 핏." },
  { id: 3, name: "스프린트 FG 축구화 로열블루", brand: "KIT LAB", info: "천연잔디(FG)용", category: "boots",
    price: 189000, stock: 15, sizes: ["250", "260", "270", "280"], image: "img/product-3.jpg",
    desc: "가벼운 합성 갑피와 원뿔형 스터드로 빠른 방향 전환에 맞춘 스피드형 축구화입니다." },
  { id: 4, name: "컨트롤 AG 축구화 화이트", brand: "KIT LAB", info: "인조잔디(AG)용", category: "boots",
    price: 139000, stock: 18, sizes: ["250", "260", "270", "280"], image: "img/product-4.jpg",
    desc: "인조잔디에 맞춘 짧은 스터드와 부드러운 갑피로 볼 터치가 편한 컨트롤형 축구화입니다." },
  { id: 5, name: "매치 프로 축구공 5호", brand: "KIT LAB", info: "5호 · 시합용", category: "ball",
    price: 59000, stock: 40, sizes: ["5호"], image: "img/product-5.jpg",
    desc: "열 접합 방식의 32패널 시합용 축구공입니다. 성인 경기 규격 5호." },
  { id: 6, name: "풋살공 4호 옐로", brand: "KIT LAB", info: "4호 · 풋살용", category: "ball",
    price: 39000, stock: 35, sizes: ["4호"], image: "img/product-6.jpg",
    desc: "덜 튀도록 만든 풋살 전용 4호 공입니다. 실내·야외 풋살장 모두 사용할 수 있습니다." },
  { id: 7, name: "그립 프로 골키퍼 장갑", brand: "KIT LAB", info: "라텍스 손바닥", category: "gear",
    price: 69000, stock: 20, sizes: ["8", "9", "10"], image: "img/product-7.jpg",
    desc: "4mm 라텍스 손바닥과 손목 스트랩으로 공을 잡을 때 밀리지 않도록 만든 골키퍼 장갑입니다." },
  { id: 8, name: "라이트 정강이 보호대 (1쌍)", brand: "KIT LAB", info: "1쌍 · 경량", category: "gear",
    price: 29000, stock: 50, sizes: ["S", "M", "L"], image: "img/product-8.jpg",
    desc: "가볍고 단단한 쉘과 부드러운 안쪽 쿠션으로 정강이를 보호합니다. 2개 1세트." }
];

/* ---------- 3. 회원 등급 (누적 구매 금액 기준, 4단계) ---------- */
const GRADES = [
  { id: "rookie", name: "루키",   minSpent: 0,       rate: 0.01, color: "#9DB0D6", desc: "가입 즉시 부여" },
  { id: "pro",    name: "프로",   minSpent: 200000,  rate: 0.03, color: "#6F8FFF", desc: "누적 구매 20만원 이상" },
  { id: "star",   name: "스타",   minSpent: 500000,  rate: 0.05, color: "#F5C542", desc: "누적 구매 50만원 이상" },
  { id: "legend", name: "레전드", minSpent: 1000000, rate: 0.07, color: "#FF8A65", desc: "누적 구매 100만원 이상" }
];

/* ---------- 4. 쇼핑몰 설정 ---------- */
const SETTINGS = {
  signupPoint: 3000,      // 가입 축하 포인트
  minPointUse: 1000,      // 최소 사용 포인트
  freeShipping: 50000,    // 무료배송 기준
  shippingFee: 3000,      // 배송비
  slideTime: 6000         // 슬라이드 넘어가는 시간 (6초)
};


/* =========================================================
   저장소
   지금은 브라우저(localStorage)에 저장합니다.
   다음 주 데이터베이스 연결 때는 이 DB 객체 안의 함수만
   서버 요청(fetch)으로 바꾸면 나머지 코드는 그대로 쓸 수 있습니다.
   ========================================================= */
const DB = {
  load(key, fallback) {
    try {
      const value = localStorage.getItem("fks_" + key);
      return value ? JSON.parse(value) : fallback;
    } catch (e) { return fallback; }
  },
  save(key, value) {
    try { localStorage.setItem("fks_" + key, JSON.stringify(value)); } catch (e) { /* 저장 불가 시 무시 */ }
  },
  getUsers()       { return this.load("users", {}); },
  saveUsers(users) { this.save("users", users); },
  getSession()     { return this.load("session", null); },
  saveSession(id)  { this.save("session", id); },
  getCart()        { return this.load("cart", []); },
  saveCart(cart)   { this.save("cart", cart); },
  getSold()        { return this.load("sold", {}); },     // 상품별 판매 수량 (재고 계산용)
  saveSold(sold)   { this.save("sold", sold); }
};

let users = DB.getUsers();
let session = DB.getSession();
let cart = DB.getCart();
let sold = DB.getSold();
let currentCategory = "all";
let searchWord = "";
let afterLogin = null;   // 로그인 후 이어서 할 일 (예: 결제)


/* =========================================================
   공통 함수
   ========================================================= */
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);
const won = (n) => n.toLocaleString("ko-KR") + "원";
const point = (n) => n.toLocaleString("ko-KR") + "P";
const escapeHTML = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const findProduct = (id) => PRODUCTS.find((p) => p.id === id);
const categoryName = (id) => (CATEGORIES.find((c) => c.id === id) || {}).name || "";
const twoDigit = (n) => String(n).padStart(2, "0");
function formatDate(time) {
  const d = new Date(time);
  return `${d.getFullYear()}.${twoDigit(d.getMonth() + 1)}.${twoDigit(d.getDate())} ${twoDigit(d.getHours())}:${twoDigit(d.getMinutes())}`;
}

function stockLeft(product) { return Math.max(0, product.stock - (sold[product.id] || 0)); }
function inCart(productId) { return cart.filter((c) => c.id === productId).reduce((sum, c) => sum + c.qty, 0); }

function currentUser() { return session && users[session] ? users[session] : null; }
function gradeOf(spent) {
  let grade = GRADES[0];
  GRADES.forEach((g) => { if (spent >= g.minSpent) grade = g; });
  return grade;
}
function myGrade() { const u = currentUser(); return gradeOf(u ? u.totalSpent : 0); }
function nextGrade(grade) { return GRADES[GRADES.indexOf(grade) + 1] || null; }
function gradeBadge(g) { return `<span class="grade-badge" style="background:${g.color}">${g.name}</span>`; }

let toastTimer;
function showToast(message) {
  const t = $("#toast");
  t.textContent = message;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2500);
}

/* 비밀번호는 그대로 저장하지 않고 변환(해시)해서 저장합니다. */
async function hashPassword(pw) {
  const text = "fks-salt::" + pw;
  if (window.crypto && crypto.subtle) {
    const buffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buffer)).map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  let h = 5381;
  for (const ch of text) h = ((h << 5) + h + ch.charCodeAt(0)) | 0;
  return "h" + (h >>> 0).toString(16);
}


/* =========================================================
   모달 열기 / 닫기
   ========================================================= */
function openModal(id) {
  $("#" + id).classList.add("open");
  document.body.classList.add("no-scroll");
}
function closeModal(id) {
  $("#" + id).classList.remove("open");
  if (!document.querySelector(".modal.open")) document.body.classList.remove("no-scroll");
}
document.addEventListener("click", (e) => {
  const closer = e.target.closest("[data-close]");
  if (closer) closeModal(closer.closest(".modal").id);
});
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  const opened = document.querySelectorAll(".modal.open");
  if (opened.length) closeModal(opened[opened.length - 1].id);
});


/* =========================================================
   헤더 메뉴
   ========================================================= */
$("#menuBtn").addEventListener("click", () => {
  const open = $("#nav").classList.toggle("open");
  $("#menuBtn").setAttribute("aria-expanded", open);
});
$("#logoLink").addEventListener("click", (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0 });
});
/* data-category 가 달린 링크: 분류를 바꾸고 상품 목록으로 이동 */
document.addEventListener("click", (e) => {
  const link = e.target.closest("[data-category]");
  if (!link) return;
  e.preventDefault();
  $("#nav").classList.remove("open");
  setCategory(link.dataset.category);
  $("#products").scrollIntoView();
});
$$('#nav a[href="#membership"]').forEach((a) => a.addEventListener("click", () => $("#nav").classList.remove("open")));


/* =========================================================
   메인 슬라이드 (4장, 6초마다 교차)
   ========================================================= */
const slides = $$(".slide");
let slideIndex = 0;
let slideTimer = null;

slides.forEach((_, i) => {
  const dot = document.createElement("button");
  dot.type = "button";
  dot.className = "hero-dot" + (i === 0 ? " active" : "");
  dot.setAttribute("aria-label", `${i + 1}번 슬라이드`);
  dot.innerHTML = "<span></span>";
  dot.addEventListener("click", () => { showSlide(i); restartSlide(); });
  $("#heroDots").appendChild(dot);
});

function showSlide(i) {
  slides[slideIndex].classList.remove("active");
  slideIndex = (i + slides.length) % slides.length;
  slides[slideIndex].classList.add("active");
  $$(".hero-dot").forEach((d, n) => d.classList.toggle("active", n === slideIndex));
}
function restartSlide() {
  clearInterval(slideTimer);
  slideTimer = setInterval(() => showSlide(slideIndex + 1), SETTINGS.slideTime);
}
$("#nextSlide").addEventListener("click", () => { showSlide(slideIndex + 1); restartSlide(); });
$("#prevSlide").addEventListener("click", () => { showSlide(slideIndex - 1); restartSlide(); });
restartSlide();


/* =========================================================
   상품 목록 · 검색 · 분류 필터
   ========================================================= */
function renderFilters() {
  const list = [{ id: "all", name: "전체" }, ...CATEGORIES];
  $("#filters").innerHTML = list.map((c) =>
    `<button type="button" class="filter-btn${c.id === currentCategory ? " active" : ""}" data-filter="${c.id}" aria-pressed="${c.id === currentCategory}">${c.name}</button>`
  ).join("");
}
$("#filters").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-filter]");
  if (btn) setCategory(btn.dataset.filter);
});

function setCategory(id) {
  currentCategory = id;
  $("#listTitle").textContent = id === "all" ? "전체 상품" : categoryName(id);
  $$("#nav a[data-category]").forEach((a) => a.classList.toggle("active", a.dataset.category === id));
  renderFilters();
  renderProducts();
}

function renderProducts() {
  const word = searchWord.toLowerCase();
  const list = PRODUCTS.filter((p) => {
    const matchCategory = currentCategory === "all" || p.category === currentCategory;
    const text = (p.name + p.brand + p.info + categoryName(p.category)).toLowerCase();
    return matchCategory && (!word || text.includes(word));
  });

  const grade = myGrade();
  $("#productGrid").innerHTML = list.length ? list.map((p) => {
    const soldOut = stockLeft(p) === 0;
    return `<article class="card">
      <button type="button" class="card-img" data-detail="${p.id}" aria-label="${escapeHTML(p.name)} 상세 보기">
        <img src="${p.image}" alt="${escapeHTML(p.name)}" loading="lazy">
        <span class="tag ${p.category}">${categoryName(p.category)}</span>
        ${soldOut ? '<span class="sold-out">SOLD OUT</span>' : ""}
      </button>
      <div class="card-body">
        <p class="card-team">${escapeHTML(p.brand)} · ${escapeHTML(p.info)}</p>
        <h3 class="card-name">${escapeHTML(p.name)}</h3>
        <p class="price">${won(p.price)}</p>
        <p class="point-info">${grade.name} ${Math.round(grade.rate * 100)}% 적립 · ${point(Math.floor(p.price * grade.rate))}</p>
        <div class="btn-wrap"><button type="button" class="btn btn-outline btn-sm btn-block" data-detail="${p.id}" ${soldOut ? "disabled" : ""}>${soldOut ? "품절" : "상세 보기"}</button></div>
      </div>
    </article>`;
  }).join("") : `<p class="empty">'${escapeHTML(searchWord)}'에 맞는 상품이 없습니다.</p>`;

  $("#resultInfo").textContent = `${list.length}개 상품${searchWord ? ` · '${searchWord}' 검색 결과` : ""}`;
}
$("#productGrid").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-detail]");
  if (btn && !btn.disabled) openDetail(Number(btn.dataset.detail));
});

$("#searchForm").addEventListener("submit", (e) => {
  e.preventDefault();
  searchWord = $("#searchInput").value.trim();
  renderProducts();
});
$("#searchInput").addEventListener("input", (e) => {
  searchWord = e.target.value.trim();
  renderProducts();
});


/* =========================================================
   상품 상세
   ========================================================= */
let detail = { id: null, size: null, qty: 1 };

function openDetail(id) {
  const p = findProduct(id);
  detail = { id, size: p.sizes.length === 1 ? p.sizes[0] : null, qty: 1 };
  renderDetail();
  openModal("productModal");
}

function renderDetail() {
  const p = findProduct(detail.id);
  const canAdd = stockLeft(p) - inCart(p.id);       // 장바구니에 담긴 수량을 뺀 남은 재고
  const grade = myGrade();
  const total = p.price * detail.qty;

  $("#detailTitle").textContent = "상품 상세";
  $("#detailBody").innerHTML = `<div class="detail">
    <div class="detail-img"><img src="${p.image}" alt="${escapeHTML(p.name)}"></div>
    <div class="detail-info">
      <span class="tag ${p.category}" style="position:static;align-self:flex-start">${categoryName(p.category)}</span>
      <h3>${escapeHTML(p.name)}</h3>
      <p class="price">${won(p.price)}</p>
      <p class="desc">${escapeHTML(p.desc)}</p>
      <table class="spec"><tbody>
        <tr><th>브랜드</th><td>${escapeHTML(p.brand)}</td></tr>
        <tr><th>정보</th><td>${escapeHTML(p.info)}</td></tr>
        <tr><th>재고</th><td>${stockLeft(p)}개</td></tr>
      </tbody></table>
      <div>
        <p style="font-size:13px;font-weight:700;margin-bottom:6px">${p.category === "boots" ? "사이즈 (mm)" : "사이즈"}</p>
        <div class="sizes">${p.sizes.map((s) => `<button type="button" class="size-btn${detail.size === s ? " active" : ""}" data-size="${s}" aria-pressed="${detail.size === s}">${s}</button>`).join("")}</div>
      </div>
      <div style="display:flex;align-items:center;gap:12px">
        <span style="font-size:13px;font-weight:700">수량</span>
        <div class="qty">
          <button type="button" data-step="-1" aria-label="수량 줄이기" ${detail.qty <= 1 ? "disabled" : ""}>−</button>
          <span>${detail.qty}</span>
          <button type="button" data-step="1" aria-label="수량 늘리기" ${detail.qty >= canAdd ? "disabled" : ""}>+</button>
        </div>
      </div>
      <div class="total-box">
        <span>합계<br><small class="point-info">${grade.name} 등급 ${point(Math.floor(total * grade.rate))} 적립 예정</small></span>
        <strong>${won(total)}</strong>
      </div>
      <div class="btn-row">
        <button type="button" class="btn btn-outline" id="addCartBtn" ${canAdd <= 0 ? "disabled" : ""}>장바구니 담기</button>
        <button type="button" class="btn btn-primary" id="buyNowBtn" ${canAdd <= 0 ? "disabled" : ""}>바로 구매</button>
      </div>
      ${canAdd <= 0 ? '<p class="error">남은 재고를 모두 장바구니에 담았습니다.</p>' : ""}
    </div>
  </div>`;

  $$("#detailBody .size-btn").forEach((b) => b.addEventListener("click", () => { detail.size = b.dataset.size; renderDetail(); }));
  $$("#detailBody [data-step]").forEach((b) => b.addEventListener("click", () => {
    detail.qty = Math.min(Math.max(1, detail.qty + Number(b.dataset.step)), canAdd);
    renderDetail();
  }));
  const add = $("#addCartBtn"), buy = $("#buyNowBtn");
  if (add) add.addEventListener("click", () => { if (addToCart()) { closeModal("productModal"); openCart(); } });
  if (buy) buy.addEventListener("click", () => { if (addToCart()) { closeModal("productModal"); startCheckout(); } });
}


/* =========================================================
   장바구니 (수량 바꾸기 · 삭제 · 합계)
   ========================================================= */
function saveCart() {
  DB.saveCart(cart);
  $("#cartCount").textContent = cart.reduce((sum, c) => sum + c.qty, 0);
}

function addToCart() {
  const p = findProduct(detail.id);
  if (!detail.size) { showToast("사이즈를 선택해 주세요."); return false; }
  if (inCart(p.id) + detail.qty > stockLeft(p)) { showToast("재고가 부족합니다."); return false; }
  const line = cart.find((c) => c.id === p.id && c.size === detail.size);
  if (line) line.qty += detail.qty;
  else cart.push({ id: p.id, size: detail.size, qty: detail.qty });
  saveCart();
  showToast(`${p.name}을(를) 장바구니에 담았습니다.`);
  return true;
}

function cartSummary(usePoint = 0) {
  const lines = cart.map((c) => ({ ...c, product: findProduct(c.id) })).filter((l) => l.product);
  const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.qty, 0);
  const shipping = subtotal === 0 || subtotal >= SETTINGS.freeShipping ? 0 : SETTINGS.shippingFee;
  const total = subtotal - usePoint + shipping;
  return { lines, subtotal, shipping, total };
}

function openCart() { renderCart(); openModal("cartModal"); }
$("#cartBtn").addEventListener("click", openCart);

function renderCart() {
  const { lines, subtotal, shipping, total } = cartSummary();
  if (!lines.length) {
    $("#cartBody").innerHTML = `<p class="empty">장바구니가 비어 있습니다.</p>
      <button type="button" class="btn btn-primary btn-block" style="margin-top:14px" data-close data-category="all">상품 보러 가기</button>`;
    return;
  }
  const grade = myGrade();
  $("#cartBody").innerHTML = lines.map((l, i) => {
    const maxQty = stockLeft(l.product) - (inCart(l.id) - l.qty);
    return `<div class="cart-item">
      <img src="${l.product.image}" alt="">
      <div>
        <h3>${escapeHTML(l.product.name)}</h3>
        <p class="opt">사이즈 ${l.size} · ${won(l.product.price)}</p>
        <div class="qty">
          <button type="button" data-index="${i}" data-change="-1" aria-label="수량 줄이기" ${l.qty <= 1 ? "disabled" : ""}>−</button>
          <span>${l.qty}</span>
          <button type="button" data-index="${i}" data-change="1" aria-label="수량 늘리기" ${l.qty >= maxQty ? "disabled" : ""}>+</button>
        </div>
      </div>
      <div class="cart-right">
        <strong>${won(l.product.price * l.qty)}</strong>
        <button type="button" class="del-btn" data-remove="${i}">삭제</button>
      </div>
    </div>`;
  }).join("") + `
    <div style="margin-top:14px">
      <div class="sum-row"><span>상품 합계</span><b>${won(subtotal)}</b></div>
      <div class="sum-row"><span>배송비</span><b>${shipping ? won(shipping) : "무료"}</b></div>
      <div class="sum-row"><span>${grade.name} 등급 적립 예정</span><b class="plus">${point(Math.floor(subtotal * grade.rate))}</b></div>
      <div class="sum-row total"><span>결제 예정 금액</span><b>${won(total)}</b></div>
      ${shipping ? `<p style="font-size:13px;color:var(--gray)">${won(SETTINGS.freeShipping - subtotal)} 더 담으면 무료배송</p>` : ""}
      <button type="button" class="btn btn-primary btn-block" id="goCheckout" style="margin-top:12px">주문하기</button>
    </div>`;
  $("#goCheckout").addEventListener("click", () => { closeModal("cartModal"); startCheckout(); });
}

$("#cartBody").addEventListener("click", (e) => {
  const change = e.target.closest("[data-change]");
  const remove = e.target.closest("[data-remove]");
  if (change && !change.disabled) {
    cart[Number(change.dataset.index)].qty += Number(change.dataset.change);
    saveCart(); renderCart();
  }
  if (remove) {
    cart.splice(Number(remove.dataset.remove), 1);
    saveCart(); renderCart();
    showToast("상품을 삭제했습니다.");
  }
});


/* =========================================================
   회원가입 · 로그인 · 로그아웃
   ========================================================= */
function openAuth(tab) { switchAuthTab(tab); openModal("authModal"); }
function switchAuthTab(tab) {
  $$(".auth-tab").forEach((t) => t.classList.toggle("active", t.dataset.tab === tab));
  $("#loginForm").hidden = tab !== "login";
  $("#signupForm").hidden = tab !== "signup";
  $("#authTitle").textContent = tab === "login" ? "로그인" : "회원가입";
  $("#loginError").textContent = "";
  $("#signupError").textContent = "";
}
$$(".auth-tab").forEach((t) => t.addEventListener("click", () => switchAuthTab(t.dataset.tab)));
$("#userBtn").addEventListener("click", () => (currentUser() ? openMyPage("orders") : openAuth("login")));
$("#joinBtn").addEventListener("click", () => (currentUser() ? openMyPage("points") : openAuth("signup")));

$("#signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = $("#signupName").value.trim();
  const email = $("#signupEmail").value.trim().toLowerCase();
  const pw = $("#signupPw").value;
  const phone = $("#signupPhone").value.trim();
  const addr = $("#signupAddr").value.trim();
  const error = (msg) => { $("#signupError").textContent = msg; };

  if (!name) return error("이름을 입력해 주세요.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return error("이메일 형식을 확인해 주세요.");
  if (users[email]) return error("이미 가입된 이메일입니다.");
  if (pw.length < 8) return error("비밀번호는 8자 이상이어야 합니다.");
  if (pw !== $("#signupPw2").value) return error("비밀번호 확인이 일치하지 않습니다.");
  if (!/^01[0-9]-?\d{3,4}-?\d{4}$/.test(phone)) return error("휴대폰 번호를 확인해 주세요.");
  if (!addr) return error("배송지 주소를 입력해 주세요.");
  if (!$("#signupAgree").checked) return error("필수 약관에 동의해 주세요.");

  const now = Date.now();
  users[email] = {
    name, email, phone, addr,
    password: await hashPassword(pw),
    joinedAt: now,
    points: SETTINGS.signupPoint,
    totalSpent: 0,
    orders: [],
    pointHistory: [{ date: now, text: "회원가입 축하 포인트", amount: SETTINGS.signupPoint }]
  };
  DB.saveUsers(users);
  e.target.reset();
  login(email);
  showToast(`가입을 환영합니다! ${point(SETTINGS.signupPoint)}가 지급되었습니다.`);
});

$("#loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = $("#loginEmail").value.trim().toLowerCase();
  const user = users[email];
  if (!user || user.password !== (await hashPassword($("#loginPw").value))) {
    $("#loginError").textContent = "이메일 또는 비밀번호가 올바르지 않습니다.";
    return;
  }
  e.target.reset();
  login(email);
  showToast(`${user.name}님, 반갑습니다.`);
});

function login(email) {
  session = email;
  DB.saveSession(session);
  closeModal("authModal");
  refreshUser();
  if (afterLogin) { const next = afterLogin; afterLogin = null; next(); }
}
function logout() {
  session = null;
  DB.saveSession(null);
  closeModal("myModal");
  refreshUser();
  showToast("로그아웃되었습니다.");
}
function refreshUser() {
  const u = currentUser();
  $("#userLabel").innerHTML = u ? `${escapeHTML(u.name)} ${gradeBadge(gradeOf(u.totalSpent))}` : "로그인";
  renderProducts();
}


/* =========================================================
   체험 결제 (실제 결제 없이 주문 내역만 남김)
   ========================================================= */
let usePoint = 0;

function startCheckout() {
  if (!cart.length) { showToast("장바구니가 비어 있습니다."); return; }
  if (!currentUser()) {
    afterLogin = startCheckout;
    openAuth("login");
    showToast("주문하려면 로그인해 주세요.");
    return;
  }
  usePoint = 0;
  renderCheckout();
  openModal("checkoutModal");
}

function renderCheckout() {
  const u = currentUser();
  const grade = gradeOf(u.totalSpent);
  const s = cartSummary(usePoint);
  const earn = Math.floor((s.subtotal - usePoint) * grade.rate);

  $("#checkoutTitle").textContent = "주문 / 체험 결제";
  $("#checkoutBody").innerHTML = `<form id="orderForm" novalidate><div class="checkout">
    <div>
      <div class="box">
        <h3>배송지</h3>
        <label for="orderName">받는 분</label><input id="orderName" value="${escapeHTML(u.name)}">
        <label for="orderPhone">연락처</label><input id="orderPhone" type="tel" value="${escapeHTML(u.phone)}">
        <label for="orderAddr">주소</label><input id="orderAddr" value="${escapeHTML(u.addr)}">
      </div>
      <div class="box">
        <h3>포인트 사용 <small style="color:var(--gray);font-weight:400">(보유 ${point(u.points)})</small></h3>
        <label for="pointInput" class="sr-only">사용할 포인트</label>
        <div class="point-row">
          <input id="pointInput" type="number" min="0" step="100" inputmode="numeric" placeholder="${point(SETTINGS.minPointUse)} 이상" value="${usePoint || ""}">
          <button type="button" class="btn btn-outline btn-sm" id="applyPoint">적용</button>
          <button type="button" class="btn btn-outline btn-sm" id="allPoint">전액</button>
        </div>
        <p class="error" id="pointError"></p>
      </div>
      <div class="box">
        <h3>결제 수단 (체험)</h3>
        <div class="pay-options">
          <label><input type="radio" name="pay" value="카드" checked> 신용·체크카드</label>
          <label><input type="radio" name="pay" value="계좌이체"> 계좌이체</label>
          <label><input type="radio" name="pay" value="간편결제"> 간편결제</label>
          <label><input type="radio" name="pay" value="무통장입금"> 무통장입금</label>
        </div>
      </div>
    </div>
    <div class="summary">
      <h3 style="font-size:16px;margin-bottom:8px">주문 상품</h3>
      ${s.lines.map((l) => `<div class="sum-row"><span>${escapeHTML(l.product.name)} (${l.size}) × ${l.qty}</span><b>${won(l.product.price * l.qty)}</b></div>`).join("")}
      <div class="sum-row total" style="font-size:15px"><span>상품 합계</span><b style="font-size:15px;color:var(--text)">${won(s.subtotal)}</b></div>
      <div class="sum-row"><span>배송비</span><b>${s.shipping ? won(s.shipping) : "무료"}</b></div>
      <div class="sum-row"><span>포인트 사용</span><b class="minus">-${point(usePoint)}</b></div>
      <div class="sum-row total"><span>최종 결제 금액</span><b>${won(s.total)}</b></div>
      <div class="sum-row"><span>${gradeBadge(grade)} ${Math.round(grade.rate * 100)}% 적립 예정</span><b class="plus">+${point(earn)}</b></div>
      <p class="error" id="orderError"></p>
      <button type="submit" class="btn btn-accent btn-block">${won(s.total)} 체험 결제하기</button>
      <p style="font-size:12.5px;color:var(--gray);margin-top:8px;text-align:center">실제 결제는 되지 않고 주문 내역만 저장됩니다.</p>
    </div>
  </div></form>`;

  const maxPoint = Math.min(u.points, s.subtotal);
  const applyPoint = (value) => {
    const n = Math.floor((Number(value) || 0) / 100) * 100;
    if (n > 0 && n < SETTINGS.minPointUse) { $("#pointError").textContent = `포인트는 ${point(SETTINGS.minPointUse)}부터 사용할 수 있습니다.`; return; }
    if (n > maxPoint) { $("#pointError").textContent = `최대 ${point(maxPoint)}까지 사용할 수 있습니다.`; return; }
    usePoint = n;
    renderCheckout();
  };
  $("#applyPoint").addEventListener("click", () => applyPoint($("#pointInput").value));
  $("#allPoint").addEventListener("click", () => applyPoint(maxPoint));
  $("#orderForm").addEventListener("submit", (e) => { e.preventDefault(); placeOrder(); });
}

function placeOrder() {
  const u = currentUser();
  const name = $("#orderName").value.trim();
  const phone = $("#orderPhone").value.trim();
  const addr = $("#orderAddr").value.trim();
  if (!name || !phone || !addr) { $("#orderError").textContent = "배송지 정보를 모두 입력해 주세요."; return; }

  const s = cartSummary(usePoint);
  for (const l of s.lines) {
    if (inCart(l.id) > stockLeft(l.product)) { $("#orderError").textContent = `${l.product.name} 재고가 부족합니다.`; return; }
  }

  const now = Date.now();
  const d = new Date(now);
  const gradeBefore = gradeOf(u.totalSpent);
  const paidGoods = s.subtotal - usePoint;              // 포인트 사용분은 적립·등급에서 제외
  const earned = Math.floor(paidGoods * gradeBefore.rate);
  const order = {
    orderNo: `FKS${d.getFullYear()}${twoDigit(d.getMonth() + 1)}${twoDigit(d.getDate())}-${String(now).slice(-5)}`,
    date: now,
    items: s.lines.map((l) => ({ id: l.id, name: l.product.name, size: l.size, qty: l.qty, price: l.product.price, image: l.product.image })),
    subtotal: s.subtotal, shipping: s.shipping, usedPoint: usePoint, total: s.total, earnedPoint: earned,
    payMethod: document.querySelector('input[name="pay"]:checked').value,
    receiver: { name, phone, addr },
    status: "주문 완료"
  };

  // 재고 차감
  s.lines.forEach((l) => { sold[l.id] = (sold[l.id] || 0) + l.qty; });
  DB.saveSold(sold);

  // 포인트 · 누적 금액
  if (usePoint) { u.points -= usePoint; u.pointHistory.unshift({ date: now, text: `주문 사용 (${order.orderNo})`, amount: -usePoint }); }
  if (earned) { u.points += earned; u.pointHistory.unshift({ date: now, text: `구매 적립 ${Math.round(gradeBefore.rate * 100)}% (${order.orderNo})`, amount: earned }); }
  u.totalSpent += paidGoods;
  u.orders.unshift(order);
  DB.saveUsers(users);

  cart = [];
  saveCart();
  const gradeAfter = gradeOf(u.totalSpent);
  refreshUser();

  $("#checkoutTitle").textContent = "주문 완료";
  $("#checkoutBody").innerHTML = `<div class="done">
      <div class="ok">✓</div>
      <h3>주문이 완료되었습니다</h3>
      <p>주문번호 ${order.orderNo}</p>
    </div>
    <div class="box" style="margin-top:18px">
      ${order.items.map((i) => `<div class="sum-row"><span>${escapeHTML(i.name)} (${i.size}) × ${i.qty}</span><b>${won(i.price * i.qty)}</b></div>`).join("")}
      <div class="sum-row total"><span>결제 금액</span><b>${won(order.total)}</b></div>
      <div class="sum-row"><span>적립 포인트</span><b class="plus">+${point(earned)}</b></div>
      <div class="sum-row"><span>보유 포인트</span><b>${point(u.points)}</b></div>
    </div>
    ${gradeAfter !== gradeBefore ? `<p class="notice">누적 구매 금액이 늘어 ${gradeAfter.name} 등급이 되었습니다. 다음 주문부터 ${Math.round(gradeAfter.rate * 100)}% 적립됩니다.</p>` : ""}
    <div class="btn-row" style="margin-top:16px">
      <button type="button" class="btn btn-outline" data-close>쇼핑 계속하기</button>
      <button type="button" class="btn btn-primary" id="viewOrders">주문 내역 보기</button>
    </div>`;
  $("#viewOrders").addEventListener("click", () => { closeModal("checkoutModal"); openMyPage("orders"); });
  if (gradeAfter !== gradeBefore) showToast(`축하합니다! ${gradeAfter.name} 등급이 되었습니다.`);
}


/* =========================================================
   마이페이지 (주문 내역 · 포인트 · 회원 정보)
   ========================================================= */
function openMyPage(tab) { renderMyPage(tab); openModal("myModal"); }

function renderMyPage(tab) {
  const u = currentUser();
  if (!u) return;
  const grade = gradeOf(u.totalSpent);
  const next = nextGrade(grade);
  const progress = next ? Math.min(100, ((u.totalSpent - grade.minSpent) / (next.minSpent - grade.minSpent)) * 100) : 100;

  let content = "";
  if (tab === "orders") {
    content = u.orders.length ? u.orders.map((o) => `<div class="order-card">
      <header><span><b>${o.orderNo}</b> · ${formatDate(o.date)}</span><span class="status">${o.status}</span></header>
      ${o.items.map((i) => `<div class="sum-row"><span>${escapeHTML(i.name)} (${i.size}) × ${i.qty}</span><b>${won(i.price * i.qty)}</b></div>`).join("")}
      <div class="sum-row"><span>결제 (${o.payMethod})</span><b>${won(o.total)}</b></div>
      ${o.usedPoint ? `<div class="sum-row"><span>포인트 사용</span><b class="minus">-${point(o.usedPoint)}</b></div>` : ""}
      <div class="sum-row"><span>적립</span><b class="plus">+${point(o.earnedPoint)}</b></div>
    </div>`).join("") : '<p class="empty">아직 주문 내역이 없습니다.</p>';
  } else if (tab === "points") {
    content = `<table class="point-table"><tbody>${u.pointHistory.map((h) =>
      `<tr><td style="color:var(--gray)">${formatDate(h.date)}</td><td>${escapeHTML(h.text)}</td><td class="${h.amount > 0 ? "plus" : "minus"}">${h.amount > 0 ? "+" : ""}${point(h.amount)}</td></tr>`
    ).join("")}</tbody></table>`;
  } else {
    content = `<table class="spec"><tbody>
      <tr><th>이름</th><td>${escapeHTML(u.name)}</td></tr>
      <tr><th>이메일</th><td>${escapeHTML(u.email)}</td></tr>
      <tr><th>휴대폰</th><td>${escapeHTML(u.phone)}</td></tr>
      <tr><th>배송지</th><td>${escapeHTML(u.addr)}</td></tr>
      <tr><th>가입일</th><td>${formatDate(u.joinedAt)}</td></tr>
      <tr><th>누적 구매</th><td>${won(u.totalSpent)}</td></tr>
    </tbody></table>
    <button type="button" class="btn btn-outline btn-block" id="logoutBtn" style="margin-top:16px">로그아웃</button>`;
  }

  $("#myBody").innerHTML = `
    <div class="my-card">
      <div style="flex:1;min-width:200px">
        <p>${gradeBadge(grade)} 등급 · 적립률 ${Math.round(grade.rate * 100)}%</p>
        <h3>${escapeHTML(u.name)}님</h3>
        <div class="progress"><i style="width:${progress}%"></i></div>
        <p>${next ? `${won(next.minSpent - u.totalSpent)} 더 구매하면 ${next.name} 등급 (${Math.round(next.rate * 100)}% 적립)` : "최고 등급입니다."}</p>
      </div>
      <div><p>보유 포인트</p><p class="my-point">${point(u.points)}</p></div>
    </div>
    <div class="my-tabs" role="tablist">
      <button type="button" class="my-tab${tab === "orders" ? " active" : ""}" data-tab="orders">주문 내역 (${u.orders.length})</button>
      <button type="button" class="my-tab${tab === "points" ? " active" : ""}" data-tab="points">포인트 내역</button>
      <button type="button" class="my-tab${tab === "info" ? " active" : ""}" data-tab="info">회원 정보</button>
    </div>
    ${content}`;

  $$("#myBody .my-tab").forEach((b) => b.addEventListener("click", () => renderMyPage(b.dataset.tab)));
  const out = $("#logoutBtn");
  if (out) out.addEventListener("click", logout);
}


/* =========================================================
   등급 안내 · 첫 화면 그리기
   ========================================================= */
function renderGrades() {
  $("#gradeGrid").innerHTML = GRADES.map((g) => `<div class="grade-card" style="--gc:${g.color}">
    <p class="name">${g.name}</p>
    <p class="rate">${Math.round(g.rate * 100)}<small>% 적립</small></p>
    <p>${g.desc}</p>
  </div>`).join("");
}

renderGrades();
renderFilters();
saveCart();
refreshUser();
