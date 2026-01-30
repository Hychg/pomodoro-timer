let pomodoro = document.getElementById("pomodoro-timer")
let short = document.getElementById("short-timer")
let long = document.getElementById("long-timer")
let timers = document.querySelectorAll(".timer-display")
let session = document.getElementById("pomodoro-session")
let shortBreak = document.getElementById("short-break")
let longBreak = document.getElementById("long-break")
let startBtn = document.getElementById("start")
let stopBtn = document.getElementById("stop")
let timerMsg = document.getElementById("timer-message")
let button = document.querySelector(".button")

// Settings elements
let settingsBtn = document.getElementById("settings-btn")
let settingsModal = document.getElementById("settings-modal")
let closeModalBtn = document.getElementById("close-modal")
let saveSettingsBtn = document.getElementById("save-settings")
let resetSettingsBtn = document.getElementById("reset-settings")
let pomodoroMinutesInput = document.getElementById("pomodoro-minutes")
let shortBreakMinutesInput = document.getElementById("short-break-minutes")
let longBreakMinutesInput = document.getElementById("long-break-minutes")

let currentTimer = null
let myInterval = null

// Default settings
const defaultSettings = {
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 10
}

// Load settings from localStorage
function loadSettings() {
    const saved = localStorage.getItem("pomodoro_settings")
    if (saved) {
        return JSON.parse(saved)
    }
    return defaultSettings
}

// Save settings to localStorage
function saveSettings(settings) {
    localStorage.setItem("pomodoro_settings", JSON.stringify(settings))
}

// Update timer display with minutes
function updateTimerDisplay(timerElement, minutes) {
    timerElement.setAttribute("data-duration", `${minutes}:00`)
    timerElement.querySelector(".time").textContent = `${minutes}:00`
}

// Initialize timers with saved settings
function initializeTimers() {
    const settings = loadSettings()
    updateTimerDisplay(pomodoro, settings.pomodoro)
    updateTimerDisplay(short, settings.shortBreak)
    updateTimerDisplay(long, settings.longBreak)
}

// Show settings modal
settingsBtn.addEventListener("click", () => {
    const settings = loadSettings()
    pomodoroMinutesInput.value = settings.pomodoro
    shortBreakMinutesInput.value = settings.shortBreak
    longBreakMinutesInput.value = settings.longBreak
    settingsModal.classList.remove("hidden")
})

// Close settings modal
closeModalBtn.addEventListener("click", () => {
    settingsModal.classList.add("hidden")
})

// Close modal when clicking outside
settingsModal.addEventListener("click", (e) => {
    if (e.target === settingsModal) {
        settingsModal.classList.add("hidden")
    }
})

// Save new settings
saveSettingsBtn.addEventListener("click", () => {
    const pomodoro_val = parseInt(pomodoroMinutesInput.value)
    const shortBreak_val = parseInt(shortBreakMinutesInput.value)
    const longBreak_val = parseInt(longBreakMinutesInput.value)
    
    if (pomodoro_val < 1 || shortBreak_val < 1 || longBreak_val < 1) {
        alert("Durasi harus minimal 1 menit!")
        return
    }
    
    if (pomodoro_val > 60 || shortBreak_val > 60 || longBreak_val > 60) {
        alert("Durasi maksimal 60 menit!")
        return
    }
    
    const newSettings = {
        pomodoro: pomodoro_val,
        shortBreak: shortBreak_val,
        longBreak: longBreak_val
    }
    
    saveSettings(newSettings)
    initializeTimers()
    settingsModal.classList.add("hidden")
    alert("Pengaturan berhasil disimpan! ✓")
})

// Reset to default settings
resetSettingsBtn.addEventListener("click", () => {
    if (confirm("Apa Anda yakin ingin mereset ke pengaturan default?")) {
        saveSettings(defaultSettings)
        initializeTimers()
        pomodoroMinutesInput.value = defaultSettings.pomodoro
        shortBreakMinutesInput.value = defaultSettings.shortBreak
        longBreakMinutesInput.value = defaultSettings.longBreak
        alert("Pengaturan berhasil direset! ✓")
    }
})

// show the default timer
function showDefaultTimer() {
    pomodoro.style.display = "block"
    short.style.display = "none"
    long.style.display = "none"
}

