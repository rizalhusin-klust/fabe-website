// 30-Day Planner State & UI Manager
// Current Date Context: July 3, 2026

const START_DATE = new Date("2026-07-03T00:00:00");
const END_DATE = new Date("2026-08-02T23:59:59");
const TODAY = new Date("2026-07-03T00:00:00");

const RASCI_ROLES = ["Dean FABE", "HOP/s", "Cluster Leader", "Studio Master", "FABE Lecturers", "Students", "Academic Executive", "KLUST"];
const REPORT_TO_BODIES = ["EMC", "UAC", "Senate", "Record"];

// State Management
let state = {
    tasks: [],
    searchQuery: "",
    filterStatus: "all",
    filterThrust: "all",
    filterRASCI: "all",
    selectedTaskId: null,
    currentView: "board" // 'timeline' or 'board'
};

// LocalStorage helpers
const STORAGE_KEY = "FABE_WBS_PLANNER_STATE";

function loadState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            state.tasks = JSON.parse(saved);
            console.log("State loaded from localStorage");
            return;
        } catch (e) {
            console.error("Failed to parse local storage state, reloading defaults", e);
        }
    }
    // Initialize with fresh WBS_DATA (deep copy)
    state.tasks = JSON.parse(JSON.stringify(WBS_DATA)).map((task, idx) => {
        return {
            id: `task-${idx}`,
            ...task,
            // Format existing Progress % to number, e.g. "75.00%" -> 75
            progressPct: parseFloat(task["Progress %"] || "0"),
            notes: "",
            // Set checklist items with checked property
            checklist: task.suggestions.map(s => ({ text: s, checked: false }))
        };
    });
    saveState();
}

function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.tasks));
}

function resetState() {
    if (confirm("Are you sure you want to reset all progress, checked steps, and customizations back to the Google Sheet defaults?")) {
        localStorage.removeItem(STORAGE_KEY);
        loadState();
        state.selectedTaskId = null;
        renderApp();
    }
}

// Date helpers
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function parseDate(dateStr) {
    if (!dateStr) return null;
    const parts = dateStr.split('-');
    if (parts.length !== 3) return null;
    const day = parseInt(parts[0], 10);
    const monthIndex = MONTHS.findIndex(m => m.toLowerCase() === parts[1].toLowerCase().substring(0, 3));
    const year = parseInt(parts[2], 10);
    if (isNaN(day) || monthIndex === -1 || isNaN(year)) return null;
    return new Date(year, monthIndex, day);
}

function formatDate(date) {
    if (!date) return "";
    return `${date.getDate()}-${MONTHS[date.getMonth()]}-${date.getFullYear()}`;
}

function getDaysBetween(d1, d2) {
    const timeDiff = d2.getTime() - d1.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
}

// Get day index (0-30) inside our 30-day window
function getDayOffset(date) {
    if (!date) return -1;
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const s = new Date(START_DATE.getFullYear(), START_DATE.getMonth(), START_DATE.getDate());
    return getDaysBetween(s, d);
}

// Document Ready
document.addEventListener("DOMContentLoaded", () => {
    loadState();
    initializeFilters();
    setupEventListeners();
    renderApp();
});

// Setup dynamic filters based on data
function initializeFilters() {
    const thrustFilter = document.getElementById("filter-thrust");
    const rasciFilter = document.getElementById("filter-rasci");
    
    // Extract unique strategic thrusts and RASCI owners
    const thrusts = new Set();
    const rasciList = new Set();
    
    state.tasks.forEach(t => {
        if (t["Strategic Thrust"]) thrusts.add(t["Strategic Thrust"]);
        if (t["RASCI"]) {
            t["RASCI"].split(',').forEach(owner => rasciList.add(owner.trim()));
        }
    });
    
    // Populate Thrust filter dropdown
    Array.from(thrusts).sort().forEach(th => {
        const opt = document.createElement("option");
        opt.value = th;
        opt.textContent = th;
        thrustFilter.appendChild(opt);
    });
    
    // Populate RASCI filter dropdown
    Array.from(rasciList).sort().forEach(owner => {
        const opt = document.createElement("option");
        opt.value = owner;
        opt.textContent = owner;
        rasciFilter.appendChild(opt);
    });
}

