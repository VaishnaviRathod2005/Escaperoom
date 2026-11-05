/**
 * ACADEMY ESCAPE ROOM — MODULE 5: THE ENTREPRENEURIAL LAB
 * Wall 3 Controller: Real-World Entrepreneurship Simulator
 * Comprehensive Implementation for Module 2.4 + Module 2.5
 */

class Module5Wall3Controller {
  constructor() {
    this.stations = [
      {
        id: 'rideshare',
        charId: 'shubham',
        charName: 'Subham',
        stationName: 'Rideshare Station',
        label: 'RIDESHARE — SUBHAM',
        color: '#3b82f6',
        icon: '🚗',
        desc: 'A shared-cab situation where an everyday transportation need presents an opportunity.'
      },
      {
        id: 'cafeteria',
        charId: 'tanvi',
        charName: 'Tanvi',
        stationName: 'Cafeteria Station',
        label: 'CAFETERIA — TANVI',
        color: '#f97316',
        icon: '🍱',
        desc: 'A cafeteria situation involving a menu or customer feedback.'
      },
      {
        id: 'tutor',
        charId: 'nikhil',
        charName: 'Nikhil',
        stationName: 'Tutor Station',
        label: 'TUTOR — NIKHIL',
        color: '#22c55e',
        icon: '📚',
        desc: 'A part-time tutoring situation involving the opportunity to organize or outsource work.'
      },
      {
        id: 'gaming',
        charId: 'anushka',
        charName: 'Anshika',
        stationName: 'Gaming Station',
        label: 'GAMING — ANSHIKA',
        color: '#a855f7',
        icon: '🎮',
        desc: 'A gaming-guild situation connected with learning business practices through an everyday interest.'
      },
      {
        id: 'cycle',
        charId: 'karan',
        charName: 'Karan',
        stationName: 'Cycle Repair Station',
        label: 'CYCLE REPAIR — KARAN',
        color: '#06b6d4',
        icon: '🚲',
        desc: 'A broken-cycle situation that may reveal an opportunity to solve an everyday problem.'
      }
    ];

    // Puzzle 1 State: Connect the Situation
    this.selectedChar = null;
    this.selectedStation = null;
    this.puzzleMatches = {
      shubham: null,
      tanvi: null,
      nikhil: null,
      anushka: null,
      karan: null
    };

    // Knowledge Box 3 Tabs & Player
    this.kb3ActiveTab = 'm24_podcast'; // 'm24_podcast' | 'm24_discussion' | 'm24_quiz' | 'progress'
    this.podcast25ActiveTab = 'm25_podcast'; // 'm25_podcast' | 'm25_discussion' | 'm25_quiz' | 'progress'
    
    // Audio/Video Simulators
    this.media24 = { isPlaying: false, currentTime: 0, duration: 180, interval: null };
    this.media25 = { isPlaying: false, currentTime: 0, duration: 180, interval: null };

    // Quiz 2.4 State
    this.q24Index = 0;
    this.q24Answers = {};
    this.q24Submitted = {};

    // Quiz 2.5 State
    this.q25Index = 0;
    this.q25Answers = {};
    this.q25Submitted = {};
  }

  getState() {
    if (!window.module5State?.state) {
      return {
        stationMatches: {},
        isMatchingPuzzleComplete: false,
        isSimulatorActivated: false,
        isKnowledgeBox3Unlocked: false,
        module24: { isPodcastComplete: false, isDiscussionGuideReviewed: false, quizScore: 0, quizPassed: false, isComplete: false },
        module25: { isPodcastComplete: false, discussionQuestionsReviewed: [false, false, false], discussionPointerSelections: [[false, false, false], [false, false, false], [false, false, false]], isDiscussionGuideReviewed: false, quizScore: 0, quizPassed: false, isComplete: false },
        isWall3Complete: false,
        isFinalClueRevealed: false,
        isWall4Unlocked: false
      };
    }
    if (!window.module5State.state.wall3) {
      window.module5State.state.wall3 = {
        stationMatches: {},
        isMatchingPuzzleComplete: false,
        isSimulatorActivated: false,
        isKnowledgeBox3Unlocked: false,
        module24: { isPodcastComplete: false, isDiscussionGuideReviewed: false, quizScore: 0, quizPassed: false, isComplete: false },
        module25: { isPodcastComplete: false, discussionQuestionsReviewed: [false, false, false], discussionPointerSelections: [[false, false, false], [false, false, false], [false, false, false]], isDiscussionGuideReviewed: false, quizScore: 0, quizPassed: false, isComplete: false },
        isWall3Complete: false,
        isFinalClueRevealed: false,
        isWall4Unlocked: false
      };
    }
    const state = window.module5State.state.wall3;
    state.module25 = Object.assign({
      isPodcastComplete: false,
      discussionQuestionsReviewed: [false, false, false],
      discussionPointerSelections: [[false, false, false], [false, false, false], [false, false, false]],
      isDiscussionGuideReviewed: false,
      quizScore: 0,
      quizPassed: false,
      isComplete: false
    }, state.module25 || {});
    state.module25.discussionQuestionsReviewed = Array.isArray(state.module25.discussionQuestionsReviewed)
      ? state.module25.discussionQuestionsReviewed.slice(0, 3)
      : [false, false, false];
    while (state.module25.discussionQuestionsReviewed.length < 3) {
      state.module25.discussionQuestionsReviewed.push(false);
    }
    state.module25.discussionPointerSelections = Array.from({ length: 3 }, (_, questionIndex) => {
      const selections = state.module25.discussionPointerSelections?.[questionIndex];
      return Array.from({ length: 3 }, (_, pointerIndex) => Boolean(selections?.[pointerIndex]));
    });
    return state;
  }

  saveState() {
    if (window.module5State?.save) {
      window.module5State.save();
    }
  }

  // ============================================================
  // OBJECT A: 5 ENTREPRENEURSHIP STATIONS (INFO POPUP)
  // ============================================================
  openStationModal(stationId) {
    const station = this.stations.find(s => s.id === stationId);
    if (!station) return;

    const modal = document.getElementById('m5-w3-station-modal');
    if (!modal) return;

    const titleEl = document.getElementById('m5-w3-station-title');
    const badgeEl = document.getElementById('m5-w3-station-badge');
    const descEl = document.getElementById('m5-w3-station-desc');
    const charEl = document.getElementById('m5-w3-station-char');
    const selectBtn = document.getElementById('m5-w3-station-select-btn');

    if (titleEl) titleEl.textContent = station.stationName;
    if (badgeEl) {
      badgeEl.textContent = station.label;
      badgeEl.style.borderColor = station.color;
      badgeEl.style.color = station.color;
    }
    if (descEl) descEl.textContent = `"${station.desc}"`;
    if (charEl) charEl.textContent = `Focus Person: ${station.charName} (${station.icon})`;

    if (selectBtn) {
      selectBtn.onclick = () => {
        this.closeStationModal();
        this.openPuzzleModal(station.id);
      };
    }

    modal.classList.add('active');
    modal.style.display = 'flex';
    if (window.soundEngine?.playClick) window.soundEngine.playClick();
  }

  closeStationModal() {
    const modal = document.getElementById('m5-w3-station-modal');
    if (modal) {
      modal.classList.remove('active');
      modal.style.display = 'none';
    }
  }

  // ============================================================
  // OBJECT B / PUZZLE 1: CONNECT THE SITUATION
  // ============================================================
  openPuzzleModal(preselectedStationId = null) {
    const state = this.getState();
    const modal = document.getElementById('m5-w3-puzzle-modal');
    if (!modal) return;

    // Load saved or initialize matches
    if (state.stationMatches && Object.keys(state.stationMatches).length > 0) {
      this.puzzleMatches = Object.assign({}, state.stationMatches);
    }

    this.selectedChar = null;
    this.selectedStation = preselectedStationId || null;

    modal.classList.add('active');
    modal.style.display = 'flex';
    this.renderPuzzleUI();
    if (window.soundEngine?.playClick) window.soundEngine.playClick();
  }

  closePuzzleModal() {
    const modal = document.getElementById('m5-w3-puzzle-modal');
    if (modal) {
      modal.classList.remove('active');
      modal.style.display = 'none';
    }
  }

  selectPuzzleChar(charId) {
    this.selectedChar = (this.selectedChar === charId) ? null : charId;
    if (this.selectedChar && this.selectedStation) {
      this.pairSelectedCharAndStation();
    } else {
      this.renderPuzzleUI();
    }
    if (window.soundEngine?.playClick) window.soundEngine.playClick();
  }

  selectPuzzleStation(stationId) {
    this.selectedStation = (this.selectedStation === stationId) ? null : stationId;
    if (this.selectedChar && this.selectedStation) {
      this.pairSelectedCharAndStation();
    } else {
      this.renderPuzzleUI();
    }
    if (window.soundEngine?.playClick) window.soundEngine.playClick();
  }

