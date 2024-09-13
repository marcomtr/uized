// Timer Variables
let timerInterval; // Reference to the setInterval timer
let isPaused = true; // Indicates if the timer is paused
let minutesLeft, secondsLeft; // Time left for the current session

// Session Configurations
let sessionCount = parseInt(document.getElementById('sessionCount').value) || 4; // Number of sessions
let focusDuration = parseTime(document.getElementById('focusTime').value) || { minutes: 2, seconds: 0 }; // Duration of focus sessions
let breakDuration = parseTime(document.getElementById('breakTime').value) || { minutes: 1, seconds: 0 }; // Duration of break sessions

// Session Tracking
let currentSession = 0; // Index of the current session
let currentFocusSession = 0; // Count of completed focus sessions
let isFocusTime = true; // Indicates if the current session is a focus or break session
let isComplete = false; // Indicates if all sessions are complete

// DOM Elements
let resetButton = document.getElementById('resetTimer'); // Reset button DOM element
let skipButton = document.getElementById('next'); // Skip button DOM element
let prevButton = document.getElementById('prev'); // Previous button DOM element

// DOM Elements for Timer Display
const timerElement = document.querySelector('.js-time-left'); // Element displaying the remaining time

// DOM Elements for Timer Controls
const button = document.getElementById('toggleTimer'); // Main play/pause button
const playIcon = document.getElementById('toggleTimerPlay'); // Icon for play state
const pauseIcon = document.getElementById('toggleTimerPause'); // Icon for pause state

// DOM Elements for Session Configuration
const sessionInput = document.getElementById('sessionCount'); // Input field for session count
const focusTimeInput = document.getElementById('focusTime'); // Input field for focus duration
const breakTimeInput = document.getElementById('breakTime'); // Input field for break duration

// DOM Elements for Session Information
const nextDurationElement = document.getElementById('next-duration'); // Element displaying the next session's duration
const sessionDotsContainer = document.querySelector('.js-session-dots'); // Container for session dots
// DOM Element for displaying total time
const totalTimeElement = document.querySelector('.js-total-time'); // Element displaying total session time

// Converts a time string (e.g., "10:30") into an object with minutes and seconds properties.
function parseTime(timeStr) {
    const [minutes = 0, seconds = 0] = timeStr.split(':').map(Number);
    return { minutes, seconds };
}

//set up the timer display
function initializeTimer(duration) {
    minutesLeft = duration.minutes;
    secondsLeft = duration.seconds;
    timerElement.textContent = `${String(minutesLeft).padStart(2, '0')}:${String(secondsLeft).padStart(2, '0')}`;

    // Update the total time display to include both minutes and seconds
    let totalTimeText = '';
    if (duration.minutes > 0) {
        totalTimeText += `${duration.minutes} MIN${duration.minutes !== 1 ? 'S' : ''} `;
    }
    if (duration.seconds > 0) {
        totalTimeText += `${duration.seconds} SEC`;
    }
    totalTimeElement.textContent = totalTimeText.trim();
}

function updateNextDurations() {
    // Helper function to format the duration
    const formatDuration = (minutes, seconds) => {
        let result = '';
        if (minutes >= 60) {
            result += `${Math.floor(minutes / 60)}h `;
            if (minutes % 60 > 0) result += `${minutes % 60} min `;
        } else if (minutes > 0) {
            result += `${minutes} min `;
        }
        if (seconds > 0 && minutes < 1) result += `${seconds} sec `;
        return result.trim();
    };

    const isLastFocusSession = currentFocusSession + 1 >= sessionCount;
    const duration = isFocusTime
        ? (isLastFocusSession ? 'Last Focus' : `${formatDuration(breakDuration.minutes, breakDuration.seconds)} break ahead`)
        : `${formatDuration(focusDuration.minutes, focusDuration.seconds)} focus ahead`;

    nextDurationElement.textContent = duration;
}

function updateProgressCircle() {
    const progressRing = document.querySelector('.progress-ring__circle');
    const totalDuration = isFocusTime ? focusDuration : breakDuration;
    const totalSeconds = totalDuration.minutes * 60 + totalDuration.seconds;
    const elapsedSeconds = (focusDuration.minutes * 60 + focusDuration.seconds) - (minutesLeft * 60 + secondsLeft);

    const radius = progressRing.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;

    // Calculate percentage only once and use it for both styles
    const percentage = (elapsedSeconds / totalSeconds) * 100;

    // Update the stroke properties
    progressRing.style.strokeDasharray = circumference;
    progressRing.style.strokeDashoffset = circumference - (percentage / 100) * circumference;
}


