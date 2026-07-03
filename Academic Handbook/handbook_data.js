const HANDBOOK_DATA = {
    gradeScale: [
        { grade: 'A', points: 4.00, desc: 'Excellent' },
        { grade: 'A-', points: 3.67, desc: 'Very Good' },
        { grade: 'B+', points: 3.33, desc: 'Good' },
        { grade: 'B', points: 3.00, desc: 'Satisfactory' },
        { grade: 'B-', points: 2.67, desc: 'Pass' },
        { grade: 'C+', points: 2.33, desc: 'Pass' },
        { grade: 'C', points: 2.00, desc: 'Pass' },
        { grade: 'C-', points: 1.67, desc: 'Conditional Pass / Fail' },
        { grade: 'D+', points: 1.33, desc: 'Fail' },
        { grade: 'D', points: 1.00, desc: 'Fail' },
        { grade: 'F', points: 0.00, desc: 'Fail' }
    ],
    
    programs: [
        {
            id: 'arch-bsc',
            name: 'Bachelor of Science (Hons) in Architecture',
            creditsToGraduate: 120,
            courses: [
                { code: 'ARC1101', name: 'Design Studio I', credits: 5, category: 'Core Studio' },
                { code: 'ARC1102', name: 'Architectural Graphics', credits: 3, category: 'Core Tech' },
                { code: 'ARC1103', name: 'History of Architecture I', credits: 3, category: 'General' },
                { code: 'ARC1201', name: 'Design Studio II', credits: 5, category: 'Core Studio' },
                { code: 'ARC1202', name: 'Building Construction I', credits: 3, category: 'Core Tech' },
                { code: 'ARC1203', name: 'Environmental Science I', credits: 3, category: 'Core Tech' },
                { code: 'ARC2101', name: 'Design Studio III', credits: 6, category: 'Core Studio' },
                { code: 'ARC2102', name: 'Building Construction II', credits: 3, category: 'Core Tech' },
                { code: 'ARC2103', name: 'Structures I', credits: 3, category: 'Core Tech' },
                { code: 'ARC2201', name: 'Design Studio IV', credits: 6, category: 'Core Studio' },
                { code: 'ARC2202', name: 'Building Services I', credits: 3, category: 'Core Tech' },
                { code: 'ARC3101', name: 'Design Studio V', credits: 6, category: 'Core Studio' },
                { code: 'ARC3102', name: 'Theory of Architecture', credits: 3, category: 'General' },
                { code: 'ARC3201', name: 'Design Studio VI (Grad Project)', credits: 6, category: 'Core Studio' },
                { code: 'ARC3202', name: 'Professional Practice', credits: 3, category: 'General' }
            ]
        },
        {
            id: 'qs-b',
            name: 'Bachelor of Quantity Surveying (Hons)',
            creditsToGraduate: 125,
            courses: [
                { code: 'QSB1101', name: 'Measurement I (Substructure)', credits: 4, category: 'Core Tech' },
                { code: 'QSB1102', name: 'Construction Technology I', credits: 3, category: 'Core Tech' },
                { code: 'QSB1103', name: 'Principles of Law', credits: 3, category: 'General' },
                { code: 'QSB1201', name: 'Measurement II (Superstructure)', credits: 4, category: 'Core Tech' },
                { code: 'QSB1202', name: 'Building Services I', credits: 3, category: 'Core Tech' },
                { code: 'QSB1203', name: 'Economics of Construction', credits: 3, category: 'General' },
                { code: 'QSB2101', name: 'Measurement III (External Works)', credits: 4, category: 'Core Tech' },
                { code: 'QSB2102', name: 'Estimating I', credits: 3, category: 'Core Tech' },
                { code: 'QSB2103', name: 'Contract Administration I', credits: 3, category: 'Core Tech' },
                { code: 'QSB2201', name: 'Measurement IV (Civil Engineering)', credits: 4, category: 'Core Tech' },
                { code: 'QSB2202', name: 'Estimating II / Cost Planning', credits: 3, category: 'Core Tech' },
                { code: 'QSB3101', name: 'Dissertation / Research Project', credits: 6, category: 'Research' },
                { code: 'QSB3102', name: 'Industrial Training', credits: 8, category: 'Internship' },
                { code: 'QSB3201', name: 'Professional Practice & Ethics', credits: 3, category: 'General' }
            ]
        },
        {
            id: 'cm-b',
            name: 'Bachelor of Construction Management (Hons)',
            creditsToGraduate: 120,
            courses: [
                { code: 'BCM1101', name: 'Construction Tech & Materials', credits: 3, category: 'Core Tech' },
                { code: 'BCM1102', name: 'Principles of Management', credits: 3, category: 'General' },
                { code: 'BCM1103', name: 'Structural Mechanics', credits: 3, category: 'Core Tech' },
                { code: 'BCM1201', name: 'Building Services & Systems', credits: 3, category: 'Core Tech' },
                { code: 'BCM1202', name: 'Construction Measurement', credits: 3, category: 'Core Tech' },
                { code: 'BCM2101', name: 'Project Planning & Scheduling', credits: 3, category: 'Core Tech' },
                { code: 'BCM2102', name: 'Site Management & Safety', credits: 3, category: 'Core Tech' },
                { code: 'BCM2103', name: 'Construction Law', credits: 3, category: 'Core Tech' },
                { code: 'BCM2201', name: 'Cost Estimation & Budgeting', credits: 3, category: 'Core Tech' },
                { code: 'BCM2202', name: 'Quality Management in Construction', credits: 3, category: 'Core Tech' },
                { code: 'BCM3101', name: 'Project Management Seminar', credits: 3, category: 'General' },
                { code: 'BCM3102', name: 'Research Project / Thesis', credits: 6, category: 'Research' },
                { code: 'BCM3103', name: 'Industrial Internship', credits: 8, category: 'Internship' },
                { code: 'BCM3201', name: 'Strategic Management & Finance', credits: 3, category: 'General' }
            ]
        }
    ],

    handbookRules: {
        academicStanding: [
            { name: 'Good Standing (GS)', range: 'CGPA ≥ 2.00', status: 'normal', desc: 'You are in good academic standing. You can register for a full course load (12 - 18 credits).' },
            { name: 'Academic Probation (AP)', range: '1.50 ≤ CGPA < 2.00', status: 'warning', desc: 'Warning status. You are placed on probation. You are limited to a maximum of 12 credits next semester. You must meet with your Academic Advisor to plan your recovery.' },
            { name: 'Academic Dismissal (AD)', range: 'CGPA < 1.50 OR consecutive AP', status: 'danger', desc: 'Critical status. A student who obtains a CGPA below 1.50, or remains on Academic Probation for two consecutive semesters, is subject to academic dismissal. You must appeal to the Board of Studies to continue.' }
        ],
        attendance: {
            requirement: '80%',
            penalty: 'If your attendance in a course falls below 80% without a valid medical certificate or official justification, you will be barred from sitting for the final exam or final review of that course. This results in an automatic Grade F (Fail) for the course.'
        },
        creditLimits: {
            normalMin: 12,
            normalMax: 18,
            probationMax: 12,
            specialMin: 9
        }
    },

    faqs: [
        {
            category: 'Academic Performance',
            question: 'What is the minimum CGPA to stay in Good Standing?',
            tags: ['gpa', 'cgpa', 'probation', 'dismissal', 'failing'],
            answer: `You must maintain a Cumulative Grade Point Average (**CGPA**) of **2.00** or higher to remain in Good Standing. If it falls below 2.00, you are placed on Academic Probation.`
        },
        {
            category: 'Academic Performance',
            question: 'What happens if my CGPA falls below 2.00?',
            tags: ['probation', 'ap', 'credit limit', 'failing', 'advice'],
            answer: `If your CGPA falls below 2.00, you will be placed on **Academic Probation (AP)**. This means:
1. You are restricted to a maximum of **12 credits** in the following semester to help you focus.
2. You must consult your Academic Advisor to prepare a study plan.
3. If you remain on probation for two consecutive semesters, or if your CGPA falls below 1.50, you face **Academic Dismissal**.`
        },
        {
            category: 'Attendance Policy',
            question: 'What is the attendance requirement and what happens if I miss class?',
            tags: ['attendance', 'barred', 'absence', 'f', 'medical certificate', 'mc'],
            answer: `The university enforces a strict **80% minimum attendance** policy. 
- If you miss more than 20% of classes without a valid Medical Certificate (MC) or approval letter, you will be **barred** from the final exam/portfolio review.
- Being barred results in an automatic **Grade F (Fail)** for that course.`
        },
        {
            category: 'Course Management',
            question: 'Can I repeat a course to improve my grade?',
            tags: ['repeat', 'grade replacement', 'failing', 'c-', 'd', 'f'],
            answer: `Yes, you can repeat courses to improve your CGPA:
- For courses with **Grade C- or lower**, you can retake the course.
- The **new grade** will replace the old grade in the CGPA calculation (though both remain on the transcript).
- Repeating core design studio courses is highly recommended immediately if failed, as they are pre-requisites for subsequent semesters.`
        },
        {
            category: 'Deferment of Study',
            question: 'How do I apply for a Deferment (taking a semester break)?',
            tags: ['deferment', 'break', 'postpone', 'health', 'finance', 'form'],
            answer: `If you need to postpone your studies due to health, financial, or personal issues:
1. You must apply for **Official Deferment** through the Faculty Office before Week 8 of the semester.
2. Deferment due to medical reasons requires a certified hospital letter and does not count towards your maximum study duration.
3. Unapproved absences (failing to register or attend without deferring) can lead to termination of student status.`
        },
        {
            category: 'Graduation Requirements',
            question: 'What are the graduation requirements for FABE?',
            tags: ['graduation', 'requirements', 'credits', 'cgpa', 'muet'],
            answer: `To graduate from the Faculty of Architecture and Built Environment, you must:
1. Complete the total credit hours required for your program (typically **120 - 125 credits**).
2. Achieve a minimum final **CGPA of 2.00**.
3. Pass all core modules and University compulsory courses.
4. Fulfill the industrial training (internship) duration.
5. Fulfill the English language proficiency requirements (e.g. MUET/IELTS limits).`
        },
        {
            category: 'Inclusive Learning & Support',
            question: 'What is the KLUST Inclusive Teaching, Learning, and Assessment (iTnL) Policy?',
            tags: ['disability', 'dyslexia', 'adhd', 'inclusive learning', 'extra time', 'accommodation', 'adjustment', 'support', 'udl', 'iap', 'assessment menu'],
            answer: `KLUST operates under the **Inclusive Teaching, Learning, and Assessment (iTnL) Policy** based on the **Universal Design for Learning (UDL)** framework. Key provisions include:
1. **Individualised Academic Plan (IAP):** A confidential, binding document drafted by the **Inclusive Education Committee (IEC) Office** specifying mandatory adjustments. These mandates are legally binding and cannot be overridden by individual lecturers.
2. **Assessment Menu (SOP 2):** Modules are encouraged to offer a choice of formats: live presentations, pre-recorded media, private 1-on-1 discussions, or written submissions.
3. **Assessment Objectivity:** Grades must evaluate core academic competencies. Subjective markers (e.g. eye contact, vocal affect, or physical posture) shall NOT influence grading.
4. **Trigger Mechanism (SOP 1):** To request an IAP, submit a formal request/appeal to the **IEC Office** with relevant professional medical or educational assessments.`
        }
    ],

    diagnosticQuestions: [
        {
            id: 'q_attendance',
            category: 'Attendance',
            text: 'How frequently have you attended your lectures and studio sessions this semester?',
            options: [
                { text: 'I have attended almost every class (95% - 100%)', riskPoints: 0, feedback: 'Great attendance habits!' },
                { text: 'I have missed a few classes, but sit around (80% - 94%)', riskPoints: 1, feedback: 'Close to the borderline. Make sure not to miss any more classes.' },
                { text: 'I have missed many classes and am likely below the 80% mark', riskPoints: 3, feedback: 'CRITICAL: You are at risk of being barred from final exams/reviews, which means an automatic Grade F.' }
            ]
        },
        {
            id: 'q_coursework',
            category: 'Academics',
            text: 'Are you submitting your assignments, studio projects, and coursework on time?',
            options: [
                { text: 'Yes, always on time and complete', riskPoints: 0, feedback: 'Excellent submission record.' },
                { text: 'I sometimes submit late or miss minor assignments', riskPoints: 1.5, feedback: 'Late submissions cost grade points due to penalties. Plan assignments early.' },
                { text: 'I have missed major submissions or studio reviews', riskPoints: 3, feedback: 'CRITICAL: Missing major assignments or reviews makes passing the course mathematically unlikely.' }
            ]
        },
        {
            id: 'q_study_hours',
            category: 'Study Habits',
            text: 'How many hours per week do you spend on self-study and studio work outside of classes?',
            options: [
                { text: 'More than 15 hours per week', riskPoints: 0, feedback: 'Good self-study schedule.' },
                { text: 'Between 5 to 14 hours per week', riskPoints: 1, feedback: 'Adequate, but professional design/technical programs usually require more time.' },
                { text: 'Less than 5 hours per week', riskPoints: 2, feedback: 'Warning: Very low study time. You may fall behind in complex technical/studio modules.' }
            ]
        },
        {
            id: 'q_advisor',
            category: 'Support',
            text: 'Have you met or communicated with your Academic Advisor this semester?',
            options: [
                { text: 'Yes, we discuss my progress regularly', riskPoints: 0, feedback: 'Awesome. Active advisory relations keep you on track.' },
                { text: 'No, but I know who they are', riskPoints: 1, feedback: 'Consider dropping in during office hours to check in.' },
                { text: 'No, I do not know who my Academic Advisor is', riskPoints: 2, feedback: 'Action Needed: Every student has an assigned advisor. Contact the faculty office to find yours.' }
            ]
        },
        {
            id: 'q_understanding',
            category: 'Academics',
            text: 'Do you feel comfortable with the difficulty of your current modules?',
            options: [
                { text: 'I understand most topics and feel confident', riskPoints: 0, feedback: 'Excellent progress.' },
                { text: 'I struggle with some complex topics but manage to get by', riskPoints: 1, feedback: 'Consider joining study groups or consulting lecturers for tricky areas.' },
                { text: 'I am completely lost in one or more core courses', riskPoints: 2.5, feedback: 'Seek immediate help! Utilize lecturer consultation hours or peer tutoring.' }
            ]
        },
        {
            id: 'q_extracurricular',
            category: 'Time Management',
            text: 'Do you have heavy external commitments (part-time job, student club leadership, family duties)?',
            options: [
                { text: 'None or very light commitments (easy to balance)', riskPoints: 0, feedback: 'Good balance.' },
                { text: 'Moderate commitments, sometimes causing stress or late sleep', riskPoints: 1, feedback: 'Ensure you allocate blocked hours for study and prioritize rest.' },
                { text: 'Heavy commitments that regularly conflict with my classes or study time', riskPoints: 2.5, feedback: 'Risk of academic fatigue. Consider reducing part-time work hours or deferring leadership roles to save your grades.' }
            ]
        },
        {
            id: 'q_wellbeing',
            category: 'Personal',
            text: 'How would you describe your mental wellbeing, stress, or sleep levels lately?',
            options: [
                { text: 'Healthy sleep and manageable stress levels', riskPoints: 0, feedback: 'Keep maintaining your health.' },
                { text: 'Stressed, sleeping poorly, or feeling exhausted at times', riskPoints: 1, feedback: 'Ensure you maintain regular sleep. Good rest is essential for creative design work.' },
                { text: 'Extremely overwhelmed, depressed, or unable to focus on studies', riskPoints: 2, feedback: 'CRITICAL: Your mental health is top priority. We highly recommend visiting the University Counseling Centre.' }
            ]
        },
        {
            id: 'q_itnl',
            category: 'Inclusive Support',
            text: 'Do you require special learning adjustments or alternative assessment formats (e.g. due to dyslexia, ADHD, physical or health conditions)?',
            options: [
                { text: 'No, I do not need special academic accommodations.', riskPoints: 0, feedback: 'Understood. Standard teaching and assessment rules apply.' },
                { text: 'Yes, I need adjustments but have not requested them yet.', riskPoints: 1, feedback: 'Action Recommended: Review the KLUST iTnL Policy and apply for an Individualised Academic Plan (IAP) through the IEC Office.' },
                { text: 'Yes, and I struggle with standard assessments like live juries or need extra exam time.', riskPoints: 2, feedback: 'Action Needed: Contact the IEC Office to trigger SOP 1 (IAP) and SOP 2 (Assessment Menu) so you can choose alternative presentation/exam formats.' }
            ]
        }
    ],

    decisionTree: {
        start: {
            text: "What academic issue are you facing today?",
            options: [
                { text: "I failed a course or got a low grade", next: "failed_course" },
                { text: "My attendance is low and I might get barred", next: "low_attendance" },
                { text: "I am feeling extremely overwhelmed and want to postpone study", next: "postpone_defer" },
                { text: "I have questions about Academic Probation and my credit limit", next: "probation_rules" },
                { text: "I need information on inclusive learning or special academic support", next: "inclusive_learning" }
            ]
        },
        failed_course: {
            text: "Is the failed course a Core Module (like Design Studio, Building Construction, Measurement) or an Elective/General module?",
            options: [
                { text: "It is a Core Module / Design Studio", next: "failed_core" },
                { text: "It is an Elective / General Education module", next: "failed_elective" }
            ]
        },
        failed_core: {
            text: "Core modules are mandatory and often pre-requisites for other courses. You MUST repeat the course. How low was your grade?",
            options: [
                { text: "F, D, or D+ (Strict Fail)", next: "failed_core_strict" },
                { text: "C-, C, or C+ (Conditional Pass / Low Grade)", next: "failed_core_pass" }
            ]
        },
        failed_core_strict: {
            text: "Official Action: Since you failed, you cannot register for the next level module (e.g. Design Studio II requires Design Studio I). You must register to retake this course in the next semester it is offered. \n\n*Action Steps:* \n1. Do not register for the advanced sequential modules.\n2. Add the repeated course to your study schedule.\n3. Meet your advisor to check if this delays your graduation.",
            options: [
                { text: "Back to Start", next: "start" }
            ]
        },
        failed_core_pass: {
            text: "Official Action: You passed the course, but a low grade pulls down your CGPA. If your CGPA is above 2.00, you can proceed. If it dragged your CGPA below 2.00, repeating is highly recommended to replace the grade and recover your standing.",
            options: [
                { text: "Back to Start", next: "start" }
            ]
        },
        failed_elective: {
            text: "Official Action: For general electives, you can either: \n1. Retake the exact same course next semester to replace the grade. \n2. Register for a different elective course to fulfill credit requirements (but the original failed grade remains in your CGPA calculation).",
            options: [
                { text: "Back to Start", next: "start" }
            ]
        },
        low_attendance: {
            text: "Do you have valid documentation (e.g. a government hospital Medical Certificate, or an official letter representing the university in a competition/sports)?",
            options: [
                { text: "Yes, I have official documentation / medical certificates", next: "attendance_has_mc" },
                { text: "No, I missed class due to personal reasons/oversleeping", next: "attendance_no_mc" }
            ]
        },
        attendance_has_mc: {
            text: "Official Action: You must submit your medical certificate or letter to the Faculty Office or directly to your Course Coordinator within **48 hours** of returning to class. The lecturer will excuse your absence, preventing it from counting towards the 20% barred limit.",
            options: [
                { text: "Back to Start", next: "start" }
            ]
        },
        attendance_no_mc: {
            text: "Official Action: Unexcused absences cannot be erased. Immediately talk to your lecturer, apologize, and show commitment. Ask if you can submit make-up work to show attendance/engagement. If your attendance is strictly below 80% at Week 12, check with the Faculty if you should **Withdraw (W)** from the course before final exams to avoid an F grade.",
            options: [
                { text: "Back to Start", next: "start" }
            ]
        },
        postpone_defer: {
            text: "To defer (take a semester off), you must apply officially. What is the main reason for your postponement?",
            options: [
                { text: "Medical grounds / Health issues", next: "defer_medical" },
                { text: "Financial difficulties or personal issues", next: "defer_personal" }
            ]
        },
        defer_medical: {
            text: "Official Action: Apply for **Medical Deferment**. Submit a deferment form along with a certified hospital doctor's report. Medical deferments are normally approved easily and **do not count** towards your maximum allowed study semesters. Fees paid may also be deferred.",
            options: [
                { text: "Back to Start", next: "start" }
            ]
        },
        defer_personal: {
            text: "Official Action: Apply for **Academic Deferment** before Week 8 of the semester. Note that deferment for personal reasons will count towards your maximum semesters to complete the degree. Be sure to check with the finance office regarding fee refund/transfer rules.",
            options: [
                { text: "Back to Start", next: "start" }
            ]
        },
        probation_rules: {
            text: "Is this your first semester on Academic Probation, or is it consecutive (second semester in a row)?",
            options: [
                { text: "This is my first semester on probation", next: "probation_first" },
                { text: "This is my second consecutive semester on probation", next: "probation_consecutive" }
            ]
        },
        probation_first: {
            text: "Official Action: Do not panic, but take action. \n1. Your credit registration for next semester is capped at **12 credits** (approx. 3-4 courses).\n2. Focus on retaking failed modules to replace poor grades.\n3. Make a mandatory appointment with your academic advisor to clear your study plan.",
            options: [
                { text: "Back to Start", next: "start" }
            ]
        },
        probation_consecutive: {
            text: "Official Action: CRITICAL! Staying on probation for two consecutive semesters leads to **Academic Dismissal**. If dismissed, you must submit an official **Appeal Letter** to the Dean of Faculty within 14 days of results release, outlining your extenuating circumstances and commitment to improvement. If approved, you will be given a final semester to pull your CGPA above 2.00.",
            options: [
                { text: "Back to Start", next: "start" }
            ]
        },
        inclusive_learning: {
            text: "Do you have a medical or educational assessment report (e.g. for Dyslexia, ADHD, sensory or physical conditions) and wish to request academic accommodations?",
            options: [
                { text: "Yes, I want to apply for an Individualised Academic Plan (IAP)", next: "inclusive_has_report" },
                { text: "No, but I suspect I need support or have questions about the policy", next: "inclusive_no_report" }
            ]
        },
        inclusive_has_report: {
            text: "Follow these **3 Simple Steps** to register your accommodations: \n\n*Action Steps:* \n1. **Apply for IAP (SOP 1):** Submit a formal request to the **Inclusive Education Committee (IEC) Office** for an **Individualised Academic Plan (IAP)**. Attach your professional assessment report. \n2. **Confidential IAP Issued:** The IEC will issue a confidential IAP listing your mandatory study adjustments. This document is **binding**—your lecturers must comply with it. \n3. **Submit Assessment Choice (SOP 2):** Submit an **Assessment Menu Declaration Form** to your lecturer **14 days (2 weeks)** before your exams/reviews to choose your format (e.g. pre-recorded presentations or 1-on-1 reviews). *Note: The 14-day notice is waived for sudden medical flare-ups.*",
            options: [
                { text: "Back to Start", next: "start" }
            ]
        },
        inclusive_no_report: {
            text: "No official report yet? Follow these **3 Simple Steps** to seek support: \n\n*Action Steps:* \n1. **Get Free Screening:** Contact the **University Counseling and Wellbeing Centre** for a free initial screening and a referral to registered psychologists. \n2. **Temporary Adjustments:** Meet with the **IEC Office** to request temporary support while you wait for your official medical assessment to be finalized. \n3. **Ask for UDL Flexibility:** Talk to your Academic Advisor or Course Coordinator. Under the **Universal Design for Learning (UDL)** policy, departments are encouraged to offer flexible learning options (like slides in advance or formatting choices) to all students.",
            options: [
                { text: "Back to Start", next: "start" }
            ]
        }
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = HANDBOOK_DATA;
}