  pairSelectedCharAndStation() {
    if (!this.selectedChar || !this.selectedStation) return;

    // If station was already assigned to another char, unassign it
    Object.keys(this.puzzleMatches).forEach(c => {
      if (this.puzzleMatches[c] === this.selectedStation) {
        this.puzzleMatches[c] = null;
      }
    });

    this.puzzleMatches[this.selectedChar] = this.selectedStation;
    this.selectedChar = null;
    this.selectedStation = null;

    const state = this.getState();
    state.stationMatches = Object.assign({}, this.puzzleMatches);
    this.saveState();

    this.renderPuzzleUI();
    if (window.soundEngine?.playClick) window.soundEngine.playClick();
  }

  removePuzzlePair(charId) {
    this.puzzleMatches[charId] = null;
    const state = this.getState();
    state.stationMatches = Object.assign({}, this.puzzleMatches);
    this.saveState();
    this.renderPuzzleUI();
    if (window.soundEngine?.playClick) window.soundEngine.playClick();
  }

  resetPuzzle() {
    this.selectedChar = null;
    this.selectedStation = null;
    this.puzzleMatches = {
      shubham: null,
      tanvi: null,
      nikhil: null,
      anushka: null,
      karan: null
    };
    const state = this.getState();
    state.stationMatches = Object.assign({}, this.puzzleMatches);
    this.saveState();
    this.renderPuzzleUI();
    window.app?.showToast('Selections reset. Connect each person to a situation.', 'info');
  }

  submitPuzzle() {
    const state = this.getState();
    const correctMap = {
      shubham: 'rideshare',
      tanvi: 'cafeteria',
      nikhil: 'tutor',
      anushka: 'gaming',
      karan: 'cycle'
    };

    // 1. Check completeness
    const totalAssigned = Object.values(this.puzzleMatches).filter(Boolean).length;
    if (totalAssigned < 5) {
      if (window.soundEngine?.playError) window.soundEngine.playError();
      window.app?.showToast(`⚠️ Please connect all 5 people (${totalAssigned}/5 connected) before submitting.`, 'warning');
      return;
    }

    // 2. Validate matches
    let correctCount = 0;
    const errors = [];
    Object.entries(correctMap).forEach(([char, correctStation]) => {
      if (this.puzzleMatches[char] === correctStation) {
        correctCount++;
      } else {
        errors.push(char);
      }
    });

    const statusBanner = document.getElementById('m5-w3-puzzle-status');
    if (correctCount < 5) {
      if (window.soundEngine?.playError) window.soundEngine.playError();
      window.app?.showToast(`Pattern mismatch: ${correctCount}/5 connections correct. Review highlighted pairs and adjust!`, 'warning');
      if (statusBanner) {
        statusBanner.className = 'm5-puzzle-status-bar error';
        statusBanner.innerHTML = `<span>⚠️ ${correctCount}/5 CONNECTIONS CORRECT — ADJUST HIGHLIGHTED MISMATCHES</span>`;
      }
      this.renderPuzzleUI(errors);
      return;
    }

    // 3. Success
    state.isMatchingPuzzleComplete = true;
    state.isSimulatorActivated = true;
    state.isKnowledgeBox3Unlocked = true;
    this.saveState();

    // Award Simulator Token
    window.gameState?.addItem({
      id: 'm5_simulator_token',
      name: 'Simulator Mastery Token',
      icon: '💡',
      type: 'achievement_badge',
      desc: 'Mastered real-world entrepreneurial connections across everyday scenarios.'
    });

    if (window.soundEngine?.playSuccess) window.soundEngine.playSuccess();
    window.app?.showToast('🎉 5/5 CONNECTIONS COMPLETE! Real-World Opportunities Identified.', 'reward');

    this.renderPuzzleUI();
    this.activateSimulator();

    setTimeout(() => {
      this.closePuzzleModal();
      this.showSimulatorActivatedModal();
    }, 1200);
  }

  renderPuzzleUI(errorChars = []) {
    const charsListEl = document.getElementById('m5-w3-puzzle-chars');
    const stationsListEl = document.getElementById('m5-w3-puzzle-stations');
    const connectionsListEl = document.getElementById('m5-w3-puzzle-connections');
    const progressEl = document.getElementById('m5-w3-puzzle-progress-count');

    const assignedCount = Object.values(this.puzzleMatches).filter(Boolean).length;
    if (progressEl) {
      progressEl.textContent = `${assignedCount}/5 CONNECTIONS COMPLETE`;
    }

    // Mixed order list of characters
    const charDefs = [
      { id: 'anushka', name: 'Anshika', trait: 'Gaming community & retention' },
      { id: 'shubham', name: 'Subham', trait: 'Rideshare & commute' },
      { id: 'karan', name: 'Karan', trait: 'Hands-on Repair' },
      { id: 'tanvi', name: 'Tanvi', trait: 'Food & Feedback' },
      { id: 'nikhil', name: 'Nikhil', trait: 'Tutoring & Delegation' }
    ];

    // Mixed order list of stations
    const stationDefs = [
      { id: 'tutor', name: 'TUTOR — NIKHIL', icon: '📚' },
      { id: 'gaming', name: 'GAMING — ANSHIKA', icon: '🎮' },
      { id: 'rideshare', name: 'RIDESHARE — SUBHAM', icon: '🚗' },
      { id: 'cycle', name: 'CYCLE REPAIR — KARAN', icon: '🚲' },
      { id: 'cafeteria', name: 'CAFETERIA — TANVI', icon: '🍱' }
    ];

    if (charsListEl) {
      charsListEl.innerHTML = charDefs.map(c => {
        const isSelected = (this.selectedChar === c.id);
        const assignedStationId = this.puzzleMatches[c.id];
        const isError = errorChars.includes(c.id);
        const assignedStation = stationDefs.find(s => s.id === assignedStationId);

        return `
          <div class="m5-match-card char-card ${isSelected ? 'selected' : ''} ${assignedStationId ? 'assigned' : ''} ${isError ? 'has-error' : ''}"
               onclick="window.module5Wall3.selectPuzzleChar('${c.id}')"
               tabindex="0"
               role="button"
               aria-label="Character ${c.name}">
            <div class="m5-mc-header">
              <span class="m5-mc-name">${c.name}</span>
              ${assignedStation ? `<span class="m5-mc-assigned-badge">${assignedStation.icon} ${assignedStation.name}</span>` : ''}
            </div>
            <span class="m5-mc-trait">${c.trait}</span>
          </div>
        `;
      }).join('');
    }

    if (stationsListEl) {
      stationsListEl.innerHTML = stationDefs.map(s => {
        const isSelected = (this.selectedStation === s.id);
        const assignedCharId = Object.keys(this.puzzleMatches).find(c => this.puzzleMatches[c] === s.id);
        const assignedChar = charDefs.find(c => c.id === assignedCharId);

        return `
          <div class="m5-match-card station-card ${isSelected ? 'selected' : ''} ${assignedCharId ? 'assigned' : ''}"
               onclick="window.module5Wall3.selectPuzzleStation('${s.id}')"
               tabindex="0"
               role="button"
               aria-label="Station ${s.name}">
            <div class="m5-mc-header">
              <span class="m5-mc-icon">${s.icon}</span>
              <span class="m5-mc-name">${s.name}</span>
            </div>
            ${assignedChar ? `<span class="m5-mc-assigned-badge">Connected: ${assignedChar.name}</span>` : '<span class="m5-mc-avail">Available</span>'}
          </div>
        `;
      }).join('');
    }

    if (connectionsListEl) {
      const activePairs = Object.entries(this.puzzleMatches).filter(([c, s]) => !!s);
      if (activePairs.length === 0) {
        connectionsListEl.innerHTML = '<div class="m5-empty-connections">Select a Person and then select a Station to connect them.</div>';
      } else {
        connectionsListEl.innerHTML = activePairs.map(([cId, sId]) => {
          const char = charDefs.find(c => c.id === cId);
          const stn = stationDefs.find(s => s.id === sId);
          const isError = errorChars.includes(cId);

          return `
            <div class="m5-connection-chip ${isError ? 'error-chip' : ''}">
              <span class="m5-cc-text"><strong>${char.name}</strong> ➔ ${stn.icon} ${stn.name}</span>
              <button type="button" class="m5-cc-remove-btn" onclick="window.module5Wall3.removePuzzlePair('${cId}')" title="Disconnect pair">✕</button>
            </div>
          `;
        }).join('');
      }
    }
  }

  // ============================================================
  // OBJECT C: SIMULATOR ACTIVATION & KNOWLEDGE BOX 3
  // ============================================================
  activateSimulator() {
    const overlay = document.getElementById('m5-w3-simulator-glow-overlay');
    if (overlay) overlay.classList.add('active');

    const kb3Chamber = document.getElementById('m5-w3-kb3-chamber');
    if (kb3Chamber) kb3Chamber.classList.add('unlocked');

    const nextStepConsole = document.getElementById('m5-w3-touchscreen-console');
    if (nextStepConsole) nextStepConsole.classList.add('illuminated');

    this.syncWallUI();
  }

