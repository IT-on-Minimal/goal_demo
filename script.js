const grid = document.getElementById("gameGrid");
const coefEl = document.getElementById("coef");
const statusEl = document.getElementById("status");
const sizeButtons = document.querySelectorAll(".field-selector button");
const startBtn = document.getElementById("startBtn");

let cols = 3;
let rows = 4;
let currentStep = 0;
let isGameOver = false;
let field = [];

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
  isGameOver = false;
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

function activateFirstRow() {
  const activeSize = document.querySelector(".field-selector .active").dataset
    .size;
  coefEl.textContent = coefficientsMap[activeSize][0];

  for (let i = 0; i < cols; i++) {
    const cell = field[0][i].element;
    cell.classList.add("active-row");
    cell.addEventListener("click", handleClick);
  }
}

function handleClick(e) {
  if (isGameOver) return;

  const cell = e.target;
  const row = parseInt(cell.dataset.row);
  const col = parseInt(cell.dataset.col);
  const cellData = field[row][col];
  if (row !== currentStep) return;

  if (cellData.type === "bomb") {
    cell.classList.add("boom");
    grid.classList.add("grid-lost");
    showAllBombs();
    isGameOver = true;
    return;
  }

  cell.classList.add("ball");
  for (let i = 0; i < cols; i++) {
    if (field[row][i].type === "bomb") {
      field[row][i].element.classList.add("bomb");
    }
  }

  currentStep++;
  const activeSize = document.querySelector(".field-selector .active").dataset
    .size;

  if (currentStep >= rows) {
    isGameOver = true;
    return;
  }

  coefEl.textContent = coefficientsMap[activeSize][currentStep];

  for (let i = 0; i < cols; i++) {
    const nextCell = field[currentStep][i].element;
    nextCell.classList.add("active-row");
    nextCell.addEventListener("click", handleClick);
  }
}

function showAllBombs() {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cellData = field[row][col];
      if (cellData.type === "bomb") {
        cellData.element.classList.add("bomb");
      }
    }
  }
}

startBtn.addEventListener("click", () => {
  generateField();
  activateFirstRow();
});

setupSizeButtons();
generateField();
