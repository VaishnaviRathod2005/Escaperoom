/**
 * Automated Verification Script for Wall 2 — Career Simulation Lab
 */

const assert = require('assert');

// 1. Mock Browser Environment
global.window = {};
const createMockElement = () => ({
  style: {},
  classList: {
    add: () => {},
    remove: () => {},
    toggle: () => {},
    contains: () => false
  },
  innerHTML: '',
  textContent: '',
  value: '',
  dataset: {},
  appendChild: () => {},
  querySelectorAll: () => []
});

global.document = {
  createElement: () => createMockElement(),
  getElementById: (id) => createMockElement(),
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

global.window.soundEngine = {
  playClick: () => {},
  playSuccess: () => {},
  playError: () => {},
  playWhoosh: () => {}
};

// 2. Load module5State.js
require('../js/module5/module5State.js');
// window.module5State is instantiated by the script

// 3. Load module5Wall2.js
require('../js/module5/module5Wall2.js');
const wall2 = global.window.module5Wall2;

console.log('--- RUNNING WALL 2 AUTOMATED UNIT & INTEGRATION TESTS ---');

// Test 1: Milestone definitions
console.log('Test 1: Verify 5 milestones integrity');
assert.strictEqual(wall2.milestones.length, 5, 'Should have exactly 5 milestones');
const expectedIds = ['m1_year1', 'm2_year10', 'm3_year20', 'm4_year30', 'm5_beyond30'];
wall2.milestones.forEach((m, idx) => {
  assert.strictEqual(m.id, expectedIds[idx], `Milestone ${idx} should have id ${expectedIds[idx]}`);
  assert.ok(m.label.length > 0, `Milestone ${idx} must have non-empty label`);
  assert.ok(m.desc.length > 0, `Milestone ${idx} must have non-empty description`);
});
console.log('✓ Milestone data integrity passed');

// Test 2: Incomplete Timeline Submission Rejection
console.log('Test 2: Rejection of incomplete timeline (< 5 slots)');
const state = wall2.getState();
state.timelineSlots = ['m1_year1', 'm2_year10', null, null, null];
let toastMessage = null;
global.window.app.showToast = (msg) => { toastMessage = msg; };

wall2.submitTimeline();
assert.strictEqual(state.isPuzzleSolved, false, 'Puzzle should not be marked solved on partial submission');
assert.ok(toastMessage.includes('assign all 5 milestones'), 'Toast should warn about incomplete submission');
console.log('✓ Incomplete submission rejection passed');

// Test 3: Incorrect Sequence Rejection & Retention of choices
console.log('Test 3: Incorrect sequence rejection');
state.timelineSlots = ['m5_beyond30', 'm4_year30', 'm3_year20', 'm2_year10', 'm1_year1'];
wall2.submitTimeline();
assert.strictEqual(state.isPuzzleSolved, false, 'Puzzle should not be marked solved on inverted sequence');
assert.deepStrictEqual(state.timelineSlots, ['m5_beyond30', 'm4_year30', 'm3_year20', 'm2_year10', 'm1_year1'], 'Slots should be preserved upon error');
assert.ok(toastMessage.includes('Incorrect timeline sequence'), 'Toast should report incorrect sequence');
console.log('✓ Incorrect sequence rejection & state retention passed');

// Test 4: Correct Timeline Sequence Acceptance
console.log('Test 4: Correct chronological timeline submission');
state.timelineSlots = ['m1_year1', 'm2_year10', 'm3_year20', 'm4_year30', 'm5_beyond30'];
wall2.submitTimeline();
assert.strictEqual(state.isPuzzleSolved, true, 'Puzzle must be marked solved');
assert.strictEqual(state.isSimulatorActive, true, 'Simulator must be active');
assert.strictEqual(state.isKnowledgeBox2Unlocked, true, 'Knowledge Box 2 must be unlocked');
console.log('✓ Timeline solved & simulator chamber activation passed');

// Test 5: Podcast 2.3 Playback & Mark as Watched
console.log('Test 5: Podcast 2.3 completion');
assert.strictEqual(state.isPodcastWatched, false, 'Podcast should be unread initially');
wall2.confirmMarkAsWatched();
assert.strictEqual(state.isPodcastWatched, true, 'Podcast must be marked watched');
console.log('✓ Podcast 2.3 completion tracking passed');

// Test 6: Module 2.3 Quiz Engine (Failure, Reset, and Passing Flow)
console.log('Test 6: Module 2.3 Quiz Engine');
const quizQuestions = wall2.getModule23QuizData();
assert.strictEqual(quizQuestions.length, 5, 'Quiz must have exactly 5 questions');

// 6a: Test failing the quiz (only 1 correct)
wall2.retryQ23Quiz();
for (let i = 0; i < quizQuestions.length; i++) {
  wall2.q23CurrentIndex = i;
  // Pick option 0 for all; only question 4 has correct: 0
  wall2.selectQ23Option(0);
  wall2.submitQ23Answer();
  wall2.nextQ23Question();
}
assert.strictEqual(state.isModule23QuizPassed, false, 'Score 1/5 should not pass quiz');
assert.strictEqual(state.module23QuizScore, 1, 'Score should be 1');
console.log('✓ Quiz 2.3 failing score (1/5) gating passed');

// 6b: Test reset functionality
wall2.retryQ23Quiz();
assert.strictEqual(wall2.q23CurrentIndex, 0, 'Current index should reset to 0');
assert.strictEqual(Object.keys(wall2.q23Answers).length, 0, 'Answers should be cleared on reset');
assert.strictEqual(state.isModule23QuizPassed, false, 'Quiz passed flag should be reset to false');
console.log('✓ Quiz 2.3 reset/retake passed');

// 6c: Test passing the quiz (5/5 correct)
for (let i = 0; i < quizQuestions.length; i++) {
  wall2.q23CurrentIndex = i;
  const correctChoice = quizQuestions[i].correct;
  wall2.selectQ23Option(correctChoice);
  wall2.submitQ23Answer();
  wall2.nextQ23Question();
}
assert.strictEqual(state.isModule23QuizPassed, true, 'Score 5/5 should pass quiz');
assert.strictEqual(state.module23QuizScore, 5, 'Score should be 5');
console.log('✓ Quiz 2.3 passing score (5/5) passed');

// Test 7: Dream Career Journey Activity Validation & Submission
console.log('Test 7: Dream Career Journey activity submission');
assert.strictEqual(state.isCareerActivityCompleted, false, 'Activity uncompleted initially');

// Mock DOM inputs
const mockInputs = {
  'm5-act-dream': { value: 'Pioneer renewable energy distribution networks across developing regions' },
  'm5-act-y1': { value: 'Master battery tech architectures and prototype local microgrids' },
  'm5-act-y10': { value: 'Scale enterprise to power 100 communities with a 50-person team' },
  'm5-act-y20': { value: 'Expand into nationwide clean infrastructure contracts' },
  'm5-act-y30': { value: 'Establish global sustainability standards for off-grid power' },
  'm5-act-beyond30': { value: 'Endow a clean energy venture fund for youth founders' },
  'm5-act-skills': { value: 'Systems engineering, venture finance, cross-sector coalition building' },
  'm5-act-nextsteps': { value: 'Complete the engineering design specification and conduct field survey' }
};

global.document.getElementById = (id) => {
  if (mockInputs[id]) return mockInputs[id];
  return {
    style: {},
    classList: { add: () => {}, remove: () => {}, toggle: () => {}, contains: () => false },
    innerHTML: '',
    textContent: '',
    value: '',
    appendChild: () => {}
  };
};

wall2.submitCareerActivity();
assert.strictEqual(state.isCareerActivityCompleted, true, 'Career activity must be completed');
assert.strictEqual(state.careerActivityData.dream, mockInputs['m5-act-dream'].value);
assert.strictEqual(state.isClue02Revealed, true, 'Clue 02 must be revealed when podcast, quiz, and activity are complete');
assert.strictEqual(state.isWall2Complete, true, 'Wall 2 must be marked complete');
console.log('✓ Career Activity submission and Clue 02 unlock passed');

// Test 8: Clue 02 Quote Exact Match
console.log('Test 8: Clue 02 exact text verification');
const expectedClue02 = "A real entrepreneur doesn't wait for a special situation. Find entrepreneurship where everyday problems happen.";
// Check html file contains exact quote
const fs = require('fs');
const htmlContent = fs.readFileSync('index.html', 'utf8');
assert.ok(htmlContent.includes(expectedClue02), 'index.html must contain exact Clue 02 text');
console.log('✓ Clue 02 quote exact match verified');

// Test 9: Proceed to Wall 3 Integration
console.log('Test 9: Proceed to Wall 3 navigation');
let navigatedToWall = null;
global.window.vintageRoomEngine = {
  setWall: (w) => { navigatedToWall = w; }
};
wall2.proceedToWall3();
assert.strictEqual(navigatedToWall, 3, 'Must transition to Wall 3');
console.log('✓ Wall 3 navigation integration verified');

// Test 10: isWall2Complete Helper in module5State
console.log('Test 10: isWall2Complete helper in module5State');
assert.strictEqual(global.window.module5State.isWall2Complete(), true, 'isWall2Complete helper must return true');
console.log('✓ isWall2Complete state helper verified');

console.log('\n=========================================');
console.log('ALL 10 AUTOMATED TESTS PASSED SUCCESSFULLY!');
console.log('=========================================');
