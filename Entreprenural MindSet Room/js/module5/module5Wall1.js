/**
 * MIND MATTERS ENTREPRENEURIAL LAB
 * WALL 1: MINDSET SCANNER CONTROLLER
 * Full Interactive Engine: Scan & Match, Scanner Activation, Knowledge Box 1,
 * Module 2.1 Podcast & Quizzes, Transition Puzzle 2, Module 2.2 Podcast & Self-Assessment, Clue 01
 */

class Module5Wall1Controller {
  constructor() {
    this.audioInterval = null;
    this.isPlaying = false;
    this.currentTrackTime = 0;
    this.maxReachedTime = 0; // Track furthest point watched to prevent skip-seeking
    this.trackDuration = 225; // 3:45 in seconds
    this.activeModule = '2.1'; // '2.1' or '2.2'
    this.selectedStoryCard = null; // 'neha' | 'sanket' | 'adidas'
    this.selectedSymbol = null; // 'broom' | 'mic' | 'shoes'

    // Quiz 2.1 State
    this.q21CurrentIndex = 0;
    this.q21Answers = {};
    this.q21Submitted = {};
    this.q21Finished = false;

    // Quiz 2.2 State
    this.q22CurrentIndex = 0;
    this.q22Answers = {};
    this.q22Submitted = {};
    this.q22Finished = false;

    // Puzzle 2 State
    this.puzzle2Selections = { A: false, B: false, C: false };

    // Self-Assessment 2.2 State
    this.selfAssessmentRatings = {};

    // Original Activity 2.1 State
    this.activity21Answers = { 1: null, 2: null, 3: null };

    // Submission guard
    this.isSubmitting = false;
  }

  // Retrieve Wall 1 state from centralized state
  getState() {
    if (!window.module5State) return {};
    if (!window.module5State.state.wall1) {
      window.module5State.state.wall1 = {
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
      };
    }
    return window.module5State.state.wall1;
  }

  saveState() {
    if (window.module5State) {
      window.module5State.save();
    }
    this.syncWallUI();
  }

  init() {
    this.syncWallUI();
  }

  // ============================================================
  // OBJECT A, B, C: SCAN & MATCH PUZZLE
  // ============================================================
  selectStoryCard(cardKey) {
    const state = this.getState();
    if (state.isPuzzleComplete) {
      window.app?.showToast('Scan & Match is already completed! The Scanner is activated.', 'info');
      return;
    }

    this.selectedStoryCard = cardKey;
    if (window.soundEngine?.playClick) window.soundEngine.playClick();
    this.syncWallUI();
    window.app?.showToast(`Selected Story: ${this.getCardDisplayName(cardKey)}. Now click a matching symbol below!`, 'info');
  }

  selectSymbol(symbolKey) {
    const state = this.getState();
    if (state.isPuzzleComplete) return;

    let normalized = symbolKey;
    if (normalized === 'broom') normalized = 'cleaning';
    if (normalized === 'mic') normalized = 'voice';

    if (this.selectedStoryCard) {
      this.onDropdownChange(this.selectedStoryCard, normalized);
      if (window.soundEngine?.playClick) window.soundEngine.playClick();
      window.app?.showToast(`Paired ${this.getCardDisplayName(this.selectedStoryCard)} with ${this.getSymbolDisplayName(symbolKey)}!`, 'info');
      this.selectedStoryCard = null;
      this.syncWallUI();

      // If all 3 are paired, open console to submit
      const m = state.matches;
      if (m.neha && m.sanket && m.adidas) {
        setTimeout(() => {
          this.openConsoleModal();
          window.app?.showToast('All 3 stories paired! Click SUBMIT MATCHES to activate the Scanner.', 'info');
        }, 600);
      }
    } else {
      this.openConsoleModal();
      window.app?.showToast(`Selected Symbol: ${this.getSymbolDisplayName(symbolKey)}. Select a story card on the console to pair it!`, 'info');
    }
  }

  getCardDisplayName(key) {
    if (key === 'neha') return 'Neha Parab (Cleaning Service)';
    if (key === 'sanket') return 'Sanket Mhatre (Voice Artist)';
    if (key === 'adidas') return 'Adidas (Global Sports Brand)';
    return key;
  }

  getSymbolDisplayName(key) {
    if (key === 'broom' || key === 'cleaning') return 'Cleaning Broom 🧹';
    if (key === 'mic' || key === 'voice') return 'Voice Microphone 🎙️';
    if (key === 'shoes') return 'Sports Shoes 👟';
    return key;
  }

  openConsoleModal() {
    const modal = document.getElementById('m5-console-modal');
    if (!modal) return;
    this.syncConsoleModal();
    modal.classList.add('active');
    modal.style.display = 'flex';
    modal.style.opacity = '1';
    modal.style.visibility = 'visible';
    modal.style.pointerEvents = 'auto';
    if (window.soundEngine?.playClick) window.soundEngine.playClick();
  }

  closeConsoleModal() {
    const modal = document.getElementById('m5-console-modal');
    if (modal) {
      modal.classList.remove('active');
      modal.style.display = 'none';
      modal.style.opacity = '0';
      modal.style.visibility = 'hidden';
      modal.style.pointerEvents = 'none';
    }
  }

  onDropdownChange(storyKey, value) {
    if (this.isSubmitting) return;
    const state = this.getState();
    if (state.isPuzzleComplete) return;

    if (!state.matches) {
      state.matches = { neha: null, sanket: null, adidas: null };
    }

    if (value) {
      // Enforce single-use constraint:
      // If any other story has already chosen this symbol, vacate it
      ['neha', 'sanket', 'adidas'].forEach(k => {
        if (k !== storyKey) {
          let currentVal = state.matches[k];
          if (currentVal === 'broom') currentVal = 'cleaning';
          if (currentVal === 'mic') currentVal = 'voice';
          if (currentVal === value) {
            state.matches[k] = null;
            // Clear error class on the vacated row
            document.getElementById(`m5-console-row-${k}`)?.classList.remove('error');
            document.getElementById(`m5-console-select-${k}`)?.classList.remove('error');
          }
        }
      });
      state.matches[storyKey] = value;
    } else {
      state.matches[storyKey] = null;
    }

    // Clear error highlights for this row if any
    const rowEl = document.getElementById(`m5-console-row-${storyKey}`);
    if (rowEl) rowEl.classList.remove('error');
    const selectEl = document.getElementById(`m5-console-select-${storyKey}`);
    if (selectEl) selectEl.classList.remove('error');

    // Hide general error feedback if user is modifying selections
    const feedbackEl = document.getElementById('m5-console-feedback');
    if (feedbackEl && feedbackEl.classList.contains('error')) {
      feedbackEl.style.display = 'none';
    }

    if (window.soundEngine?.playClick) window.soundEngine.playClick();
    this.saveState();
    this.syncConsoleModal();
  }

  resetConsoleMatches() {
    if (this.isSubmitting) return;
    const state = this.getState();
    if (state.isPuzzleComplete) return;

    state.matches = { neha: null, sanket: null, adidas: null };
    this.selectedStoryCard = null;
    this.selectedSymbol = null;
    this.saveState();

    // Clear feedback
    const feedbackEl = document.getElementById('m5-console-feedback');
    if (feedbackEl) {
      feedbackEl.style.display = 'none';
      feedbackEl.className = 'm5-console-feedback';
      feedbackEl.textContent = '';
    }

    // Remove red error classes
    ['neha', 'sanket', 'adidas'].forEach(k => {
      const row = document.getElementById(`m5-console-row-${k}`);
      if (row) row.classList.remove('error');
      const sel = document.getElementById(`m5-console-select-${k}`);
      if (sel) sel.classList.remove('error');
    });

    if (window.soundEngine?.playClick) window.soundEngine.playClick();
    this.syncConsoleModal();
    window.app?.showToast('Selections reset. Choose symbols for each entrepreneur.', 'info');
  }

  setConsoleMatch(storyKey, symbolKey) {
    let normalized = symbolKey;
    if (normalized === 'broom') normalized = 'cleaning';
    if (normalized === 'mic') normalized = 'voice';
    this.onDropdownChange(storyKey, normalized);
  }

