// Game state
let score = 0;
let clickPower = 1;
let passiveIncome = 0;

// Upgrades data
const upgrades = [
    {
        id: 'powerup',
        name: 'Click Power',
        baseCost: 50,
        baseProduction: 0,
        clickBonus: 1,
        count: 0,
        multiplier: 1.2,
        productionMultiplier: 1
    },
    {
        id: 'cursor',
        name: 'Auto Clicker',
        baseCost: 10,
        baseProduction: 0.1,
        count: 0,
        multiplier: 1.15,
        productionMultiplier: 1
    },
    {
        id: 'worker',
        name: 'Worker',
        baseCost: 100,
        baseProduction: 1,
        count: 0,
        multiplier: 1.15,
        productionMultiplier: 1
    },
    {
        id: 'factory',
        name: 'Factory',
        baseCost: 1000,
        baseProduction: 10,
        count: 0,
        multiplier: 1.15,
        productionMultiplier: 1
    }
];

// Multipliers data
const multipliers = [
    {
        upgradeId: 'powerup',
        name: 'Click Power Multiplier',
        baseCost: 250,
        multiplier: 1.25,
        count: 0
    },
    {
        upgradeId: 'cursor',
        name: 'Auto Clicker Multiplier',
        baseCost: 50,
        multiplier: 1.25,
        count: 0
    },
    {
        upgradeId: 'worker',
        name: 'Worker Multiplier',
        baseCost: 500,
        multiplier: 1.25,
        count: 0
    },
    {
        upgradeId: 'factory',
        name: 'Factory Multiplier',
        baseCost: 5000,
        multiplier: 1.25,
        count: 0
    }
];

// DOM elements
const scoreEl = document.getElementById('score');
const perSecondEl = document.getElementById('perSecond');
const clickButton = document.getElementById('clickButton');
const upgradesContainer = document.getElementById('upgradesContainer');
const multipliersContainer = document.getElementById('multipliersContainer');

// Click handler
clickButton.addEventListener('click', (e) => {
    score += clickPower;
    updateDisplay();
    createClickEffect(e);
});

// Create floating number effect
function createClickEffect(e) {
    const effect = document.createElement('div');
    effect.className = 'click-effect';
    effect.textContent = `+${clickPower}`;
    effect.style.left = e.clientX + 'px';
    effect.style.top = e.clientY + 'px';
    document.body.appendChild(effect);
    
    setTimeout(() => effect.remove(), 1000);
}

// Calculate upgrade cost
function getUpgradeCost(upgrade) {
    return Math.floor(upgrade.baseCost * Math.pow(upgrade.multiplier, upgrade.count));
}

// Calculate multiplier cost
function getMultiplierCost(multiplier) {
    return Math.floor(multiplier.baseCost * Math.pow(multiplier.multiplier, multiplier.count));
}

// Recalculate total click power and passive income
function recalculateTotals() {
    clickPower = 1;
    passiveIncome = 0;
    upgrades.forEach(upgrade => {
        if (upgrade.clickBonus) {
            clickPower += upgrade.clickBonus * upgrade.count * upgrade.productionMultiplier;
        } else {
            passiveIncome += upgrade.baseProduction * upgrade.count * upgrade.productionMultiplier;
        }
    });
}

// Calculate upgrade efficiency (production per cost)
function getUpgradeEfficiency(upgrade) {
    const production = upgrade.clickBonus || upgrade.baseProduction;
    const cost = getUpgradeCost(upgrade);
    return production / cost;
}

// Get production per second for an upgrade
function getUpgradeProduction(upgrade) {
    if (upgrade.clickBonus) {
        return `+${upgrade.clickBonus * upgrade.productionMultiplier} per click`;
    } else {
        return `+${(upgrade.baseProduction * upgrade.productionMultiplier).toFixed(1)}/sec`;
    }
}

// Buy upgrade
function buyUpgrade(upgrade) {
    const cost = getUpgradeCost(upgrade);
    
    if (score >= cost) {
        score -= cost;
        upgrade.count++;
        
        recalculateTotals();
        updateDisplay();
        renderUpgrades();
    }
}

// Buy multiplier
function buyMultiplier(multiplier) {
    const cost = getMultiplierCost(multiplier);
    
    if (score >= cost) {
        score -= cost;
        multiplier.count++;
        
        // Find the upgrade and increase its multiplier
        const upgrade = upgrades.find(u => u.id === multiplier.upgradeId);
        if (upgrade) {
            upgrade.productionMultiplier *= 2; // Double the production multiplier
        }
        
        recalculateTotals();
        updateDisplay();
        renderUpgrades();
        renderMultipliers();
    }
}

// Render upgrades
function renderUpgrades() {
    upgradesContainer.innerHTML = '';
    
    upgrades.forEach((upgrade, index) => {
        if (!isUpgradeUnlocked(index)) {
            return;
        }
        
        const cost = getUpgradeCost(upgrade);
        const canAfford = score >= cost;
        const efficiency = getUpgradeEfficiency(upgrade);
        const isPassiveUpgrade = !upgrade.clickBonus;
        const production = getUpgradeProduction(upgrade);
        
        const upgradeDiv = document.createElement('div');
        upgradeDiv.className = 'upgrade';
        
        let efficiencyDisplay = isPassiveUpgrade ? ` | Efficiency: ${efficiency.toFixed(4)}` : '';
        
        upgradeDiv.innerHTML = `
            <div class="upgrade-info">
                <div class="upgrade-name">${upgrade.name}</div>
                <div class="upgrade-details">
                    ${production} | Owned: <span class="upgrade-count">${upgrade.count}</span>${efficiencyDisplay}
                </div>
            </div>
            <button class="upgrade-button" ${!canAfford ? 'disabled' : ''}>
                ${cost} 💰
            </button>
        `;
        
        upgradeDiv.querySelector('button').addEventListener('click', () => buyUpgrade(upgrade));
        upgradesContainer.appendChild(upgradeDiv);
    });
}

