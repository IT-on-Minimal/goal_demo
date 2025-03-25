const grid = document.getElementById("gameGrid");
const coefEl = document.getElementById("coef");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const playBtn = document.getElementById("playBtn");

const rows = 4;
const cols = 7;
let field = [];
let currentStep = 0;
let totalSteps = 0;
let isFinished = false;
let path = [];

const coefficients = [
  "1.21x",
  "1.43x",
  "1.72x",
  "2.09x",
  "2.53x",
  "3.06x",
  "3.70x",
];

function generateField() {
  grid.innerHTML = "";
  field = [];

  for (let row = 0; row < rows; row++) {
    field[row] = [];
    for (let col = 0; col < cols; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = row;
      cell.dataset.col = col;
      grid.appendChild(cell);
      field[row][col] = cell;
    }
  }
}

function getRandomSteps() {
  const chance = Math.random() * 100;
  if (chance < 52) return 3;
  if (chance < 82) return 4;
  if (chance < 92) return 5;
  if (chance < 97) return 6;
  return 7;
}

function nextSignal() {
  if (isFinished) return;

  if (currentStep === 0) {
    totalSteps = getRandomSteps();
    path = [];
  }

  if (currentStep < totalSteps) {
    const col = currentStep;
    const row = Math.floor(Math.random() * rows);
    path.push({ row, col });

    updateGrid();
    coefEl.textContent =
      "Коэффициент: " + (coefficients[currentStep] || coefficients.at(-1));
    currentStep++;
  } else {
    isFinished = true;
    startBtn.innerHTML = "Сигнал завершён";

    // Меняем стили кнопок
    startBtn.classList.add("btn-finished");
    resetBtn.classList.add("btn-finished");
  }
}

function updateGrid() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      field[r][c].classList.remove("ball", "trail", "active-col");
    }
  }

  path.forEach((step, index) => {
    const cell = field[step.row][step.col];
    if (index === path.length - 1) {
      cell.classList.add("ball");
      for (let r = 0; r < rows; r++) {
        field[r][step.col].classList.add("active-col");
      }
    } else {
      cell.classList.add("trail");
    }
  });
}

function resetGame() {
  currentStep = 0;
  isFinished = false;
  path = [];

  startBtn.innerHTML = '<span class="icon">▶</span> Получить сигнал';
  startBtn.classList.remove("btn-finished");
  resetBtn.classList.remove("btn-finished");

  generateField();
  coefEl.textContent = "Коэффициент: " + coefficients[0];
}

startBtn.addEventListener("click", () => {
  if (isFinished) {
    resetGame();
  } else {
    nextSignal();
  }
});

resetBtn.addEventListener("click", resetGame);
playBtn.addEventListener("click", () => {
  window.location.href = "https://example.com"; // твоя ссылка
});

generateField();
coefEl.textContent = "Коэффициент: " + coefficients[0];