  submitScanAndMatch() {
    if (this.isSubmitting) return;
    const state = this.getState();
    if (state.isPuzzleComplete) return;

    const matches = state.matches || {};
    const feedbackEl = document.getElementById('m5-console-feedback');

    // Normalize values
    const nehaVal = matches.neha === 'broom' ? 'cleaning' : matches.neha;
    const sanketVal = matches.sanket === 'mic' ? 'voice' : matches.sanket;
    const adidasVal = matches.adidas;

    const isNehaCorrect = (nehaVal === 'cleaning');
    const isSanketCorrect = (sanketVal === 'voice');
    const isAdidasCorrect = (adidasVal === 'shoes');

    // Reset previous error classes
    ['neha', 'sanket', 'adidas'].forEach(k => {
      const row = document.getElementById(`m5-console-row-${k}`);
      if (row) row.classList.remove('error');
      const sel = document.getElementById(`m5-console-select-${k}`);
      if (sel) sel.classList.remove('error');
    });

    if (isNehaCorrect && isSanketCorrect && isAdidasCorrect) {
      // Correct!
      this.isSubmitting = true;
      state.isPuzzleComplete = true;
      state.isScannerActive = true;
      state.isKnowledgeBox1Unlocked = true;
      this.saveState();

      // Add Mindset Scanner Decryptor and Clue 01 to Explorer's Bag Inventory
      window.gameState?.addItem({
        id: 'm5_scanner_device',
        name: 'Mindset Scanner Decryptor',
        icon: '🧬',
        type: 'diagnostic_tool',
        desc: 'Handheld diagnostic scanner programmed to decode founder cognitive traits.'
      });

      window.gameState?.addItem({
        id: 'm5_clue_01',
        name: 'Clue 01: Mindset Revelation',
        icon: '📜',
        type: 'founder_clue',
        desc: '"Knowing how entrepreneurs think is only the beginning. Now discover how they build their future."'
      });

      if (feedbackEl) {
        feedbackEl.className = 'm5-console-feedback success';
        feedbackEl.textContent = 'ALL 3 MATCHES CORRECT! Entrepreneurial stories successfully identified. Activating the Mindset Scanner...';
        feedbackEl.style.display = 'block';
      }

      const submitBtn = document.getElementById('m5-console-submit-btn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'ACTIVATING SCANNER...';
      }
      const resetBtn = document.getElementById('m5-console-reset-btn');
      if (resetBtn) resetBtn.disabled = true;

      // Disable select inputs
      ['neha', 'sanket', 'adidas'].forEach(k => {
        const sel = document.getElementById(`m5-console-select-${k}`);
        if (sel) sel.disabled = true;
      });

      if (window.soundEngine?.playSuccess) window.soundEngine.playSuccess();
      window.app?.showToast('🎉 ALL 3 MATCHES CORRECT! Activating Mindset Scanner...', 'reward');

      setTimeout(() => {
        this.closeConsoleModal();
        this.triggerScannerActivationEffect();
        this.isSubmitting = false;
      }, 1500);
    } else {
      // Incorrect!
      // Highlight incorrect rows in red glow
      if (!isNehaCorrect) {
        document.getElementById('m5-console-row-neha')?.classList.add('error');
        document.getElementById('m5-console-select-neha')?.classList.add('error');
      }
      if (!isSanketCorrect) {
        document.getElementById('m5-console-row-sanket')?.classList.add('error');
        document.getElementById('m5-console-select-sanket')?.classList.add('error');
      }
      if (!isAdidasCorrect) {
        document.getElementById('m5-console-row-adidas')?.classList.add('error');
        document.getElementById('m5-console-select-adidas')?.classList.add('error');
      }

      if (feedbackEl) {
        feedbackEl.className = 'm5-console-feedback error';
        feedbackEl.textContent = 'Not quite! Recheck the entrepreneur stories on the wall and try again.';
        feedbackEl.style.display = 'block';
      }

      if (window.soundEngine?.playError) window.soundEngine.playError();
      window.app?.showToast('Not quite! Recheck the entrepreneur stories on the wall and try again.', 'warning');
    }
  }

  triggerScannerActivationEffect() {
    const scannerEl = document.getElementById('m5-w1-scanner');
    const scannerStatus = document.getElementById('m5-w1-scanner-status');
    if (scannerEl) {
      scannerEl.classList.add('activating');
      if (scannerStatus) {
        scannerStatus.textContent = 'ANALYZING MINDSET...';
      }
      setTimeout(() => {
        scannerEl.classList.remove('activating');
        scannerEl.classList.add('active');
        if (scannerStatus) {
          scannerStatus.textContent = 'SCAN COMPLETE — ENTREPRENEURIAL MINDSET DETECTED';
        }
        this.syncWallUI();
        window.app?.showToast('🔓 Mindset Scanner Activated! Click the Mindset Scanner to solve Puzzle 2.', 'reward');
      }, 2000);
    } else {
      this.syncWallUI();
    }
  }

  // ============================================================
  // OBJECT D: SCANNER MACHINE CLICK — OPENS PUZZLE 2
  // ============================================================
  clickScanner() {
    const state = this.getState();
    if (!state.isPuzzleComplete) {
      window.app?.showToast('⚠️ Mindset Scanner is on STANDBY. Solve the Scan & Match console puzzle first to activate the scanner!', 'warning');
      if (window.soundEngine?.playError) window.soundEngine.playError();
      return;
    }

    window.app?.showToast('🔓 Mindset Scanner activated. Click Knowledge Box 1 when you are ready to open it.', 'reward');
  }

  // ============================================================
  // OBJECT E: KNOWLEDGE BOX 1 CLICK & MODAL
  // ============================================================
  clickKnowledgeBox1() {
    const state = this.getState();
    if (!state.isKnowledgeBox1Unlocked && !state.isScannerActive) {
      window.app?.showToast('🔒 Knowledge Box 1 is LOCKED! Complete the Scan & Match puzzle on the console first.', 'error');
      if (window.soundEngine?.playError) window.soundEngine.playError();
      return;
    }

    this.openKnowledgeBox1Modal();
  }

  openKnowledgeBox1Modal() {
    const modal = document.getElementById('m5-kb1-modal');
    if (!modal) return;
    modal.classList.add('active');
    modal.style.display = 'flex';
    modal.style.opacity = '1';
    modal.style.visibility = 'visible';
    modal.style.pointerEvents = 'auto';
    if (window.soundEngine?.playClick) window.soundEngine.playClick();
    this.syncKB1Modal();
  }

  closeKnowledgeBox1Modal() {
    this.pauseAudio();
    const modal = document.getElementById('m5-kb1-modal');
    if (modal) {
      modal.classList.remove('active');
      modal.style.display = 'none';
      modal.style.opacity = '0';
      modal.style.visibility = 'hidden';
      modal.style.pointerEvents = 'none';
    }
  }

  switchKB1Tab(tabKey) {
    const state = this.getState();

    if (tabKey === '2.2') {
      if (!state.isPuzzle2Complete) {
        // Check which prerequisite is missing to give a more helpful message
        const isM21MediaDone = state.completedModule21MediaIds && state.completedModule21MediaIds.includes('media_2_1');
        if (!isM21MediaDone) {
          window.app?.showToast('🔒 Module 2.2 is LOCKED. First watch the Module 2.1 podcast by clicking Knowledge Box 1!', 'warning');
        } else if (!state.isModule21QuizPassed) {
          window.app?.showToast('🔒 Module 2.2 is LOCKED. Complete the Module 2.1 Knowledge Check first.', 'warning');
        } else if (!(state.completedModule21ActivityIds && state.completedModule21ActivityIds.length >= 3)) {
          window.app?.showToast('🔒 Module 2.2 is LOCKED. Complete the Module 2.1 Activity first.', 'warning');
        } else {
          window.app?.showToast('🔒 Module 2.2 is LOCKED. Solve Puzzle 2 on the Mindset Scanner first.', 'warning');
        }
        if (window.soundEngine?.playError) window.soundEngine.playError();
        return;
      }
    }

    if (tabKey === 'puzzle2') {
      if (!state.isScannerActive && !state.isPuzzleComplete) {
        window.app?.showToast('🔒 Puzzle 2 is LOCKED. Solve the Scan & Match console puzzle on Wall 1 first.', 'warning');
        if (window.soundEngine?.playError) window.soundEngine.playError();
        return;
      }
    }

    if (tabKey === 'clue01') {
      const isM22PodcastDone = state.completedModule22MediaIds?.includes('media_2_2');
      const isM22Done = isM22PodcastDone &&
                        state.isModule22QuizPassed &&
                        this.hasCompletedModule22SelfAssessment(state);
      if (!isM22Done) {
        window.app?.showToast('🔒 Clue 01 is LOCKED. Complete the Module 2.2 podcast, pass its knowledge check, and rate all 15 characteristics first.', 'warning');
        if (window.soundEngine?.playError) window.soundEngine.playError();
        return;
      }
    }

    this.activeModule = tabKey;
    this.pauseAudio();
    this.currentTrackTime = 0;
    this.maxReachedTime = 0; // Reset seek limit for new module
    this.trackDuration = (tabKey === '2.2') ? 250 : 225;
    if (window.soundEngine?.playClick) window.soundEngine.playClick();
    this.syncKB1Modal();
  }

