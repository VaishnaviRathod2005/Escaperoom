/**
 * Automated Verification Script for Wall 4 — Motivation Core
 */

const assert = require('assert');

// 1. Mock Browser Environment
global.window = {};
const createMockElement = (id = '') => ({
  id,
  style: {},
  classList: {
    _classes: new Set(),
    add(c) { this._classes.add(c); },
    remove(c) { this._classes.delete(c); },
    toggle(c, force) {
      if (force === undefined) {
        if (this._classes.has(c)) this._classes.delete(c);
        else this._classes.add(c);
      } else if (force) {
        this._classes.add(c);
      } else {
        this._classes.delete(c);
      }
    },
    contains(c) { return this._classes.has(c); }
  },
  innerHTML: '',
  textContent: '',
  value: '',
  dataset: {},
  appendChild: () => {},
  querySelectorAll: () => []
});

const elementsCache = {};
const getOrCreateElement = (id) => {
  if (!elementsCache[id]) elementsCache[id] = createMockElement(id);
  return elementsCache[id];
};

global.document = {
  createElement: (tag) => createMockElement(tag),
  getElementById: (id) => getOrCreateElement(id),
  querySelectorAll: () => []
};

global.sessionStorage = {
  _data: {},
  getItem(k) { return this._data[k] || null; },
  setItem(k, v) { this._data[k] = v; },
  removeItem(k) { delete this._data[k]; }
};

global.localStorage = {
  _data: {},
  getItem(k) { return this._data[k] || null; },
  setItem(k, v) { this._data[k] = v; },
  removeItem(k) { delete this._data[k]; }
};

global.window.app = {
  showToast: (msg, type) => {
    // console.log(`[TOAST (${type})]: ${msg}`);
  },
  updateHUD: () => {}
};

global.window.gameState = {
  state: {
    inventory: []
  },
  addItem(item) {
    if (!this.state.inventory.some(i => i.id === item.id)) {
      this.state.inventory.push(item);
      return true;
    }
    return false;
  }
};

global.window.soundEngine = {
  playClick: () => {},
  playSuccess: () => {},
  playError: () => {},
  playWhoosh: () => {}
};

// 2. Load module5State.js
require('../js/module5/module5State.js');


// 3. Load module5Wall4.js
require('../js/module5/module5Wall4.js');
const wall4 = global.window.module5Wall4;

console.log('--- RUNNING WALL 4 AUTOMATED UNIT & INTEGRATION TESTS ---');

// Test 1: Motivation cards definitions
console.log('Test 1: Verify 6 motivation cards integrity');
assert.strictEqual(wall4.cards.length, 6, 'Should have exactly 6 motivation cards');
const expectedCardIds = ['passion', 'independence', 'money', 'impact', 'control', 'purpose'];
wall4.cards.forEach((c, idx) => {
  assert.strictEqual(c.id, expectedCardIds[idx], `Card ${idx} should have id ${expectedCardIds[idx]}`);
  assert.ok(c.label.length > 0, `Card ${idx} must have non-empty label`);
  assert.ok(c.color.length > 0, `Card ${idx} must have non-empty color`);
  assert.ok(c.desc.length > 0, `Card ${idx} must have non-empty description`);
});
console.log('✓ Motivation cards integrity verified');

// Test 2: Incomplete Puzzle 1 submission rejection
console.log('Test 2: Rejection of incomplete motivation card placement (< 6 slots)');
const state = wall4.getState();
state.motivationCardPlacements = ['passion', 'independence', null, null, null, null];
let toastMessage = null;
global.window.app.showToast = (msg) => { toastMessage = msg; };

wall4.submitPuzzle1();
assert.strictEqual(state.isMotivationPuzzleComplete, false, 'Puzzle 1 should not be marked complete on partial submission');
assert.ok(toastMessage.includes('Place all 6 motivation cards'), 'Toast should warn about incomplete placement');
console.log('✓ Incomplete placement rejection passed');

