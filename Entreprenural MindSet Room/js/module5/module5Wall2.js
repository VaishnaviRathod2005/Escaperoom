/**
 * MIND MATTERS ENTREPRENEURIAL LAB
 * WALL 2: CAREER SIMULATION LAB CONTROLLER
 * Full Interactive Engine: Timeline Sequencer Puzzle, Simulator Chamber Activation,
 * Knowledge Box 2, Module 2.3 Podcast, Interactive Quiz 2.3, Discussion Guide,
 * Dream Career Journey Activity, Clue 02 Reveal & Seamless Wall 3 Integration.
 */

class Module5Wall2Controller {
  constructor() {
    this.audioInterval = null;
    this.isPlaying = false;
    this.currentTrackTime = 0;
    this.trackDuration = 225; // 3:45 in seconds
    this.activeTab = 'podcast'; // 'podcast' | 'quiz' | 'discussion' | 'activity' | 'clue02'

    // Milestone definitions for Puzzle 1
    this.milestones = [
      {
        id: 'm1_year1',
        label: 'YEAR 1 — Learn & Build Skills',
        stage: 'Stage 1: Foundational Horizon',
        icon: '🌱',
        desc: 'Master core technical & operational fundamentals, absorb industry mechanics, and develop baseline capabilities.'
      },
      {
        id: 'm2_year10',
        label: 'YEAR 10 — Gain Experience & Grow',
        stage: 'Stage 2: Expansion Horizon',
        icon: '📈',
        desc: 'Lead multidisciplinary initiatives, navigate complex market dynamics, and build professional stature and peer networks.'
      },
      {
        id: 'm3_year20',
        label: 'YEAR 20 — Take Bigger Opportunities',
        stage: 'Stage 3: Acceleration Horizon',
        icon: '🚀',
        desc: 'Spearhead high-stakes ventures, capitalize on major strategic shifts, and command scaled enterprises with calculated risk.'
      },
      {
        id: 'm4_year30',
        label: 'YEAR 30 — Lead & Create Impact',
        stage: 'Stage 4: Leadership Horizon',
        icon: '🏛️',
        desc: 'Steer industry standards, drive widespread institutional transformation, and achieve systemic economic and social impact.'
      },
      {
        id: 'm5_beyond30',
        label: 'BEYOND 30 — Mentor & Give Back',
        stage: 'Stage 5: Legacy & Mentorship',
        icon: '🌟',
        desc: 'Invest in emerging founders, transfer generational wisdom, and champion community advancement and sustained stewardship.'
      }
    ];

    // Shuffled pool order for puzzle
    this.shuffledPool = [];
    this.initPool();

    // Quiz 2.3 State
    this.q23CurrentIndex = 0;
    this.q23Answers = {};
    this.q23Submitted = {};
    this.q23Finished = false;
  }

  // Retrieve Wall 2 state from centralized state
  getState() {
    if (!window.module5State) return {};
    if (!window.module5State.state.wall2) {
      window.module5State.state.wall2 = {
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
      };
    }
    return window.module5State.state.wall2;
  }

  saveState() {
    if (window.module5State) {
      window.module5State.save();
    }
    this.syncWallUI();
    if (window.module5Engine?.updateObjectiveText) {
      window.module5Engine.updateObjectiveText();
    }
  }

  init() {
    this.syncWallUI();
  }

  initPool() {
    const items = [...this.milestones];
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    this.shuffledPool = items;
  }

  // ============================================================
  // OBJECT 2 & 3: TIMELINE SEQUENCER PUZZLE MODAL (IMAGE 1 TRIGGER)
  // ============================================================
  openTimelineModal() {
    const modal = document.getElementById('m5-w2-timeline-modal');
    if (!modal) return;

    this.renderTimelinePuzzle();
    modal.classList.add('active');
    modal.style.display = 'flex';
    modal.style.opacity = '1';
    modal.style.visibility = 'visible';
    modal.style.pointerEvents = 'auto';
    if (window.soundEngine?.playClick) window.soundEngine.playClick();
  }

  closeTimelineModal() {
    const modal = document.getElementById('m5-w2-timeline-modal');
    if (modal) {
      modal.classList.remove('active');
      modal.style.display = 'none';
      modal.style.opacity = '0';
      modal.style.visibility = 'hidden';
      modal.style.pointerEvents = 'none';
    }
  }