  // ============================================================
  // OBJECT F: DEDICATED PODCAST AUDIO/MEDIA PLAYER
  // ============================================================
  togglePlayAudio(moduleKey = null) {
    if (this.isPlaying) {
      this.pauseAudio();
    } else {
      this.playAudio(moduleKey);
    }
  }

  playAudio(moduleKey = null) {
    const mod = moduleKey || this.activeModule || '2.1';
    this.isPlaying = true;
    this.playingModule = mod;
    this.activeModule = mod;

    const btn1 = document.getElementById('m5-audio-play-btn');
    const btn2 = document.getElementById('m5-audio-play-btn-22');
    const screen1 = document.getElementById('m5-video-screen-21');
    const screen2 = document.getElementById('m5-video-screen-22');
    const overlay1 = document.getElementById('m5-video-play-btn-21');
    const overlay2 = document.getElementById('m5-video-play-btn-22');
    const status1 = document.getElementById('m5-video-status-text-21');
    const status2 = document.getElementById('m5-video-status-text-22');

    if (mod === '2.2') {
      if (btn2) { btn2.innerHTML = '<span>⏸ Pause Video</span>'; btn2.classList.add('active-play'); }
      if (btn1) { btn1.innerHTML = '<span>▶ Play Video</span>'; btn1.classList.remove('active-play'); }
      if (screen2) screen2.classList.add('is-playing');
      if (screen1) screen1.classList.remove('is-playing');
      if (overlay2) overlay2.textContent = '⏸';
      if (overlay1) overlay1.textContent = '▶';
      if (status2) status2.textContent = 'STREAMING VIDEO LECTURE 2.2...';
      if (status1) status1.textContent = 'CLICK SCREEN TO PLAY VIDEO';
    } else {
      if (btn1) { btn1.innerHTML = '<span>⏸ Pause Video</span>'; btn1.classList.add('active-play'); }
      if (btn2) { btn2.innerHTML = '<span>▶ Play Video</span>'; btn2.classList.remove('active-play'); }
      if (screen1) screen1.classList.add('is-playing');
      if (screen2) screen2.classList.remove('is-playing');
      if (overlay1) overlay1.textContent = '⏸';
      if (overlay2) overlay2.textContent = '▶';
      if (status1) status1.textContent = 'STREAMING VIDEO LECTURE 2.1...';
      if (status2) status2.textContent = 'CLICK SCREEN TO PLAY VIDEO';
    }

    const vis1 = document.getElementById('m5-audio-visualizer');
    const vis2 = document.getElementById('m5-audio-visualizer-22');
    if (mod === '2.2') {
      if (vis2) vis2.classList.add('playing');
      if (vis1) vis1.classList.remove('playing');
    } else {
      if (vis1) vis1.classList.add('playing');
      if (vis2) vis2.classList.remove('playing');
    }

    if (window.soundEngine?.init) window.soundEngine.init();

    clearInterval(this.audioInterval);
    this.audioInterval = setInterval(() => {
      this.currentTrackTime += 1;
      // Track the furthest point actually watched
      if (this.currentTrackTime > this.maxReachedTime) {
        this.maxReachedTime = this.currentTrackTime;
      }
      if (this.currentTrackTime >= this.trackDuration) {
        this.currentTrackTime = this.trackDuration;
        this.maxReachedTime = this.trackDuration;
        this.pauseAudio();
        this.onAudioPlaybackComplete();
      }
      this.updateAudioProgressUI();
    }, 1000);
  }

  pauseAudio() {
    this.isPlaying = false;
    clearInterval(this.audioInterval);

    const btn1 = document.getElementById('m5-audio-play-btn');
    const btn2 = document.getElementById('m5-audio-play-btn-22');
    if (btn1) { btn1.innerHTML = '<span>▶ Play Video</span>'; btn1.classList.remove('active-play'); }
    if (btn2) { btn2.innerHTML = '<span>▶ Play Video</span>'; btn2.classList.remove('active-play'); }

    const screen1 = document.getElementById('m5-video-screen-21');
    const screen2 = document.getElementById('m5-video-screen-22');
    if (screen1) screen1.classList.remove('is-playing');
    if (screen2) screen2.classList.remove('is-playing');

    const overlay1 = document.getElementById('m5-video-play-btn-21');
    const overlay2 = document.getElementById('m5-video-play-btn-22');
    if (overlay1) overlay1.textContent = '▶';
    if (overlay2) overlay2.textContent = '▶';

    const status1 = document.getElementById('m5-video-status-text-21');
    const status2 = document.getElementById('m5-video-status-text-22');
    if (status1) status1.textContent = 'CLICK SCREEN TO PLAY VIDEO';
    if (status2) status2.textContent = 'CLICK SCREEN TO PLAY VIDEO';

    const vis1 = document.getElementById('m5-audio-visualizer');
    const vis2 = document.getElementById('m5-audio-visualizer-22');
    if (vis1) vis1.classList.remove('playing');
    if (vis2) vis2.classList.remove('playing');
  }

  seekAudio(seconds, moduleKey = null) {
    // Only allow seeking up to the furthest point the user has actually watched
    const maxAllowed = this.maxReachedTime || this.currentTrackTime;
    const clampedSeconds = Math.min(maxAllowed, Math.max(0, seconds));
    this.currentTrackTime = Math.min(this.trackDuration, clampedSeconds);
    this.updateAudioProgressUI();
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  updateAudioProgressUI() {
    const timeFormatted = this.formatTime(this.currentTrackTime);
    const durFormatted = this.formatTime(this.trackDuration);
    const percent = (this.trackDuration > 0) ? (this.currentTrackTime / this.trackDuration) * 100 : 0;

    // Module 2.1 UI
    const curTimeEl1 = document.getElementById('m5-audio-current-time');
    const durTimeEl1 = document.getElementById('m5-audio-duration-time');
    const seekBar1 = document.getElementById('m5-audio-seekbar');
    if (curTimeEl1) curTimeEl1.textContent = timeFormatted;
    if (durTimeEl1) durTimeEl1.textContent = durFormatted;
    if (seekBar1) seekBar1.value = percent;

    // Module 2.2 UI
    const curTimeEl2 = document.getElementById('m5-audio-current-time-22');
    const durTimeEl2 = document.getElementById('m5-audio-duration-time-22');
    const seekBar2 = document.getElementById('m5-audio-seekbar-22');
    if (curTimeEl2) curTimeEl2.textContent = timeFormatted;
    if (durTimeEl2) durTimeEl2.textContent = durFormatted;
    if (seekBar2) seekBar2.value = percent;
  }

  onAudioPlaybackComplete() {
    const state = this.getState();
    const completedModule = this.playingModule || this.activeModule;
    const mediaId = completedModule === '2.1' ? 'media_2_1' : 'media_2_2';

    if (completedModule === '2.1' && !state.completedModule21MediaIds.includes(mediaId)) {
      state.completedModule21MediaIds.push(mediaId);
      this.saveState();
      window.app?.showToast('🎧 Module 2.1 Podcast Completed! Knowledge Check is now unlocked.', 'reward');
    } else if (completedModule === '2.2' && !state.completedModule22MediaIds.includes(mediaId)) {
      state.completedModule22MediaIds.push(mediaId);
      this.saveState();
      window.app?.showToast('🎧 Module 2.2 Podcast Completed! Knowledge Check is now unlocked.', 'reward');
    }
    this.syncKB1Modal(true);
  }

  confirmMarkAsWatched(moduleKey) {
    if (moduleKey !== '2.1' && moduleKey !== '2.2') {
      window.app?.showToast('Unable to mark this podcast as read. Please reopen it from the correct wall.', 'warning');
      return;
    }

    if (this.isPlaying) this.pauseAudio();
    this.activeModule = moduleKey;
    const state = this.getState();
    const completedMedia = moduleKey === '2.1'
      ? state.completedModule21MediaIds
      : state.completedModule22MediaIds;
    const mediaId = moduleKey === '2.1' ? 'media_2_1' : 'media_2_2';

    if (!completedMedia.includes(mediaId)) {
      completedMedia.push(mediaId);
      this.saveState();
      window.app?.showToast(`✓ Module ${moduleKey} podcast marked as read. The knowledge check is now available.`, 'reward');
    } else {
      window.app?.showToast(`Module ${moduleKey} podcast is already marked as read.`, 'info');
    }

    this.syncKB1Modal(true);
  }

  scrollToUnlockedQuiz(quizSection) {
    if (!quizSection) return;

    const contentScroll = document.querySelector('#m5-kb1-modal .m5-kb-content-scroll');
    const scrollToQuiz = () => {
      if (!contentScroll || !quizSection.isConnected) return;
      const scrollRect = contentScroll.getBoundingClientRect();
      const quizRect = quizSection.getBoundingClientRect();
      contentScroll.scrollTo({
        top: contentScroll.scrollTop + quizRect.top - scrollRect.top - 20,
        behavior: 'smooth'
      });
    };

    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(() => window.requestAnimationFrame(scrollToQuiz));
    } else {
      setTimeout(scrollToQuiz, 0);
    }
  }

