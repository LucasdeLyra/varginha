# 👽 Bilu — Busquem conhecimento

**Projeto Bilu** é um site educacional de **astronomia e astronáutica**, pensado para ajudar estudantes do ensino básico a se prepararem, de forma autônoma e divertida, para a **OBA (Olimpíada Brasileira de Astronomia e Astronáutica)**, e para servir de apoio a educadores.

O nome é uma referência ao "ET Bilu" e ao seu bordão *"Busquem conhecimento"*, que resume o lema da iniciativa: estimular a curiosidade científica desde cedo.

A landing page tem tema de **espaço sideral** — céu estrelado animado, gradientes de nebulosa e uma paleta cósmica — construída apenas com HTML, CSS e um toque de JavaScript.

## ✨ Destaques

- **Educacional**: conteúdo de astronomia e astronáutica com foco na OBA.
- **Para todos**: linguagem acessível ao público infantojuvenil e a educadores.
- **Tema cósmico**: estrelas dinâmicas (com fallback em CSS) e nebulosas.
- **Acessível e leve**: navegação por teclado, `skip-link`, suporte a `prefers-reduced-motion` e sem dependências de build.
- **Pronto para deploy grátis** no Cloudflare Workers ou Cloudflare Pages.

## 📁 Estrutura

```
.
├── public/            # arquivos estáticos servidos ao usuário
│   ├── index.html
│   ├── styles.css
│   ├── script.js
│   └── _headers       # cabeçalhos de segurança/cache (Cloudflare Pages)
├── wrangler.toml      # configuração do Cloudflare Workers (Static Assets)
└── README.md
```

## 🚀 Rodar localmente

Qualquer servidor estático funciona. Exemplos:

```bash
# Python
python3 -m http.server 8080 --directory public

# Node (npx)
npx serve public
```

Ou usando o preview do próprio Cloudflare:

```bash
npx wrangler dev
```

Depois abra `http://localhost:8080` (ou a porta indicada pelo Wrangler).

## ☁️ Deploy no Cloudflare

### Opção A — Cloudflare Workers (Static Assets)

O `wrangler.toml` já aponta os assets para `./public`.

```bash
npx wrangler deploy
```

### Opção B — Cloudflare Pages

1. Envie o repositório para o GitHub/GitLab.
2. No painel do Cloudflare: **Workers & Pages → Create → Pages → Connect to Git**.
3. Configure o build:
   - **Build command**: *(deixe vazio)*
   - **Build output directory**: `public`
4. Deploy. O arquivo `public/_headers` é aplicado automaticamente.

## 🎨 Personalização

- Cores e espaçamentos ficam nas variáveis CSS no topo de `public/styles.css`
  (`:root`).
- A quantidade de estrelas é ajustada em `public/script.js` (`buildStars`).
- Textos e seções estão em `public/index.html`.

---

Projeto Bilu · “Busquem conhecimento.”