  renderTimelinePuzzle() {
    const state = this.getState();
    const slots = state.timelineSlots || [null, null, null, null, null];

    const poolContainer = document.getElementById('m5-w2-cards-pool');
    const slotsContainer = document.getElementById('m5-w2-target-slots');
    const feedbackBox = document.getElementById('m5-w2-timeline-feedback');
    const submitBtn = document.getElementById('m5-w2-timeline-submit');
    const resetBtn = document.getElementById('m5-w2-timeline-reset');

    if (!poolContainer || !slotsContainer) return;

    // Placed card IDs
    const placedIds = new Set(slots.filter(Boolean));

    // Render Pool
    poolContainer.innerHTML = '';
    this.shuffledPool.forEach(milestone => {
      const isPlaced = placedIds.has(milestone.id);
      const card = document.createElement('div');
      card.className = `m5-timeline-card ${milestone.id} ${isPlaced ? 'placed' : ''} ${state.isPuzzleSolved ? 'solved-card' : ''}`;
      card.id = `m5-card-${milestone.id}`;
      card.innerHTML = `
        <div class="m5-card-icon">${milestone.icon}</div>
        <div class="m5-card-body">
          <div class="m5-card-title">${milestone.label}</div>
          <div class="m5-card-desc">${milestone.desc}</div>
        </div>
        ${isPlaced ? '<div class="m5-card-placed-badge">IN SLOT</div>' : '<div class="m5-card-action">CLICK TO PLACE ➔</div>'}
      `;

      if (!isPlaced && !state.isPuzzleSolved) {
        card.onclick = () => this.autoPlaceCard(milestone.id);
      } else if (isPlaced && !state.isPuzzleSolved) {
        card.onclick = () => {
          const idx = slots.indexOf(milestone.id);
          if (idx !== -1) this.removeCardFromSlot(idx);
        };
      }
      poolContainer.appendChild(card);
    });

    // Render 5 Target Slots
    slotsContainer.innerHTML = '';
    const slotLabels = [
      'STAGE 1: 1st YEAR HORIZON (Foundations)',
      'STAGE 2: 10th YEAR HORIZON (Experience & Growth)',
      'STAGE 3: 20th YEAR HORIZON (Strategic Scale)',
      'STAGE 4: 30th YEAR HORIZON (Impact & Leadership)',
      'STAGE 5: BEYOND 30 HORIZON (Legacy & Mentorship)'
    ];

    slots.forEach((cardId, idx) => {
      const slotEl = document.createElement('div');
      slotEl.className = `m5-timeline-slot ${cardId ? ('filled ' + cardId) : 'empty'} ${state.isPuzzleSolved ? 'slot-verified' : ''}`;
      
      const milestone = cardId ? this.milestones.find(m => m.id === cardId) : null;

      slotEl.innerHTML = `
        <div class="m5-slot-header">
          <span class="m5-slot-badge">SLOT 0${idx + 1}</span>
          <span class="m5-slot-label">${slotLabels[idx]}</span>
        </div>
        <div class="m5-slot-content">
          ${milestone ? `
            <div class="m5-placed-card">
              <span class="m5-placed-icon">${milestone.icon}</span>
              <div class="m5-placed-text">
                <strong>${milestone.label}</strong>
                <span>${milestone.desc}</span>
              </div>
              ${!state.isPuzzleSolved ? `<button type="button" class="m5-slot-remove-btn" onclick="event.stopPropagation(); window.module5Wall2.removeCardFromSlot(${idx})">✕</button>` : ''}
            </div>
          ` : `
            <div class="m5-slot-placeholder">
              <span>✚ Click an available milestone above to assign here</span>
            </div>
          `}
        </div>
      `;

      if (cardId && !state.isPuzzleSolved) {
        slotEl.onclick = () => this.removeCardFromSlot(idx);
      }

      slotsContainer.appendChild(slotEl);
    });

    // Feedback and button controls
    if (feedbackBox) {
      if (state.isPuzzleSolved) {
        feedbackBox.className = 'm5-timeline-feedback-banner success';
        feedbackBox.innerHTML = `
          <div class="m5-feedback-icon">✓</div>
          <div class="m5-feedback-text">
            <strong>TIMELINE SYNCHRONIZATION COMPLETE!</strong>
            <span>All 5 horizons correctly positioned. Knowledge Box 2 is unlocked.</span>
          </div>
          <button type="button" class="btn btn-primary btn-sm m5-feedback-action" onclick="window.module5Wall2.closeTimelineModal(); window.app?.showToast('Knowledge Box 2 is ready. Click its chest on the wall when you want to open it.', 'reward');">
            CONTINUE TO KNOWLEDGE BOX 2 ➔
          </button>
        `;
      } else {
        feedbackBox.className = 'm5-timeline-feedback-banner info';
        const filledCount = slots.filter(Boolean).length;
        feedbackBox.innerHTML = `
          <div class="m5-feedback-icon">ℹ️</div>
          <div class="m5-feedback-text">
            <strong>Roadmap Status:</strong> ${filledCount}/5 Horizons Assigned. Match career progression from foundational learning to legacy stewardship.
          </div>
        `;
      }
    }

    if (submitBtn) {
      submitBtn.disabled = state.isPuzzleSolved;
      submitBtn.textContent = state.isPuzzleSolved ? '✓ TIMELINE SYNCHRONIZED' : 'SUBMIT TIMELINE';
    }

    if (resetBtn) {
      resetBtn.disabled = state.isPuzzleSolved;
    }
  }

