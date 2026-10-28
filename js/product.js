// Страница товара: слайдер, увеличение фото, характеристики
(function () {
  var C = window.CONFIG, R = document.body.dataset.root || "", $ = function (i) { return document.getElementById(i); };
  var id = document.body.dataset.id || new URLSearchParams(location.search).get("id");
  var P = window.PRODUCTS, p = P.filter(function (x) { return x.id === id; })[0], el = $("product");
  if (!p) { el.innerHTML = '<h1>Товар не найден</h1><a class="btn" href="' + R + 'catalog.html">В каталог</a>'; return; }
  document.title = p.name + " — " + C.siteName;
  var imgs = p.images, n = imgs.length, cur = 0, lbi = 0;
  var rows = [["Количество слоёв", p.layers], ["Вес", p.weight], ["Материал", p.material], ["Оформление", p.frame], ["Срок изготовления", p.term]];
  el.innerHTML = '<div class="crumb"><a href="' + R + 'index.html">Главная</a> / <a href="' + R + 'catalog.html">Каталог</a> / ' + esc(p.name) + '</div><div class="pd"><div><div class="sl" id="sl"><div class="tr" id="tr">' +
    imgs.map(function (s, i) { return '<div data-k="' + i + '"><img src="' + R + s + '" alt="' + esc(p.name) + ', фото ' + (i + 1) + '"></div>'; }).join("") + "</div>" +
    (n > 1 ? '<button class="ar l" id="pv" aria-label="Назад">‹</button><button class="ar r" id="nx" aria-label="Вперёд">›</button>' : "") + "</div>" +
    (n > 1 ? '<div class="th">' + imgs.map(function (s, i) { return '<button data-k="' + i + '" aria-label="Фото ' + (i + 1) + '"><img src="' + R + s + '" alt=""></button>'; }).join("") + "</div>" : "") +
    '<div class="note">Нажмите на фото, чтобы увеличить.</div></div><div><h1>' + esc(p.name) + '</h1><div class="price">' + p.price + " " + C.currency + '</div><p class="sub">' + esc(p.description) + '</p><table class="sp">' +
    rows.map(function (r) { return "<tr><td>" + r[0] + "</td><td>" + esc(r[1]) + "</td></tr>"; }).join("") + '</table><button class="btn" data-open="Хочу заказать картину «' + esc(p.name) + '»">Заказать</button> <a class="btn o" href="' + R + 'catalog.html">Назад в каталог</a></div></div><h2 style="margin-top:56px">Другие картины</h2><div class="grid g3">' +
    P.filter(function (x) { return x !== p; }).slice(0, 3).map(cardHTML).join("") + "</div>";
  function go(i) {
    cur = (i + n) % n; $("tr").style.transform = "translateX(-" + cur * 100 + "%)";
    [].forEach.call(document.querySelectorAll(".th button"), function (b, k) { b.classList.toggle("on", k === cur); });
  }
  if (n > 1) {
    $("pv").onclick = function () { go(cur - 1); }; $("nx").onclick = function () { go(cur + 1); };
    [].forEach.call(document.querySelectorAll(".th button"), function (b) { b.onclick = function () { go(+b.dataset.k); }; });
    var sx = null, sl = $("sl");
    sl.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
    sl.addEventListener("touchend", function (e) { if (sx === null) return; var d = e.changedTouches[0].clientX - sx; sx = null; if (Math.abs(d) > 40) go(cur + (d < 0 ? 1 : -1)); });
  }
  // Увеличенное фото
  document.body.insertAdjacentHTML("beforeend", '<div class="modal" id="lb"><button class="x" id="lx" aria-label="Закрыть">×</button>' + (n > 1 ? '<button class="ar l" id="lp" aria-label="Назад">‹</button><button class="ar r" id="ln" aria-label="Вперёд">›</button>' : "") + '<div class="lbx" id="lbx"><img id="li" alt=""></div><div id="lc"></div></div>');
  var lb = $("lb");
  function show(k) { lbi = (k + n) % n; $("li").src = R + imgs[lbi]; $("lc").textContent = (lbi + 1) + " / " + n; go(lbi); }
  [].forEach.call(document.querySelectorAll(".tr>div"), function (d) { d.onclick = function () { show(+d.dataset.k); lb.classList.add("on"); }; });
  $("lx").onclick = function () { lb.classList.remove("on"); };
  lb.onclick = function (e) { if (e.target === lb) lb.classList.remove("on"); };
  if (n > 1) {
    $("lp").onclick = function () { show(lbi - 1); }; $("ln").onclick = function () { show(lbi + 1); };
    $("lbx").onclick = function (e) { var r = this.getBoundingClientRect(); show(lbi + (e.clientX - r.left < r.width / 2 ? -1 : 1)); };
    var x0 = null, b = $("lbx");
    b.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    b.addEventListener("touchend", function (e) { if (x0 === null) return; var d = e.changedTouches[0].clientX - x0; x0 = null; if (Math.abs(d) > 40) { show(lbi + (d < 0 ? 1 : -1)); e.preventDefault(); } });
  }
  document.addEventListener("keydown", function (e) {
    var d = e.key === "ArrowLeft" ? -1 : e.key === "ArrowRight" ? 1 : 0;
    if (d && n > 1) { if (lb.classList.contains("on")) show(lbi + d); else go(cur + d); }
    if (e.key === "Escape") lb.classList.remove("on");
  });
  go(0);
})();
