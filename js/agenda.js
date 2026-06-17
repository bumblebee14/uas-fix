document.addEventListener('DOMContentLoaded', function () {

    var tabs   = document.querySelectorAll('.event-tab');
    var cards  = document.querySelectorAll('.ev-card');
    var emptyEl = document.getElementById('evEmpty');

    function filter(cat) {
        var visible = 0;
        cards.forEach(function (card) {
            var match = cat === 'all' || card.getAttribute('data-cat') === cat;
            if (match) { card.classList.remove('hidden'); visible++; }
            else { card.classList.add('hidden'); }
        });
        if (emptyEl) emptyEl.style.display = visible === 0 ? 'block' : 'none';
    }

    tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
            tabs.forEach(function (t) { t.classList.remove('active'); });
            tab.classList.add('active');
            filter(tab.getAttribute('data-filter'));
        });
    });

    filter('all');
});