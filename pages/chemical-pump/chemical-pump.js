// Initialize Bootstrap tooltips
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
tooltipTriggerList.forEach(function (tooltipTriggerEl) {
    new bootstrap.Tooltip(tooltipTriggerEl);
});

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

// Customer/Sales Org mapping
const customerSalesOrgMap = {
    'gp-brewton': '1030',
    '3m-brasil': '1070',
    'airuici-shanghai': '1350'
};

// Sales Org to region mapping
const salesOrgRegionMap = {
    '1030': 'NA_EMENA',
    '1070': 'LATAM',
    '1350': 'APAC'
};

// Detect source: check localStorage for flow origin (set by EO page)
const source = localStorage.getItem('eo_source');
const customerLocation = document.getElementById('customerLocation');
const salesOrg = document.getElementById('salesOrg');

if (source === 'stp') {
    // Pre-populate and disable for STP flow
    customerLocation.value = 'gp-brewton';
    customerLocation.disabled = true;
    // Dynamically add the mapped Sales Org option
    const mappedOrg = customerSalesOrgMap['gp-brewton'];
    const opt = document.createElement('option');
    opt.value = mappedOrg;
    opt.textContent = mappedOrg;
    salesOrg.appendChild(opt);
    salesOrg.value = mappedOrg;
    salesOrg.disabled = true;
} else {
    // Cart or direct flow: allow user to pick, auto-set sales org on customer change
    customerLocation.addEventListener('change', function () {
        const selectedCustomer = this.value;
        // Clear existing options except placeholder
        salesOrg.innerHTML = '<option value="">Select...</option>';
        if (customerSalesOrgMap[selectedCustomer]) {
            const org = customerSalesOrgMap[selectedCustomer];
            const opt = document.createElement('option');
            opt.value = org;
            opt.textContent = org;
            salesOrg.appendChild(opt);
            salesOrg.value = org;
            salesOrg.disabled = false;
        } else {
            salesOrg.value = '';
            salesOrg.disabled = true;
        }
    });
}

// Chemical product data (auto-populates Product Settings)
const chemicalProductData = {
    product1: {
        viscosity: '800',
        ph: '5'
    },
    product2: {
        viscosity: '1100',
        ph: '8'
    },
    product3: {
        viscosity: '200',
        ph: '7'
    }
};

// Auto-populate product settings on chemical product selection
document.getElementById('chemicalProduct').addEventListener('change', function () {
    const selected = this.value;
    const data = chemicalProductData[selected];
    if (data) {
        document.getElementById('viscosity').value = data.viscosity;
        document.getElementById('phValue').value = data.ph;
    } else {
        document.getElementById('viscosity').value = '';
        document.getElementById('phValue').value = '';
    }
});

// Pump catalog
const pumpCatalog = {
    'Grundfos DDA-C FCM 17-10': {
        sku: '8000101',
        price: 1200,
        image: '../../assets/DDA.png',
        note: 'Built-in communications. PVDF pump head, PTFE gaskets, ceramic seals preferred.'
    },
    'Grundfos DDA FCM 60-10': {
        sku: '8000102',
        price: 1800,
        image: '../../assets/DDA.png',
        note: 'With Ebox and CIM 200. PVDF pump head, PTFE gaskets, ceramic seals preferred.'
    },
    'Grundfos DDA FCM 120-7': {
        sku: '8000103',
        price: 2400,
        image: '../../assets/DDA.png',
        note: 'With Ebox and CIM 200. PVDF pump head, PTFE gaskets, ceramic seals preferred.'
    },
    'Grundfos DDA FCM 200-4': {
        sku: '8000104',
        price: 3000,
        image: '../../assets/DDA.png',
        note: 'With Ebox and CIM 200. PVDF pump head, PTFE gaskets, ceramic seals preferred.'
    },
    'Grundfos DDE 6-10': {
        sku: '8000201',
        price: 900,
        image: '../../assets/DDE.png',
        note: 'PVDF pump head, PTFE gaskets, ceramic seals preferred.'
    },
    'Grundfos DDE 60-10': {
        sku: '8000202',
        price: 1400,
        image: '../../assets/DDE.png',
        note: 'PVDF pump head, PTFE gaskets, ceramic seals preferred.'
    },
    'Grundfos DDE 120-7': {
        sku: '8000203',
        price: 2000,
        image: '../../assets/DDE.png',
        note: 'PVDF pump head, PTFE gaskets, ceramic seals preferred.'
    },
    'Grundfos DDE 200-4': {
        sku: '8000204',
        price: 2600,
        image: '../../assets/DDE.png',
        note: 'PVDF pump head, PTFE gaskets, ceramic seals preferred.'
    },
    'Prominent Metering Pump': {
        sku: '8000301',
        price: 1500,
        image: '../../assets/Prominent Pump.jpg',
        note: 'Recommended for LATAM region.'
    }
};