function setupEventListeners() {
    // Search
    document.getElementById("search-input").addEventListener("input", (e) => {
        state.searchQuery = e.target.value.toLowerCase();
        renderActiveView();
    });
    
    // Filters
    document.getElementById("filter-status").addEventListener("change", (e) => {
        state.filterStatus = e.target.value;
        renderActiveView();
    });
    
    document.getElementById("filter-thrust").addEventListener("change", (e) => {
        state.filterThrust = e.target.value;
        renderActiveView();
    });
    
    document.getElementById("filter-rasci").addEventListener("change", (e) => {
        state.filterRASCI = e.target.value;
        renderActiveView();
    });
    
    // View toggles
    document.getElementById("btn-view-timeline").addEventListener("click", () => {
        state.currentView = "timeline";
        document.getElementById("btn-view-timeline").classList.add("active");
        document.getElementById("btn-view-board").classList.remove("active");
        renderApp();
    });
    
    document.getElementById("btn-view-board").addEventListener("click", () => {
        state.currentView = "board";
        document.getElementById("btn-view-timeline").classList.remove("active");
        document.getElementById("btn-view-board").classList.add("active");
        renderApp();
    });
    
    // Drawer close
    document.getElementById("btn-close-drawer").addEventListener("click", closeDrawer);
    document.getElementById("drawer-overlay").addEventListener("click", closeDrawer);
    
    // Action buttons
    document.getElementById("btn-reset").addEventListener("click", resetState);
    document.getElementById("btn-export").addEventListener("click", openExportModal);
    document.getElementById("btn-export-csv").addEventListener("click", exportHistoryToCSV);
    document.getElementById("btn-add-task").addEventListener("click", addNewTask);
    
    // Details Drawer Edit actions
    document.getElementById("btn-edit-task").addEventListener("click", () => setEditMode(true));
    document.getElementById("btn-cancel-edit").addEventListener("click", () => setEditMode(false));
    document.getElementById("btn-delete-task").addEventListener("click", deleteTask);
    document.getElementById("drawer-edit-mode").addEventListener("submit", saveTaskChanges);
    
    // Modal buttons
    document.getElementById("btn-close-modal").addEventListener("click", closeModal);
    document.getElementById("btn-modal-cancel").addEventListener("click", closeModal);
    document.getElementById("btn-modal-import").addEventListener("click", importState);
    document.getElementById("btn-copy-json").addEventListener("click", copyJSONToClipboard);
    
    // Custom steps addition
    document.getElementById("add-step-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const input = document.getElementById("add-step-input");
        const val = input.value.trim();
        if (val && state.selectedTaskId) {
            const task = state.tasks.find(t => t.id === state.selectedTaskId);
            if (task) {
                task.checklist.push({ text: val, checked: false });
                input.value = "";
                updateTaskProgress(task);
                addHistoryEntry(task, `Added custom step: "${val}"`);
                saveState();
                renderTaskDetails(task);
                renderActiveView();
            }
        }
    });
    
    // Notes auto-save on typing (de-bounced)
    let notesTimeout;
    document.getElementById("notes-area").addEventListener("input", (e) => {
        clearTimeout(notesTimeout);
        notesTimeout = setTimeout(() => {
            if (state.selectedTaskId) {
                const task = state.tasks.find(t => t.id === state.selectedTaskId);
                if (task) {
                    task.notes = e.target.value;
                    addHistoryEntry(task, "Updated custom planning notes");
                    saveState();
                    renderActiveView();
                }
            }
        }, 500);
    });
}

// Get styling class based on strategic thrust
function getThrustClass(thrust) {
    if (!thrust) return "thrust-default";
    const t = thrust.toLowerCase();
    if (t.includes("thrust 1")) return "thrust-t1";
    if (t.includes("thrust 3")) return "thrust-t3";
    if (t.includes("thrust 4")) return "thrust-t4";
    if (t.includes("thrust 5")) return "thrust-t5";
    if (t.includes("thrust 6")) return "thrust-t6";
    if (t.includes("thrust 7")) return "thrust-t7";
    if (t.includes("thrust 8")) return "thrust-t8";
    if (t.includes("thrust 9")) return "thrust-t9";
    return "thrust-default";
}

// Filter tasks based on Search, Status, Thrust, and RASCI
function getFilteredTasks() {
    return state.tasks.filter(t => {
        // 1. Search Query
        const matchSearch = t["Task Name"].toLowerCase().includes(state.searchQuery) ||
                            t["Category"].toLowerCase().includes(state.searchQuery) ||
                            t["RASCI"].toLowerCase().includes(state.searchQuery);
        
        if (!matchSearch) return false;
        
        // 2. Strategic Thrust Filter
        if (state.filterThrust !== "all" && t["Strategic Thrust"] !== state.filterThrust) return false;
        
        // 3. RASCI Filter
        if (state.filterRASCI !== "all") {
            const rascis = t["RASCI"].split(',').map(r => r.trim());
            if (!rascis.includes(state.filterRASCI)) return false;
        }
        
        // 4. Status Filter (Kanban logic mapping)
        const deadline = parseDate(t["Deadline"]);
        const isCompleted = t.progressPct >= 100 || t["Status"] === "Completed";
        const isOverdue = !isCompleted && deadline && deadline < TODAY;
        const isUrgent = !isCompleted && deadline && getDaysBetween(TODAY, deadline) <= 10 && getDaysBetween(TODAY, deadline) >= 0;
        
        if (state.filterStatus === "overdue" && !isOverdue) return false;
        if (state.filterStatus === "urgent" && !isUrgent) return false;
        if (state.filterStatus === "active" && (isCompleted || isOverdue)) return false;
        if (state.filterStatus === "completed" && !isCompleted) return false;
        
        return true;
    });
}

