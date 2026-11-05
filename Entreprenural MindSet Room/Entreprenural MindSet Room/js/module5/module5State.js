/**
 * ACADEMY ESCAPE ROOM
 * MODULE 5: THE BROKEN STARTUP — NOVALINK INCIDENT
 * Persistent Module 5 State Architecture & Centralized Gate Evaluator
 */

// ============================================================
// TEMPORARY DEVELOPMENT RESET MODE
// Set to true for fresh test runs on page reload during development
// Set to false for production persistence across sessions
// ============================================================
window.MODULE5_DEV_MODE = true;

const MODULE5_STORAGE_KEY = 'NOVALINK_MODULE5_STATE_V1';

class Module5State {
  constructor() {
    this.defaultState = {
      currentWall: 1,
      challengeChitsFound: [], // [ 'CHIT_01', 'CHIT_02', 'CHIT_03', 'CHIT_04', 'CHIT_05' ]
      knowledgeUnlocked: false,
      videoCompleted: false,
      activity1Completed: false,
      activity1Progress: {}, // { qId: true }
      activity1SolvedCount: 0,
      activity2Completed: false,
      activity2Progress: {}, // { qId: true }
      activity3Completed: false,
      activity3Progress: {}, // { caseId: true }
      discoveredEvidence: {}, // { evidId: true }
      evidenceUnlocked: false,
      selectedProductScenario: 'food_delivery', // Default scenario, persisted
      productTimeMachineCompleted: false,
      casesCompleted: [], // [ 1, 2, 3, 4, 5 ]
      activity5Completed: false,
      evidenceBoardCompleted: false,
      evidenceBoardPlacements: {},
      fiveWhysStep: 1,
      fiveWhysCompleted: false,
      solutionsSubmitted: [],
      reflection: '',
      rootCauseIdentified: false,
      completed: false,
      persistentShuffles: {}, // { key: [ { originalIdx, data } ] }
      wall1: {
        matches: { neha: null, sanket: null, adidas: null },
        isPuzzleComplete: false,
        isScannerActive: false,
        isKnowledgeBox1Unlocked: false,
        completedModule21MediaIds: [],
        isModule21QuizPassed: false,
        module21QuizScore: 0,
        completedModule21ActivityIds: [],
        isPuzzle2Complete: false,
        completedModule22MediaIds: [],
        isModule22QuizPassed: false,
        module22QuizScore: 0,
        isModule22SelfAssessmentComplete: false,
        module22Ratings: {},
        isClue01Revealed: false,
        isWall1Complete: false
      },
      wall2: {
        timelineSlots: [null, null, null, null, null],
        isPuzzleSolved: false,
        isSimulatorActive: false,
        isKnowledgeBox2Unlocked: false,
        isPodcastWatched: false,
        isModule23QuizPassed: false,
        module23QuizScore: 0,
        isCareerActivityCompleted: false,
        careerActivityData: {
          dream: '',
          year1: '',
          year10: '',
          year20: '',
          year30: '',
          beyond30: '',
          skills: '',
          nextSteps: ''
        },
        isClue02Revealed: false,
        isWall2Complete: false
      },
      wall3: {
        stationMatches: {
          shubham: null,
          tanvi: null,
          nikhil: null,
          anushka: null,
          karan: null
        },
        isMatchingPuzzleComplete: false,
        isSimulatorActivated: false,
        isKnowledgeBox3Unlocked: false,
        module24: {
          isPodcastComplete: false,
          isDiscussionGuideReviewed: false,
          quizScore: 0,
          quizPassed: false,
          isComplete: false
        },
        module25: {
          isPodcastComplete: false,
          discussionQuestionsReviewed: [false, false, false],
          discussionPointerSelections: [[false, false, false], [false, false, false], [false, false, false]],
          isDiscussionGuideReviewed: false,
          quizScore: 0,
          quizPassed: false,
          isComplete: false
        },
        isWall3Complete: false,
        isFinalClueRevealed: false,
        isWall4Unlocked: false
      },
      wall4: {
        isMotivationPuzzleComplete: false,
        puzzleMatches: {},
        isWhyCoreActive: false,
        isKnowledgeBox4Unlocked: false,
        isPodcast26Reviewed: false,
        discussionQuestionsReviewed: [false, false, false],
        isDiscussionGuideReviewed: false,
        careerRoots: {
          learning1: '',
          learning2: '',
          learning3: '',
          network1Name: '',
          network1Learn: '',
          network1Frequency: '',
          network2Name: '',
          network2Learn: '',
          network2Frequency: '',
          network3Name: '',
          network3Learn: '',
          network3Frequency: '',
          support1Name: '',
          support1Action: '',
          support1Skill: '',
          support2Name: '',
          support2Action: '',
          support2Skill: '',
          support3Name: '',
          support3Action: '',
          support3Skill: '',
          marketLivingCosts: false,
          marketSkillsDemand: false,
          marketIndustryTrends: false,
          marketSpending: false,
          marketEarning: false,
          marketConcept: '',
          growthStep1: '',
          growthStep2: '',
          growthStep3: '',
          learning: '',
          learningAction: '',
          network: '',
          networkSupport: '',
          financialScore: 3,
          financialNotes: '',
          financialGoal: '',
          superpower: '',
          superpowerTags: []
        },
        isCareerRootsComplete: false,
        isFinalClueRevealed: false,
        isWall4Complete: false,
        isExitUnlocked: false,
        isLabCompleted: false
      }
    };

    this.state = this.load();
  }

