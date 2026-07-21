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
    // Cart flow: allow user to pick, auto-set sales org on customer change
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

// Container toggle logic
const containerToggle = document.getElementById('containerToggle');
const selectContainer = document.getElementById('selectContainer');
const containerHeightInput = document.getElementById('containerHeightInput');
const containerHeightUnit = document.getElementById('containerHeightUnit');
const productStored = document.getElementById('productStored');

containerToggle.addEventListener('change', function () {
    if (this.checked) {
        selectContainer.disabled = false;
        containerHeightInput.disabled = true;
        containerHeightUnit.disabled = true;
        productStored.disabled = true;
    } else {
        selectContainer.disabled = true;
        containerHeightInput.disabled = false;
        containerHeightUnit.disabled = false;
        productStored.disabled = false;
    }
});

// Product data
const productData = {
    product1: {
        boilingPoint: '90',
        viscosity: '800',
        vaporPressure: '8',
        detergent: false,
        oxidizer: false,
        vaporProducing: false,
        corrosive: false
    },
    product2: {
        boilingPoint: '60',
        viscosity: '1100',
        vaporPressure: '12',
        detergent: true,
        oxidizer: false,
        vaporProducing: true,
        corrosive: true
    },
    product3: {
        boilingPoint: '95',
        viscosity: '200',
        vaporPressure: '6',
        detergent: false,
        oxidizer: false,
        vaporProducing: false,
        corrosive: false
    }
};

// Container data
const containerData = {
    container1: { height: '15', product: 'product1' },
    container2: { height: '5', product: 'product2' },
    container3: { height: '30', product: 'product2' }
};

// Helper to populate product settings
function populateProductSettings(productKey) {
    const product = productData[productKey];
    if (product) {
        document.getElementById('boilingPoint').value = product.boilingPoint;
        document.getElementById('viscosity').value = product.viscosity;
        document.getElementById('vaporPressure').value = product.vaporPressure;

        document.getElementById('detergentYes').checked = product.detergent;
        document.getElementById('detergentNo').checked = !product.detergent;

        document.getElementById('oxidizerYes').checked = product.oxidizer;
        document.getElementById('oxidizerNo').checked = !product.oxidizer;

        document.getElementById('vaporYes').checked = product.vaporProducing;
        document.getElementById('vaporNo').checked = !product.vaporProducing;

        document.getElementById('corrosiveYes').checked = product.corrosive;
        document.getElementById('corrosiveNo').checked = !product.corrosive;
    } else {
        document.getElementById('boilingPoint').value = '';
        document.getElementById('viscosity').value = '';
        document.getElementById('vaporPressure').value = '';

        document.getElementById('detergentYes').checked = true;
        document.getElementById('detergentNo').checked = false;
        document.getElementById('oxidizerYes').checked = true;
        document.getElementById('oxidizerNo').checked = false;
        document.getElementById('vaporYes').checked = true;
        document.getElementById('vaporNo').checked = false;
        document.getElementById('corrosiveYes').checked = true;
        document.getElementById('corrosiveNo').checked = false;
    }
}

// Auto-populate product settings on product selection
productStored.addEventListener('change', function () {
    populateProductSettings(this.value);
});

// Auto-populate height and product on container selection
selectContainer.addEventListener('change', function () {
    const selected = this.value;
    const container = containerData[selected];

    if (container) {
        containerHeightInput.value = container.height;
        productStored.value = container.product;
        populateProductSettings(container.product);
    } else {
        containerHeightInput.value = '';
        productStored.value = '';
        populateProductSettings(null);
    }
});

// Sensor catalog
const sensorCatalog = {
    'Tekelek Ultrasonic LoRa Sensor': { sku: '7000642', price: 250, image: '../../assets/Ultrasonic Sensor.png' },
    'Tekelek Ultrasonic Long Range LoRa Sensor': { sku: '7000644', price: 300, image: '../../assets/Ultrasonic Sensor.png' },
    'Tekelek Ultrasonic LoRa Sensor with MT Gateway': { sku: '7000642', price: 250, image: '../../assets/Ultrasonic Sensor.png', needsGateway: true },
    'Tekelek Ultrasonic Long Range LoRa Sensor with MT Gateway': { sku: '7000644', price: 300, image: '../../assets/Ultrasonic Sensor.png', needsGateway: true },
    'Tekelek Radar: Invasive Mount': { sku: '7000645', price: 400, image: '../../assets/Radar Sensor.png' },
    'Tekelek Radar: Noninvasive Mount': { sku: '7000646', price: 450, image: '../../assets/Radar Sensor.png' },
    'Milesight': { sku: '7000650', price: 350, image: '../../assets/Ultrasonic Sensor.png' },
    'Work with CSE team, custom sensor required': { sku: 'N/A', price: 0, image: '' }
};