function createSessionDots() {
    const sessionDotsContainer = document.querySelector('.js-session-dots');
    sessionDotsContainer.innerHTML = ''; // Clear existing dots

    // Total number of dots (focus + break)
    const totalDots = sessionCount * 2 - 1;

    // Class definitions
    const focusDotClasses = 'transition-bg w-10 h-4 rounded-full bg-zinc-100 shrink-0 js-focus-dot';
    const breakDotClasses = 'transition-bg w-4 h-4 rounded-full bg-zinc-100 shrink-0 js-break-dot';

    // Create and append dots
    for (let i = 0; i < totalDots; i++) {
        const dot = document.createElement('div');
        dot.className = i % 2 === 0 ? focusDotClasses : breakDotClasses;
        sessionDotsContainer.appendChild(dot);
    }
}

function updateActiveDot() {
    const allDots = document.querySelectorAll('.js-session-dots div');

    // Reset all dots to default color
    allDots.forEach(dot => {
        dot.classList.remove('bg-zinc-900');
        dot.classList.add('bg-zinc-100');
    });

    // Set the active dot to black
    if (allDots[currentSession]) {
        allDots[currentSession].classList.remove('bg-zinc-100');
        allDots[currentSession].classList.add('bg-zinc-900');
    }
}

function updateSessionDots() {
    const sessionDotsContainer = document.querySelector('.js-session-dots');
    sessionDotsContainer.innerHTML = ''; // Clear existing dots

    // Class definitions
    const focusDotClasses = 'transition-bg w-10 h-4 rounded-full bg-zinc-100 shrink-0 js-focus-dot';
    const breakDotClasses = 'transition-bg w-4 h-4 rounded-full bg-zinc-100 shrink-0 js-break-dot';

    // Create and append dots
    for (let i = 0; i < sessionCount; i++) {
        const focusDot = document.createElement('div');
        focusDot.className = focusDotClasses;
        sessionDotsContainer.appendChild(focusDot);

        if (i < sessionCount - 1) {
            const breakDot = document.createElement('div');
            breakDot.className = breakDotClasses;
            sessionDotsContainer.appendChild(breakDot);
        }
    }

    // Set the first dot to be black (active)
    if (sessionCount > 0) {
        sessionDotsContainer.firstElementChild.classList.add('black-dot');
    }
}

function startSession() {
    const totalSessions = sessionCount * 2 - 1; // Total sessions including focus and break

    if (currentSession >= totalSessions) {
        // End of all sessions
        clearInterval(timerInterval);
        timerElement.textContent = "DONE!";
        toggleIcon(true);
        isPaused = true;
        isComplete = true;
        updateNextDurations();
        return;
    }

    // Determine current session duration
    const duration = isFocusTime ? focusDuration : breakDuration;
    initializeTimer(duration);

    function updateTimer() {
        if (minutesLeft === 0 && secondsLeft === 0) {
            clearInterval(timerInterval);
            switchSession();
            startSession(); // Start the next session
            return;
        }

        // Decrement time
        if (secondsLeft === 0) {
            if (minutesLeft > 0) {
                minutesLeft--;
                secondsLeft = 59;
            }
        } else {
            secondsLeft--;
        }

        // Update UI
        timerElement.textContent = `${String(minutesLeft).padStart(2, '0')}:${String(secondsLeft).padStart(2, '0')}`;
        updateProgressCircle(); // Update progress circle every second
    }

    timerInterval = setInterval(updateTimer, 1000);
    toggleIcon(false);
    isPaused = false;

    // Update UI state
    document.getElementById('timer-state').textContent = isFocusTime ? 'FOCUS' : 'BREAK';
    updateNextDurations();
    updateActiveDot();
    updateProgressCircle(); // Initial progress circle update
}

function pauseTimer() {
    clearInterval(timerInterval);
    toggleIcon(true);
    isPaused = true;
}

function switchSession() {
    // Increment the current session
    currentSession++;

    // Determine the next session type
    if (isFocusTime) {
        currentFocusSession++;
        isFocusTime = currentSession % 2 === 0 && currentSession < sessionCount * 2 - 1;
    } else {
        isFocusTime = true;
    }

    // Update the timer state display
    document.getElementById('timer-state').textContent = isFocusTime ? 'FOCUS' : 'BREAK';

    // Update the UI for the next session
    updateNextDurations();
    updateActiveDot();  // Update the active dot for the new session
}

function pauseTimer() {
    clearInterval(timerInterval);
    toggleIcon(true);  // Show the play icon
    isPaused = true;   // Mark the timer as paused
}

function resetTimer() {
    clearInterval(timerInterval);  // Stop any ongoing timer

    // Reset session and focus counters
    currentSession = 0;
    currentFocusSession = 0;
    isFocusTime = true;  // Start with a focus session

    // Set paused state and mark as not complete
    isPaused = true;
    isComplete = false;

    // Update durations and session count from input
    sessionCount = parseInt(sessionInput.value, 10) || 4;
    focusDuration = parseTime(focusTimeInput.value) || { minutes: 2, seconds: 0 };
    breakDuration = parseTime(breakTimeInput.value) || { minutes: 1, seconds: 0 };

    // Initialize timer for the first focus session
    initializeTimer(focusDuration);

    // Update UI elements
    updateNextDurations();
    updateProgressCircle();  // Reset progress circle
    updateSessionDots();     // Regenerate session dots
    toggleIcon(true);        // Show the play icon

    // Ensure previous button is in correct state
    updatePrevButtonState();

    // Set timer state text
    document.getElementById('timer-state').textContent = `FOCUS 1/${sessionCount}`;
}