  goToModule22Quiz() {
    const state = this.getState();
    if (!state.completedModule22MediaIds?.includes('media_2_2')) {
      window.app?.showToast('Complete or mark the Module 2.2 podcast as read to unlock its knowledge check.', 'info');
      return;
    }

    this.activeModule = '2.2';
    this.syncKB1Modal();
    this.scrollToUnlockedQuiz(document.getElementById('m5-q22-section'));
  }

  // ============================================================
  // OBJECT G: MODULE 2.1 SUPPLEMENTARY QUIZ
  // ============================================================
  getModule21QuizData() {
    return [
      {
        id: 1,
        question: '1. What does an entrepreneurial mindset primarily involve?',
        options: [
          'A. Starting a business immediately.',
          'B. Taking ownership, showing initiative, and solving problems.',
          'C. Avoiding mistakes at all costs.',
          'D. Waiting for instructions before taking action.'
        ],
        correct: 1,
        feedbackCorrect: 'Correct. Entrepreneurial thinking involves ownership, initiative, and problem-solving.',
        feedbackIncorrect: 'Think about the difference between simply starting a business and developing an entrepreneurial way of thinking.'
      },
      {
        id: 2,
        question: '2. Which is an example of entrepreneurial thinking by a student?',
        options: [
          'A. Waiting for others to solve every group-project problem.',
          'B. Avoiding responsibility when something goes wrong.',
          'C. Taking initiative to improve a college event.',
          'D. Refusing to try an unfamiliar task.'
        ],
        correct: 2,
        feedbackCorrect: 'Correct. Taking initiative and improving shared experiences shows an owner mindset.',
        feedbackIncorrect: 'Consider which choice demonstrates taking initiative and proactive responsibility.'
      },
      {
        id: 3,
        question: '3. A student wants to solve a local problem but has very limited money. What is the best entrepreneurial approach?',
        options: [
          'A. Abandon the idea until substantial funding is available.',
          'B. Explore a small, affordable experiment and learn from the results.',
          'C. Copy a large company without understanding the problem.',
          'D. Avoid speaking to potential users.'
        ],
        correct: 1,
        feedbackCorrect: 'Correct. Exploring small, affordable experiments and learning from results is the core of bootstrapping.',
        feedbackIncorrect: 'Entrepreneurs start small, test hypotheses with affordable pilots, and iterate based on real feedback.'
      },
      {
        id: 4,
        question: '4. What does thinking like an owner mean in an internship?',
        options: [
          'A. Taking responsibility and looking for ways to contribute.',
          'B. Doing only the bare minimum assigned work.',
          'C. Ignoring feedback.',
          'D. Avoiding independent problem-solving.'
        ],
        correct: 0,
        feedbackCorrect: 'Correct. Taking responsibility and seeking proactive ways to contribute defines thinking like an owner.',
        feedbackIncorrect: 'Thinking like an owner means treating the organization\'s goals as your own and taking accountability.'
      },
      {
        id: 5,
        question: '5. Which abilities can an entrepreneurial mindset help develop?',
        options: [
          'A. Initiative and adaptability.',
          'B. Ownership and accountability.',
          'C. Problem-solving and confidence.',
          'D. All of the above.'
        ],
        correct: 3,
        feedbackCorrect: 'Correct. An entrepreneurial mindset builds a wide array of life and career capabilities.',
        feedbackIncorrect: 'An entrepreneurial mindset encompasses all of these vital professional strengths.'
      }
    ];
  }

  selectQ21Option(optIndex) {
    const qData = this.getModule21QuizData()[this.q21CurrentIndex];
    if (this.q21Submitted[qData.id]) return;
    this.q21Answers[qData.id] = optIndex;
    if (window.soundEngine?.playClick) window.soundEngine.playClick();
    this.renderQ21Question();
  }

  submitQ21Answer() {
    const qData = this.getModule21QuizData()[this.q21CurrentIndex];
    const selected = this.q21Answers[qData.id];

    if (selected === undefined || selected === null) {
      window.app?.showToast('Please select an answer choice before submitting.', 'warning');
      return;
    }

    this.q21Submitted[qData.id] = true;
    const isCorrect = (selected === qData.correct);

    if (isCorrect) {
      if (window.soundEngine?.playSuccess) window.soundEngine.playSuccess();
    } else {
      if (window.soundEngine?.playError) window.soundEngine.playError();
    }

    this.renderQ21Question();
  }

  nextQ21Question() {
    const quizList = this.getModule21QuizData();
    if (this.q21CurrentIndex < quizList.length - 1) {
      this.q21CurrentIndex += 1;
      this.renderQ21Question();
    } else {
      // Evaluate final score
      let score = 0;
      quizList.forEach(q => {
        if (this.q21Answers[q.id] === q.correct) score += 1;
      });

      const state = this.getState();
      state.module21QuizScore = score;
      this.q21Finished = true;

      if (score >= 4) {
        state.isModule21QuizPassed = true;
        this.saveState();
        if (window.soundEngine?.playSuccess) window.soundEngine.playSuccess();
        window.app?.showToast(`🎉 Passed Module 2.1 Knowledge Check (${score}/5)! Activity unlocked.`, 'reward');
      } else {
        state.isModule21QuizPassed = false;
        this.saveState();
        if (window.soundEngine?.playError) window.soundEngine.playError();
        window.app?.showToast(`Score: ${score}/5. Need at least 4/5 to pass. Click Reset & Retake to try again!`, 'warning');
      }

      this.syncKB1Modal();
    }
  }

  retryQ21Quiz() {
    this.q21CurrentIndex = 0;
    this.q21Answers = {};
    this.q21Submitted = {};
    this.q21Finished = false;
    const state = this.getState();
    state.isModule21QuizPassed = false;
    this.saveState();
    if (window.soundEngine?.playClick) window.soundEngine.playClick();
    this.syncKB1Modal();
    window.app?.showToast('Quiz reset. Answer all 5 questions to pass!', 'info');
  }

  // ============================================================
  // MODULE 2.1 ORIGINAL ACTIVITY (INSPIRING FOUNDER STORIES)
  // ============================================================
  getModule21OriginalActivityData() {
    return [
      {
        id: 1,
        founder: 'Neha Parab — Cleaning Service Business',
        scenario: 'Neha identified that residential cleaning lacked standardized reliability, hygiene guarantees, and professional respect. Starting with minimal capital, she organized a trained cleaning team, standard checklists, and transparent pricing.',
        question: 'Which entrepreneurial traits did Neha demonstrate in transforming a traditional chore into a scalable enterprise?',
        options: [
          'A. Waiting for massive venture capital before offering a single service',
          'B. Proactive initiative, spot-on problem identification, and operational ownership',
          'C. Avoiding customer contact and delegating all accountability',
          'D. Closing the venture whenever minor scheduling conflicts occurred'
        ],
        correct: 1,
        explanation: 'Neha took proactive ownership and spotted a real customer friction point, turning an unorganized sector into a professional business.'
      },
      {
        id: 2,
        founder: 'Sanket Mhatre — Voice-Based Platform',
        scenario: 'Sanket observed that digital interfaces posed friction for regional voice artists and accessible audio communication. He experimented with low-cost software prototypes to empower content creators through voice.',
        question: 'Which core entrepreneurial mindset trait enabled Sanket to pioneer a voice platform?',
        options: [
          'A. Creative innovation, technological problem-solving, and resilience through prototypes',
          'B. Copying existing competitors without studying user accessibility',
          'C. Refusing user feedback on platform usability',
          'D. Quitting when early beta testers encountered software bugs'
        ],
        correct: 0,
        explanation: 'Sanket combined technological creativity with user-centered problem solving and rapid prototype iteration.'
      },
      {
        id: 3,
        founder: 'Adidas (Adolf Dassler) — Global Sports Brand',
        scenario: 'Starting in his mother’s wash kitchen after World War I, Adi Dassler hand-stitched spikes into track shoes tailored to each athlete’s specific foot structure, turning athletic craftsmanship into a globally trusted performance brand.',
        question: 'Which fundamental entrepreneurial driver enabled Adidas to scale from a wash kitchen to a global brand?',
        options: [
          'A. Relying purely on lucky coincidences without improving products',
          'B. Relentless customer empathy for athletes, dedication to craft, and resilience',
          'C. Abandoning athletic sports whenever market competition increased',
          'D. Selling low-quality canvas footwear without performance testing'
        ],
        correct: 1,
        explanation: 'Adi Dassler focused deeply on athletes\' real needs, continuous product iteration, and perseverance through economic hardships.'
      }
    ];
  }

