import { handleClickOnStartButton, setSpeed, randomizeGrid, clearGrid, setColor } from './life';
import { throttle } from './utils/throttle';

export function setupControls() {
  const startButton = document.getElementById('start') as HTMLButtonElement;
  const randomizeButton = document.getElementById('randomize') as HTMLButtonElement;
  const clearButton = document.getElementById('clear') as HTMLButtonElement;
  const speedInput = document.getElementById('speed') as HTMLInputElement;
  const colorInput = document.getElementById('color') as HTMLInputElement;

  function handleSpeedInput(e: Event) {
    const target = e.target as HTMLInputElement;
    setSpeed(+target.value);
  }

  function handleColorInput(e: Event) {
    const target = e.target as HTMLInputElement;
    setColor(target.value);
  }

  startButton.addEventListener('click', handleClickOnStartButton);
  randomizeButton.addEventListener('click', randomizeGrid);
  clearButton.addEventListener('click', clearGrid);
  speedInput.addEventListener('input', throttle(handleSpeedInput, 100));
  colorInput.addEventListener('input', throttle(handleColorInput, 100));
}
