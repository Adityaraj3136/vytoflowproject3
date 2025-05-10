const alertSound = document.getElementById('alertSound');
const timerEl = document.getElementById('timer');
const startBtn = document.getElementById('start');
const pauseBtn = document.getElementById('pause');
const resetBtn = document.getElementById('reset');
const statusEl = document.getElementById('status');
const quoteBox = document.getElementById('quoteBox');
const historyList = document.getElementById('historyList');

const focusTime = 25 * 60; // 25 minutes
const breakTime = 5 * 60;  // 5 minutes
let currentTime = focusTime;
let isFocus = true;
let timer = null;

const quotes = [
  "Stay focused. One task at a time.",
  "Small steps lead to big results.",
  "Discipline is doing it even when you don't feel like it.",
  "You’re closer than you think.",
  "Focus is the key to success."
];

function updateDisplay() {
  const minutes = Math.floor(currentTime / 60).toString().padStart(2, '0');
  const seconds = (currentTime % 60).toString().padStart(2, '0');
  timerEl.textContent = `${minutes}:${seconds}`;
}

function startTimer() {
  if (timer) return;

  timer = setInterval(() => {
    if (currentTime > 0) {
      currentTime--;
      updateDisplay();
    } else {
      clearInterval(timer);
      timer = null;
      completeSession();
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timer);
  timer = null;
}

function resetTimer() {
  pauseTimer();
  currentTime = isFocus ? focusTime : breakTime;
  updateDisplay();
}

function completeSession() {
  alertSound.play();
  const mode = isFocus ? 'Focus' : 'Break';
  const timestamp = new Date().toLocaleTimeString();
  saveToHistory(`${mode} session completed at ${timestamp}`);

  quoteBox.textContent = quotes[Math.floor(Math.random() * quotes.length)];

  isFocus = !isFocus;
  statusEl.textContent = `Session: ${isFocus ? 'Focus' : 'Break'}`;
  currentTime = isFocus ? focusTime : breakTime;
  updateDisplay();
}

function saveToHistory(entry) {
  let history = JSON.parse(localStorage.getItem('pomodoroHistory')) || [];
  history.unshift(entry);
  if (history.length > 10) history.pop(); // Keep only last 10 sessions
  localStorage.setItem('pomodoroHistory', JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  let history = JSON.parse(localStorage.getItem('pomodoroHistory')) || [];
  historyList.innerHTML = '';
  history.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    historyList.appendChild(li);
  });
}

// Initialize
updateDisplay();
renderHistory();

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);