// Decision tree logic
function getRecommendation() {
    const flow = parseFloat(document.getElementById('flowRequirements').value) || 0;
    const pressure = parseFloat(document.getElementById('backpressure').value) || 0;
    const viscosity = parseFloat(document.getElementById('viscosity').value) || 0;
    const variableSpeed = document.getElementById('variableSpeedYes').checked;
    const salesOrgVal = salesOrg.value;
    const region = salesOrgRegionMap[salesOrgVal] || 'NA_EMENA';

    // Step 1: Viscosity gate from flowchart
    // Out of range for this metering-pump branch when viscosity is >= 300 cP.
    // Continue through region and pump-family selection when viscosity is low (< 300 cP).
    if (viscosity >= 300) {
        return null;
    }

    // Step 2: Check region
    if (region === 'LATAM') {
        return 'Prominent Metering Pump';
    }

    // Step 3: Check if flow/pressure falls within metering pump range
    if (variableSpeed) {
        // DDA family (variable speed/flow control)
        if (flow <= 20 && pressure < 9) {
            return 'Grundfos DDA-C FCM 17-10';
        } else if (flow <= 55 && pressure < 9) {
            return 'Grundfos DDA FCM 60-10';
        } else if (flow <= 110 && pressure < 7) {
            return 'Grundfos DDA FCM 120-7';
        } else if (flow <= 190 && pressure < 3.5) {
            return 'Grundfos DDA FCM 200-4';
        } else {
            return null; // Out of range
        }
    } else {
        // DDE family (no variable speed)
        if (flow <= 6 && pressure < 10) {
            return 'Grundfos DDE 6-10';
        } else if (flow <= 55 && pressure < 10) {
            return 'Grundfos DDE 60-10';
        } else if (flow <= 110 && pressure < 7) {
            return 'Grundfos DDE 120-7';
        } else if (flow <= 190 && pressure < 3.5) {
            return 'Grundfos DDE 200-4';
        } else {
            return null; // Out of range
        }
    }
}

// Validate required fields before running recommendation
function validateRequiredFields() {
    const customerLocationVal = document.getElementById('customerLocation').value;
    const purchaseTypeVal = document.getElementById('purchaseType').value;
    const salesOrgVal = salesOrg.value;
    const flowVal = document.getElementById('flowRequirements').value.trim();
    const pressureVal = document.getElementById('backpressure').value.trim();
    const chemicalProductVal = document.getElementById('chemicalProduct').value;
    const viscosityVal = document.getElementById('viscosity').value.trim();
    const phVal = document.getElementById('phValue').value.trim();

    if (!customerLocationVal || !purchaseTypeVal || !salesOrgVal || !flowVal || !pressureVal || !chemicalProductVal || !viscosityVal || !phVal) {
        return false;
    }
    return true;
}

// Continue button logic
document.getElementById('continueBtn').addEventListener('click', function () {
    // Validate required fields
    if (!validateRequiredFields()) {
        const toastEl = document.getElementById('validationToast');
        const toast = new bootstrap.Toast(toastEl);
        toast.show();
        return;
    }

    const recommendation = getRecommendation();
    const recSection = document.getElementById('recommendationSection');
    const cseMessage = document.getElementById('cseMessage');
    const recommendedGroup = document.getElementById('recommendedGroup');
    const recBottomActions = document.getElementById('recBottomActions');

    if (recommendation === null) {
        // Out of range - show message
        cseMessage.style.display = 'block';
        recommendedGroup.style.display = 'none';
        recBottomActions.style.display = 'none';
    } else {
        const pump = pumpCatalog[recommendation];

        // Hide CSE message, show normal content
        cseMessage.style.display = 'none';
        recommendedGroup.style.display = 'block';
        recBottomActions.style.display = 'flex';

        // Update equipment card
        document.getElementById('recEquipName').textContent = recommendation;
        document.getElementById('recEquipSKU').textContent = ': ' + pump.sku;
        document.getElementById('recEquipPrice').textContent = pump.price;
        document.getElementById('recEquipImage').src = pump.image;
        document.getElementById('recEquipRequestedPrice').value = Math.round(pump.price * 1.2);
        document.getElementById('recommendedEquipmentTitle').textContent = 'Recommended Equipment (1)';

        // Show/hide note
        const noteRow = document.getElementById('recEquipNote');
        const noteText = document.getElementById('recEquipNoteText');
        if (pump.note) {
            noteRow.style.display = 'flex';
            noteText.textContent = ': ' + pump.note;
        } else {
            noteRow.style.display = 'none';
        }
    }

    recSection.style.display = 'block';
    recSection.scrollIntoView({ behavior: 'smooth' });
});

// Back button in recommendation hides the section
document.getElementById('recBackBtn').addEventListener('click', function () {
    document.getElementById('recommendationSection').style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Toggle chevron icon on all collapsible section headers
document.querySelectorAll('.all-options-header').forEach(function (header) {
    const targetId = header.getAttribute('data-bs-target');
    const collapseEl = document.querySelector(targetId);
    if (collapseEl) {
        collapseEl.addEventListener('show.bs.collapse', function () {
            header.setAttribute('aria-expanded', 'true');
        });
        collapseEl.addEventListener('hide.bs.collapse', function () {
            header.setAttribute('aria-expanded', 'false');
        });
    }
});