  showSimulatorActivatedModal() {
    const modal = document.getElementById('m5-w3-simulator-modal');
    if (modal) {
      modal.classList.add('active');
      modal.style.display = 'flex';
      if (window.soundEngine?.playSuccess) window.soundEngine.playSuccess();
    }
  }

  closeSimulatorModal() {
    const modal = document.getElementById('m5-w3-simulator-modal');
    if (modal) {
      modal.classList.remove('active');
      modal.style.display = 'none';
    }
  }

  clickKnowledgeBox3() {
    const state = this.getState();
    if (!state.isMatchingPuzzleComplete) {
      if (window.soundEngine?.playError) window.soundEngine.playError();
      window.app?.showToast('🔒 Knowledge Box 3 is locked. Complete the Connect the Situation puzzle first.', 'warning');
      this.openPuzzleModal();
      return;
    }
    this.openKnowledgeBox3();
  }

  openKnowledgeBox3(targetTab = null) {
    const state = this.getState();
    if (!state.isMatchingPuzzleComplete) {
      this.clickKnowledgeBox3();
      return;
    }

    if (targetTab && targetTab.startsWith('m25_')) {
      this.openPodcast25Modal(targetTab);
      return;
    }

    if (targetTab) {
      this.kb3ActiveTab = targetTab;
    } else if (!state.module24.isPodcastComplete) {
      this.kb3ActiveTab = 'm24_podcast';
    } else if (!state.module24.quizPassed) {
      this.kb3ActiveTab = 'm24_quiz';
    } else {
      this.kb3ActiveTab = 'm24_podcast';
    }

    const modal = document.getElementById('m5-w3-kb3-modal');
    if (modal) {
      modal.classList.add('active');
      modal.style.display = 'flex';
      this.syncKB3Modal();
      if (window.soundEngine?.playClick) window.soundEngine.playClick();
    }
  }

  closeKB3Modal() {
    this.pauseAudio24();
    const modal = document.getElementById('m5-w3-kb3-modal');
    if (modal) {
      modal.classList.remove('active');
      modal.style.display = 'none';
    }
  }

  switchKB3Tab(tabKey) {
    if (tabKey && tabKey.startsWith('m25_')) {
      this.closeKB3Modal();
      this.openPodcast25Modal(tabKey);
      return;
    }

    if (tabKey === 'm24_quiz' && !this.getState().module24.isPodcastComplete) {
      window.app?.showToast('Watch the Module 2.4 video or select Mark as Read to unlock the quiz.', 'warning');
      return;
    }

    this.pauseAudio24();
    this.kb3ActiveTab = tabKey;
    this.syncKB3Modal();
    if (window.soundEngine?.playClick) window.soundEngine.playClick();
  }

  syncKB3Modal() {
    const modal = document.getElementById('m5-w3-kb3-modal');
    if (modal) {
      modal.querySelectorAll('.m5-w3-tab-btn').forEach(btn => {
        const tab = btn.dataset.tab;
        btn.classList.toggle('active', this.kb3ActiveTab === tab);
      });
    }

    // Toggle Tab Panels for Module 2.4
    const panels = {
      m24_podcast: document.getElementById('m5-w3-panel-m24-podcast'),
      m24_discussion: document.getElementById('m5-w3-panel-m24-discussion'),
      m24_quiz: document.getElementById('m5-w3-panel-m24-quiz'),
      progress: document.getElementById('m5-w3-panel-progress')
    };

    Object.keys(panels).forEach(k => {
      if (panels[k]) {
        panels[k].style.display = (this.kb3ActiveTab === k) ? 'block' : 'none';
      }
    });

    // Update compact progress tracker pills
    this.updateCompactProgressUI();

    // Render respective active views
    if (this.kb3ActiveTab === 'm24_quiz') {
      this.renderQuiz24();
    } else if (this.kb3ActiveTab === 'progress') {
      this.renderProgressDashboard();
    }
  }

  updateCompactProgressUI() {
    const state = this.getState();
    const trackerEl = document.getElementById('m5-w3-compact-tracker');
    if (!trackerEl) return;

    const stages = [
      { name: '1. Matching', done: state.isMatchingPuzzleComplete },
      { name: '2. Video 2.4', done: state.module24.isPodcastComplete },
      { name: '3. Scenario Quiz', done: state.module24.quizPassed }
    ];

    trackerEl.innerHTML = stages.map(s => `
      <div class="m5-compact-step ${s.done ? 'step-done' : ''}">
        <span class="m5-step-indicator">${s.done ? '✓' : '○'}</span>
        <span class="m5-step-label">${s.name}</span>
      </div>
    `).join('<div class="m5-step-connector"></div>');
  }

  // ============================================================
  // OBJECT D / SECOND IMAGE: PODCAST TERMINAL (MODULE 2.5)
  // ============================================================
  clickPodcastScreen25() {
    const state = this.getState();
    if (!state.module24.quizPassed) {
      if (window.soundEngine?.playError) window.soundEngine.playError();
      const lockedModal = document.getElementById('m5-w3-podcast25-locked-modal');
      if (lockedModal) {
        lockedModal.classList.add('active');
        lockedModal.style.display = 'flex';
      } else {
        window.app?.showToast('🔒 Unlock to access your next podcast. Complete Knowledge Box 3 (Module 2.4) first!', 'warning');
      }
      return;
    }
    this.openPodcast25Modal('m25_podcast');
    window.module5Engine?.updateObjectiveText();
  }

  closePodcast25LockedModal() {
    const lockedModal = document.getElementById('m5-w3-podcast25-locked-modal');
    if (lockedModal) {
      lockedModal.classList.remove('active');
      lockedModal.style.display = 'none';
    }
  }

  openPodcast25Modal(targetTab = null) {
    const state = this.getState();
    if (!state.module24.quizPassed) {
      this.clickPodcastScreen25();
      return;
    }

    if (targetTab === 'm25_quiz' && !state.module25.isPodcastComplete) {
      window.app?.showToast('Review the Module 2.5 video before taking its quiz.', 'warning');
      this.podcast25ActiveTab = 'm25_podcast';
    } else if (targetTab === 'm25_quiz' && !state.module25.isDiscussionGuideReviewed) {
      window.app?.showToast('Review the Module 2.5 discussion guide before taking its quiz.', 'warning');
      this.podcast25ActiveTab = 'm25_discussion';
    } else if (targetTab) {
      this.podcast25ActiveTab = targetTab;
    } else if (!state.module25.isPodcastComplete) {
      this.podcast25ActiveTab = 'm25_podcast';
    } else if (!state.module25.isDiscussionGuideReviewed) {
      this.podcast25ActiveTab = 'm25_discussion';
    } else if (!state.module25.quizPassed) {
      this.podcast25ActiveTab = 'm25_quiz';
    } else {
      this.podcast25ActiveTab = 'm25_podcast';
    }

    const modal = document.getElementById('m5-w3-podcast25-modal');
    if (modal) {
      modal.classList.add('active');
      modal.style.display = 'flex';
      this.syncPodcast25Modal();
      if (window.soundEngine?.playClick) window.soundEngine.playClick();
    }
  }

  closePodcast25Modal() {
    this.pauseAudio25();
    const modal = document.getElementById('m5-w3-podcast25-modal');
    if (modal) {
      modal.classList.remove('active');
      modal.style.display = 'none';
    }
  }

  switchPodcast25Tab(tabKey) {
    const module25 = this.getState().module25;
    if (tabKey === 'm25_quiz' && !module25.isPodcastComplete) {
      window.app?.showToast('Review the Module 2.5 video first to unlock the quiz.', 'warning');
      return;
    }
    if (tabKey === 'm25_quiz' && !module25.isDiscussionGuideReviewed) {
      window.app?.showToast('Review all three Module 2.5 discussion questions and mark the guide reviewed before taking the quiz.', 'warning');
      return;
    }

    this.pauseAudio25();
    this.podcast25ActiveTab = tabKey;
    this.syncPodcast25Modal();
    if (window.soundEngine?.playClick) window.soundEngine.playClick();
  }

