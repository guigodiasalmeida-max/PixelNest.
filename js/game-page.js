/* Página individual de jogo: monta tudo a partir de js/games.js (slug vem de data-game no <body>). */
(function () {
  const slug = document.body.dataset.game;
  const g = (window.PIXELNEST_GAMES || []).find((x) => x.slug === slug);
  const app = document.getElementById("app");
  if (!g) { app.innerHTML = '<h1>Jogo não encontrado</h1><p>Este jogo não está no catálogo.</p><a class="btn primary" href="' + PN.base + 'index.html#jogos">Voltar ao catálogo</a>'; return; }
  document.title = g.titulo + " — PixelNest";
  const md = document.querySelector('meta[name="description"]'); if (md) md.content = g.descricao;
  const stageStyle = g.proporcao ? "--r:" + g.proporcao.split("/").reduce(function (a, b) { return a / b; }) + ";" : "";
  app.innerHTML =
    '<div class="gp-top"><a class="btn ghost" href="' + PN.base + 'index.html#jogos">&lt; Voltar ao catálogo</a></div>' +
    '<h1>' + g.titulo + '</h1><p class="tag">' + g.categoria + '</p>' +
    '<div class="stage ' + (g.proporcao ? "ratio" : "tall") + '" id="stage" style="' + stageStyle + '"><div class="loading" id="load" role="status">' + PN.logo + '<div class="brand-name">PixelNest</div><div class="bar-px" aria-hidden="true"><i id="bar"></i></div><p>Carregando ' + g.titulo + '</p><button type="button" class="btn ghost" id="skip">Pular</button></div>' +
    '<iframe id="frame" src="' + g.arquivo + '" title="' + g.titulo + '" allow="fullscreen; autoplay; gamepad" allowfullscreen></iframe>' +
    '<div class="stage-utility"><a class="exit-site" id="exitSite" href="' + PN.base + 'index.html#jogos">← Voltar ao PixelNest</a><button type="button" class="stage-exit" id="exit" hidden>× <span>Sair da tela cheia</span></button></div></div>' +
    '<div class="stage-bar"><button type="button" class="btn primary" id="full">Tela cheia</button><a class="btn ghost" href="' + g.arquivo + '" target="_blank" rel="noopener">Abrir em nova aba</a></div>' +
    '<section class="gp-info"><div><h2>Sobre o jogo</h2><p>' + g.sobre + '</p>' + (g.aviso ? '<p class="aviso">' + g.aviso + '</p>' : '') +
    '<p class="save">O progresso fica salvo neste navegador. Limpar os dados do site apaga o save.</p></div>' +
    '<div><h2>Controles</h2><dl class="keys">' + g.controles.map((c) => '<dt>' + c[0] + '</dt><dd>' + c[1] + '</dd>').join("") + '</dl></div></section>';

  const stage = document.getElementById("stage"), frame = document.getElementById("frame"), full = document.getElementById("full"), exit = document.getElementById("exit");
  /* A tela de carregamento sai assim que o iframe carrega; não impõe espera artificial.
     Se demorar, mostra uma opção de tentar novamente em vez de revelar uma tela vazia. */
  const loading = document.getElementById("load"), bar = document.getElementById("bar"), skip = document.getElementById("skip");
  let loaded = false, closing = false, timedOut = false;
  const hide = () => {
    if (closing) return; closing = true;
    clearTimeout(slowTimer); bar.style.width = "100%";
    setTimeout(() => { loading.classList.add("done"); setTimeout(() => { loading.remove(); try { frame.contentWindow.focus(); } catch (e) {} }, 260); }, 120);
  };
  skip.textContent = "Continuar mesmo assim";
  skip.addEventListener("click", () => {
    if (!timedOut) { hide(); return; }
    timedOut = false; closing = false; loaded = false;
    loading.classList.remove("done");
    loading.querySelector("p").textContent = "Carregando " + g.titulo;
    skip.textContent = "Continuar mesmo assim";
    frame.src = frame.src;
    setTimeout(() => {
      if (!loaded && !closing) {
        timedOut = true;
        loading.querySelector("p").textContent = "O jogo ainda não respondeu. Você pode tentar novamente.";
        skip.textContent = "Tentar novamente";
      }
    }, 15000);
    clearTimeout(slowTimer);
  });
  frame.addEventListener("load", () => {
    loaded = true;
    clearTimeout(slowTimer);
    hide();
    try { frame.contentWindow.focus(); } catch (e) {}
  }, { once: true });
  const slowTimer = setTimeout(() => {
    if (loaded || closing) return;
    const msg = loading.querySelector("p");
    if (msg) msg.textContent = "O jogo está demorando para abrir. Você pode tentar novamente.";
    bar.style.width = "100%";
    timedOut = true;
    skip.textContent = "Tentar novamente";
    skip.disabled = false;
  }, 15000);
  /* Indicação visual contínua enquanto o iframe carrega. */
  const pulse = setInterval(() => { if (!loaded && !closing) bar.style.width = (bar.style.width === "65%" ? "35%" : "65%"); else clearInterval(pulse); }, 450);
  stage.addEventListener("pointerdown", () => { try { frame.contentWindow.focus(); } catch (e) {} });

  const isFull = () => document.fullscreenElement === stage || stage.classList.contains("pseudo");
  const sync = () => { full.textContent = isFull() ? "Sair da tela cheia" : "Tela cheia"; exit.hidden = !isFull(); stage.classList.toggle("is-full", isFull()); };
  full.addEventListener("click", () => {
    if (isFull()) { if (document.fullscreenElement) document.exitFullscreen(); stage.classList.remove("pseudo"); sync(); return; }
    if (stage.requestFullscreen) stage.requestFullscreen().catch(() => { stage.classList.add("pseudo"); sync(); });
    else { stage.classList.add("pseudo"); sync(); } /* iPhone: sem Fullscreen API, usa modo expandido */
  });
  exit.addEventListener("click", () => { if (document.fullscreenElement) document.exitFullscreen(); stage.classList.remove("pseudo"); sync(); });
  document.addEventListener("fullscreenchange", sync);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && stage.classList.contains("pseudo")) { stage.classList.remove("pseudo"); sync(); } });
})();