// Calculate dashboard metrics and update header cards
function updateMetrics() {
    let totalCount = 0;
    let completedCount = 0;
    let overdueCount = 0;
    let activeCount = 0;
    let sumProgress = 0;
    
    // We compute metrics based on ALL tasks in the planner
    state.tasks.forEach(t => {
        const deadline = parseDate(t["Deadline"]);
        const isCompleted = t.progressPct >= 100 || t["Status"] === "Completed";
        const isOverdue = !isCompleted && deadline && deadline < TODAY;
        
        totalCount++;
        sumProgress += t.progressPct;
        
        if (isCompleted) {
            completedCount++;
        } else if (isOverdue) {
            overdueCount++;
            activeCount++;
        } else {
            activeCount++;
        }
    });
    
    const avgProgress = totalCount > 0 ? (sumProgress / totalCount).toFixed(1) : 0;
    
    // Update DOM
    document.getElementById("stat-total-tasks").textContent = totalCount;
    document.getElementById("stat-active-tasks").textContent = activeCount;
    document.getElementById("stat-overdue-tasks").textContent = overdueCount;
    document.getElementById("stat-avg-progress").textContent = `${avgProgress}%`;
}

function renderApp() {
    updateMetrics();
    renderActiveView();
}

function renderActiveView() {
    const timelinePanel = document.getElementById("timeline-view-panel");
    const boardPanel = document.getElementById("board-view-panel");
    
    if (state.currentView === "timeline") {
        timelinePanel.style.display = "block";
        boardPanel.style.display = "none";
        renderTimeline();
    } else {
        timelinePanel.style.display = "none";
        boardPanel.style.display = "block";
        renderBoard();
    }
}

// RENDER: Timeline horizontal Gantt view
function renderTimeline() {
    const timelineChart = document.getElementById("timeline-chart");
    timelineChart.innerHTML = "";
    
    // 1. Render header row (days 1-30 starting July 3)
    const headerRow = document.createElement("div");
    headerRow.className = "timeline-header-row";
    
    const taskColHeader = document.createElement("div");
    taskColHeader.className = "timeline-task-col-header";
    taskColHeader.textContent = "Tasks in Scope";
    headerRow.appendChild(taskColHeader);
    
    const daysGrid = document.createElement("div");
    daysGrid.className = "timeline-days-grid";
    
    let daysArray = [];
    let tempDate = new Date(START_DATE.getTime());
    while (tempDate <= END_DATE) {
        daysArray.push(new Date(tempDate.getTime()));
        tempDate.setDate(tempDate.getDate() + 1);
    }
    
    daysArray.forEach(d => {
        const dayHeader = document.createElement("div");
        dayHeader.className = "timeline-day-header";
        const isToday = getDaysBetween(d, TODAY) === 0;
        if (isToday) dayHeader.classList.add("today");
        
        dayHeader.innerHTML = `
            <span class="day-num">${d.getDate()}</span>
            <span class="day-lbl">${MONTHS[d.getMonth()].substring(0, 1)}</span>
        `;
        daysGrid.appendChild(dayHeader);
    });
    
    headerRow.appendChild(daysGrid);
    timelineChart.appendChild(headerRow);
    
    // Filter tasks
    const filtered = getFilteredTasks();
    
    // We only display tasks that have timelines overlapping with our 30-day window, 
    // OR any active/overdue tasks to keep them visible
    const inScopeTasks = filtered.filter(t => {
        const start = parseDate(t["Start Date"]);
        const deadline = parseDate(t["Deadline"]);
        const isCompleted = t.progressPct >= 100 || t["Status"] === "Completed";
        
        // If completed and not within this window, hide it on the Gantt view to save vertical space
        if (isCompleted) {
            if (!deadline || deadline < START_DATE || deadline > END_DATE) {
                return false;
            }
        }
        
        // Unscheduled active tasks should show up so the user can schedule them!
        if (!start && !deadline) return true;
        
        // Checks if date range overlaps 30-day window
        const startsBeforeEnd = !start || start <= END_DATE;
        const endsAfterStart = !deadline || deadline >= START_DATE;
        return startsBeforeEnd && endsAfterStart;
    });
    
    if (inScopeTasks.length === 0) {
        timelineChart.innerHTML += `
            <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
                No active tasks found in this 30-day window matching the selected filters.
            </div>
        `;
        return;
    }
    
    // Render task rows
    inScopeTasks.forEach(t => {
        const row = document.createElement("div");
        row.className = `timeline-row ${getThrustClass(t["Strategic Thrust"])}`;
        
        // Task description block (left column)
        const infoCol = document.createElement("div");
        infoCol.className = "timeline-task-info";
        
        const taskName = document.createElement("div");
        taskName.className = "timeline-task-name";
        taskName.textContent = t["Task Name"];
        taskName.addEventListener("click", () => openDrawer(t.id));
        infoCol.appendChild(taskName);
        
        const taskMeta = document.createElement("div");
        taskMeta.className = "timeline-task-meta";
        const ownerInitials = t["RASCI"].split(',').map(r => r.trim()[0]).join('/');
        taskMeta.innerHTML = `
            <span>${t["Category"]}</span>
            <span>&bull;</span>
            <span style="color: var(--color-cyan); font-weight:500;">${ownerInitials}</span>
        `;
        infoCol.appendChild(taskMeta);
        row.appendChild(infoCol);
        
        // Timeline Bar block (right column)
        const barWrapper = document.createElement("div");
        barWrapper.className = "timeline-bar-wrapper";
        
        const start = parseDate(t["Start Date"]);
        const deadline = parseDate(t["Deadline"]);
        
        // Layout calculations
        let startOffset = 0;
        let spanDays = 1;
        
        if (start || deadline) {
            const actualStart = start || new Date(deadline.getTime() - 2 * 24 * 3600 * 1000); // Default 3 days span if only deadline exists
            const actualEnd = deadline || new Date(actualStart.getTime() + 2 * 24 * 3600 * 1000);
            
            startOffset = getDayOffset(actualStart);
            const endOffset = getDayOffset(actualEnd);
            
            // Cap to fit the grid
            let displayStart = startOffset;
            if (displayStart < 0) displayStart = 0;
            
            let displayEnd = endOffset;
            if (displayEnd > 30) displayEnd = 30;
            
            spanDays = (displayEnd - displayStart) + 1;
            if (spanDays <= 0) spanDays = 1;
            
            startOffset = displayStart;
        } else {
            // Unscheduled tasks place at center day
            startOffset = 15;
            spanDays = 1;
        }
        
        const bar = document.createElement("div");
        bar.className = "timeline-bar";
        
        // Styling status classes
        const isCompleted = t.progressPct >= 100 || t["Status"] === "Completed";
        const isOverdue = !isCompleted && deadline && deadline < TODAY;
        
        if (isCompleted) {
            bar.classList.add("completed");
        } else if (isOverdue) {
            bar.classList.add("overdue");
        } else if (t["Status"] === "Not Start" || t.progressPct === 0) {
            bar.classList.add("not-start");
        }
        
        // Position on CSS Grid
        bar.style.gridColumnStart = startOffset + 1;
        bar.style.gridColumnEnd = `span ${spanDays}`;
        
        // Label
        bar.textContent = `${t.progressPct}%`;
        bar.addEventListener("click", () => openDrawer(t.id));
        
        barWrapper.appendChild(bar);
        row.appendChild(barWrapper);
        timelineChart.appendChild(row);
    });
}