initializeTimers()
showDefaultTimer()

function hideAll() {
    timers.forEach((timer) => (
        timer.style.display = "none"
    ))
}

session.addEventListener("click", () => {
    hideAll()
    pomodoro.style.display = "block"

    session.classList.add("active")
    shortBreak.classList.remove("active")
    longBreak.classList.remove("active")

    currentTimer = pomodoro
})

shortBreak.addEventListener("click", () => {
    hideAll()

    short.style.display = "block"

    session.classList.remove("active")
    shortBreak.classList.add("active")
    longBreak.classList.remove("active")

    currentTimer = short
})

longBreak.addEventListener("click", () => {
    hideAll()
    long.style.display = "block"

    session.classList.remove("active")
    shortBreak.classList.remove("active")
    longBreak.classList.add("active")

    currentTimer = long
})

// Start the timer on click
function startTimer(timerDisplay) {
    if (myInterval) {
        clearInterval(myInterval);
    }

    let durationStr = timerDisplay.getAttribute("data-duration")
    let timerDuration = parseInt(durationStr.split(":")[0])

    let durationinmiliseconds = timerDuration * 60 * 1000;
    let endTimestamp = Date.now() + durationinmiliseconds;

    myInterval = setInterval(function () {
        const timeRemaining = new Date(endTimestamp - Date.now());

        if (timeRemaining <= 0) {
            clearInterval(myInterval);
            timerDisplay.textContent = "00:00";
            
            // Tentukan pesan berdasarkan jenis timer
            let message = "";
            if (timerDisplay.id === "pomodoro-timer") {
                message = "Terima kasih sudah bekerja keras! 💪";
            } else if (timerDisplay.id === "short-timer" || timerDisplay.id === "long-timer") {
                message = "Ayo lanjut belajar! 📚";
            }
            
            // Tampilkan pesan
            timerMsg.textContent = message;
            timerMsg.style.display = "block";
            
            const alarm = new Audio("https://www.freespecialeffects.co.uk/soundfx/scifi/electronic.wav");
            alarm.play()
        } else {
            const minutes = Math.floor(timeRemaining / 60000);
            const seconds = ((timeRemaining % 60000) / 1000).toFixed(0);
            const formattedTime = `${minutes}:${seconds
            .toString()
            .padStart(2, "0")}`;            
            timerDisplay.textContent = formattedTime;
        }
    }, 1000);
}

    startBtn.addEventListener("click", () => {
        if (currentTimer) {
            startTimer(currentTimer)
            timerMsg.style.display = "none"
        } else {
            timerMsg.style.display = "block"
        }

  
    })

    stopBtn.addEventListener("click", () => {
        if (currentTimer) {
            clearInterval(myInterval);
        }
    })
// ========== TASK TABLE FUNCTIONALITY ==========
let tasks = [];
const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task-btn");
const taskTbody = document.getElementById("task-tbody");
const emptyMessage = document.getElementById("empty-message");

// Load tasks from localStorage
function loadTasks() {
    const savedTasks = localStorage.getItem("pomodoro_tasks");
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
    renderTasks();
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem("pomodoro_tasks", JSON.stringify(tasks));
}

// Add new task
function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();
    taskInput.value = "";
    taskInput.focus();
}

// Complete/Uncomplete task
function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    }
}

// Delete task
function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
}

// Render tasks in table
function renderTasks() {
    taskTbody.innerHTML = "";

    if (tasks.length === 0) {
        emptyMessage.classList.remove("hidden");
        emptyMessage.style.display = "block";
        return;
    }

    emptyMessage.style.display = "none";

    tasks.forEach((task, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td class="${task.completed ? "status-completed" : ""}">${task.text}</td>
            <td class="${task.completed ? "status-completed" : "status-pending"}">
                ${task.completed ? "✓ Done" : "⏳ Pending"}
            </td>
            <td class="task-actions">
                <button class="btn-complete" onclick="toggleTask(${task.id})">
                    ${task.completed ? "Undo" : "Complete"}
                </button>
                <button class="btn-delete" onclick="deleteTask(${task.id})">Delete</button>
            </td>
        `;
        taskTbody.appendChild(row);
    });
}

// Event listeners
addTaskBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        addTask();
    }
});

// Initialize on page load
loadTasks();