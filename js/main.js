// Общий код: шапка, подвал, форма, карточки товаров
(function () {
  var C = window.CONFIG, R = document.body.dataset.root || "", $ = function (i) { return document.getElementById(i); };
  window.esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  window.cardHTML = function (p) {
    return '<a class="box card" href="' + R + 'products/' + p.id + '.html"><div class="ph"><img src="' + R + p.images[0] + '" alt="' + esc(p.name) + '" loading="lazy"></div><h3>' + esc(p.name) + '</h3><small>' + p.layers + ' слоёв · ' + esc(p.size) + '</small><div class="row"><b>' + p.price + ' ' + C.currency + '</b><span>Подробнее →</span></div></a>';
  };
  var disc = "* Обращаем ваше внимание на то, что данный интернет-сайт носит исключительно информационный характер и ни при каких условиях не является публичной офертой, определяемой положениями ст. 405 Гражданского кодекса Республики Беларусь. Для получения подробной информации о наличии и стоимости указанных товаров и (или) услуг, пожалуйста, обращайтесь к менеджеру сайта с помощью специальной формы «Обратная связь».";
  var logo = R + "images/logo/logo.png";
  document.body.insertAdjacentHTML("afterbegin", '<header id="hd"><div class="w bar"><a href="' + R + 'index.html"><img class="logo" src="' + logo + '" alt="' + C.siteName + '"></a><nav><a href="' + R + 'catalog.html">Каталог</a><a href="' + R + 'index.html#why">О картинах</a><a href="' + R + 'index.html#order">Как заказать</a><a href="' + R + 'delivery.html">Доставка</a><a href="' + R + 'contacts.html">Контакты</a></nav><button class="btn" data-open="">Заказать</button><button class="burger" id="bg" aria-label="Меню">☰</button></div></header>');
  document.body.insertAdjacentHTML("beforeend", '<footer><div class="w"><div class="cols"><div><img class="logo" src="' + logo + '" alt="' + C.siteName + '"><div>Многослойные картины ручной работы для вашего дома.</div></div><div><h4>Контакты</h4><a href="mailto:' + C.email + '">' + C.email + '</a><a href="#" data-open="">Обратная связь</a></div></div><div class="copy">© 2026 ' + C.siteName + '<br><br>' + disc + '</div></div></footer>' +
    '<div class="modal" id="m"><div class="mb"><button class="x" id="cl" aria-label="Закрыть">×</button><form id="f"><h3>Обратная связь</h3><p style="color:var(--mut);margin:0">Оставьте контакты, и менеджер свяжется с вами.</p><label>Имя<input id="n" required></label><label>Email или телефон<input id="p" required></label><label>Комментарий<textarea id="c" rows="3"></textarea></label><button class="btn" type="submit">Отправить</button></form><div id="ok" style="display:none"></div></div></div>');
  $("bg").onclick = function () { $("hd").classList.toggle("open"); };
  var m = $("m");
  function openM(t) { $("f").style.display = "block"; $("ok").style.display = "none"; if (t) $("c").value = t; m.classList.add("on"); }
  document.addEventListener("click", function (e) {
    var o = e.target.closest("[data-open]");
    if (o) { e.preventDefault(); openM(o.dataset.open || ""); }
  });
  $("cl").onclick = function () { m.classList.remove("on"); };
  m.addEventListener("click", function (e) { if (e.target === m) m.classList.remove("on"); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") m.classList.remove("on"); });
  function done(h) { $("f").style.display = "none"; $("ok").style.display = "block"; $("ok").innerHTML = h; }
  $("f").onsubmit = function (e) {
    e.preventDefault();
    var d = { name: $("n").value, contact: $("p").value, message: $("c").value };
    if (!C.orderFormEndpoint) {
      location.href = "mailto:" + C.email + "?subject=" + encodeURIComponent("Заявка с сайта " + C.siteName) + "&body=" + encodeURIComponent(d.message + "\n\n" + d.name + "\n" + d.contact);
      return done("<h3>Почти готово</h3><p>Откроется письмо. Если этого не произошло, напишите нам на <a href=\"mailto:" + C.email + "\">" + C.email + "</a>.</p>");
    }
    fetch(C.orderFormEndpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(d) })
      .then(function (r) { if (!r.ok) throw 0; done("<h3>Заявка отправлена</h3><p>Спасибо! Мы свяжемся с вами в ближайшее время.</p>"); })
      .catch(function () { done("<h3>Не удалось отправить</h3><p>Напишите нам на <a href=\"mailto:" + C.email + "\">" + C.email + "</a>.</p>"); });
  };
  var P = window.PRODUCTS || [];
  if ($("pop")) $("pop").innerHTML = (P.filter(function (p) { return p.popular; }).concat(P)).filter(function (p, i, a) { return a.indexOf(p) === i; }).slice(0, 3).map(cardHTML).join("");
  if ($("all")) $("all").innerHTML = P.slice().sort(function (a, b) { return a.added < b.added ? 1 : -1; }).map(cardHTML).join("");
  if ($("cnt")) $("cnt").textContent = P.length;
})();
