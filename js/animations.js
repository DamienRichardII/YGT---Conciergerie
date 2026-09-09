/* ==========================================================================
   YGT CONCIERGERIE — animations.js
   Apparition progressive des éléments au scroll (IntersectionObserver)
   ========================================================================== */

(function () {
    'use strict';

    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var revealEls = document.querySelectorAll('.reveal, .reveal-fade, .reveal-scale');

    if (!revealEls.length) return;

    /* Si l'utilisateur préfère un mouvement réduit, on affiche tout directement */
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
        revealEls.forEach(function (el) { el.classList.add('is-visible'); });
        return;
    }

    var observer = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            root: null,
            rootMargin: '0px 0px -8% 0px',
            threshold: 0.12
        }
    );

    revealEls.forEach(function (el) { observer.observe(el); });
})();
