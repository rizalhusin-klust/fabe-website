document.addEventListener('DOMContentLoaded', () => {
    // Safe storage wrapper to prevent crashes in sandboxed iframes (e.g. Google Sites)
    const SafeStorage = {
        getItem(key) {
            try {
                return localStorage.getItem(key);
            } catch (e) {
                console.warn('Storage access denied, using memory fallback:', e);
                return this._memoryStore[key] || null;
            }
        },
        setItem(key, value) {
            try {
                localStorage.setItem(key, value);
            } catch (e) {
                console.warn('Storage access denied, using memory fallback:', e);
                this._memoryStore[key] = value;
            }
        },
        _memoryStore: {}
    };

    // -------------------------------------------------------------------------
    // State Management
    // -------------------------------------------------------------------------
    let currentTab = 'dashboard';
    
    // GPA Planner State
    let plannerState = {
        programId: '',
        semesters: [
            {
                id: 1,
                name: 'Semester 1',
                courses: [
                    { code: '', name: 'Sample Course 1', credits: 3, grade: 'B' },
                    { code: '', name: 'Sample Course 2', credits: 4, grade: 'A-' }
                ]
            }
        ]
    };

    // Diagnostic Survey State
    let surveyAnswers = {}; // questionId: selectedOptionIndex
    let currentQuestionIdx = 0;

    // Decision Tree State
    let currentTreeNode = 'start';

    // Load data from LocalStorage if it exists
    if (SafeStorage.getItem('fabe_handbook_planner_state')) {
        try {
            plannerState = JSON.parse(SafeStorage.getItem('fabe_handbook_planner_state'));
        } catch (e) {
            console.error('Failed to parse planner state from storage', e);
        }
    }

    // Initialize UI
    initTabs();
    initDashboard();
    initFAQExplorer();
    initGPAPlanner();
    initDiagnosticSurvey();
    initDecisionTree();

    // -------------------------------------------------------------------------
    // Tabs Controller
    // -------------------------------------------------------------------------
    function initTabs() {
        const tabButtons = document.querySelectorAll('.nav-item button');
        const panels = document.querySelectorAll('.panel-card');

        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.getAttribute('data-tab');
                if (!targetTab) return;
                
                // Update buttons
                tabButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Update panels
                panels.forEach(p => p.style.display = 'none');
                
                const activePanel = document.getElementById(`${targetTab}-panel`);
                if (activePanel) {
                    activePanel.style.display = 'block';
                    currentTab = targetTab;
                    
                    // Specific tab entry actions
                    if (currentTab === 'dashboard') {
                        updateDashboardMetrics();
                    }
                }
            });
        });
    }

    // -------------------------------------------------------------------------
    // Dashboard Controller
    // -------------------------------------------------------------------------
    function initDashboard() {
        updateDashboardMetrics();

        const dashStartBtn = document.getElementById('dash-start-assessment-btn');
        const dashViewBtn = document.getElementById('dash-view-results-btn');
        const dashRetakeBtn = document.getElementById('dash-retake-assessment-btn');

        if (dashStartBtn) {
            dashStartBtn.addEventListener('click', () => {
                document.querySelector('button[data-tab=diagnose]').click();
                showIntroScreen();
            });
        }

        if (dashViewBtn) {
            dashViewBtn.addEventListener('click', () => {
                document.querySelector('button[data-tab=diagnose]').click();
                const saved = SafeStorage.getItem('fabe_survey_result');
                if (saved) {
                    showResultsScreen(JSON.parse(saved));
                }
            });
        }

        if (dashRetakeBtn) {
            dashRetakeBtn.addEventListener('click', () => {
                document.querySelector('button[data-tab=diagnose]').click();
                startSurvey();
            });
        }
    }

    function updateDashboardMetrics() {
        // Calculate GPA metrics
        const calculations = calculateCGPA();
        
        // Update basic CGPA display
        const cgpaVal = document.getElementById('dash-cgpa-val');
        const standingVal = document.getElementById('dash-standing-val');
        const creditsVal = document.getElementById('dash-credits-val');
        
        cgpaVal.textContent = calculations.cgpa.toFixed(2);
        creditsVal.textContent = `${calculations.earnedCredits} / ${calculations.totalAttempted}`;

        // Determine standing and colors
        let statusClass = 'success';
        let standingText = 'Good Standing (GS)';
        let advisorRecommendation = 'You are in good academic standing. Keep up the great work!';

        if (calculations.cgpa < 1.50) {
            statusClass = 'danger';
            standingText = 'Dismissal Risk (AD)';
            advisorRecommendation = 'CRITICAL: Your CGPA is below 1.50. You must meet your Advisor immediately and prepare a letter of appeal to remain registered.';
        } else if (calculations.cgpa < 2.00) {
            statusClass = 'warning';
            standingText = 'Academic Probation (AP)';
            advisorRecommendation = 'WARNING: Your CGPA has dropped below 2.00. You are capped at a maximum of 12 credits next semester. Schedule an advisory session.';
        }

        standingVal.textContent = standingText;
        standingVal.className = `stat-desc ${statusClass}`;
        
        // Render advisor comment in advice container
        const adviceContainer = document.getElementById('dash-advisor-advice');
        adviceContainer.innerHTML = `
            <div class="alert-banner ${statusClass === 'success' ? 'success' : statusClass === 'warning' ? 'warning' : 'danger'}" style="margin-top: 1rem;">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <div>
                    <strong>Advisor Advisory Note:</strong> ${advisorRecommendation}
                </div>
            </div>
        `;

        // Diagnostic Risk Card
        const dashRiskVal = document.getElementById('dash-risk-val');
        const dashRiskDesc = document.getElementById('dash-risk-desc');
        const savedDiagnosis = SafeStorage.getItem('fabe_survey_result');

        const dashStartBtn = document.getElementById('dash-start-assessment-btn');
        const dashViewBtn = document.getElementById('dash-view-results-btn');
        const dashRetakeBtn = document.getElementById('dash-retake-assessment-btn');

        if (savedDiagnosis) {
            try {
                const diag = JSON.parse(savedDiagnosis);
                dashRiskVal.textContent = diag.level.toUpperCase();
                dashRiskDesc.textContent = `Score: ${diag.score}/${(diag.maxScore || 19.0).toFixed(1)}. Diagnosed: ${diag.date}`;
                dashRiskVal.className = `stat-val ${diag.level === 'high' ? 'danger' : diag.level === 'medium' ? 'warning' : 'success'}`;
                dashRiskDesc.className = `stat-desc ${diag.level === 'high' ? 'danger' : diag.level === 'medium' ? 'warning' : 'success'}`;
                
                if (dashStartBtn) dashStartBtn.style.display = 'none';
                if (dashViewBtn) dashViewBtn.style.display = 'inline-flex';
                if (dashRetakeBtn) dashRetakeBtn.style.display = 'inline-flex';
            } catch(e) {
                dashRiskVal.textContent = 'NO DATA';
                dashRiskDesc.textContent = 'Take the Risk Assessment survey.';
                if (dashStartBtn) dashStartBtn.style.display = 'inline-flex';
                if (dashViewBtn) dashViewBtn.style.display = 'none';
                if (dashRetakeBtn) dashRetakeBtn.style.display = 'none';
            }
        } else {
            dashRiskVal.textContent = 'PENDING';
            dashRiskDesc.textContent = 'Take the Study Diagnostic Survey.';
            dashRiskVal.className = 'stat-val';
            dashRiskDesc.className = 'stat-desc';
            
            if (dashStartBtn) dashStartBtn.style.display = 'inline-flex';
            if (dashViewBtn) dashViewBtn.style.display = 'none';
            if (dashRetakeBtn) dashRetakeBtn.style.display = 'none';
        }
    }

    // -------------------------------------------------------------------------
    // Handbook Search Explorer Controller
    // -------------------------------------------------------------------------
    function initFAQExplorer() {
        const searchInput = document.getElementById('faq-search-input');
        const faqListContainer = document.getElementById('faq-list-container');

        // Initial FAQ render
        renderFAQs(HANDBOOK_DATA.faqs);

        // Search action
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.toLowerCase().trim();
            if (!query) {
                renderFAQs(HANDBOOK_DATA.faqs);
                return;
            }

            const filtered = HANDBOOK_DATA.faqs.filter(faq => {
                return faq.question.toLowerCase().includes(query) || 
                       faq.answer.toLowerCase().includes(query) ||
                       faq.category.toLowerCase().includes(query) ||
                       faq.tags.some(tag => tag.includes(query));
            });

            renderFAQs(filtered, query);
        });
    }

    function renderFAQs(faqs, highlightQuery = '') {
        const faqListContainer = document.getElementById('faq-list-container');
        faqListContainer.innerHTML = '';

        if (faqs.length === 0) {
            faqListContainer.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: var(--text-muted);">
                    <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="margin: 0 auto 1rem auto; opacity: 0.5;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    <p>No handbook topics found matching your search. Try searching for "attendance", "probation", or "repeat".</p>
                </div>
            `;
            return;
        }

        faqs.forEach(faq => {
            const item = document.createElement('div');
            item.className = 'faq-item';

            let questionText = faq.question;
            let answerText = formatMarkdown(faq.answer);

            if (highlightQuery) {
                const regex = new RegExp(`(${escapeRegExp(highlightQuery)})`, 'gi');
                questionText = questionText.replace(regex, '<mark style="background: #fde047; padding: 0.1rem 0.2rem; border-radius: 2px;">$1</mark>');
            }

            item.innerHTML = `
                <button class="faq-question">
                    <span>
                        ${questionText}
                        <span class="faq-category-badge">${faq.category}</span>
                    </span>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                </button>
                <div class="faq-answer">
                    ${answerText}
                </div>
            `;

            // Toggle logic
            const btn = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');

            btn.addEventListener('click', () => {
                const isOpen = item.classList.contains('active');
                if (isOpen) {
                    item.classList.remove('active');
                    answer.style.display = 'none';
                } else {
                    item.classList.add('active');
                    answer.style.display = 'block';
                }
            });

            faqListContainer.appendChild(item);
        });
    }

    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function formatMarkdown(text) {
        // Simple client-side Markdown formatter (Bold, numbered lists, unordered lists)
        let formatted = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>');

        const lines = formatted.split('\n');
        let inList = false;
        let inNumList = false;
        let listHtml = [];

        lines.forEach(line => {
            if (line.trim().startsWith('- ')) {
                if (!inList) {
                    if (inNumList) { listHtml.push('</ol>'); inNumList = false; }
                    listHtml.push('<ul>');
                    inList = true;
                }
                listHtml.push(`<li>${line.trim().substring(2)}</li>`);
            } else if (/^\d+\.\s/.test(line.trim())) {
                if (!inNumList) {
                    if (inList) { listHtml.push('</ul>'); inList = false; }
                    listHtml.push('<ol>');
                    inNumList = true;
                }
                const content = line.trim().replace(/^\d+\.\s/, '');
                listHtml.push(`<li>${content}</li>`);
            } else {
                if (inList) { listHtml.push('</ul>'); inList = false; }
                if (inNumList) { listHtml.push('</ol>'); inNumList = false; }
                if (line.trim()) {
                    listHtml.push(`<p>${line}</p>`);
                }
            }
        });

        if (inList) listHtml.push('</ul>');
        if (inNumList) listHtml.push('</ol>');

        return listHtml.join('\n');
    }

    // -------------------------------------------------------------------------
    // GPA & CGPA Planner Controller
    // -------------------------------------------------------------------------
    function initGPAPlanner() {
        const programSelect = document.getElementById('planner-program-select');
        const addSemBtn = document.getElementById('btn-add-semester');
        const clearPlannerBtn = document.getElementById('btn-clear-planner');
        const printPlannerBtn = document.getElementById('btn-print-planner');

        // Populate Programs dropdown
        programSelect.innerHTML = '<option value="">-- Choose FABE Program (Or Start Custom) --</option>';
        HANDBOOK_DATA.programs.forEach(prog => {
            const opt = document.createElement('option');
            opt.value = prog.id;
            opt.textContent = prog.name;
            programSelect.appendChild(opt);
        });

        // Set selected value in dropdown
        programSelect.value = plannerState.programId || '';

        // Handlers
        programSelect.addEventListener('change', () => {
            const progId = programSelect.value;
            if (progId) {
                if (confirm('Importing a program template will overwrite your current schedule. Proceed?')) {
                    loadProgramTemplate(progId);
                } else {
                    programSelect.value = plannerState.programId || '';
                }
            }
        });

        addSemBtn.addEventListener('click', () => {
            const newSemId = plannerState.semesters.length > 0 ? 
                             Math.max(...plannerState.semesters.map(s => s.id)) + 1 : 1;
            
            plannerState.semesters.push({
                id: newSemId,
                name: `Semester ${newSemId}`,
                courses: [{ code: '', name: 'New Course', credits: 3, grade: '--' }]
            });
            savePlannerState();
            renderGPAPlanner();
        });

        clearPlannerBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to reset your study planner?')) {
                plannerState = {
                    programId: '',
                    semesters: [
                        {
                            id: 1,
                            name: 'Semester 1',
                            courses: [
                                { code: '', name: 'Sample Course 1', credits: 3, grade: 'B' },
                                { code: '', name: 'Sample Course 2', credits: 4, grade: 'A-' }
                            ]
                        }
                    ]
                };
                programSelect.value = '';
                savePlannerState();
                renderGPAPlanner();
            }
        });

        printPlannerBtn.addEventListener('click', () => {
            window.print();
        });

        renderGPAPlanner();
    }

    function loadProgramTemplate(progId) {
        const program = HANDBOOK_DATA.programs.find(p => p.id === progId);
        if (!program) return;

        // Group courses by their designated recommended semester from the academic roadmap
        const semMap = {};
        
        program.courses.forEach(course => {
            const semNum = course.semester || 1;
            if (!semMap[semNum]) {
                semMap[semNum] = [];
            }
            semMap[semNum].push({
                code: course.code,
                name: course.name,
                credits: course.credits,
                grade: '--' // In progress/unplanned
            });
        });

        const newSemesters = [];
        Object.keys(semMap).sort((a, b) => a - b).forEach(semNum => {
            newSemesters.push({
                id: parseInt(semNum),
                name: `Semester ${semNum} (Academic Roadmap)`,
                courses: semMap[semNum]
            });
        });

        plannerState = {
            programId: progId,
            semesters: newSemesters
        };

        savePlannerState();
        renderGPAPlanner();
    }

    function savePlannerState() {
        SafeStorage.setItem('fabe_handbook_planner_state', JSON.stringify(plannerState));
        updateDashboardMetrics();
    }

    function renderGPAPlanner() {
        const container = document.getElementById('semesters-container');
        container.innerHTML = '';

        if (plannerState.semesters.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: var(--text-muted); border: 1px dashed var(--border-color); border-radius: 8px;">
                    No semesters added. Click "+ Add Semester" below to begin planning.
                </div>
            `;
            return;
        }

        plannerState.semesters.forEach((sem, semIdx) => {
            const semBlock = document.createElement('div');
            semBlock.className = 'semester-block';
            semBlock.setAttribute('data-id', sem.id);

            // Calculate semester metrics
            const metrics = calculateSemesterGPA(sem);

            semBlock.innerHTML = `
                <div class="semester-header">
                    <div class="semester-title">
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                        <span>${sem.name}</span>
                    </div>
                    <div class="semester-summary">
                        <span>Credits: <strong>${metrics.totalCredits}</strong></span> | 
                        <span>GPA: <strong style="color: var(--color-blue);">${metrics.gpa.toFixed(2)}</strong></span>
                        <button class="btn-icon delete-sem-btn" style="margin-left: 1rem;" title="Delete Semester">
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                        </button>
                    </div>
                </div>
                <div class="semester-body">
                    <table class="course-table">
                        <thead>
                            <tr>
                                <th style="width: 15%">Course Code</th>
                                <th style="width: 45%">Course Name</th>
                                <th style="width: 15%">Credits</th>
                                <th style="width: 15%">Expected Grade</th>
                                <th class="actions"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Populated dynamically -->
                        </tbody>
                    </table>
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
                        <button class="btn-add-course">+ Add Course Row</button>
                        ${metrics.totalCredits > HANDBOOK_DATA.handbookRules.creditLimits.normalMax ? `
                            <div class="badge badge-danger">Warning: Exceeds maximum normal workload (18 credits)</div>
                        ` : ''}
                    </div>
                </div>
            `;

            const tbody = semBlock.querySelector('tbody');
            
            // Render course rows
            sem.courses.forEach((course, courseIdx) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><input type="text" class="course-code-input" placeholder="e.g. ARC1101" value="${course.code}"></td>
                    <td><input type="text" class="course-name-input" placeholder="e.g. Design Studio I" value="${course.name}"></td>
                    <td><input type="number" class="course-credits-input" min="1" max="10" value="${course.credits}"></td>
                    <td>
                        <select class="course-grade-select">
                            <option value="--">-- (In Progress)</option>
                            ${HANDBOOK_DATA.gradeScale.map(g => `<option value="${g.grade}" ${g.grade === course.grade ? 'selected' : ''}>${g.grade} (${g.desc})</option>`).join('')}
                        </select>
                    </td>
                    <td class="actions">
                        <button class="btn-icon delete-row-btn" title="Delete Course Row">
                            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                        </button>
                    </td>
                `;

                // Add input listeners to sync state
                tr.querySelector('.course-code-input').addEventListener('input', (e) => {
                    plannerState.semesters[semIdx].courses[courseIdx].code = e.target.value;
                    savePlannerState();
                });

                tr.querySelector('.course-name-input').addEventListener('input', (e) => {
                    plannerState.semesters[semIdx].courses[courseIdx].name = e.target.value;
                    savePlannerState();
                });

                tr.querySelector('.course-credits-input').addEventListener('input', (e) => {
                    const val = parseInt(e.target.value) || 0;
                    plannerState.semesters[semIdx].courses[courseIdx].credits = val;
                    savePlannerState();
                    updateSemesterTotals(semBlock, semIdx);
                });

                tr.querySelector('.course-grade-select').addEventListener('change', (e) => {
                    plannerState.semesters[semIdx].courses[courseIdx].grade = e.target.value;
                    savePlannerState();
                    updateSemesterTotals(semBlock, semIdx);
                });

                tr.querySelector('.delete-row-btn').addEventListener('click', () => {
                    plannerState.semesters[semIdx].courses.splice(courseIdx, 1);
                    if (plannerState.semesters[semIdx].courses.length === 0) {
                        plannerState.semesters[semIdx].courses.push({ code: '', name: '', credits: 3, grade: '--' });
                    }
                    savePlannerState();
                    renderGPAPlanner();
                });

                tbody.appendChild(tr);
            });

            // Semester Add course row click
            semBlock.querySelector('.btn-add-course').addEventListener('click', () => {
                plannerState.semesters[semIdx].courses.push({ code: '', name: 'New Course', credits: 3, grade: '--' });
                savePlannerState();
                renderGPAPlanner();
            });

            // Semester delete click
            semBlock.querySelector('.delete-sem-btn').addEventListener('click', () => {
                if (confirm(`Are you sure you want to delete ${sem.name}?`)) {
                    plannerState.semesters.splice(semIdx, 1);
                    savePlannerState();
                    renderGPAPlanner();
                }
            });

            container.appendChild(semBlock);
        });

        updateSummaryMetrics();
    }

    function updateSemesterTotals(semBlock, semIdx) {
        const sem = plannerState.semesters[semIdx];
        const metrics = calculateSemesterGPA(sem);
        
        // Update header values without complete rerender
        const summarySpan = semBlock.querySelector('.semester-summary');
        if (summarySpan) {
            summarySpan.innerHTML = `
                <span>Credits: <strong>${metrics.totalCredits}</strong></span> | 
                <span>GPA: <strong style="color: var(--color-blue);">${metrics.gpa.toFixed(2)}</strong></span>
                <button class="btn-icon delete-sem-btn" style="margin-left: 1rem;" title="Delete Semester">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
            `;
            
            // Re-bind click event to delete sem button
            summarySpan.querySelector('.delete-sem-btn').addEventListener('click', () => {
                if (confirm(`Are you sure you want to delete ${sem.name}?`)) {
                    plannerState.semesters.splice(semIdx, 1);
                    savePlannerState();
                    renderGPAPlanner();
                }
            });
        }
        updateSummaryMetrics();
    }

    function updateSummaryMetrics() {
        const calculations = calculateCGPA();
        
        // Update planner overview details
        const summaryCGPA = document.getElementById('planner-cgpa-val');
        const summaryCredits = document.getElementById('planner-credits-val');
        const summaryAlerts = document.getElementById('planner-alerts-container');

        summaryCGPA.textContent = calculations.cgpa.toFixed(2);
        summaryCredits.textContent = calculations.earnedCredits;

        summaryAlerts.innerHTML = '';
        
        // Check for academic probation warnings
        if (calculations.cgpa < 2.00 && calculations.totalAttempted > 0) {
            const isDismissal = calculations.cgpa < 1.50;
            const alertDiv = document.createElement('div');
            alertDiv.className = `alert-banner ${isDismissal ? 'danger' : 'warning'}`;
            alertDiv.innerHTML = `
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                <div>
                    <strong>Academic Alert:</strong> 
                    Your projected CGPA is **${calculations.cgpa.toFixed(2)}**. 
                    ${isDismissal ? 
                      'This falls below the **1.50** threshold and puts you at risk of Academic Dismissal.' : 
                      'This triggers **Academic Probation**. In your next semester, you will be restricted to a maximum of **12 credits**.'
                    }
                </div>
            `;
            summaryAlerts.appendChild(alertDiv);
        } else if (calculations.totalAttempted > 0) {
            const alertDiv = document.createElement('div');
            alertDiv.className = 'alert-banner success';
            alertDiv.innerHTML = `
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <div>
                    <strong>Normal Standing:</strong> Your projected CGPA is in good standing! You can register for 12 - 18 credits next semester.
                </div>
            `;
            summaryAlerts.appendChild(alertDiv);
        }
    }

    function calculateSemesterGPA(sem) {
        let totalCredits = 0;
        let qualityPoints = 0;
        let calculatedCredits = 0;

        sem.courses.forEach(course => {
            const cred = parseFloat(course.credits) || 0;
            totalCredits += cred;

            if (course.grade !== '--') {
                const gradeObj = HANDBOOK_DATA.gradeScale.find(g => g.grade === course.grade);
                if (gradeObj) {
                    qualityPoints += gradeObj.points * cred;
                    calculatedCredits += cred;
                }
            }
        });

        const gpa = calculatedCredits > 0 ? (qualityPoints / calculatedCredits) : 0.00;
        return { totalCredits, gpa, qualityPoints, calculatedCredits };
    }

    function calculateCGPA() {
        let totalAttempted = 0;
        let qualityPoints = 0;
        let earnedCredits = 0;

        plannerState.semesters.forEach(sem => {
            sem.courses.forEach(course => {
                const cred = parseFloat(course.credits) || 0;
                
                if (course.grade !== '--') {
                    const gradeObj = HANDBOOK_DATA.gradeScale.find(g => g.grade === course.grade);
                    if (gradeObj) {
                        qualityPoints += gradeObj.points * cred;
                        totalAttempted += cred;
                        
                        // Fail grades (D+, D, F) do not earn credits
                        if (gradeObj.points >= 1.67) { // C- is 1.67, which is a pass
                            earnedCredits += cred;
                        }
                    }
                }
            });
        });

        const cgpa = totalAttempted > 0 ? (qualityPoints / totalAttempted) : 0.00;
        return { cgpa, totalAttempted, earnedCredits };
    }

    // -------------------------------------------------------------------------
    // Study Diagnostic Survey Wizard Controller
    // -------------------------------------------------------------------------
    function initDiagnosticSurvey() {
        const startBtn = document.getElementById('btn-start-survey');
        const prevBtn = document.getElementById('btn-survey-prev');
        const nextBtn = document.getElementById('btn-survey-next');
        const restartBtn = document.getElementById('btn-survey-restart');

        startBtn.addEventListener('click', startSurvey);
        prevBtn.addEventListener('click', goPrevQuestion);
        nextBtn.addEventListener('click', goNextQuestion);
        restartBtn.addEventListener('click', startSurvey);

        // Check if there is an existing result, hide/show accordingly
        const savedDiagnosis = SafeStorage.getItem('fabe_survey_result');
        if (savedDiagnosis) {
            showResultsScreen(JSON.parse(savedDiagnosis));
        } else {
            showIntroScreen();
        }
    }

    function showIntroScreen() {
        document.getElementById('survey-intro').style.display = 'block';
        document.getElementById('survey-wizard').style.display = 'none';
        document.getElementById('survey-results').style.display = 'none';
    }

    function startSurvey() {
        surveyAnswers = {};
        currentQuestionIdx = 0;
        
        document.getElementById('survey-intro').style.display = 'none';
        document.getElementById('survey-wizard').style.display = 'block';
        document.getElementById('survey-results').style.display = 'none';
        
        renderQuestion();
    }

    function renderQuestion() {
        const question = HANDBOOK_DATA.diagnosticQuestions[currentQuestionIdx];
        const wizardBody = document.getElementById('wizard-body');
        
        // Progress update
        const progressPct = ((currentQuestionIdx) / HANDBOOK_DATA.diagnosticQuestions.length) * 100;
        document.getElementById('survey-progress-bar').style.width = `${progressPct}%`;
        document.getElementById('survey-progress-text').textContent = `Question ${currentQuestionIdx + 1} of ${HANDBOOK_DATA.diagnosticQuestions.length}`;

        wizardBody.innerHTML = `
            <div class="question-card">
                <span class="question-category">${question.category}</span>
                <h4 class="question-text">${question.text}</h4>
                <ul class="options-list">
                    ${question.options.map((opt, idx) => `
                        <li class="option-item ${surveyAnswers[question.id] === idx ? 'selected' : ''}" data-idx="${idx}">
                            <span class="option-radio"></span>
                            <span>${opt.text}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;

        // Bind clicks
        const optionItems = wizardBody.querySelectorAll('.option-item');
        optionItems.forEach(item => {
            item.addEventListener('click', () => {
                const idx = parseInt(item.getAttribute('data-idx'));
                surveyAnswers[question.id] = idx;
                
                // Toggle active class
                optionItems.forEach(oi => oi.classList.remove('selected'));
                item.classList.add('selected');

                // Enable next button
                document.getElementById('btn-survey-next').disabled = false;
                
                // Auto advance shortly after selection for slick experience
                setTimeout(() => {
                    goNextQuestion();
                }, 300);
            });
        });

        // Set action buttons
        const prevBtn = document.getElementById('btn-survey-prev');
        const nextBtn = document.getElementById('btn-survey-next');

        prevBtn.disabled = currentQuestionIdx === 0;
        nextBtn.disabled = surveyAnswers[question.id] === undefined;
        nextBtn.textContent = currentQuestionIdx === HANDBOOK_DATA.diagnosticQuestions.length - 1 ? 'Finish' : 'Next';
    }

    function goPrevQuestion() {
        if (currentQuestionIdx > 0) {
            currentQuestionIdx--;
            renderQuestion();
        }
    }

    function goNextQuestion() {
        const question = HANDBOOK_DATA.diagnosticQuestions[currentQuestionIdx];
        if (surveyAnswers[question.id] === undefined) return; // Answer required

        if (currentQuestionIdx < HANDBOOK_DATA.diagnosticQuestions.length - 1) {
            currentQuestionIdx++;
            renderQuestion();
        } else {
            processSurveyResults();
        }
    }

    function processSurveyResults() {
        let totalScore = 0;
        const feedbackItems = [];
        const recommendations = [];

        HANDBOOK_DATA.diagnosticQuestions.forEach(q => {
            const answerIdx = surveyAnswers[q.id];
            const selectedOpt = q.options[answerIdx];
            totalScore += selectedOpt.riskPoints;
            feedbackItems.push({
                category: q.category,
                question: q.text,
                selected: selectedOpt.text,
                points: selectedOpt.riskPoints,
                feedback: selectedOpt.feedback
            });

            // Generate specific action items based on poor answers
            if (q.id === 'q_attendance' && answerIdx > 0) {
                recommendations.push({
                    title: 'Check your current class attendance percentage',
                    detail: 'Go to the Academic portal. If below 80% in any course, meet the coordinator immediately to see if you can submit a late Medical Certificate (MC) or if you must apply to **Withdraw (W)** to avoid an automatic Grade F.'
                });
            }
            if (q.id === 'q_coursework' && answerIdx > 0) {
                recommendations.push({
                    title: 'Schedule a catch-up review for pending assignments',
                    detail: 'Make a list of all delayed studio deliverables and ask your lecturer if they will accept late submissions for partial credits.'
                });
            }
            if (q.id === 'q_study_hours' && answerIdx === 2) {
                recommendations.push({
                    title: 'Allocate fixed self-study/studio blocks in your schedule',
                    detail: 'Architecture and built environment degrees require a minimum of **2-3 self-study hours per credit hour** each week. Create a weekly planner blocking study times.'
                });
            }
            if (q.id === 'q_advisor' && answerIdx === 2) {
                recommendations.push({
                    title: 'Identify and contact your designated Academic Advisor',
                    detail: 'Email or visit the FABE faculty administration office to obtain the name and email of your advisor. They are essential to clear registration blocks.'
                });
            }
            if (q.id === 'q_understanding' && answerIdx === 2) {
                recommendations.push({
                    title: 'Request a consultation meeting with your lecturers',
                    detail: 'Lecturers are required to hold weekly consultation hours. Book a slot to clear doubts on difficult concepts.'
                });
            }
            if (q.id === 'q_extracurricular' && answerIdx === 2) {
                recommendations.push({
                    title: 'Evaluate external workload limitations',
                    detail: 'Capping your part-time employment to a maximum of **10-12 hours per week** is vital. If academic probation is imminent, you must prioritize coursework.'
                });
            }
            if (q.id === 'q_wellbeing' && answerIdx === 2) {
                recommendations.push({
                    title: 'Visit the University Student Counseling Centre',
                    detail: 'Academic stress is highly manageable when discussed with certified counselor support. Drop by block A or schedule an appointment.'
                });
            }
            if (q.id === 'q_itnl' && answerIdx > 0) {
                recommendations.push({
                    title: 'Apply for KLUST iTnL Academic Adjustments',
                    detail: 'Since you indicated a documented learning difficulty, sensory/physical need, or struggle with standard assessments, you are highly encouraged to submit an official request to the Inclusive Education Committee (IEC) Office to establish your Individualised Academic Plan (IAP).'
                });
            }
        });

        // Determine risk level
        let level = 'low';
        if (totalScore > 8) {
            level = 'high';
        } else if (totalScore >= 4) {
            level = 'medium';
        }

        // Add default general recommendation if score is clean
        if (recommendations.length === 0) {
            recommendations.push({
                title: 'Maintain your healthy academic habits',
                detail: 'You are performing strongly. Keep preparing early for studio presentations and reviews.'
            });
        }

        const maxScore = HANDBOOK_DATA.diagnosticQuestions.reduce((sum, q) => sum + Math.max(...q.options.map(o => o.riskPoints)), 0);

        const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        
        const result = {
            score: totalScore,
            maxScore: maxScore,
            level: level,
            date: dateStr,
            feedbackItems: feedbackItems,
            recommendations: recommendations
        };

        SafeStorage.setItem('fabe_survey_result', JSON.stringify(result));
        showResultsScreen(result);
        updateDashboardMetrics();
    }

    function showResultsScreen(result) {
        document.getElementById('survey-intro').style.display = 'none';
        document.getElementById('survey-wizard').style.display = 'none';
        
        const resultsDiv = document.getElementById('survey-results');
        resultsDiv.style.display = 'block';

        const badge = resultsDiv.querySelector('.result-header-badge');
        const desc = resultsDiv.querySelector('#result-standing-text');
        const checklist = resultsDiv.querySelector('#result-checklist');

        // Clear classes
        badge.className = 'result-header-badge';
        badge.classList.add(result.level);

        let riskLabel = 'LOW RISK';
        let riskDesc = 'You demonstrate strong study habits and are at low risk of academic probation. Maintain your attendance and submission consistency!';
        
        if (result.level === 'high') {
            riskLabel = 'HIGH ACADEMIC RISK';
            riskDesc = 'WARNING: Several indicators suggest you are experiencing significant study barriers (low attendance, delayed assignments, or stress). You face a high risk of failure or probation. Review the urgent checklist below.';
        } else if (result.level === 'medium') {
            riskLabel = 'MODERATE ACADEMIC RISK';
            riskDesc = 'ALERT: You have minor risk flags in your study plan. Implementing adjustments now will prevent you from sliding into academic probation.';
        }

        badge.innerHTML = `
            <span class="result-title">${riskLabel}</span>
            <span class="result-score">Cumulative Risk Score: <strong>${result.score.toFixed(1)} / ${(result.maxScore || 19.0).toFixed(1)}</strong></span>
        `;

        desc.innerHTML = `
            <p style="font-size: 1rem; color: var(--text-primary); margin-bottom: 0.5rem; font-weight: 500;">Assessment Date: ${result.date}</p>
            <p>${riskDesc}</p>
        `;

        // Render checklist
        checklist.innerHTML = '';
        result.recommendations.forEach(rec => {
            const li = document.createElement('li');
            li.innerHTML = `
                <svg width="18" height="18" fill="none" stroke="var(--color-blue)" viewBox="0 0 24 24" style="margin-top: 3px;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <div>
                    <strong>${rec.title}</strong>
                    <p style="margin-top: 0.15rem; font-size: 0.8rem; color: var(--text-muted);">${rec.detail}</p>
                </div>
            `;
            checklist.appendChild(li);
        });
    }

    // -------------------------------------------------------------------------
    // Decision Tree Controller
    // -------------------------------------------------------------------------
    function initDecisionTree() {
        const restartBtn = document.getElementById('btn-tree-restart');
        
        restartBtn.addEventListener('click', () => {
            currentTreeNode = 'start';
            renderTreeNode();
        });

        renderTreeNode();
    }

    function renderTreeNode() {
        const node = HANDBOOK_DATA.decisionTree[currentTreeNode];
        if (!node) return;

        const questionText = document.getElementById('tree-node-text');
        const choicesContainer = document.getElementById('tree-node-choices');

        // Check if it is a leaf node (ends with instructions and only has 'Back' action)
        const isLeaf = node.options.length === 1 && node.options[0].next === 'start';
        
        if (isLeaf) {
            questionText.innerHTML = `
                <div class="result-rich-text">
                    ${formatDecisionText(node.text)}
                </div>
            `;
        } else {
            questionText.textContent = node.text;
        }

        choicesContainer.innerHTML = '';
        node.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = opt.next === 'start' ? 'btn btn-secondary' : 'tree-choice-btn';
            
            if (opt.next === 'start') {
                btn.style.width = '100%';
                btn.style.justifyContent = 'center';
                btn.style.marginTop = '1rem';
                btn.innerHTML = `
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                    Start Over / Ask Another Question
                `;
            } else {
                btn.innerHTML = `
                    <span>${opt.text}</span>
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
                `;
            }

            btn.addEventListener('click', () => {
                currentTreeNode = opt.next;
                renderTreeNode();
            });

            choicesContainer.appendChild(btn);
        });
    }

    function formatDecisionText(text) {
        // Formats the action item results with bold headers, bullet items, and warnings
        let html = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n\n/g, '<br><br>');
            
        // Wrap Action Steps block in alert divs
        if (html.includes('Action Steps:')) {
            html = html.replace('Action Steps:', '<br><strong style="color: var(--color-blue); text-transform: uppercase; font-size: 0.8rem; letter-spacing: 0.05em;">Action Steps:</strong>');
        }

        return html;
    }
});