// Test 3: Incorrect sequence rejection & selection retention
console.log('Test 3: Incorrect sequence rejection');
state.motivationCardPlacements = ['purpose', 'control', 'impact', 'money', 'independence', 'passion'];
wall4.submitPuzzle1();
assert.strictEqual(state.isMotivationPuzzleComplete, false, 'Puzzle 1 should not be solved on inverted sequence');
assert.deepStrictEqual(state.motivationCardPlacements, ['purpose', 'control', 'impact', 'money', 'independence', 'passion'], 'Cards should be preserved upon error');
assert.ok(toastMessage.includes('Pattern mismatch'), 'Toast should report pattern mismatch');
console.log('✓ Incorrect sequence rejection & state retention passed');

// Test 4: Correct Puzzle 1 submission
console.log('Test 4: Correct motivation card challenge submission');
state.motivationCardPlacements = ['passion', 'independence', 'money', 'impact', 'control', 'purpose'];
wall4.submitPuzzle1();
assert.strictEqual(state.isMotivationPuzzleComplete, true, 'Puzzle 1 must be marked complete');
console.log('✓ Puzzle 1 solved successfully');

// Test 5: Activate WHY CORE
console.log('Test 5: Activate the WHY CORE machine');
assert.strictEqual(state.isWhyCoreActive, false, 'WHY CORE should be inactive initially');
wall4.activateWhyCore();
assert.strictEqual(state.isWhyCoreActive, true, 'WHY CORE must be active');
assert.strictEqual(state.isModule24Unlocked, true, 'Module 2.4 must be unlocked');
console.log('✓ WHY CORE activation verified');

// Test 6: Module 2.4 Podcast & Scenario Activity
console.log('Test 6: Module 2.4 Podcast & Scenario Activity Lifecycle');
assert.strictEqual(state.isModule24PodcastWatched, false, 'Podcast 2.4 unread initially');
wall4.confirmMarkAsWatched24();
assert.strictEqual(state.isModule24PodcastWatched, true, 'Podcast 2.4 must be marked watched');

const scenarios = wall4.getModule24Scenarios();
assert.strictEqual(scenarios.length, 4, 'Must have 4 scenarios');

// 6a: Test failing scenario activity (< 3/4)
wall4.retryScenarioActivity();
scenarios.forEach(s => {
  wall4.scenarioAnswers[s.id] = (s.correct + 1) % 4; // all wrong
});
wall4.submitScenarioActivity();
assert.strictEqual(state.completedModule24Activities, false, 'Score 0/4 should fail scenario activity');

// 6b: Test passing scenario activity (4/4)
wall4.retryScenarioActivity();
scenarios.forEach(s => {
  wall4.scenarioAnswers[s.id] = s.correct; // all correct
});
wall4.submitScenarioActivity();
assert.strictEqual(state.completedModule24Activities, true, 'Score 4/4 must pass scenario activity');
assert.strictEqual(state.isPuzzle2Unlocked, true, 'Puzzle 2 must be unlocked');
console.log('✓ Module 2.4 Podcast and Scenario activity verified');

// Test 7: Puzzle 2 ("Discover Your WHY") Reflection Challenge
console.log('Test 7: Puzzle 2 ("Discover Your WHY") reflection matching');
assert.strictEqual(state.isPuzzle2Complete, false, 'Puzzle 2 uncompleted initially');

// Test incorrect matching
wall4.puzzle2Selections = ['purpose', 'control', 'impact', 'money', 'independence', 'passion'];
wall4.submitPuzzle2();
assert.strictEqual(state.isPuzzle2Complete, false, 'Puzzle 2 should reject mismatched reflections');

// Test correct matching
wall4.puzzle2Selections = ['passion', 'independence', 'money', 'impact', 'control', 'purpose'];
wall4.submitPuzzle2();
assert.strictEqual(state.isPuzzle2Complete, true, 'Puzzle 2 must be marked complete');
assert.strictEqual(state.isModule25Unlocked, true, 'Module 2.5 must be unlocked');
console.log('✓ Puzzle 2 reflection challenge passed');

