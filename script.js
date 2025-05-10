// Dark Mode Toggle
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

// Timer Logic
let timer;
let isRunning = false;
let remainingTime = 25 * 60; // Default 25 minutes (in seconds)
let sessionHistory = JSON.parse(localStorage.getItem("sessionHistory")) || [];

const timerDisplay = document.getElementById("time");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");

// Quote Logic
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

  // Play sound
  const quoteSound = new Audio('quote-sound.mp3');
  quoteSound.play();

  // Auto close after 5 seconds
  clearTimeout(quoteTimeout);
  quoteTimeout = setTimeout(() => {
    closeQuote();
  }, 5000);
}

function closeQuote() {
  document.getElementById("quotePopup").classList.add("hidden");
}

// Update Timer Display
function updateDisplay() {
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;
  timerDisplay.textContent = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Start Timer
startBtn.addEventListener("click", () => {
  if (!isRunning) {
    isRunning = true;
    startBtn.textContent = "Pause";
    pauseBtn.disabled = false;
    timer = setInterval(() => {
      remainingTime--;
      updateDisplay();
      if (remainingTime <= 0) {
        clearInterval(timer);
        isRunning = false;
        startBtn.textContent = "Start";
        showQuote();  // Show motivational quote
        saveSession(); // Save session history
      }
    }, 1000);
  } else {
    clearInterval(timer);
    isRunning = false;
    startBtn.textContent = "Start";
  }
});

// Pause Timer
pauseBtn.addEventListener("click", () => {
  clearInterval(timer);
  isRunning = false;
  startBtn.textContent = "Start";
});

// Reset Timer
resetBtn.addEventListener("click", () => {
  clearInterval(timer);
  isRunning = false;
  remainingTime = 25 * 60; // Reset to 25 minutes
  updateDisplay();
  startBtn.textContent = "Start";
});

// Save Session and Update Chart
function saveSession() {
  const sessionData = {
    time: 25 - (remainingTime / 60), // The focus time spent in minutes
    date: new Date().toLocaleString()
  };

  sessionHistory.push(sessionData);
  localStorage.setItem("sessionHistory", JSON.stringify(sessionHistory));
  updateSessionChart();
}

// Session History Chart
function updateSessionChart() {
  const sessionChartCtx = document.getElementById("sessionChart").getContext("2d");
  const sessionData = sessionHistory.map(session => session.time);
  const sessionDates = sessionHistory.map(session => session.date);

  new Chart(sessionChartCtx, {
    type: 'line',
    data: {
      labels: sessionDates,
      datasets: [{
        label: 'Focus Sessions',
        data: sessionData,
        borderColor: '#3498db',
        fill: false,
        tension: 0.1
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: {
          beginAtZero: true,
          ticks: { maxRotation: 90 }
        },
        y: {
          beginAtZero: true
        }
      },
    }
  });
}

// Initialize Chart on Page Load
window.onload = function () {
  updateSessionChart();
};
