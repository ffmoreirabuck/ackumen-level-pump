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

// Select All checkbox
document.getElementById('selectAll').addEventListener('change', function () {
    const checkboxes = document.querySelectorAll('.cart-table tbody .form-check-input');
    const isChecked = this.checked;
    checkboxes.forEach(function (cb) {
        cb.checked = isChecked;
    });
    updateSelectedCount();
});

// Individual checkboxes
document.querySelectorAll('.cart-table tbody .form-check-input').forEach(function (cb) {
    cb.addEventListener('change', updateSelectedCount);
});

function updateSelectedCount() {
    const checkboxes = document.querySelectorAll('.cart-table tbody .form-check-input');
    const checked = document.querySelectorAll('.cart-table tbody .form-check-input:checked');
    const label = document.querySelector('.cart-toolbar .text-muted');
    label.textContent = checked.length + ' of ' + checkboxes.length + ' selected';
}

// Delete action
document.querySelectorAll('.action-delete').forEach(function (btn) {
    btn.addEventListener('click', function () {
        const row = this.closest('tr');
        if (row) {
            row.remove();
            updateSelectedCount();
        }
    });
});