  selectActivity21Option(actId, optIdx) {
    this.activity21Answers[actId] = optIdx;
    if (window.soundEngine?.playClick) window.soundEngine.playClick();
    this.syncKB1Modal();
  }

  submitActivity21() {
    const list = this.getModule21OriginalActivityData();
    let allAnswered = true;
    let allCorrect = true;

    list.forEach(item => {
      const ans = this.activity21Answers[item.id];
      if (ans === null || ans === undefined) allAnswered = false;
      if (ans !== item.correct) allCorrect = false;
    });

    if (!allAnswered) {
      window.app?.showToast('Please answer all 3 founder story questions.', 'warning');
      return;
    }

    if (allCorrect) {
      const state = this.getState();
      state.completedModule21ActivityIds = [1, 2, 3];
      this.saveState();
      if (window.soundEngine?.playSuccess) window.soundEngine.playSuccess();
      window.app?.showToast('🎉 MODULE 2.1 COMPLETE! Transition Puzzle 2 is unlocked.', 'reward');
      this.syncKB1Modal();
    } else {
      if (window.soundEngine?.playError) window.soundEngine.playError();
      window.app?.showToast('Review your answers. Focus on ownership, creativity, and resilience!', 'warning');
      this.syncKB1Modal();
    }
  }

  // ============================================================
  // TRANSITION PUZZLE — UNLOCK MODULE 2.2
  // ============================================================
  togglePuzzle2Tile(tileKey) {
    const state = this.getState();
    if (state.isPuzzle2Complete) return;

    this.puzzle2Selections[tileKey] = !this.puzzle2Selections[tileKey];
    if (window.soundEngine?.playClick) window.soundEngine.playClick();
    this.syncKB1Modal();
  }

  submitPuzzle2() {
    const state = this.getState();
    // Correct selection: Tile A selected, Tile B NOT selected, Tile C selected
    const isACorrect = this.puzzle2Selections.A === true;
    const isBCorrect = this.puzzle2Selections.B === false;
    const isCCorrect = this.puzzle2Selections.C === true;

    const feedbackEl = document.getElementById('m5-puzzle2-feedback');

    if (isACorrect && isBCorrect && isCCorrect) {
      state.isPuzzle2Complete = true;
      this.saveState();

      if (feedbackEl) {
        feedbackEl.className = 'm5-puzzle2-feedback success';
        feedbackEl.textContent = 'MINDSET CONFIRMED — READY TO DISCOVER YOUR OWN ENTREPRENEURIAL TRAITS.';
      }
      if (window.soundEngine?.playSuccess) window.soundEngine.playSuccess();
      window.app?.showToast('🎉 PUZZLE 2 SOLVED! Module 2.2 is now UNLOCKED.', 'reward');

      setTimeout(() => {
        this.switchKB1Tab('2.2');
      }, 1500);
    } else {
      if (feedbackEl) {
        feedbackEl.className = 'm5-puzzle2-feedback error';
        feedbackEl.textContent = 'NOT QUITE — THINK ABOUT OWNERSHIP, INITIATIVE AND LEARNING FROM MISTAKES.';
      }
      if (window.soundEngine?.playError) window.soundEngine.playError();
    }
  }

  // ============================================================
  // OBJECT G: MODULE 2.2 SUPPLEMENTARY QUIZ
  // ============================================================
  getModule22QuizData() {
    return [
      {
        id: 1,
        question: '1. Can entrepreneurial characteristics such as discipline and adaptability be developed?',
        options: [
          'A. No, they are entirely fixed at birth.',
          'B. Yes, through experience, learning, and conscious effort.',
          'C. Only after someone starts a successful company.',
          'D. Only through formal business education.'
        ],
        correct: 1,
        feedbackCorrect: 'Correct. Entrepreneurial traits can be developed through experience, reflection, and conscious effort.',
        feedbackIncorrect: 'Research shows that an entrepreneurial mindset is malleable and grows through deliberate experience.'
      },
      {
        id: 2,
        question: '2. Which approach best demonstrates resilience?',
        options: [
          'A. Abandoning a goal after the first setback.',
          'B. Refusing to change an unsuccessful approach.',
          'C. Learning from setbacks and adapting the approach.',
          'D. Avoiding unfamiliar situations permanently.'
        ],
        correct: 2,
        feedbackCorrect: 'Correct. Resilience means extracting lessons from setbacks and adapting your approach forward.',
        feedbackIncorrect: 'Resilience is about adapting constructively, not quitting or repeating failing methods.'
      },
      {
        id: 3,
        question: '3. A person has many creative ideas but rarely completes them. Which development area is especially relevant?',
        options: [
          'A. Follow-through and discipline.',
          'B. Avoiding every new idea.',
          'C. Refusing feedback.',
          'D. Depending entirely on others.'
        ],
        correct: 0,
        feedbackCorrect: 'Correct. Turning creative concepts into reality requires execution discipline and follow-through.',
        feedbackIncorrect: 'Idea generation without disciplined execution leads to unfinished projects.'
      },
      {
        id: 4,
        question: '4. How might an unexpected problem reveal entrepreneurial potential?',
        options: [
          'A. It encourages someone to avoid responsibility.',
          'B. It creates an opportunity to take initiative and solve a problem.',
          'C. It eliminates the need to learn new skills.',
          'D. It guarantees business success.'
        ],
        correct: 1,
        feedbackCorrect: 'Correct. Unexpected friction creates prime opportunities to take initiative and deliver value.',
        feedbackIncorrect: 'Entrepreneurs treat unexpected obstacles as invitations to step up and solve problems.'
      },
      {
        id: 5,
        question: '5. What is the main purpose of reflecting on your entrepreneurial traits?',
        options: [
          'A. To prove that you already possess every trait.',
          'B. To compare yourself negatively with other people.',
          'C. To understand your strengths and identify opportunities for growth.',
          'D. To avoid working on weaknesses.'
        ],
        correct: 2,
        feedbackCorrect: 'Correct. Self-reflection helps you recognize your natural strengths and target growth areas.',
        feedbackIncorrect: 'Self-assessment provides self-awareness to build strengths and consciously develop new habits.'
      }
    ];
  }

  selectQ22Option(optIndex) {
    const qData = this.getModule22QuizData()[this.q22CurrentIndex];
    if (this.q22Submitted[qData.id]) return;
    this.q22Answers[qData.id] = optIndex;
    if (window.soundEngine?.playClick) window.soundEngine.playClick();
    this.renderQ22Question();
  }

  submitQ22Answer() {
    const qData = this.getModule22QuizData()[this.q22CurrentIndex];
    const selected = this.q22Answers[qData.id];

    if (selected === undefined || selected === null) {
      window.app?.showToast('Please select an answer choice before submitting.', 'warning');
      return;
    }

    this.q22Submitted[qData.id] = true;
    const isCorrect = (selected === qData.correct);

    if (isCorrect) {
      if (window.soundEngine?.playSuccess) window.soundEngine.playSuccess();
    } else {
      if (window.soundEngine?.playError) window.soundEngine.playError();
    }

    this.renderQ22Question();
  }

  nextQ22Question() {
    const quizList = this.getModule22QuizData();
    if (this.q22CurrentIndex < quizList.length - 1) {
      this.q22CurrentIndex += 1;
      this.renderQ22Question();
    } else {
      // Evaluate final score
      let score = 0;
      quizList.forEach(q => {
        if (this.q22Answers[q.id] === q.correct) score += 1;
      });

      const state = this.getState();
      state.module22QuizScore = score;
      this.q22Finished = true;

      if (score >= 4) {
        state.isModule22QuizPassed = true;
        this.saveState();

        // Add Core Traits Mastery Token to Explorer's Bag Inventory
        window.gameState?.addItem({
          id: 'm5_kb1_token',
          name: 'Core Traits Mastery Token',
          icon: '💡',
          type: 'mastery_token',
          desc: 'Certified credential verifying mastery of problem-solving, initiative, and calculated risk-taking.'
        });

        if (window.soundEngine?.playSuccess) window.soundEngine.playSuccess();
        window.app?.showToast(`🎉 Passed Module 2.2 Knowledge Check (${score}/5)! The 15-characteristic activity is unlocked.`, 'reward');
      } else {
        state.isModule22QuizPassed = false;
        this.saveState();
        if (window.soundEngine?.playError) window.soundEngine.playError();
        window.app?.showToast(`Score: ${score}/5. Need at least 4/5 to pass. Click Reset & Retake to try again!`, 'warning');
      }

      this.syncKB1Modal();
      if (score >= 4) {
        this.scrollToUnlockedQuiz(document.getElementById('m5-assess22-section'));
      }
    }
  }