  load() {
    // DEVELOPMENT RESET MODE: Start fresh whenever DEV_MODE is true, with session-level fallback
    if (window.MODULE5_DEV_MODE === true) {
      const freshDevState = JSON.parse(JSON.stringify(this.defaultState));
      const scenarios = Object.keys(window.MODULE5_DATA?.productScenarios || {});
      freshDevState.selectedProductScenario = scenarios.length > 0 ? scenarios[0] : 'food_delivery';
      try {
        const sessionSaved1 = sessionStorage.getItem('MINDSET_WALL1_SESSION');
        if (sessionSaved1) {
          freshDevState.wall1 = Object.assign({}, freshDevState.wall1, JSON.parse(sessionSaved1));
        }
        const sessionSaved2 = sessionStorage.getItem('MINDSET_WALL2_SESSION');
        if (sessionSaved2) {
          freshDevState.wall2 = Object.assign({}, freshDevState.wall2, JSON.parse(sessionSaved2));
        }
        const sessionSaved3 = sessionStorage.getItem('MINDSET_WALL3_SESSION');
        if (sessionSaved3) {
          freshDevState.wall3 = Object.assign({}, freshDevState.wall3, JSON.parse(sessionSaved3));
        }
        const sessionSaved4 = sessionStorage.getItem('MINDSET_WALL4_SESSION');
        if (sessionSaved4) {
          freshDevState.wall4 = Object.assign({}, freshDevState.wall4, JSON.parse(sessionSaved4));
        }
      } catch (e) {}
      return freshDevState;
    }

    try {
      const saved = localStorage.getItem(MODULE5_STORAGE_KEY) || sessionStorage.getItem(MODULE5_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const merged = Object.assign({}, this.defaultState, parsed);
        if (parsed.wall1) merged.wall1 = Object.assign({}, this.defaultState.wall1, parsed.wall1);
        if (parsed.wall2) merged.wall2 = Object.assign({}, this.defaultState.wall2, parsed.wall2);
        if (parsed.wall3) merged.wall3 = Object.assign({}, this.defaultState.wall3, parsed.wall3);
        if (parsed.wall4) merged.wall4 = Object.assign({}, this.defaultState.wall4, parsed.wall4);
        return merged;
      }
    } catch (e) {}

    const scenarios = Object.keys(window.MODULE5_DATA?.productScenarios || {});
    const randomScenario = scenarios.length > 0 
      ? scenarios[Math.floor(Math.random() * scenarios.length)] 
      : 'food_delivery';

    const freshState = Object.assign({}, this.defaultState, {
      selectedProductScenario: randomScenario
    });

    return freshState;
  }

