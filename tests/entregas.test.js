import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { JSDOM } from "jsdom";

describe("Navegação e Acesso à Página de Entregas (/entregas)", () => {
  const rootDir = path.resolve(__dirname, "..");

  function loadDocument(relativeHtmlPath) {
    const html = fs.readFileSync(path.join(rootDir, relativeHtmlPath), "utf-8");
    return new JSDOM(html).window.document;
  }

  function assertNavAndCleanFooter(document) {
    // Link na navegação superior (navbar)
    const navLink = document.querySelector('.nav-links a[href="/entregas"]');
    expect(navLink).not.toBeNull();
    expect(navLink.textContent.trim()).toBe("Entregas");

    // Rodapé limpo (sem links intrusivos de entregas)
    const footerLink = document.querySelector('.site-footer a[href="/entregas"]');
    expect(footerLink).toBeNull();
  }

  it("public/index.html deve conter link para /entregas na navbar e manter o rodapé limpo", () => {
    const document = loadDocument("public/index.html");
    assertNavAndCleanFooter(document);
  });

  it("public/sobre-nos/index.html deve conter link para /entregas na navbar e manter o rodapé limpo", () => {
    const document = loadDocument("public/sobre-nos/index.html");
    assertNavAndCleanFooter(document);
  });

  it("public/entregas/index.html deve separar visualmente atividade proposta e entregas para outros grupos", () => {
    const document = loadDocument("public/entregas/index.html");

    // Link para a atividade proposta
    const linkAtividade = document.querySelector('a[href="/entregas/atividade-proposta"]');
    expect(linkAtividade).not.toBeNull();
    expect(linkAtividade.textContent).toContain("Atividade em Grupo com Apoio de Inteligência Artificial");
    expect(linkAtividade.textContent).not.toContain("8.");

    // Link para entregas feitas para outros grupos (Objetivos SMART)
    const linkOutras = document.querySelector('a[href="/entregas/ObjetivosSMART"]');
    expect(linkOutras).not.toBeNull();

    // Verificação de acessibilidade
    const skipLink = document.querySelector(".skip-link");
    expect(skipLink).not.toBeNull();
    expect(skipLink.getAttribute("href")).toBe("#conteudo");
  });

  it("public/entregas/atividade-proposta/index.html deve conter a atividade proposta e suas seções", () => {
    const document = loadDocument("public/entregas/atividade-proposta/index.html");

    // Título principal sem numeração de item
    const title = document.querySelector("h1");
    expect(title.textContent).toContain("Atividade em Grupo com Apoio de Inteligência Artificial");
    expect(title.textContent).not.toContain("8.");

    // Seções temáticas sem numeração 8.x
    expect(document.getElementById("quality-checklist")).not.toBeNull();
    expect(document.getElementById("code-review")).not.toBeNull();
    expect(document.getElementById("criacao-pgq")).not.toBeNull();
    expect(document.getElementById("melhoria-prompts")).not.toBeNull();

    // Prompts e botões de cópia
    const copyButtons = document.querySelectorAll(".btn-copy");
    expect(copyButtons.length).toBeGreaterThanOrEqual(3);

    const prompts = document.querySelectorAll(".prompt-code");
    expect(prompts.length).toBeGreaterThanOrEqual(3);

    // Prompt SQAP e Quality Checklist
    expect(prompts[0].textContent).toContain("Quality Check List detalhada");
    expect(prompts[0].textContent).toContain("over-engineering");

    // Prompt Code Review e Engenheiro de QA Sênior
    expect(prompts[1].textContent).toContain("engenheiro de QA sênior");
    expect(prompts[1].textContent).toContain("complexidade ciclomática");

    // Técnica Grill-me
    expect(document.body.textContent).toContain("Grill-Me");
    expect(document.body.textContent).toContain("Quais riscos posso ter deixado passar?");

    // Prompt PGQ (6 seções)
    expect(prompts[2].textContent).toContain("Plano de Gerenciamento da Qualidade");
    expect(prompts[2].textContent).toContain("1. Objetivos de Qualidade");
    expect(prompts[2].textContent).toContain("6. Critérios de Aceite");

    // Seção de referências não deve estar presente
    const referencias = document.getElementById("referencias");
    expect(referencias).toBeNull();
  });
});

describe("Menu Responsivo Mobile (Hambúrguer)", () => {
  const rootDir = path.resolve(__dirname, "..");

  function loadDocument(relativeHtmlPath) {
    const html = fs.readFileSync(path.join(rootDir, relativeHtmlPath), "utf-8");
    return new JSDOM(html).window.document;
  }

  it("deve conter o botão nav-toggle com atributos de acessibilidade nas páginas principais", () => {
    const pages = [
      "public/index.html",
      "public/sobre-nos/index.html",
      "public/entregas/index.html",
      "public/entregas/atividade-proposta/index.html",
      "public/entregas/tap/index.html",
      "public/entregas/ObjetivosSMART/index.html",
    ];

    for (const page of pages) {
      const document = loadDocument(page);
      const toggle = document.querySelector(".nav-toggle");
      expect(toggle).not.toBeNull();
      expect(toggle.getAttribute("aria-expanded")).toBe("false");
      expect(toggle.getAttribute("aria-controls")).toBe("nav-menu");
      expect(toggle.getAttribute("aria-label")).toBe("Abrir menu de navegação");

      const menu = document.getElementById("nav-menu");
      expect(menu).not.toBeNull();
      expect(menu.classList.contains("nav-links")).toBe(true);
    }
  });

  it("public/index.html deve permitir acessar Sobre nós e Entregas a partir do menu", () => {
    const document = loadDocument("public/index.html");
    const sobreNos = document.querySelector('#nav-menu a[href="/sobre-nos"]');
    const entregas = document.querySelector('#nav-menu a[href="/entregas"]');

    expect(sobreNos).not.toBeNull();
    expect(sobreNos.textContent.trim()).toBe("Sobre nós");
    expect(entregas).not.toBeNull();
    expect(entregas.textContent.trim()).toBe("Entregas");
  });

  it("public/script.js deve alternar classes e atributos aria ao interagir com o menu", () => {
    const scriptCode = fs.readFileSync(path.join(rootDir, "public/script.js"), "utf-8");
    const html = fs.readFileSync(path.join(rootDir, "public/index.html"), "utf-8");

    const dom = new JSDOM(html, { runScripts: "dangerously" });
    dom.window.eval(scriptCode);
    dom.window.document.dispatchEvent(new dom.window.Event("DOMContentLoaded"));

    const toggle = dom.window.document.querySelector(".nav-toggle");
    const menu = dom.window.document.querySelector(".nav-links");

    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(menu.classList.contains("is-open")).toBe(false);

    // Clicar para abrir
    toggle.click();
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    expect(menu.classList.contains("is-open")).toBe(true);

    // Clicar em um link dentro do menu para fechar
    const firstLink = menu.querySelector("a");
    firstLink.click();
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(menu.classList.contains("is-open")).toBe(false);
  });
});