// RENDER: Kanban board columns and cards
function renderBoard() {
    const columns = {
        overdue: document.getElementById("kanban-overdue"),
        urgent: document.getElementById("kanban-urgent"),
        active: document.getElementById("kanban-active"),
        upcoming: document.getElementById("kanban-upcoming"),
        completed: document.getElementById("kanban-completed")
    };
    
    // Clear lists
    Object.values(columns).forEach(col => col.innerHTML = "");
    
    const counts = { overdue: 0, urgent: 0, active: 0, upcoming: 0, completed: 0 };
    const filtered = getFilteredTasks();
    
    filtered.forEach(t => {
        const card = document.createElement("div");
        card.className = `task-card ${getThrustClass(t["Strategic Thrust"])}`;
        card.addEventListener("click", () => openDrawer(t.id));
        
        const deadline = parseDate(t["Deadline"]);
        const isCompleted = t.progressPct >= 100 || t["Status"] === "Completed";
        const isOverdue = !isCompleted && deadline && deadline < TODAY;
        const daysLeft = deadline ? getDaysBetween(TODAY, deadline) : null;
        
        // Category and Days Left Badge
        let badgeHtml = "";
        let targetList = "";
        
        if (isCompleted) {
            badgeHtml = `<span class="days-left-tag normal">Completed</span>`;
            targetList = "completed";
        } else if (isOverdue) {
            badgeHtml = `<span class="days-left-tag urgent">${Math.abs(daysLeft)}d Overdue</span>`;
            targetList = "overdue";
        } else if (daysLeft !== null && daysLeft <= 0) {
            badgeHtml = `<span class="days-left-tag urgent">Due Today</span>`;
            targetList = "urgent";
        } else if (daysLeft !== null && daysLeft <= 10) {
            badgeHtml = `<span class="days-left-tag warning">${daysLeft}d Left</span>`;
            targetList = "urgent";
        } else if (t["Status"] === "Not Start" || t.progressPct === 0) {
            badgeHtml = `<span class="days-left-tag normal">${daysLeft !== null ? `${daysLeft}d Left` : 'Unscheduled'}</span>`;
            targetList = "upcoming";
        } else {
            badgeHtml = `<span class="days-left-tag normal">${daysLeft}d Left</span>`;
            targetList = "active";
        }
        
        card.innerHTML = `
            <div class="task-card-header">
                <span class="task-category">${t["Category"]}</span>
                ${badgeHtml}
            </div>
            <div class="task-name">${t["Task Name"]}</div>
            <div class="task-progress-section">
                <div class="progress-track">
                    <div class="progress-fill" style="width: ${t.progressPct}%"></div>
                </div>
                <span class="progress-pct">${t.progressPct}%</span>
            </div>
            <div class="task-card-footer">
                <div class="task-owner">
                    <span class="owner-initials">${t["RASCI"].split(',')[0].trim()[0]}</span>
                    <span>${t["RASCI"].split(',')[0]}</span>
                </div>
                <span class="thrust-badge" title="${t["Strategic Thrust"]}">${t["Strategic Thrust"] ? t["Strategic Thrust"].substring(0, 18) + '...' : ''}</span>
            </div>
        `;
        
        columns[targetList].appendChild(card);
        counts[targetList]++;
    });
    
    // Update column count badges
    document.getElementById("count-overdue").textContent = counts.overdue;
    document.getElementById("count-urgent").textContent = counts.urgent;
    document.getElementById("count-active").textContent = counts.active;
    document.getElementById("count-upcoming").textContent = counts.upcoming;
    document.getElementById("count-completed").textContent = counts.completed;
}

