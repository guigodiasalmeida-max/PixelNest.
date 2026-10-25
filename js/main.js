/* Página inicial: cartuchos do destaque, catálogo, pesquisa e filtros. */
(function () {
  const G = window.PIXELNEST_GAMES || [];
  const $ = (s) => document.querySelector(s);
  const norm = (s) => String(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  const url = (g) => "jogos/" + g.slug + "/index.html";
  const grid = $("#grid"), input = $("#busca"), chips = $("#chips"), count = $("#count"), empty = $("#vazio"), clear = $("#limpar"), carts = $("#carts");
  let cat = "Todos";

  G.slice(0, 3).forEach((g) => {
    const a = document.createElement("a");
    a.className = "cart"; a.href = url(g); a.setAttribute("aria-label", "Jogar " + g.titulo);
    a.appendChild(PN.cover(g));
    const t = document.createElement("span"); t.textContent = g.titulo; a.appendChild(t);
    carts.appendChild(a);
  });

  const cards = G.map((g) => {
    const el = document.createElement("article");
    el.className = "card px";
    const slot = document.createElement("div"); slot.className = "cover-slot"; slot.appendChild(PN.cover(g));
    const body = document.createElement("div"); body.className = "card-body";
    body.innerHTML = '<p class="tag">' + g.categoria + '</p><h3><a class="stretch" href="' + url(g) + '">' + g.titulo + '</a></h3><p class="desc">' + g.descricao + '</p><span class="btn primary play" aria-hidden="true">Jogar</span>';
    el.append(slot, body);
    grid.appendChild(el);
    return { g, el };
  });

  const cats = ["Todos"].concat([...new Set(G.map((g) => g.categoria))]);
  cats.forEach((c) => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "chip"; b.textContent = c; b.setAttribute("aria-pressed", String(c === cat));
    b.addEventListener("click", () => { cat = c; apply(); });
    chips.appendChild(b);
  });

  function apply() {
    const q = norm(input.value);
    let n = 0;
    cards.forEach(({ g, el }) => {
      const ok = (cat === "Todos" || g.categoria === cat) && (!q || norm(g.titulo + " " + g.categoria + " " + g.descricao).includes(q));
      el.hidden = !ok; if (ok) n++;
    });
    chips.querySelectorAll(".chip").forEach((b) => b.setAttribute("aria-pressed", String(b.textContent === cat)));
    count.textContent = n + (n === 1 ? " jogo encontrado" : " jogos encontrados") + (q || cat !== "Todos" ? " nesta seleção" : " no catálogo");
    empty.hidden = n > 0;
    clear.hidden = !(q || cat !== "Todos");
  }
  const reset = () => { input.value = ""; cat = "Todos"; apply(); };
  input.addEventListener("input", apply);
  input.addEventListener("keydown", (e) => { if (e.key === "Escape") reset(); });
  clear.addEventListener("click", () => { reset(); input.focus(); });
  $("#vazio-limpar").addEventListener("click", () => { reset(); input.focus(); });

  const focusSearch = () => { $("#jogos").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }); input.focus({ preventScroll: true }); };
  const sb = document.getElementById("search-btn");
  if (sb) sb.addEventListener("click", (e) => { e.preventDefault(); history.replaceState(null, "", "#busca"); focusSearch(); });
  if (location.hash === "#busca") setTimeout(focusSearch, 50);
  apply();
})();