  syncPodcast25Modal() {
    const modal = document.getElementById('m5-w3-podcast25-modal');
    if (modal) {
      modal.querySelectorAll('.m5-w3-tab-btn').forEach(btn => {
        const tab = btn.dataset.tab;
        btn.classList.toggle('active', this.podcast25ActiveTab === tab);
      });
    }

    // Toggle panels for Module 2.5
    const panels = {
      m25_podcast: document.getElementById('m5-w3-panel-m25-podcast'),
      m25_discussion: document.getElementById('m5-w3-panel-m25-discussion'),
      m25_quiz: document.getElementById('m5-w3-panel-m25-quiz'),
      progress: document.getElementById('m5-w3-panel-progress-25')
    };

    Object.keys(panels).forEach(k => {
      if (panels[k]) {
        panels[k].style.display = (this.podcast25ActiveTab === k) ? 'block' : 'none';
      }
    });

    this.updateCompactProgressUI25();

    if (this.podcast25ActiveTab === 'm25_quiz') {
      this.renderQuiz25();
    } else if (this.podcast25ActiveTab === 'progress') {
      this.renderProgressDashboard25();
    } else if (this.podcast25ActiveTab === 'm25_discussion') {
      this.renderDiscussionGuide25();
    }
  }

  updateCompactProgressUI25() {
    const state = this.getState();
    const trackerEl = document.getElementById('m5-w3-compact-tracker-25');
    if (!trackerEl) return;

    const stages = [
      { name: 'Mod 2.4 Complete', done: state.module24.quizPassed },
      { name: 'Video 2.5', done: state.module25.isPodcastComplete },
      { name: 'Discussion Guide', done: state.module25.isDiscussionGuideReviewed },
      { name: 'Motivation Quiz', done: state.module25.quizPassed },
      { name: 'Wall 3 Complete', done: state.isWall3Complete }
    ];

    trackerEl.innerHTML = stages.map(s => `
      <div class="m5-compact-step ${s.done ? 'step-done' : ''}">
        <span class="m5-step-indicator">${s.done ? '✓' : '○'}</span>
        <span class="m5-step-label">${s.name}</span>
      </div>
    `).join('<div class="m5-step-connector"></div>');
  }

  renderProgressDashboard25() {
    const el = document.getElementById('m5-w3-progress-dashboard-25');
    if (!el) return;
    this.renderProgressDashboard();
    const standardEl = document.getElementById('m5-w3-progress-dashboard');
    if (standardEl) {
      el.innerHTML = standardEl.innerHTML;
    }
  }

  // ============================================================
  // OBJECT D: PODCAST 2.4 — ENTREPRENEURSHIP EVERYDAY!
  // ============================================================
  togglePlayAudio24() {
    if (this.media24.isPlaying) {
      this.pauseAudio24();
    } else {
      this.playAudio24();
    }
  }

  playAudio24() {
    this.media24.isPlaying = true;
    const playBtn = document.getElementById('m5-w3-m24-play-btn');
    if (playBtn) {
      playBtn.innerHTML = '<span>⏸ Pause Video</span>';
      playBtn.classList.add('active-play');
    }

    const screen = document.getElementById('m5-video-screen-24-w3');
    if (screen) screen.classList.add('is-playing');
    const playOverlay = document.getElementById('m5-video-play-btn-24-w3');
    if (playOverlay) playOverlay.textContent = '⏸';
    const statusText = document.getElementById('m5-video-status-text-24-w3');
    if (statusText) statusText.textContent = 'STREAMING VIDEO LECTURE 2.4...';

    clearInterval(this.media24.interval);
    this.media24.interval = setInterval(() => {
      this.media24.currentTime++;
      if (this.media24.currentTime >= this.media24.duration) {
        this.media24.currentTime = this.media24.duration;
        this.pauseAudio24();
        this.confirmMarkAsWatched24();
      }
      this.updateProgressUI24();
    }, 1000);
  }

  pauseAudio24() {
    this.media24.isPlaying = false;
    const playBtn = document.getElementById('m5-w3-m24-play-btn');
    if (playBtn) {
      playBtn.innerHTML = '<span>▶ Play Video</span>';
      playBtn.classList.remove('active-play');
    }

    const screen = document.getElementById('m5-video-screen-24-w3');
    if (screen) screen.classList.remove('is-playing');
    const playOverlay = document.getElementById('m5-video-play-btn-24-w3');
    if (playOverlay) playOverlay.textContent = '▶';
    const statusText = document.getElementById('m5-video-status-text-24-w3');
    if (statusText) statusText.textContent = 'CLICK SCREEN TO PLAY VIDEO';

    clearInterval(this.media24.interval);
  }

  seekAudio24(sec) {
    this.media24.currentTime = Math.max(0, Math.min(this.media24.duration, sec));
    this.updateProgressUI24();
  }

  updateProgressUI24() {
    const curTimeEl = document.getElementById('m5-w3-m24-cur-time');
    const seekbar = document.getElementById('m5-w3-m24-seekbar');
    const format = s => `${Math.floor(s / 60)}:${(s % 60 < 10 ? '0' : '')}${s % 60}`;

    if (curTimeEl) curTimeEl.textContent = format(this.media24.currentTime);
    if (seekbar) seekbar.value = ((this.media24.currentTime / this.media24.duration) * 100).toFixed(1);
  }

  confirmMarkAsWatched24() {
    const state = this.getState();
    state.module24.isPodcastComplete = true;
    this.saveState();
    this.pauseAudio24();
    this.kb3ActiveTab = 'm24_quiz';
    if (window.soundEngine?.playSuccess) window.soundEngine.playSuccess();
    window.app?.showToast('✅ Module 2.4 video complete! Your scenario quiz is ready.', 'reward');
    this.syncKB3Modal();
  }

  markDiscussionGuide24Reviewed() {
    const state = this.getState();
    state.module24.isDiscussionGuideReviewed = true;
    this.saveState();
    if (window.soundEngine?.playSuccess) window.soundEngine.playSuccess();
    window.app?.showToast('✅ Discussion Guide 2.4 reviewed! Unlocked Quiz 2.4.', 'reward');
    this.syncKB3Modal();
  }