  autoPlaceCard(cardId) {
    const state = this.getState();
    if (state.isPuzzleSolved) return;

    const slots = state.timelineSlots || [null, null, null, null, null];
    const emptyIndex = slots.findIndex(s => s === null);
    if (emptyIndex === -1) {
      window.app?.showToast('All 5 slots are full! Remove a milestone first or click Submit.', 'warning');
      return;
    }

    slots[emptyIndex] = cardId;
    state.timelineSlots = slots;
    if (window.soundEngine?.playClick) window.soundEngine.playClick();
    this.renderTimelinePuzzle();
  }

  removeCardFromSlot(slotIndex) {
    const state = this.getState();
    if (state.isPuzzleSolved) return;

    const slots = state.timelineSlots || [null, null, null, null, null];
    if (slots[slotIndex]) {
      slots[slotIndex] = null;
      state.timelineSlots = slots;
      if (window.soundEngine?.playClick) window.soundEngine.playClick();
      this.renderTimelinePuzzle();
    }
  }

  resetTimeline() {
    const state = this.getState();
    if (state.isPuzzleSolved) return;

    state.timelineSlots = [null, null, null, null, null];
    this.initPool();
    if (window.soundEngine?.playClick) window.soundEngine.playClick();
    this.renderTimelinePuzzle();
    window.app?.showToast('Timeline slots cleared. Pool reshuffled.', 'info');
  }

  submitTimeline() {
    const state = this.getState();
    if (state.isPuzzleSolved) return;

    const slots = state.timelineSlots || [null, null, null, null, null];
    const filledCount = slots.filter(Boolean).length;

    const feedbackBox = document.getElementById('m5-w2-timeline-feedback');

    // 1. Rejection of incomplete submission
    if (filledCount < 5) {
      if (feedbackBox) {
        feedbackBox.className = 'm5-timeline-feedback-banner warning';
        feedbackBox.innerHTML = `
          <div class="m5-feedback-icon">⚠️</div>
          <div class="m5-feedback-text">
            <strong>Incomplete Timeline:</strong> Please assign all 5 milestone horizons before submitting (${filledCount}/5 placed).
          </div>
        `;
      }
      if (window.soundEngine?.playError) window.soundEngine.playError();
      window.app?.showToast('⚠️ Please assign all 5 milestones before submitting.', 'warning');
      return;
    }

    // 2. Validate exact chronological order
    const correctOrder = ['m1_year1', 'm2_year10', 'm3_year20', 'm4_year30', 'm5_beyond30'];
    const isCorrect = slots.every((val, idx) => val === correctOrder[idx]);

    if (!isCorrect) {
      if (feedbackBox) {
        feedbackBox.className = 'm5-timeline-feedback-banner error';
        feedbackBox.innerHTML = `
          <div class="m5-feedback-icon">❌</div>
          <div class="m5-feedback-text">
            <strong>Sequence Mismatch:</strong> The timeline does not reflect chronological career progression. Consider how expertise compounds: first skill acquisition, then operational growth, scaling up, institutional leadership, and finally giving back.
          </div>
        `;
      }
      if (window.soundEngine?.playError) window.soundEngine.playError();
      window.app?.showToast('❌ Incorrect timeline sequence. Adjust your horizons and try again.', 'error');
      return;
    }

    // 3. Success state transition
    state.isPuzzleSolved = true;
    state.isSimulatorActive = true;
    state.isKnowledgeBox2Unlocked = true;
    this.saveState();

    // Add Decade Career Roadmap and Simulator Chamber Key to Explorer's Bag Inventory
    window.gameState?.addItem({
      id: 'm5_career_dossier',
      name: 'Decade Career Roadmap',
      icon: '🗺️',
      type: 'career_dossier',
      desc: 'Complete 10-year venture timeline blueprint: Foundation -> Skill Depth -> Market Pilot -> Scaling -> Industry Leadership.'
    });

    window.gameState?.addItem({
      id: 'm5_simulator_key',
      name: 'Career Simulation Chamber Key',
      icon: '🔑',
      type: 'access_key',
      desc: 'Cryptographic activation key energizing the experiential simulation chamber.'
    });

    if (window.soundEngine?.playSuccess) window.soundEngine.playSuccess();
    window.app?.showToast('🎉 TIMELINE VERIFIED! Knowledge Box 2 is now UNLOCKED!', 'reward');

    this.renderTimelinePuzzle();
  }

  // ============================================================
  // OBJECT 4 & 5: KNOWLEDGE BOX 2 CHAMBER & CHEST (IMAGE 2 TRIGGER)
  // ============================================================
  clickKnowledgeBox2() {
    const state = this.getState();
    if (!state.isKnowledgeBox2Unlocked) {
      window.app?.showToast('🔒 Knowledge Box 2 is locked. Click the timeline screen above to solve the roadmap first!', 'warning');
      return;
    }
    this.openKB2Modal('podcast');
  }

