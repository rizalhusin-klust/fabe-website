// -------------------------------------------------------------------------
// Global Language Switcher Engine (Bulletproof EN / 中文 Toggle)
// -------------------------------------------------------------------------
window.currentLang = 'en';

try {
    const saved = localStorage.getItem('fabe_handbook_lang');
    if (saved) window.currentLang = saved;
} catch (e) {
    console.warn('Storage read warning:', e);
}

window.toggleLanguage = function(e) {
    if (e) {
        if (typeof e.preventDefault === 'function') e.preventDefault();
        if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }
    window.currentLang = window.currentLang === 'en' ? 'zh' : 'en';
    
    try {
        localStorage.setItem('fabe_handbook_lang', window.currentLang);
    } catch (err) {
        console.warn('Storage write warning:', err);
    }

    window.applyLanguage();
};

window.applyLanguage = function() {
    const langLabel = document.getElementById('lang-toggle-label');
    if (langLabel) {
        if (window.currentLang === 'zh') {
            langLabel.innerHTML = '<span style="opacity: 0.6;">EN</span> / <strong style="color: var(--color-blue);">中文</strong>';
        } else {
            langLabel.innerHTML = '<strong style="color: var(--color-blue);">EN</strong> / <span style="opacity: 0.6;">中文</span>';
        }
    }

    const dict = (typeof HANDBOOK_DATA !== 'undefined' && HANDBOOK_DATA.translations && HANDBOOK_DATA.translations[window.currentLang]) 
        ? HANDBOOK_DATA.translations[window.currentLang] 
        : {};

    // 1. Update text for elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) {
            el.innerHTML = dict[key];
        }
    });

    // 2. Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (dict[key]) {
            el.setAttribute('placeholder', dict[key]);
        }
    });

    // 3. Trigger dynamic component re-renders
    const faqSearchInput = document.getElementById('faq-search-input');
    if (typeof window.renderFAQs === 'function' && faqSearchInput) {
        window.renderFAQs(faqSearchInput.value || '');
    }

    if (typeof window.initLecturerDirectory === 'function') {
        window.initLecturerDirectory();
    }

    if (typeof window.renderTreeNode === 'function') {
        window.renderTreeNode();
    }

    if (typeof window.renderGPAPlanner === 'function') {
        window.renderGPAPlanner();
    }

    if (typeof window.updateDashboardMetrics === 'function') {
        window.updateDashboardMetrics();
    }

    if (typeof window.renderCurriculumComponents === 'function') {
        window.renderCurriculumComponents();
    }

    if (typeof window.refreshSurveyScreen === 'function') {
        window.refreshSurveyScreen();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Safe storage wrapper to prevent crashes in sandboxed iframes
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
    let surveyAnswers = {};
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

    // Export functions to window for global access
    window.renderGPAPlanner = renderGPAPlanner;
    window.updateDashboardMetrics = updateDashboardMetrics;
    window.renderCurriculumComponents = renderCurriculumComponents;
    window.refreshSurveyScreen = refreshSurveyScreen;

    // Initialize UI
    initTabs();
    initDashboard();
    initFAQExplorer();
    initGPAPlanner();
    initDiagnosticSurvey();
    initDecisionTree();
    initCurriculumComponents();
    initLecturerDirectory();
    initLanguageToggle();

    // Initial language application
    window.applyLanguage();

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
                
                tabButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                panels.forEach(p => p.style.display = 'none');
                
                const activePanel = document.getElementById(`${targetTab}-panel`);
                if (activePanel) {
                    activePanel.style.display = 'block';
                    currentTab = targetTab;
                    
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
                const tab = document.querySelector('button[data-tab=diagnose]');
                if (tab) tab.click();
                showIntroScreen();
            });
        }

        if (dashViewBtn) {
            dashViewBtn.addEventListener('click', () => {
                const tab = document.querySelector('button[data-tab=diagnose]');
                if (tab) tab.click();
                const saved = SafeStorage.getItem('fabe_survey_result');
                if (saved) {
                    showResultsScreen(JSON.parse(saved));
                }
            });
        }

        if (dashRetakeBtn) {
            dashRetakeBtn.addEventListener('click', () => {
                const tab = document.querySelector('button[data-tab=diagnose]');
                if (tab) tab.click();
                startSurvey();
            });
        }
    }

    function updateDashboardMetrics() {
        const calculations = calculateCGPA();
        
        const cgpaVal = document.getElementById('dash-cgpa-val');
        const standingVal = document.getElementById('dash-standing-val');
        const creditsVal = document.getElementById('dash-credits-val');
        
        if (cgpaVal) cgpaVal.textContent = calculations.cgpa.toFixed(2);
        if (creditsVal) creditsVal.textContent = `${calculations.earnedCredits} / ${calculations.totalAttempted}`;

        let statusClass = 'success';
        let standingText = window.currentLang === 'zh' ? '成绩良好 (GS)' : 'Good Standing (GS)';
        let advisorRecommendation = window.currentLang === 'zh' 
            ? '您的学术成绩保持良好。请继续保持优异表现！' 
            : 'You are in good academic standing. Keep up the great work!';

        if (calculations.cgpa < 1.50) {
            statusClass = 'danger';
            standingText = window.currentLang === 'zh' ? '退学风险 (AD)' : 'Dismissal Risk (AD)';
            advisorRecommendation = window.currentLang === 'zh' 
                ? '紧急提醒：您的 CGPA 低于 1.50。您必须立即预约导师面谈并准备申诉信以维持学籍。' 
                : 'CRITICAL: Your CGPA is below 1.50. You must meet your Advisor immediately and prepare a letter of appeal to remain registered.';
        } else if (calculations.cgpa < 2.00) {
            statusClass = 'warning';
            standingText = window.currentLang === 'zh' ? '学术警告 (AP)' : 'Academic Probation (AP)';
            advisorRecommendation = window.currentLang === 'zh' 
                ? '警告提示：您的 CGPA 降至 2.00 以下。下学期您的选课将被限制为最多 12 个学分，请预约导师进行学术辅导。' 
                : 'WARNING: Your CGPA has dropped below 2.00. You are capped at a maximum of 12 credits next semester. Schedule an advisory session.';
        }

        if (standingVal) {
            standingVal.textContent = standingText;
            standingVal.className = `stat-desc ${statusClass}`;
        }
        
        const adviceContainer = document.getElementById('dash-advisor-advice');
        if (adviceContainer) {
            adviceContainer.innerHTML = `
                <div class="alert-banner ${statusClass === 'success' ? 'success' : statusClass === 'warning' ? 'warning' : 'danger'}" style="margin-top: 1rem;">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 11-18 0 0118 0z"/></svg>
                    <div>
                        <strong>${window.currentLang === 'zh' ? '导师建议提示:' : 'Advisor Advisory Note:'}</strong> ${advisorRecommendation}
                    </div>
                </div>
            `;
        }

        const dashRiskVal = document.getElementById('dash-risk-val');
        const dashRiskDesc = document.getElementById('dash-risk-desc');
        const savedDiagnosis = SafeStorage.getItem('fabe_survey_result');

        const dashStartBtn = document.getElementById('dash-start-assessment-btn');
        const dashViewBtn = document.getElementById('dash-view-results-btn');
        const dashRetakeBtn = document.getElementById('dash-retake-assessment-btn');

        if (savedDiagnosis) {
            const diag = JSON.parse(savedDiagnosis);
            if (dashRiskVal) {
                if (diag.level === 'high') {
                    dashRiskVal.textContent = window.currentLang === 'zh' ? '高学术风险' : 'HIGH RISK';
                    dashRiskVal.style.color = '#ef4444';
                    if (dashRiskDesc) dashRiskDesc.textContent = window.currentLang === 'zh' ? '警告：评估显示您存在多项显著的学习障碍，请优先参考学业改善清单。' : 'WARNING: Survey indicates significant study obstacles. Urgent action required.';
                } else if (diag.level === 'medium') {
                    dashRiskVal.textContent = window.currentLang === 'zh' ? '中度学术风险' : 'MODERATE RISK';
                    dashRiskVal.style.color = '#f59e0b';
                    if (dashRiskDesc) dashRiskDesc.textContent = window.currentLang === 'zh' ? '提示：评估显示您存在轻微学习风险，建议及时调整选课与时间分配。' : 'ALERT: Minor risk flags detected. Timely adjustments will prevent probation.';
                } else {
                    dashRiskVal.textContent = window.currentLang === 'zh' ? '低学术风险' : 'LOW RISK';
                    dashRiskVal.style.color = '#10b981';
                    if (dashRiskDesc) dashRiskDesc.textContent = window.currentLang === 'zh' ? '好消息：您的学习习惯与学业风险保持良好，请继续保持！' : 'Strong academic safety score. Keep up your attendance and study schedule!';
                }
            }
            if (dashStartBtn) dashStartBtn.style.display = 'none';
            if (dashViewBtn) dashViewBtn.style.display = 'flex';
            if (dashRetakeBtn) dashRetakeBtn.style.display = 'flex';
        } else {
            if (dashRiskVal) {
                dashRiskVal.textContent = window.currentLang === 'zh' ? '待评估' : 'PENDING';
                dashRiskVal.style.color = 'var(--text-primary)';
            }
            if (dashRiskDesc) dashRiskDesc.textContent = window.currentLang === 'zh' ? '进行诊断问卷评估，获取您的学术安全评分。' : 'Take the diagnostic questionnaire to evaluate your academic safety score.';
            if (dashStartBtn) dashStartBtn.style.display = 'flex';
            if (dashViewBtn) dashViewBtn.style.display = 'none';
            if (dashRetakeBtn) dashRetakeBtn.style.display = 'none';
        }
    }

    // -------------------------------------------------------------------------
    // Handbook Explorer (FAQ) Controller
    // -------------------------------------------------------------------------
    function initFAQExplorer() {
        const searchInput = document.getElementById('faq-search-input');

        window.renderFAQs = function(queryStr = '') {
            renderFAQs(HANDBOOK_DATA.faqs, queryStr.toLowerCase().trim());
        };

        // Initial render
        window.renderFAQs('');

        // Search listener
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                window.renderFAQs(searchInput.value || '');
            });
        }
    }

    function renderFAQs(faqs, highlightQuery = '') {
        const faqListContainer = document.getElementById('faq-list-container');
        if (!faqListContainer) return;

        faqListContainer.innerHTML = '';

        const isZh = window.currentLang === 'zh';

        const filtered = faqs.filter(faq => {
            if (!highlightQuery) return true;
            const qEn = (faq.question || '').toLowerCase();
            const aEn = (faq.answer || '').toLowerCase();
            const cEn = (faq.category || '').toLowerCase();

            const qZh = (faq.question_zh || '').toLowerCase();
            const aZh = (faq.answer_zh || '').toLowerCase();
            const cZh = (faq.category_zh || '').toLowerCase();

            const matchTags = faq.tags && faq.tags.some(t => t.toLowerCase().includes(highlightQuery));

            return qEn.includes(highlightQuery) || aEn.includes(highlightQuery) || cEn.includes(highlightQuery) ||
                   qZh.includes(highlightQuery) || aZh.includes(highlightQuery) || cZh.includes(highlightQuery) ||
                   matchTags;
        });

        if (filtered.length === 0) {
            faqListContainer.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: var(--text-muted);">
                    <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="margin: 0 auto 1rem auto; opacity: 0.5;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 11-18 0 0118 0z"/></svg>
                    <p>${isZh ? '未找到符合您搜索的规章主题。请尝试搜索 “出勤”、“警告” 或 “重修”。' : 'No handbook topics found matching your search. Try searching for "attendance", "probation", or "repeat".'}</p>
                </div>
            `;
            return;
        }

        filtered.forEach(faq => {
            const item = document.createElement('div');
            item.className = 'faq-item';

            let questionText = (isZh && faq.question_zh) ? faq.question_zh : faq.question;
            let answerRaw = (isZh && faq.answer_zh) ? faq.answer_zh : faq.answer;
            let categoryText = (isZh && faq.category_zh) ? faq.category_zh : faq.category;

            let answerText = formatMarkdown(answerRaw);

            if (highlightQuery) {
                const regex = new RegExp(`(${escapeRegExp(highlightQuery)})`, 'gi');
                questionText = questionText.replace(regex, '<mark style="background: #fde047; padding: 0.1rem 0.2rem; border-radius: 2px;">$1</mark>');
            }

            item.innerHTML = `
                <button class="faq-question">
                    <span>
                        ${questionText}
                        <span class="faq-category-badge">${categoryText}</span>
                    </span>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                </button>
                <div class="faq-answer">
                    ${answerText}
                </div>
            `;

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
        if (!text) return '';
        let formatted = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>');

        const lines = formatted.split('\n');
        let inList = false;
        let inNumList = false;
        let listHtml = [];

        lines.forEach(line => {
            const trimmed = line.trim();
            if (trimmed.startsWith('- ')) {
                if (!inList) {
                    if (inNumList) { listHtml.push('</ol>'); inNumList = false; }
                    listHtml.push('<ul>');
                    inList = true;
                }
                listHtml.push(`<li>${trimmed.substring(2)}</li>`);
            } else if (/^\d+\.\s/.test(trimmed)) {
                if (!inNumList) {
                    if (inList) { listHtml.push('</ul>'); inList = false; }
                    listHtml.push('<ol>');
                    inNumList = true;
                }
                const content = trimmed.replace(/^\d+\.\s/, '');
                listHtml.push(`<li>${content}</li>`);
            } else {
                if (inList) { listHtml.push('</ul>'); inList = false; }
                if (inNumList) { listHtml.push('</ol>'); inNumList = false; }
                if (trimmed) {
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

        if (programSelect) {
            programSelect.addEventListener('change', () => {
                const progId = programSelect.value;
                if (progId) {
                    const confirmMsg = window.currentLang === 'zh' 
                        ? '导入课程模板将覆盖当前选课计划，是否继续？' 
                        : 'Importing a program template will overwrite your current schedule. Proceed?';
                    if (confirm(confirmMsg)) {
                        loadProgramTemplate(progId);
                    } else {
                        programSelect.value = plannerState.programId || '';
                    }
                }
            });
        }

        if (addSemBtn) {
            addSemBtn.addEventListener('click', () => {
                const newSemId = plannerState.semesters.length > 0 ? 
                                 Math.max(...plannerState.semesters.map(s => s.id)) + 1 : 1;
                const semName = window.currentLang === 'zh' ? `第 ${newSemId} 学期` : `Semester ${newSemId}`;
                const courseName = window.currentLang === 'zh' ? '新课程' : 'New Course';
                
                plannerState.semesters.push({
                    id: newSemId,
                    name: semName,
                    courses: [{ code: '', name: courseName, credits: 3, grade: '--' }]
                });
                savePlannerState();
                renderGPAPlanner();
            });
        }

        if (clearPlannerBtn) {
            clearPlannerBtn.addEventListener('click', () => {
                const resetMsg = window.currentLang === 'zh' 
                    ? '您确定要重置学习规划器吗？' 
                    : 'Are you sure you want to reset your study planner?';
                if (confirm(resetMsg)) {
                    const semName = window.currentLang === 'zh' ? '第 1 学期' : 'Semester 1';
                    const c1 = window.currentLang === 'zh' ? '示例课程 1' : 'Sample Course 1';
                    const c2 = window.currentLang === 'zh' ? '示例课程 2' : 'Sample Course 2';
                    plannerState = {
                        programId: '',
                        semesters: [
                            {
                                id: 1,
                                name: semName,
                                courses: [
                                    { code: '', name: c1, credits: 3, grade: 'B' },
                                    { code: '', name: c2, credits: 4, grade: 'A-' }
                                ]
                            }
                        ]
                    };
                    if (programSelect) programSelect.value = '';
                    savePlannerState();
                    renderGPAPlanner();
                }
            });
        }

        if (printPlannerBtn) {
            printPlannerBtn.addEventListener('click', () => {
                window.print();
            });
        }

        renderGPAPlanner();
    }

    function loadProgramTemplate(progId) {
        const program = HANDBOOK_DATA.programs.find(p => p.id === progId);
        if (!program) return;

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
                grade: '--'
            });
        });

        const newSemesters = [];
        Object.keys(semMap).sort((a, b) => a - b).forEach(semNum => {
            const semTitle = window.currentLang === 'zh' 
                ? `第 ${semNum} 学期 (大纲推荐路径)` 
                : `Semester ${semNum} (Academic Roadmap)`;
            newSemesters.push({
                id: parseInt(semNum),
                name: semTitle,
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
        const programSelect = document.getElementById('planner-program-select');
        
        if (programSelect) {
            programSelect.innerHTML = window.currentLang === 'zh' 
                ? '<option value="">-- 选择 FABE 课程专业（或自定义学期）--</option>' 
                : '<option value="">-- Choose FABE Program (Or Start Custom) --</option>';
            HANDBOOK_DATA.programs.forEach(prog => {
                const opt = document.createElement('option');
                opt.value = prog.id;
                opt.textContent = (window.currentLang === 'zh' && prog.name_zh) ? prog.name_zh : prog.name;
                programSelect.appendChild(opt);
            });
            programSelect.value = plannerState.programId || '';
        }

        if (!container) return;
        container.innerHTML = '';

        const isZh = window.currentLang === 'zh';

        if (plannerState.semesters.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: var(--text-muted); border: 1px dashed var(--border-color); border-radius: 8px;">
                    ${isZh ? '未添加任何学期。点击下方 “+ 添加学期” 开始规划。' : 'No semesters added. Click "+ Add Semester" below to begin planning.'}
                </div>
            `;
            return;
        }

        plannerState.semesters.forEach((sem, semIdx) => {
            const semBlock = document.createElement('div');
            semBlock.className = 'semester-block';
            semBlock.setAttribute('data-id', sem.id);

            const metrics = calculateSemesterGPA(sem);

            semBlock.innerHTML = `
                <div class="semester-header">
                    <div class="semester-title">
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                        <span>${sem.name}</span>
                    </div>
                    <div class="semester-summary">
                        <span>${isZh ? '学分' : 'Credits'}: <strong>${metrics.totalCredits}</strong></span> | 
                        <span>GPA: <strong style="color: var(--color-blue);">${metrics.gpa.toFixed(2)}</strong></span>
                        <button class="btn-icon delete-sem-btn" style="margin-left: 1rem;" title="${isZh ? '删除学期' : 'Delete Semester'}">
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                        </button>
                    </div>
                </div>
                <div class="semester-body">
                    <table class="course-table">
                        <thead>
                            <tr>
                                <th style="width: 15%">${isZh ? '课程代码' : 'Course Code'}</th>
                                <th style="width: 45%">${isZh ? '课程名称' : 'Course Name'}</th>
                                <th style="width: 15%">${isZh ? '学分' : 'Credits'}</th>
                                <th style="width: 15%">${isZh ? '期望成绩' : 'Expected Grade'}</th>
                                <th class="actions"></th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
                        <button class="btn-add-course">${isZh ? '+ 添加课程行' : '+ Add Course Row'}</button>
                        ${metrics.totalCredits > HANDBOOK_DATA.handbookRules.creditLimits.normalMax ? `
                            <div class="badge badge-danger">${isZh ? '警告：超过单学期正常最高学分限制 (18 学分)' : 'Warning: Exceeds maximum normal workload (18 credits)'}</div>
                        ` : ''}
                    </div>
                </div>
            `;

            const tbody = semBlock.querySelector('tbody');
            
            sem.courses.forEach((course, courseIdx) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><input type="text" class="course-code-input" placeholder="e.g. ARC1101" value="${course.code}"></td>
                    <td><input type="text" class="course-name-input" placeholder="e.g. Design Studio I" value="${course.name}"></td>
                    <td><input type="number" class="course-credits-input" min="1" max="10" value="${course.credits}"></td>
                    <td>
                        <select class="course-grade-select">
                            <option value="--">${isZh ? '-- (进行中)' : '-- (In Progress)'}</option>
                            ${HANDBOOK_DATA.gradeScale.map(g => `<option value="${g.grade}" ${g.grade === course.grade ? 'selected' : ''}>${g.grade} (${g.desc})</option>`).join('')}
                        </select>
                    </td>
                    <td class="actions">
                        <button class="btn-icon delete-row-btn" title="${isZh ? '删除课程行' : 'Delete Course Row'}">
                            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                        </button>
                    </td>
                `;

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

            semBlock.querySelector('.btn-add-course').addEventListener('click', () => {
                const courseName = isZh ? '新课程' : 'New Course';
                plannerState.semesters[semIdx].courses.push({ code: '', name: courseName, credits: 3, grade: '--' });
                savePlannerState();
                renderGPAPlanner();
            });

            semBlock.querySelector('.delete-sem-btn').addEventListener('click', () => {
                const delMsg = isZh ? `确定要删除 ${sem.name} 吗？` : `Are you sure you want to delete ${sem.name}?`;
                if (confirm(delMsg)) {
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
        const isZh = window.currentLang === 'zh';
        
        const summarySpan = semBlock.querySelector('.semester-summary');
        if (summarySpan) {
            summarySpan.innerHTML = `
                <span>${isZh ? '学分' : 'Credits'}: <strong>${metrics.totalCredits}</strong></span> | 
                <span>GPA: <strong style="color: var(--color-blue);">${metrics.gpa.toFixed(2)}</strong></span>
                <button class="btn-icon delete-sem-btn" style="margin-left: 1rem;" title="${isZh ? '删除学期' : 'Delete Semester'}">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
            `;
            
            summarySpan.querySelector('.delete-sem-btn').addEventListener('click', () => {
                const delMsg = isZh ? `确定要删除 ${sem.name} 吗？` : `Are you sure you want to delete ${sem.name}?`;
                if (confirm(delMsg)) {
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
        const isZh = window.currentLang === 'zh';
        
        const summaryCGPA = document.getElementById('planner-cgpa-val');
        const summaryCredits = document.getElementById('planner-credits-val');
        const summaryAlerts = document.getElementById('planner-alerts-container');

        if (summaryCGPA) summaryCGPA.textContent = calculations.cgpa.toFixed(2);
        if (summaryCredits) summaryCredits.textContent = calculations.earnedCredits;

        if (!summaryAlerts) return;
        summaryAlerts.innerHTML = '';
        
        if (calculations.cgpa < 2.00 && calculations.totalAttempted > 0) {
            const isDismissal = calculations.cgpa < 1.50;
            const alertDiv = document.createElement('div');
            alertDiv.className = `alert-banner ${isDismissal ? 'danger' : 'warning'}`;

            const alertTitle = isZh ? '学术预警提示：' : 'Academic Alert:';
            const alertMsg = isZh 
                ? (isDismissal 
                    ? `您的预测 CGPA 为 **${calculations.cgpa.toFixed(2)}**，已低于 **1.50** 的警告线，面临退学风险。` 
                    : `您的预测 CGPA 为 **${calculations.cgpa.toFixed(2)}**，已触发 **学术警告 (Probation)**。下学期您的选课将被限制为最多 **12 个学分**。`)
                : (isDismissal
                    ? `Your projected CGPA is **${calculations.cgpa.toFixed(2)}**. This falls below the **1.50** threshold and puts you at risk of Academic Dismissal.`
                    : `Your projected CGPA is **${calculations.cgpa.toFixed(2)}**. This triggers **Academic Probation**. In your next semester, you will be restricted to a maximum of **12 credits**.`);

            alertDiv.innerHTML = `
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                <div>
                    <strong>${alertTitle}</strong> ${alertMsg}
                </div>
            `;
            summaryAlerts.appendChild(alertDiv);
        } else if (calculations.totalAttempted > 0) {
            const alertDiv = document.createElement('div');
            alertDiv.className = 'alert-banner success';
            const normTitle = isZh ? '学术状态良好：' : 'Normal Standing:';
            const normMsg = isZh 
                ? `您的预测 CGPA 保持良好！下学期您可以正常注册 12 - 18 个学分的课程。`
                : `Your projected CGPA is in good standing! You can register for 12 - 18 credits next semester.`;

            alertDiv.innerHTML = `
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 11-18 0 0118 0z"/></svg>
                <div>
                    <strong>${normTitle}</strong> ${normMsg}
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
                        
                        if (gradeObj.points >= 1.67) {
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

        if (startBtn) startBtn.addEventListener('click', startSurvey);
        if (prevBtn) prevBtn.addEventListener('click', goPrevQuestion);
        if (nextBtn) nextBtn.addEventListener('click', goNextQuestion);
        if (restartBtn) restartBtn.addEventListener('click', startSurvey);

        refreshSurveyScreen();
    }

    function refreshSurveyScreen() {
        const savedDiagnosis = SafeStorage.getItem('fabe_survey_result');
        if (savedDiagnosis) {
            showResultsScreen(JSON.parse(savedDiagnosis));
        } else {
            showIntroScreen();
        }
    }

    function showIntroScreen() {
        const intro = document.getElementById('survey-intro');
        const wizard = document.getElementById('survey-wizard');
        const results = document.getElementById('survey-results');
        if (intro) intro.style.display = 'block';
        if (wizard) wizard.style.display = 'none';
        if (results) results.style.display = 'none';
    }

    function startSurvey() {
        surveyAnswers = {};
        currentQuestionIdx = 0;
        
        const intro = document.getElementById('survey-intro');
        const wizard = document.getElementById('survey-wizard');
        const results = document.getElementById('survey-results');
        if (intro) intro.style.display = 'none';
        if (wizard) wizard.style.display = 'block';
        if (results) results.style.display = 'none';
        
        renderQuestion();
    }

    function renderQuestion() {
        const question = HANDBOOK_DATA.diagnosticQuestions[currentQuestionIdx];
        const wizardBody = document.getElementById('wizard-body');
        if (!question || !wizardBody) return;
        
        const isZh = window.currentLang === 'zh';

        const progressPct = ((currentQuestionIdx) / HANDBOOK_DATA.diagnosticQuestions.length) * 100;
        const pBar = document.getElementById('survey-progress-bar');
        const pText = document.getElementById('survey-progress-text');
        
        if (pBar) pBar.style.width = `${progressPct}%`;
        if (pText) pText.textContent = isZh 
            ? `问题 ${currentQuestionIdx + 1} / ${HANDBOOK_DATA.diagnosticQuestions.length}` 
            : `Question ${currentQuestionIdx + 1} of ${HANDBOOK_DATA.diagnosticQuestions.length}`;

        const categoryDisp = (isZh && question.category_zh) ? question.category_zh : question.category;
        const textDisp = (isZh && question.text_zh) ? question.text_zh : question.text;

        wizardBody.innerHTML = `
            <div class="question-card">
                <span class="question-category">${categoryDisp}</span>
                <h4 class="question-text">${textDisp}</h4>
                <ul class="options-list">
                    ${question.options.map((opt, idx) => `
                        <li class="option-item ${surveyAnswers[question.id] === idx ? 'selected' : ''}" data-idx="${idx}">
                            <span class="option-radio"></span>
                            <span>${(isZh && opt.text_zh ? opt.text_zh : opt.text)}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;

        const optionItems = wizardBody.querySelectorAll('.option-item');
        optionItems.forEach(item => {
            item.addEventListener('click', () => {
                const idx = parseInt(item.getAttribute('data-idx'));
                surveyAnswers[question.id] = idx;
                
                optionItems.forEach(oi => oi.classList.remove('selected'));
                item.classList.add('selected');

                const nBtn = document.getElementById('btn-survey-next');
                if (nBtn) nBtn.disabled = false;
                
                setTimeout(() => {
                    goNextQuestion();
                }, 300);
            });
        });

        const prevBtn = document.getElementById('btn-survey-prev');
        const nextBtn = document.getElementById('btn-survey-next');

        if (prevBtn) {
            prevBtn.disabled = currentQuestionIdx === 0;
            prevBtn.textContent = isZh ? '上一步' : 'Back';
        }

        if (nextBtn) {
            nextBtn.disabled = surveyAnswers[question.id] === undefined;
            nextBtn.textContent = currentQuestionIdx === HANDBOOK_DATA.diagnosticQuestions.length - 1 
                ? (isZh ? '完成' : 'Finish') 
                : (isZh ? '下一步' : 'Next');
        }
    }

    function goPrevQuestion() {
        if (currentQuestionIdx > 0) {
            currentQuestionIdx--;
            renderQuestion();
        }
    }

    function goNextQuestion() {
        const question = HANDBOOK_DATA.diagnosticQuestions[currentQuestionIdx];
        if (surveyAnswers[question.id] === undefined) return;

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
        const isZh = window.currentLang === 'zh';

        HANDBOOK_DATA.diagnosticQuestions.forEach(q => {
            const answerIdx = surveyAnswers[q.id];
            const selectedOpt = q.options[answerIdx];
            totalScore += selectedOpt.riskPoints;
            feedbackItems.push({
                category: (isZh && q.category_zh ? q.category_zh : q.category),
                question: (isZh && q.text_zh ? q.text_zh : q.text),
                selected: (isZh && selectedOpt.text_zh ? selectedOpt.text_zh : selectedOpt.text),
                points: selectedOpt.riskPoints,
                feedback: (isZh && selectedOpt.feedback_zh ? selectedOpt.feedback_zh : selectedOpt.feedback)
            });

            if (q.id === 'q_attendance' && answerIdx > 0) {
                recommendations.push({
                    title: isZh ? '检查您目前的课程出勤率百分比' : 'Check your current class attendance percentage',
                    detail: isZh ? '登录学术门户网站。如果任何课程出勤率低于 80%，请立即联系课程协调老师，确认是否可以补交医疗证明 (MC)，或申请退课 (Withdraw - W) 以避免记 F 级。' : 'Go to the Academic portal. If below 80% in any course, meet the coordinator immediately to see if you can submit a late Medical Certificate (MC) or if you must apply to **Withdraw (W)** to avoid an automatic Grade F.'
                });
            }
            if (q.id === 'q_coursework' && answerIdx > 0) {
                recommendations.push({
                    title: isZh ? '为未完成的作业安排补交复习时间' : 'Schedule a catch-up review for pending assignments',
                    detail: isZh ? '列出所有延迟的工作室设计作业，并询问讲师是否接受延迟提交以获取部分学分。' : 'Make a list of all delayed studio deliverables and ask your lecturer if they will accept late submissions for partial credits.'
                });
            }
            if (q.id === 'q_study_hours' && answerIdx === 2) {
                recommendations.push({
                    title: isZh ? '在日程表中预留固定的自学/工作室设计时间' : 'Allocate fixed self-study/studio blocks in your schedule',
                    detail: isZh ? '建筑与 Built Environment 专业要求每周每个学分至少安排 **2-3 小时自学时间**。请制定包含固定学习时段的每周计划。' : 'Architecture and built environment degrees require a minimum of **2-3 self-study hours per credit hour** each week. Create a weekly planner blocking study times.'
                });
            }
            if (q.id === 'q_advisor' && answerIdx === 2) {
                recommendations.push({
                    title: isZh ? '查找并联系您指定的学术导师' : 'Identify and contact your designated Academic Advisor',
                    detail: isZh ? '向 FABE 学院行政办公室发送电子邮件或前往办公室以获取导师的姓名和邮箱。导师对于解锁选课限制至关重要。' : 'Email or visit the FABE faculty administration office to obtain the name and email of your advisor. They are essential to clear registration blocks.'
                });
            }
            if (q.id === 'q_understanding' && answerIdx === 2) {
                recommendations.push({
                    title: isZh ? '预约授课讲师的答疑咨询时间' : 'Request a consultation meeting with your lecturers',
                    detail: isZh ? '讲师每周均留有答疑咨询时间。请预约名额以厘清复杂概念。' : 'Lecturers are required to hold weekly consultation hours. Book a slot to clear doubts on difficult concepts.'
                });
            }
            if (q.id === 'q_extracurricular' && answerIdx === 2) {
                recommendations.push({
                    title: isZh ? '评估并限制外部工作负荷' : 'Evaluate external workload limitations',
                    detail: isZh ? '将兼职工作限制在每周最多 **10-12 小时** 非常重要。如果面临学术警告风险，必须优先保证课程学习。' : 'Capping your part-time employment to a maximum of **10-12 hours per week** is vital. If academic probation is imminent, you must prioritize coursework.'
                });
            }
            if (q.id === 'q_wellbeing' && answerIdx === 2) {
                recommendations.push({
                    title: isZh ? '前往大学学生心理咨询中心寻求支持' : 'Visit the University Student Counseling Centre',
                    detail: isZh ? '在专业心理咨询师的帮助下，学术压力是完全可以有效化解的。欢迎前往咨询中心或预约会面。' : 'Academic stress is highly manageable when discussed with certified counselor support. Drop by block A or schedule an appointment.'
                });
            }
            if (q.id === 'q_itnl' && answerIdx > 0) {
                recommendations.push({
                    title: isZh ? '申请 KLUST iTnL 包容性学术调整' : 'Apply for KLUST iTnL Academic Adjustments',
                    detail: isZh ? '如果您存在学习困难、感官/身体需求或在标准评估中遇到障碍，强烈建议向包容性教育委员会 (IEC) 办公室提交正式申请以确立您的个体化学术计划 (IAP)。' : 'Since you indicated a documented learning difficulty, sensory/physical need, or struggle with standard assessments, you are highly encouraged to submit an official request to the Inclusive Education Committee (IEC) Office to establish your Individualised Academic Plan (IAP).'
                });
            }
        });

        let level = 'low';
        if (totalScore > 8) {
            level = 'high';
        } else if (totalScore >= 4) {
            level = 'medium';
        }

        if (recommendations.length === 0) {
            recommendations.push({
                title: isZh ? '保持良好的学习习惯' : 'Maintain your healthy academic habits',
                detail: isZh ? '您的学业表现非常优异。请继续提前为工作室答辩与审查做好充分准备。' : 'You are performing strongly. Keep preparing early for studio presentations and reviews.'
            });
        }

        const maxScore = HANDBOOK_DATA.diagnosticQuestions.reduce((sum, q) => sum + Math.max(...q.options.map(o => o.riskPoints)), 0);
        const dateStr = new Date().toLocaleDateString(isZh ? 'zh-CN' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        
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
        const intro = document.getElementById('survey-intro');
        const wizard = document.getElementById('survey-wizard');
        const resultsDiv = document.getElementById('survey-results');
        
        if (intro) intro.style.display = 'none';
        if (wizard) wizard.style.display = 'none';
        if (!resultsDiv) return;
        
        resultsDiv.style.display = 'block';

        const badge = resultsDiv.querySelector('.result-header-badge');
        const desc = resultsDiv.querySelector('#result-standing-text');
        const checklist = resultsDiv.querySelector('#result-checklist');
        const isZh = window.currentLang === 'zh';

        if (badge) {
            badge.className = 'result-header-badge';
            badge.classList.add(result.level);

            let riskLabel = isZh ? '低学术风险' : 'LOW RISK';
            if (result.level === 'high') {
                riskLabel = isZh ? '高学术风险' : 'HIGH ACADEMIC RISK';
            } else if (result.level === 'medium') {
                riskLabel = isZh ? '中度学术风险' : 'MODERATE ACADEMIC RISK';
            }

            badge.innerHTML = `
                <span class="result-title">${riskLabel}</span>
                <span class="result-score">${isZh ? '累积风险评估分值' : 'Cumulative Risk Score'}: <strong>${result.score.toFixed(1)} / ${(result.maxScore || 19.0).toFixed(1)}</strong></span>
            `;
        }

        if (desc) {
            let riskDesc = isZh 
                ? '您展现出良好的学习习惯，处于极低学术警告风险中。请继续保持良好的出勤与作业提交！' 
                : 'You demonstrate strong study habits and are at low risk of academic probation. Maintain your attendance and submission consistency!';
            
            if (result.level === 'high') {
                riskDesc = isZh 
                    ? '警告：评估指标显示您正在经历显著的学习障碍（出勤率低、作业延期或心理压力大）。您面临较高的不及格或警告风险，请优先参考下方的紧急改善清单。' 
                    : 'WARNING: Several indicators suggest you are experiencing significant study barriers (low attendance, delayed assignments, or stress). You face a high risk of failure or probation. Review the urgent checklist below.';
            } else if (result.level === 'medium') {
                riskDesc = isZh 
                    ? '提示：您的学习计划中存在轻微风险预警。现在进行适当调整可防止滑入学术警告状态。' 
                    : 'ALERT: You have minor risk flags in your study plan. Implementing adjustments now will prevent you from sliding into academic probation.';
            }

            desc.innerHTML = `
                <p style="font-size: 1rem; color: var(--text-primary); margin-bottom: 0.5rem; font-weight: 500;">${isZh ? '评估日期' : 'Assessment Date'}: ${result.date}</p>
                <p>${riskDesc}</p>
            `;
        }

        if (checklist) {
            checklist.innerHTML = '';
            result.recommendations.forEach(rec => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <svg width="18" height="18" fill="none" stroke="var(--color-blue)" viewBox="0 0 24 24" style="margin-top: 3px;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 11-18 0 0118 0z"/></svg>
                    <div>
                        <strong>${rec.title}</strong>
                        <p style="margin-top: 0.15rem; font-size: 0.8rem; color: var(--text-muted);">${rec.detail}</p>
                    </div>
                `;
                checklist.appendChild(li);
            });
        }
    }

    // -------------------------------------------------------------------------
    // Decision Tree Controller (Troubleshooter)
    // -------------------------------------------------------------------------
    function initDecisionTree() {
        const restartBtn = document.getElementById('btn-tree-restart');
        
        if (restartBtn) {
            restartBtn.addEventListener('click', () => {
                currentTreeNode = 'start';
                renderTreeNode();
            });
        }

        window.renderTreeNode = renderTreeNode;
        renderTreeNode();
    }

    function renderTreeNode() {
        const node = HANDBOOK_DATA.decisionTree[currentTreeNode];
        if (!node) return;

        const questionText = document.getElementById('tree-node-text');
        const choicesContainer = document.getElementById('tree-node-choices');
        if (!questionText || !choicesContainer) return;

        const isZh = window.currentLang === 'zh';
        const activeText = (isZh && node.text_zh) ? node.text_zh : node.text;

        const isLeaf = node.options.length === 1 && node.options[0].next === 'start';
        
        if (isLeaf) {
            questionText.innerHTML = `
                <div class="result-rich-text">
                    ${formatDecisionText(activeText)}
                </div>
            `;
        } else {
            questionText.textContent = activeText;
        }

        choicesContainer.innerHTML = '';
        node.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = opt.next === 'start' ? 'btn btn-secondary' : 'tree-choice-btn';
            
            const btnText = (isZh && opt.text_zh) ? opt.text_zh : opt.text;

            if (opt.next === 'start') {
                btn.style.width = '100%';
                btn.style.justifyContent = 'center';
                btn.style.marginTop = '1rem';
                btn.innerHTML = `
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                    ${isZh ? '重新开始 / 选择其他问题' : 'Start Over / Ask Another Question'}
                `;
            } else {
                btn.innerHTML = `
                    <span>${btnText}</span>
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
        let html = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n\n/g, '<br><br>');
            
        if (html.includes('Action Steps:')) {
            html = html.replace('Action Steps:', '<br><strong style="color: var(--color-blue); text-transform: uppercase; font-size: 0.8rem; letter-spacing: 0.05em;">Action Steps:</strong>');
        } else if (html.includes('行动步骤：')) {
            html = html.replace('行动步骤：', '<br><strong style="color: var(--color-blue); text-transform: uppercase; font-size: 0.8rem; letter-spacing: 0.05em;">行动步骤：</strong>');
        }

        return html;
    }

    // -------------------------------------------------------------------------
    // Curriculum Components Controller
    // -------------------------------------------------------------------------
    function initCurriculumComponents() {
        const progContainer = document.getElementById('curr-program-selectors');
        const creditContainer = document.getElementById('curr-credit-card-container');
        const mpuContainer = document.getElementById('curr-mpu-selectors');
        const mpuTablesContainer = document.getElementById('curr-mpu-tables-container');

        if (!progContainer || !creditContainer || !mpuContainer || !mpuTablesContainer) return;

        window.renderCurriculumComponents = function() {
            renderCurriculumComponentsUI();
        };

        renderCurriculumComponentsUI();

        function renderCurriculumComponentsUI() {
            const isZh = window.currentLang === 'zh';
            const creditsData = HANDBOOK_DATA.curriculumCredits || [];

            let activeProgIndex = 2;
            const currentActiveBtn = progContainer.querySelector('.curr-tab-btn.active');
            if (currentActiveBtn) {
                const idxAttr = currentActiveBtn.getAttribute('data-idx');
                if (idxAttr !== null) activeProgIndex = parseInt(idxAttr);
            }

            progContainer.innerHTML = '';
            creditsData.forEach((prog, index) => {
                const btn = document.createElement('button');
                btn.className = 'curr-tab-btn';
                btn.setAttribute('data-idx', index);
                if (index === activeProgIndex) btn.classList.add('active');
                
                const rawName = (isZh && prog.program_zh) ? prog.program_zh : prog.program;
                btn.textContent = rawName;
                
                btn.addEventListener('click', () => {
                    progContainer.querySelectorAll('.curr-tab-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    renderProgramCredits(prog);
                });
                progContainer.appendChild(btn);
            });

            if (creditsData[activeProgIndex]) {
                renderProgramCredits(creditsData[activeProgIndex]);
            } else if (creditsData.length > 0) {
                renderProgramCredits(creditsData[0]);
            }

            // MPU selectors
            const mpuData = HANDBOOK_DATA.mpuRequirements || {};
            let activeMpuKey = 'bachelor_loc';
            const currentActiveMpuBtn = mpuContainer.querySelector('.curr-tab-btn.active');
            if (currentActiveMpuBtn) {
                const keyAttr = currentActiveMpuBtn.getAttribute('data-key');
                if (keyAttr) activeMpuKey = keyAttr;
            }

            mpuContainer.innerHTML = '';
            Object.entries(mpuData).forEach(([key, value]) => {
                const btn = document.createElement('button');
                btn.className = 'curr-tab-btn';
                btn.setAttribute('data-key', key);
                if (key === activeMpuKey) btn.classList.add('active');
                
                btn.textContent = (isZh && value.title_zh) ? value.title_zh : value.title;
                btn.addEventListener('click', () => {
                    mpuContainer.querySelectorAll('.curr-tab-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    renderMpuRequirements(value);
                });
                mpuContainer.appendChild(btn);
            });

            if (mpuData[activeMpuKey]) {
                renderMpuRequirements(mpuData[activeMpuKey]);
            }
        }

        function renderProgramCredits(prog) {
            const isZh = window.currentLang === 'zh';
            const corePct = Math.round((prog.core / prog.total) * 100);
            const mpuPct = Math.round((prog.mpu / prog.total) * 100);
            const elecPct = Math.round((prog.elective / prog.total) * 100);

            const progTitle = (isZh && prog.program_zh) ? prog.program_zh : prog.program;
            const progDetail = (isZh && prog.detail_zh) ? prog.detail_zh : prog.detail;

            let electiveRow = '';
            if (prog.elective > 0) {
                electiveRow = `
                    <tr class="hover-row">
                        <td style="padding: 0.75rem 1rem;"><strong>${isZh ? '专业选修课程' : 'Elective Courses'}</strong></td>
                        <td style="text-align: center; padding: 0.75rem 1rem;"><strong>${prog.elective}</strong></td>
                        <td style="font-size: 0.85rem; color: var(--text-secondary); padding: 0.75rem 1rem;">${isZh ? '从预设课程列表中选择以探索专业领域的课程。' : 'Courses chosen from a predefined list to explore specialized areas.'}</td>
                    </tr>
                `;
            } else {
                electiveRow = `
                    <tr class="hover-row">
                        <td style="padding: 0.75rem 1rem;"><strong>${isZh ? '专业选修课程' : 'Elective Courses'}</strong></td>
                        <td style="text-align: center; padding: 0.75rem 1rem;"><strong>0</strong></td>
                        <td style="font-size: 0.85rem; color: var(--text-secondary); font-style: italic; padding: 0.75rem 1rem;">${isZh ? '本课程专业无需修读选修课程。' : 'No elective courses are required for this program.'}</td>
                    </tr>
                `;
            }

            creditContainer.innerHTML = `
                <div class="stat-card" style="border-color: rgba(30, 64, 175, 0.15); background: var(--bg-primary); padding: 1.5rem; display: flex; flex-direction: column; gap: 1.5rem; border-radius: 10px;">
                    <div>
                        <h3 style="font-family: var(--font-heading); font-size: 1.25rem; color: var(--text-primary); font-weight: 700; margin-bottom: 0.35rem; margin-top: 0;">${progTitle}</h3>
                        <p style="font-size: 0.9rem; color: var(--text-secondary); margin: 0;">${progDetail}</p>
                    </div>

                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem; font-size: 0.85rem;">
                                <span style="font-weight: 600; color: var(--text-primary);">${isZh ? '核心专业课程' : 'Core Courses'}</span>
                                <span style="font-weight: 600; color: var(--color-blue);">${prog.core} / ${prog.total} ${isZh ? '学分' : 'Credits'} (${corePct}%)</span>
                            </div>
                            <div style="width: 100%; height: 8px; background: rgba(0,0,0,0.05); border-radius: 4px; overflow: hidden;">
                                <div style="width: ${corePct}%; height: 100%; background: var(--color-blue); border-radius: 4px;"></div>
                            </div>
                        </div>

                        <div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem; font-size: 0.85rem;">
                                <span style="font-weight: 600; color: var(--text-primary);">${isZh ? 'MPU / 大学通识科目' : 'MPU / University Subjects'}</span>
                                <span style="font-weight: 600; color: var(--color-emerald);">${prog.mpu} / ${prog.total} ${isZh ? '学分' : 'Credits'} (${mpuPct}%)</span>
                            </div>
                            <div style="width: 100%; height: 8px; background: rgba(0,0,0,0.05); border-radius: 4px; overflow: hidden;">
                                <div style="width: ${mpuPct}%; height: 100%; background: var(--color-emerald); border-radius: 4px;"></div>
                            </div>
                        </div>

                        <div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem; font-size: 0.85rem;">
                                <span style="font-weight: 600; color: var(--text-primary);">${isZh ? '专业选修课程' : 'Elective Courses'}</span>
                                <span style="font-weight: 600; color: var(--color-amber);">${prog.elective} / ${prog.total} ${isZh ? '学分' : 'Credits'} (${elecPct}%)</span>
                            </div>
                            <div style="width: 100%; height: 8px; background: rgba(0,0,0,0.05); border-radius: 4px; overflow: hidden;">
                                <div style="width: ${elecPct}%; height: 100%; background: var(--color-amber); border-radius: 4px;"></div>
                            </div>
                        </div>
                    </div>

                    <div style="overflow-x: auto;">
                        <table class="checklist-table" style="width: 100%; border-collapse: collapse; min-width: 500px; margin: 0;">
                            <thead>
                                <tr style="border-bottom: 2px solid var(--border-color); background: rgba(0,0,0,0.02);">
                                    <th style="text-align: left; padding: 0.75rem 1rem; width: 30%; font-weight: 600; color: var(--text-primary);">${isZh ? '科目类别' : 'Subject Category'}</th>
                                    <th style="text-align: center; padding: 0.75rem 1rem; width: 20%; font-weight: 600; color: var(--text-primary);">${isZh ? '要求学分' : 'Required Credits'}</th>
                                    <th style="text-align: left; padding: 0.75rem 1rem; width: 50%; font-weight: 600; color: var(--text-primary);">${isZh ? '课程说明' : 'Description'}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="hover-row">
                                    <td style="padding: 0.75rem 1rem;"><strong>${isZh ? '核心专业课程' : 'Core Courses'}</strong></td>
                                    <td style="text-align: center; padding: 0.75rem 1rem;"><strong>${prog.core}</strong></td>
                                    <td style="font-size: 0.85rem; color: var(--text-secondary); padding: 0.75rem 1rem;">${isZh ? '构成专业知识基础的必修核心科目。可在GPA与学习规划器中查看逐学期的明细。' : 'Compulsory major subjects that provide foundational knowledge.'}</td>
                                </tr>
                                <tr class="hover-row">
                                    <td style="padding: 0.75rem 1rem;"><strong>${isZh ? 'MPU / 大学通识科目' : 'MPU / University Subjects'}</strong></td>
                                    <td style="text-align: center; padding: 0.75rem 1rem;"><strong>${prog.mpu}</strong></td>
                                    <td style="font-size: 0.85rem; color: var(--text-secondary); padding: 0.75rem 1rem;">${isZh ? '教育部规定的必修通识科目。详见下方表格。' : 'Compulsory subjects mandated by the Ministry of Higher Education.'}</td>
                                </tr>
                                ${electiveRow}
                                <tr style="background: rgba(30, 64, 175, 0.04); border-top: 2px solid var(--border-color);">
                                    <td style="padding: 0.75rem 1rem;"><strong style="color: var(--color-blue);">${isZh ? '毕业要求总学分' : 'Total for Graduation'}</strong></td>
                                    <td style="text-align: center; padding: 0.75rem 1rem;"><strong style="color: var(--color-blue); font-size: 1.1rem;">${prog.total}</strong></td>
                                    <td style="font-size: 0.85rem; font-weight: 600; color: var(--text-primary); padding: 0.75rem 1rem;">${isZh ? '学生的修业进度将对照此总学分进行审核。' : "A student's progress is checked against this total."}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        }

        function renderMpuRequirements(req) {
            const isZh = window.currentLang === 'zh';
            let categoriesHtml = '';
            const ruleText = (isZh && req.rule_zh) ? req.rule_zh : req.rule;

            for (const [catName, subjects] of Object.entries(req.categories)) {
                let rows = '';
                subjects.forEach(sub => {
                    let nameCell = sub.name;
                    if (sub.note) {
                        nameCell += ` <span style="font-size: 0.7rem; font-weight: 600; color: #E4002B; background: rgba(228, 0, 43, 0.06); padding: 0.1rem 0.35rem; border-radius: 4px; margin-left: 0.25rem; display: inline-block;">${sub.note}</span>`;
                    }
                    rows += `
                        <tr class="hover-row" style="border-bottom: 1px solid var(--border-color);">
                            <td style="font-family: monospace; font-weight: 600; color: var(--text-primary); font-size: 0.8rem; padding: 0.5rem 0.75rem; width: 25%;">${sub.code}</td>
                            <td style="font-size: 0.85rem; color: var(--text-secondary); padding: 0.5rem 0.75rem; width: 65%;">${nameCell}</td>
                            <td style="text-align: center; font-weight: 600; color: var(--text-primary); font-size: 0.85rem; padding: 0.5rem 0.75rem; width: 10%;">${sub.credits}</td>
                        </tr>
                    `;
                });

                categoriesHtml += `
                    <div class="stat-card" style="background: var(--bg-primary); border-color: var(--border-color); padding: 1.25rem; border-radius: 8px;">
                        <h4 style="font-family: var(--font-heading); font-size: 1.05rem; color: var(--color-blue); font-weight: 700; margin-bottom: 0.75rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; display: flex; align-items: center; justify-content: space-between; margin-top: 0;">
                            ${isZh ? '组别 ' + catName : 'Group ' + catName}
                            <span style="font-size: 0.75rem; font-weight: 600; color: var(--text-muted); background: var(--bg-secondary); padding: 0.15rem 0.4rem; border-radius: 4px;">${subjects.length} ${isZh ? '门科目' : 'Subjects'}</span>
                        </h4>
                        <div style="overflow-x: auto;">
                            <table style="width: 100%; border-collapse: collapse; margin: 0;">
                                <thead>
                                    <tr style="border-bottom: 2px solid var(--border-color); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); font-weight: 600;">
                                        <th style="text-align: left; padding-bottom: 0.5rem; padding-left: 0.75rem;">${isZh ? '课程代码' : 'Code'}</th>
                                        <th style="text-align: left; padding-bottom: 0.5rem; padding-left: 0.75rem;">${isZh ? '科目名称' : 'Subject Name'}</th>
                                        <th style="text-align: center; padding-bottom: 0.5rem; padding-right: 0.75rem;">${isZh ? '学分' : 'CR'}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${rows}
                                </tbody>
                            </table>
                        </div>
                    </div>
                `;
            }

            mpuTablesContainer.innerHTML = `
                <div style="background: rgba(228, 0, 43, 0.03); border-left: 4px solid #E4002B; border-radius: 4px 8px 8px 4px; padding: 1rem; margin-bottom: 0.5rem;">
                    <strong style="color: #E4002B; font-size: 0.85rem; font-weight: 700; display: block; margin-bottom: 0.25rem; text-transform: uppercase;">${isZh ? '选课规则说明：' : 'Selection Rules:'}</strong>
                    <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; margin: 0;">
                        ${ruleText}
                    </p>
                </div>

                <div class="mpu-categories-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem;">
                    ${categoriesHtml}
                </div>
            `;
        }
    }

    // -------------------------------------------------------------------------
    // Lecturer Directory Controller
    // -------------------------------------------------------------------------
    function initLecturerDirectory() {
        const searchInput = document.getElementById('lecturer-search-input');
        const deptFilter = document.getElementById('lecturer-program-filter');
        const gridContainer = document.getElementById('lecturers-grid-container');

        if (!gridContainer) return;

        const isZh = window.currentLang === 'zh';

        if (deptFilter) {
            const selectedVal = deptFilter.value || 'all';
            deptFilter.innerHTML = `
                <option value="all">${isZh ? '所有部门 / 职位' : 'All Departments / Roles'}</option>
                <option value="architecture">${isZh ? '建筑学系' : 'Architecture'}</option>
                <option value="quantity-surveying">${isZh ? '工料测量系' : 'Quantity Surveying'}</option>
                <option value="landscape-architecture">${isZh ? '景观建筑学系' : 'Landscape Architecture'}</option>
                <option value="management">${isZh ? '管理与其它' : 'Management & Others'}</option>
            `;
            deptFilter.value = selectedVal;
        }

        const staff = HANDBOOK_DATA.staffProfiles || [];

        if (searchInput) {
            searchInput.removeEventListener('input', updateFilters);
            searchInput.addEventListener('input', updateFilters);
        }
        if (deptFilter) {
            deptFilter.removeEventListener('change', updateFilters);
            deptFilter.addEventListener('change', updateFilters);
        }

        updateFilters();

        function updateFilters() {
            const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
            const dept = deptFilter ? deptFilter.value : 'all';

            const filtered = staff.filter(member => {
                const matchQuery = member.name.toLowerCase().includes(query) || 
                                   member.qualification.toLowerCase().includes(query) ||
                                   (member.specialization && member.specialization.toLowerCase().includes(query)) ||
                                   member.position.toLowerCase().includes(query);
                
                const matchDept = dept === 'all' || member.department === dept;

                return matchQuery && matchDept;
            });

            renderDirectory(filtered);
        }

        function getInitialsAvatar(name) {
            const cleanName = name.replace(/^(Ts|Ar|Sr|Dr\.|Assoc\.\s*Prof\s*)\s+/i, '').trim();
            const parts = cleanName.split(' ');
            let initials = '';
            if (parts.length > 0 && parts[0]) initials += parts[0][0];
            if (parts.length > 1 && parts[1]) initials += parts[1][0];
            initials = initials.toUpperCase();

            let hash = 0;
            for (let i = 0; i < cleanName.length; i++) {
                hash = cleanName.charCodeAt(i) + ((hash << 5) - hash);
            }
            
            const hue1 = Math.abs(hash % 360);
            const hue2 = (hue1 + 45) % 360;
            const grad = `linear-gradient(135deg, hsl(${hue1}, 70%, 50%) 0%, hsl(${hue2}, 70%, 40%) 100%)`;
            
            return `
                <div class="lecturer-avatar" style="width: 60px; height: 60px; border-radius: 50%; background: ${grad}; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 1.25rem; font-family: var(--font-heading); box-shadow: 0 4px 8px rgba(0,0,0,0.08); border: 2px solid white; flex-shrink: 0;">
                    ${initials}
                </div>
            `;
        }

        function renderDirectory(list) {
            gridContainer.innerHTML = '';
            const isZhNow = window.currentLang === 'zh';

            if (list.length === 0) {
                gridContainer.innerHTML = `
                    <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-muted);">
                        <svg width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" style="margin: 0 auto 1rem auto; opacity: 0.5;"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A11.978 11.978 0 0112.25 18c-.896-.083-1.78-.21-2.65-.378M12 18.25c-.896-.083-1.78-.21-2.65-.378m-2.65-.378a9.33 9.33 0 01-2.625-.372 9.337 9.337 0 01-4.121-.952 4.125 4.125 0 017.533-2.493M16.5 10.5a3 3 0 11-6 0 3 3 0 016 0zM6.75 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 12a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5zM4.5 12a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z"/></svg>
                        <p style="margin: 0; font-size: 0.95rem; font-weight: 500;">${isZhNow ? '未找到符合筛选条件的讲师。' : 'No lecturers found matching your filters.'}</p>
                    </div>
                `;
                return;
            }

            list.forEach(member => {
                const avatar = getInitialsAvatar(member.name);
                const card = document.createElement('div');
                card.className = 'lecturer-card-wrapper';
                
                card.innerHTML = `
                    <div class="stat-card" style="background: var(--bg-primary); border-color: var(--border-color); padding: 1.25rem; display: flex; flex-direction: column; gap: 1rem; border-radius: 10px; height: 100%; transition: all 0.2s ease; box-shadow: var(--shadow-sm);">
                        <div style="display: flex; gap: 1rem; align-items: center;">
                            ${avatar}
                            <div>
                                <h3 style="font-family: var(--font-heading); font-size: 1rem; color: var(--text-primary); font-weight: 700; margin: 0; line-height: 1.3;">${member.name}</h3>
                                <p style="font-size: 0.75rem; color: var(--color-blue); font-weight: 600; margin: 0.15rem 0 0 0; line-height: 1.2;">${member.position}</p>
                            </div>
                        </div>
                        
                        <div style="font-size: 0.8rem; color: var(--text-secondary); display: flex; flex-direction: column; gap: 0.4rem; border-top: 1px solid var(--border-color); padding-top: 0.75rem; margin-top: auto;">
                            <div>
                                <strong>${isZhNow ? '学历资历:' : 'Qualification:'}</strong> 
                                <span style="color: var(--text-muted); font-size: 0.75rem; display: block; margin-top: 0.1rem; line-height: 1.35;">${member.qualification}</span>
                            </div>
                            ${member.specialization ? `
                            <div>
                                <strong>${isZhNow ? '研究领域:' : 'Specialization:'}</strong> 
                                <span style="color: var(--text-muted); font-size: 0.75rem; display: block; margin-top: 0.1rem; line-height: 1.35;">${member.specialization}</span>
                            </div>` : ''}
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-top: 0.15rem;">
                                <div><strong>${isZhNow ? '办公室:' : 'Office:'}</strong> <span style="color: var(--text-muted);">${member.room}</span></div>
                                <div><strong>${isZhNow ? '分机:' : 'Ext:'}</strong> <span style="color: var(--text-muted);">${member.ext}</span></div>
                            </div>
                            <div style="margin-top: 0.15rem;">
                                <strong>${isZhNow ? '电子邮箱:' : 'Email:'}</strong> 
                                <a href="mailto:${member.email}" style="color: var(--color-blue); text-decoration: underline; font-family: monospace; display: block; margin-top: 0.1rem; font-size: 0.75rem; word-break: break-all;">${member.email}</a>
                            </div>
                        </div>
                    </div>
                `;
                
                gridContainer.appendChild(card);
            });
        }
    }

    // -------------------------------------------------------------------------
    // Language Controller (EN / 中文 Toggle)
    // -------------------------------------------------------------------------
    function initLanguageToggle() {
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('#btn-lang-toggle');
            if (btn) {
                e.preventDefault();
                e.stopPropagation();
                window.toggleLanguage(e);
            }
        });
    }
});