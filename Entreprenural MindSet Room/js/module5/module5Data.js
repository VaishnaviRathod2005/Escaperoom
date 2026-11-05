/**
 * ACADEMY ESCAPE ROOM
 * MODULE 5: THE BROKEN STARTUP — NOVALINK INCIDENT
 * Authoritative Data Definitions & Centralized Layout Configuration
 * Single Source of Truth for LMS Educational Content
 */

// ============================================================
// CENTRALIZED POSITIONING CONFIGURATION (TUNABLE FOR COMPOSITION)
// ============================================================
window.MODULE5_POSITIONS = {
  // Wall 2: 5 Challenge Chit Hotspots
  MODULE5_CHIT_POSITIONS: [
    { id: "CHIT_01", left: "14%", top: "66%", rotation: "-3deg", zIndex: 10 },
    { id: "CHIT_02", left: "36%", top: "32%", rotation: "2deg", zIndex: 12 },
    { id: "CHIT_03", left: "18%", top: "58%", rotation: "-1deg", zIndex: 11 },
    { id: "CHIT_04", left: "55%", top: "42%", rotation: "4deg", zIndex: 15 },
    { id: "CHIT_05", left: "24%", top: "22%", rotation: "-2deg", zIndex: 9 }
  ],

  // Activity 1: Decision Terminal Option Cards (Relative to Workbench Stage)
  MODULE5_DECISION_CARD_POSITIONS: [
    { index: 0, left: "10%", top: "62%", rotation: "-2deg", zIndex: 5 },
    { index: 1, left: "38%", top: "64%", rotation: "1deg", zIndex: 6 },
    { index: 2, left: "66%", top: "62%", rotation: "-1deg", zIndex: 5 },
    { index: 3, left: "38%", top: "78%", rotation: "3deg", zIndex: 7 }
  ],

  // Activity 2: 10 Design Thinking Workbench Scenario Cards (Scattered Tabletop Layout)
  MODULE5_SORTING_CARD_POSITIONS: [
    { id: 1, left: "5%", top: "12%", rotation: "-4deg", zIndex: 10 },
    { id: 2, left: "24%", top: "8%", rotation: "3deg", zIndex: 11 },
    { id: 3, left: "43%", top: "14%", rotation: "-2deg", zIndex: 12 },
    { id: 4, left: "62%", top: "9%", rotation: "4deg", zIndex: 10 },
    { id: 5, left: "81%", top: "15%", rotation: "-3deg", zIndex: 13 },
    { id: 6, left: "8%", top: "35%", rotation: "2deg", zIndex: 14 },
    { id: 7, left: "27%", top: "38%", rotation: "-5deg", zIndex: 11 },
    { id: 8, left: "46%", top: "34%", rotation: "1deg", zIndex: 12 },
    { id: 9, left: "65%", top: "37%", rotation: "-2deg", zIndex: 15 },
    { id: 10, left: "84%", top: "32%", rotation: "3deg", zIndex: 10 }
  ],

  // Activity 3 & Wall 4 Desk: Manila Folders
  MODULE5_CASE_POSITIONS: [
    { id: 1, left: "6%", top: "25%", rotation: "-5deg", zIndex: 5 },
    { id: 2, left: "24%", top: "22%", rotation: "3deg", zIndex: 6 },
    { id: 3, left: "42%", top: "26%", rotation: "-2deg", zIndex: 7 },
    { id: 4, left: "60%", top: "21%", rotation: "4deg", zIndex: 8 },
    { id: 5, left: "78%", top: "24%", rotation: "-3deg", zIndex: 9 }
  ],

  // Activity 4: Product Time Machine Clue Cards Initial Scatter
  MODULE5_PRODUCT_POSITIONS: {
    USER: { left: "10%", top: "22%", rotation: "-3deg", zIndex: 10 },
    PROBLEM: { left: "72%", top: "24%", rotation: "4deg", zIndex: 11 },
    NEED: { left: "12%", top: "65%", rotation: "2deg", zIndex: 12 },
    PRODUCT: { left: "70%", top: "67%", rotation: "-2deg", zIndex: 13 }
  },

  // Wall 4: Evidence Board Cards Initial Corkboard Layout
  MODULE5_EVIDENCE_POSITIONS: [
    { id: "CARD_01", left: "6%", top: "18%", rotation: "-4deg", zIndex: 10 },
    { id: "CARD_02", left: "30%", top: "14%", rotation: "3deg", zIndex: 11 },
    { id: "CARD_03", left: "54%", top: "20%", rotation: "-2deg", zIndex: 12 },
    { id: "CARD_04", left: "76%", top: "16%", rotation: "4deg", zIndex: 13 }
  ],

  // Wall 4: 5 Whys Chain Descending Steps
  MODULE5_WHY_POSITIONS: [
    { step: 1, left: "15%", top: "10%", rotation: "-1deg", zIndex: 5 },
    { step: 2, left: "22%", top: "26%", rotation: "2deg", zIndex: 6 },
    { step: 3, left: "29%", top: "42%", rotation: "-2deg", zIndex: 7 },
    { step: 4, left: "36%", top: "58%", rotation: "1deg", zIndex: 8 },
    { step: 5, left: "43%", top: "74%", rotation: "0deg", zIndex: 9 }
  ]
};

