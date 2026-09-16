import { defineConfig } from "vitest/config";

// Ambiente de testes do site estático do Projeto Bilu.
// Usa jsdom para carregar e parsear os documentos HTML de public/
// (por exemplo, public/sobre-nos/index.html e public/index.html).
export default defineConfig({
  test: {
    // Ambiente de DOM para asserções sobre a árvore HTML.
    environment: "jsdom",
    // Localiza os testes co-locados e em diretórios de teste.
    include: ["**/*.{test,spec}.{js,mjs,ts}"],
    // Não observar arquivos: execução single-run via `npm test` (vitest --run).
    watch: false,
    globals: true,
  },
});