  clickCareerConsole() {
    const state = this.getState();
    if (state.isKnowledgeBox2Unlocked) {
      window.app?.showToast('Knowledge Box 2 is ready. Click its chest on the wall when you want to open it.', 'info');
      return;
    }

    this.openTimelineModal();
  }

  clickPodcast() {
    // Per user specification: This background terminal image does NOT open the podcast.
    // Podcasts and quizzes are accessed exclusively through Knowledge Box 2 (Image 2).
    window.app?.showToast('ℹ️ Podcasts and quizzes are accessed exclusively through Knowledge Box 2.', 'info');
  }

  revealClue02() {
    const state = this.getState();
    if (!state.isPodcastWatched || !state.isModule23QuizPassed) return false;

    state.isClue02Revealed = true;
    state.isWall2Complete = true;
    window.gameState?.addItem({
      id: 'm5_clue_02',
      name: 'Clue 02: Vision Directive',
      icon: '📜',
      type: 'founder_clue',
      desc: '"A dream without a plan is just a wish. The roadmap is set. Proceed to Wall 3."'
    });
    return true;
  }

  openKB2Modal(initialTab = 'podcast') {
    const modal = document.getElementById('m5-w2-kb2-modal');
    if (!modal) return;

    this.activeTab = initialTab;
    this.syncKB2Modal();
    modal.classList.add('active');
    modal.style.display = 'flex';
    modal.style.opacity = '1';
    modal.style.visibility = 'visible';
    modal.style.pointerEvents = 'auto';
    if (window.soundEngine?.playClick) window.soundEngine.playClick();
  }

  closeKB2Modal() {
    const modal = document.getElementById('m5-w2-kb2-modal');
    if (modal) {
      modal.classList.remove('active');
      modal.style.display = 'none';
      modal.style.opacity = '0';
      modal.style.visibility = 'hidden';
      modal.style.pointerEvents = 'none';
    }
    this.stopAudio();
  }

  switchKB2Tab(tabName) {
    const state = this.getState();

    if (tabName === 'quiz' && !state.isPodcastWatched) {
      window.app?.showToast('🎧 Please complete/mark Podcast 2.3 as watched before taking the quiz.', 'warning');
      return;
    }

    if (tabName === 'activity' && !state.isModule23QuizPassed) {
      window.app?.showToast('🔒 Please pass the Module 2.3 Quiz (score 4/5 required) to unlock the activity.', 'warning');
      return;
    }

    if (tabName === 'clue02' && !state.isWall2Complete && !(state.isPodcastWatched && state.isModule23QuizPassed)) {
      window.app?.showToast('🔒 Clue 02 requires completing Podcast 2.3 and passing its quiz.', 'warning');
      return;
    }

    this.activeTab = tabName;
    if (window.soundEngine?.playClick) window.soundEngine.playClick();
    this.syncKB2Modal();
  }