// Test 8: Module 2.5 Podcast & Quiz Lifecycle
console.log('Test 8: Module 2.5 Podcast & Quiz Lifecycle');
assert.strictEqual(state.isModule25PodcastWatched, false, 'Podcast 2.5 unread initially');
wall4.confirmMarkAsWatched25();
assert.strictEqual(state.isModule25PodcastWatched, true, 'Podcast 2.5 must be marked watched');

const q25List = wall4.getModule25QuizData();
assert.strictEqual(q25List.length, 4, 'Must have 4 quiz questions');

// 8a: Fail quiz (< 3)
wall4.retryQ25Quiz();
for (let i = 0; i < q25List.length; i++) {
  wall4.q25CurrentIndex = i;
  wall4.selectQ25Option((q25List[i].correct + 1) % 4);
  wall4.submitQ25Answer();
  wall4.nextQ25Question();
}
assert.strictEqual(state.isModule25QuizPassed, false, 'Score 0/4 should fail quiz');

// 8b: Reset quiz
wall4.retryQ25Quiz();
assert.strictEqual(wall4.q25CurrentIndex, 0, 'Question index should reset to 0');
assert.strictEqual(Object.keys(wall4.q25Answers).length, 0, 'Answers should be cleared');

// 8c: Pass quiz (4/4)
for (let i = 0; i < q25List.length; i++) {
  wall4.q25CurrentIndex = i;
  wall4.selectQ25Option(q25List[i].correct);
  wall4.submitQ25Answer();
  wall4.nextQ25Question();
}
assert.strictEqual(state.isModule25QuizPassed, true, 'Score 4/4 must pass quiz');
assert.strictEqual(state.isWall4Complete, true, 'Wall 4 must be marked complete');
console.log('✓ Module 2.5 Podcast and Quiz verified');

// Test 9: Career Foundation Panel & Exit Door Validation
console.log('Test 9: Career Foundation & Exit Door');
wall4.openCareerFoundationPanel();
assert.strictEqual(state.isCareerFoundationPanelViewed, true, 'Career Foundation panel must be viewed');

assert.strictEqual(state.isExitUnlocked, false, 'Exit door should be locked initially');
wall4.openExit();
assert.strictEqual(state.isExitUnlocked, true, 'Exit door must be unlocked');
console.log('✓ Career Foundation and Exit Door unlock verified');

// Test 10: isWall4Complete State Gate Helper
console.log('Test 10: isWall4Complete state helper in module5State');
assert.strictEqual(global.window.module5State.isWall4Complete(), true, 'isWall4Complete helper must return true');
console.log('✓ isWall4Complete state helper verified');

// Test 11: Inventory Item Awards
console.log('Test 11: Inventory item awards verification');
const invIds = global.window.gameState.state.inventory.map(i => i.id);
const expectedInv = [
  'm5_motivation_matrix',
  'm5_why_core_power_unit',
  'm5_everyday_badge',
  'm5_why_reflection_seal',
  'm5_foundation_compass',
  'm5_master_exit_pass'
];
expectedInv.forEach(id => {
  assert.ok(invIds.includes(id), `Expected item ${id} in inventory`);
});
console.log('✓ Wall 4 awarded all 6 Explorer inventory items');

// Test 12: Video Playback State Toggle Verification
console.log('Test 12: Video Playback State Toggle Verification');
const vScreen24 = global.document.getElementById('m5-video-screen-24');
const vPlayBtn24 = global.document.getElementById('m5-video-play-btn-24');
wall4.playAudio24();
assert.strictEqual(vScreen24.classList.contains('is-playing'), true, 'Video screen 24 should have is-playing class when playing');
assert.strictEqual(vPlayBtn24.textContent, '⏸', 'Center play button should show pause symbol');
wall4.pauseAudio24();
assert.strictEqual(vScreen24.classList.contains('is-playing'), false, 'Video screen 24 should remove is-playing class when paused');
assert.strictEqual(vPlayBtn24.textContent, '▶', 'Center play button should show play symbol');
console.log('✓ Video screen 24 playback state toggle verified');

console.log('\n=========================================');
console.log('ALL 12 AUTOMATED TESTS PASSED SUCCESSFULLY!');
console.log('=========================================');

