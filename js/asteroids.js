// Asteroid functions
function spawnNewAsteroid() {
    let rand = Math.random() * 100;
    let cumulative = 0;
    for (let type of asteroidTypes) {
        cumulative += type.appearancePercent;
        if (rand < cumulative) {
            currentAsteroid = { ...type, health: type.maxHealth };
            break;
        }
    }
}

function updateAsteroidDisplay() {
    if (currentAsteroid) {
        document.getElementById('asteroidName').textContent = currentAsteroid.name;
        document.getElementById('asteroidHealth').textContent = `Health: ${Math.max(0, currentAsteroid.health)}/${currentAsteroid.maxHealth}`;
    }
}