// DRAWER MODULE
function openDrawer(taskId) {
    state.selectedTaskId = taskId;
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return;
    
    renderTaskDetails(task);
    
    document.getElementById("details-drawer").classList.add("open");
    document.getElementById("drawer-overlay").classList.add("active");
}

function closeDrawer() {
    state.selectedTaskId = null;
    setEditMode(false);
    document.getElementById("details-drawer").classList.remove("open");
    document.getElementById("drawer-overlay").classList.remove("active");
}

function renderTaskDetails(task) {
    document.getElementById("drawer-task-name").textContent = task["Task Name"];
    document.getElementById("detail-category").textContent = task["Category"];
    
    const thrustBadge = document.getElementById("detail-thrust");
    thrustBadge.textContent = task["Strategic Thrust"] || "Routine / Operational";
    thrustBadge.className = "details-value badge";
    thrustBadge.classList.add(getThrustClass(task["Strategic Thrust"]));
    
    document.getElementById("detail-rasci").textContent = task["RASCI"];
    document.getElementById("detail-report-to").textContent = task["Report to"] || "EMC";
    document.getElementById("detail-dates").textContent = `${task["Start Date"] || "N/A"} to ${task["Deadline"] || "N/A"}`;
    document.getElementById("detail-issues").textContent = task["Major Issue/Incident"] || "None reported";
    document.getElementById("detail-actions").textContent = task["Action Taken"] || "None reported";
    
    // Notes
    document.getElementById("notes-area").value = task.notes || "";
    
    // Progress percentage
    document.getElementById("detail-progress-pct").textContent = `${task.progressPct}%`;
    document.getElementById("detail-progress-fill").style.width = `${task.progressPct}%`;
    
    // Checklist render
    const checklistContainer = document.getElementById("steps-checklist");
    checklistContainer.innerHTML = "";
    
    task.checklist.forEach((item, index) => {
        const li = document.createElement("li");
        li.className = "checklist-item";
        
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "checklist-checkbox";
        checkbox.checked = item.checked;
        checkbox.addEventListener("change", () => toggleStepCheckbox(task, index));
        
        const text = document.createElement("span");
        text.className = "checklist-text";
        text.textContent = item.text;
        
        li.appendChild(checkbox);
        li.appendChild(text);
        checklistContainer.appendChild(li);
    });
    
    // Update steps title to show count
    const completedSteps = task.checklist.filter(c => c.checked).length;
    document.getElementById("checklist-count").textContent = `(${completedSteps}/${task.checklist.length} steps)`;
}

// Checklist logic: Toggle checkboxes
function toggleStepCheckbox(task, index) {
    task.checklist[index].checked = !task.checklist[index].checked;
    updateTaskProgress(task);
    const step = task.checklist[index];
    addHistoryEntry(task, `${step.checked ? 'Completed' : 'Reopened'} step: "${step.text}"`);
    saveState();
    renderTaskDetails(task);
    renderActiveView();
}