  isWall1Complete() {
    const w1 = this.state.wall1;
    if (!w1) return false;
    const module22TraitKeys = [
      'creativity', 'resilience', 'initiative', 'riskTaking', 'adaptability',
      'problemSolving', 'passion', 'selfDiscipline', 'curiosity', 'accountability',
      'networking', 'vision', 'confidence', 'persistence', 'decisionMaking'
    ];
    const hasRatedEveryModule22Trait = module22TraitKeys.every(key =>
      Number.isInteger(w1.module22Ratings?.[key]) &&
      w1.module22Ratings[key] >= 1 &&
      w1.module22Ratings[key] <= 5
    );
    return !!(
      w1.isPuzzleComplete &&
      w1.completedModule21MediaIds && w1.completedModule21MediaIds.length > 0 &&
      w1.isModule21QuizPassed &&
      w1.completedModule21ActivityIds && w1.completedModule21ActivityIds.length >= 3 &&
      w1.isPuzzle2Complete &&
      w1.completedModule22MediaIds && w1.completedModule22MediaIds.length > 0 &&
      w1.isModule22QuizPassed &&
      w1.isModule22SelfAssessmentComplete &&
      hasRatedEveryModule22Trait
    );
  }

  isWall2Complete() {
    const w2 = this.state.wall2;
    if (!w2) return false;
    return !!(
      w2.isPuzzleSolved &&
      w2.isPodcastWatched &&
      w2.isModule23QuizPassed &&
      w2.isCareerActivityCompleted
    );
  }

  isWall3Complete() {
    const w3 = this.state.wall3;
    if (!w3) return false;
    return !!(
      w3.isMatchingPuzzleComplete &&
      w3.isSimulatorActivated &&
      w3.isKnowledgeBox3Unlocked &&
      w3.module24 && w3.module24.isPodcastComplete &&
      w3.module24.isDiscussionGuideReviewed &&
      w3.module24.quizPassed &&
      w3.module25 && w3.module25.isPodcastComplete &&
      w3.module25.isDiscussionGuideReviewed &&
      w3.module25.quizPassed &&
      w3.isWall3Complete
    );
  }

  isWall4Complete() {
    const w4 = this.state.wall4;
    if (!w4) return false;
    return !!(
      w4.isMotivationPuzzleComplete &&
      w4.isWhyCoreActive &&
      w4.isKnowledgeBox4Unlocked &&
      w4.isPodcast26Reviewed &&
      w4.isDiscussionGuideReviewed &&
      w4.isCareerRootsComplete &&
      w4.isFinalClueRevealed &&
      w4.isWall4Complete
    );
  }

  isLabComplete() {
    return this.isWall1Complete() && this.isWall2Complete() && this.isWall3Complete() && this.isWall4Complete();
  }

  save() {
    try {
      if (this.state.wall1) {
        sessionStorage.setItem('MINDSET_WALL1_SESSION', JSON.stringify(this.state.wall1));
      }
      if (this.state.wall2) {
        sessionStorage.setItem('MINDSET_WALL2_SESSION', JSON.stringify(this.state.wall2));
      }
      if (this.state.wall3) {
        sessionStorage.setItem('MINDSET_WALL3_SESSION', JSON.stringify(this.state.wall3));
      }
      if (this.state.wall4) {
        sessionStorage.setItem('MINDSET_WALL4_SESSION', JSON.stringify(this.state.wall4));
      }
    } catch (e) {}

    // Skip saving to storage if DEV_MODE is active
    if (window.MODULE5_DEV_MODE === true) return;

    try {
      const serialized = JSON.stringify(this.state);
      localStorage.setItem(MODULE5_STORAGE_KEY, serialized);
      sessionStorage.setItem(MODULE5_STORAGE_KEY, serialized);
    } catch (e) {}

    // Sync with global player state room 5 progress
    if (window.gameState && window.gameState.state.rooms[5]) {
      const r5 = window.gameState.state.rooms[5];
      let score = 0;
      if (this.state.challengeChitsFound.length >= 5) score += 15;
      if (this.state.knowledgeUnlocked) score += 10;
      if (this.state.activity1Completed) score += 15;
      if (this.state.activity3Completed) score += 15;
      if (this.state.productTimeMachineCompleted) score += 15;
      if (this.state.fiveWhysCompleted) score += 15;
      if (this.state.rootCauseIdentified) score += 15;
      
      r5.progress = Math.min(100, score);
      if (this.state.completed) {
        r5.status = 'completed';
        r5.escaped = true;
        r5.progress = 100;
      } else if (score > 0) {
        r5.status = 'in_progress';
      }

      window.gameState.save();
    }
  }