  retryQ22Quiz() {
    this.q22CurrentIndex = 0;
    this.q22Answers = {};
    this.q22Submitted = {};
    this.q22Finished = false;
    const state = this.getState();
    state.isModule22QuizPassed = false;
    this.saveState();
    if (window.soundEngine?.playClick) window.soundEngine.playClick();
    this.syncKB1Modal();
    window.app?.showToast('Quiz reset. Answer all 5 questions to pass!', 'info');
  }

  // ============================================================
  // MODULE 2.2 REQUIRED 15-CHARACTERISTIC ACTIVITY
  // ============================================================
  getModule22Traits() {
    return [
      { key: 'creativity', title: 'Coming up with new ideas (Creativity)' },
      { key: 'resilience', title: 'Bouncing back after setbacks (Resilience)' },
      { key: 'initiative', title: 'Starting things without being told (Taking Initiative)' },
      { key: 'riskTaking', title: 'Being okay with taking chances (Risk-Taking)' },
      { key: 'adaptability', title: 'Adjusting easily when plans change (Adaptability)' },
      { key: 'problemSolving', title: 'Figuring out how to fix problems (Problem-Solving)' },
      { key: 'passion', title: 'Feeling excited and motivated about goals (Passion)' },
      { key: 'selfDiscipline', title: 'Sticking to plans even when it’s tough (Self-Discipline)' },
      { key: 'curiosity', title: 'Wanting to learn new things all the time (Curiosity)' },
      { key: 'accountability', title: 'Taking responsibility for what you do (Accountability)' },
      { key: 'networking', title: 'Making friends and contacts to help out (Networking)' },
      { key: 'vision', title: 'Seeing where you want to go in the future (Vision)' },
      { key: 'confidence', title: 'Believing in yourself and what you can do (Confidence)' },
      { key: 'persistence', title: 'Not giving up even when it’s hard (Persistence)' },
      { key: 'decisionMaking', title: 'Making choices quickly and confidently (Decision-Making)' }
    ];
  }

  hasCompletedModule22SelfAssessment(state = this.getState()) {
    const ratings = state.module22Ratings || {};
    return !!state.isModule22SelfAssessmentComplete &&
      this.getModule22Traits().every(trait => Number.isInteger(ratings[trait.key]) && ratings[trait.key] >= 1 && ratings[trait.key] <= 5);
  }

  startTraitDrag(event, traitKey) {
    if (!this.getModule22Traits().some(trait => trait.key === traitKey)) return;
    event.dataTransfer.setData('text/plain', traitKey);
    event.dataTransfer.effectAllowed = 'move';
  }

  dropTraitRating(event, rating) {
    event.preventDefault();
    const traitKey = event.dataTransfer.getData('text/plain');
    this.setSelfAssessmentRating(traitKey, rating);
  }

  setSelfAssessmentRating(traitKey, rating) {
    const trait = this.getModule22Traits().find(item => item.key === traitKey);
    if (!trait || !Number.isInteger(rating) || rating < 1 || rating > 5) {
      window.app?.showToast('Choose a rating from 1 to 5 for a listed characteristic.', 'warning');
      return;
    }

    this.selfAssessmentRatings[traitKey] = rating;
    const state = this.getState();
    state.module22Ratings = Object.assign({}, state.module22Ratings, { [traitKey]: rating });
    this.saveState();
    document.querySelectorAll(`[data-assessment-key="${traitKey}"]`).forEach(button => {
      button.classList.toggle('active', Number(button.dataset.rating) === rating);
      button.setAttribute('aria-pressed', String(Number(button.dataset.rating) === rating));
    });
    if (window.soundEngine?.playClick) window.soundEngine.playClick();
  }

  submitSelfAssessment() {
    const state = this.getState();
    const ratings = Object.assign({}, state.module22Ratings, this.selfAssessmentRatings);
    const traits = this.getModule22Traits();
    const missing = traits.filter(trait => !Number.isInteger(ratings[trait.key]) || ratings[trait.key] < 1 || ratings[trait.key] > 5);
    if (missing.length > 0) {
      window.app?.showToast(`Please rate all 15 characteristics. ${missing.length} still need a rating.`, 'warning');
      return;
    }

    state.module22Ratings = ratings;
    state.isModule22SelfAssessmentComplete = true;
    state.isClue01Revealed = true;
    state.isWall1Complete = true;
    this.saveState();

    if (window.soundEngine?.playSuccess) window.soundEngine.playSuccess();
    window.app?.showToast('🎉 MODULE 2.2 COMPLETE! Clue 01 is unlocked. Read the clue to find where to go next!', 'reward');

    this.switchKB1Tab('clue01');
  }

  // ============================================================
  // CLUE 01 & PROCEED TO WALL 2 (MANUAL NAVIGATION)
  // ============================================================
  proceedToWall2() {
    this.closeKnowledgeBox1Modal();
    window.app?.showToast('💡 Clue 01 points to Wall 2: Career Simulation Lab. Use the room navigation arrows to proceed!', 'info');
  }

  // ============================================================
  // UI SYNCHRONIZATION HELPERS
  // ============================================================
  syncWallUI() {
    const state = this.getState();

    // Story Cards Highlights
    ['neha', 'sanket', 'adidas'].forEach(k => {
      const el = document.getElementById(`m5-w1-card-${k}`);
      if (el) {
        el.classList.toggle('selected', this.selectedStoryCard === k);
        el.classList.toggle('matched', state.matches[k] !== null);
      }
    });

    // Scanner Pod State
    const scannerEl = document.getElementById('m5-w1-scanner');
    const scannerStatus = document.getElementById('m5-w1-scanner-status');
    if (scannerEl) {
      scannerEl.classList.toggle('active', state.isScannerActive);
      if (scannerStatus) {
        scannerStatus.textContent = state.isScannerActive ? 'SCAN COMPLETE — ENTREPRENEURIAL MINDSET DETECTED' : 'STANDBY';
      }
    }

    // Knowledge Box 1 State
    const kb1El = document.getElementById('m5-w1-kb1');
    const kb1Badge = document.getElementById('m5-w1-kb1-badge');
    if (kb1El) {
      kb1El.classList.toggle('unlocked', state.isKnowledgeBox1Unlocked);
      if (kb1Badge) {
        kb1Badge.textContent = state.isKnowledgeBox1Unlocked ? '🔓 UNLOCKED' : '🔒 LOCKED';
        kb1Badge.className = state.isKnowledgeBox1Unlocked ? 'm5-kb1-badge unlocked' : 'm5-kb1-badge locked';
      }
    }

    // Clue 01 Indicator on Wall 1: Per user requirement, do NOT present banner on Wall 1
    const clueBanner = document.getElementById('m5-w1-clue-banner');
    if (clueBanner) {
      clueBanner.style.display = 'none';
    }

    // Console Screen State on Wall 1
    const consoleBadge = document.getElementById('m5-w1-console-status');
    if (consoleBadge) {
      consoleBadge.textContent = state.isPuzzleComplete ? '✓ SCAN READY' : 'SCAN & MATCH';
    }
  }

  syncConsoleModal() {
    const state = this.getState();
    const matches = state.matches || {};
    const keys = ['neha', 'sanket', 'adidas'];

    keys.forEach(k => {
      const selectEl = document.getElementById(`m5-console-select-${k}`);
      if (!selectEl) return;

      let val = matches[k] || '';
      if (val === 'broom') val = 'cleaning';
      if (val === 'mic') val = 'voice';

      selectEl.value = val;
      selectEl.disabled = state.isPuzzleComplete;

      // Keep all options enabled so player is never deadlocked when changing choices
      Array.from(selectEl.options).forEach(opt => {
        opt.disabled = false;
        if (opt.dataset && opt.dataset.baseText) {
          opt.text = opt.dataset.baseText;
        } else if (opt.text.includes('(In Use)')) {
          opt.text = opt.text.replace(/\s*\(In Use\)$/, '');
        }
      });
    });

    const submitBtn = document.getElementById('m5-console-submit-btn');
    if (submitBtn) {
      submitBtn.disabled = state.isPuzzleComplete;
      if (state.isPuzzleComplete) {
        submitBtn.textContent = '✓ SCAN COMPLETE & VERIFIED';
      } else {
        submitBtn.textContent = 'SUBMIT MATCHES';
      }
    }

    const resetBtn = document.getElementById('m5-console-reset-btn');
    if (resetBtn) {
      resetBtn.disabled = state.isPuzzleComplete;
    }
  }

