// Asteroid types
const asteroidTypes = [
    {
        id: 'baby_asteroid',
        name: 'Baby Asteroid',
        maxHealth: 10,
        appearancePercent: 60
    },
    {
        id: 'small_asteroid',
        name: 'Small Asteroid',
        maxHealth: 50,
        appearancePercent: 30
    },
    {
        id: 'medium_asteroid',
        name: 'Medium Asteroid',
        maxHealth: 100,
        appearancePercent: 10
    }
];

// Upgrades data
const upgrades = [
    {
        id: 'powerup',
        name: 'Click Power',
        baseCost: 10,
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