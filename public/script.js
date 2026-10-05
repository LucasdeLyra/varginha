// Bilu — script leve para o céu estrelado e pequenas interações.
(function () {
  "use strict";

  var reduceMotion = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---- Gera estrelas dinâmicas no #starfield ----
  function buildStars() {
    var field = document.getElementById("starfield");
    if (!field) return;

    // menos estrelas em telas pequenas para manter tudo leve
    var count = window.innerWidth < 720 ? 60 : 120;
    var frag = document.createDocumentFragment();

    for (var i = 0; i < count; i++) {
      var s = document.createElement("span");
      s.className = "star";
      var size = (Math.random() * 2 + 0.5).toFixed(2);
      s.style.width = size + "px";
      s.style.height = size + "px";
      s.style.left = (Math.random() * 100).toFixed(2) + "%";
      s.style.top = (Math.random() * 100).toFixed(2) + "%";

      if (!reduceMotion) {
        s.style.setProperty("--dur", (Math.random() * 4 + 2).toFixed(2) + "s");
        s.style.setProperty("--delay", (Math.random() * 5).toFixed(2) + "s");
      } else {
        s.style.animation = "none";
      }
      frag.appendChild(s);
    }
    field.appendChild(frag);
  }

  // ---- Realce do link ativo na navegação ao rolar ----
  function initActiveNav() {
    var sections = document.querySelectorAll("main section[id]");
    var links = document.querySelectorAll(".nav-links a");
    if (!("IntersectionObserver" in window) || !sections.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var id = entry.target.getAttribute("id");
          links.forEach(function (link) {
            var isActive = link.getAttribute("href") === "#" + id;
            link.style.color = isActive ? "var(--text)" : "";
          });
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );

    sections.forEach(function (sec) {
      observer.observe(sec);
    });
  }

  // ---- Botões de cópia para prompts e blocos de código ----
  function initCopyButtons() {
    var copyBtns = document.querySelectorAll(".btn-copy");
    copyBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var box = btn.closest(".prompt-box");
        var code = box ? box.querySelector(".prompt-code") : null;
        var textToCopy = code ? (code.textContent || code.innerText) : "";
        if (!textToCopy) return;

        function markCopied() {
          var originalHtml = btn.innerHTML;
          btn.classList.add("copied");
          btn.innerHTML = '<span aria-hidden="true">✓</span> Copiado!';
          setTimeout(function () {
            btn.classList.remove("copied");
            btn.innerHTML = originalHtml;
          }, 2000);
        }

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(textToCopy).then(markCopied).catch(function () {
            fallbackCopy(textToCopy, markCopied);
          });
        } else {
          fallbackCopy(textToCopy, markCopied);
        }
      });
    });
  }

  function fallbackCopy(text, cb) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      cb();
    } catch (e) {
      // falha silenciosa se bloqueado
    }
    document.body.removeChild(ta);
  }

  // ---- Menu responsivo móvel (hambúrguer) ----
  function initMobileNav() {
    var toggle = document.querySelector(".nav-toggle");
    var menu = document.querySelector(".nav-links");
    if (!toggle || !menu) return;

    function setOpen(open) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Fechar menu de navegação" : "Abrir menu de navegação");
      var icon = toggle.querySelector(".nav-toggle-icon");
      if (icon) {
        icon.textContent = open ? "✕" : "☰";
      }
      if (open) {
        menu.classList.add("is-open");
      } else {
        menu.classList.remove("is-open");
      }
    }

    toggle.addEventListener("click", function () {
      var isOpen = menu.classList.contains("is-open");
      setOpen(!isOpen);
    });

    // Fechar ao clicar em qualquer link (importante para rolagem suave na mesma página)
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setOpen(false);
      });
    });

    // Fechar ao pressionar a tecla Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("is-open")) {
        setOpen(false);
        toggle.focus();
      }
    });

    // Fechar ao clicar fora do menu
    document.addEventListener("click", function (e) {
      if (menu.classList.contains("is-open") && !toggle.contains(e.target) && !menu.contains(e.target)) {
        setOpen(false);
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    buildStars();
    initActiveNav();
    initCopyButtons();
    initMobileNav();
  });
})();