// Calculate progress percentage dynamically based on checkbox state
function updateTaskProgress(task) {
    const total = task.checklist.length;
    if (total === 0) return;
    
    const checked = task.checklist.filter(c => c.checked).length;
    const computedProgress = Math.round((checked / total) * 100);
    
    task.progressPct = computedProgress;
    
    // Automatically update status string based on progress completion
    if (computedProgress >= 100) {
        task["Status"] = "Completed";
        task["Progress"] = `Completed on ${formatDate(new Date())}`;
    } else if (computedProgress > 0) {
        task["Status"] = "In Progress";
    } else {
        task["Status"] = "Not Start";
    }
    
    updateMetrics();
}

// MODAL MODULES: Export / Import JSON
function openExportModal() {
    const modal = document.getElementById("import-export-modal");
    const textarea = document.getElementById("json-data-area");
    
    // Generate JSON string of tasks state
    textarea.value = JSON.stringify(state.tasks, null, 2);
    
    modal.classList.add("open");
    document.getElementById("drawer-overlay").classList.add("active");
}

function closeModal() {
    document.getElementById("import-export-modal").classList.remove("open");
    if (!state.selectedTaskId) {
        document.getElementById("drawer-overlay").classList.remove("active");
    }
}

function importState() {
    const textarea = document.getElementById("json-data-area");
    const jsonStr = textarea.value.trim();
    
    try {
        const imported = JSON.parse(jsonStr);
        if (Array.isArray(imported)) {
            state.tasks = imported;
            saveState();
            closeModal();
            closeDrawer();
            renderApp();
            alert("Planner state successfully imported!");
        } else {
            alert("Error: Imported JSON must be an array of tasks.");
        }
    } catch (e) {
        alert("Invalid JSON format. Please verify copy/paste content.");
    }
}

function copyJSONToClipboard() {
    const textarea = document.getElementById("json-data-area");
    textarea.select();
    document.execCommand("copy");
    alert("JSON plan successfully copied to clipboard!");
}

// History Database tracking & CSV export modules
function addHistoryEntry(task, detailText) {
    let history = [];
    const savedHistory = localStorage.getItem("FABE_WBS_PLANNER_HISTORY");
    if (savedHistory) {
        try {
            history = JSON.parse(savedHistory);
        } catch (e) {
            console.error("Failed to parse history logs", e);
        }
    }
    
    // Add baseline entries if history is empty to initialize database correctly
    if (history.length === 0) {
        history = [
            {
                "Timestamp": "2026-07-03 08:30:00",
                "Task Name": "Board of Examination Meeting March 2026",
                "Category": "Academics & Teaching",
                "Progress %": "100%",
                "Status": "Completed",
                "RASCI": "Dean FABE, HOP/s",
                "Action Details": "BOE results board meeting successfully held. Marks endorsed.",
                "User Notes": "Endorsed marks prepared for final registration."
            },
            {
                "Timestamp": "2026-06-26 12:00:00",
                "Task Name": "Measured Drawing Presentation IPOH",
                "Category": "Academics & Teaching",
                "Progress %": "100%",
                "Status": "Completed",
                "RASCI": "HOP/s, Cluster Leader",
                "Action Details": "Measured drawing exhibition day successfully run in cooperation with local council.",
                "User Notes": "Students drawings compiled and displayed in gallery room."
            }
        ];
    }
    
    const entry = {
        "Timestamp": new Date().toISOString().replace('T', ' ').substring(0, 19),
        "Task Name": task["Task Name"],
        "Category": task["Category"],
        "Progress %": `${task.progressPct}%`,
        "Status": task["Status"],
        "RASCI": task["RASCI"],
        "Action Details": detailText,
        "User Notes": task.notes || ""
    };
    
    history.push(entry);
    localStorage.setItem("FABE_WBS_PLANNER_HISTORY", JSON.stringify(history));
}

