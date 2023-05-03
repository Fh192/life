type Grid = number[][];

const populationElement = document.getElementById('population') as HTMLSpanElement;
const canvas = document.getElementById('life') as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const { width, height } = canvas;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

let speed = 100;
let color = '#fff';
const COL_SIZE = 5;
const COLUMNS = Math.floor(width / COL_SIZE);
const ROWS = Math.floor(height / COL_SIZE);

let isStarted = false;
let isMouseDown = false;
let animationId: number;
let grid: Grid = createGrid();

function createGrid(randomize = false): Grid {
  const newGrid: Grid = [];

  for (let row = 0; row < ROWS; row++) {
    newGrid[row] = [];

    for (let col = 0; col < COLUMNS; col++) {
      if (randomize) {
        newGrid[row][col] = Number(Math.random() > 0.5);
      } else {
        newGrid[row][col] = 0;
      }
    }
  }

  return newGrid;
}

function countNeighbors(row: number, col: number): number {
  let count = 0;

  for (let i = row - 1; i <= row + 1; i++) {
    for (let j = col - 1; j <= col + 1; j++) {
      if (i === row && j === col) continue;

      const neighborRow = i >= ROWS ? 0 : i < 0 ? ROWS - 1 : i;
      const neighborCol = j >= COLUMNS ? 0 : j < 0 ? COLUMNS - 1 : j;

      count += grid[neighborRow][neighborCol];
    }
  }

  return count;
}

function placeCol(row: number, col: number) {
  if (grid[row] === undefined || grid[row][col] === undefined) return;

  grid[row][col] = 1;

  ctx.fillStyle = color;
  ctx.fillRect(col * COL_SIZE, row * COL_SIZE, COL_SIZE - 1, COL_SIZE - 1);
}

function drawGrid() {
  ctx.clearRect(0, 0, width, height);

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLUMNS; col++) {
      if (grid[row][col] === 1) placeCol(row, col);
    }
  }
}

function checkRules(row: number, col: number): number {
  const neighbors = countNeighbors(row, col);
  const isDead = grid[row][col] === 1 && (neighbors < 2 || neighbors > 3);
  const isLive = grid[row][col] === 0 && neighbors === 3;

  return isDead ? 0 : isLive ? 1 : grid[row][col];
}

function life() {
  let population = 0;
  const newGrid: Grid = createGrid();

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLUMNS; col++) {
      newGrid[row][col] = checkRules(row, col);
      population += grid[row][col];
    }
  }

  grid = newGrid;
  drawGrid();

  populationElement.innerHTML = `Population: ${population}`;

  if (population === 0) clearInterval(animationId);
}

function getRowAndColByMousePosition(e: MouseEvent): [number, number] {
  const row = Math.floor(e.offsetY / COL_SIZE);
  const col = Math.floor(e.offsetX / COL_SIZE);

  return [row, col];
}

export function clearGrid() {
  grid = createGrid();
  drawGrid();
}

export function randomizeGrid() {
  grid = createGrid(true);
  drawGrid();
}

export function startLife() {
  animationId = setInterval(life, speed);
  isStarted = true;
}

export function stopLife() {
  clearInterval(animationId);
  isStarted = false;
}

export function setSpeed(newSpeed: number) {
  speed = newSpeed;

  stopLife();
  startLife();
}

export function setColor(newColor: string) {
  color = newColor;
  drawGrid();
}

export function handleClickOnStartButton() {
  if (isStarted) {
    stopLife();
  } else {
    startLife();
  }
}

canvas.addEventListener('mousedown', () => (isMouseDown = true));
canvas.addEventListener('mouseup', () => (isMouseDown = false));
canvas.addEventListener('mousemove', (e: MouseEvent) => {
  if (!isMouseDown) return;

  const [row, col] = getRowAndColByMousePosition(e);
  placeCol(row, col);
});
canvas.addEventListener('click', (e: MouseEvent) => {
  const [row, col] = getRowAndColByMousePosition(e);
  placeCol(row, col);
});