// Render multipliers
function renderMultipliers() {
    multipliersContainer.innerHTML = '';
    
    multipliers.forEach(multiplier => {
        const upgrade = upgrades.find(u => u.id === multiplier.upgradeId);
        if (!upgrade || upgrade.count === 0) {
            return; // Only show if the upgrade has been bought at least once
        }
        
        const cost = getMultiplierCost(multiplier);
        const canAfford = score >= cost;
        
        const multiplierDiv = document.createElement('div');
        multiplierDiv.className = 'upgrade'; // Reuse upgrade class for styling
        
        multiplierDiv.innerHTML = `
            <div class="upgrade-info">
                <div class="upgrade-name">${multiplier.name}</div>
                <div class="upgrade-details">
                    Doubles production | Owned: <span class="multiplier-count">${multiplier.count}</span>
                </div>
            </div>
            <button class="upgrade-button" ${!canAfford ? 'disabled' : ''}>
                ${cost} 💰
            </button>
        `;
        
        multiplierDiv.querySelector('button').addEventListener('click', () => buyMultiplier(multiplier));
        multipliersContainer.appendChild(multiplierDiv);
    });
}

// Update display
function updateDisplay() {
    scoreEl.textContent = Math.floor(score);
    perSecondEl.textContent = passiveIncome.toFixed(1);
    updateUpgradeButtons();
    updateMultiplierButtons();
}

// Helper function to check if upgrade should be unlocked
function isUpgradeUnlocked(index) {
    if (index === 0) return true; // First upgrade always unlocked
    
    const previousUpgradeBought = upgrades[index - 1].count > 0;
    const cost = getUpgradeCost(upgrades[index]);
    const canAfford = score >= cost;
    const alreadyOwned = upgrades[index].count > 0;
    
    return previousUpgradeBought && (canAfford || alreadyOwned);
}

// Check if any new upgrades should be unlocked
function checkNewUnlockedUpgrades() {
    let needsRender = false;
    
    upgrades.forEach((upgrade, index) => {
        if (!isUpgradeUnlocked(index)) return;
        
        // Check if this upgrade is currently in the DOM
        const isCurrentlyVisible = Array.from(upgradesContainer.querySelectorAll('.upgrade-name')).some(
            el => el.textContent === upgrade.name
        );
        
        if (!isCurrentlyVisible) {
            needsRender = true;
        }
    });
    
    if (needsRender) {
        renderUpgrades();
    }
}

// Update only the button states without re-rendering
function updateUpgradeButtons() {
    checkNewUnlockedUpgrades();
    
    const buttons = upgradesContainer.querySelectorAll('.upgrade');
    
    let buttonIndex = 0;
    upgrades.forEach((upgrade, index) => {
        if (!isUpgradeUnlocked(index)) {
            return;
        }
        
        const cost = getUpgradeCost(upgrade);
        const canAfford = score >= cost;
        const button = buttons[buttonIndex]?.querySelector('.upgrade-button');
        const countEl = buttons[buttonIndex]?.querySelector('.upgrade-count');
        
        if (button) {
            button.disabled = !canAfford;
            button.textContent = `${cost} 💰`;
        }
        
        if (countEl) {
            countEl.textContent = upgrade.count;
        }
        
        buttonIndex++;
    });
}

// Update only the multiplier button states without re-rendering
function updateMultiplierButtons() {
    // Check if any new multipliers should be shown
    let needsRender = false;
    multipliers.forEach(multiplier => {
        const upgrade = upgrades.find(u => u.id === multiplier.upgradeId);
        if (upgrade && upgrade.count > 0) {
            const isCurrentlyVisible = Array.from(multipliersContainer.querySelectorAll('.upgrade-name')).some(
                el => el.textContent === multiplier.name
            );
            if (!isCurrentlyVisible) {
                needsRender = true;
            }
        }
    });
    if (needsRender) {
        renderMultipliers();
    }
    
    const buttons = multipliersContainer.querySelectorAll('.upgrade');
    
    let buttonIndex = 0;
    multipliers.forEach(multiplier => {
        const upgrade = upgrades.find(u => u.id === multiplier.upgradeId);
        if (!upgrade || upgrade.count === 0) {
            return;
        }
        
        const cost = getMultiplierCost(multiplier);
        const canAfford = score >= cost;
        const button = buttons[buttonIndex]?.querySelector('.upgrade-button');
        const countEl = buttons[buttonIndex]?.querySelector('.multiplier-count');
        
        if (button) {
            button.disabled = !canAfford;
            button.textContent = `${cost} 💰`;
        }
        
        if (countEl) {
            countEl.textContent = multiplier.count;
        }
        
        buttonIndex++;
    });
}

// Passive income loop
setInterval(() => {
    if (passiveIncome > 0) {
        score += passiveIncome / 10;
        updateDisplay();
    }
}, 100);

// Initialize
renderUpgrades();
renderMultipliers();