  syncKB2Modal() {
    const state = this.getState();

    // Tab buttons
    document.querySelectorAll('.m5-kb2-tab-btn').forEach(btn => {
      const tab = btn.dataset.tab;
      btn.classList.toggle('active', this.activeTab === tab);

      const lockIndicator = btn.querySelector('.tab-lock-indicator');
      if (lockIndicator) {
        if (tab === 'podcast') {
          lockIndicator.textContent = state.isPodcastWatched ? '✓' : '🎧';
        } else if (tab === 'quiz') {
          lockIndicator.textContent = state.isModule23QuizPassed ? '✓' : '📝';
        } else if (tab === 'discussion') {
          lockIndicator.textContent = '💡';
        } else if (tab === 'activity') {
          lockIndicator.textContent = state.isCareerActivityCompleted ? '✓' : (state.isModule23QuizPassed ? '🚀' : '🔒');
        } else if (tab === 'clue02') {
          const isComplete = state.isWall2Complete || (state.isPodcastWatched && state.isModule23QuizPassed);
          lockIndicator.textContent = isComplete ? '🌟' : '🔒';
        }
      }
    });

    // Tab Panels
    const panels = {
      podcast: document.getElementById('m5-kb2-view-podcast'),
      quiz: document.getElementById('m5-kb2-view-quiz'),
      discussion: document.getElementById('m5-kb2-view-discussion'),
      activity: document.getElementById('m5-kb2-view-activity'),
      clue02: document.getElementById('m5-kb2-view-clue02')
    };

    Object.keys(panels).forEach(key => {
      if (panels[key]) {
        panels[key].style.display = (this.activeTab === key) ? 'block' : 'none';
      }
    });

    // Render Quiz if on Quiz tab
    if (this.activeTab === 'quiz') {
      this.renderQ23Question();
    }

    // Populate Activity fields with saved data if available
    if (state.careerActivityData) {
      const d = state.careerActivityData;
      const dreamInput = document.getElementById('m5-act-dream');
      const y1Input = document.getElementById('m5-act-y1');
      const y10Input = document.getElementById('m5-act-y10');
      const y20Input = document.getElementById('m5-act-y20');
      const y30Input = document.getElementById('m5-act-y30');
      const beyond30Input = document.getElementById('m5-act-beyond30');
      const skillsInput = document.getElementById('m5-act-skills');
      const nextStepsInput = document.getElementById('m5-act-nextsteps');

      if (dreamInput && !dreamInput.value && d.dream) dreamInput.value = d.dream;
      if (y1Input && !y1Input.value && d.year1) y1Input.value = d.year1;
      if (y10Input && !y10Input.value && d.year10) y10Input.value = d.year10;
      if (y20Input && !y20Input.value && d.year20) y20Input.value = d.year20;
      if (y30Input && !y30Input.value && d.year30) y30Input.value = d.year30;
      if (beyond30Input && !beyond30Input.value && d.beyond30) beyond30Input.value = d.beyond30;
      if (skillsInput && !skillsInput.value && d.skills) skillsInput.value = d.skills;
      if (nextStepsInput && !nextStepsInput.value && d.nextSteps) nextStepsInput.value = d.nextSteps;
    }

    // Audio status tag
    const audioStatusBadge = document.getElementById('m5-kb2-audio-badge');
    if (audioStatusBadge) {
      if (state.isPodcastWatched) {
        audioStatusBadge.textContent = '✓ COMPLETED';
        audioStatusBadge.className = 'm5-status-tag completed';
      } else {
        audioStatusBadge.textContent = 'PENDING COMPLETION';
        audioStatusBadge.className = 'm5-status-tag pending';
      }
    }

    // Quiz status tag
    const quizStatusBadge = document.getElementById('m5-kb2-quiz-badge');
    if (quizStatusBadge) {
      if (state.isModule23QuizPassed) {
        quizStatusBadge.textContent = `✓ PASSED (${state.module23QuizScore}/5)`;
        quizStatusBadge.className = 'm5-status-tag completed';
      } else {
        quizStatusBadge.textContent = 'PASS REQUIREMENT: 4/5';
        quizStatusBadge.className = 'm5-status-tag pending';
      }
    }

    // Activity status tag
    const actStatusBadge = document.getElementById('m5-kb2-act-badge');
    if (actStatusBadge) {
      if (state.isCareerActivityCompleted) {
        actStatusBadge.textContent = '✓ ACTIVITY COMPLETED';
        actStatusBadge.className = 'm5-status-tag completed';
      } else {
        actStatusBadge.textContent = state.isModule23QuizPassed ? 'ACTION REQUIRED' : 'LOCKED (PASS QUIZ FIRST)';
        actStatusBadge.className = 'm5-status-tag pending';
      }
    }
  }

  // ============================================================
  // PODCAST 2.3 AUDIO ENGINE
  // ============================================================
  togglePlayAudio() {
    if (this.isPlaying) {
      this.pauseAudio();
    } else {
      this.playAudio();
    }
  }

  playAudio() {
    this.isPlaying = true;
    const playBtn = document.getElementById('m5-kb2-play-btn');
    if (playBtn) {
      playBtn.innerHTML = '<span>⏸ Pause Video</span>';
      playBtn.classList.add('active-play');
    }

    const screen = document.getElementById('m5-video-screen-23');
    if (screen) screen.classList.add('is-playing');
    const playBtnOverlay = document.getElementById('m5-video-play-btn-23');
    if (playBtnOverlay) playBtnOverlay.textContent = '⏸';
    const statusText = document.getElementById('m5-video-status-text-23');
    if (statusText) statusText.textContent = 'STREAMING VIDEO BRIEFING 2.3...';

    const visualizer = document.getElementById('m5-kb2-visualizer');
    if (visualizer) visualizer.classList.add('playing');

    clearInterval(this.audioInterval);
    this.audioInterval = setInterval(() => {
      this.currentTrackTime++;
      if (this.currentTrackTime >= this.trackDuration) {
        this.currentTrackTime = this.trackDuration;
        this.pauseAudio();
        this.confirmMarkAsWatched();
      }
      this.updateAudioProgressUI();
    }, 1000);
  }

  pauseAudio() {
    this.isPlaying = false;
    const playBtn = document.getElementById('m5-kb2-play-btn');
    if (playBtn) {
      playBtn.innerHTML = '<span>▶ Play Video</span>';
      playBtn.classList.remove('active-play');
    }

    const screen = document.getElementById('m5-video-screen-23');
    if (screen) screen.classList.remove('is-playing');
    const playBtnOverlay = document.getElementById('m5-video-play-btn-23');
    if (playBtnOverlay) playBtnOverlay.textContent = '▶';
    const statusText = document.getElementById('m5-video-status-text-23');
    if (statusText) statusText.textContent = 'CLICK SCREEN TO PLAY VIDEO';

    const visualizer = document.getElementById('m5-kb2-visualizer');
    if (visualizer) visualizer.classList.remove('playing');

    clearInterval(this.audioInterval);
  }

