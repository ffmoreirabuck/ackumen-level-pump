// Sidebar toggle functionality
document.getElementById('sidebarToggle').addEventListener('click', function () {
    const sidebar = document.getElementById('sidebar');
    const mainWrapper = document.querySelector('.main-wrapper');

    sidebar.classList.toggle('collapsed');

    if (sidebar.classList.contains('collapsed')) {
        sidebar.style.width = '0';
        sidebar.style.overflow = 'hidden';
        mainWrapper.style.marginLeft = '0';
    } else {
        sidebar.style.width = '180px';
        sidebar.style.overflow = 'auto';
        mainWrapper.style.marginLeft = '180px';
    }
});

// Submenu toggle
document.querySelectorAll('.has-submenu > a').forEach(function (item) {
    item.addEventListener('click', function (e) {
        e.preventDefault();
        const chevron = this.querySelector('.ms-auto');
        if (chevron) {
            chevron.classList.toggle('bi-chevron-down');
            chevron.classList.toggle('bi-chevron-up');
        }
    });
});

// Equipment card click
document.querySelectorAll('.equipment-card').forEach(function (card) {
    card.addEventListener('click', function () {
        document.querySelectorAll('.equipment-card').forEach(function (c) {
            c.classList.remove('highlighted');
        });
        this.classList.add('highlighted');

        // Navigate to the level-sensor page on double-click or store selection
        const cardLabel = this.querySelector('.card-label').textContent.trim();
        if (cardLabel === 'Tank Level Sensors') {
            window.location.href = '../level-sensor/index.html';
        }
    });
});

// Track the source of navigation (STP or Cart) via URL param and store in localStorage
(function () {
    const urlParams = new URLSearchParams(window.location.search);
    const source = urlParams.get('source');
    if (source) {
        localStorage.setItem('eo_source', source);
    }
})();
