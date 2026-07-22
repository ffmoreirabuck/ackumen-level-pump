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

// Container configuration logic (process view configured: yes/no)
const containerConfiguredYes = document.getElementById('containerConfiguredYes');
const containerConfiguredNo = document.getElementById('containerConfiguredNo');
const selectContainer = document.getElementById('selectContainer');
const containerHeightInput = document.getElementById('containerHeightInput');
const containerHeightUnit = document.getElementById('containerHeightUnit');
const productStored = document.getElementById('productStored');

function applyContainerConfiguredFlow(useProcessViewConfig) {
    if (useProcessViewConfig) {
        selectContainer.classList.remove('d-none');
        selectContainer.disabled = false;
        containerHeightInput.disabled = true;
        containerHeightUnit.disabled = true;
        productStored.disabled = true;

        // Do not force a default container; user must choose one.
        if (!selectContainer.value) {
            containerHeightInput.value = '';
            productStored.value = '';
            populateProductSettings(null);
        }
    } else {
        selectContainer.classList.add('d-none');
        selectContainer.disabled = true;
        selectContainer.value = '';
        containerHeightInput.disabled = false;
        containerHeightUnit.disabled = false;
        productStored.disabled = false;
    }
}

if (containerConfiguredYes && containerConfiguredNo) {
    containerConfiguredYes.addEventListener('change', function () {
        if (this.checked) {
            applyContainerConfiguredFlow(true);
        }
    });

    containerConfiguredNo.addEventListener('change', function () {
        if (this.checked) {
            applyContainerConfiguredFlow(false);
        }
    });

    // Default state is "No" as set in HTML.
    applyContainerConfiguredFlow(containerConfiguredYes.checked);
}

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

        const hasAnyProductCharacteristic = product.detergent ||
            product.oxidizer ||
            product.vaporProducing ||
            product.corrosive;
        document.getElementById('productPropertiesYes').checked = hasAnyProductCharacteristic;
        document.getElementById('productPropertiesNo').checked = !hasAnyProductCharacteristic;
    } else {
        document.getElementById('boilingPoint').value = '';
        document.getElementById('viscosity').value = '';
        document.getElementById('vaporPressure').value = '';

        document.getElementById('productPropertiesYes').checked = false;
        document.getElementById('productPropertiesNo').checked = true;
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
    const hasAnyProductCharacteristic = document.getElementById('productPropertiesYes').checked;

    const isChemicalProblematic = hasAnyProductCharacteristic ||
        (vaporPressure > 10) ||
        (boilingPoint !== null && boilingPoint < 85) ||
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
        const card = pricingBlock.closest('.recommendation-card');
        const productNameEl = card ? card.querySelector('.rec-details h6') : null;
        const productName = productNameEl ? productNameEl.textContent.trim() : '';
        const isTekelek = /^Tekelek\b/i.test(productName);

        const recommendedPriceRow = Array.from(pricingBlock.querySelectorAll('.rec-detail-row')).find(function (row) {
            const label = row.querySelector('.rec-label');
            return label && label.textContent.trim() === 'Recommended Price';
        });

        let billingRow = pricingBlock.querySelector('.billing-type-row');
        if (!recommendedPriceRow && !billingRow) {
            return;
        }

        const recommendedValue = recommendedPriceRow ? recommendedPriceRow.querySelector('.rec-value') : null;
        if (recommendedPriceRow && !recommendedValue) {
            return;
        }

        if (!billingRow) {
            const radioName = 'billingType' + (index + 1);
            billingRow = document.createElement('div');
            billingRow.className = 'rec-detail-row billing-type-row';
            billingRow.innerHTML =
                '<span class="rec-label">Billing Type</span>' +
                '<div class="rec-value billing-type-value">' +
                '<span class="value-separator">:</span>' +
                '<div class="billing-options-stack">' +
                '<label class="form-check billing-option">' +
                '<input class="form-check-input billing-type-radio" type="radio" name="' + radioName + '" value="standard" checked>' +
                '<span class="form-check-label">Standard</span>' +
                '</label>' +
                '<label class="form-check billing-option">' +
                '<input class="form-check-input billing-type-radio" type="radio" name="' + radioName + '" value="subscription">' +
                '<span class="form-check-label">Subscription</span>' +
                '</label>' +
                '</div>' +
                '<div class="recommended-price-inline">' +
                '<span class="inline-label">Recommended Price</span>' +
                '<span class="inline-separator">:</span>' +
                '<span class="inline-value"></span>' +
                '</div>' +
                '</div>';
            recommendedPriceRow.insertAdjacentElement('beforebegin', billingRow);
        }

        const inlinePriceValue = billingRow.querySelector('.inline-value');
        if (recommendedValue && inlinePriceValue && !inlinePriceValue.hasChildNodes()) {
            while (recommendedValue.firstChild) {
                inlinePriceValue.appendChild(recommendedValue.firstChild);
            }
        }

        if (recommendedPriceRow && recommendedPriceRow.parentNode) {
            recommendedPriceRow.remove();
        }

        if (!inlinePriceValue) {
            return;
        }

        const hadDynamicPriceId = !!inlinePriceValue.querySelector('#recEquipPrice');
        const currentPriceFromId = inlinePriceValue.querySelector('#recEquipPrice');
        const parsedPriceFromText = (inlinePriceValue.textContent.match(/\d+(?:\.\d+)?/) || [null])[0];
        const currentPrice = currentPriceFromId
            ? parseFloat(currentPriceFromId.textContent)
            : (parsedPriceFromText ? parseFloat(parsedPriceFromText) : 0);

        const infoIcon = inlinePriceValue.querySelector('i.bi-info-circle-fill');
        inlinePriceValue.innerHTML = '';
        if (infoIcon) {
            inlinePriceValue.appendChild(infoIcon);
            inlinePriceValue.appendChild(document.createTextNode(' : '));
        }

        const amountSpan = document.createElement('span');
        amountSpan.className = 'billing-price-amount';
        if (hadDynamicPriceId) {
            amountSpan.id = 'recEquipPrice';
        }
        amountSpan.textContent = Number.isFinite(currentPrice) ? String(currentPrice) : '0';
        inlinePriceValue.appendChild(amountSpan);
        inlinePriceValue.appendChild(document.createTextNode(' USD'));

        let pricePeriod = inlinePriceValue.querySelector('.price-period');
        if (!pricePeriod) {
            pricePeriod = document.createElement('span');
            pricePeriod.className = 'price-period';
            pricePeriod.textContent = ' /month';
            inlinePriceValue.appendChild(pricePeriod);
        }

        const standardRadio = billingRow.querySelector('input[value="standard"]');
        const subscriptionRadio = billingRow.querySelector('input[value="subscription"]');

        billingRow.dataset.standardPrice = isTekelek ? '450' : String(currentPrice);
        billingRow.dataset.subscriptionPrice = isTekelek ? '60' : String(currentPrice);

        const updatePricePeriod = function () {
            const standardPrice = parseFloat(billingRow.dataset.standardPrice || '0');
            const subscriptionPrice = parseFloat(billingRow.dataset.subscriptionPrice || '0');
            const isSubscription = subscriptionRadio && subscriptionRadio.checked;

            amountSpan.textContent = String(isSubscription ? subscriptionPrice : standardPrice);
            pricePeriod.style.display = isSubscription ? 'inline' : 'none';
        };

        if (standardRadio) {
            standardRadio.onchange = updatePricePeriod;
        }
        if (subscriptionRadio) {
            subscriptionRadio.onchange = updatePricePeriod;
        }

        if (isTekelek) {
            if (subscriptionRadio) {
                subscriptionRadio.checked = true;
            }
            if (standardRadio) {
                standardRadio.checked = false;
            }
        } else {
            if (standardRadio && subscriptionRadio && !standardRadio.checked && !subscriptionRadio.checked) {
                standardRadio.checked = true;
            }
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

        // Re-apply billing defaults/prices because recommended card can change by selection.
        setupBillingTypeControls();

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