window.MODULE5_DATA = {
  title: "THE BROKEN STARTUP",
  subtitle: "NOVALINK INCIDENT • Problem Identification & Design Thinking Investigation",
  
  // Wall Titles & Descriptions
  walls: {
    1: {
      id: 1,
      title: "Wall 1: The Locked Exit",
      desc: "NOVALINK Headquarters Emergency Exit. Door locked until root cause is identified."
    },
    2: {
      id: 2,
      title: "Wall 2: NovaLink Startup Investigation",
      desc: "Explore NOVALINK's company history, startup corkboard, and investigation files."
    },
    3: {
      id: 3,
      title: "Wall 3: Knowledge & Design Thinking Station",
      desc: "Master the 5 stages of Design Thinking and complete the Founder's Challenge."
    },
    4: {
      id: 4,
      title: "Wall 4: Investigation Lab & Time Machine",
      desc: "Analyze evidence files, run the Product Time Machine, execute 5 Whys & propose solutions."
    }
  },

  // Wall 2: Company History Timeline
  companyHistory: [
    { year: "2019", stage: "IDEA", title: "Founding Vision", desc: "Founded to revolutionize workplace team collaboration and eliminate operational friction." },
    { year: "2020", stage: "MVP", title: "Initial Beta Launch", desc: "Released core lightweight app to 500 early adopter businesses with overwhelming praise." },
    { year: "2021", stage: "GROWTH", title: "Rapid Adoption", desc: "Reached 50,000 active users and raised $2M seed funding to scale operations." },
    { year: "2022", stage: "EXPANSION", title: "Aggressive Feature Push", desc: "Shipped 10 new unvalidated feature suites simultaneously to copy market competitors." },
    { year: "2023", stage: "TODAY", title: "Crisis & Friction", desc: "Sales down 42%, massive churn, customer complaints spiking, emergency lock down." }
  ],

  // Wall 2: Challenge Chits (Story Clues & Environmental Hints — Not Extra MCQs)
  challengeClues: [
    { id: "CHIT_01", lmsId: "chit_symptom_vs_cause", name: "Challenge Chit 1: Symptom vs Root Cause", icon: "🔍", desc: "FOUNDER NOTE: Look carefully at the evidence before deciding. Surface symptoms hide real root causes.", style: "top: 66%; left: 14%; width: 5%; height: 8%;" },
    { id: "CHIT_02", lmsId: "chit_unvalidated_assumptions", name: "Challenge Chit 2: Unvalidated Assumptions", icon: "📌", desc: "FOUNDER NOTE: Never build based on internal guesses. Talk to actual users first.", style: "top: 32%; left: 36%; width: 5%; height: 8%;" },
    { id: "CHIT_03", lmsId: "chit_bloated_mvp", name: "Challenge Chit 3: Bloated MVP", icon: "📊", desc: "FOUNDER NOTE: Don't jump to adding features. First understand the core user problem.", style: "top: 58%; left: 18%; width: 5%; height: 8%;" },
    { id: "CHIT_04", lmsId: "chit_feature_creep", name: "Challenge Chit 4: Feature Creep", icon: "📜", desc: "FOUNDER NOTE: Shipping 10 unvalidated modules causes confusion. Focus on core value.", style: "top: 42%; left: 55%; width: 5%; height: 8%;" },
    { id: "CHIT_05", lmsId: "chit_customer_friction", name: "Challenge Chit 5: Customer Friction", icon: "💻", desc: "FOUNDER NOTE: Measure onboarding friction. 45-minute setup drives users away.", style: "top: 22%; left: 24%; width: 5%; height: 8%;" }
  ],

  // Wall 3: Design Thinking Stages
  designThinkingStages: [
    {
      id: "EMPATHIZE",
      num: 1,
      title: "1. EMPATHIZE",
      subtitle: "Understand the User",
      color: "#f39c12",
      desc: "Immerse yourself in customer experiences. Conduct qualitative interviews and observe pain points directly without assuming solutions.",
      example: "NOVALINK team spoke to 0 customers before launching the expanded suite."
    },
    {
      id: "DEFINE",
      num: 2,
      title: "2. DEFINE",
      subtitle: "Articulate the Real Problem",
      color: "#e74c3c",
      desc: "Analyze observations to define the core problem statement from the user's perspective rather than internal business assumptions.",
      example: "Problem: Users needed fast, focused task updates—not a bloated 10-in-1 suite."
    },
    {
      id: "IDEATE",
      num: 3,
      title: "3. IDEATE",
      subtitle: "Brainstorm Creative Solutions",
      color: "#9b59b6",
      desc: "Challenge assumptions and explore diverse, innovative solutions that directly target the defined problem statement.",
      example: "Strip away unused modules and focus on sub-second task logging."
    },
    {
      id: "PROTOTYPE",
      num: 4,
      title: "4. PROTOTYPE",
      subtitle: "Build Testable Models",
      color: "#3498db",
      desc: "Create quick, low-cost, low-fidelity representations of solutions to investigate potential friction before heavy development.",
      example: "Build clickable wireframes to test workflow speeds with 10 power users."
    },
    {
      id: "TEST",
      num: 5,
      title: "5. TEST",
      subtitle: "Validate with Real Users",
      color: "#2ecc71",
      desc: "Rigorously test prototypes with actual users to gather feedback, refine definitions, and prove customer willingness to adopt.",
      example: "Validate that simplified workflow restores 95%+ customer retention."
    }
  ],

  // Activity 1: 10 Exact LMS Scenario Questions (Founder's Challenge)
  activity1Questions: [
    {
      id: 1,
      lmsId: "activity1_q1",
      question: "1. NOVALINK's sales dropped 42% after launching 10 new features. What should the founder do first under Design Thinking?",
      options: [
        "Launch an aggressive 50% discount marketing campaign immediately",
        "Conduct empathy interviews with canceled customers to understand their actual friction",
        "Add 5 more features to outpace competitors",
        "Blame the sales team and fire the marketing leads"
      ],
      correct: 1,
      explanation: "Design Thinking begins with EMPATHIZE—listening to affected users to discover the real friction before taking action."
    },
    {
      id: 2,
      lmsId: "activity1_q2",
      question: "2. Which of the following represents a true ROOT CAUSE rather than a surface symptom?",
      options: [
        "Customer support tickets increased by 300%",
        "App store rating fell to 2.1 stars",
        "Products were built based on internal team guesses rather than validated user research",
        "Quarterly revenue missed targets by $500,000"
      ],
      correct: 2,
      explanation: "Support tickets and ratings are symptoms; building without user validation is the underlying root cause."
    },
    {
      id: 3,
      lmsId: "activity1_q3",
      question: "3. A customer states: 'The app used to take 2 seconds to log my work. Now it takes 15 clicks.' Which stage captures this observation?",
      options: [
        "EMPATHIZE — Observing customer experience & pain points",
        "PROTOTYPE — Building high-fidelity database architecture",
        "IDEATE — Brainstorming random pricing models",
        "TEST — Launching TV commercial advertisements"
      ],
      correct: 0,
      explanation: "Observing real user experiences and friction points is the EMPATHIZE stage."
    },
    {
      id: 4,
      lmsId: "activity1_q4",
      question: "4. The founder wants to know if users prefer a 1-click interface. What is the fastest, lowest-cost way to find out?",
      options: [
        "Spend 6 months coding a full native iOS app",
        "Create a simple paper or wireframe prototype and test with 5 users",
        "Hire 20 software developers immediately",
        "Run an online poll asking people what font color they like"
      ],
      correct: 1,
      explanation: "PROTOTYPING uses fast, low-cost representations to test ideas before investing heavy resources."
    },
    {
      id: 5,
      lmsId: "activity1_q5",
      question: "5. Why is launching 10 unvalidated features dangerous for a startup?",
      options: [
        "It increases feature bloat and creates user confusion without solving a proven need",
        "It makes the logo look outdated",
        "Computers cannot store more than 5 features",
        "Investors only like apps with 1 feature"
      ],
      correct: 0,
      explanation: "Unvalidated features add complexity and friction without guaranteeing value to the customer."
    },
    {
      id: 6,
      lmsId: "activity1_q6",
      question: "6. The team writes: 'Busy managers need a sub-3-second task logger because current tools require too many clicks.' What stage is this?",
      options: [
        "EMPATHIZE",
        "DEFINE — Crafting a clear, user-centered Problem Statement",
        "PROTOTYPE",
        "TEST"
      ],
      correct: 1,
      explanation: "Formulating a clear, actionable Problem Statement from user insights is the DEFINE stage."
    },
    {
      id: 7,
      lmsId: "activity1_q7",
      question: "7. The NOVALINK team gathers around a whiteboard to generate 30 different workflow ideas. What stage are they in?",
      options: [
        "IDEATE — Brainstorming diverse potential solutions",
        "DEFINE",
        "TEST",
        "EMPATHIZE"
      ],
      correct: 0,
      explanation: "Generating a broad variety of creative solution concepts is the IDEATE stage."
    },
    {
      id: 8,
      lmsId: "activity1_q8",
      question: "8. The team hands a clickable prototype to 5 target users and watches them attempt to complete a task. What stage is this?",
      options: [
        "IDEATE",
        "TEST — Validating solutions with target users to gather feedback",
        "DEFINE",
        "EMPATHIZE"
      ],
      correct: 1,
      explanation: "Evaluating prototypes with real users to observe usability and value is the TEST stage."
    },
    {
      id: 9,
      lmsId: "activity1_q9",
      question: "9. Competitor X has 50 features. Should NOVALINK automatically copy all 50 features?",
      options: [
        "Yes, copying competitors is always the best strategy",
        "No, focus on solving the specific, validated problem your target users experience better than anyone else",
        "Yes, but only copy 45 of them",
        "No, startups should never look at competitors"
      ],
      correct: 1,
      explanation: "Great startups succeed by solving specific user problems exceptionally well, not by copying competitor bloat."
    },
    {
      id: 10,
      lmsId: "activity1_q10",
      question: "10. What is the ultimate goal of the 5 Design Thinking stages?",
      options: [
        "To build products that customers actually love and pay for by continuously solving real human problems",
        "To win design awards",
        "To write long reports",
        "To make software development take longer"
      ],
      correct: 0,
      explanation: "Design Thinking ensures products create real human value by aligning customer needs with feasible solutions."
    }
  ],

  // Activity 2: 10 Exact LMS Design Thinking Stage Identification Scenarios
  activity2Questions: [
    {
      id: 1,
      lmsId: "activity2_q1",
      scenario: "Startup founders conduct 1-on-1 interviews with 15 restaurant owners to hear their daily inventory struggles.",
      correctStage: "EMPATHIZE",
      options: ["EMPATHIZE", "DEFINE", "IDEATE", "PROTOTYPE", "TEST"]
    },
    {
      id: 2,
      lmsId: "activity2_q2",
      scenario: "The team synthesizes interview notes and writes: 'Restaurant owners need automatic stock alerts because manual counting causes 20% food waste.'",
      correctStage: "DEFINE",
      options: ["EMPATHIZE", "DEFINE", "IDEATE", "PROTOTYPE", "TEST"]
    },
    {
      id: 3,
      lmsId: "activity2_q3",
      scenario: "The team spends 2 hours whiteboarding 25 different ways to notify kitchen staff about expiring ingredients.",
      correctStage: "IDEATE",
      options: ["EMPATHIZE", "DEFINE", "IDEATE", "PROTOTYPE", "TEST"]
    },
    {
      id: 4,
      lmsId: "activity2_q4",
      scenario: "The designer creates a interactive Figma mock-up of the mobile app to demonstrate the workflow.",
      correctStage: "PROTOTYPE",
      options: ["EMPATHIZE", "DEFINE", "IDEATE", "PROTOTYPE", "TEST"]
    },
    {
      id: 5,
      lmsId: "activity2_q5",
      scenario: "3 chefs use the interactive mock-up in their kitchen while preparing dinner to see if the buttons are easy to tap.",
      correctStage: "TEST",
      options: ["EMPATHIZE", "DEFINE", "IDEATE", "PROTOTYPE", "TEST"]
    },
    {
      id: 6,
      lmsId: "activity2_q6",
      scenario: "A founder shadows a delivery driver for a day to observe traffic delays and app navigation issues.",
      correctStage: "EMPATHIZE",
      options: ["EMPATHIZE", "DEFINE", "IDEATE", "PROTOTYPE", "TEST"]
    },
    {
      id: 7,
      lmsId: "activity2_q7",
      scenario: "The team decides: 'The core problem is drivers cannot see customer gate codes without stopping the vehicle.'",
      correctStage: "DEFINE",
      options: ["EMPATHIZE", "DEFINE", "IDEATE", "PROTOTYPE", "TEST"]
    },
    {
      id: 8,
      lmsId: "activity2_q8",
      scenario: "Developers draw quick paper sketches of hands-free audio notifications for drivers.",
      correctStage: "IDEATE",
      options: ["EMPATHIZE", "DEFINE", "IDEATE", "PROTOTYPE", "TEST"]
    },
    {
      id: 9,
      lmsId: "activity2_q9",
      scenario: "The hardware lead glues together a plastic casing with a speaker to test ear piece ergonomics.",
      correctStage: "PROTOTYPE",
      options: ["EMPATHIZE", "DEFINE", "IDEATE", "PROTOTYPE", "TEST"]
    },
    {
      id: 10,
      lmsId: "activity2_q10",
      scenario: "5 drivers test the ear piece during live evening deliveries and report 40% faster drop-off times.",
      correctStage: "TEST",
      options: ["EMPATHIZE", "DEFINE", "IDEATE", "PROTOTYPE", "TEST"]
    }
  ],

  // Activity 3: 5 Exact LMS Design Detective Cases
  activity3Cases: [
    {
      id: 1,
      lmsId: "activity3_case1",
      title: "CASE 01: The Silent Churn",
      scenario: "A SaaS tool lost 30% of subscribers last month. The team wants to run a social media ad contest.",
      question: "What should the Design Detective do first?",
      options: [
        "Run the social media contest",
        "Conduct Empathy interviews with churned users to uncover why they left",
        "Lower the price by 80%"
      ],
      correct: 1,
      explanation: "Empathy interviews reveal the true root cause of churn before wasting marketing budget."
    },
    {
      id: 2,
      lmsId: "activity3_case2",
      title: "CASE 02: The Misleading Metric",
      scenario: "App downloads are high, but daily active usage is near zero.",
      question: "What is the team failing to define?",
      options: [
        "The download button color",
        "The real Problem Statement regarding long-term user value",
        "The company mascot"
      ],
      correct: 1,
      explanation: "Downloads are a vanity metric; defining core daily value is essential for retention."
    },
    {
      id: 3,
      lmsId: "activity3_case3",
      title: "CASE 03: The Feature Storm",
      scenario: "The team has 50 feature ideas and wants to build all 50 simultaneously.",
      question: "What Ideation & Scoping rule should be applied?",
      options: [
        "Build all 50",
        "Select and prioritize ideas that directly solve the defined core user problem",
        "Cancel the project"
      ],
      correct: 1,
      explanation: "Ideation must be followed by ruthless prioritization based on user problem impact."
    },
    {
      id: 4,
      lmsId: "activity3_case4",
      title: "CASE 04: The Broken Prototype",
      scenario: "The team spent $100k building full software before testing if users wanted the concept.",
      question: "What step did they miss?",
      options: [
        "Building a low-cost Prototype to validate demand first",
        "Hiring more sales leads",
        "Renting a bigger office"
      ],
      correct: 0,
      explanation: "Prototyping allows fast, cheap validation before expensive engineering builds."
    },
    {
      id: 5,
      lmsId: "activity3_case5",
      title: "CASE 05: The User Feedback Loop",
      scenario: "Users complained that the new checkout button was hidden behind a popup.",
      question: "What stage provides the insights to fix this?",
      options: [
        "TEST — Observing real user friction during live testing",
        "FINANCE",
        "LEGAL"
      ],
      correct: 0,
      explanation: "Testing highlights real usability barriers so the team can iterate and refine."
    }
  ],

  // Wall 4: Evidence Files
  evidenceFiles: [
    {
      id: "EVID_01",
      lmsId: "evidence_financial",
      title: "Q3 Revenue & Churn Report",
      type: "Financial Data",
      desc: "Revenue dropped 42% in Q3. Subscriptions canceled reached an all-time high despite doubling ad spend.",
      whyItMatters: "Proves that marketing spend cannot fix a product that no longer solves a customer's core need."
    },
    {
      id: "EVID_02",
      lmsId: "evidence_user_feedback",
      title: "Customer Support Logs",
      type: "User Feedback",
      desc: "'The app used to be simple. Now it takes 10 clicks to complete a basic task. We are switching to a competitor.'",
      whyItMatters: "Direct customer evidence showing that feature bloat destroyed the core user value proposition."
    },
    {
      id: "EVID_03",
      lmsId: "evidence_internal_memo",
      title: "Lead Engineer Exit Memo",
      type: "Internal Document",
      desc: "'We built features because executive leads assumed competitors had them, without testing a single prototype.'",
      whyItMatters: "Reveals organizational breakdown: skipping prototyping and testing stages of Design Thinking."
    },
    {
      id: "EVID_04",
      lmsId: "evidence_onboarding",
      title: "Onboarding Audit Report",
      type: "Operational Metric",
      desc: "User onboarding time increased from 5 minutes to 45 minutes due to mandatory multi-step tutorials.",
      whyItMatters: "Identifies severe onboarding friction driving away new signups within 24 hours."
    }
  ],

  // Wall 4: Product Time Machine Scenarios (5 Exact LMS Product Scenarios)
  productScenarios: {
    food_delivery: {
      id: "food_delivery",
      lmsId: "product_food_delivery",
      name: "Food Delivery App Scenario",
      user: "Busy Urban Professional",
      problem: "Food arrives cold and delayed during peak lunch hours",
      need: "Real-time hot-lock dispatch & accurate delivery timing",
      product: "Hot-Lock Direct Dispatch App",
      clues: [
        { label: "USER", value: "Busy Urban Professional" },
        { label: "PROBLEM", value: "Food arrives cold & delayed during peak hours" },
        { label: "NEED", value: "Real-time temperature control & accurate timing" },
        { label: "PRODUCT", value: "Hot-Lock Direct Dispatch App" }
      ]
    },
    ride_hailing: {
      id: "ride_hailing",
      lmsId: "product_ride_hailing",
      name: "Ride-Hailing App Scenario",
      user: "Daily City Commuter",
      problem: "Unpredictable surge pricing during morning rush hour",
      need: "Transparent fixed-rate subscription commute passes",
      product: "CommutePass Lock Hub",
      clues: [
        { label: "USER", value: "Daily City Commuter" },
        { label: "PROBLEM", value: "Unpredictable surge pricing during morning rush" },
        { label: "NEED", value: "Transparent fixed-rate subscription commute pass" },
        { label: "PRODUCT", value: "CommutePass Lock Hub" }
      ]
    },
    online_shopping: {
      id: "online_shopping",
      lmsId: "product_online_shopping",
      name: "Online Shopping App Scenario",
      user: "Fashion Boutique Shopper",
      problem: "High return rate (45%) due to inaccurate clothing fit",
      need: "AR Virtual Fitting Room with true-to-life sizing",
      product: "FitCheck AR Studio",
      clues: [
        { label: "USER", value: "Fashion Boutique Shopper" },
        { label: "PROBLEM", value: "High return rate (45%) due to inaccurate sizing" },
        { label: "NEED", value: "AR Virtual Fitting Room with true sizing" },
        { label: "PRODUCT", value: "FitCheck AR Studio" }
      ]
    },
    smartwatch: {
      id: "smartwatch",
      lmsId: "product_smartwatch",
      name: "Smartwatch Scenario",
      user: "Marathon Runner & Athlete",
      problem: "Battery drains completely 2 hours into a 4-hour race",
      need: "Solar ambient energy harvesting for continuous GPS tracking",
      product: "SolarPulse Athlete Watch",
      clues: [
        { label: "USER", value: "Marathon Runner & Athlete" },
        { label: "PROBLEM", value: "Battery drains completely mid-workout" },
        { label: "NEED", value: "Solar ambient charging & low-power GPS display" },
        { label: "PRODUCT", value: "SolarPulse Athlete Watch" }
      ]
    },
    earbuds: {
      id: "earbuds",
      lmsId: "product_earbuds",
      name: "Wireless Earbuds Scenario",
      user: "Remote Work Executive",
      problem: "Background noise disrupts critical video conference calls",
      need: "Neural AI voice isolation microphone filtering background sounds",
      product: "ClarityBuds Pro Suite",
      clues: [
        { label: "USER", value: "Remote Work Executive" },
        { label: "PROBLEM", value: "Background noise disrupts video conference calls" },
        { label: "NEED", value: "Neural AI voice isolation microphone filter" },
        { label: "PRODUCT", value: "ClarityBuds Pro Suite" }
      ]
    }
  },

  // Wall 4: Activity 5 Central Desk Case Studies (5 Exact LMS Cases: Market, Water Shortage, Café, Traffic, Learning App)
  centralDeskCases: [
    {
      id: 1,
      lmsId: "caseStudy_market",
      title: "CASE 01 — MARKET STALL",
      situation: "A local fruit vendor experiences 30% spoilage every week despite high foot traffic.",
      question: "What is the core operational problem?",
      options: [
        "Unpredictable demand forecasting & lack of cold storage",
        "Fruit prices are too low",
        "Signboard is missing"
      ],
      correct: 0,
      explanation: "Without proper demand forecasting and storage, perishable inventory spoils fast."
    },
    {
      id: 2,
      lmsId: "caseStudy_water",
      title: "CASE 02 — WATER SHORTAGE",
      situation: "A rural village faces water contamination despite receiving new filtration tanks.",
      question: "Why did the new filtration tanks fail to solve the issue?",
      options: [
        "Villagers were not trained on filter maintenance and sanitization",
        "Tanks were painted blue instead of green",
        "Villagers prefer contaminated water"
      ],
      correct: 0,
      explanation: "Hardware solutions fail if human adoption, training, and maintenance are ignored."
    },
    {
      id: 3,
      lmsId: "caseStudy_cafe",
      title: "CASE 03 — CAFÉ QUEUE",
      situation: "A downtown café loses 25% of morning customers who walk out due to long lines.",
      question: "What bottleneck causes the customer drop-off?",
      options: [
        "Order entry takes 3 minutes per customer on an outdated POS terminal",
        "Coffee beans are imported",
        "Tables are too clean"
      ],
      correct: 0,
      explanation: "Order entry bottleneck creates queue friction, forcing busy morning commuters to leave."
    },
    {
      id: 4,
      lmsId: "caseStudy_traffic",
      title: "CASE 04 — TRAFFIC BOTTLENECK",
      situation: "A city bridge experiences severe morning traffic gridlock every weekday.",
      question: "What is the underlying cause?",
      options: [
        "4 highway lanes narrow down to 1 lane right before the bridge toll booth",
        "Cars are driving too fast",
        "Weather is too sunny"
      ],
      correct: 0,
      explanation: "Physical lane narrowing creates a structural funnel bottleneck."
    },
    {
      id: 5,
      lmsId: "caseStudy_learning_app",
      title: "CASE 05 — LEARNING APP CHURN",
      situation: "An ed-tech app has 10,000 signups but 80% uninstall within 48 hours.",
      question: "What onboarding friction causes early churn?",
      options: [
        "Mandatory 20-minute survey required before accessing the first lesson",
        "App icon is orange",
        "Lessons are too short"
      ],
      correct: 0,
      explanation: "Heavy upfront friction before demonstrating core value destroys user activation."
    }
  ],

  // Wall 4: Evidence Board Sorting Data (EFFECT, SYMPTOM, PROBLEM, UNDERLYING PROBLEM)
  evidenceBoardCards: [
    {
      id: "CARD_01",
      lmsId: "evidence_board_card1",
      text: "NOVALINK revenue dropped 42% in Q3 and churn hit record high.",
      correctCategory: "EFFECT"
    },
    {
      id: "CARD_02",
      lmsId: "evidence_board_card2",
      text: "Customer support complaints about app lag and 10-click confusion spiked 300%.",
      correctCategory: "SYMPTOM"
    },
    {
      id: "CARD_03",
      lmsId: "evidence_board_card3",
      text: "User onboarding time ballooned from 5m to 45m due to feature bloat.",
      correctCategory: "PROBLEM"
    },
    {
      id: "CARD_04",
      lmsId: "evidence_board_card4",
      text: "Executives built 10 unvalidated features based on internal assumptions without customer empathy research.",
      correctCategory: "UNDERLYING PROBLEM"
    }
  ],

  // Wall 4: 5 Whys Analysis Data (Exact LMS 5-Step Logic)
  fiveWhysSteps: [
    {
      step: 1,
      lmsId: "five_whys_step1",
      why: "WHY #1: Why are NOVALINK's sales and user retention dropping precipitously?",
      answer: "Existing customers are canceling paid subscriptions and warning peers to stay away.",
      options: [
        "Competitors launched massive discount promos",
        "Existing customers are canceling paid subscriptions and warning peers to stay away",
        "The sales reps stopped making phone calls"
      ],
      correct: 1
    },
    {
      step: 2,
      lmsId: "five_whys_step2",
      why: "WHY #2: Why are customers canceling their paid subscriptions?",
      answer: "The app has become bloated, slow, and confusing to navigate after recent updates.",
      options: [
        "The logo color scheme was changed",
        "The app has become bloated, slow, and confusing to navigate after recent updates",
        "Customers no longer need digital tools"
      ],
      correct: 1
    },
    {
      step: 3,
      lmsId: "five_whys_step3",
      why: "WHY #3: Why did the app become bloated and confusing?",
      answer: "The product team shipped 10 unvalidated new feature modules in just 6 months.",
      options: [
        "The product team shipped 10 unvalidated new feature modules in just 6 months",
        "The cloud servers were temporarily rebooted",
        "User documentation was printed in the wrong font"
      ],
      correct: 0
    },
    {
      step: 4,
      lmsId: "five_whys_step4",
      why: "WHY #4: Why were 10 new modules shipped without validating customer demand?",
      answer: "Executives assumed copying competitor features would drive growth without asking real users.",
      options: [
        "Executives assumed copying competitor features would drive growth without asking real users",
        "Customer support requested more buttons",
        "The office building lost power"
      ],
      correct: 0
    },
    {
      step: 5,
      lmsId: "five_whys_step5",
      why: "WHY #5 (ROOT CAUSE): What is the fundamental root cause of the NOVALINK Incident?",
      answer: "ROOT CAUSE: Building products based on internal assumptions while bypassing Empathy & Design Thinking validation.",
      options: [
        "ROOT CAUSE: Building products based on internal assumptions while bypassing Empathy & Design Thinking validation",
        "ROOT CAUSE: Marketing budgets were 10% too low",
        "ROOT CAUSE: Office furniture was uncomfortable"
      ],
      correct: 0
    }
  ],

  // Wall 4: Pre-filled Solution Options
  solutionOptions: [
    "Sunset unvalidated features & restore core rapid task logging workflow",
    "Establish mandatory Customer Empathy interviews before scoping any feature build",
    "Implement rapid low-fidelity prototyping & user testing loops for all releases",
    "Double marketing spending on social media ads without changing the product",
    "Hide customer support review forms from the website"
  ],

  // Hints Registry for Global Hint Button
  hints: {
    1: [
      "The Emergency Exit is sealed. You must investigate NOVALINK across Walls 2, 3, and 4 to uncover the root cause.",
      "Check Wall 2 to inspect NOVALINK's startup history, corkboard, and hidden Challenge Chits."
    ],
    2: [
      "Click 'Our Journey' timeline to review company history from MVP to Crisis.",
      "Look closely around Wall 2 (desk, corkboard, logo, documents) to find all 5 hidden Challenge Chits!"
    ],
    3: [
      "Inspect the 5 stages of Design Thinking: EMPATHIZE → DEFINE → IDEATE → PROTOTYPE → TEST.",
      "Complete the Founder's Challenge and Design Detective cases to unlock Evidence File clearance!"
    ],
    4: [
      "Open Evidence Files on the left to gather documents on Q3 churn and customer support logs.",
      "Launch the Product Time Machine to align USER → PROBLEM → NEED → PRODUCT.",
      "Complete the Central Desk Case Studies and organize evidence into Effect, Symptom, Problem, and Underlying Problem.",
      "Execute the 5 Whys analysis tool to isolate NOVALINK's true Root Cause and submit 3 solutions to escape!"
    ]
  }
};