  // ============================================================
  // OBJECT E: MODULE 2.4 — ORIGINAL SCENARIO QUIZ (10 MCQs)
  // ============================================================
  getModule24QuizData() {
    return [
      // Scenario 1: The Rideshare Strategist
      {
        id: 'q24_1',
        scenarioNumber: 1,
        scenarioTitle: 'Scenario 1 — The Rideshare Strategist',
        scenarioText: 'Shubham takes a shared cab daily to college. One day, he notices the cab is rarely full. He talks to the driver and offers to help find regular passengers by coordinating a small WhatsApp group of students who live nearby. Over time, the driver saves time, passengers save money, and Shubham gets free rides in return.',
        question: 'Which entrepreneurial trait is best demonstrated in this scenario?',
        options: [
          'Personal branding',
          'Strategic partnership',
          'Financial investment',
          'Solo work ethic'
        ],
        correct: 1, // B
        explanation: 'Shubham formed a mutually beneficial solution with existing resources.'
      },
      {
        id: 'q24_2',
        scenarioNumber: 1,
        scenarioTitle: 'Scenario 1 — The Rideshare Strategist',
        scenarioText: 'Shubham takes a shared cab daily to college. One day, he notices the cab is rarely full. He talks to the driver and offers to help find regular passengers by coordinating a small WhatsApp group of students who live nearby. Over time, the driver saves time, passengers save money, and Shubham gets free rides in return.',
        question: 'What value did Shubham create in this situation?',
        options: [
          'Entertainment for the group',
          'Competitive rivalry among drivers',
          'Win-win convenience for both driver and students',
          'A distraction from academics'
        ],
        correct: 2, // C
        explanation: 'He solved inefficiencies and created ongoing value.'
      },

      // Scenario 2: The Cafeteria Complainer
      {
        id: 'q24_3',
        scenarioNumber: 2,
        scenarioTitle: 'Scenario 2 — The Cafeteria Complainer',
        scenarioText: 'Tanvi dislikes the college cafeteria food. Instead of just complaining, she collects feedback from students and emails the vendor with a survey report and suggestions for change. She even offers to pilot a rotating food menu sourced from home chefs. The vendor agrees to a 1-week trial.',
        question: 'What entrepreneurial behavior did Tanvi show in this case?',
        options: [
          'Risk aversion',
          'Influencing stakeholders for change',
          'Blind optimism',
          'Ignoring norms'
        ],
        correct: 1, // B
        explanation: 'Tanvi leveraged feedback and took initiative to offer an actionable solution.'
      },
      {
        id: 'q24_4',
        scenarioNumber: 2,
        scenarioTitle: 'Scenario 2 — The Cafeteria Complainer',
        scenarioText: 'Tanvi dislikes the college cafeteria food. Instead of just complaining, she collects feedback from students and emails the vendor with a survey report and suggestions for change. She even offers to pilot a rotating food menu sourced from home chefs. The vendor agrees to a 1-week trial.',
        question: 'Which mindset is reflected when she tests her idea with a small trial first?',
        options: [
          'Frugality',
          'Blind scaling',
          'Experimentation and iteration',
          'Avoidance'
        ],
        correct: 2, // C
        explanation: 'She reduced risk by validating her idea on a small scale first.'
      },

      // Scenario 3: The Part-Time Tutor Who Outsourced
      {
        id: 'q24_5',
        scenarioNumber: 3,
        scenarioTitle: 'Scenario 3 — The Part-Time Tutor Who Outsourced',
        scenarioText: 'Nikhil offers tuition to 9th-grade students, but soon has too many inquiries. Rather than turning them down, he recruits two smart classmates, trains them in his method, and shares a portion of the fee with them. He focuses on quality control and parent communication.',
        question: 'What is Nikhil effectively doing in this scenario?',
        options: [
          'Scaling with systems',
          'Focusing on only his own growth',
          'Ignoring student needs',
          'Overcomplicating the service'
        ],
        correct: 0, // A
        explanation: 'He’s using delegation and systems to grow his offering.'
      },
      {
        id: 'q24_6',
        scenarioNumber: 3,
        scenarioTitle: 'Scenario 3 — The Part-Time Tutor Who Outsourced',
        scenarioText: 'Nikhil offers tuition to 9th-grade students, but soon has too many inquiries. Rather than turning them down, he recruits two smart classmates, trains them in his method, and shares a portion of the fee with them. He focuses on quality control and parent communication.',
        question: 'Which entrepreneurial trait is least evident in this story?',
        options: [
          'Team building',
          'Delegation',
          'Networking',
          'Self-reliance'
        ],
        correct: 3, // D
        explanation: 'He is relying on a team and not doing everything himself.'
      },

      // Scenario 4: Gaming Guild Innovator
      {
        id: 'q24_7',
        scenarioNumber: 4,
        scenarioTitle: 'Scenario 4 — Gaming Guild Innovator',
        scenarioText: 'Anushka runs a gaming community where players often quit due to miscommunication. She studies how online platforms manage retention and creates a system of ranks, feedback loops, and digital shoutouts. Player engagement improves, and others start consulting her for community tips.',
        question: 'Anushka’s insight came from observing...',
        options: [
          'Player complaints',
          'School leadership structures',
          'Business practices in unrelated platforms',
          'Game rules only'
        ],
        correct: 2, // C
        explanation: 'She applied cross-domain knowledge to a gaming issue.'
      },
      {
        id: 'q24_8',
        scenarioNumber: 4,
        scenarioTitle: 'Scenario 4 — Gaming Guild Innovator',
        scenarioText: 'Anushka runs a gaming community where players often quit due to miscommunication. She studies how online platforms manage retention and creates a system of ranks, feedback loops, and digital shoutouts. Player engagement improves, and others start consulting her for community tips.',
        question: 'What trait does Anushka most clearly demonstrate?',
        options: [
          'Blind loyalty',
          'Pattern recognition and cross-application',
          'Strict hierarchy',
          'Avoidance of feedback'
        ],
        correct: 1, // B
        explanation: 'She transferred models from one context to another effectively.'
      },

      // Scenario 5: The Broken Cycle Repair Hack
      {
        id: 'q24_9',
        scenarioNumber: 5,
        scenarioTitle: 'Scenario 5 — The Broken Cycle Repair Hack',
        scenarioText: 'Karan notices several cycles left unused in the hostel due to minor faults. He learns basic cycle repair through YouTube, fixes them at low cost, and offers to maintain them monthly for a small fee. Eventually, he sets up a DIY workshop for others to learn and charge nominally for it.',
        question: 'What helped Karan convert a casual observation into a micro-enterprise?',
        options: [
          'Formal training',
          'Investment in ads',
          'Value spotting + upskilling',
          'Borrowing from friends'
        ],
        correct: 2, // C
        explanation: 'He identified a need, learned a skill, and created a service.'
      },
      {
        id: 'q24_10',
        scenarioNumber: 5,
        scenarioTitle: 'Scenario 5 — The Broken Cycle Repair Hack',
        scenarioText: 'Karan notices several cycles left unused in the hostel due to minor faults. He learns basic cycle repair through YouTube, fixes them at low cost, and offers to maintain them monthly for a small fee. Eventually, he sets up a DIY workshop for others to learn and charge nominally for it.',
        question: 'By enabling others to also repair, what did Karan do?',
        options: [
          'Eliminate his customer base',
          'Grow a community-based model',
          'Lose control',
          'Focus only on earnings'
        ],
        correct: 1, // B
        explanation: 'He built capacity in others while still adding value.'
      }
    ];
  }

  selectQ24Option(optIdx) {
    const qList = this.getModule24QuizData();
    const q = qList[this.q24Index];
    if (this.q24Submitted[q.id]) return;

    this.q24Answers[q.id] = optIdx;
    if (window.soundEngine?.playClick) window.soundEngine.playClick();
    this.renderQuiz24();
  }

  submitQ24Answer() {
    const qList = this.getModule24QuizData();
    const q = qList[this.q24Index];
    if (this.q24Answers[q.id] === undefined) {
      window.app?.showToast('Please select an option before submitting.', 'warning');
      return;
    }

    this.q24Submitted[q.id] = true;
    const isCorrect = (this.q24Answers[q.id] === q.correct);
    if (isCorrect) {
      if (window.soundEngine?.playSuccess) window.soundEngine.playSuccess();
    } else {
      if (window.soundEngine?.playError) window.soundEngine.playError();
    }
    this.renderQuiz24();
  }

  nextQ24Question() {
    const qList = this.getModule24QuizData();
    if (this.q24Index < qList.length - 1) {
      this.q24Index++;
      this.renderQuiz24();
    } else {
      this.finishQuiz24();
    }
  }

  finishQuiz24() {
    const qList = this.getModule24QuizData();
    let score = 0;
    qList.forEach(q => {
      if (this.q24Answers[q.id] === q.correct) score++;
    });

    const state = this.getState();
    state.module24.quizScore = score;
    const passed = (score >= 7); // 70% threshold = 7/10

    if (passed) {
      state.module24.quizPassed = true;
      state.module24.isComplete = true;
      this.saveState();

      if (window.soundEngine?.playSuccess) window.soundEngine.playSuccess();
      window.app?.showToast(`🎉 Passed Module 2.4 Quiz (${score}/10)! Module 2.5 is now unlocked.`, 'reward');

      // Trigger Stage 6: Unlock Motivation Core Learning Console
      this.activateModule25UnlockedEffect();
    } else {
      state.module24.quizPassed = false;
      this.saveState();
      if (window.soundEngine?.playError) window.soundEngine.playError();
      window.app?.showToast(`Score: ${score}/10. Need at least 7/10 (70%) to pass. Please reset and try again!`, 'warning');
    }

    this.renderQuiz24();
    if (passed) {
      this.closeKB3Modal();
      window.module5Engine?.updateObjectiveText();
    }
  }

  retryQ24Quiz() {
    this.q24Index = 0;
    this.q24Answers = {};
    this.q24Submitted = {};
    this.renderQuiz24();
    window.app?.showToast('Quiz 2.4 reset. Choose your answer for Question 1.', 'info');
  }

  renderQuiz24() {
    const container = document.getElementById('m5-w3-quiz24-container');
    if (!container) return;

    const qList = this.getModule24QuizData();
    const q = qList[this.q24Index];
    const isSubmitted = !!this.q24Submitted[q.id];
    const userSelected = this.q24Answers[q.id];
    const allAnswered = Object.keys(this.q24Submitted).length >= qList.length;

    if (allAnswered && !this.q24Submitted[qList[this.q24Index].id]) {
      // Completed state
    }

    const state = this.getState();

    let optionsHtml = q.options.map((opt, idx) => {
      let optClass = 'm5-quiz-opt';
      if (userSelected === idx) optClass += ' selected';
      if (isSubmitted) {
        if (idx === q.correct) optClass += ' correct';
        else if (userSelected === idx && idx !== q.correct) optClass += ' incorrect';
      }

      return `
        <div class="${optClass}" role="button" tabindex="0" onclick="window.module5Wall3.selectQ24Option(${idx})" onkeydown="if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); window.module5Wall3.selectQ24Option(${idx}); }">
          <span class="m5-opt-letter">${String.fromCharCode(65 + idx)}</span>
          <span class="m5-opt-text">${opt}</span>
        </div>
      `;
    }).join('');

    let feedbackHtml = '';
    if (isSubmitted) {
      const isCorrect = (userSelected === q.correct);
      feedbackHtml = `
        <div class="m5-quiz-feedback ${isCorrect ? 'correct' : 'incorrect'}">
          <strong>${isCorrect ? '✓ Correct!' : '✗ Correction:'}</strong> ${q.explanation}
        </div>
      `;
    }

    container.innerHTML = `
      <div class="m5-quiz-card">
        <div class="m5-quiz-header-row">
          <div>
            <span class="m5-quiz-scenario-tag">${q.scenarioTitle}</span>
            <span class="m5-quiz-step">QUESTION ${this.q24Index + 1} OF ${qList.length}</span>
          </div>
          <button type="button" class="btn btn-outline btn-sm" onclick="window.module5Wall3.retryQ24Quiz()">↺ Reset Quiz</button>
        </div>

        <div class="m5-quiz-scenario-box">
          <p><strong>Scenario Context:</strong> "${q.scenarioText}"</p>
        </div>

        <div class="m5-quiz-question">${q.question}</div>
        <div class="m5-quiz-options-list">${optionsHtml}</div>
        ${feedbackHtml}

        <div class="m5-quiz-actions">
          ${!isSubmitted
            ? `<button type="button" class="btn btn-primary" onclick="window.module5Wall3.submitQ24Answer()">Submit Answer</button>`
            : (this.q24Index < qList.length - 1
                ? `<button type="button" class="btn btn-primary" onclick="window.module5Wall3.nextQ24Question()">Next Question ➔</button>`
                : `<button type="button" class="btn btn-gold" onclick="window.module5Wall3.finishQuiz24()">Finish & Score Quiz</button>`
              )
          }
        </div>

        ${state.module24.quizScore !== undefined && allAnswered ? `
          <div class="m5-quiz-result-banner ${state.module24.quizPassed ? 'passed' : 'failed'}">
            <span>Score: <strong>${state.module24.quizScore} / ${qList.length}</strong> (${state.module24.quizPassed ? 'PASSED 70%+' : 'NEEDS 7/10 TO PASS'})</span>
            ${state.module24.quizPassed ? `
              <p>Module 2.4 is complete. Close this box, then click the laptop on Wall 3 when you are ready to open Module 2.5.</p>
            ` : `
              <button type="button" class="btn btn-outline" onclick="window.module5Wall3.retryQ24Quiz()">Try Again</button>
            `}
          </div>
        ` : ''}
      </div>
    `;
  }