  syncKB1Modal(scrollToQuiz = false) {
    const state = this.getState();

    // Tab buttons active states
    document.querySelectorAll('.m5-kb-tab-btn').forEach(btn => {
      const tab = btn.dataset.tab;
      btn.classList.toggle('active', this.activeModule === tab);

      // Lock badges on tabs
      const lockBadge = btn.querySelector('.tab-lock-indicator');
      if (lockBadge) {
        if (tab === '2.2') {
          const isUnlocked = state.isPuzzle2Complete;
          const isCompleted = state.isModule22QuizPassed && this.hasCompletedModule22SelfAssessment(state);
          lockBadge.textContent = isCompleted ? '✓' : (isUnlocked ? '🔓' : '🔒');
        } else if (tab === 'puzzle2') {
          const isUnlocked = state.isScannerActive || state.isPuzzleComplete;
          lockBadge.textContent = state.isPuzzle2Complete ? '✓' : (isUnlocked ? '🔓' : '🔒');
        } else if (tab === 'clue01') {
          lockBadge.textContent = this.hasCompletedModule22SelfAssessment(state) ? '🌟' : '🔒';
        }
      }
    });

    // Views visibility
    const v21 = document.getElementById('m5-kb-view-21');
    const vPuz2 = document.getElementById('m5-kb-view-puzzle2');
    const v22 = document.getElementById('m5-kb-view-22');
    const vClue01 = document.getElementById('m5-kb-view-clue01');

    if (v21) v21.style.display = (this.activeModule === '2.1') ? 'block' : 'none';
    if (vPuz2) vPuz2.style.display = (this.activeModule === 'puzzle2') ? 'block' : 'none';
    if (v22) v22.style.display = (this.activeModule === '2.2') ? 'block' : 'none';
    if (vClue01) vClue01.style.display = (this.activeModule === 'clue01') ? 'block' : 'none';

    // Sync Section inside 2.1
    if (this.activeModule === '2.1') {
      const isMediaDone = state.completedModule21MediaIds.includes('media_2_1');
      const quizSection = document.getElementById('m5-q21-section');
      const actSection = document.getElementById('m5-act21-section');
      const mediaBadge = document.getElementById('m5-media21-status');

      if (mediaBadge) {
        mediaBadge.textContent = isMediaDone ? '✓ COMPLETED' : 'INCOMPLETE';
        mediaBadge.className = isMediaDone ? 'm5-status-badge completed' : 'm5-status-badge pending';
      }

      if (quizSection) quizSection.style.display = isMediaDone ? 'block' : 'none';
      if (actSection) actSection.style.display = state.isModule21QuizPassed ? 'block' : 'none';

      if (isMediaDone) this.renderQ21Question();
      if (state.isModule21QuizPassed) this.renderActivity21();
      if (scrollToQuiz && isMediaDone) {
        this.scrollToUnlockedQuiz(quizSection);
      }
    }

    // Sync Section inside Puzzle 2
    if (this.activeModule === 'puzzle2') {
      ['A', 'B', 'C'].forEach(t => {
        const tileEl = document.getElementById(`m5-tile-${t}`);
        if (tileEl) {
          tileEl.classList.toggle('selected', this.puzzle2Selections[t]);
        }
      });
      const puz2Btn = document.getElementById('m5-puzzle2-submit-btn');
      if (puz2Btn && state.isPuzzle2Complete) {
        puz2Btn.textContent = '✓ MINDSET CONFIRMED (COMPLETE)';
        puz2Btn.disabled = true;
      }
    }

    // Sync Section inside 2.2
    if (this.activeModule === '2.2') {
      const isMediaDone = state.completedModule22MediaIds.includes('media_2_2');
      const quizSection = document.getElementById('m5-q22-section');
      const assessSection = document.getElementById('m5-assess22-section');
      const mediaBadge = document.getElementById('m5-media22-status');
      const quizLink = document.getElementById('m5-q22-jump-link');

      if (mediaBadge) {
        mediaBadge.textContent = isMediaDone ? '✓ COMPLETED' : 'INCOMPLETE';
        mediaBadge.className = isMediaDone ? 'm5-status-badge completed' : 'm5-status-badge pending';
      }

      if (quizLink) quizLink.style.display = isMediaDone ? 'inline-flex' : 'none';
      if (quizSection) quizSection.style.display = isMediaDone ? 'block' : 'none';
      if (assessSection) assessSection.style.display = state.isModule22QuizPassed ? 'block' : 'none';

      if (isMediaDone) this.renderQ22Question();
      if (state.isModule22QuizPassed) this.renderSelfAssessment();
      if (scrollToQuiz && isMediaDone) {
        this.scrollToUnlockedQuiz(quizSection);
      }
    }
  }

  renderQ21Question() {
    const container = document.getElementById('m5-q21-content');
    if (!container) return;

    const quizList = this.getModule21QuizData();
    const state = this.getState();

    // 1. If passed, show passed box
    if (state.isModule21QuizPassed) {
      container.innerHTML = `
        <div class="m5-quiz-passed-box">
          <div class="m5-quiz-score-badge">✓ PASSED (${state.module21QuizScore}/5)</div>
          <h4>MODULE 2.1 KNOWLEDGE CHECK COMPLETED</h4>
          <p>You have demonstrated strong understanding of ownership, initiative, and problem-solving.</p>
          <div style="display: flex; gap: 10px; justify-content: center; margin-top: 14px;">
            <button class="btn btn-outline" onclick="window.module5Wall1.retryQ21Quiz()">↺ Review / Retake Quiz</button>
          </div>
        </div>
      `;
      return;
    }

    // 2. If finished but NOT passed, show failed box with big Reset button
    if (this.q21Finished) {
      const score = state.module21QuizScore || 0;
      container.innerHTML = `
        <div class="m5-quiz-failed-box">
          <div class="m5-quiz-score-badge error">⚠️ SCORE: ${score}/5 (NOT PASSED)</div>
          <h4>Passing Criteria: Minimum 4 / 5 Required</h4>
          <p>You need at least 4 correct answers to unlock the next activity. Reset and retake the quiz to try again!</p>
          <div style="display: flex; gap: 12px; justify-content: center; margin-top: 18px;">
            <button class="btn btn-primary btn-gold" style="padding: 12px 28px; font-weight: 800; font-size: 14px;" onclick="window.module5Wall1.retryQ21Quiz()">
              ↺ RESET & RETAKE QUIZ
            </button>
          </div>
        </div>
      `;
      return;
    }

    // 3. Otherwise show active question with Reset button in header
    const q = quizList[this.q21CurrentIndex];
    const userSelected = this.q21Answers[q.id];
    const isSubmitted = this.q21Submitted[q.id] || false;
    const isCorrect = (userSelected === q.correct);

    let optionsHtml = q.options.map((opt, idx) => {
      let optClass = 'm5-quiz-opt';
      if (userSelected === idx) optClass += ' selected';
      if (isSubmitted) {
        if (idx === q.correct) optClass += ' correct';
        else if (userSelected === idx) optClass += ' incorrect';
      }

      return `
        <div class="${optClass}" onclick="window.module5Wall1.selectQ21Option(${idx})">
          <span class="m5-opt-radio">${userSelected === idx ? '●' : '○'}</span>
          <span class="m5-opt-text">${opt}</span>
        </div>
      `;
    }).join('');

    let feedbackHtml = '';
    if (isSubmitted) {
      feedbackHtml = `
        <div class="m5-quiz-feedback ${isCorrect ? 'correct' : 'incorrect'}">
          ${isCorrect ? '✓ ' + q.feedbackCorrect : '❌ ' + q.feedbackIncorrect}
        </div>
      `;
    }

    container.innerHTML = `
      <div class="m5-quiz-header-row">
        <div>
          <span class="m5-quiz-step">QUESTION ${this.q21CurrentIndex + 1} OF ${quizList.length}</span>
          <span class="m5-quiz-sublabel" style="margin-left: 10px;">Pass requirement: 4/5</span>
        </div>
        <button class="btn btn-outline btn-sm" style="font-size: 11px; padding: 4px 10px;" onclick="window.module5Wall1.retryQ21Quiz()" title="Reset all answers and start from Question 1">
          ↺ Reset Quiz
        </button>
      </div>
      <div class="m5-quiz-question">${q.question}</div>
      <div class="m5-quiz-options-list">${optionsHtml}</div>
      ${feedbackHtml}
      <div class="m5-quiz-actions">
        ${!isSubmitted 
          ? `<button class="btn btn-primary" onclick="window.module5Wall1.submitQ21Answer()">Submit Answer</button>`
          : `<button class="btn btn-primary" onclick="window.module5Wall1.nextQ21Question()">${this.q21CurrentIndex < quizList.length - 1 ? 'Next Question →' : 'Finish Quiz'}</button>`
        }
      </div>
    `;
  }

