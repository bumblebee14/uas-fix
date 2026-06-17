document.addEventListener('DOMContentLoaded', function () {

    const items    = Array.from(document.querySelectorAll('.galeri-page-item'));
    const overlay  = document.getElementById('customLightbox');
    const imgEl    = document.getElementById('clbImg');
    const titleEl  = document.getElementById('clbTitle');
    const btnClose = document.getElementById('clbClose');
    const btnPrev  = document.getElementById('clbPrev');
    const btnNext  = document.getElementById('clbNext');

    // Debug — cek apakah element ketemu
    console.log('items:', items.length);
    console.log('overlay:', overlay);
    console.log('btnClose:', btnClose);

    if (!overlay || !imgEl || !btnClose) {
        console.error('Custom lightbox HTML belum ada di galeri.html!');
        return;
    }

    if (items.length === 0) {
        console.error('Tidak ada .galeri-page-item ditemukan!');
        return;
    }

    let current = 0;
    let visibleItems = [];

    function getVisible() {
        return items.filter(el => !el.classList.contains('hidden'));
    }

    function show(index) {
        const el = visibleItems[index];
        if (!el) return;
        const src = el.getAttribute('href') && el.getAttribute('href') !== '#'
            ? el.getAttribute('href')
            : el.getAttribute('data-img') || '';
        imgEl.src = encodeURI (src);
        imgEl.alt = el.getAttribute('data-title') || '';
        titleEl.textContent = el.getAttribute('data-title') || '';
        current = index;
        console.log('Showing:', src, titleEl.textContent);
    }

    function open(index) {
        visibleItems = getVisible();
        if (!visibleItems.length) return;
        show(index);
        overlay.classList.add('active');
        document.body.classList.add('clb-open');
    }

    function close() {
        overlay.classList.remove('active');
        document.body.classList.remove('clb-open');
        imgEl.src = '';
    }

    function prev() {
        current = (current - 1 + visibleItems.length) % visibleItems.length;
        show(current);
    }

    function next() {
        current = (current + 1) % visibleItems.length;
        show(current);
    }

    items.forEach(function (el) {
        el.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            visibleItems = getVisible();
            const idx = visibleItems.indexOf(el);
            console.log('Clicked item index:', idx);
            open(idx >= 0 ? idx : 0);
        });
    });

    btnClose.addEventListener('click', close);
    btnPrev.addEventListener('click', function(e) { e.stopPropagation(); prev(); });
    btnNext.addEventListener('click', function(e) { e.stopPropagation(); next(); });

    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) close();
    });

    document.addEventListener('keydown', function (e) {
        if (!overlay.classList.contains('active')) return;
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowLeft') prev();
        if (e.key === 'ArrowRight') next();
    });

    let touchX = 0;
    overlay.addEventListener('touchstart', function (e) {
        touchX = e.touches[0].clientX;
    }, { passive: true });

    overlay.addEventListener('touchend', function (e) {
        const diff = touchX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
    }, { passive: true });

});