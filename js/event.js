(function () {
    // ── Filter ──────────────────────────────────────
    const filterBtns = document.querySelectorAll('.event-filter-btn');
    const cards      = document.querySelectorAll('.event-card');
    const emptyEl    = document.getElementById('eventEmpty');

    function filterCards(cat) {
        let visible = 0;
        cards.forEach(function (card) {
            const match = cat === 'all' || card.getAttribute('data-category') === cat;
            if (match) {
                card.classList.remove('hidden');
                visible++;
            } else {
                card.classList.add('hidden');
            }
        });
        if (emptyEl) emptyEl.style.display = visible === 0 ? 'block' : 'none';
    }

    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            filterBtns.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            filterCards(btn.getAttribute('data-filter'));
        });
    });

    // ── Scroll Reveal ────────────────────────────────
    const revealEls = document.querySelectorAll('.reveal');

    function checkReveal() {
        const windowBottom = window.scrollY + window.innerHeight;
        revealEls.forEach(function (el) {
            if (el.getBoundingClientRect().top + window.scrollY < windowBottom - 80) {
                el.classList.add('visible');
            }
        });
    }

    window.addEventListener('scroll', checkReveal, { passive: true });
    checkReveal(); // run on load
})();