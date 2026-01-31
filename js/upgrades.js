// Upgrade functions
function getUpgradeCost(upgrade) {
    return Math.floor(upgrade.baseCost * Math.pow(upgrade.multiplier, upgrade.count));
}

function getMultiplierCost(multiplier) {
    return Math.floor(multiplier.baseCost * Math.pow(multiplier.multiplier, multiplier.count));
}

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

function getUpgradeEfficiency(upgrade) {
    const production = upgrade.clickBonus || upgrade.baseProduction;
    const cost = getUpgradeCost(upgrade);
    return production / cost;
}

function getUpgradeProduction(upgrade) {
    if (upgrade.clickBonus) {
        return `+${upgrade.clickBonus * upgrade.productionMultiplier} per click`;
    } else {
        return `+${(upgrade.baseProduction * upgrade.productionMultiplier).toFixed(1)}/sec`;
    }
}

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