  // ============================================================
  // STAGE 6: UNLOCK MOTIVATION CORE LEARNING CONSOLE (MODULE 2.5)
  // ============================================================
  activateModule25UnlockedEffect() {
    const state = this.getState();
    const motivationHotspot = document.getElementById('m5-w3-podcast-screen');
    if (motivationHotspot) motivationHotspot.classList.add('m5-m25-unlocked-glow');

    window.app?.showToast('🌟 NEW LEARNING UNLOCKED — MODULE 2.5: WHAT MOTIVATES YOU?', 'reward');
    this.syncWallUI();
  }

  // ============================================================
  // OBJECT F: PODCAST 2.5 — WHAT MOTIVATES YOU?
  // ============================================================
  togglePlayAudio25() {
    if (this.media25.isPlaying) {
      this.pauseAudio25();
    } else {
      this.playAudio25();
    }
  }

  playAudio25() {
    this.media25.isPlaying = true;
    const playBtn = document.getElementById('m5-w3-m25-play-btn');
    if (playBtn) {
      playBtn.innerHTML = '<span>⏸ Pause Video</span>';
      playBtn.classList.add('active-play');
    }

    const screen = document.getElementById('m5-video-screen-25-w3');
    if (screen) screen.classList.add('is-playing');
    const playOverlay = document.getElementById('m5-video-play-btn-25-w3');
    if (playOverlay) playOverlay.textContent = '⏸';
    const statusText = document.getElementById('m5-video-status-text-25-w3');
    if (statusText) statusText.textContent = 'STREAMING VIDEO LECTURE 2.5...';

    clearInterval(this.media25.interval);
    this.media25.interval = setInterval(() => {
      this.media25.currentTime++;
      if (this.media25.currentTime >= this.media25.duration) {
        this.media25.currentTime = this.media25.duration;
        this.pauseAudio25();
        this.confirmMarkAsWatched25();
      }
      this.updateProgressUI25();
    }, 1000);
  }

  pauseAudio25() {
    this.media25.isPlaying = false;
    const playBtn = document.getElementById('m5-w3-m25-play-btn');
    if (playBtn) {
      playBtn.innerHTML = '<span>▶ Play Video</span>';
      playBtn.classList.remove('active-play');
    }

    const screen = document.getElementById('m5-video-screen-25-w3');
    if (screen) screen.classList.remove('is-playing');
    const playOverlay = document.getElementById('m5-video-play-btn-25-w3');
    if (playOverlay) playOverlay.textContent = '▶';
    const statusText = document.getElementById('m5-video-status-text-25-w3');
    if (statusText) statusText.textContent = 'CLICK SCREEN TO PLAY VIDEO';

    clearInterval(this.media25.interval);
  }

  seekAudio25(sec) {
    this.media25.currentTime = Math.max(0, Math.min(this.media25.duration, sec));
    this.updateProgressUI25();
  }

  updateProgressUI25() {
    const curTimeEl = document.getElementById('m5-w3-m25-cur-time');
    const seekbar = document.getElementById('m5-w3-m25-seekbar');
    const format = s => `${Math.floor(s / 60)}:${(s % 60 < 10 ? '0' : '')}${s % 60}`;

    if (curTimeEl) curTimeEl.textContent = format(this.media25.currentTime);
    if (seekbar) seekbar.value = ((this.media25.currentTime / this.media25.duration) * 100).toFixed(1);
  }

  confirmMarkAsWatched25() {
    const state = this.getState();
    state.module25.isPodcastComplete = true;
    this.saveState();
    this.pauseAudio25();
    if (window.soundEngine?.playSuccess) window.soundEngine.playSuccess();
    window.app?.showToast('✅ Module 2.5 video reviewed. Review the discussion guide, then select the quiz tab when ready.', 'reward');
    this.syncKB3Modal();
  }

  markDiscussionQuestion25Viewed(questionIndex) {
    if (!Number.isInteger(questionIndex) || questionIndex < 0 || questionIndex > 2) return;
    const state = this.getState();
    state.module25.discussionQuestionsReviewed[questionIndex] = true;
    this.saveState();
    this.renderDiscussionGuide25();
  }

  selectDiscussionPointer25(questionIndex, pointerIndex, isSelected) {
    if (!Number.isInteger(questionIndex) || questionIndex < 0 || questionIndex > 2) return;
    if (!Number.isInteger(pointerIndex) || pointerIndex < 0 || pointerIndex > 2) return;
    const state = this.getState();
    state.module25.discussionPointerSelections[questionIndex][pointerIndex] = Boolean(isSelected);
    state.module25.discussionQuestionsReviewed[questionIndex] = true;
    this.saveState();
    this.renderDiscussionGuide25();
  }

  renderDiscussionGuide25() {
    const state = this.getState().module25;
    const reviewed = state.discussionQuestionsReviewed || [false, false, false];
    const viewedCount = reviewed.filter(Boolean).length;
    const button = document.getElementById('m5-w3-m25-discussion-reviewed-btn');
    if (button) {
      button.disabled = state.isDiscussionGuideReviewed || viewedCount < 3;
      button.textContent = state.isDiscussionGuideReviewed
        ? '✓ DISCUSSION GUIDE 2.5 REVIEWED'
        : `✓ MARK DISCUSSION GUIDE 2.5 AS REVIEWED (${viewedCount}/3)`;
    }
    reviewed.forEach((isReviewed, index) => {
      const question = document.getElementById(`m5-w3-m25-disc-question-${index}`);
      if (question) {
        question.classList.toggle('reviewed', isReviewed);
        question.setAttribute('aria-pressed', String(isReviewed));
      }
      state.discussionPointerSelections[index].forEach((isSelected, pointerIndex) => {
        const option = document.getElementById(`m5-w3-m25-disc-option-${index}-${pointerIndex}`);
        if (option) {
          option.checked = isSelected;
          option.closest('.m5-m25-pointer-option')?.classList.toggle('selected', isSelected);
        }
      });
    });
  }

  markDiscussionGuide25Reviewed() {
    const state = this.getState();
    if (!state.module25.discussionQuestionsReviewed.every(Boolean)) {
      window.app?.showToast('Open all three Module 2.5 discussion questions before marking the guide reviewed.', 'warning');
      return;
    }
    state.module25.isDiscussionGuideReviewed = true;
    this.saveState();
    if (window.soundEngine?.playSuccess) window.soundEngine.playSuccess();
    window.app?.showToast('✅ Discussion Guide 2.5 reviewed. Select the quiz tab when you are ready to begin.', 'reward');
    this.syncKB3Modal();
  }

