# PixelNest

Portal de jogos de navegador em HTML, CSS e JavaScript puros (sem build, sem backend). Pronto para o GitHub Pages.

## Estrutura

```
index.html                  página inicial (destaque, catálogo, pesquisa, sobre)
404.html                    página de erro
css/style.css               visual do portal
js/games.js                 ÚNICO lugar com os dados dos jogos
js/layout.js                cabeçalho, rodapé e capas (com placeholder)
js/main.js                  catálogo, pesquisa e filtros
js/game-page.js             monta a página de cada jogo
assets/logo/                logo e favicon (SVG)
assets/capas/               coloque aqui as capas (veja abaixo)
jogos/<slug>/index.html     página do jogo (iframe + controles + tela cheia)
jogos/<slug>/game.html      o arquivo do jogo, copiado sem nenhuma alteração
```

Jogos: `skate-session`, `faxineiro-de-fantasmas`, `lago-lunar` e `turno-da-noite`.

## Rodar no computador

Abra a pasta no VS Code e use a extensão **Live Server**, ou no terminal:

```
python -m http.server 8000
```

e acesse http://localhost:8000. Dar dois cliques no `index.html` costuma funcionar, mas alguns navegadores bloqueiam o salvamento dos jogos em `file://`. Prefira um servidor local.

## Capas

As capas estão em `assets/capas/` (`skate-session.webp`, `faxineiro-de-fantasmas.webp`, `lago-lunar.webp`, `turno-da-noite.webp`). Para trocar uma, substitua o arquivo mantendo o nome (também aceita `.png`, `.jpg`, `.jpeg`), de preferência em 4:3. Jogo sem capa mostra um placeholder em pixel art.

## Adicionar um jogo novo

1. Crie `jogos/<slug>/` e coloque o HTML do jogo como `game.html`.
2. Copie o `index.html` de outra pasta de jogo e troque `data-game="..."` pelo novo slug.
3. Adicione um bloco em `js/games.js` (título, categoria, descrição, controles). Os filtros de categoria se atualizam sozinhos.

## Publicar no GitHub Pages

1. Crie um repositório no GitHub e envie **todo o conteúdo desta pasta** (o `index.html` precisa ficar na raiz do repositório).
2. Em **Settings → Pages**, em *Build and deployment*, escolha **Deploy from a branch**, branch `main`, pasta `/ (root)`.
3. Aguarde alguns minutos. O endereço será `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`.
4. Para atualizar, faça commit e push das mudanças.

Todos os caminhos são relativos, então funciona em endereço de projeto. Na `404.html`, o link de volta tenta descobrir o nome do repositório sozinho; se der errado, ajuste a variável `BASE` no final do arquivo.

## Dependências externas

- **Google Fonts** (Press Start 2P e Pixelify Sans): portal e jogos. Offline, caem para fontes do sistema.
- **Lago Lunar** carrega `@supabase/supabase-js` do jsDelivr e traz no código uma URL e uma chave *publishable* de um projeto Supabase, usadas só no multiplayer. No menu do jogo o multiplayer está desativado ("em breve"). Não coloque chaves secretas (service_role) no HTML.

## Saves

Os jogos salvam no `localStorage` do navegador. O progresso é por navegador e por endereço. Se você publicar em `usuario.github.io/...`, todos os repositórios desse usuário compartilham o mesmo armazenamento, mas as chaves de cada jogo são diferentes (`ff1`/`ff2`, `lagoLunar*`, `tdn1`, `skate-session-v3`).

## Testes realizados

Feitos neste ambiente:
- Tela de carregamento (preta, 5 s cobrindo o jogo, com botão Pular; ajuste `MIN_MS` em `js/game-page.js`): escrita e validada só por leitura/sintaxe; a animação e o tempo na tela não foram vistos em navegador.
- Os 3 `game.html` são idênticos byte a byte aos arquivos enviados.
- Sintaxe dos 5 arquivos JS validada com Node.
- Todos os `href`/`src` locais de todas as páginas apontam para arquivos existentes (0 quebrados).
- Cada entrada de `games.js` tem pasta, `index.html` com o slug certo e `game.html`.
- Análise do código dos jogos: dependências externas, chaves de salvamento e controles.

**Não foi possível testar aqui** (não há navegador nem acesso à internet neste ambiente): abrir o portal e os jogos em um navegador, clicar nos controles, pesquisa e filtros, tela cheia, menu móvel e o layout em diferentes larguras. Faça essa conferência no seu navegador antes de publicar.

## Limitações e pontos de atenção

- O **Lago Lunar** ainda tem no código as ferramentas de criador (Modo Dev), mas o próprio jogo já as esconde (CSS `display:none!important`) e a função que as abre está desativada. Visitantes não veem nem usam.
- Em iPhone não existe tela cheia nativa para iframes; o botão usa um modo expandido.
- Jogos de teclado precisam de um clique na tela do jogo para receber o foco.
- Sem sistema de PIX, doações ou monetização, como pedido.


## Manutenção do portal

- O catálogo e os dados descritivos dos jogos ficam em `js/games.js`.
- O layout compartilhado fica em `js/layout.js`; a pesquisa e os filtros ficam em `js/main.js`.
- As páginas de apresentação dos jogos ficam em `jogos/<slug>/index.html`; os jogos em si ficam em `jogos/<slug>/game.html`.
- O CSS global está em `css/style.css`. Ajustes no portal não devem exigir alterações nos arquivos `game.html`.
- A tela de carregamento do portal não impõe uma espera mínima artificial. Se o iframe demorar, apresenta uma opção para tentar novamente.
- Antes de publicar, teste a página inicial, a pesquisa, todos os filtros, cada página individual, o carregamento dos jogos, tela cheia, navegação por teclado e visualização em celular.
