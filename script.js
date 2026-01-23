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
        multiplier: 1.2
    },
    {
        id: 'cursor',
        name: 'Auto Clicker',
        baseCost: 10,
        baseProduction: 0.1,
        count: 0,
        multiplier: 1.15
    },
    {
        id: 'worker',
        name: 'Worker',
        baseCost: 100,
        baseProduction: 1,
        count: 0,
        multiplier: 1.15
    },
    {
        id: 'factory',
        name: 'Factory',
        baseCost: 1000,
        baseProduction: 10,
        count: 0,
        multiplier: 1.15
    }
];

// DOM elements
const scoreEl = document.getElementById('score');
const perSecondEl = document.getElementById('perSecond');
const clickButton = document.getElementById('clickButton');
const upgradesContainer = document.getElementById('upgradesContainer');
const tsEl = document.getElementById('ts');

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

// Calculate upgrade efficiency (production per cost)
function getUpgradeEfficiency(upgrade) {
    const production = upgrade.clickBonus || upgrade.baseProduction;
    const cost = getUpgradeCost(upgrade);
    return production / cost;
}

// Get production per second for an upgrade
function getUpgradeProduction(upgrade) {
    if (upgrade.clickBonus) {
        return `+${upgrade.clickBonus} per click`;
    } else {
        return `+${upgrade.baseProduction}/sec`;
    }
}

// Buy upgrade
function buyUpgrade(upgrade) {
    const cost = getUpgradeCost(upgrade);
    
    if (score >= cost) {
        score -= cost;
        upgrade.count++;
        
        if (upgrade.clickBonus) {
            clickPower += upgrade.clickBonus;
        } else {
            passiveIncome += upgrade.baseProduction;
        }
        
        updateDisplay();
        renderUpgrades();
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

// Update display
function updateDisplay() {
    scoreEl.textContent = Math.floor(score);
    perSecondEl.textContent = passiveIncome.toFixed(1);
    updateUpgradeButtons();
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

// Passive income loop
setInterval(() => {
    if (passiveIncome > 0) {
        score += passiveIncome / 10;
        updateDisplay();
    }
}, 100);

// Initialize
renderUpgrades();