  // ============================================================
  // OBJECT G: MODULE 2.5 — ORIGINAL QUIZ (8 MCQs)
  // ============================================================
  getModule25QuizData() {
    return [
      {
        id: 'q25_1',
        question: 'What are the two primary motivators for young people choosing an entrepreneurial path today?',
        options: [
          'Peer pressure and quick fame.',
          'Social media popularity and avoiding work.',
          'Excitement and control over time/money.',
          'Government grants and easy profits.'
        ],
        correct: 2, // C
        explanation: 'Young people are motivated by the excitement and the feeling of gaining control over their time and money.'
      },
      {
        id: 'q25_2',
        question: 'What is a key realistic understanding about being an entrepreneur regarding a "boss"?',
        options: [
          'Your clients act as your only boss.',
          'You will never have a boss.',
          'External influences will manage you.',
          'You become your own boss, and all decisions have consequences.'
        ],
        correct: 3, // D
        explanation: 'When you are an entrepreneur, you are your own boss, and your decisions carry consequences.'
      },
      {
        id: 'q25_3',
        question: 'Besides passion, what is another common starting point for a business?',
        options: [
          'Following market trends.',
          'Parental expectations.',
          'Access to cheap labor.',
          'A need to earn money.'
        ],
        correct: 3, // D
        explanation: 'Businesses can start either from passion or from a need to earn money.'
      },
      {
        id: 'q25_4',
        question: 'What two elements are crucial for any business, regardless of its starting point?',
        options: [
          'Large funding and aggressive advertising.',
          'Structure and increased efficiency.',
          'Constant innovation and risk-taking.',
          'Social media presence and celebrity endorsements.'
        ],
        correct: 1, // B
        explanation: 'It\'s important to bring structure and increase efficiency in your business.'
      },
      {
        id: 'q25_5',
        question: 'How can one lighten the burden of external pressures when making career decisions?',
        options: [
          'By ignoring all advice.',
          'By only listening to successful entrepreneurs.',
          'By making quick, impulsive choices.',
          'By having a frank conversation with oneself.'
        ],
        correct: 3, // D
        explanation: 'Pressures can be eased by having an honest conversation with yourself.'
      },
      {
        id: 'q25_6',
        question: 'What characteristic describes an individual\'s "why" for engaging in business?',
        options: [
          'It is fixed from the start.',
          'It is dynamic and can change over time.',
          'It is purely emotional and never rational.',
          'It is determined by initial capital.'
        ],
        correct: 1, // B
        explanation: 'The "why" behind doing business is dynamic and can evolve over time.'
      },
      {
        id: 'q25_7',
        question: 'What aspect of the entrepreneurial journey does social media often primarily depict?',
        options: [
          'The daily struggles and efforts.',
          'The financial failures and risks.',
          'Only great and good pictures.',
          'The long-term strategic planning.'
        ],
        correct: 2, // C
        explanation: 'Social media often presents only a positive and idealized view of the entrepreneurial journey.'
      },
      {
        id: 'q25_8',
        question: 'What is a crucial internal step for a young person to understand their own "why"?',
        options: [
          'Seeking constant external validation.',
          'Realistically assessing oneself.',
          'Comparing themselves to successful role models.',
          'Ignoring personal feelings.'
        ],
        correct: 1, // B
        explanation: 'Understanding your "why" involves realistically assessing your own capabilities.'
      }
    ];
  }

  selectQ25Option(optIdx) {
    const qList = this.getModule25QuizData();
    const q = qList[this.q25Index];
    if (this.q25Submitted[q.id]) return;

    this.q25Answers[q.id] = optIdx;
    if (window.soundEngine?.playClick) window.soundEngine.playClick();
    this.renderQuiz25();
  }

  submitQ25Answer() {
    const qList = this.getModule25QuizData();
    const q = qList[this.q25Index];
    if (this.q25Answers[q.id] === undefined) {
      window.app?.showToast('Please select an option before submitting.', 'warning');
      return;
    }

    this.q25Submitted[q.id] = true;
    const isCorrect = (this.q25Answers[q.id] === q.correct);
    if (isCorrect) {
      if (window.soundEngine?.playSuccess) window.soundEngine.playSuccess();
    } else {
      if (window.soundEngine?.playError) window.soundEngine.playError();
    }
    this.renderQuiz25();
  }

  nextQ25Question() {
    const qList = this.getModule25QuizData();
    if (this.q25Index < qList.length - 1) {
      this.q25Index++;
      this.renderQuiz25();
    } else {
      this.finishQuiz25();
    }
  }

  finishQuiz25() {
    const qList = this.getModule25QuizData();
    const state = this.getState();
    if (!state.module25.isPodcastComplete || !state.module25.isDiscussionGuideReviewed) {
      window.app?.showToast('Complete the Module 2.5 video and discussion guide before scoring the quiz.', 'warning');
      return;
    }
    if (qList.some(question => this.q25Submitted[question.id] !== true)) {
      window.app?.showToast('Answer all 8 Module 2.5 quiz questions before scoring.', 'warning');
      return;
    }

    let score = 0;
    qList.forEach(q => {
      if (this.q25Answers[q.id] === q.correct) score++;
    });

    state.module25.quizScore = score;
    const passed = (score >= 6); // 70% threshold = 6/8

    if (passed) {
      state.module25.quizPassed = true;
      state.module25.isComplete = true;

      // Also mark in wall4 so user doesn't have to repeat Module 2.5 on Wall 4
      if (window.module5State?.state?.wall4) {
        const w4 = window.module5State.state.wall4;
        w4.isModule25Unlocked = true;
        w4.isModule25PodcastWatched = true;
        w4.isModule25QuizPassed = true;
        w4.module25QuizScore = score;
      }

      this.saveState();
      if (window.soundEngine?.playSuccess) window.soundEngine.playSuccess();
      window.app?.showToast(`🎉 Passed Module 2.5 Quiz (${score}/8)! Module 2.5 is complete.`, 'reward');

      // Check stage 9 completion
      this.checkWall3Complete();
    } else {
      state.module25.quizPassed = false;
      state.module25.isComplete = false;
      this.saveState();
      if (window.soundEngine?.playError) window.soundEngine.playError();
      window.app?.showToast(`Score: ${score}/8. Need at least 6/8 (70%) to pass. Please reset and try again!`, 'warning');
    }

    this.renderQuiz25();
  }

  retryQ25Quiz() {
    this.q25Index = 0;
    this.q25Answers = {};
    this.q25Submitted = {};
    const state = this.getState();
    state.module25.quizPassed = false;
    state.module25.isComplete = false;
    state.module25.quizScore = 0;
    this.saveState();
    this.renderQuiz25();
    window.app?.showToast('Quiz 2.5 reset. Choose your answer for Question 1.', 'info');
  }

  renderQuiz25() {
    const container = document.getElementById('m5-w3-quiz25-container');
    if (!container) return;

    const qList = this.getModule25QuizData();
    const q = qList[this.q25Index];
    const isSubmitted = !!this.q25Submitted[q.id];
    const userSelected = this.q25Answers[q.id];
    const allAnswered = Object.keys(this.q25Submitted).length >= qList.length;

    const state = this.getState();

    let optionsHtml = q.options.map((opt, idx) => {
      let optClass = 'm5-quiz-opt';
      if (userSelected === idx) optClass += ' selected';
      if (isSubmitted) {
        if (idx === q.correct) optClass += ' correct';
        else if (userSelected === idx && idx !== q.correct) optClass += ' incorrect';
      }

      return `
        <div class="${optClass}" role="button" tabindex="0" onclick="window.module5Wall3.selectQ25Option(${idx})" onkeydown="if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); window.module5Wall3.selectQ25Option(${idx}); }">
          <span class="m5-opt-letter">${String.fromCharCode(65 + idx)}</span>
          <span class="m5-opt-text">${opt}</span>
        </div>
      `;
    }).join('');

    let feedbackHtml = '';
    if (isSubmitted) {
      const isCorrect = (userSelected === q.correct);
      feedbackHtml = `
        <div class="m5-quiz-feedback ${isCorrect ? 'correct' : 'incorrect'}">
          <strong>${isCorrect ? '✓ Correct!' : '✗ Correction:'}</strong> ${q.explanation}
        </div>
      `;
    }

    container.innerHTML = `
      <div class="m5-quiz-card">
        <div class="m5-quiz-header-row">
          <div>
            <span class="m5-quiz-scenario-tag">Module 2.5: What Motivates You?</span>
            <span class="m5-quiz-step">QUESTION ${this.q25Index + 1} OF ${qList.length}</span>
          </div>
          <button type="button" class="btn btn-outline btn-sm" onclick="window.module5Wall3.retryQ25Quiz()">↺ Reset Quiz</button>
        </div>

        <div class="m5-quiz-question">${q.question}</div>
        <div class="m5-quiz-options-list">${optionsHtml}</div>
        ${feedbackHtml}

        <div class="m5-quiz-actions">
          ${!isSubmitted
            ? `<button type="button" class="btn btn-primary" onclick="window.module5Wall3.submitQ25Answer()">Submit Answer</button>`
            : (this.q25Index < qList.length - 1
                ? `<button type="button" class="btn btn-primary" onclick="window.module5Wall3.nextQ25Question()">Next Question ➔</button>`
                : `<button type="button" class="btn btn-gold" onclick="window.module5Wall3.finishQuiz25()">Finish & Score Quiz</button>`
              )
          }
        </div>

        ${state.module25.quizScore !== undefined && allAnswered ? `
          <div class="m5-quiz-result-banner ${state.module25.quizPassed ? 'passed' : 'failed'}">
            <span>Score: <strong>${state.module25.quizScore} / ${qList.length}</strong> (${state.module25.quizPassed ? 'PASSED 70%+' : 'NEEDS 6/8 TO PASS'})</span>
            ${state.module25.quizPassed ? `
              <span>Module 2.5 is complete. Close this box and use the Wall 3 exit object when you are ready to continue.</span>
            ` : `
              <button type="button" class="btn btn-outline" onclick="window.module5Wall3.retryQ25Quiz()">Try Again</button>
            `}
          </div>
        ` : ''}
      </div>
    `;
  }

