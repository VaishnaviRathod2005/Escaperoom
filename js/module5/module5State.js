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
      persistentShuffles: {} // { key: [ { originalIdx, data } ] }
    };

    this.state = this.load();
  }

  load() {
    // DEVELOPMENT RESET MODE: Start fresh whenever DEV_MODE is true
    if (window.MODULE5_DEV_MODE === true) {
      const freshDevState = JSON.parse(JSON.stringify(this.defaultState));
      const scenarios = Object.keys(window.MODULE5_DATA?.productScenarios || {});
      freshDevState.selectedProductScenario = scenarios.length > 0 ? scenarios[0] : 'food_delivery';
      return freshDevState;
    }

    try {
      const saved = localStorage.getItem(MODULE5_STORAGE_KEY) || sessionStorage.getItem(MODULE5_STORAGE_KEY);
      if (saved) {
        return Object.assign({}, this.defaultState, JSON.parse(saved));
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

  save() {
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