  renderActivity21() {
    const container = document.getElementById('m5-act21-content');
    if (!container) return;

    const list = this.getModule21OriginalActivityData();
    const state = this.getState();
    const isComplete = state.completedModule21ActivityIds.length >= 3;

    if (isComplete) {
      container.innerHTML = `
        <div class="m5-act-complete-box">
          <div class="m5-complete-badge">🌟 MODULE 2.1 COMPLETE</div>
          <h4>Inspiring Stories Trait Analysis Verified</h4>
          <p>You have connected real-world founder actions with ownership, creativity, and resilience.</p>
          <button class="btn btn-primary" onclick="window.module5Wall1.switchKB1Tab('puzzle2')">Proceed to Transition Puzzle 2 →</button>
        </div>
      `;
      return;
    }

    let itemsHtml = list.map(item => {
      const selected = this.activity21Answers[item.id];
      let optionsHtml = item.options.map((opt, idx) => `
        <label class="m5-act-opt ${selected === idx ? 'selected' : ''}">
          <input type="radio" name="act_${item.id}" value="${idx}" ${selected === idx ? 'checked' : ''} onchange="window.module5Wall1.selectActivity21Option(${item.id}, ${idx})" />
          <span>${opt}</span>
        </label>
      `).join('');

      return `
        <div class="m5-act-card">
          <div class="m5-act-founder">${item.founder}</div>
          <div class="m5-act-scenario">${item.scenario}</div>
          <div class="m5-act-question">${item.question}</div>
          <div class="m5-act-options">${optionsHtml}</div>
        </div>
      `;
    }).join('');

    container.innerHTML = `
      ${itemsHtml}
      <div class="m5-act-actions">
        <button class="btn btn-primary" onclick="window.module5Wall1.submitActivity21()">Submit Trait Analysis</button>
      </div>
    `;
  }

  renderQ22Question() {
    const container = document.getElementById('m5-q22-content');
    if (!container) return;

    const quizList = this.getModule22QuizData();
    const state = this.getState();

    // 1. If passed, show success banner and review option
    if (state.isModule22QuizPassed) {
      container.innerHTML = `
        <div class="m5-quiz-passed-box">
          <div class="m5-quiz-score-badge">✓ PASSED (${state.module22QuizScore}/5)</div>
          <h4>MODULE 2.2 KNOWLEDGE CHECK COMPLETED</h4>
          <p>You have demonstrated comprehensive understanding of developing entrepreneurial traits.</p>
          <div style="display: flex; gap: 10px; justify-content: center; margin-top: 14px;">
            <button class="btn btn-outline" onclick="window.module5Wall1.retryQ22Quiz()">↺ Review / Retake Quiz</button>
          </div>
        </div>
      `;
      return;
    }

    // 2. If finished but NOT passed, show failed box with big Reset button
    if (this.q22Finished) {
      const score = state.module22QuizScore || 0;
      container.innerHTML = `
        <div class="m5-quiz-failed-box">
          <div class="m5-quiz-score-badge error">⚠️ SCORE: ${score}/5 (NOT PASSED)</div>
          <h4>Passing Criteria: Minimum 4 / 5 Required</h4>
          <p>You need at least 4 correct answers to unlock the 15-characteristic activity. Reset and retake the quiz to try again!</p>
          <div style="display: flex; gap: 12px; justify-content: center; margin-top: 18px;">
            <button class="btn btn-primary btn-gold" style="padding: 12px 28px; font-weight: 800; font-size: 14px;" onclick="window.module5Wall1.retryQ22Quiz()">
              ↺ RESET & RETAKE QUIZ
            </button>
          </div>
        </div>
      `;
      return;
    }

    // 3. Otherwise show active question with Reset button in header
    const q = quizList[this.q22CurrentIndex];
    const userSelected = this.q22Answers[q.id];
    const isSubmitted = this.q22Submitted[q.id] || false;
    const isCorrect = (userSelected === q.correct);

    let optionsHtml = q.options.map((opt, idx) => {
      let optClass = 'm5-quiz-opt';
      if (userSelected === idx) optClass += ' selected';
      if (isSubmitted) {
        if (idx === q.correct) optClass += ' correct';
        else if (userSelected === idx) optClass += ' incorrect';
      }

      return `
        <div class="${optClass}" onclick="window.module5Wall1.selectQ22Option(${idx})">
          <span class="m5-opt-radio">${userSelected === idx ? '●' : '○'}</span>
          <span class="m5-opt-text">${opt}</span>
        </div>
      `;
    }).join('');

    let feedbackHtml = '';
    if (isSubmitted) {
      feedbackHtml = `
        <div class="m5-quiz-feedback ${isCorrect ? 'correct' : 'incorrect'}">
          ${isCorrect ? '✓ ' + q.feedbackCorrect : '❌ ' + q.feedbackIncorrect}
        </div>
      `;
    }

    container.innerHTML = `
      <div class="m5-quiz-header-row">
        <div>
          <span class="m5-quiz-step">QUESTION ${this.q22CurrentIndex + 1} OF ${quizList.length}</span>
          <span class="m5-quiz-sublabel" style="margin-left: 10px;">Pass requirement: 4/5</span>
        </div>
        <button class="btn btn-outline btn-sm" style="font-size: 11px; padding: 4px 10px;" onclick="window.module5Wall1.retryQ22Quiz()" title="Reset all answers and start from Question 1">
          ↺ Reset Quiz
        </button>
      </div>
      <div class="m5-quiz-question">${q.question}</div>
      <div class="m5-quiz-options-list">${optionsHtml}</div>
      ${feedbackHtml}
      <div class="m5-quiz-actions">
        ${!isSubmitted 
          ? `<button class="btn btn-primary" onclick="window.module5Wall1.submitQ22Answer()">Submit Answer</button>`
          : `<button class="btn btn-primary" onclick="window.module5Wall1.nextQ22Question()">${this.q22CurrentIndex < quizList.length - 1 ? 'Next Question →' : 'Finish Quiz'}</button>`
        }
      </div>
    `;
  }

  renderSelfAssessment() {
    const container = document.getElementById('m5-assess22-content');
    if (!container) return;

    const state = this.getState();
    const savedRatings = state.module22Ratings || {};
    this.selfAssessmentRatings = Object.assign({}, savedRatings);
    const isComplete = this.hasCompletedModule22SelfAssessment(state);

    if (state.isModule22SelfAssessmentComplete && !isComplete) {
      state.isModule22SelfAssessmentComplete = false;
      state.isClue01Revealed = false;
      state.isWall1Complete = false;
      this.saveState();
    }

    if (isComplete) {
      container.innerHTML = `
        <div class="m5-act-complete-box">
          <div class="m5-complete-badge">🌟 15 CHARACTERISTICS RANKED</div>
          <h4>Finding the Entrepreneur in You — Activity Complete</h4>
          <p>Your ratings are saved. Clue 01 is unlocked.</p>
          <button class="btn btn-gold" onclick="window.module5Wall1.switchKB1Tab('clue01')">View Clue 01 & Next Wall →</button>
        </div>
      `;
      return;
    }

    const scaleLabels = [
      { val: 1, text: '1: Not really me' },
      { val: 2, text: '2: Kinda starting' },
      { val: 3, text: '3: I’ve got this sometimes' },
      { val: 4, text: '4: For sure, I\'m this' },
      { val: 5, text: '5: This is totally me' }
    ];

    const traits = this.getModule22Traits();

    let traitsHtml = traits.map(t => {
      const curRating = this.selfAssessmentRatings[t.key];
      let scaleButtons = scaleLabels.map(s => `
        <button type="button" class="m5-scale-btn ${curRating === s.val ? 'active' : ''}" data-assessment-key="${t.key}" data-rating="${s.val}" aria-pressed="${curRating === s.val}" aria-label="${t.title}: ${s.text}" ondragover="event.preventDefault()" ondrop="window.module5Wall1.dropTraitRating(event, ${s.val})" onclick="window.module5Wall1.setSelfAssessmentRating('${t.key}', ${s.val})">
          <span class="scale-num">${s.val}</span>
          <span class="scale-label">${s.text.slice(s.text.indexOf(':') + 1).trim()}</span>
        </button>
      `).join('');

      return `
        <div class="m5-assessment-row">
          <div class="m5-trait-header">
            <span class="m5-trait-name" draggable="true" ondragstart="window.module5Wall1.startTraitDrag(event, '${t.key}')">${t.title}</span>
          </div>
          <div class="m5-scale-group">${scaleButtons}</div>
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <div class="m5-assessment-instruction">
        Drag each characteristic onto its 1–5 rating, or choose a rating in its row. Complete all 15 to unlock Clue 01.
      </div>
      <div class="m5-assessment-scale-legend">
        <span>1 — Not really me</span> • <span>2 — Kinda starting</span> • <span>3 — I’ve got this sometimes</span> • <span>4 — For sure, I’m this</span> • <span>5 — This is totally me</span>
      </div>
      <div class="m5-assessment-list">${traitsHtml}</div>
      <div class="m5-assessment-actions">
        <button class="btn btn-gold" onclick="window.module5Wall1.submitSelfAssessment()">Submit 15 Ratings & Unlock Clue 01</button>
      </div>
    `;
  }
}

window.module5Wall1 = new Module5Wall1Controller();
