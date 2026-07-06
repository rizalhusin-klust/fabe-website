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
            name: 'Bachelor of Science (Architectural Studies)',
            creditsToGraduate: 122,
            courses: [
                { code: 'ARCH 1111', name: 'Studio Design 1A', credits: 4, category: 'Core Studio', semester: 1 },
                { code: 'ARCH 1100', name: 'Theory & Principles of Architecture Design', credits: 2, category: 'General', semester: 1 },
                { code: 'ARCH 1210', name: 'Architectural Communications', credits: 2, category: 'Core Tech', semester: 1 },
                { code: 'ARCH 1311', name: 'History of Architecture 1', credits: 2, category: 'General', semester: 1 },
                { code: 'MPU 3113', name: 'Penghayatan Etika dan Peradaban (MPU U1)', credits: 3, category: 'MPU', semester: 1 },
                { code: 'ARCH 1120', name: 'Studio Design 1B', credits: 6, category: 'Core Studio', semester: 2 },
                { code: 'ARCH 1411', name: 'Building Construction I', credits: 3, category: 'Core Tech', semester: 2 },
                { code: 'ARCH 1431', name: 'Building Structure I', credits: 2, category: 'Core Tech', semester: 2 },
                { code: 'ARCH 1421', name: 'Environmental Science I', credits: 2, category: 'Core Tech', semester: 2 },
                { code: 'MPU 3123', name: 'Tamadun Islam dan Tamadun Asia (TITAS) (MPU U1)', credits: 3, category: 'MPU', semester: 2 },
                { code: 'ARCH 1220', name: 'Computer Aided Design', credits: 2, category: 'Core Tech', semester: 3 },
                { code: 'ARCH 1441', name: 'Building Services I', credits: 2, category: 'Core Tech', semester: 3 },
                { code: 'ARCH 2130', name: 'Studio Design IIA', credits: 6, category: 'Core Studio', semester: 4 },
                { code: 'ARCH 2240', name: 'Computer Animation', credits: 2, category: 'Core Tech', semester: 4 },
                { code: 'ARCH 2321', name: 'History of Architecture 2', credits: 2, category: 'General', semester: 4 },
                { code: 'ARCH 2330', name: 'Theory of Architecture', credits: 2, category: 'General', semester: 4 },
                { code: 'MPU 3222', name: 'Public Speaking / Creative Writing (MPU U2)', credits: 2, category: 'MPU', semester: 4 },
                { code: 'ARCH 2140', name: 'Studio Design IIB', credits: 6, category: 'Core Studio', semester: 5 },
                { code: 'ARCH 2433', name: 'Building Structure II', credits: 2, category: 'Core Tech', semester: 5 },
                { code: 'ARCH 2423', name: 'Environmental Science II', credits: 2, category: 'Core Tech', semester: 5 },
                { code: 'ARCH 2413', name: 'Building Construction II', credits: 3, category: 'Core Tech', semester: 5 },
                { code: 'ARCH 2443', name: 'Building Services II', credits: 2, category: 'Core Tech', semester: 5 },
                { code: 'MPU 3312', name: 'Malaysian Economy / Integrity & Anti-Corruption (MPU U3)', credits: 2, category: 'MPU', semester: 5 },
                { code: 'ARCH 2230', name: 'Measured Drawing & Report', credits: 4, category: 'Core Studio', semester: 6 },
                { code: 'ARCH 3150', name: 'Studio Design IIIA', credits: 6, category: 'Core Studio', semester: 7 },
                { code: 'ARCH 3260', name: 'Building Study & Report', credits: 3, category: 'Research', semester: 7 },
                { code: 'ARCH 3250', name: 'Construction Drawing', credits: 4, category: 'Core Tech', semester: 7 },
                { code: 'ARCH 3461', name: 'Landscape Architecture', credits: 3, category: 'Core Tech', semester: 7 },
                { code: 'MPU 3412', name: 'Co-Curriculum (Sports / Community Service) (MPU U4)', credits: 2, category: 'MPU', semester: 7 },
                { code: 'ARCH 3160', name: 'Studio Design IIIB (CDP)', credits: 6, category: 'Core Studio', semester: 8 },
                { code: 'ARCH 3520', name: 'Professional Studies', credits: 3, category: 'General', semester: 8 },
                { code: 'ARCH 3810', name: 'Industrial Training', credits: 3, category: 'Internship', semester: 8 }
            ]
        },
        {
            id: 'qs-b',
            name: 'Bachelor of Quantity Surveying (Hons)',
            creditsToGraduate: 123,
            courses: [
                { code: 'BQS 102', name: 'Materials I', credits: 2, category: 'Core Tech', semester: 1 },
                { code: 'BQS 103', name: 'Construction Technology I', credits: 3, category: 'Core Tech', semester: 1 },
                { code: 'BQS 104', name: 'Measurement I', credits: 4, category: 'Core Tech', semester: 1 },
                { code: 'MPU 3113', name: 'Penghayatan Etika dan Peradaban (MPU U1)', credits: 3, category: 'MPU', semester: 1 },
                { code: 'BQS 105', name: 'Measurement II', credits: 4, category: 'Core Tech', semester: 2 },
                { code: 'BQS 106', name: 'Construction Law I', credits: 3, category: 'Core Tech', semester: 2 },
                { code: 'BQS 107', name: 'Building Services I', credits: 2, category: 'Core Tech', semester: 2 },
                { code: 'BQS 108', name: 'Construction Technology II', credits: 3, category: 'Core Tech', semester: 2 },
                { code: 'MPU 3123', name: 'Tamadun Islam dan Tamadun Asia (TITAS) (MPU U1)', credits: 3, category: 'MPU', semester: 2 },
                { code: 'BQS 201', name: 'Measurement III', credits: 4, category: 'Core Tech', semester: 3 },
                { code: 'BQS 203', name: 'Construction Technology III', credits: 3, category: 'Core Tech', semester: 3 },
                { code: 'BQS 204', name: 'Building Services II', credits: 2, category: 'Core Tech', semester: 4 },
                { code: 'BQS 205', name: 'Materials II', credits: 3, category: 'Core Tech', semester: 4 },
                { code: 'BQS 206', name: 'Construction Economics and Finance', credits: 3, category: 'General', semester: 4 },
                { code: 'BQS 207', name: 'Measurement IV', credits: 4, category: 'Core Tech', semester: 4 },
                { code: 'BQS 208', name: 'Quantity Surveying Practice I', credits: 3, category: 'Core Tech', semester: 4 },
                { code: 'MPU 3222', name: 'Public Speaking / Creative Writing (MPU U2)', credits: 2, category: 'MPU', semester: 4 },
                { code: 'BQS 210', name: 'Tendering and Estimating', credits: 4, category: 'Core Tech', semester: 5 },
                { code: 'BQS 211', name: 'Project Management I', credits: 3, category: 'Core Tech', semester: 5 },
                { code: 'BQS 212', name: 'Quantity Surveying Practice II', credits: 3, category: 'Core Tech', semester: 5 },
                { code: 'BQS 301', name: 'Measurement V', credits: 4, category: 'Core Tech', semester: 5 },
                { code: 'MPU 3312', name: 'Malaysian Economy / Integrity & Anti-Corruption (MPU U3)', credits: 2, category: 'MPU', semester: 5 },
                { code: 'BQS 302', name: 'Thesis I', credits: 3, category: 'Research', semester: 6 },
                { code: 'BQS 209', name: 'Construction Technology IV', credits: 3, category: 'Core Tech', semester: 6 },
                { code: 'BQS 304', name: 'Project Management II', credits: 3, category: 'Core Tech', semester: 7 },
                { code: 'BQS 305', name: 'Industrial Training/Project', credits: 9, category: 'Internship', semester: 7 },
                { code: 'MPU 3412', name: 'Co-Curriculum (Sports / Community Service) (MPU U4)', credits: 2, category: 'MPU', semester: 7 },
                { code: 'BQS 303', name: 'Integrated Project', credits: 3, category: 'Core Tech', semester: 8 },
                { code: 'BQS 306', name: 'Thesis II', credits: 6, category: 'Research', semester: 8 },
                { code: 'BQS 307', name: 'Risk Management', credits: 3, category: 'Core Tech', semester: 8 },
                { code: 'BQS 308', name: 'Financial Management', credits: 3, category: 'Core Tech', semester: 8 },
                { code: 'BQS 309', name: 'Management of Large Construction', credits: 3, category: 'Core Tech', semester: 8 },
                { code: 'BQS 310', name: 'Management of Equipment and Plant', credits: 3, category: 'Core Tech', semester: 8 }
            ]
        },
        {
            id: 'cm-b',
            name: 'Bachelor of Construction Management (Hons)',
            creditsToGraduate: 120,
            courses: [
                { code: 'BCM 101', name: 'Construction Tech & Materials', credits: 3, category: 'Core Tech', semester: 1 },
                { code: 'BCM 102', name: 'Principles of Management', credits: 3, category: 'General', semester: 1 },
                { code: 'BCM 103', name: 'Structural Mechanics', credits: 3, category: 'Core Tech', semester: 1 },
                { code: 'MPU 3113', name: 'Penghayatan Etika dan Peradaban (MPU U1)', credits: 3, category: 'MPU', semester: 1 },
                { code: 'BCM 104', name: 'Building Services & Systems', credits: 3, category: 'Core Tech', semester: 2 },
                { code: 'BCM 105', name: 'Construction Measurement', credits: 3, category: 'Core Tech', semester: 2 },
                { code: 'MPU 3123', name: 'Tamadun Islam dan Tamadun Asia (TITAS) (MPU U1)', credits: 3, category: 'MPU', semester: 2 },
                { code: 'BCM 201', name: 'Project Planning & Scheduling', credits: 3, category: 'Core Tech', semester: 3 },
                { code: 'BCM 202', name: 'Site Management & Safety', credits: 3, category: 'Core Tech', semester: 3 },
                { code: 'BCM 203', name: 'Construction Law', credits: 3, category: 'Core Tech', semester: 3 },
                { code: 'BCM 204', name: 'Cost Estimation & Budgeting', credits: 3, category: 'Core Tech', semester: 4 },
                { code: 'BCM 205', name: 'Quality Management in Construction', credits: 3, category: 'Core Tech', semester: 4 },
                { code: 'MPU 3222', name: 'Public Speaking / Creative Writing (MPU U2)', credits: 2, category: 'MPU', semester: 4 },
                { code: 'BCM 301', name: 'Project Management Seminar', credits: 3, category: 'General', semester: 5 },
                { code: 'BCM 302', name: 'Research Project / Thesis', credits: 6, category: 'Research', semester: 5 },
                { code: 'BCM 303', name: 'Industrial Internship', credits: 8, category: 'Internship', semester: 5 },
                { code: 'MPU 3312', name: 'Malaysian Economy / Integrity & Anti-Corruption (MPU U3)', credits: 2, category: 'MPU', semester: 5 },
                { code: 'BCM 304', name: 'Strategic Management & Finance', credits: 3, category: 'General', semester: 6 },
                { code: 'MPU 3412', name: 'Co-Curriculum (Sports / Community Service) (MPU U4)', credits: 2, category: 'MPU', semester: 6 }
            ]
        },
        {
            id: 'arch-dip',
            name: 'Diploma in Architecture',
            creditsToGraduate: 94,
            courses: [
                { code: 'ARCH 1220D', name: 'Technical Drawing I', credits: 2, category: 'Core Tech', semester: 1 },
                { code: 'ARCH 1110D', name: 'Basic Design', credits: 6, category: 'Core Studio', semester: 1 },
                { code: 'ARCH 1210D', name: 'Graphic Communication', credits: 3, category: 'Core Tech', semester: 1 },
                { code: 'ARCH 1310D', name: 'Introduction to Built Environment', credits: 2, category: 'Core Tech', semester: 1 },
                { code: 'MPU 2163', name: 'Pengajian Malaysia 2 (MPU U1)', credits: 3, category: 'MPU', semester: 1 },
                { code: 'ARCH 1230D', name: 'Technical Drawing II', credits: 2, category: 'Core Tech', semester: 2 },
                { code: 'ARCH 1120D', name: 'Architectural Design I', credits: 6, category: 'Core Studio', semester: 2 },
                { code: 'ARCH 1410D', name: 'Structure Design', credits: 2, category: 'Core Tech', semester: 2 },
                { code: 'ARCH 1330D', name: 'Introduction to History of Eastern Architecture', credits: 3, category: 'General', semester: 2 },
                { code: 'MPU 2222', name: 'Public Speaking / Writing Skills (MPU U2)', credits: 2, category: 'MPU', semester: 2 },
                { code: 'ARCH 2250D', name: 'Computer Aided Design (CAD) I', credits: 3, category: 'Core Tech', semester: 3 },
                { code: 'ARCH 2470D', name: 'Introduction to Surveying', credits: 2, category: 'Core Tech', semester: 3 },
                { code: 'ARCH 2130D', name: 'Architectural Design II', credits: 6, category: 'Core Studio', semester: 4 },
                { code: 'ARCH 2430D', name: 'Building Construction I', credits: 3, category: 'Core Tech', semester: 4 },
                { code: 'ARCH 2420D', name: 'Building Services', credits: 3, category: 'Core Tech', semester: 4 },
                { code: 'ARCH 2460D', name: 'Environmental Design', credits: 3, category: 'Core Tech', semester: 4 },
                { code: 'MPU 2312', name: 'Malaysian Economy / Comparative Religion (MPU U3)', credits: 2, category: 'MPU', semester: 4 },
                { code: 'ARCH 2140D', name: 'Architectural Design III', credits: 6, category: 'Core Studio', semester: 5 },
                { code: 'ARCH 2240D', name: 'Construction Drawing', credits: 4, category: 'Core Tech', semester: 5 },
                { code: 'ARCH 2440D', name: 'Building Construction II', credits: 3, category: 'Core Tech', semester: 5 },
                { code: 'ARCH 2340D', name: 'History of Architecture 2 (Western Architecture)', credits: 3, category: 'General', semester: 5 },
                { code: 'MPU 2412', name: 'Co-Curriculum (Sports / Drama) (MPU U4)', credits: 2, category: 'MPU', semester: 5 },
                { code: 'ARCH 3350D', name: 'Measured Drawing', credits: 3, category: 'Core Studio', semester: 6 },
                { code: 'ARCH 3150D', name: 'Architectural Design IV', credits: 6, category: 'Core Studio', semester: 7 },
                { code: 'ARCH 3260D', name: 'Computer Aided Design (CAD) II', credits: 3, category: 'Core Tech', semester: 7 },
                { code: 'ARCH 3450D', name: 'Building Construction III', credits: 3, category: 'Core Tech', semester: 7 }
            ]
        },
        {
            id: 'la-dip',
            name: 'Diploma in Landscape Architecture',
            creditsToGraduate: 90,
            courses: [
                { code: 'LAD 101', name: 'Landscape Design Studio I', credits: 5, category: 'Core Studio', semester: 1 },
                { code: 'LAD 102', name: 'Landscape Graphic Communications', credits: 3, category: 'Core Tech', semester: 1 },
                { code: 'LAD 103', name: 'Introduction to Horticulture', credits: 3, category: 'Core Tech', semester: 1 },
                { code: 'MPU 2163', name: 'Pengajian Malaysia 2 (MPU U1)', credits: 3, category: 'MPU', semester: 1 },
                { code: 'LAD 104', name: 'Landscape Design Studio II', credits: 5, category: 'Core Studio', semester: 2 },
                { code: 'LAD 105', name: 'Planting Design I', credits: 3, category: 'Core Tech', semester: 2 },
                { code: 'LAD 106', name: 'Soil Science for Landscape', credits: 3, category: 'Core Tech', semester: 2 },
                { code: 'MPU 2222', name: 'Public Speaking / Writing Skills (MPU U2)', credits: 2, category: 'MPU', semester: 2 },
                { code: 'LAD 201', name: 'Landscape Design Studio III', credits: 6, category: 'Core Studio', semester: 3 },
                { code: 'LAD 202', name: 'Landscape Construction I', credits: 3, category: 'Core Tech', semester: 3 },
                { code: 'LAD 203', name: 'Plant Materials', credits: 3, category: 'Core Tech', semester: 3 },
                { code: 'LAD 204', name: 'Landscape Design Studio IV', credits: 6, category: 'Core Studio', semester: 4 },
                { code: 'LAD 205', name: 'Landscape Computer Graphics', credits: 3, category: 'Core Tech', semester: 4 },
                { code: 'LAD 206', name: 'History of Landscape Architecture', credits: 3, category: 'General', semester: 4 },
                { code: 'MPU 2312', name: 'Malaysian Economy / Comparative Religion (MPU U3)', credits: 2, category: 'MPU', semester: 4 },
                { code: 'MPU 2412', name: 'Co-Curriculum (Sports / Drama) (MPU U4)', credits: 2, category: 'MPU', semester: 5 }
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
4. **Trigger Mechanism (SOP 1):** To request an IAP, submit a formal request/appeal to the **IEC Office** with relevant professional medical or educational assessments.

*(Note: If you need help with any of these procedures, any lecturer or staff member at the university will happily help and guide you!)*`
        },
        {
            category: 'Inclusive Learning & Support',
            question: 'How does the UDL framework benefit students with special learning needs (IAP/IEP)?',
            tags: ['udl', 'iep', 'iap', 'learning needs', 'learning disability', 'accommodations', 'alternative assessment', 'benefits'],
            answer: `The **Universal Design for Learning (UDL)** framework is built on the principle that "one size does not fit all." For students with an **Individualised Academic Plan (IAP/IEP)**, UDL provides major benefits:
1. **Flexible Learning Formats:** You can request materials in different formats (e.g., audiobooks, lecture transcripts, visual aids, or digital slides in advance) to suit your learning style.
2. **Alternative Assessment Formats:** Instead of standard exams or stressful public studio juries, you can request alternative assessment methods that better showcase your mastery, such as:
   - Pre-recorded video walkthroughs or audio presentations.
   - Private, 1-on-1 reviews with a panel instead of public juries.
   - Written reports or interactive portfolios instead of oral presentations.
3. **Focus on Core Competencies:** Grading is based strictly on your academic and technical knowledge, ignoring subjective factors like vocal affect, physical posture, or eye contact.

**How to activate this:** If you have an approved IAP, simply submit your **Assessment Menu Declaration Form** to your lecturer **14 days** prior to the exam or presentation to select the assessment format that suits you best.`
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
            text: "Follow these **3 Simple Steps** to register your accommodations: \n\n*Action Steps:* \n1. **Apply for IAP (SOP 1):** Submit a formal request to the **Inclusive Education Committee (IEC) Office** for an **Individualised Academic Plan (IAP)**. Attach your professional assessment report. \n2. **Confidential IAP Issued:** The IEC will issue a confidential IAP listing your mandatory study adjustments. This document is **binding**—your lecturers must comply with it. \n3. **Submit Assessment Choice (SOP 2):** Submit an **Assessment Menu Declaration Form** to your lecturer **14 days (2 weeks)** before your exams/reviews to choose your format (e.g. pre-recorded presentations or 1-on-1 reviews). *Note: The 14-day notice is waived for sudden medical flare-ups.* \n\n*Remember:* If you need help with any of these steps, please reach out—any lecturer or staff member of the university will happily help you.",
            options: [
                { text: "Back to Start", next: "start" }
            ]
        },
        inclusive_no_report: {
            text: "No official report yet? Follow these **3 Simple Steps** to seek support: \n\n*Action Steps:* \n1. **Get Free Screening:** Contact the **University Counseling and Wellbeing Centre** for a free initial screening and a referral to registered psychologists. \n2. **Temporary Adjustments:** Meet with the **IEC Office** to request temporary support while you wait for your official medical assessment to be finalized. \n3. **Ask for UDL Flexibility:** Talk to your Academic Advisor or Course Coordinator. Under the **Universal Design for Learning (UDL)** policy, departments are encouraged to offer flexible learning options (like slides in advance or formatting choices) to all students. \n\n*Remember:* If you need help with any of these steps, please reach out—any lecturer or staff member of the university will happily help you.",
            options: [
                { text: "Back to Start", next: "start" }
            ]
        }
    },
    curriculumCredits: [
        {
            program: 'Bachelor of Landscape Architecture',
            total: 125,
            core: 95,
            mpu: 17,
            elective: 13,
            detail: 'Includes 14 credits of MPU subjects and 3 credits for a compulsory University course (LANG 1307).'
        },
        {
            program: 'Bachelor of Quantity Surveying (Hons)',
            total: 123,
            core: 97,
            mpu: 14,
            elective: 12,
            detail: 'Compulsory subjects mandated by the Ministry of Higher Education.'
        },
        {
            program: 'Bachelor of Science (Architectural Studies)',
            total: 122,
            core: 99,
            mpu: 17,
            elective: 6,
            detail: 'Includes 14 credits of MPU subjects and 3 credits for a compulsory University course (LANG 1307).'
        },
        {
            program: 'Diploma in Architecture',
            total: 94,
            core: 77,
            mpu: 17,
            elective: 0,
            detail: 'Includes 11 credits of MPU subjects and 6 credits for compulsory University English courses.'
        },
        {
            program: 'Master of Architecture',
            total: 60,
            core: 57,
            mpu: 0,
            elective: 3,
            detail: 'No MPU or compulsory University subjects are required for this postgraduate program.'
        }
    ],
    mpuRequirements: {
        bachelor_int: {
            title: 'Bachelor (International)',
            rule: 'Students to take TWO (2) subjects from category U1 and ONLY ONE (1) subject from each category of U2, U3 and U4.',
            categories: {
                U1: [
                    { code: 'MPU3183', name: 'Penghayatan Etika dan Peradaban', credits: 3 },
                    { code: 'MPU3193', name: 'Falsafah dan Isu Semasa', credits: 3 },
                    { code: 'MPU3143', name: 'Bahasa Melayu Komunikasi 2', credits: 3, note: 'Compulsory' }
                ],
                U2: [
                    { code: 'MPU3223', name: 'Basic Entrepreneurship', credits: 3 },
                    { code: 'MPU3253', name: 'Personal Financial Planning', credits: 3 },
                    { code: 'MPU3263', name: 'Office Application', credits: 3 },
                    { code: 'MPU3273', name: 'Professional Communication', credits: 3 },
                    { code: 'MPU3283', name: 'Small Group Communication', credits: 3 }
                ],
                U3: [
                    { code: 'MPU3343', name: 'Nutrition and Public Health', credits: 3 },
                    { code: 'MPU3353', name: 'The Constitution of Malaysia', credits: 3 }
                ],
                U4: [
                    { code: 'MPU3492', name: 'Integrity and Anti-Corruption', credits: 2, note: 'Compulsory' }
                ]
            }
        },
        bachelor_loc: {
            title: 'Bachelor (Local)',
            rule: 'Students to take TWO (2) subjects from category U1 and ONLY ONE (1) subject from each category of U2, U3 and U4.',
            categories: {
                U1: [
                    { code: 'MPU3183', name: 'Penghayatan Etika dan Peradaban', credits: 3, note: 'Compulsory' },
                    { code: 'MPU3193', name: 'Falsafah dan Isu Semasa', credits: 3, note: 'Compulsory' }
                ],
                U2: [
                    { code: 'MPU3213', name: 'Bahasa Kebangsaan A', credits: 3, note: 'Compulsory if SPM has no credit in BM' },
                    { code: 'MPU3223', name: 'Basic Entrepreneurship', credits: 3 },
                    { code: 'MPU3253', name: 'Personal Financial Planning', credits: 3 },
                    { code: 'MPU3263', name: 'Office Application', credits: 3 },
                    { code: 'MPU3273', name: 'Professional Communication', credits: 3 },
                    { code: 'MPU3283', name: 'Small Group Communication', credits: 3 }
                ],
                U3: [
                    { code: 'MPU3313', name: 'Pengajian Islam 2', credits: 3 },
                    { code: 'MPU3323', name: 'Pendidikan Moral 2', credits: 3 },
                    { code: 'MPU3343', name: 'Nutrition and Public Health', credits: 3 },
                    { code: 'MPU3353', name: 'The Constitution of Malaysia', credits: 3 }
                ],
                U4: [
                    { code: 'MPU3492', name: 'Integrity and Anti-Corruption', credits: 2, note: 'Compulsory' }
                ]
            }
        },
        diploma_int: {
            title: 'Diploma (International)',
            rule: 'Students to take ONLY ONE (1) subject from each category (U1, U2, U3 and U4).',
            categories: {
                U1: [
                    { code: 'MPU2133', name: 'Bahasa Melayu Komunikasi 1', credits: 3, note: 'Compulsory' }
                ],
                U2: [
                    { code: 'MPU2223', name: 'Basic Entrepreneurship', credits: 3 },
                    { code: 'MPU2233', name: 'Professional Correspondence', credits: 3 },
                    { code: 'MPU2243', name: 'Intercultural Communication', credits: 3 }
                ],
                U3: [
                    { code: 'MPU2333', name: 'Drug Abuse and Society', credits: 3 }
                ],
                U4: [
                    { code: 'MPU2492', name: 'Integrity and Anti-Corruption', credits: 2, note: 'Compulsory' }
                ]
            }
        },
        diploma_loc: {
            title: 'Diploma (Local)',
            rule: 'Students to take ONLY ONE (1) subject from each category (U1, U2, U3 and U4).',
            categories: {
                U1: [
                    { code: 'MPU2183', name: 'Penghayatan Etika dan Peradaban', credits: 3, note: 'Compulsory to choose only 1' },
                    { code: 'MPU2193', name: 'Falsafah dan Isu Semasa', credits: 3 }
                ],
                U2: [
                    { code: 'MPU2213', name: 'Bahasa Kebangsaan A', credits: 3, note: 'Compulsory if SPM has no credit in BM' },
                    { code: 'MPU2223', name: 'Basic Entrepreneurship', credits: 3 },
                    { code: 'MPU2233', name: 'Professional Correspondence', credits: 3 },
                    { code: 'MPU2243', name: 'Intercultural Communication', credits: 3 }
                ],
                U3: [
                    { code: 'MPU2313', name: 'Pengajian Islam 1', credits: 3 },
                    { code: 'MPU2323', name: 'Pendidikan Moral 1', credits: 3 },
                    { code: 'MPU2333', name: 'Drug Abuse and Society', credits: 3 }
                ],
                U4: [
                    { code: 'MPU2492', name: 'Integrity and Anti-Corruption', credits: 2, note: 'Compulsory' }
                ]
            }
        }
    },
    staffProfiles: [
        {
            name: "Ar Mohd Rizal Zakaria",
            qualification: "LAM Part III, Bach. Of Architecture & Diploma Architecture, ITM",
            position: "Head of Program - Master of Architecture, Senior Lecturer",
            room: "B102",
            ext: "540",
            email: "rizal.zack@klust.edu.my",
            staffId: "IEN 00738",
            specialization: "Architecture",
            department: "architecture"
        },
        {
            name: "Ts Idris Bin Taib",
            qualification: "Bsc. Housing Building and Planning, USM. B. Architecture, USM. MBA, UiTM.",
            position: "Senior Lecturer",
            room: "B118",
            ext: "899",
            email: "idristaib@klust.edu.my",
            staffId: "IEN 00563",
            specialization: "The Adaptive Reuse of Historical Building: Fire Safety Provisions for Museum Heritage and Conservation.",
            department: "architecture"
        },
        {
            name: "Ts Mohd Shafiq Bin Ramlan",
            qualification: "Master of Science In Construction Engineering (UiTM), Bach of Eng. (Hons) Civil Eng. (UiTM)",
            position: "Head Of Program – BTCM & BREM, Senior Lecturer",
            room: "B105",
            ext: "787",
            email: "syafiq@klust.edu.my",
            staffId: "IEN 01238",
            specialization: "Construction Management, Quantity Surveying",
            department: "quantity-surveying"
        },
        {
            name: "Zairila Juria Binti Zainal Abidin",
            qualification: "M. Sc. In Urban and Regional Planning (USM), B. SC. (Hon) in Architectural Studies (IIUM)",
            position: "HOP DAR, Senior Lecturer",
            room: "B114",
            ext: "548",
            email: "zairila@klust.edu.my",
            staffId: "IEN 00919",
            specialization: "Urban Architecture",
            department: "architecture"
        },
        {
            name: "Nur Azwanie Bt Nordin",
            qualification: "Master of Science in Heritage & Conservation Management, Bachelor in Landscape Architecture",
            position: "HOP – BLA & DLA, Senior Lecturer",
            room: "B104",
            ext: "846",
            email: "azwanie@klust.edu.my",
            staffId: "IEN 00999",
            specialization: "Landscape Architecture",
            department: "landscape-architecture"
        },
        {
            name: "Aminah Binti Mohamed Bakhari",
            qualification: "Master in Business Administration (Construction Business) 2008 UIA, Bachelor of Quantity Surveying (Hons) UiTM 2003",
            position: "Head of Program, BQS and DQS, Senior Lecturer",
            room: "B119",
            ext: "846",
            email: "aminah@klust.edu.my",
            staffId: "IEN 01297",
            specialization: "Construction Contract, Measurement of Building Works",
            department: "quantity-surveying"
        },
        {
            name: "Mazlina Binti Abdul Manan",
            qualification: "Master in Science FACILITIES MANAGEMENT (UiTM), Degree in Civil Engineering (UTM), Diploma in Civil Engineering (UTM)",
            position: "Senior Lecturer",
            room: "B 122",
            ext: "785",
            email: "mazlina@klust.edu.my",
            staffId: "IEN 00825",
            specialization: "CIVIL ENGINEERING, BUILDING CONSTRUCTION, TECHNOLOGY AND BUILDING STRUCTURE",
            department: "management"
        },
        {
            name: "Sr Sharifah Huda Syed Mohd, PQS",
            qualification: "Msc in Project Management, Bac. Of Quantity Surveying (Hons)",
            position: "Senior Lecturer",
            room: "B126",
            ext: "548",
            email: "sharifah@klust.edu.my",
            staffId: "IEN 00757",
            specialization: "Quantity Surveying",
            department: "quantity-surveying"
        },
        {
            name: "Ahmad Muna'iem Ahmad Fauzi",
            qualification: "Degree in Architecture – Part 2",
            position: "Senior Lecturer",
            room: "B116",
            ext: "593",
            email: "munaiem@klust.edu.my",
            staffId: "IEN 00817",
            specialization: "Architecture Design, Housing planning and Design Conceptual, Islamic Architecture",
            department: "architecture"
        },
        {
            name: "Siti Noraini Ahmad",
            qualification: "BSc (Hon) Architecture; M. Environment",
            position: "Senior Lecturer",
            room: "B108",
            ext: "780",
            email: "sitinoraini@klust.edu.my",
            staffId: "IEN00446",
            specialization: "Sustainable Design, Environmental Impact Assessment",
            department: "architecture"
        },
        {
            name: "Noraqidah Binti Mohamad",
            qualification: "Master of Science (Tourism Planning) UTM, Bac. In Landscape Architecture (UTM)",
            position: "Senior Lecturer",
            room: "B106",
            ext: "782",
            email: "noraqidah@klust.edu.my",
            staffId: "IEN 00697",
            specialization: "Sustainable Landscape Design",
            department: "landscape-architecture"
        },
        {
            name: "Assoc. Prof Ar Mohd Hayazi bin Agusi",
            qualification: "Master Sc. Heritage Conservation & Management, B. Arch (Hons), B.A (Hons) Arch, LAM Part III",
            position: "Senior Lecturer",
            room: "B101",
            ext: "NA",
            email: "hayazi@klust.edu.my",
            staffId: "IEN 00918",
            specialization: "Urban Architecture and Conservation Heritage",
            department: "architecture"
        },
        {
            name: "Dr. 'Adil Farizal bin Md Rashid",
            qualification: "Bsc. Architecture UIA, 2003, Bsc. Housing USM, 2008 (Master in Housing), PHD IUKL",
            position: "Senior Lecturer",
            room: "B123",
            ext: "754",
            email: "adil@klust.edu.my",
            staffId: "IEN 00503",
            specialization: "Housing Design, 3D Architectural Visualization and Animation",
            department: "architecture"
        },
        {
            name: "Azrin Bin Abu Seman",
            qualification: "MSc. In Urban Development & Mgmt (UiTM)",
            position: "Senior Lecturer",
            room: "B109",
            ext: "776",
            email: "azrin@klust.edu.my",
            staffId: "IEN 00983",
            specialization: "Architecture Design, Urban Design, Urban Development and Management, Computer Aided Design and Architectural Drafting",
            department: "architecture"
        },
        {
            name: "Nur Balqis binti Ahmad Safawi",
            qualification: "Master in Built Environment, Bach. Science in Architecture, UIA",
            position: "Senior Lecturer",
            room: "B115",
            ext: "1532",
            email: "balqis@klust.edu.my",
            staffId: "IEN 00926",
            specialization: "Universal Design",
            department: "architecture"
        },
        {
            name: "Siti Hajar bt Mat Haril",
            qualification: "B.Arch (HONS), UiTM, Dip. Arch, UTM",
            position: "Senior Lecturer",
            room: "B115",
            ext: "1532",
            email: "shajar.mharil@klust.edu.my",
            staffId: "IEN 01123",
            specialization: "Architecture",
            department: "architecture"
        },
        {
            name: "Sr Nur Khairul Faizah bt Mustafa",
            qualification: "MSc. in Construction Management, Bach. of Building Surveying (Hons)",
            position: "Senior Lecturer",
            room: "B110",
            ext: "787",
            email: "nurkhairul@klust.edu.my",
            staffId: "IEN00361",
            specialization: "Building Performance, Maintenance Management",
            department: "management"
        },
        {
            name: "Nordianti Abd Rahim",
            qualification: "Dip in Arch (UiTM, Perak), Bachelor in Landscape Architecture (UiTM, Shah Alam), Msc In Heritage and Conservation Management (UiTM, Shah Alam)",
            position: "Senior Lecturer",
            room: "B108",
            ext: "764",
            email: "nordianti@klust.edu.my",
            staffId: "IEN 00896",
            specialization: "Landscape Architecture and Heritage Conservation Management",
            department: "landscape-architecture"
        },
        {
            name: "Mohd Basir bin Abdul Razak",
            qualification: "Master of Science in Heritage and Conservation Management, Bachelor of Landscape Architecture",
            position: "Senior Lecturer",
            room: "B117",
            ext: "592",
            email: "basirrazak@klust.edu.my",
            staffId: "IEN 00864",
            specialization: "Landscape Architecture",
            department: "landscape-architecture"
        },
        {
            name: "Siti Najwa bt Sheikh Yahya",
            qualification: "MA Development & Emergency (Architecture), Oxford Brookes, UK",
            position: "Senior Lecturer",
            room: "B123",
            ext: "547",
            email: "sitinajwa@klust.edu.my",
            staffId: "IEN 00901",
            specialization: "Architecture & Post-Disaster Reconstruction",
            department: "architecture"
        },
        {
            name: "Mohd Suhail bin Ahmad Sahimi",
            qualification: "Master in Landscape Architecture",
            position: "Senior Lecturer",
            room: "B116",
            ext: "547",
            email: "suhail@klust.edu.my",
            staffId: "IEN 01199",
            specialization: "Landscape Architecture",
            department: "landscape-architecture"
        },
        {
            name: "Ar Mohd Kamal Bin Abdullah",
            qualification: "LAM Part 3",
            position: "Lecturer",
            room: "B102",
            ext: "754",
            email: "mohdkamal@klust.edu.my",
            staffId: "IEN 01289",
            specialization: "Urban Architecture",
            department: "architecture"
        },
        {
            name: "Sr. Fazleemardyana bin Omar, CQS",
            qualification: "Registered as Consultant QS (BQSM), Bac. QS, UiTM 2008",
            position: "Lecturer",
            room: "B105",
            ext: "764",
            email: "fazleemardyana@klust.edu.my",
            staffId: "IEN 01295",
            specialization: "Measurement, Construction Contract",
            department: "quantity-surveying"
        }
    ]
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = HANDBOOK_DATA;
}