// Decision tree logic (based on Level Sensor Picker flowchart)
function getRecommendation() {
    const DATA_FREQUENCY = {
        HOUR: "every-hour",
        SIX_HOURS: "every-6-hours",
    }

    const height = parseFloat(containerHeightInput.value) || 0;
    const ackumenDataUpdateFrequency = document.getElementById('ackumenDataUpdateFrequency').value;
    const cellularCoverage = document.getElementById('cellularYes').checked;
    const gatewayInstalled = document.getElementById('gatewayYes').checked;
    const containerIsolated = document.getElementById('isolatedYes').checked;

    const boilingPoint = parseFloat(document.getElementById('boilingPoint').value) || null;
    const viscosity = parseFloat(document.getElementById('viscosity').value) || 0;
    const vaporPressure = parseFloat(document.getElementById('vaporPressure').value) || 0;
    const isCorrosive = document.getElementById('corrosiveYes').checked;
    const isVaporProducing = document.getElementById('vaporYes').checked;
    const isDetergent = document.getElementById('detergentYes').checked;
    const isOxidizer = document.getElementById('oxidizerYes').checked;

    const isChemicalProblematic = isCorrosive ||
        (vaporPressure > 10) ||
        (boilingPoint !== null && boilingPoint < 85) ||
        isVaporProducing ||
        isDetergent ||
        isOxidizer ||
        (viscosity >= 1000);

    const currentSalesOrg = document.getElementById('salesOrg').value;
    if (currentSalesOrg === '1350') {
        if (height > 16) {
            return 'Work with CSE team, custom sensor required';
        }
        return 'Milesight';
    }

    if (ackumenDataUpdateFrequency === DATA_FREQUENCY.HOUR) {
        const complement = gatewayInstalled ? "" : " with MT Gateway";
        if (height > 6) {
            return "Tekelek Ultrasonic Long Range LoRa Sensor" + complement;
        }
        return "Tekelek Ultrasonic LoRa Sensor" + complement;

    } else if (ackumenDataUpdateFrequency === DATA_FREQUENCY.SIX_HOURS) {
        if (cellularCoverage) {
            if (height > 26) {
                return "Work with CSE team, custom sensor required";
            }
            if (height > 22) {
                const complement = gatewayInstalled ? "" : " with MT Gateway";
                return "Tekelek Ultrasonic Long Range LoRa Sensor" + complement;
            }
            if (containerIsolated) {
                if (height > 6) return "Tekelek Radar: Invasive Mount";
                else return "Tekelek Radar: Noninvasive Mount";
            }
            if (isChemicalProblematic) {
                if (height > 6) return "Tekelek Radar: Invasive Mount";
                else return "Tekelek Radar: Noninvasive Mount";
            }
            const complement = gatewayInstalled ? "" : " with MT Gateway";
            if (height > 6) {
                return "Tekelek Ultrasonic Long Range LoRa Sensor" + complement;
            }
            return "Tekelek Ultrasonic LoRa Sensor" + complement;
        } else {
            if (height > 26) {
                return "Work with CSE team, custom sensor required";
            } else {
                const complement = gatewayInstalled ? "" : " with MT Gateway";
                if (height > 6) {
                    return "Tekelek Ultrasonic Long Range LoRa Sensor" + complement;
                }
                return "Tekelek Ultrasonic LoRa Sensor" + complement;
            }
        }
    }
}

// Step 5 (YES cellular, non-isolated): Is chemical problematic?

// Validate required fields before running recommendation
function validateRequiredFields() {
    const customerLocationVal = document.getElementById('customerLocation').value;
    const purchaseTypeVal = document.getElementById('purchaseType').value;
    const salesOrgVal = document.getElementById('salesOrg').value;
    const ackumenDataUpdateFrequencyVal = document.getElementById('ackumenDataUpdateFrequency').value;
    const heightVal = containerHeightInput.value.trim();
    const productStoredVal = productStored.value;
    const cellularCoverageSelected = document.querySelector('input[name="cellularCoverage"]:checked');
    const gatewayInstalledSelected = document.querySelector('input[name="gatewayInstalled"]:checked');
    const containerIsolatedSelected = document.querySelector('input[name="containerIsolated"]:checked');

    if (
        !customerLocationVal ||
        !purchaseTypeVal ||
        !salesOrgVal ||
        !ackumenDataUpdateFrequencyVal ||
        !heightVal ||
        !productStoredVal ||
        !cellularCoverageSelected ||
        !gatewayInstalledSelected ||
        !containerIsolatedSelected
    ) {
        return false;
    }
    return true;
}

