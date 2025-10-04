const DICE_COUNT = 4;
const DICE_SYMBOLS = {
  '-1': '<svg viewBox="0 0 100 100" class="fate-icon minus"><line x1="20" y1="50" x2="80" y2="50" stroke="currentColor" stroke-width="15" stroke-linecap="square"/></svg>',
  '0': '&nbsp;',
  '1': '<svg viewBox="0 0 100 100" class="fate-icon plus"><line x1="20" y1="50" x2="80" y2="50" stroke="currentColor" stroke-width="15" stroke-linecap="square"/><line x1="50" y1="20" x2="50" y2="80" stroke="currentColor" stroke-width="15" stroke-linecap="square"/></svg>',
  'EMPTY': '&nbsp;'
};

const diceContainer = document.querySelector('.dice-container');
const diceElements = document.querySelectorAll('.die');
const rollButton = document.getElementById('roll-button');

const STORAGE_KEY = 'fateDiceResult';

function getInitialResults() {
  const storedRoll = sessionStorage.getItem(STORAGE_KEY);

  if (storedRoll) {
    try {
      return JSON.parse(storedRoll);
    } catch (e) {
      console.error("Fail to parse saved results:", e);
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }

  return Array(DICE_COUNT).fill(null);
}

function rollSingleFateDie() {
  return Math.floor(Math.random() * 3) - 1;
}

function rollDice() {
  const results = [];

  for (let i = 0; i < DICE_COUNT; i++) {
    results.push(rollSingleFateDie());
  }

  return results;
}

function updateDiceDisplay(results) {
  const total = results.reduce((acc, val) => acc + (val || 0), 0);

  diceElements.forEach((die, index) => {
    const value = results[index];

    let symbolHTML = '';

    if (value === null) {
      symbolHTML = DICE_SYMBOLS.EMPTY;
      die.classList.remove('rolled');
    } else {
      symbolHTML = DICE_SYMBOLS[value.toString()];
      die.classList.add('rolled');
    }

    die.innerHTML = symbolHTML;
  });

  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(results));

  const ariaSymbols = { '-1': '-', '0': 'blank', '1': '+' };
  const resultText = results.map(value => value !== null ? ariaSymbols[value.toString()] : '?').join(', ');

  diceContainer.setAttribute('aria-label', `Dice roll result: ${resultText}. Total score: ${total}.`);
}

const initApp = () => updateDiceDisplay(getInitialResults());

rollButton.addEventListener('click', () => updateDiceDisplay(rollDice()));

initApp();