function toggleIcon(showPlay) {
    if (showPlay) {
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
    } else {
        playIcon.classList.add('hidden');
        pauseIcon.classList.remove('hidden');
    }
}


function toggleTimer() {
    if (isComplete) {
        // Reset and start a new session if the timer is complete
        resetTimer();
        startSession();
    } else if (isPaused) {
        // Start the timer if it is paused
        startSession();
    } else {
        // Pause the timer if it is currently running
        pauseTimer();
    }
}

function skipToNextSession() {
    clearInterval(timerInterval);  // Stop the current timer

    const totalSessions = sessionCount * 2 - 1; // Total session count

    // If it's the last session, disable the skip button and exit
    if (currentSession >= totalSessions) {
        skipButton.disabled = true;
        return;
    }
    // Move to the next session
    if (isFocusTime) {
        currentSession++;
        currentFocusSession++;
        isFocusTime = currentSession < totalSessions && currentSession % 2 === 0;
    } else {
        currentSession++;
        isFocusTime = true;
    }

    // Update the UI
    document.getElementById('timer-state').textContent = isFocusTime ? 'FOCUS' : 'BREAK';
    updateNextDurations();  // Update next session duration
    updateActiveDot();  // Highlight the active session dot

    // Initialize the timer for the next session
    const nextDuration = isFocusTime ? focusDuration : breakDuration;
    initializeTimer(nextDuration);
    updateProgressCircle();  // Update progress circle

    // Disable the skip button if it's the last focus session
    skipButton.disabled = currentFocusSession >= sessionCount;
    
    // Update previous button state
    updatePrevButtonState();

    // Pause the timer and ensure play icon is visible
    pauseTimer();
    toggleIcon(true);  // Ensure play icon is shown
}

function navigateToPreviousSession() {
    clearInterval(timerInterval);  // Stop the current timer

    // If there is no previous session, disable the previous button and exit
    if (currentSession <= 0) {
        prevButton.disabled = true;
        return;
    }

    // Move to the previous session
    if (isFocusTime) {
        currentSession--;
        if (currentSession % 2 === 0) {
            isFocusTime = false;
            currentFocusSession--;
        }
    } else {
        currentSession--;
        isFocusTime = true;
    }

    // Update the UI
    document.getElementById('timer-state').textContent = isFocusTime
        ? `FOCUS ${currentFocusSession + 1}/${sessionCount}`
        : 'BREAK';
    updateNextDurations();  // Update next session duration
    updateActiveDot();  // Highlight the active session dot

    // Initialize the timer for the previous session
    const prevDuration = isFocusTime ? focusDuration : breakDuration;
    initializeTimer(prevDuration);
    updateProgressCircle();  // Update progress circle

    // Update button states
    skipButton.disabled = currentFocusSession >= sessionCount;
    prevButton.disabled = currentSession <= 0;

    // Start the timer if it was running
    if (!isPaused) {
        startSession();
    } else {
        toggleIcon(true);  // Show play icon if paused
    }
}

// Function to initialize event listeners
function initializeEventListeners() {
    // Event listener for the previous button
    prevButton.addEventListener('click', navigateToPreviousSession);

    // Event listener for the main timer button
    button.addEventListener('click', toggleTimer);

    // Event listener for the session input change
    sessionInput.addEventListener('change', function() {
        sessionCount = parseInt(sessionInput.value, 10) || 4;
        resetTimer();
        updateSessionDots(); // Update dots when session count changes
    });

    // Event listener for focus time input change
    focusTimeInput.addEventListener('change', function() {
        focusDuration = parseTime(focusTimeInput.value);
        if (!isPaused) resetTimer(); // Restart timer if not paused
        initializeTimer(focusDuration); // Update the total time display
    });

    // Event listener for break time input change
    breakTimeInput.addEventListener('change', function() {
        breakDuration = parseTime(breakTimeInput.value);
        if (!isPaused) resetTimer(); // Restart timer if not paused
        initializeTimer(breakDuration); // Update the total time display
    });

    // Event listener for the reset button
    resetButton.addEventListener('click', resetTimer);

    // Event listener for the skip button
    skipButton.addEventListener('click', skipToNextSession);
}

// Function to initialize the UI and state on page load
function initializeOnLoad() {
    initializeTimer(focusDuration);
    updateNextDurations();
    createSessionDots();
    updateActiveDot();
    updateSessionDots();
    updatePrevButtonState(); // Ensure correct state for previous button
}

// Initialize event listeners
initializeEventListeners();

// Initialize the UI on page load
document.addEventListener('DOMContentLoaded', initializeOnLoad);

