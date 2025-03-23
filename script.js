const grid = document.getElementById("gameGrid");
const coefEl = document.getElementById("coef");
const statusEl = document.getElementById("status");
const sizeButtons = document.querySelectorAll(".field-selector button");
const startBtn = document.getElementById("startBtn");

let cols = 3;
let rows = 4;
let field = [];
let currentStep = 0;
let maxSteps = 0;

const coefficientsMap = {
  small: ["1.45x", "1.88x", "2.46x", "3.29x"],
  medium: ["1.29x", "1.72x", "2.29x", "3.06x", "4.08x", "5.45x", "7.26x"],
  large: [
    "1.21x",
    "1.43x",
    "1.72x",
    "2.09x",
    "2.53x",
    "3.06x",
    "3.70x",
    "4.48x",
    "5.45x",
    "6.67x",
  ],
};

function setupSizeButtons() {
  sizeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      sizeButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const size = btn.dataset.size;
      if (size === "small") {
        cols = 3;
        rows = 4;
      } else if (size === "medium") {
        cols = 4;
        rows = 7;
      } else if (size === "large") {
        cols = 5;
        rows = 10;
      }

      coefEl.textContent = coefficientsMap[size][0];
      generateField();
    });
  });
}

function generateField() {
  currentStep = 0;
  grid.classList.remove("grid-lost");
  grid.innerHTML = "";
  statusEl.textContent = "";

  grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  grid.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

  const activeSize = document.querySelector(".field-selector .active").dataset
    .size;
  field = [];

  for (let row = 0; row < rows; row++) {
    field[row] = [];
    const bombCol = Math.floor(Math.random() * cols);
    for (let col = 0; col < cols; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      if (activeSize === "medium") cell.classList.add("square");

      cell.dataset.row = row;
      cell.dataset.col = col;

      field[row][col] = {
        type: col === bombCol ? "bomb" : "safe",
        element: cell,
      };

      grid.appendChild(cell);
    }
  }
}

function getRandomMaxSteps(size) {
  const rand = Math.random() * 100;
  if (size === "small") {
    return rand < 65 ? getRandomBetween(1, 2) : getRandomBetween(3, 4);
  } else if (size === "medium") {
    if (rand < 60) return getRandomBetween(1, 3);
    if (rand < 80) return getRandomBetween(4, 5);
    if (rand < 90) return 6;
    return 7;
  } else if (size === "large") {
    if (rand < 50) return getRandomBetween(1, 3);
    if (rand < 80) return getRandomBetween(4, 5);
    if (rand < 100) return getRandomBetween(6, 7);
    return getRandomBetween(8, 10);
  }
  return 3;
}

function getRandomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function autoPlay() {
  const activeSize = document.querySelector(".field-selector .active").dataset
    .size;
  coefEl.textContent = coefficientsMap[activeSize][0];
  maxSteps = getRandomMaxSteps(activeSize);
  currentStep = 0;

  function playNextStep() {
    if (currentStep >= maxSteps || currentStep >= rows) return;

    // Очистка прошлых active-row
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        field[r][c].element.classList.remove("active-row");
      }
    }

    // Выбираем один случайный столбец для текущей строки
    const ballCol = Math.floor(Math.random() * cols);

    for (let i = 0; i < cols; i++) {
      const cell = field[currentStep][i];
      if (i === ballCol) {
        cell.element.classList.add("ball");
      }
      // Подсветка только текущего ряда
      cell.element.classList.add("active-row");
    }

    coefEl.textContent =
      coefficientsMap[activeSize][currentStep] ||
      coefficientsMap[activeSize].at(-1);

    currentStep++;
    if (currentStep < maxSteps && currentStep < rows) {
      setTimeout(playNextStep, 1500);
    }
  }

  playNextStep();
}

startBtn.addEventListener("click", () => {
  generateField();
  autoPlay();
});

setupSizeButtons();
generateField();