  reset() {
    this.state = JSON.parse(JSON.stringify(this.defaultState));
    try {
      localStorage.removeItem(MODULE5_STORAGE_KEY);
      sessionStorage.removeItem(MODULE5_STORAGE_KEY);
    } catch (e) {}
    this.save();
  }

  // ============================================================
  // CENTRALIZED MODULE 5 PROGRESSION & GATING EVALUATOR
  // ============================================================
  getModule5Progress() {
    const s = this.state;
    const chitsFound = s.challengeChitsFound ? s.challengeChitsFound.length : 0;
    const act1Count = s.activity1SolvedCount || (s.activity1Progress ? Object.keys(s.activity1Progress).length : (s.activity1Completed ? 10 : 0));
    const act2Count = s.activity2Progress ? Object.keys(s.activity2Progress).length : (s.activity2Completed ? 10 : 0);
    const act3Count = s.activity3Progress ? Object.keys(s.activity3Progress).length : (s.activity3Completed ? 5 : 0);
    const casesCount = s.casesCompleted ? s.casesCompleted.length : (s.activity5Completed ? 5 : 0);
    const ebCount = s.evidenceBoardPlacements ? Object.keys(s.evidenceBoardPlacements).length : (s.evidenceBoardCompleted ? 4 : 0);

    const isKnowledgeBoxUnlocked = chitsFound >= 5 || s.knowledgeUnlocked;
    const isVideoDone = s.videoCompleted || false;
    const isAct1Done = s.activity1Completed || act1Count >= 10;
    const isAct2Done = s.activity2Completed || act2Count >= 10;
    const isAct3Done = s.activity3Completed || act3Count >= 5;
    const isPtmDone = s.productTimeMachineCompleted || false;
    const isCasesDone = s.activity5Completed || casesCount >= 5;
    const isEbDone = s.evidenceBoardCompleted || ebCount >= 4;
    const isFiveWhysDone = s.fiveWhysCompleted || s.fiveWhysStep >= 5;
    const isSolutionsDone = (s.solutionsSubmitted && s.solutionsSubmitted.length >= 3 && s.rootCauseIdentified);
    const isReflectionDone = (s.reflection && s.reflection.trim().length > 0) || s.rootCauseIdentified;
    const isExitUnlocked = s.rootCauseIdentified || s.completed;

    return {
      chitsFound,
      act1Count,
      act2Count,
      act3Count,
      casesCount,
      ebCount,
      
      // Strict Sequential Gates
      knowledgeBoxGateUnlocked: isKnowledgeBoxUnlocked,
      videoGateUnlocked: isKnowledgeBoxUnlocked,
      activity1GateUnlocked: isVideoDone,
      activity2GateUnlocked: isAct1Done,
      activity3GateUnlocked: isAct2Done,
      evidenceFilesGateUnlocked: isAct3Done,
      productTimeMachineGateUnlocked: isAct3Done,
      casesGateUnlocked: isPtmDone,
      evidenceBoardGateUnlocked: isCasesDone,
      fiveWhysGateUnlocked: isEbDone,
      solutionsGateUnlocked: isFiveWhysDone,
      reflectionGateUnlocked: isSolutionsDone,
      exitGateUnlocked: isExitUnlocked
    };
  }