// Add billing type radios to each product card and toggle monthly suffix.
function setupBillingTypeControls() {
    document.querySelectorAll('.recommendation-card .rec-pricing').forEach(function (pricingBlock, index) {
        const recommendedPriceRow = Array.from(pricingBlock.querySelectorAll('.rec-detail-row')).find(function (row) {
            const label = row.querySelector('.rec-label');
            return label && label.textContent.trim() === 'Recommended Price';
        });

        if (!recommendedPriceRow) {
            return;
        }

        const recommendedValue = recommendedPriceRow.querySelector('.rec-value');
        if (!recommendedValue) {
            return;
        }

        let pricePeriod = recommendedValue.querySelector('.price-period');
        if (!pricePeriod) {
            pricePeriod = document.createElement('span');
            pricePeriod.className = 'price-period';
            pricePeriod.style.display = 'none';
            pricePeriod.textContent = ' /month';
            recommendedValue.appendChild(pricePeriod);
        }

        let billingRow = pricingBlock.querySelector('.billing-type-row');
        if (!billingRow) {
            const radioName = 'billingType' + (index + 1);
            billingRow = document.createElement('div');
            billingRow.className = 'rec-detail-row billing-type-row';
            billingRow.innerHTML =
                '<span class="rec-label">Billing Type</span>' +
                '<div class="rec-value billing-type-value">' +
                '<span class="value-separator">:</span>' +
                '<label class="form-check form-check-inline billing-option">' +
                '<input class="form-check-input billing-type-radio" type="radio" name="' + radioName + '" value="standard" checked>' +
                '<span class="form-check-label">Standard</span>' +
                '</label>' +
                '<label class="form-check form-check-inline billing-option">' +
                '<input class="form-check-input billing-type-radio" type="radio" name="' + radioName + '" value="subscription">' +
                '<span class="form-check-label">Subscription</span>' +
                '</label>' +
                '</div>';
            recommendedPriceRow.insertAdjacentElement('afterend', billingRow);
        }

        const standardRadio = billingRow.querySelector('input[value="standard"]');
        const subscriptionRadio = billingRow.querySelector('input[value="subscription"]');

        const updatePricePeriod = function () {
            pricePeriod.style.display = subscriptionRadio && subscriptionRadio.checked ? 'inline' : 'none';
        };

        if (standardRadio) {
            standardRadio.addEventListener('change', updatePricePeriod);
        }
        if (subscriptionRadio) {
            subscriptionRadio.addEventListener('change', updatePricePeriod);
        }

        updatePricePeriod();
    });
}

setupBillingTypeControls();

// Continue button logic
document.getElementById('continueBtn').addEventListener('click', function () {
    // Validate required fields
    const requiredValid = validateRequiredFields();
    if (!requiredValid) {
        const toastEl = document.getElementById('validationToast');
        const toast = new bootstrap.Toast(toastEl);
        toast.show();
        return;
    }

    const recommendation = getRecommendation();
    const sensor = sensorCatalog[recommendation];
    const recSection = document.getElementById('recommendationSection');
    const recommendedGroup = document.getElementById('recommendedGroup');
    const accessoriesGroup = document.getElementById('accessoriesGroup');
    const cseMessage = document.getElementById('cseMessage');
    const recEquipCard = document.getElementById('recommendedEquipmentCard');
    const recEquipHeader = document.querySelector('.recommendation-group');

    if (recommendation === 'Work with CSE team, custom sensor required') {
        // Show CSE message, hide recommendation cards
        cseMessage.style.display = 'block';
        recommendedGroup.style.display = 'none';
        accessoriesGroup.style.display = 'none';
        document.getElementById('recBottomActions').style.display = 'none';
    } else {
        // Hide CSE message, show normal content
        cseMessage.style.display = 'none';
        recommendedGroup.style.display = 'block';
        document.getElementById('recBottomActions').style.display = 'flex';

        // Keep gateway in logic/SKU mapping, but avoid duplicate wording in the card title.
        const displayRecommendation = recommendation.replace(' with MT Gateway', '');
        document.getElementById('recEquipName').textContent = displayRecommendation;
        document.getElementById('recEquipSKU').textContent = ': ' + sensor.sku;
        document.getElementById('recEquipPrice').textContent = sensor.price;
        document.getElementById('recEquipImage').src = sensor.image;
        document.getElementById('recEquipImage').style.display = 'block';
        document.getElementById('recommendedEquipmentTitle').textContent = 'Recommended Equipment (1)';

        // Show/hide accessories (MT Gateway)
        if (sensor.needsGateway) {
            accessoriesGroup.style.display = 'block';
        } else {
            accessoriesGroup.style.display = 'none';
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
