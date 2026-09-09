/* ==========================================================================
   YGT CONCIERGERIE — main.js
   Header au scroll + menu mobile
   ========================================================================== */

(function () {
    'use strict';

    /* ----------------------------------------------------------------------
       1. Header — transition transparent -> opaque au scroll
       ---------------------------------------------------------------------- */
    var header = document.getElementById('siteHeader');
    var SCROLL_THRESHOLD = 40;

    function updateHeaderOnScroll() {
        if (!header) return;
        if (window.scrollY > SCROLL_THRESHOLD) {
            header.classList.add('is-scrolled');
        } else if (!header.classList.contains('header-solid')) {
            header.classList.remove('is-scrolled');
        }
    }

    if (header) {
        updateHeaderOnScroll();
        window.addEventListener('scroll', updateHeaderOnScroll, { passive: true });
    }

    /* ----------------------------------------------------------------------
       2. Menu mobile — ouverture / fermeture / accessibilité
       ---------------------------------------------------------------------- */
    var menuToggle = document.getElementById('menuToggle');
    var mobileMenu = document.getElementById('mobileMenu');
    var body = document.body;
    var lastFocusedElement = null;

    function openMenu() {
        if (!mobileMenu || !menuToggle) return;
        lastFocusedElement = document.activeElement;
        mobileMenu.classList.add('is-open');
        mobileMenu.setAttribute('aria-hidden', 'false');
        menuToggle.setAttribute('aria-expanded', 'true');
        menuToggle.setAttribute('aria-label', 'Fermer le menu');
        body.classList.add('menu-open');

        var firstLink = mobileMenu.querySelector('a');
        if (firstLink) firstLink.focus();
    }

    function closeMenu() {
        if (!mobileMenu || !menuToggle) return;
        mobileMenu.classList.remove('is-open');
        mobileMenu.setAttribute('aria-hidden', 'true');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Ouvrir le menu');
        body.classList.remove('menu-open');

        if (lastFocusedElement) lastFocusedElement.focus();
    }

    function isMenuOpen() {
        return mobileMenu && mobileMenu.classList.contains('is-open');
    }

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function () {
            if (isMenuOpen()) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        /* Fermeture au clic sur un lien du menu */
        var mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(function (link) {
            link.addEventListener('click', closeMenu);
        });

        /* Fermeture avec la touche Échap */
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && isMenuOpen()) {
                closeMenu();
            }
        });

        /* Piège de focus simple à l'intérieur du menu ouvert */
        mobileMenu.addEventListener('keydown', function (e) {
            if (e.key !== 'Tab' || !isMenuOpen()) return;

            var focusable = mobileMenu.querySelectorAll('a, button');
            if (!focusable.length) return;

            var first = focusable[0];
            var last = focusable[focusable.length - 1];

            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        });

        /* Fermeture automatique si on repasse en affichage desktop */
        window.addEventListener('resize', function () {
            if (window.innerWidth > 900 && isMenuOpen()) {
                closeMenu();
            }
        });
    }

    /* ----------------------------------------------------------------------
       3. Liens sociaux non encore renseignés — évite le saut d'ancre "#"
       ---------------------------------------------------------------------- */
    var pendingSocialLinks = document.querySelectorAll('a[href="#"].social-icon');
    pendingSocialLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
        });
    });

    /* ----------------------------------------------------------------------
       4. Formulaire de contact — comportement visuel uniquement (pas de backend)
       ---------------------------------------------------------------------- */
    var contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var feedback = document.getElementById('formFeedback');
            if (feedback) {
                feedback.hidden = false;
                feedback.textContent = 'Formulaire prêt à être connecté à un service d’envoi. Aucun message n’a été transmis (backend à configurer).';
                feedback.focus();
            }
        });
    }

    /* ----------------------------------------------------------------------
       5. Galerie photo — visionneuse (lightbox) vanilla JS, page Collections
       ---------------------------------------------------------------------- */
    var lightbox = document.getElementById('lightbox');
    if (lightbox) {
        var lightboxImg = document.getElementById('lightboxImg');
        var lightboxCaption = document.getElementById('lightboxCaption');
        var lightboxClose = lightbox.querySelector('.lightbox-close');
        var lightboxPrev = lightbox.querySelector('.lightbox-prev');
        var lightboxNext = lightbox.querySelector('.lightbox-next');
        var lastTrigger = null;
        var currentGroup = [];
        var currentIndex = 0;

        function openLightbox(group, index) {
            currentGroup = group;
            currentIndex = index;
            showCurrent();
            lightbox.classList.add('is-open');
            lightbox.setAttribute('aria-hidden', 'false');
            body.classList.add('menu-open');
            lightboxClose.focus();
        }

        function showCurrent() {
            var item = currentGroup[currentIndex];
            lightboxImg.src = item.href;
            lightboxImg.alt = item.querySelector('img').alt || '';
            lightboxCaption.textContent = item.dataset.category || '';
        }

        function closeLightbox() {
            lightbox.classList.remove('is-open');
            lightbox.setAttribute('aria-hidden', 'true');
            lightboxImg.src = '';
            body.classList.remove('menu-open');
            if (lastTrigger) lastTrigger.focus();
        }

        function showNext() {
            currentIndex = (currentIndex + 1) % currentGroup.length;
            showCurrent();
        }

        function showPrev() {
            currentIndex = (currentIndex - 1 + currentGroup.length) % currentGroup.length;
            showCurrent();
        }

        var galleryGroups = document.querySelectorAll('[data-photo-grid]');
        galleryGroups.forEach(function (grid) {
            var items = Array.prototype.slice.call(grid.querySelectorAll('.photo-item'));
            items.forEach(function (item, idx) {
                item.addEventListener('click', function (e) {
                    e.preventDefault();
                    lastTrigger = item;
                    openLightbox(items, idx);
                });
            });
        });

        lightboxClose.addEventListener('click', closeLightbox);
        lightboxNext.addEventListener('click', showNext);
        lightboxPrev.addEventListener('click', showPrev);

        lightbox.addEventListener('click', function (e) {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', function (e) {
            if (!lightbox.classList.contains('is-open')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') showNext();
            if (e.key === 'ArrowLeft') showPrev();
        });
    }
})();
