let focusTime = 25 * 60;
let breakTime = 5 * 60;
const LONG_BREAK_TIME = 15 * 60;

let currentTime = focusTime;
let isFocus = true;
let timer = null;

let sessionCount = Number(localStorage.getItem("sessionCount")) || 0;

const focusInput = document.getElementById("focusInput");
const breakInput = document.getElementById("breakInput");
const alertSound = document.getElementById("alertSound");

function startTimer() {
  if (timer) return;

  focusTime = parseInt(focusInput.value) * 60;
  breakTime = parseInt(breakInput.value) * 60;

  if (currentTime <= 0) {
    currentTime = isFocus ? focusTime : breakTime;
  }

  updateDisplay();

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
  focusTime = parseInt(focusInput.value) * 60;
  breakTime = parseInt(breakInput.value) * 60;
  currentTime = isFocus ? focusTime : breakTime;
  updateDisplay();
  updateSessionInfo();
}

function resetAll() {
  sessionCount = 0;
  localStorage.setItem("sessionCount", 0);
  resetTimer();
  updateSessionInfo();
}

function completeSession() {
  alertSound.play();
showQuote();  // Show motivational quote popup
  if (isFocus) {
    sessionCount++;
    localStorage.setItem("sessionCount", sessionCount);
  }

  isFocus = !isFocus;

  if (!isFocus) {
    currentTime = (sessionCount % 4 === 0) ? LONG_BREAK_TIME : breakTime;
  } else {
    currentTime = focusTime;
  }

  updateDisplay();
  updateSessionInfo();
  startTimer(); // auto start next
}

function updateDisplay() {
  const minutes = Math.floor(currentTime / 60).toString().padStart(2, '0');
  const seconds = (currentTime % 60).toString().padStart(2, '0');
  document.getElementById("timerDisplay").textContent = `${minutes}:${seconds}`;
}

function updateSessionInfo() {
  document.getElementById("sessionInfo").textContent =
    `Completed Focus Sessions: ${sessionCount}`;
}
const quotes = [
  "Stay focused and never give up.",
  "Your only limit is your mind.",
  "Small steps every day lead to big results.",
  "Discipline is the bridge between goals and success.",
  "Push yourself because no one else is going to do it for you.",
  "Productivity is never an accident. It’s always the result of commitment.",
  "Consistency is more important than intensity.",
  "Make each day your masterpiece."
];

let quoteTimeout; // for clearing auto-close

function showQuote() {
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  const popup = document.getElementById("quotePopup");
  document.getElementById("quoteText").textContent = `"${randomQuote}"`;
  popup.classList.remove("hidden");

  // Auto close after 5 seconds
  clearTimeout(quoteTimeout);
  quoteTimeout = setTimeout(() => {
    closeQuote();
  }, 5000);
}

function closeQuote() {
  document.getElementById("quotePopup").classList.add("hidden");
}

// Init
resetTimer();
updateSessionInfo();

const darkToggle = document.getElementById("darkModeToggle");

darkToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark", darkToggle.checked);
  localStorage.setItem("darkMode", darkToggle.checked);
});

// Load dark mode if previously enabled
if (localStorage.getItem("darkMode") === "true") {
  darkToggle.checked = true;
  document.body.classList.add("dark");
}
