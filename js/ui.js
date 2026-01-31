// UI functions
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

function updateDisplay() {
    scoreEl.textContent = Math.floor(score);
    perSecondEl.textContent = passiveIncome.toFixed(1);
    updateUpgradeButtons();
    updateMultiplierButtons();
}

function isUpgradeUnlocked(index) {
    if (index === 0) return true; // First upgrade always unlocked
    
    const previousUpgradeBought = upgrades[index - 1].count > 0;
    const cost = getUpgradeCost(upgrades[index]);
    const canAfford = score >= cost;
    const alreadyOwned = upgrades[index].count > 0;
    
    return previousUpgradeBought && (canAfford || alreadyOwned);
}

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