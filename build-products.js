// Генерирует страницы products/<id>.html из js/products.js и sitemap.xml
// Запуск (нужен Node.js): node build-products.js
const fs = require("fs"), vm = require("vm");
const load = f => { const c = { window: {} }; vm.runInNewContext(fs.readFileSync(f, "utf8"), c); return c.window; };
const P = load("js/products.js").PRODUCTS, C = load("js/config.js").CONFIG;
const esc = s => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const base = C.siteUrl ? C.siteUrl.replace(/\/?$/, "/") : "";
// шаблон: product.html, пути с префиксом ../
const tpl = fs.readFileSync("product.html", "utf8")
  .replace(/(href|src)="(?![a-z]+:|#|\/|\.\.)([^"]*)"/g, '$1="../$2"');
fs.mkdirSync("products", { recursive: true });
const ids = new Set(P.map(p => p.id + ".html"));
fs.readdirSync("products").filter(f => f.endsWith(".html") && !ids.has(f)).forEach(f => fs.unlinkSync("products/" + f));
P.forEach(p => {
  const title = `${p.name} — ${C.siteName}`, desc = `${p.shortDescription} Цена ${p.price} ${C.currency}.`;
  const meta = `<title>${esc(title)}</title>\n<meta name="description" content="${esc(desc)}">\n<meta property="og:title" content="${esc(title)}">\n<meta property="og:description" content="${esc(desc)}">` + (base ? `\n<meta property="og:image" content="${base}${p.images[0]}">` : "");
  const html = tpl.replace(/<!--meta-->[\s\S]*?<!--\/meta-->/, meta).replace('data-root=""', `data-root="../" data-id="${p.id}"`);
  fs.writeFileSync(`products/${p.id}.html`, html);
});
console.log(`Готово: страниц товаров — ${P.length}`);
if (base) {
  const urls = ["", "catalog.html", "delivery.html", "contacts.html"].concat(P.map(p => `products/${p.id}.html`));
  fs.writeFileSync("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url><loc>${base}${u}</loc></url>`).join("\n")}\n</urlset>\n`);
  fs.writeFileSync("robots.txt", `User-agent: *\nAllow: /\nSitemap: ${base}sitemap.xml\n`);
  console.log("sitemap.xml и robots.txt обновлены");
} else console.log("Подсказка: впишите siteUrl в js/config.js, чтобы создать sitemap.xml");