function exportHistoryToCSV() {
    let history = [];
    const savedHistory = localStorage.getItem("FABE_WBS_PLANNER_HISTORY");
    if (savedHistory) {
        try {
            history = JSON.parse(savedHistory);
        } catch (e) {
            console.error("Failed to load history storage", e);
        }
    }
    
    // Fallback if no logs are registered yet
    if (history.length === 0) {
        history = [
            {
                "Timestamp": new Date().toISOString().replace('T', ' ').substring(0, 19),
                "Task Name": "Database Template Initialized",
                "Category": "System Setup",
                "Progress %": "100%",
                "Status": "Completed",
                "RASCI": "System",
                "Action Details": "Database tracking initialized. Toggling steps will append records.",
                "User Notes": "First initialization log entry."
            }
        ];
    }
    
    const headers = ["Timestamp", "Task Name", "Category", "Progress %", "Status", "RASCI", "Action Details", "User Notes"];
    let csvContent = "\uFEFF"; // Add BOM for Excel UTF-8 compliance
    csvContent += headers.join(",") + "\n";
    
    history.forEach(row => {
        const line = headers.map(h => {
            let val = row[h] || "";
            val = val.toString().replace(/"/g, '""');
            if (val.includes(',') || val.includes('\n') || val.includes('\r') || val.includes('"')) {
                val = `"${val}"`;
            }
            return val;
        }).join(",");
        csvContent += line + "\n";
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "fabe_wbs_development_history.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Date conversions for input[type="date"]
function dateToHTMLValue(dateStr) {
    const d = parseDate(dateStr);
    if (!d) return "";
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

function htmlValueToDate(htmlStr) {
    if (!htmlStr) return "";
    const parts = htmlStr.split('-');
    if (parts.length !== 3) return "";
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    const date = new Date(y, m, d);
    return formatDate(date);
}

// Drawer state toggler
function setEditMode(isEditing) {
    state.isEditing = isEditing;
    const viewContainer = document.getElementById("drawer-view-mode");
    const editContainer = document.getElementById("drawer-edit-mode");
    
    if (isEditing) {
        viewContainer.style.display = "none";
        editContainer.style.display = "flex";
        
        // Populate form fields
        if (state.selectedTaskId) {
            const task = state.tasks.find(t => t.id === state.selectedTaskId);
            if (task) {
                document.getElementById("edit-task-name").value = task["Task Name"] || "";
                document.getElementById("edit-category").value = task["Category"] || "Academics & Teaching";
                document.getElementById("edit-thrust").value = task["Strategic Thrust"] || "";
                document.getElementById("edit-milestone").value = task["Milestone"] || "No";
                
                // Populate RASCI checkboxes
                const rasciContainer = document.getElementById("edit-rasci-container");
                rasciContainer.innerHTML = "";
                const taskRascis = (task["RASCI"] || "").split(',').map(r => r.trim());
                RASCI_ROLES.forEach(role => {
                    const label = document.createElement("label");
                    label.className = "checkbox-option";
                    
                    const cb = document.createElement("input");
                    cb.type = "checkbox";
                    cb.value = role;
                    cb.checked = taskRascis.includes(role);
                    cb.className = "edit-rasci-checkbox";
                    
                    label.appendChild(cb);
                    label.appendChild(document.createTextNode(role));
                    rasciContainer.appendChild(label);
                });
                
                // Populate Report To checkboxes
                const reportToContainer = document.getElementById("edit-report-to-container");
                reportToContainer.innerHTML = "";
                const taskReports = (task["Report to"] || "").split(',').map(r => r.trim());
                REPORT_TO_BODIES.forEach(body => {
                    const label = document.createElement("label");
                    label.className = "checkbox-option";
                    
                    const cb = document.createElement("input");
                    cb.type = "checkbox";
                    cb.value = body;
                    cb.checked = taskReports.includes(body);
                    cb.className = "edit-report-to-checkbox";
                    
                    label.appendChild(cb);
                    label.appendChild(document.createTextNode(body));
                    reportToContainer.appendChild(label);
                });
                
                document.getElementById("edit-start-date").value = dateToHTMLValue(task["Start Date"]);
                document.getElementById("edit-deadline").value = dateToHTMLValue(task["Deadline"]);
                document.getElementById("edit-issues").value = task["Major Issue/Incident"] || "";
                document.getElementById("edit-actions").value = task["Action Taken"] || "";
                document.getElementById("edit-progress").value = task.progressPct !== undefined ? task.progressPct : 0;
                document.getElementById("edit-status").value = task["Status"] || "Not Start";
            }
        }
    } else {
        viewContainer.style.display = "block";
        editContainer.style.display = "none";
    }
}

// Save edits back to WBS list
function saveTaskChanges(e) {
    e.preventDefault();
    if (!state.selectedTaskId) return;
    
    const task = state.tasks.find(t => t.id === state.selectedTaskId);
    if (!task) return;
    
    const oldProgress = task.progressPct;
    const oldStatus = task["Status"];
    
    // Get form inputs
    const newName = document.getElementById("edit-task-name").value.trim();
    const newCategory = document.getElementById("edit-category").value;
    const newThrust = document.getElementById("edit-thrust").value;
    const newMilestone = document.getElementById("edit-milestone").value;
    
    // Parse checked checkboxes
    const checkedRascis = Array.from(document.querySelectorAll(".edit-rasci-checkbox:checked")).map(cb => cb.value);
    const newRasci = checkedRascis.length > 0 ? checkedRascis.join(", ") : "Dean FABE";
    
    const checkedReports = Array.from(document.querySelectorAll(".edit-report-to-checkbox:checked")).map(cb => cb.value);
    const newReportTo = checkedReports.length > 0 ? checkedReports.join(", ") : "EMC";
    
    const newStartHtml = document.getElementById("edit-start-date").value;
    const newDeadlineHtml = document.getElementById("edit-deadline").value;
    const newIssues = document.getElementById("edit-issues").value.trim();
    const newActions = document.getElementById("edit-actions").value.trim();
    let newProgress = parseInt(document.getElementById("edit-progress").value, 10) || 0;
    let newStatus = document.getElementById("edit-status").value;
    
    // Update task
    task["Task Name"] = newName;
    task["Category"] = newCategory;
    task["Strategic Thrust"] = newThrust;
    task["Milestone"] = newMilestone;
    task["RASCI"] = newRasci;
    task["Report to"] = newReportTo;
    
    task["Start Date"] = htmlValueToDate(newStartHtml);
    task["Deadline"] = htmlValueToDate(newDeadlineHtml);
    task["Month Start"] = newStartHtml ? MONTHS[parseInt(newStartHtml.split('-')[1], 10) - 1] : "";
    
    // Calculate new durations
    const startObj = parseDate(task["Start Date"]);
    const deadlineObj = parseDate(task["Deadline"]);
    if (startObj && deadlineObj) {
        task["Duration (Days)"] = getDaysBetween(startObj, deadlineObj).toString();
        task["Day Left Start(Days)"] = getDaysBetween(TODAY, startObj).toString();
        task["Day Left (Days)"] = getDaysBetween(TODAY, deadlineObj).toString();
    }
    
    task["Major Issue/Incident"] = newIssues;
    task["Action Taken"] = newActions;
    
    // Handle status / progress sync logic
    if (newStatus !== oldStatus) {
        // Status changed manually
        if (newStatus === "Completed" || newStatus === "Milestone") {
            newProgress = 100;
        } else if (newStatus === "Not Start") {
            newProgress = 0;
        } else if (newStatus === "In Progress" && (oldStatus === "Completed" || oldStatus === "Not Start" || oldStatus === "Milestone")) {
            newProgress = 50; // set sensible default
        }
    } else if (newProgress !== oldProgress) {
        // Progress changed manually
        newProgress = Math.min(100, Math.max(0, newProgress));
        if (newProgress >= 100) {
            newStatus = "Completed";
        } else if (newProgress === 0) {
            newStatus = "Not Start";
        } else {
            newStatus = "In Progress";
        }
    }
    
    task.progressPct = newProgress;
    task["Status"] = newStatus;
    task["Progress %"] = `${newProgress}.00%`;
    
    if (newStatus === "Completed") {
        task.checklist.forEach(c => c.checked = true);
        task["Progress"] = `Completed on ${formatDate(new Date())}`;
    } else if (newStatus === "Not Start") {
        task.checklist.forEach(c => c.checked = false);
        task["Progress"] = "Not Started";
    } else {
        task["Progress"] = `${newProgress}% Progress`;
    }
    
    saveState();
    addHistoryEntry(task, `Edited task properties: updated dates, owner, and metrics.`);
    setEditMode(false);
    renderTaskDetails(task);
    renderApp();
}

// Delete task
function deleteTask() {
    if (!state.selectedTaskId) return;
    
    const task = state.tasks.find(t => t.id === state.selectedTaskId);
    if (!task) return;
    
    if (confirm(`Are you sure you want to permanently delete the task "${task["Task Name"]}"?`)) {
        // Record deletion log in history first
        addHistoryEntry(task, `Deleted task: "${task["Task Name"]}"`);
        
        state.tasks = state.tasks.filter(t => t.id !== state.selectedTaskId);
        saveState();
        closeDrawer();
        renderApp();
    }
}

// Create new task template
function addNewTask() {
    const newId = `task-${Date.now()}`;
    const defaultDeadline = new Date(TODAY.getTime() + 7 * 24 * 3600 * 1000); // 7 days from now
    
    const newTask = {
        id: newId,
        "Task Name": "New Task Plan 2026",
        "Progress": "Not Started",
        "Major Issue/Incident": "",
        "Action Taken": "",
        "Report to": "EMC",
        "Strategic Thrust": "",
        "RASCI": "Dean FABE",
        "Category": "Administrative & Faculty Development",
        "Status": "Not Start",
        "Progress %": "0.00%",
        "Start Date": formatDate(TODAY),
        "Month Start": MONTHS[TODAY.getMonth()],
        "Deadline": formatDate(defaultDeadline),
        "Duration (Days)": "7",
        "Day Left Start(Days)": "0",
        "Day Left (Days)": "7",
        "Milestone": "No",
        "Link to document": "",
        progressPct: 0,
        notes: "",
        checklist: [
            { text: "Define task scope & objectives", checked: false },
            { text: "Identify key stakeholders & RASCI alignment", checked: false },
            { text: "Present draft to EMC/Senate for approval", checked: false }
        ],
        suggestions: [
            "Define task scope & objectives",
            "Identify key stakeholders & RASCI alignment",
            "Present draft to EMC/Senate for approval"
        ]
    };
    
    state.tasks.push(newTask);
    saveState();
    
    // Open drawer and put directly in edit mode for naming/dates configuration
    openDrawer(newId);
    setEditMode(true);
    
    // Smooth scroll the timeline or update UI
    renderApp();
    addHistoryEntry(newTask, "Created new WBS task");
}
