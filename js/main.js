(function ($) {
    "use strict";

    // Spinner
    setTimeout(function () {
        if ($('#spinner').length > 0) $('#spinner').removeClass('show');
    }, 1);

    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 50) {
            $('.navbar').addClass('sticky-top');
        } else {
            $('.navbar').removeClass('sticky-top');
        }
    });

    // Back to top
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 1000);
        return false;
    });

    // ================================================
    // HERO CLICK SLIDER
    // ================================================
    const heroContainer = document.getElementById('heroClickSlider');
    const heroSlides = document.querySelectorAll('.hero-click-slider .hero-slide');

    if (heroContainer && heroSlides.length > 0) {
        let currentIndex = 0;
        let autoInterval;

        function showSlide(index) {
            heroSlides.forEach(s => s.classList.remove('active'));
            heroSlides[index].classList.add('active');
            currentIndex = index;
        }

        function startAutoSlide() {
            autoInterval = setInterval(() => {
                showSlide((currentIndex + 1) % heroSlides.length);
            }, 5000);
        }

        function stopAutoSlide() { clearInterval(autoInterval); }

        startAutoSlide();

        heroContainer.addEventListener('click', (e) => {
            const rect = heroContainer.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const w = rect.width;
            if (clickX < w * 0.4) {
                showSlide((currentIndex - 1 + heroSlides.length) % heroSlides.length);
            } else if (clickX > w * 0.6) {
                showSlide((currentIndex + 1) % heroSlides.length);
            }
            stopAutoSlide();
            startAutoSlide();
        });

        showSlide(0);
    }

    // ================================================
    // SPOTLIGHT SLIDER - INFINITE LOOP
    // ================================================
    (function () {

        const track = document.getElementById('spotlightTrack');
        const counter = document.getElementById('spotlightCounter');
        const progress = document.getElementById('spotlightProgress');
        const prev = document.getElementById('spotlightPrev');
        const next = document.getElementById('spotlightNext');

        if (!track) return;

        const cards = Array.from(track.children);
        const total = cards.length;

        // ========================================
        // Build Progress
        // ========================================

        progress.innerHTML = '';

        for (let i = 0; i < total; i++) {
            const bar = document.createElement('div');
            bar.classList.add('progress-item');
            progress.appendChild(bar);
        }

        const bars = progress.querySelectorAll('.progress-item');

        // ========================================
        // Clone first & last
        // ========================================

        cards.forEach(card => {
            track.appendChild(card.cloneNode(true));
        });

        let index = 1;
        let isAnimating = false;

        // ========================================
        // Helpers
        // ========================================

        function getCardWidth() {

            const card = track.querySelector('.spotlight-card');

            const style = getComputedStyle(track);

            const gap =
                parseFloat(style.gap) ||
                parseFloat(style.columnGap) ||
                20;

            return card.getBoundingClientRect().width + gap;
        }

        function updateCounterAndProgress() {

            let realIndex = index - 1;

            if (realIndex < 0) realIndex = total - 1;
            if (realIndex >= total) realIndex = 0;

            counter.innerHTML =
                `${String(realIndex + 1).padStart(2, '0')}
                <span>/ ${String(total).padStart(2, '0')}</span>`;

            bars.forEach((bar, i) => {

                bar.classList.remove('active', 'done');

                if (i < realIndex) {
                    bar.classList.add('done');
                }

                if (i === realIndex) {
                    bar.classList.add('active');
                }
            });
        }

        function moveSlider(animate = true) {

            track.style.transition = animate
                ? '0.6s cubic-bezier(.4,0,.2,1)'
                : 'none';

            track.style.transform =
                `translateX(-${index * getCardWidth()}px)`;

            updateCounterAndProgress();
        }

        // ========================================
        // Init
        // ========================================

        moveSlider(false);

        // ========================================
        // Navigation
        // ========================================

        next?.addEventListener('click', () => {

            if (isAnimating) return;

            isAnimating = true;
            index++;

            moveSlider(true);

        });

        prev?.addEventListener('click', () => {

            if (isAnimating) return;

            isAnimating = true;
            index--;

            moveSlider(true);

        });

        // ========================================
        // Infinite Loop
        // ========================================

        track.addEventListener('transitionend', () => {

            if (index === 0) {

                index = total;

                track.style.transition = 'none';

                track.style.transform =
                    `translateX(-${index * getCardWidth()}px)`;

                track.offsetHeight;

                track.style.transition =
                    '0.6s cubic-bezier(.4,0,.2,1)';
            }

            else if (index === total + 1) {

                index = 1;

                track.style.transition = 'none';

                track.style.transform =
                    `translateX(-${index * getCardWidth()}px)`;

                track.offsetHeight;

                track.style.transition =
                    '0.6s cubic-bezier(.4,0,.2,1)';
            }

            updateCounterAndProgress();

            isAnimating = false;
        });

        // ========================================
        // Resize
        // ========================================

        window.addEventListener('resize', () => {
            moveSlider(false);
        });

        // ========================================
        // Preload Images
        // ========================================

        track.querySelectorAll('img').forEach(img => {

            if (!img.src) return;

            const preload = new Image();
            preload.src = img.src;

        });

        // ========================================
        // Mobile Footer Move
        // ========================================

        function moveFooter() {

            const footer = document.getElementById('spotlightFooter');
            const right = document.querySelector('.spotlight-right');
            const left = document.querySelector('.spotlight-left');

            if (!footer || !right || !left) return;

            if (window.innerWidth <= 1200) {

                right.parentNode.insertBefore(
                    footer,
                    right.nextSibling
                );

            } else {

                left.appendChild(footer);

            }
        }

        moveFooter();

        window.addEventListener('resize', moveFooter);

    })();

    // ================================================
    // STATS COUNTER ANIMATION
    // ================================================
    function animateCounters() {
        const counters = document.querySelectorAll('.stats-value[data-target]');
        counters.forEach(el => {
            const target = parseInt(el.getAttribute('data-target'));
            const duration = 1500;
            const step = target / (duration / 16);
            let current = 0;

            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    el.textContent = target;
                    clearInterval(timer);
                } else {
                    el.textContent = Math.floor(current);
                }
            }, 16);
        });
    }

    // Trigger counter when stats section enters viewport
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        let triggered = false;
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !triggered) {
                triggered = true;
                animateCounters();
            }
        }, { threshold: 0.3 });
        observer.observe(statsSection);
    }

    // ================================================
    // MODAL PETA
    // ================================================
    const openMap  = document.getElementById('openMap');
    const mapModal = document.getElementById('mapModal');
    const closeMap = document.getElementById('closeMap');

    if (openMap) {
        openMap.addEventListener('click', () => {
            mapModal.classList.add('show');
            document.body.style.overflow = 'hidden';
        });
    }
    if (closeMap) {
        closeMap.addEventListener('click', () => {
            mapModal.classList.remove('show');
            document.body.style.overflow = '';
        });
    }

})(jQuery);