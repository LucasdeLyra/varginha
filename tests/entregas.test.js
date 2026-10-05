import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { JSDOM } from "jsdom";

describe("Páginas de Entregas e Atividade Proposta (Item 8)", () => {
  const rootDir = path.resolve(__dirname, "..");

  it("public/entregas/index.html deve separar visualmente atividade proposta e entregas para outros grupos", () => {
    const html = fs.readFileSync(path.join(rootDir, "public/entregas/index.html"), "utf-8");
    const dom = new JSDOM(html);
    const document = dom.window.document;

    // Link para a atividade proposta (Item 8)
    const linkAtividade = document.querySelector('a[href="/entregas/atividade-proposta"]');
    expect(linkAtividade).not.toBeNull();
    expect(linkAtividade.textContent).toContain("8. Atividade em Grupo com Apoio de Inteligência Artificial");

    // Link para entregas feitas para outros grupos
    const linkOutras = document.querySelector('a[href="/entregas/teste"]');
    expect(linkOutras).not.toBeNull();

    // Verificação de acessibilidade
    const skipLink = document.querySelector(".skip-link");
    expect(skipLink).not.toBeNull();
    expect(skipLink.getAttribute("href")).toBe("#conteudo");
  });

  it("public/entregas/atividade-proposta/index.html deve conter a íntegra do Item 8 e seus subitens", () => {
    const html = fs.readFileSync(path.join(rootDir, "public/entregas/atividade-proposta/index.html"), "utf-8");
    const dom = new JSDOM(html);
    const document = dom.window.document;

    // Título principal
    const title = document.querySelector("h1");
    expect(title.textContent).toContain("8. Atividade em Grupo com Apoio de Inteligência Artificial");

    // Subitens 8.1, 8.2, 8.3, 8.4
    expect(document.getElementById("item-8-1")).not.toBeNull();
    expect(document.getElementById("item-8-2")).not.toBeNull();
    expect(document.getElementById("item-8-3")).not.toBeNull();
    expect(document.getElementById("item-8-4")).not.toBeNull();

    // Prompts e botões de cópia
    const copyButtons = document.querySelectorAll(".btn-copy");
    expect(copyButtons.length).toBeGreaterThanOrEqual(3);

    const prompts = document.querySelectorAll(".prompt-code");
    expect(prompts.length).toBeGreaterThanOrEqual(3);

    // Prompt 8.1 - SQAP e Quality Checklist
    expect(prompts[0].textContent).toContain("Quality Check List detalhada");
    expect(prompts[0].textContent).toContain("over-engineering");

    // Prompt 8.2 - Code Review e Engenheiro de QA Sênior
    expect(prompts[1].textContent).toContain("engenheiro de QA sênior");
    expect(prompts[1].textContent).toContain("complexidade ciclomática");

    // Técnica Grill-me
    expect(document.body.textContent).toContain("Grill-Me");
    expect(document.body.textContent).toContain("Quais riscos posso ter deixado passar?");

    // Prompt 8.3 - PGQ (6 seções)
    expect(prompts[2].textContent).toContain("Plano de Gerenciamento da Qualidade");
    expect(prompts[2].textContent).toContain("1. Objetivos de Qualidade");
    expect(prompts[2].textContent).toContain("6. Critérios de Aceite");

    // Seção de referências não deve estar presente
    const referencias = document.getElementById("referencias");
    expect(referencias).toBeNull();
  });
});
