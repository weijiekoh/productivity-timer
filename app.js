// Durations in minutes. Override via URL query, e.g. ?work=50&rest=10
const DEFAULT_WORK_MINUTES = 25;
const DEFAULT_REST_MINUTES = 5;
const MAX_MINUTES = 999;

// Read a duration in minutes from the URL; fall back to the default if invalid
function getMinutesParam(name, fallback) {
    const value = Number(new URLSearchParams(window.location.search).get(name));
    return Number.isFinite(value) && value > 0 && value <= MAX_MINUTES ? value : fallback;
}

const workSeconds = Math.round(getMinutesParam('work', DEFAULT_WORK_MINUTES) * 60);
const restSeconds = Math.round(getMinutesParam('rest', DEFAULT_REST_MINUTES) * 60);

// State
let isRunning = false;
let isWorkPhase = true;
let timeRemaining = workSeconds;
let timerInterval = null;
let wakeLock = null;

// DOM elements
const timerDisplay = document.getElementById('timerDisplay');
const phaseIndicator = document.getElementById('phaseIndicator');
const startBtn = document.getElementById('startBtn');

// Settings no longer persist; remove values saved by older versions
function clearLegacyStorage() {
    localStorage.removeItem('workMinutes');
    localStorage.removeItem('restMinutes');
    localStorage.removeItem('sessionCount');
}

// Request notification permission
function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

// Request wake lock to keep screen on
async function requestWakeLock() {
    if ('wakeLock' in navigator) {
        try {
            wakeLock = await navigator.wakeLock.request('screen');
        } catch (e) {
            // Wake lock request failed (e.g., low battery)
        }
    }
}

// Release wake lock
function releaseWakeLock() {
    if (wakeLock) {
        wakeLock.release();
        wakeLock = null;
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

    // Update tab title
    document.title = `${timeStr} - ${phaseStr}`;

    // Hide UI during work phase
    if (isWorkPhase && isRunning) {
        document.body.classList.add('working');
    } else {
        document.body.classList.remove('working');
    }
}

// Phase ended - stop timer and prepare next phase
function phaseEnded() {
    clearInterval(timerInterval);
    timerInterval = null;
    isRunning = false;
    startBtn.textContent = 'Start';
    startBtn.classList.remove('running');
    releaseWakeLock();

    if (isWorkPhase) {
        // Work phase ended
        playWorkEndSound();
        showNotification('Work Complete!', 'Time for a break.');
        isWorkPhase = false;
        timeRemaining = restSeconds;
        showRandomQuote();
    } else {
        // Rest phase ended
        playRestEndSound();
        showNotification('Break Over!', 'Ready to work?');
        isWorkPhase = true;
        timeRemaining = workSeconds;
    }

    updateDisplay();
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
        releaseWakeLock();
    } else {
        timerInterval = setInterval(tick, 1000);
        startBtn.textContent = 'Pause';
        startBtn.classList.add('running');
        requestWakeLock();
    }
    isRunning = !isRunning;
    updateDisplay();
}

// Keyboard shortcuts
function handleKeydown(e) {
    if (e.code === 'Space') {
        e.preventDefault();
        toggleTimer();
    }
}

// Event listeners
startBtn.addEventListener('click', toggleTimer);
document.addEventListener('keydown', handleKeydown);

// Warn before closing page while timer is running
window.addEventListener('beforeunload', (e) => {
    if (isRunning) {
        e.preventDefault();
    }
});

// Initialize
clearLegacyStorage();
updateDisplay();