  // ============================================================
  // OBJECT H: PROGRESS AND CLUE CONSOLE & WALL 3 COMPLETION
  // ============================================================
  checkWall3Complete() {
    const state = this.getState();
    const isComplete = (
      state.isMatchingPuzzleComplete &&
      state.module24.isPodcastComplete &&
      state.module24.isDiscussionGuideReviewed &&
      state.module24.quizPassed &&
      state.module25.isPodcastComplete &&
      state.module25.isDiscussionGuideReviewed &&
      state.module25.quizPassed
    );

    if (isComplete) {
      state.isWall3Complete = true;
      state.isFinalClueRevealed = true;
      state.isWall4Unlocked = true;

      // Award Wall 3 Reward once
      if (window.gameState) {
        window.gameState.addItem({
          id: 'm5_w3_simulator_badge',
          name: 'Real-World Simulator Badge',
          icon: '🌐',
          type: 'achievement_badge',
          desc: 'Mastered both Everyday Entrepreneurship and Motivation Core modules.'
        });
        window.gameState.addItem({
          id: 'm5_w3_clue',
          name: 'Clue 03: Opportunity Revelation',
          icon: '📜',
          type: 'clue',
          desc: 'Understanding everyday opportunities is only the beginning. Discover what motivates you and why you want to pursue your journey.'
        });
      }

      this.saveState();
      this.syncWallUI();
    }
  }

  openProgressConsole() {
    if (!this.getState().isMatchingPuzzleComplete) {
      this.clickKnowledgeBox3();
      return;
    }
    window.app?.showToast('Your progress is saved in Knowledge Box 3. Click its chamber on the wall when you want to open it.', 'info');
  }

  clickWall3Console() {
    if (this.getState().isMatchingPuzzleComplete) {
      this.openProgressConsole();
      return;
    }

    this.openPuzzleModal();
  }

  renderProgressDashboard() {
    const container = document.getElementById('m5-w3-progress-dashboard');
    if (!container) return;

    const state = this.getState();
    const isReadyForClue = (
      state.isMatchingPuzzleComplete &&
      state.module24.isPodcastComplete &&
      state.module24.isDiscussionGuideReviewed &&
      state.module24.quizPassed &&
      state.module25.isPodcastComplete &&
      state.module25.isDiscussionGuideReviewed &&
      state.module25.quizPassed
    );

    container.innerHTML = `
      <div class="m5-progress-dashboard-card">
        <h3>WALL 3 LEARNING MASTER CONSOLE</h3>
        <p class="m5-pd-sub">Module 2.4 (Entrepreneurship Everyday) & Module 2.5 (What Motivates You)</p>

        <div class="m5-pd-grid">
          <div class="m5-pd-item ${state.isMatchingPuzzleComplete ? 'completed' : ''}">
            <span class="m5-pd-status">${state.isMatchingPuzzleComplete ? '✓ COMPLETED' : 'PENDING'}</span>
            <h4>1. Connect the Situation</h4>
            <p>5 Entrepreneurial Pairs matched to simulation stations.</p>
          </div>

          <div class="m5-pd-item ${state.module24.isPodcastComplete ? 'completed' : ''}">
            <span class="m5-pd-status">${state.module24.isPodcastComplete ? '✓ COMPLETED' : 'PENDING'}</span>
            <h4>2. Module 2.4 Video Lecture</h4>
            <p>Watched and reviewed source lecture.</p>
          </div>

          <div class="m5-pd-item ${state.module24.quizPassed ? 'completed' : ''}">
            <span class="m5-pd-status">${state.module24.quizPassed ? `✓ PASSED (${state.module24.quizScore}/10)` : 'PENDING'}</span>
            <h4>3. Module 2.4 Scenario Quiz</h4>
            <p>10 Scenario MCQs testing partnerships, scaling, and community models.</p>
          </div>

          <div class="m5-pd-item ${state.module25.isPodcastComplete ? 'completed' : ''}">
            <span class="m5-pd-status">${state.module25.isPodcastComplete ? '✓ COMPLETED' : (state.module24.quizPassed ? 'AVAILABLE' : 'LOCKED')}</span>
            <h4>4. Module 2.5 Video Lecture</h4>
            <p>What Motivates You lecture & discussion guide.</p>
          </div>

          <div class="m5-pd-item ${state.module25.isDiscussionGuideReviewed ? 'completed' : ''}">
            <span class="m5-pd-status">${state.module25.isDiscussionGuideReviewed ? '✓ REVIEWED' : (state.module25.isPodcastComplete ? 'AVAILABLE' : 'LOCKED')}</span>
            <h4>5. Module 2.5 Discussion Guide</h4>
            <p>Reviewed all 3 reflection questions.</p>
          </div>

          <div class="m5-pd-item ${state.module25.quizPassed ? 'completed' : ''}">
            <span class="m5-pd-status">${state.module25.quizPassed ? `✓ PASSED (${state.module25.quizScore}/8)` : (state.module25.isPodcastComplete && state.module25.isDiscussionGuideReviewed ? 'AVAILABLE' : 'LOCKED')}</span>
            <h4>6. Module 2.5 Motivation Quiz</h4>
            <p>8 Assessment questions on internal drivers, efficiency, and self-honesty.</p>
          </div>
        </div>

        <div class="m5-pd-action-row">
          ${isReadyForClue ? `
            <button type="button" class="btn btn-gold btn-lg" onclick="window.module5Wall3.showFinalClueModal()">
              📜 VIEW FINAL CLUE & COMPLETE WALL 3 ➔
            </button>
          ` : `
            <div class="m5-pd-incomplete-notice">
              <span>Complete each learning stage above to reveal the Final Clue and unlock Wall 4.</span>
            </div>
          `}
        </div>
      </div>
    `;
  }

  showFinalClueModal() {
    this.checkWall3Complete();
    if (!this.getState().isWall3Complete) {
      window.app?.showToast('Complete Module 2.4 and Module 2.5 before opening the Wall 3 final clue.', 'warning');
      return;
    }
    const modal = document.getElementById('m5-w3-clue-modal');
    if (modal) {
      modal.classList.add('active');
      modal.style.display = 'flex';
      if (window.soundEngine?.playSuccess) window.soundEngine.playSuccess();
    }
  }

  closeFinalClueModal() {
    const modal = document.getElementById('m5-w3-clue-modal');
    if (modal) {
      modal.classList.remove('active');
      modal.style.display = 'none';
    }
  }

  // ============================================================
  // STAGE 10: COMPLETE WALL 3 & NAVIGATE TO WALL 4
  // ============================================================
  proceedToWall4() {
    const state = this.getState();
    if (!state.isWall3Complete) {
      window.app?.showToast('⚠️ Please complete Module 2.4 and Module 2.5 before proceeding to Wall 4.', 'warning');
      return;
    }

    this.closeFinalClueModal();
    this.closeKB3Modal();
    this.closePodcast25Modal();

    if (window.vintageRoomEngine) {
      window.vintageRoomEngine.setWall(4);
    } else if (window.module5Engine) {
      window.module5Engine.setWall(4);
    }

    window.app?.showToast('🚀 Welcome to Wall 4: Motivation Core! Discover what drives your journey.', 'reward');
  }

  // ============================================================
  // WALL UI SYNCHRONIZATION
  // ============================================================
  syncWallUI() {
    const state = this.getState();

    // 1. Simulator Glow Overlay
    const simOverlay = document.getElementById('m5-w3-simulator-glow-overlay');
    if (simOverlay) {
      simOverlay.style.opacity = state.isSimulatorActivated ? '1' : '0';
    }

    // 2. Knowledge Box 3 Chamber
    const kb3Chamber = document.getElementById('m5-w3-kb3-chamber');
    if (kb3Chamber) {
      kb3Chamber.classList.toggle('unlocked', !!state.isKnowledgeBox3Unlocked);
    }

    // 3. Podcast screen hotspot
    const podcastScreen = document.getElementById('m5-w3-podcast-screen');
    if (podcastScreen) {
      podcastScreen.classList.toggle('m5-m25-unlocked-glow', !!state.module24.quizPassed);
    }

    // 4. Update Wall 3 Hint Beacons
    if (window.updateWall3HintBeacons) {
      window.updateWall3HintBeacons();
    }
  }
}

window.module5Wall3 = new Module5Wall3Controller();
