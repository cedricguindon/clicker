// Game state
let score = 0;
let clickPower = 1;
let passiveIncome = 0;
let currentAsteroid = null;

// DOM elements
const scoreEl = document.getElementById('score');
const perSecondEl = document.getElementById('perSecond');
const clickButton = document.getElementById('clickButton');
const upgradesContainer = document.getElementById('upgradesContainer');
const multipliersContainer = document.getElementById('multipliersContainer');

// Click handler
clickButton.addEventListener('click', (e) => {
    if (currentAsteroid) {
        currentAsteroid.health -= clickPower;
        currentAsteroid.health = Math.floor(currentAsteroid.health);
        score += clickPower; // still add score per click
        if (currentAsteroid.health <= 0) {
            // perhaps bonus score
            spawnNewAsteroid();
        }
        updateDisplay();
        updateAsteroidDisplay();
        createClickEffect(e);
    }
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

// Passive income loop
setInterval(() => {
    if (passiveIncome > 0) {
        let damage = passiveIncome / 10;
        score += damage;
        if (currentAsteroid) {
            currentAsteroid.health -= damage;
            currentAsteroid.health = Math.floor(currentAsteroid.health * 100) / 100;
            if (currentAsteroid.health <= 0) {
                spawnNewAsteroid();
            }
            updateAsteroidDisplay();
        }
        updateDisplay();
    }
}, 100);