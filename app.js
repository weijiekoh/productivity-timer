// State
let isRunning = false;
let isWorkPhase = true;
let timeRemaining = 25 * 60; // in seconds
let timerInterval = null;

// DOM elements
const timerDisplay = document.getElementById('timerDisplay');
const phaseIndicator = document.getElementById('phaseIndicator');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const workMinutesInput = document.getElementById('workMinutes');
const restMinutesInput = document.getElementById('restMinutes');

// Format seconds to MM:SS
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Update display
function updateDisplay() {
    timerDisplay.textContent = formatTime(timeRemaining);
    phaseIndicator.textContent = isWorkPhase ? 'Work' : 'Rest';
    phaseIndicator.className = 'phase-indicator ' + (isWorkPhase ? 'work' : 'rest');
}

// Switch phases
function switchPhase() {
    if (isWorkPhase) {
        playWorkEndSound();
        isWorkPhase = false;
        timeRemaining = parseInt(restMinutesInput.value) * 60;
    } else {
        playRestEndSound();
        isWorkPhase = true;
        timeRemaining = parseInt(workMinutesInput.value) * 60;
    }
    updateDisplay();
}

// Timer tick
function tick() {
    if (timeRemaining > 0) {
        timeRemaining--;
        updateDisplay();
    } else {
        switchPhase();
    }
}

// Start/Pause toggle
function toggleTimer() {
    initAudio();

    if (isRunning) {
        clearInterval(timerInterval);
        timerInterval = null;
        startBtn.textContent = 'Start';
        startBtn.classList.remove('running');
    } else {
        timerInterval = setInterval(tick, 1000);
        startBtn.textContent = 'Pause';
        startBtn.classList.add('running');
    }
    isRunning = !isRunning;
}

// Reset timer
function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    isRunning = false;
    isWorkPhase = true;
    timeRemaining = parseInt(workMinutesInput.value) * 60;
    startBtn.textContent = 'Start';
    startBtn.classList.remove('running');
    updateDisplay();
}

// Handle input changes
function handleInputChange() {
    if (!isRunning) {
        if (isWorkPhase) {
            timeRemaining = parseInt(workMinutesInput.value) * 60;
        } else {
            timeRemaining = parseInt(restMinutesInput.value) * 60;
        }
        updateDisplay();
    }
}

// Event listeners
startBtn.addEventListener('click', toggleTimer);
resetBtn.addEventListener('click', resetTimer);
workMinutesInput.addEventListener('change', handleInputChange);
restMinutesInput.addEventListener('change', handleInputChange);

// Initial display
updateDisplay();
