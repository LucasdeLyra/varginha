// Bilu — script leve para o céu estrelado e pequenas interações.
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

  document.addEventListener("DOMContentLoaded", function () {
    buildStars();
    initActiveNav();
  });
})();