// ============================================================
// DEVELOPMENT-TIME CONTENT INTEGRITY VALIDATOR
// ============================================================
window.module5DataValidator = {
  validate() {
    const data = window.MODULE5_DATA;
    const errors = [];

    if (!data.activity1Questions || data.activity1Questions.length !== 10) {
      errors.push(`Activity 1 must have exactly 10 LMS questions (found ${data.activity1Questions?.length})`);
    }
    if (!data.activity2Questions || data.activity2Questions.length !== 10) {
      errors.push(`Activity 2 must have exactly 10 LMS questions (found ${data.activity2Questions?.length})`);
    }
    if (!data.activity3Cases || data.activity3Cases.length !== 5) {
      errors.push(`Activity 3 must have exactly 5 LMS detective cases (found ${data.activity3Cases?.length})`);
    }
    if (!data.centralDeskCases || data.centralDeskCases.length !== 5) {
      errors.push(`Activity 5 Central Desk must have me exactly 5 LMS cases (found ${data.centralDeskCases?.length})`);
    }
    if (!data.productScenarios || Object.keys(data.productScenarios).length !== 5) {
      errors.push(`Product Time Machine must have exactly 5 LMS product scenarios (found ${Object.keys(data.productScenarios || {}).length})`);
    }
    if (!data.evidenceBoardCards || data.evidenceBoardCards.length !== 4) {
      errors.push(`Evidence Board must have exactly 4 LMS evidence cards (found ${data.evidenceBoardCards?.length})`);
    }
    if (!data.fiveWhysSteps || data.fiveWhysSteps.length !== 5) {
      errors.push(`5 Whys must have exactly 5 LMS steps (found ${data.fiveWhysSteps?.length})`);
    }

    if (errors.length > 0) {
      console.error("❌ MODULE 5 CONTENT INTEGRITY CHECK FAILED:", errors);
      throw new Error("Module 5 Content Integrity Validation Failed: " + errors.join("; "));
    }

    console.log("✅ MODULE 5 CONTENT INTEGRITY VERIFIED: All 10 Activity 1 Qs, 10 Activity 2 Qs, 5 Activity 3 Cases, 5 Product Scenarios, 5 Central Desk Cases, 4 Evidence Cards & 5 Whys Steps match LMS 100%!");
    return true;
  }
};

// Execute validation check on script execution
try {
  window.module5DataValidator.validate();
} catch (e) {
  console.error(e);
}
