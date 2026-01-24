// State
let isRunning = false;
let isWorkPhase = true;
let timeRemaining = 25 * 60; // in seconds
let timerInterval = null;
let sessionCount = 0;

// DOM elements
const timerDisplay = document.getElementById('timerDisplay');
const phaseIndicator = document.getElementById('phaseIndicator');
const startBtn = document.getElementById('startBtn');
const workMinutesInput = document.getElementById('workMinutes');
const restMinutesInput = document.getElementById('restMinutes');
const sessionCounter = document.getElementById('sessionCounter');

// Load settings from localStorage
function loadSettings() {
    const savedWorkMinutes = localStorage.getItem('workMinutes');
    const savedRestMinutes = localStorage.getItem('restMinutes');
    const savedSessionCount = localStorage.getItem('sessionCount');

    if (savedWorkMinutes) {
        workMinutesInput.value = savedWorkMinutes;
    }
    if (savedRestMinutes) {
        restMinutesInput.value = savedRestMinutes;
    }
    if (savedSessionCount) {
        sessionCount = parseInt(savedSessionCount);
    }

    timeRemaining = parseInt(workMinutesInput.value) * 60;
}

// Save settings to localStorage
function saveSettings() {
    localStorage.setItem('workMinutes', workMinutesInput.value);
    localStorage.setItem('restMinutes', restMinutesInput.value);
    localStorage.setItem('sessionCount', sessionCount);
}

// Request notification permission
function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

// Show browser notification
function showNotification(title, body) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, { body });
    }
}

// Format seconds to MM:SS
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Update display
function updateDisplay() {
    const timeStr = formatTime(timeRemaining);
    const phaseStr = isWorkPhase ? 'Work' : 'Rest';

    timerDisplay.textContent = timeStr;
    phaseIndicator.textContent = phaseStr;
    phaseIndicator.className = 'phase-indicator ' + (isWorkPhase ? 'work' : 'rest');
    sessionCounter.textContent = `Sessions: ${sessionCount}`;

    // Update tab title
    document.title = `${timeStr} - ${phaseStr}`;

    // Hide UI during work phase
    if (isWorkPhase && isRunning) {
        document.body.classList.add('working');
    } else {
        document.body.classList.remove('working');
    }
    updateMinusButtons();
}

// Phase ended - stop timer and prepare next phase
function phaseEnded() {
    clearInterval(timerInterval);
    timerInterval = null;
    isRunning = false;
    startBtn.textContent = 'Start';
    startBtn.classList.remove('running');

    if (isWorkPhase) {
        // Work phase ended
        playWorkEndSound();
        showNotification('Work Complete!', 'Time for a break.');
        sessionCount++;
        saveSettings();
        isWorkPhase = false;
        timeRemaining = parseInt(restMinutesInput.value) * 60;
    } else {
        // Rest phase ended
        playRestEndSound();
        showNotification('Break Over!', 'Ready to work?');
        isWorkPhase = true;
        timeRemaining = parseInt(workMinutesInput.value) * 60;
    }

    updateDisplay();
    showRandomQuote();
}

// Timer tick
function tick() {
    if (timeRemaining > 0) {
        timeRemaining--;
        updateDisplay();
    } else {
        phaseEnded();
    }
}

// Start/Pause toggle
function toggleTimer() {
    initAudio();
    requestNotificationPermission();

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
    updateDisplay();
}

// Handle input changes
function handleInputChange() {
    saveSettings();
    if (!isRunning) {
        if (isWorkPhase) {
            timeRemaining = parseInt(workMinutesInput.value) * 60;
        } else {
            timeRemaining = parseInt(restMinutesInput.value) * 60;
        }
        updateDisplay();
    }
    updateMinusButtons();
}

// Adjust time to multiples of 5 (for mobile +/- buttons)
function adjustTime(type, delta) {
    const input = type === 'work' ? workMinutesInput : restMinutesInput;
    const current = parseInt(input.value);
    let newValue;

    if (delta > 0) {
        // Round up to next multiple of 5
        newValue = Math.ceil((current + 1) / 5) * 5;
    } else {
        // Round down to previous multiple of 5
        newValue = Math.floor((current - 1) / 5) * 5;
    }

    newValue = Math.max(0, Math.min(99, newValue));
    input.value = newValue;
    handleInputChange();
    updateMinusButtons();
}

// Update visibility of minus buttons based on input values
function updateMinusButtons() {
    const workMinus = document.getElementById('workMinus');
    const restMinus = document.getElementById('restMinus');
    const isWorking = isWorkPhase && isRunning;

    if (workMinus) {
        workMinus.style.visibility = (isWorking || parseInt(workMinutesInput.value) === 0) ? 'hidden' : '';
    }
    if (restMinus) {
        restMinus.style.visibility = (isWorking || parseInt(restMinutesInput.value) === 0) ? 'hidden' : '';
    }
}

// Keyboard shortcuts
function handleKeydown(e) {
    // Ignore if typing in input fields
    if (e.target.tagName === 'INPUT') return;

    if (e.code === 'Space') {
        e.preventDefault();
        toggleTimer();
    }
}

// Event listeners
startBtn.addEventListener('click', toggleTimer);
workMinutesInput.addEventListener('change', handleInputChange);
restMinutesInput.addEventListener('change', handleInputChange);
document.addEventListener('keydown', handleKeydown);

// Initialize
loadSettings();
updateDisplay();
updateMinusButtons();
