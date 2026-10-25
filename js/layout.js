/* Cabeçalho, rodapé e utilitários compartilhados. Usa data-base (caminho até a raiz) e data-page no <body>. */
(function () {
  const PN = (window.PN = {});
  const base = document.body.dataset.base || "";
  const page = document.body.dataset.page || "";
  PN.base = base;
  const LOGO = '<svg class="logo" viewBox="0 0 12 10" shape-rendering="crispEdges" aria-hidden="true" focusable="false"><rect x="4" y="1" width="4" height="1" fill="#c26bff"/><rect x="3" y="2" width="6" height="3" fill="#8a5bff"/><rect x="4" y="2" width="1" height="1" fill="#efe3ff"/><rect x="1" y="5" width="10" height="1" fill="#4b8dff"/><rect x="0" y="6" width="12" height="1" fill="#2f7bff"/><rect x="1" y="7" width="10" height="1" fill="#2a5fd6"/><rect x="3" y="8" width="6" height="1" fill="#1e3f9c"/><rect x="3" y="6" width="1" height="1" fill="#1e3f9c"/><rect x="6" y="6" width="1" height="1" fill="#1e3f9c"/><rect x="9" y="6" width="1" height="1" fill="#1e3f9c"/></svg>';
  PN.logo = LOGO;
  const cur = (p) => (page === p ? ' aria-current="page"' : "");
  const ICON = (d) => '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square" aria-hidden="true"><path d="' + d + '"/></svg>';

  const header = document.getElementById("site-header");
  if (header) {
    header.className = "site-header";
    header.innerHTML =
      '<div class="wrap bar"><a class="brand" href="' + base + 'index.html" aria-label="PixelNest, página inicial">' + LOGO + '<span>PixelNest</span></a>' +
      '<nav id="nav" class="nav" aria-label="Principal"><a href="' + base + 'index.html"' + cur("home") + '>Início</a><a href="' + base + 'index.html#jogos"' + cur("jogo") + '>Jogos</a><a href="' + base + 'index.html#sobre">Sobre</a></nav>' +
      '<a class="icon-btn" id="search-btn" href="' + base + 'index.html#busca" aria-label="Pesquisar jogos">' + ICON("M10 4h4v2h2v4h-2v2h-4v-2H8V6h2zM14 14l6 6") + '</a>' +
      '<button class="icon-btn burger" id="burger" type="button" aria-expanded="false" aria-controls="nav" aria-label="Abrir menu">' + ICON("M4 7h16M4 12h16M4 17h16") + '</button></div>';
    const nav = header.querySelector("#nav"), burger = header.querySelector("#burger");
    const close = () => { nav.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); burger.setAttribute("aria-label", "Abrir menu"); };
    burger.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    });
    nav.addEventListener("click", (e) => { if (e.target.closest("a")) close(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && nav.classList.contains("open")) { close(); burger.focus(); } });
    matchMedia("(min-width: 761px)").addEventListener("change", close);
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 12);
    onScroll(); addEventListener("scroll", onScroll, { passive: true });
  }

  const footer = document.getElementById("site-footer");
  if (footer) {
    footer.className = "site-footer";
    footer.innerHTML = '<div class="wrap foot"><a class="brand foot-brand" href="' + base + 'index.html" aria-label="PixelNest, início">' + LOGO + '<span>PixelNest</span></a><p>Jogos independentes. Novas aventuras a cada clique.</p><div class="foot-links"><a href="' + base + 'index.html#jogos">Explorar jogos</a><a href="' + base + 'index.html#sobre">Sobre o projeto</a><a href="' + base + 'index.html#conteudo">Voltar ao topo ↑</a></div><small>© ' + new Date().getFullYear() + ' PixelNest</small></div>';
  }

  /* Capa: tenta assets/capas/<slug>.webp|png|jpg|jpeg (ou g.capa); sem imagem, mostra um placeholder em pixel art. */
  PN.cover = function (g) {
    const wrap = document.createElement("div");
    wrap.className = "cover";
    wrap.style.setProperty("--h", g.cor || 250);
    const ini = g.titulo.split(/\s+/).filter((w) => w.length > 2).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
    const ph = document.createElement("div");
    ph.className = "ph"; ph.setAttribute("aria-hidden", "true"); ph.innerHTML = "<span>" + ini + "</span>";
    wrap.appendChild(ph);
    const list = g.capa ? [g.capa] : ["webp", "png", "jpg", "jpeg"].map((e) => "assets/capas/" + g.slug + "." + e);
    let i = 0;
    const img = new Image();
    img.alt = "Capa de " + g.titulo; img.decoding = "async";
    img.onload = () => { wrap.classList.add("has-img"); wrap.appendChild(img); };
    img.onerror = () => { if (i < list.length) img.src = PN.base + list[i++]; };
    img.onerror();
    return wrap;
  };
})();
