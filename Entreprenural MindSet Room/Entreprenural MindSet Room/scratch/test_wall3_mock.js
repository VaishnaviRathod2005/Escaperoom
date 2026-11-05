/**
 * Comprehensive Automated Verification Suite for Wall 3:
 * Real-World Entrepreneurship Simulator (Module 2.4 + Module 2.5)
 */

const assert = require('assert');

// 1. Mock Browser Environment
global.window = {};
const elementsCache = {};
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

let lastToastMessage = null;
global.window.app = {
  showToast: (msg, type) => {
    lastToastMessage = msg;
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

// 3. Load module5Wall4.js (to test auto-sync)
require('../js/module5/module5Wall4.js');

// 4. Load module5Wall3.js
require('../js/module5/module5Wall3.js');
const wall3 = global.window.module5Wall3;

console.log('--- RUNNING WALL 3 AUTOMATED UNIT & INTEGRATION TESTS ---');

// Test 1: Five Stations & Character Data Integrity
console.log('Test 1: Verify 5 entrepreneurship stations & characters integrity');
assert.strictEqual(wall3.stations.length, 5, 'Must have exactly 5 stations');
const expectedPairs = [
  { id: 'rideshare', char: 'shubham', name: 'Shubham' },
  { id: 'cafeteria', char: 'tanvi', name: 'Tanvi' },
  { id: 'tutor', char: 'nikhil', name: 'Nikhil' },
  { id: 'gaming', char: 'anushka', name: 'Anushka' },
  { id: 'cycle', char: 'karan', name: 'Karan' }
];
expectedPairs.forEach(exp => {
  const stn = wall3.stations.find(s => s.id === exp.id);
  assert.ok(stn, `Station ${exp.id} must exist`);
  assert.strictEqual(stn.charId, exp.char, `Station ${exp.id} must belong to ${exp.char}`);
  assert.strictEqual(stn.charName, exp.name, `Station ${exp.id} charName must be ${exp.name}`);
  assert.ok(stn.desc.length > 10, `Station ${exp.id} must have detailed description`);
});
console.log('✓ 5 stations & character integrity verified');

// Test 2: Incomplete Matching Rejection
console.log('Test 2: Rejection of incomplete matching (< 5 connections)');
wall3.puzzleMatches = {
  shubham: 'rideshare',
  tanvi: 'cafeteria',
  nikhil: null,
  anushka: null,
  karan: null
};
wall3.submitPuzzle();
const state = wall3.getState();
assert.strictEqual(state.isMatchingPuzzleComplete, false, 'Puzzle should not be marked complete on partial matching');
assert.ok(lastToastMessage.includes('connect all 5 people'), 'Toast should report incomplete connections');
console.log('✓ Incomplete matching rejection passed');

// Test 3: Incorrect Matching Rejection & Selection Retention
console.log('Test 3: Incorrect matching rejection');
wall3.puzzleMatches = {
  shubham: 'cycle',
  tanvi: 'tutor',
  nikhil: 'cafeteria',
  anushka: 'rideshare',
  karan: 'gaming'
};
wall3.submitPuzzle();
assert.strictEqual(state.isMatchingPuzzleComplete, false, 'Puzzle should not be solved on wrong matches');
assert.ok(lastToastMessage.includes('connections correct'), 'Toast should state number of correct connections');
// Ensure selections are preserved
assert.strictEqual(wall3.puzzleMatches.shubham, 'cycle', 'Selections should be preserved on mismatch');
console.log('✓ Incorrect matching rejection and state retention passed');

// Test 4: Correct 5/5 Matching Validation
console.log('Test 4: Correct 5/5 matching validation');
wall3.puzzleMatches = {
  shubham: 'rideshare',
  tanvi: 'cafeteria',
  nikhil: 'tutor',
  anushka: 'gaming',
  karan: 'cycle'
};
wall3.submitPuzzle();
assert.strictEqual(state.isMatchingPuzzleComplete, true, 'Puzzle must be marked complete on 5/5 correct');
assert.strictEqual(state.isSimulatorActivated, true, 'Simulator must be activated');
assert.strictEqual(state.isKnowledgeBox3Unlocked, true, 'Knowledge Box 3 must be unlocked');
console.log('✓ Correct matching & simulator activation passed');

// Test 5: Simulator Token Awarded to Inventory
console.log('Test 5: Simulator token awarded to inventory');
const hasSimToken = global.window.gameState.state.inventory.some(i => i.id === 'm5_simulator_token');
assert.ok(hasSimToken, 'Simulator Mastery Token must be awarded in inventory');
console.log('✓ Simulator Mastery Token verified');

// Test 6: Module 2.4 Video Playback Controls & Verification
console.log('Test 6: Module 2.4 Video Playback Controls');
assert.strictEqual(state.module24.isPodcastComplete, false, 'Podcast 2.4 unread initially');
const vScreen24 = global.document.getElementById('m5-video-screen-24-w3');
const vPlayBtn24 = global.document.getElementById('m5-video-play-btn-24-w3');
wall3.playAudio24();
assert.strictEqual(vScreen24.classList.contains('is-playing'), true, 'Video screen should have is-playing class');
assert.strictEqual(vPlayBtn24.textContent, '⏸', 'Center play button should show pause symbol');
wall3.pauseAudio24();
assert.strictEqual(vScreen24.classList.contains('is-playing'), false, 'Video screen should remove is-playing class');
assert.strictEqual(vPlayBtn24.textContent, '▶', 'Center play button should show play symbol');
wall3.confirmMarkAsWatched24();
assert.strictEqual(state.module24.isPodcastComplete, true, 'Podcast 2.4 must be marked watched');
console.log('✓ Module 2.4 Video controls & mark as watched verified');

// Test 7: Module 2.4 Discussion Guide Verification
console.log('Test 7: Module 2.4 Discussion Guide');
assert.strictEqual(state.module24.isDiscussionGuideReviewed, false, 'Discussion guide unreviewed initially');
wall3.markDiscussionGuide24Reviewed();
assert.strictEqual(state.module24.isDiscussionGuideReviewed, true, 'Discussion guide must be marked reviewed');
console.log('✓ Module 2.4 Discussion guide verified');

// Test 8: Module 2.4 Quiz — 10 Original Scenario MCQs Lifecycle
console.log('Test 8: Module 2.4 Quiz — 10 Scenario MCQs');
const q24List = wall3.getModule24QuizData();
assert.strictEqual(q24List.length, 10, 'Must have exactly 10 scenario questions');
// Verify scenarios 1-5 presence
const scenarioNumbers = new Set(q24List.map(q => q.scenarioNumber));
assert.strictEqual(scenarioNumbers.size, 5, 'Must cover 5 scenarios');

// 8a: Failing Quiz (< 7/10)
wall3.retryQ24Quiz();
for (let i = 0; i < q24List.length; i++) {
  wall3.q24Index = i;
  wall3.selectQ24Option((q24List[i].correct + 1) % 4); // all wrong
  wall3.submitQ24Answer();
  wall3.nextQ24Question();
}
assert.strictEqual(state.module24.quizPassed, false, 'Score 0/10 must fail quiz (< 7/10)');

// 8b: Reset Quiz
wall3.retryQ24Quiz();
assert.strictEqual(wall3.q24Index, 0, 'Question index should reset to 0');
assert.strictEqual(Object.keys(wall3.q24Answers).length, 0, 'Answers should be cleared');

// 8c: Passing Quiz (10/10)
for (let i = 0; i < q24List.length; i++) {
  wall3.q24Index = i;
  wall3.selectQ24Option(q24List[i].correct); // all correct
  wall3.submitQ24Answer();
  wall3.nextQ24Question();
}
assert.strictEqual(state.module24.quizPassed, true, 'Score 10/10 must pass quiz');
assert.strictEqual(state.module24.isComplete, true, 'Module 2.4 must be marked complete');
console.log('✓ Module 2.4 10-Question Quiz Lifecycle verified');

// Test 9: Module 2.5 Video Playback Controls & Verification
console.log('Test 9: Module 2.5 Video Playback Controls');
assert.strictEqual(state.module25.isPodcastComplete, false, 'Podcast 2.5 unread initially');
const vScreen25 = global.document.getElementById('m5-video-screen-25-w3');
const vPlayBtn25 = global.document.getElementById('m5-video-play-btn-25-w3');
wall3.playAudio25();
assert.strictEqual(vScreen25.classList.contains('is-playing'), true, 'Video screen 25 should have is-playing class');
assert.strictEqual(vPlayBtn25.textContent, '⏸', 'Center play button 25 should show pause symbol');
wall3.pauseAudio25();
assert.strictEqual(vScreen25.classList.contains('is-playing'), false, 'Video screen 25 should remove is-playing class');
assert.strictEqual(vPlayBtn25.textContent, '▶', 'Center play button 25 should show play symbol');
wall3.confirmMarkAsWatched25();
assert.strictEqual(state.module25.isPodcastComplete, true, 'Podcast 2.5 must be marked watched');
console.log('✓ Module 2.5 Video controls & mark as watched verified');

// Test 10: Module 2.5 Discussion Guide Verification
console.log('Test 10: Module 2.5 Discussion Guide');
assert.strictEqual(state.module25.isDiscussionGuideReviewed, false, 'Discussion guide 2.5 unreviewed initially');
wall3.markDiscussionGuide25Reviewed();
assert.strictEqual(state.module25.isDiscussionGuideReviewed, true, 'Discussion guide 2.5 must be marked reviewed');
console.log('✓ Module 2.5 Discussion guide verified');

// Test 11: Module 2.5 Quiz — 8 Original Motivation MCQs Lifecycle
console.log('Test 11: Module 2.5 Quiz — 8 Motivation MCQs');
const q25List = wall3.getModule25QuizData();
assert.strictEqual(q25List.length, 8, 'Must have exactly 8 motivation questions');

// 11a: Failing Quiz (< 6/8)
wall3.retryQ25Quiz();
for (let i = 0; i < q25List.length; i++) {
  wall3.q25Index = i;
  wall3.selectQ25Option((q25List[i].correct + 1) % 4); // all wrong
  wall3.submitQ25Answer();
  wall3.nextQ25Question();
}
assert.strictEqual(state.module25.quizPassed, false, 'Score 0/8 must fail quiz (< 6/8)');

// 11b: Passing Quiz (8/8)
wall3.retryQ25Quiz();
for (let i = 0; i < q25List.length; i++) {
  wall3.q25Index = i;
  wall3.selectQ25Option(q25List[i].correct); // all correct
  wall3.submitQ25Answer();
  wall3.nextQ25Question();
}
assert.strictEqual(state.module25.quizPassed, true, 'Score 8/8 must pass quiz');
assert.strictEqual(state.module25.isComplete, true, 'Module 2.5 must be marked complete');
console.log('✓ Module 2.5 8-Question Quiz Lifecycle verified');

// Test 12: Wall 3 Completion & Final Clue Text Exact Match
console.log('Test 12: Wall 3 Completion & Final Clue');
assert.strictEqual(state.isWall3Complete, true, 'Wall 3 must be marked complete');
assert.strictEqual(state.isFinalClueRevealed, true, 'Final Clue must be revealed');
assert.strictEqual(state.isWall4Unlocked, true, 'Wall 4 must be unlocked');

const expectedClueQuote = "Understanding everyday opportunities is only the beginning. Discover what motivates you and why you want to pursue your journey.";
const clueItem = global.window.gameState.state.inventory.find(i => i.id === 'm5_w3_clue');
assert.ok(clueItem, 'Clue 03 must be present in inventory');
assert.strictEqual(clueItem.desc, expectedClueQuote, 'Clue quote must match exact text');
console.log('✓ Wall 3 Completion & Final Clue exact text verified');

// Test 13: Rewards Granted Once
console.log('Test 13: Rewards awarded once (no duplicates)');
const simBadges = global.window.gameState.state.inventory.filter(i => i.id === 'm5_w3_simulator_badge');
assert.strictEqual(simBadges.length, 1, 'Simulator badge must not be duplicated');
wall3.checkWall3Complete(); // trigger again
const simBadgesAfter = global.window.gameState.state.inventory.filter(i => i.id === 'm5_w3_simulator_badge');
assert.strictEqual(simBadgesAfter.length, 1, 'Simulator badge count must remain exactly 1');
console.log('✓ No duplicate rewards verified');

// Test 14: module5State.isWall3Complete() Helper
console.log('Test 14: module5State.isWall3Complete()');
assert.strictEqual(global.window.module5State.isWall3Complete(), true, 'isWall3Complete helper must return true');
console.log('✓ isWall3Complete helper verified');

// Test 15: Wall 4 Auto-Sync (No Repeated Module 2.5)
console.log('Test 15: Wall 4 auto-sync prevents repeating Module 2.5');
const wall4 = global.window.module5Wall4;
const w4State = wall4.getState();
assert.strictEqual(w4State.isModule25PodcastWatched, true, 'Wall 4 must register Module 2.5 podcast as watched');
assert.strictEqual(w4State.isModule25QuizPassed, true, 'Wall 4 must register Module 2.5 quiz as passed');
console.log('✓ Wall 4 auto-sync verified');

// Test 16: Knowledge Box 3 opens Module 2.4 Modal and Podcast Screen is locked before Mod 2.4 Quiz
console.log('Test 16: Knowledge Box 3 opens Mod 2.4 & Podcast Screen locked before Quiz 2.4');
// Reset mod 2.4 quiz state for this test
state.module24.quizPassed = false;
const lockedModal = global.document.getElementById('m5-w3-podcast25-locked-modal');
wall3.clickPodcastScreen25();
assert.strictEqual(lockedModal.classList.contains('active'), true, 'Podcast screen must show locked modal when quiz 2.4 not passed');
wall3.closePodcast25LockedModal();
assert.strictEqual(lockedModal.classList.contains('active'), false, 'Podcast locked modal must close');

// Open KB3 modal
const kb3Modal = global.document.getElementById('m5-w3-kb3-modal');
wall3.clickKnowledgeBox3();
assert.strictEqual(kb3Modal.classList.contains('active'), true, 'KB3 modal must open when puzzle is complete');
assert.strictEqual(wall3.kb3ActiveTab.startsWith('m24_'), true, 'KB3 active tab must be Module 2.4');
wall3.closeKB3Modal();
assert.strictEqual(kb3Modal.classList.contains('active'), false, 'KB3 modal must close');
console.log('✓ Knowledge Box 3 (Mod 2.4) & Podcast Screen Lock verified');

// Test 17: Podcast Screen (Image 2) opens Module 2.5 Modal once Mod 2.4 Quiz passed
console.log('Test 17: Podcast Screen opens Mod 2.5 Modal when Quiz 2.4 passed');
state.module24.quizPassed = true;
const podcast25Modal = global.document.getElementById('m5-w3-podcast25-modal');
wall3.clickPodcastScreen25();
assert.strictEqual(podcast25Modal.classList.contains('active'), true, 'Podcast 2.5 modal must open when quiz 2.4 is passed');
assert.strictEqual(wall3.podcast25ActiveTab.startsWith('m25_'), true, 'Podcast 2.5 active tab must be Module 2.5');
wall3.closePodcast25Modal();
assert.strictEqual(podcast25Modal.classList.contains('active'), false, 'Podcast 2.5 modal must close');
console.log('✓ Podcast Screen (Mod 2.5) Modal separation verified');

console.log('\n=========================================');
console.log('ALL 17 AUTOMATED TESTS PASSED SUCCESSFULLY!');
console.log('=========================================');
