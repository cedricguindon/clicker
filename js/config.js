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
        id: 'regular_turret',
        name: 'Regular Turret',
        baseCost: 10,
        baseProduction: 0.1,
        count: 0,
        multiplier: 1.15,
        productionMultiplier: 1
    },
    {
        id: 'energy_laser',
        name: 'Energy Laser',
        baseCost: 100,
        baseProduction: 1,
        count: 0,
        multiplier: 1.15,
        productionMultiplier: 1
    },
    {
        id: 'mortar',
        name: 'Mortar',
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
        upgradeId: 'regular_turret',
        name: 'Regular Turret Multiplier',
        baseCost: 50,
        multiplier: 1.25,
        count: 0
    },
    {
        upgradeId: 'energy_laser',
        name: 'Energy Laser Multiplier',
        baseCost: 500,
        multiplier: 1.25,
        count: 0
    },
    {
        upgradeId: 'mortar',
        name: 'Mortar Multiplier',
        baseCost: 5000,
        multiplier: 1.25,
        count: 0
    }
];