  // ============================================================
  // PERSISTENT OPTION SHUFFLING HELPER
  // ============================================================
  getShuffledOptions(key, optionsArray) {
    if (!this.state.persistentShuffles) {
      this.state.persistentShuffles = {};
    }

    if (this.state.persistentShuffles[key]) {
      return this.state.persistentShuffles[key];
    }

    const indexed = optionsArray.map((opt, originalIdx) => ({
      originalIdx,
      data: opt
    }));

    for (let i = indexed.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indexed[i], indexed[j]] = [indexed[j], indexed[i]];
    }

    this.state.persistentShuffles[key] = indexed;
    this.save();
    return indexed;
  }

  collectChit(chitId) {
    if (!this.state.challengeChitsFound.includes(chitId)) {
      this.state.challengeChitsFound.push(chitId);
      if (this.state.challengeChitsFound.length >= 5) {
        this.state.knowledgeUnlocked = true;
      }
      this.save();

      const clueData = window.MODULE5_DATA.challengeClues.find(c => c.id === chitId);
      if (clueData && window.gameState) {
        window.gameState.addItem({
          id: clueData.id,
          name: clueData.name,
          icon: clueData.icon,
          type: 'evidence_clue',
          desc: clueData.desc
        });
      }
      return true;
    }
    return false;
  }

  completeVideo() {
    this.state.videoCompleted = true;
    this.save();
  }

  markActivity1QuestionSolved(qId) {
    if (!this.state.activity1Progress) this.state.activity1Progress = {};
    this.state.activity1Progress[qId] = true;
    this.state.activity1SolvedCount = Object.keys(this.state.activity1Progress).length;
    if (this.state.activity1SolvedCount >= 10) {
      this.state.activity1Completed = true;
    }
    this.save();
  }

  completeActivity1() {
    this.state.activity1Completed = true;
    this.state.activity1SolvedCount = 10;
    this.save();
  }

  completeActivity2() {
    this.state.activity2Completed = true;
    this.save();
  }

  markActivity3CaseSolved(caseId) {
    if (!this.state.activity3Progress) this.state.activity3Progress = {};
    this.state.activity3Progress[caseId] = true;
    if (Object.keys(this.state.activity3Progress).length >= 5) {
      this.state.activity3Completed = true;
      this.state.evidenceUnlocked = true;
    }
    this.save();
  }

  completeActivity3() {
    this.state.activity3Completed = true;
    this.state.evidenceUnlocked = true;
    this.save();
  }

  discoverEvidence(evidId) {
    if (!this.state.discoveredEvidence) this.state.discoveredEvidence = {};
    this.state.discoveredEvidence[evidId] = true;
    this.save();
  }

  completeTimeMachine() {
    this.state.productTimeMachineCompleted = true;
    this.save();
  }

  completeCase(caseId) {
    if (!this.state.casesCompleted.includes(caseId)) {
      this.state.casesCompleted.push(caseId);
      if (this.state.casesCompleted.length >= 5) {
        this.state.activity5Completed = true;
      }
      this.save();
    }
  }

  completeEvidenceBoard(placements) {
    this.state.evidenceBoardPlacements = placements;
    if (Object.keys(placements).length >= 4) {
      this.state.evidenceBoardCompleted = true;
    }
    this.save();
  }

  markFiveWhysStep(stepNum) {
    this.state.fiveWhysStep = Math.max(this.state.fiveWhysStep, stepNum);
    if (stepNum >= 5) {
      this.state.fiveWhysCompleted = true;
    }
    this.save();
  }

  submitSolutions(solutionsArray, reflection = '') {
    this.state.solutionsSubmitted = solutionsArray;
    this.state.reflection = reflection;
    if (solutionsArray.length >= 3 && reflection.trim().length > 0 && this.state.fiveWhysCompleted) {
      this.state.rootCauseIdentified = true;
    }
    this.save();
  }

  markModule5Complete() {
    this.state.rootCauseIdentified = true;
    this.state.completed = true;
    this.save();

    if (window.roomController) {
      window.roomController.solveSpecializedRoom(5);
    }
  }
}

window.module5State = new Module5State();