  stopAudio() {
    this.pauseAudio();
    this.currentTrackTime = 0;
    this.updateAudioProgressUI();
  }

  seekAudio(seconds) {
    this.currentTrackTime = Math.max(0, Math.min(this.trackDuration, seconds));
    this.updateAudioProgressUI();
  }

  updateAudioProgressUI() {
    const curTimeEl = document.getElementById('m5-kb2-audio-cur-time');
    const seekbar = document.getElementById('m5-kb2-audio-seekbar');

    const format = sec => {
      const m = Math.floor(sec / 60);
      const s = Math.floor(sec % 60);
      return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    if (curTimeEl) curTimeEl.textContent = format(this.currentTrackTime);
    if (seekbar) seekbar.value = ((this.currentTrackTime / this.trackDuration) * 100).toFixed(1);
  }

  confirmMarkAsWatched() {
    const state = this.getState();
    state.isPodcastWatched = true;
    this.revealClue02();

    this.saveState();
    if (window.soundEngine?.playSuccess) window.soundEngine.playSuccess();
    window.app?.showToast(
      state.isModule23QuizPassed
        ? '✅ Podcast 2.3 completed! Clue 02 is unlocked.'
        : '✅ Podcast 2.3 marked as completed! Now take the Quiz.',
      'reward'
    );

    this.syncKB2Modal();
  }

  // ============================================================
  // MODULE 2.3 QUIZ ENGINE (INTERACTIVE KNOWLEDGE CHECK)
  // ============================================================
  getModule23QuizData() {
    return [
      {
        id: 'q23_1',
        question: 'What is the primary advantage of planning an entrepreneurial career in 10-year horizons rather than single years?',
        options: [
          'It guarantees you will never experience business failure',
          'It allows you to build deep domain skills and compound networks without feeling behind due to short-term market volatility',
          'It eliminates the need to review monthly financial statements',
          'It completely prevents competitors from entering the market'
        ],
        correct: 1,
        explanation: 'Decade-level thinking allows founders to weather short-term volatility, pivot through market cycles, and compound expertise over time.'
      },
      {
        id: 'q23_2',
        question: 'During Year 1 of an entrepreneurial career, what should be the founder’s primary focus?',
        options: [
          'Acquiring competing multinational companies',
          'Mastering core skills, understanding customer friction, and building operational fundamentals',
          'Lobbying for national policy changes',
          'Delegating all responsibilities and stepping back completely from execution'
        ],
        correct: 1,
        explanation: 'Year 1 is foundational: mastering hands-on craft, discovering real customer problems, and establishing credibility are crucial before scaling.'
      },
      {
        id: 'q23_3',
        question: 'What is the danger of attempting to scale prematurely before mastering foundational Year 1 skills?',
        options: [
          'The venture grows too steadily and predictably',
          'Operational flaws and weak unit economics are multiplied, triggering heavy cash burn and risk of collapse',
          'Customers request fewer product improvements',
          'The team becomes too well-trained to manage'
        ],
        correct: 1,
        explanation: 'Premature scaling magnifies underlying inefficiencies and structural weaknesses, burning valuable capital before product-market fit is proven.'
      },
      {
        id: 'q23_4',
        question: 'How does an entrepreneur’s primary focus typically evolve from Year 1 to Year 30?',
        options: [
          'From hands-on operational mastery and skill-building to high-level institutional governance, industry impact, and stewardship',
          'They perform identical daily tasks without change or evolution',
          'They cease all strategic thinking and communication',
          'From leading large enterprises to learning basic literacy'
        ],
        correct: 0,
        explanation: 'Over 30 years, an entrepreneur transitions from direct execution to organizational leadership, strategic direction, and enduring industry influence.'
      },
      {
        id: 'q23_5',
        question: 'Why is mentorship ("Beyond 30") considered a vital milestone in a long-term entrepreneurial journey?',
        options: [
          'It is legally mandatory for retiring directors',
          'It allows seasoned leaders to transfer generational wisdom, stay attuned to emerging innovations, and multiply community impact',
          'It prevents younger founders from starting new companies',
          'It guarantees an immediate stock exchange listing'
        ],
        correct: 1,
        explanation: 'Mentorship creates generative two-way value: seasoned entrepreneurs pass down resilience lessons while staying connected to fresh market trends.'
      }
    ];
  }

  selectQ23Option(optIndex) {
    const qData = this.getModule23QuizData()[this.q23CurrentIndex];
    if (this.q23Submitted[qData.id]) return;
    this.q23Answers[qData.id] = optIndex;
    if (window.soundEngine?.playClick) window.soundEngine.playClick();
    this.renderQ23Question();
  }

  submitQ23Answer() {
    const qData = this.getModule23QuizData()[this.q23CurrentIndex];
    const selected = this.q23Answers[qData.id];

    if (selected === undefined || selected === null) {
      window.app?.showToast('Please select an answer choice before submitting.', 'warning');
      return;
    }

    this.q23Submitted[qData.id] = true;
    const isCorrect = (selected === qData.correct);

    if (isCorrect) {
      if (window.soundEngine?.playSuccess) window.soundEngine.playSuccess();
    } else {
      if (window.soundEngine?.playError) window.soundEngine.playError();
    }

    this.renderQ23Question();
  }

  nextQ23Question() {
    const quizList = this.getModule23QuizData();
    if (this.q23CurrentIndex < quizList.length - 1) {
      this.q23CurrentIndex += 1;
      this.renderQ23Question();
    } else {
      // Evaluate final score
      let score = 0;
      quizList.forEach(q => {
        if (this.q23Answers[q.id] === q.correct) score += 1;
      });

      const state = this.getState();
      state.module23QuizScore = score;
      this.q23Finished = true;

      if (score >= 4) {
        state.isModule23QuizPassed = true;
        this.revealClue02();
        this.saveState();
        if (window.soundEngine?.playSuccess) window.soundEngine.playSuccess();
        window.app?.showToast(`🎉 Passed Module 2.3 Quiz (${score}/5)! Clue 02 is unlocked.`, 'reward');
      } else {
        state.isModule23QuizPassed = false;
        this.saveState();
        if (window.soundEngine?.playError) window.soundEngine.playError();
        window.app?.showToast(`Score: ${score}/5. Need at least 4/5 to pass. Click Reset & Retake to try again!`, 'warning');
      }

      this.syncKB2Modal();
    }
  }

  retryQ23Quiz() {
    this.q23CurrentIndex = 0;
    this.q23Answers = {};
    this.q23Submitted = {};
    this.q23Finished = false;
    const state = this.getState();
    state.isModule23QuizPassed = false;
    this.saveState();
    if (window.soundEngine?.playClick) window.soundEngine.playClick();
    this.renderQ23Question();
    this.syncKB2Modal();
    window.app?.showToast('Quiz reset. Answer all 5 questions to pass!', 'info');
  }

  renderQ23Question() {
    const container = document.getElementById('m5-w2-quiz-container');
    if (!container) return;

    const quizList = this.getModule23QuizData();
    const state = this.getState();

    // 1. Result screen if completed
    if (this.q23Finished || state.isModule23QuizPassed) {
      const score = state.module23QuizScore || 0;
      if (state.isModule23QuizPassed) {
        container.innerHTML = `
          <div class="m5-quiz-passed-box">
            <div class="m5-quiz-score-badge">✓ PASSED (${score}/5)</div>
            <p>Outstanding! You have mastered the core principles of long-term career planning and milestone navigation.</p>
            <div style="display: flex; gap: 12px; justify-content: center; margin-top: 16px; flex-wrap: wrap;">
              <button type="button" class="btn btn-outline" onclick="window.module5Wall2.retryQ23Quiz()">↺ Review / Retake Quiz</button>
              <button type="button" class="btn btn-gold" onclick="window.module5Wall2.switchKB2Tab('clue02')">View Clue 02 & Proceed to Wall 3 ➔</button>
              <button type="button" class="btn btn-primary" onclick="window.module5Wall2.switchKB2Tab('activity')">Optional: Dream Career Journey</button>
            </div>
          </div>
        `;
        return;
      } else {
        container.innerHTML = `
          <div class="m5-quiz-failed-box">
            <div class="m5-quiz-score-badge error">⚠️ SCORE: ${score}/5 (NOT PASSED)</div>
            <p>You need at least 4 out of 5 correct answers to unlock the Dream Career Journey activity. Review the materials and retake the quiz!</p>
            <div style="margin-top: 16px; text-align: center;">
              <button type="button" class="btn btn-primary btn-gold" style="padding: 12px 28px; font-weight: 800; font-size: 14px;" onclick="window.module5Wall2.retryQ23Quiz()">
                ↺ RESET & RETAKE QUIZ
              </button>
            </div>
          </div>
        `;
        return;
      }
    }

    // 2. Active question screen
    const q = quizList[this.q23CurrentIndex];
    const isSubmitted = !!this.q23Submitted[q.id];
    const userSelected = this.q23Answers[q.id];

    let optionsHtml = '';
    q.options.forEach((optText, idx) => {
      let optClass = 'm5-quiz-opt';
      if (userSelected === idx) optClass += ' selected';
      if (isSubmitted) {
        if (idx === q.correct) optClass += ' correct';
        else if (userSelected === idx) optClass += ' incorrect';
      }

      optionsHtml += `
        <div class="${optClass}" onclick="window.module5Wall2.selectQ23Option(${idx})">
          <span class="m5-opt-letter">${String.fromCharCode(65 + idx)}</span>
          <span class="m5-opt-text">${optText}</span>
        </div>
      `;
    });

    let feedbackHtml = '';
    if (isSubmitted) {
      const isCorrect = (userSelected === q.correct);
      feedbackHtml = `
        <div class="m5-quiz-feedback ${isCorrect ? 'correct' : 'incorrect'}">
          <strong>${isCorrect ? '✓ Correct!' : '✗ Incorrect.'}</strong> ${q.explanation}
        </div>
      `;
    }

    container.innerHTML = `
      <div class="m5-quiz-header-row">
        <div>
          <span class="m5-quiz-step">QUESTION ${this.q23CurrentIndex + 1} OF ${quizList.length}</span>
          <span class="m5-quiz-sublabel" style="margin-left: 10px;">Pass requirement: 4/5</span>
        </div>
        <button type="button" class="btn btn-outline btn-sm" style="font-size: 11px; padding: 4px 10px;" onclick="window.module5Wall2.retryQ23Quiz()" title="Reset all answers and start from Question 1">
          ↺ Reset Quiz
        </button>
      </div>
      <div class="m5-quiz-question">${q.question}</div>
      <div class="m5-quiz-options-list">${optionsHtml}</div>
      ${feedbackHtml}
      <div class="m5-quiz-actions">
        ${!isSubmitted
          ? `<button type="button" class="btn btn-primary" onclick="window.module5Wall2.submitQ23Answer()">Submit Answer</button>`
          : `<button type="button" class="btn btn-primary" onclick="window.module5Wall2.nextQ23Question()">${this.q23CurrentIndex < quizList.length - 1 ? 'Next Question ➔' : 'Finish Quiz'}</button>`
        }
      </div>
    `;
  }

  // ============================================================
  // DREAM CAREER JOURNEY ACTIVITY (IN-APP INTERACTIVE)
  // ============================================================
  submitCareerActivity() {
    const dream = document.getElementById('m5-act-dream')?.value?.trim() || '';
    const y1 = document.getElementById('m5-act-y1')?.value?.trim() || '';
    const y10 = document.getElementById('m5-act-y10')?.value?.trim() || '';
    const y20 = document.getElementById('m5-act-y20')?.value?.trim() || '';
    const y30 = document.getElementById('m5-act-y30')?.value?.trim() || '';
    const beyond30 = document.getElementById('m5-act-beyond30')?.value?.trim() || '';
    const skills = document.getElementById('m5-act-skills')?.value?.trim() || '';
    const nextSteps = document.getElementById('m5-act-nextsteps')?.value?.trim() || '';

    if (!dream || !y1 || !y10 || !skills || !nextSteps) {
      window.app?.showToast('⚠️ Please fill out your Career Dream, Year 1, Year 10, Skills, and Next Steps before completing.', 'warning');
      return;
    }

    const state = this.getState();
    state.careerActivityData = {
      dream,
      year1: y1,
      year10: y10,
      year20: y20 || 'Expand strategic horizons and venture scale',
      year30: y30 || 'Institutional leadership and industry stewardship',
      beyond30: beyond30 || 'Mentorship and generative community impact',
      skills,
      nextSteps
    };
    state.isCareerActivityCompleted = true;

    this.revealClue02();

    this.saveState();
    if (window.soundEngine?.playSuccess) window.soundEngine.playSuccess();
    window.app?.showToast('🎉 Dream Career Journey plan recorded!', 'reward');

    this.syncKB2Modal();
    this.switchKB2Tab('clue02');
  }

  // ============================================================
  // CLUE 02 & PROCEED TO WALL 3
  // ============================================================
  proceedToWall3() {
    const state = this.getState();
    if (!state.isWall2Complete && !state.isClue02Revealed) {
      window.app?.showToast(
        state.isKnowledgeBox2Unlocked
          ? 'Knowledge Box 2 is unlocked. Click its wall chest to open it and complete Module 2.3 before proceeding.'
          : 'Complete the career timeline to unlock Knowledge Box 2 before proceeding to Wall 3.',
        'warning'
      );
      return;
    }

    this.closeKB2Modal();

    if (window.vintageRoomEngine) {
      window.vintageRoomEngine.setWall(3);
    } else if (window.module5Engine) {
      window.module5Engine.setWall(3);
    }

    window.app?.showToast('🚀 Welcome to Wall 3: Opportunity Marketplace! Explore customer needs and market fit.', 'reward');
  }

  // ============================================================
  // UI SYNCHRONIZATION HELPERS (CLEAN WALL, ZERO TEXT BADGES)
  // ============================================================
  syncWallUI() {
    const state = this.getState();

    // 1. Knowledge Box 2 Chamber Highlight
    const kb2Btn = document.getElementById('m5-w2-kb2-btn');
    const simOverlay = document.getElementById('m5-w2-simulator-overlay');
    if (kb2Btn) {
      kb2Btn.classList.toggle('unlocked', !!state.isKnowledgeBox2Unlocked);
    }
    if (simOverlay) {
      simOverlay.style.opacity = state.isSimulatorActive ? '1' : '0';
    }
  }
}

window.module5Wall2 = new Module5Wall2Controller();
