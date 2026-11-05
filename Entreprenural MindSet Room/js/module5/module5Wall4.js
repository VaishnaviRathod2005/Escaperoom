/**
 * ACADEMY ESCAPE ROOM — MODULE 5: THE ENTREPRENEURIAL LAB
 * Wall 4 Controller: Motivation Core (GROW Stage)
 * Authoritative Implementation for Module 2.6 ONLY:
 * Building a Strong Foundation for Career
 */

class Module5Wall4Controller {
  constructor() {
    // 6 Motivation Categories matching WHY CORE pods exactly:
    // PASSION, INDEPENDENCE, MONEY, CONTROL, PURPOSE, IMPACT
    this.categories = [
      {
        id: 'passion',
        name: 'PASSION',
        aliases: ['passion'],
        color: '#c026d3',
        icon: '❤️',
        desc: 'Driven by deep enthusiasm, creative love for the craft, and personal joy.'
      },
      {
        id: 'independence',
        name: 'INDEPENDENCE',
        aliases: ['independence'],
        color: '#0284c7',
        icon: '👤',
        desc: 'Desire to chart your own path, be your own boss, and have complete autonomy.'
      },
      {
        id: 'money',
        name: 'MONEY',
        aliases: ['financial_stability'],
        color: '#22c55e',
        icon: '💰',
        desc: 'Focus on wealth creation, financial returns, and sustainable economic security.'
      },
      {
        id: 'control',
        name: 'CONTROL',
        aliases: ['family_expectations'],
        color: '#06b6d4',
        icon: '⚙️',
        desc: 'Owning executive decisions, steering strategy, and operating without corporate bureaucracy.'
      },
      {
        id: 'purpose',
        name: 'PURPOSE',
        aliases: ['purpose_impact'],
        color: '#e11d48',
        icon: '🎯',
        desc: 'Dedication to a meaningful mission, core why, and solving fundamental societal problems.'
      },
      {
        id: 'impact',
        name: 'IMPACT',
        aliases: ['market_opportunity'],
        color: '#f97316',
        icon: '👥',
        desc: 'Impacting people\'s lives at scale, serving communities, and creating social upliftment.'
      }
    ];

    // 6 Everyday Fictional Scenarios aligned to the 6 WHY CORE pods
    this.scenarios = [
      {
        id: 's1',
        text: 'Riya spends her weekends baking custom cakes because experimenting with recipes and decorating makes her lose track of time.',
        correctCategory: 'passion',
        aliases: ['passion'],
        rationale: 'Driven by genuine love for the craft, creative joy, and deep personal enthusiasm.'
      },
      {
        id: 's2',
        text: 'Dev wants to work on his own terms, choose his projects, and set his daily work schedule without answering to a boss.',
        correctCategory: 'independence',
        aliases: ['independence'],
        rationale: 'Driven by autonomy, self-determination, and the freedom to decide one\'s daily path.'
      },
      {
        id: 's3',
        text: 'Aman focuses on building a high-growth scalable business to generate substantial financial wealth and long-term economic security.',
        correctCategory: 'money',
        aliases: ['money', 'financial_stability'],
        rationale: 'Driven by financial returns, wealth accumulation, and profitable commercial sustainability.'
      },
      {
        id: 's4',
        text: 'Pooja starts her own design agency so she has full authority over creative decisions and project strategy instead of following rigid corporate hierarchy.',
        correctCategory: 'control',
        aliases: ['control', 'family_expectations'],
        rationale: 'Driven by decision-making control, strategic ownership, and executive leadership.'
      },
      {
        id: 's5',
        text: 'Kiran dedicates herself to building an educational platform aimed at solving the foundational literacy crisis for underserved children.',
        correctCategory: 'purpose',
        aliases: ['purpose', 'purpose_impact'],
        rationale: 'Driven by a deep sense of purpose, solving core societal friction, and mission-aligned work.'
      },
      {
        id: 's6',
        text: 'Sameer establishes a clean solar water network that improves public health and daily living conditions for over 50,000 rural residents.',
        correctCategory: 'impact',
        aliases: ['impact', 'market_opportunity'],
        rationale: 'Driven by creating large-scale positive impact, transforming people\'s lives, and community upliftment.'
      }
    ];

    // Puzzle UI State
    this.selectedScenario = null;
    this.selectedCategory = null;
    this.puzzleMatches = {}; // { s1: 'passion', ... }

    // Knowledge Box 4 Active Tab
    this.kb4ActiveTab = 'podcast'; // 'podcast' | 'discussion' | 'career_roots' | 'progress'

    // My Career Roots Active Step
    this.rootsActiveStep = 'learning'; // 'learning' | 'network' | 'financial' | 'superpower' | 'review'

    // Question viewed trackers (3 discussion questions)
    this.questionViews = [false, false, false];

    // Interactive Media Player State for Podcast 2.6
    this.isPlayingAudio = false;
    this.currentTrackTime = 0;
    this.trackDuration = 255;
  }

  getState() {
    if (!window.module5State?.state) {
      return {
        isMotivationPuzzleComplete: false,
        puzzleMatches: {},
        isWhyCoreActive: false,
        isKnowledgeBox4Unlocked: false,
        isPodcast26Reviewed: false,
        discussionQuestionsReviewed: [false, false, false],
        isDiscussionGuideReviewed: false,
        careerRoots: {
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
      };
    }
    if (!window.module5State.state.wall4) {
      window.module5State.state.wall4 = {
        isMotivationPuzzleComplete: false,
        puzzleMatches: {},
        isWhyCoreActive: false,
        isKnowledgeBox4Unlocked: false,
        isPodcast26Reviewed: false,
        discussionQuestionsReviewed: [false, false, false],
        isDiscussionGuideReviewed: false,
        careerRoots: {
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
      };
    }
    return window.module5State.state.wall4;
  }

  saveState() {
    if (window.module5State?.save) {
      window.module5State.save();
    }
  }

  // ============================================================
  // OBJECT 1 / PUZZLE 1: MOTIVATION CORE ACTIVATION PUZZLE
  // ============================================================
  openPuzzle1Modal() {
    const state = this.getState();
    const modal = document.getElementById('m5-w4-puzzle1-modal');
    if (!modal) return;

    if (state.puzzleMatches && Object.keys(state.puzzleMatches).length > 0) {
      this.puzzleMatches = Object.assign({}, state.puzzleMatches);
    }

    modal.classList.add('active');
    modal.style.display = 'flex';
    this.renderPuzzle1();
    if (window.soundEngine?.playClick) window.soundEngine.playClick();
  }

  closePuzzle1Modal() {
    const modal = document.getElementById('m5-w4-puzzle1-modal');
    if (modal) {
      modal.classList.remove('active');
      modal.style.display = 'none';
    }
  }

  selectPuzzleScenario(scenarioId) {
    this.selectedScenario = (this.selectedScenario === scenarioId) ? null : scenarioId;
    if (this.selectedScenario && this.selectedCategory) {
      this.pairPuzzleScenarioAndCategory(this.selectedScenario, this.selectedCategory);
    } else {
      this.renderPuzzle1();
    }
    if (window.soundEngine?.playClick) window.soundEngine.playClick();
  }

  selectPuzzleCategory(categoryId) {
    this.selectedCategory = (this.selectedCategory === categoryId) ? null : categoryId;
    if (this.selectedScenario && this.selectedCategory) {
      this.pairPuzzleScenarioAndCategory(this.selectedScenario, this.selectedCategory);
    } else {
      this.renderPuzzle1();
    }
    if (window.soundEngine?.playClick) window.soundEngine.playClick();
  }

  pairPuzzleScenarioAndCategory(scenarioId, categoryId) {
    // Single-use assignment: remove previous assignment of this category if any
    Object.keys(this.puzzleMatches).forEach(sId => {
      if (this.puzzleMatches[sId] === categoryId) {
        this.puzzleMatches[sId] = null;
      }
    });

    this.puzzleMatches[scenarioId] = categoryId;
    this.selectedScenario = null;
    this.selectedCategory = null;

    const state = this.getState();
    state.puzzleMatches = Object.assign({}, this.puzzleMatches);
    this.saveState();

    this.renderPuzzle1();
    if (window.soundEngine?.playClick) window.soundEngine.playClick();
  }

  removePuzzlePair(scenarioId) {
    this.puzzleMatches[scenarioId] = null;
    const state = this.getState();
    state.puzzleMatches = Object.assign({}, this.puzzleMatches);
    this.saveState();

    this.renderPuzzle1();
    if (window.soundEngine?.playClick) window.soundEngine.playClick();
  }

  resetPuzzle1() {
    this.puzzleMatches = {};
    this.selectedScenario = null;
    this.selectedCategory = null;
    const state = this.getState();
    state.puzzleMatches = {};
    this.saveState();

    this.renderPuzzle1();
    window.app?.showToast('Motivation Core Puzzle reset. Select a scenario and its matching motivation driver.', 'info');
  }

  submitPuzzle1() {
    const assignedCount = Object.values(this.puzzleMatches).filter(Boolean).length;
    if (assignedCount < 6) {
      if (window.soundEngine?.playError) window.soundEngine.playError();
      window.app?.showToast(`Please match all 6 scenarios before verifying (${assignedCount}/6 connected).`, 'warning');
      return;
    }

    let correctCount = 0;
    const errorScenarios = [];
    this.scenarios.forEach(sc => {
      const assigned = this.puzzleMatches[sc.id];
      if (assigned === sc.correctCategory || (sc.aliases && sc.aliases.includes(assigned))) {
        correctCount++;
      } else {
        errorScenarios.push(sc.id);
      }
    });

    if (correctCount < 6) {
      if (window.soundEngine?.playError) window.soundEngine.playError();
      window.app?.showToast(`${correctCount}/6 matches correct. Review the highlighted mismatches and try again!`, 'warning');
      this.renderPuzzle1(errorScenarios);
      return;
    }

    // 6/6 Correct
    const state = this.getState();
    state.isMotivationPuzzleComplete = true;
    state.isWhyCoreActive = true;
    state.isKnowledgeBox4Unlocked = true;
    this.saveState();

    // Award puzzle token once
    if (window.gameState) {
      window.gameState.addItem({
        id: 'm5_w4_puzzle_token',
        name: 'Motivation Synchronizer Token',
        icon: '🌟',
        type: 'achievement_badge',
        desc: 'Successfully synchronized all 6 motivation drivers to everyday scenarios.'
      });
    }

    if (window.soundEngine?.playSuccess) window.soundEngine.playSuccess();
    window.app?.showToast('🎉 6/6 MATCHES COMPLETE! WHY CORE ACTIVATED! Click the glowing central WHY CORE machine to open Podcast 2.6!', 'reward');

    this.renderPuzzle1();
    this.activateWhyCore();

    // Directly close puzzle modal so player returns to Wall 4 facing the glowing WHY CORE machine
    setTimeout(() => {
      this.closePuzzle1Modal();
    }, 1200);
  }

  renderPuzzle1(errorScenarios = []) {
    const scenariosListEl = document.getElementById('m5-w4-p1-scenarios');
    const categoriesListEl = document.getElementById('m5-w4-p1-categories');
    const connectionsListEl = document.getElementById('m5-w4-p1-connections');
    const progressEl = document.getElementById('m5-w4-p1-progress-count');

    const assignedCount = Object.values(this.puzzleMatches).filter(Boolean).length;
    if (progressEl) {
      progressEl.textContent = `${assignedCount}/6 SCENARIOS MATCHED`;
    }

    if (scenariosListEl) {
      scenariosListEl.innerHTML = this.scenarios.map(sc => {
        const isSelected = (this.selectedScenario === sc.id);
        const assignedCatId = this.puzzleMatches[sc.id];
        const assignedCat = this.categories.find(c => c.id === assignedCatId || (c.aliases && c.aliases.includes(assignedCatId)));
        const isError = errorScenarios.includes(sc.id);

        return `
          <div class="m5-match-card char-card ${isSelected ? 'selected' : ''} ${assignedCatId ? 'assigned' : ''} ${isError ? 'has-error' : ''}"
               onclick="window.module5Wall4.selectPuzzleScenario('${sc.id}')"
               tabindex="0"
               role="button"
               aria-label="Scenario: ${sc.text}">
            <div class="m5-mc-header">
              <span class="m5-mc-name" style="font-size: 13px;">${sc.text}</span>
            </div>
            ${assignedCat ? `
              <div class="m5-mc-assigned-badge" style="border-color: ${assignedCat.color}; color: ${assignedCat.color}; margin-top: 8px;">
                ${assignedCat.icon} ${assignedCat.name}
              </div>
            ` : '<span class="m5-mc-trait" style="margin-top: 6px; font-style: italic;">Click to select scenario</span>'}
          </div>
        `;
      }).join('');
    }

    if (categoriesListEl) {
      categoriesListEl.innerHTML = this.categories.map(cat => {
        const isSelected = (this.selectedCategory === cat.id);
        const assignedScId = Object.keys(this.puzzleMatches).find(sId => this.puzzleMatches[sId] === cat.id);
        const assignedSc = this.scenarios.find(s => s.id === assignedScId);

        return `
          <div class="m5-match-card station-card ${isSelected ? 'selected' : ''} ${assignedScId ? 'assigned' : ''}"
               onclick="window.module5Wall4.selectPuzzleCategory('${cat.id}')"
               tabindex="0"
               role="button"
               aria-label="Category: ${cat.name}">
            <div class="m5-mc-header">
              <span class="m5-mc-icon">${cat.icon}</span>
              <span class="m5-mc-name" style="color: ${cat.color};">${cat.name}</span>
            </div>
            <p style="font-size: 11px; color: #94a3b8; margin: 4px 0 0 0; line-height: 1.3;">${cat.desc}</p>
            ${assignedSc ? `<span class="m5-mc-assigned-badge" style="margin-top: 6px;">Connected ✓</span>` : '<span class="m5-mc-avail">Available</span>'}
          </div>
        `;
      }).join('');
    }

    if (connectionsListEl) {
      const activePairs = Object.entries(this.puzzleMatches).filter(([s, c]) => !!c);
      if (activePairs.length === 0) {
        connectionsListEl.innerHTML = '<div class="m5-empty-connections">Select an everyday scenario and choose the matching motivation driver.</div>';
      } else {
        connectionsListEl.innerHTML = activePairs.map(([sId, cId]) => {
          const sc = this.scenarios.find(s => s.id === sId);
          const cat = this.categories.find(c => c.id === cId || (c.aliases && c.aliases.includes(cId)));
          const isError = errorScenarios.includes(sId);

          return `
            <div class="m5-connection-chip ${isError ? 'error-chip' : ''}">
              <span class="m5-cc-text">
                "${sc.text.substring(0, 38)}..." ➔ <strong>${cat.icon} ${cat.name}</strong>
              </span>
              <button type="button" class="m5-cc-remove-btn" onclick="window.module5Wall4.removePuzzlePair('${sId}')" title="Disconnect match">✕</button>
            </div>
          `;
        }).join('');
      }
    }
  }

  activateWhyCore() {
    const whyCore = document.getElementById('m5-w4-why-core');
    if (whyCore) whyCore.classList.add('illuminated');

    const overlay = document.getElementById('m5-w4-why-core-overlay');
    if (overlay) overlay.classList.add('active');

    this.syncWallUI();
  }

  openWhyCoreActivatedModal() {
    const modal = document.getElementById('m5-w4-activated-modal');
    if (modal) {
      modal.classList.add('active');
      modal.style.display = 'flex';
      if (window.soundEngine?.playSuccess) window.soundEngine.playSuccess();
    }
  }

  closeWhyCoreActivatedModal() {
    const modal = document.getElementById('m5-w4-activated-modal');
    if (modal) {
      modal.classList.remove('active');
      modal.style.display = 'none';
    }
  }

  clickWhyCore() {
    // User request: "i should see the podcast 2.6 after clicking this image remove from other images"
    const state = this.getState();
    state.isWhyCoreActive = true;
    state.isKnowledgeBox4Unlocked = true;
    this.saveState();

    if (window.soundEngine?.playSuccess) {
      window.soundEngine.playSuccess();
    } else if (window.soundEngine?.playClick) {
      window.soundEngine.playClick();
    }
    window.app?.showToast('🎧 Podcast 2.6: Building a Strong Foundation for Career.', 'reward');
    this.openKB4Modal('podcast');
  }

  clickActivateConsole() {
    const state = this.getState();
    if (!state.isMotivationPuzzleComplete) {
      this.openPuzzle1Modal();
    } else {
      window.app?.showToast('⚡ Motivation drivers synchronized. Click the central WHY CORE machine to view Podcast 2.6.', 'info');
    }
  }

  openMotivationPanel() {
    this.openPuzzle1Modal();
  }

  closeMotivationPanel() {
    this.closePuzzle1Modal();
  }

  openCardsConsole() {
    this.openPuzzle1Modal();
  }

  openCareerFoundationPanel() {
    // Opens Career Foundation (My Career Roots) activity directly, NEVER podcast 2.6
    this.openKB4Modal('career_roots');
  }

  closeCareerFoundationPanel() {
    this.closeKB4Modal();
  }

  // ============================================================
  // OBJECT 2: KNOWLEDGE BOX 4 (MODULE 2.6)
  // ============================================================
  openKB4Modal(targetTab = null) {
    if (targetTab) {
      this.kb4ActiveTab = targetTab;
    } else {
      this.kb4ActiveTab = 'podcast';
    }

    const modal = document.getElementById('m5-w4-kb4-modal');
    if (modal) {
      modal.classList.add('active');
      modal.style.display = 'flex';
      this.syncKB4Modal();
      if (window.soundEngine?.playClick) window.soundEngine.playClick();
    }
  }

  togglePlayAudio(trackId = '2.6') {
    this.isPlayingAudio = !this.isPlayingAudio;
    const playBtn = document.getElementById('m5-audio-play-btn-26');
    const screenPlayBtn = document.getElementById('m5-video-play-btn-26');
    const screenStatus = document.getElementById('m5-video-status-text-26');

    if (this.isPlayingAudio) {
      if (playBtn) playBtn.innerHTML = '<span>⏸ Pause Video</span>';
      if (screenPlayBtn) screenPlayBtn.textContent = '⏸';
      if (screenStatus) screenStatus.textContent = 'STREAMING MODULE 2.6 VIDEO...';
      if (window.soundEngine?.playClick) window.soundEngine.playClick();
    } else {
      if (playBtn) playBtn.innerHTML = '<span>▶ Play Video</span>';
      if (screenPlayBtn) screenPlayBtn.textContent = '▶';
      if (screenStatus) screenStatus.textContent = 'CLICK SCREEN TO PLAY VIDEO';
      if (window.soundEngine?.playClick) window.soundEngine.playClick();
    }
  }

  seekAudio(time, trackId = '2.6') {
    this.currentTrackTime = Math.max(0, Math.min(this.trackDuration || 255, Math.floor(time || 0)));
    const currEl = document.getElementById('m5-audio-current-time-26');
    const seekbar = document.getElementById('m5-audio-seekbar-26');
    if (currEl) {
      const mins = Math.floor(this.currentTrackTime / 60);
      const secs = (this.currentTrackTime % 60).toString().padStart(2, '0');
      currEl.textContent = `${mins}:${secs}`;
    }
    if (seekbar) {
      seekbar.value = Math.floor((this.currentTrackTime / (this.trackDuration || 255)) * 100);
    }
  }

  closeKB4Modal() {
    const modal = document.getElementById('m5-w4-kb4-modal');
    if (modal) {
      modal.classList.remove('active');
      modal.style.display = 'none';
    }
  }

  switchKB4Tab(tabKey) {
    this.kb4ActiveTab = tabKey;
    this.syncKB4Modal();
    if (window.soundEngine?.playClick) window.soundEngine.playClick();
  }

  syncKB4Modal() {
    const modal = document.getElementById('m5-w4-kb4-modal');
    if (!modal) return;

    modal.querySelectorAll('.m5-w4-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === this.kb4ActiveTab);
    });

    const panels = {
      podcast: document.getElementById('m5-w4-panel-podcast'),
      discussion: document.getElementById('m5-w4-panel-discussion'),
      career_roots: document.getElementById('m5-w4-panel-career-roots'),
      progress: document.getElementById('m5-w4-panel-progress')
    };

    Object.keys(panels).forEach(k => {
      if (panels[k]) {
        panels[k].style.display = (this.kb4ActiveTab === k) ? 'block' : 'none';
      }
    });

    this.updateCompactProgressUI();

    if (this.kb4ActiveTab === 'discussion') {
      this.renderDiscussionGuide();
    } else if (this.kb4ActiveTab === 'career_roots') {
      this.renderCareerRoots();
    } else if (this.kb4ActiveTab === 'progress') {
      this.renderProgressDashboard();
    }
  }

  updateCompactProgressUI() {
    const state = this.getState();
    const trackerEl = document.getElementById('m5-w4-compact-tracker');
    if (!trackerEl) return;

    const stages = [
      { name: '1. Motivation Core', done: state.isMotivationPuzzleComplete },
      { name: '2. Podcast 2.6 Review', done: state.isPodcast26Reviewed },
      { name: '3. Discussion Guide', done: state.isDiscussionGuideReviewed },
      { name: '4. My Career Roots', done: state.isCareerRootsComplete },
      { name: '5. Wall 4 Complete', done: state.isWall4Complete }
    ];

    trackerEl.innerHTML = stages.map(s => `
      <div class="m5-compact-step ${s.done ? 'step-done' : ''}">
        <span class="m5-step-indicator">${s.done ? '✓' : '○'}</span>
        <span class="m5-step-label">${s.name}</span>
      </div>
    `).join('<div class="m5-step-connector"></div>');
  }

  // ============================================================
  // TAB 1: PODCAST 2.6 SOURCE-TEXT REVIEW
  // ============================================================
  confirmPodcast26Reviewed() {
    const state = this.getState();
    state.isPodcast26Reviewed = true;
    this.saveState();

    if (window.soundEngine?.playSuccess) window.soundEngine.playSuccess();
    window.app?.showToast('✓ Source-Text Review confirmed! Proceed to the Original Discussion Guide.', 'reward');

    this.syncKB4Modal();
    this.switchKB4Tab('discussion');
  }

  // ============================================================
  // TAB 2: ORIGINAL DISCUSSION GUIDE (3 QUESTIONS)
  // ============================================================
  toggleDiscussionQuestion(qIndex) {
    const cardEl = document.getElementById(`m5-w4-disc-card-${qIndex}`);
    if (!cardEl) return;

    const isOpen = cardEl.classList.contains('expanded');
    cardEl.classList.toggle('expanded', !isOpen);

    if (!isOpen) {
      const state = this.getState();
      if (!state.discussionQuestionsReviewed) state.discussionQuestionsReviewed = [false, false, false];
      state.discussionQuestionsReviewed[qIndex] = true;
      this.saveState();
      this.renderDiscussionGuide();
    }

    if (window.soundEngine?.playClick) window.soundEngine.playClick();
  }

  markDiscussionGuideReviewed() {
    const state = this.getState();
    const views = state.discussionQuestionsReviewed || [false, false, false];
    const allViewed = views[0] && views[1] && views[2];

    if (!allViewed) {
      if (window.soundEngine?.playError) window.soundEngine.playError();
      window.app?.showToast('Please open and review all 3 discussion questions before marking as reviewed.', 'warning');
      return;
    }

    state.isDiscussionGuideReviewed = true;
    this.saveState();

    if (window.soundEngine?.playSuccess) window.soundEngine.playSuccess();
    window.app?.showToast('✓ Original Discussion Guide marked as reviewed! My Career Roots is now unlocked.', 'reward');

    this.syncKB4Modal();
    this.switchKB4Tab('career_roots');
  }

  renderDiscussionGuide() {
    const state = this.getState();
    const views = state.discussionQuestionsReviewed || [false, false, false];
    const allViewed = views[0] && views[1] && views[2];

    const markBtn = document.getElementById('m5-w4-disc-mark-btn');
    if (markBtn) {
      if (state.isDiscussionGuideReviewed) {
        markBtn.textContent = '✓ DISCUSSION GUIDE REVIEWED (COMPLETE)';
        markBtn.classList.remove('btn-outline');
        markBtn.classList.add('btn-gold');
      } else if (allViewed) {
        markBtn.textContent = '✓ MARK DISCUSSION GUIDE AS REVIEWED ➔';
        markBtn.disabled = false;
        markBtn.classList.remove('btn-outline');
        markBtn.classList.add('btn-gold');
      } else {
        const viewedCount = views.filter(Boolean).length;
        markBtn.textContent = `REVIEW ALL QUESTIONS (${viewedCount}/3 VIEWED)`;
        markBtn.disabled = true;
        markBtn.classList.add('btn-outline');
        markBtn.classList.remove('btn-gold');
      }
    }

    for (let i = 0; i < 3; i++) {
      const badgeEl = document.getElementById(`m5-w4-disc-badge-${i}`);
      if (badgeEl) {
        if (views[i]) {
          badgeEl.textContent = '✓ REVIEWED';
          badgeEl.classList.remove('pending');
          badgeEl.classList.add('completed');
        } else {
          badgeEl.textContent = 'UNREAD';
          badgeEl.classList.add('pending');
          badgeEl.classList.remove('completed');
        }
      }
    }
  }

  // ============================================================
  // TAB 3: MY CAREER ROOTS — BUILD YOUR FOUNDATION
  // ============================================================
  switchRootsStep(stepKey) {
    this.rootsActiveStep = stepKey;
    this.renderCareerRoots();
    if (window.soundEngine?.playClick) window.soundEngine.playClick();
  }

  updateRootsInput(field, value) {
    const state = this.getState();
    if (!state.careerRoots) state.careerRoots = {};
    state.careerRoots[field] = value;
    this.saveState();
  }

  setFinancialRating(rating) {
    const state = this.getState();
    if (!state.careerRoots) state.careerRoots = {};
    state.careerRoots.financialScore = parseInt(rating);
    this.saveState();
    this.renderCareerRoots();
    if (window.soundEngine?.playClick) window.soundEngine.playClick();
  }

  toggleSuperpowerTag(tag) {
    const state = this.getState();
    if (!state.careerRoots) state.careerRoots = {};
    if (!state.careerRoots.superpowerTags) state.careerRoots.superpowerTags = [];

    const idx = state.careerRoots.superpowerTags.indexOf(tag);
    if (idx >= 0) {
      state.careerRoots.superpowerTags.splice(idx, 1);
    } else {
      state.careerRoots.superpowerTags.push(tag);
    }
    this.saveState();
    this.renderCareerRoots();
  }

  saveCareerRootsResponses() {
    this.saveState();
    if (window.soundEngine?.playSuccess) window.soundEngine.playSuccess();
    window.app?.showToast('💾 Your Career Roots reflections have been saved!', 'reward');
  }

  markCareerRootsComplete() {
    const state = this.getState();
    const r = state.careerRoots || {};

    const learningFilled = (r.learning && r.learning.trim().length >= 5);
    const networkFilled = (r.network && r.network.trim().length >= 5);
    const superpowerFilled = (r.superpower && r.superpower.trim().length >= 5) || (r.superpowerTags && r.superpowerTags.length > 0);

    if (!learningFilled || !networkFilled || !superpowerFilled) {
      if (window.soundEngine?.playError) window.soundEngine.playError();
      window.app?.showToast('Please provide your reflections in Learning, Network, and Superpower sections before completing.', 'warning');
      return;
    }

    state.isCareerRootsComplete = true;
    this.saveState();

    if (window.soundEngine?.playSuccess) window.soundEngine.playSuccess();
    window.app?.showToast('🎉 MY CAREER ROOTS COMPLETED! Your foundation has been established.', 'reward');

    this.checkWall4Complete();
    this.renderCareerRoots();

    setTimeout(() => {
      this.closeKB4Modal();
      this.showFinalClueModal();
    }, 1200);
  }

  renderCareerRoots() {
    const state = this.getState();
    const r = state.careerRoots || {};

    // Update sub-navigation tab highlights
    document.querySelectorAll('.m5-roots-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.step === this.rootsActiveStep);
    });

    // Sub-panels
    const subPanels = {
      learning: document.getElementById('m5-roots-panel-learning'),
      network: document.getElementById('m5-roots-panel-network'),
      financial: document.getElementById('m5-roots-panel-financial'),
      superpower: document.getElementById('m5-roots-panel-superpower'),
      review: document.getElementById('m5-roots-panel-review')
    };

    Object.keys(subPanels).forEach(k => {
      if (subPanels[k]) {
        subPanels[k].style.display = (this.rootsActiveStep === k) ? 'block' : 'none';
      }
    });

    // Populate inputs with saved state
    const learningInput = document.getElementById('m5-roots-learning-input');
    if (learningInput && r.learning !== undefined) learningInput.value = r.learning;

    const learningActionInput = document.getElementById('m5-roots-learning-action');
    if (learningActionInput && r.learningAction !== undefined) learningActionInput.value = r.learningAction;

    const networkInput = document.getElementById('m5-roots-network-input');
    if (networkInput && r.network !== undefined) networkInput.value = r.network;

    const networkSupportInput = document.getElementById('m5-roots-network-support');
    if (networkSupportInput && r.networkSupport !== undefined) networkSupportInput.value = r.networkSupport;

    const financialScore = r.financialScore || 3;
    const finScaleEl = document.getElementById('m5-roots-financial-score-val');
    if (finScaleEl) finScaleEl.textContent = `${financialScore} / 5`;

    document.querySelectorAll('.m5-fin-rating-btn').forEach(btn => {
      btn.classList.toggle('selected', parseInt(btn.dataset.rating) === financialScore);
    });

    const finNotesInput = document.getElementById('m5-roots-financial-notes');
    if (finNotesInput && r.financialNotes !== undefined) finNotesInput.value = r.financialNotes;

    const finGoalInput = document.getElementById('m5-roots-financial-goal');
    if (finGoalInput && r.financialGoal !== undefined) finGoalInput.value = r.financialGoal;

    const superInput = document.getElementById('m5-roots-superpower-input');
    if (superInput && r.superpower !== undefined) superInput.value = r.superpower;

    // Superpower tags
    const activeTags = r.superpowerTags || [];
    document.querySelectorAll('.m5-super-tag-pill').forEach(pill => {
      pill.classList.toggle('active', activeTags.includes(pill.dataset.tag));
    });

    // Review Summary Section
    const summaryContainer = document.getElementById('m5-roots-summary-box');
    if (summaryContainer && this.rootsActiveStep === 'review') {
      summaryContainer.innerHTML = `
        <div class="m5-roots-summary-card">
          <h4>🌟 My Career Roots Summary</h4>
          <div class="m5-rs-item">
            <strong>1. What I am learning that helps me grow:</strong>
            <p>${r.learning ? r.learning : '<em>Not yet specified</em>'}</p>
            ${r.learningAction ? `<small>Action this week: ${r.learningAction}</small>` : ''}
          </div>
          <div class="m5-rs-item">
            <strong>2. My network & relationships:</strong>
            <p>${r.network ? r.network : '<em>Not yet specified</em>'}</p>
            ${r.networkSupport ? `<small>Support goal: ${r.networkSupport}</small>` : ''}
          </div>
          <div class="m5-rs-item">
            <strong>3. Financial awareness:</strong>
            <p>Self-Rating: ${r.financialScore || 3} / 5</p>
            <p>${r.financialNotes ? r.financialNotes : '<em>No observations provided</em>'}</p>
            ${r.financialGoal ? `<small>Learning goal: ${r.financialGoal}</small>` : ''}
          </div>
          <div class="m5-rs-item">
            <strong>4. My superpower & supporting others:</strong>
            <p>${r.superpower ? r.superpower : '<em>Not yet specified</em>'}</p>
            ${activeTags.length > 0 ? `<div class="m5-rs-tags">${activeTags.map(t => `<span class="m5-rs-tag">✓ ${t}</span>`).join(' ')}</div>` : ''}
          </div>
        </div>
      `;
    }
  }

  // ============================================================
  // OBJECT 3: PROGRESS DASHBOARD & WALL 4 COMPLETION
  // ============================================================
  renderProgressDashboard() {
    const container = document.getElementById('m5-w4-progress-dashboard');
    if (!container) return;

    const state = this.getState();

    container.innerHTML = `
      <div class="m5-progress-dashboard-card">
        <h3 style="color: #ffd700; margin-top: 0;">WALL 4 — GROW: MASTER PROGRESS</h3>
        <p style="font-size: 13px; color: #cbd5e1; margin-bottom: 16px;">
          Module 2.6: Building a Strong Foundation for Career (Learning, Networking, Financial Awareness & Purpose)
        </p>

        <div class="m5-pd-grid">
          <div class="m5-pd-item ${state.isMotivationPuzzleComplete ? 'completed' : ''}">
            <span class="m5-pd-status">${state.isMotivationPuzzleComplete ? '✓ COMPLETED' : 'PENDING'}</span>
            <h4>1. Motivation Core</h4>
            <p>Synchronized 6 motivation drivers to everyday scenarios.</p>
          </div>

          <div class="m5-pd-item ${state.isPodcast26Reviewed ? 'completed' : ''}">
            <span class="m5-pd-status">${state.isPodcast26Reviewed ? '✓ REVIEWED' : 'PENDING'}</span>
            <h4>2. Podcast 2.6 Source Review</h4>
            <p>Reviewed source text on adaptability, relationships, and finance.</p>
          </div>

          <div class="m5-pd-item ${state.isDiscussionGuideReviewed ? 'completed' : ''}">
            <span class="m5-pd-status">${state.isDiscussionGuideReviewed ? '✓ REVIEWED' : 'PENDING'}</span>
            <h4>3. Original Discussion Guide</h4>
            <p>All 3 expert discussion questions and pointers analyzed.</p>
          </div>

          <div class="m5-pd-item ${state.isCareerRootsComplete ? 'completed' : ''}">
            <span class="m5-pd-status">${state.isCareerRootsComplete ? '✓ COMPLETED' : 'PENDING'}</span>
            <h4>4. My Career Roots Activity</h4>
            <p>4 reflection areas completed, saved, and confirmed.</p>
          </div>

          <div class="m5-pd-item ${state.isWall4Complete ? 'completed' : ''}">
            <span class="m5-pd-status">${state.isWall4Complete ? '✓ COMPLETED' : 'PENDING'}</span>
            <h4>5. Wall 4 & Exit Unlocked</h4>
            <p>Revealed Final Clue and unlocked Entrepreneurial Lab Exit.</p>
          </div>
        </div>

        <div class="m5-pd-action-row" style="text-align: center; margin-top: 20px;">
          ${state.isWall4Complete ? `
            <button type="button" class="btn btn-gold btn-lg" onclick="window.module5Wall4.showFinalClueModal()">
              📜 VIEW FINAL CLUE & EXIT LAB ➔
            </button>
          ` : `
            <div class="m5-pd-incomplete-notice">
              <span>Complete all 4 required learning stages above to reveal the Final Clue and unlock the Exit Portal.</span>
            </div>
          `}
        </div>
      </div>
    `;
  }

  checkWall4Complete() {
    const state = this.getState();
    const isComplete = (
      state.isMotivationPuzzleComplete &&
      state.isWhyCoreActive &&
      state.isPodcast26Reviewed &&
      state.isDiscussionGuideReviewed &&
      state.isCareerRootsComplete
    );

    if (isComplete) {
      state.isWall4Complete = true;
      state.isFinalClueRevealed = true;
      state.isExitUnlocked = true;
      state.isLabCompleted = true;

      // Award Wall 4 Rewards once
      if (window.gameState) {
        window.gameState.addItem({
          id: 'm5_w4_foundation_badge',
          name: 'Career Foundation Badge',
          icon: '🌱',
          type: 'achievement_badge',
          desc: 'Mastered the four pillars of building a strong career foundation (Module 2.6).'
        });
        window.gameState.addItem({
          id: 'm5_w4_clue',
          name: 'Clue 04: The Foundation Directive',
          icon: '📜',
          type: 'clue',
          desc: 'You have discovered your WHY and explored the roots that can support your journey. Your next step is to turn that awareness into action.'
        });
      }

      this.saveState();
      this.syncWallUI();
    }
  }

  // ============================================================
  // OBJECT 4: FINAL CLUE MODAL
  // ============================================================
  showFinalClueModal() {
    this.checkWall4Complete();
    const modal = document.getElementById('m5-w4-clue-modal');
    if (modal) {
      modal.classList.add('active');
      modal.style.display = 'flex';
      if (window.soundEngine?.playSuccess) window.soundEngine.playSuccess();
    }
  }

  closeFinalClueModal() {
    const modal = document.getElementById('m5-w4-clue-modal');
    if (modal) {
      modal.classList.remove('active');
      modal.style.display = 'none';
    }
  }

  // ============================================================
  // OBJECT 5: EXIT DOOR & COMPLETION SCREEN
  // ============================================================
  clickExitDoor() {
    const state = this.getState();
    if (!state.isWall4Complete) {
      if (window.soundEngine?.playError) window.soundEngine.playError();
      window.app?.showToast('🔒 The Exit Portal is locked. Complete all Wall 4 stages to unlock!', 'warning');
      return;
    }
    this.openExitModal();
  }

  openExitModal() {
    const modal = document.getElementById('m5-w4-exit-modal');
    if (modal) {
      modal.classList.add('active');
      modal.style.display = 'flex';
      this.renderCompletionScreen();
      if (window.soundEngine?.playSuccess) window.soundEngine.playSuccess();
    }
  }

  closeExitModal() {
    const modal = document.getElementById('m5-w4-exit-modal');
    if (modal) {
      modal.classList.remove('active');
      modal.style.display = 'none';
    }
  }

  exitRoom() {
    this.closeExitModal();
    this.closeFinalClueModal();
    this.closeKB4Modal();
    this.closeWallSelectionScreen();

    // Mark Wall 4 & Module 5 complete
    const state = this.getState();
    state.isWall4Complete = true;
    state.isExitUnlocked = true;
    state.isLabCompleted = true;
    this.saveState();

    // Sound effect
    if (window.soundEngine?.playEscapeFanfare) {
      window.soundEngine.playEscapeFanfare();
    } else if (window.soundEngine?.playSuccess) {
      window.soundEngine.playSuccess();
    }

    // Solve room 5 in gameState if available
    if (window.roomController?.solveSpecializedRoom) {
      window.roomController.solveSpecializedRoom(5);
    } else if (window.gameState?.state?.rooms?.[5]) {
      const r5 = window.gameState.state.rooms[5];
      r5.escaped = true;
      r5.status = 'completed';
      r5.progress = 100;
      window.gameState.save();
    }

    // Switch stage back from room-mode-module5 to room-mode-room1
    const stage = document.getElementById('walls-master-stage');
    if (stage) {
      stage.classList.remove('room-mode-module5');
      stage.classList.add('room-mode-room1');
    }

    // Reset current room to study / room 1
    if (window.gameState?.state) {
      window.gameState.state.currentRoomId = 1;
    }
    if (window.vintageRoomEngine) {
      window.vintageRoomEngine.setWall(1);
    }
    if (window.app?.updateHUD) {
      window.app.updateHUD();
    }

    // Open Grand Mastery Corridor
    if (window.roomController?.openMasteryCorridor) {
      window.roomController.openMasteryCorridor();
    } else if (window.app?.openModal) {
      window.app.openModal('mastery-corridor-modal');
    }

    if (window.app?.showToast) {
      window.app.showToast('🎉 CONGRATULATIONS! You have successfully escaped the Entrepreneurial Lab!', 'reward');
    }
  }

  openExit() {
    this.exitRoom();
  }

  renderCompletionScreen() {
    const s1 = window.module5State?.isWall1Complete ? window.module5State.isWall1Complete() : true;
    const s2 = window.module5State?.isWall2Complete ? window.module5State.isWall2Complete() : true;
    const s3 = window.module5State?.isWall3Complete ? window.module5State.isWall3Complete() : true;
    const s4 = this.getState().isWall4Complete;

    const badgesContainer = document.getElementById('m5-w4-completion-stages');
    if (badgesContainer) {
      badgesContainer.innerHTML = `
        <div class="m5-stage-pill ${s1 ? 'done' : ''}">
          <span class="m5-sp-name">THINK</span>
          <span class="m5-sp-check">${s1 ? '✓' : '○'}</span>
          <small>Understand the entrepreneurial mindset.</small>
        </div>
        <div class="m5-stage-pill ${s2 ? 'done' : ''}">
          <span class="m5-sp-name">PLAN</span>
          <span class="m5-sp-check">${s2 ? '✓' : '○'}</span>
          <small>Explore your future career journey.</small>
        </div>
        <div class="m5-stage-pill ${s3 ? 'done' : ''}">
          <span class="m5-sp-name">ACT</span>
          <span class="m5-sp-check">${s3 ? '✓' : '○'}</span>
          <small>Recognize entrepreneurship in everyday problems.</small>
        </div>
        <div class="m5-stage-pill ${s4 ? 'done' : ''}">
          <span class="m5-sp-name">GROW</span>
          <span class="m5-sp-check">${s4 ? '✓' : '○'}</span>
          <small>Understand your WHY and build a strong career foundation.</small>
        </div>
      `;
    }
  }

  // ============================================================
  // OBJECT 6: FOUR-DOOR WALL SELECTION SCREEN
  // ============================================================
  openWallSelectionScreen() {
    this.closeExitModal();
    this.closeFinalClueModal();
    this.closeKB4Modal();

    const modal = document.getElementById('m5-wall-selection-modal');
    if (modal) {
      modal.classList.add('active');
      modal.style.display = 'flex';
      this.renderWallDoors();
      if (window.soundEngine?.playClick) window.soundEngine.playClick();
    }
  }

  closeWallSelectionScreen() {
    const modal = document.getElementById('m5-wall-selection-modal');
    if (modal) {
      modal.classList.remove('active');
      modal.style.display = 'none';
    }
  }

  renderWallDoors() {
    const container = document.getElementById('m5-wall-doors-grid');
    if (!container) return;

    const s1 = window.module5State?.isWall1Complete ? window.module5State.isWall1Complete() : false;
    const s2 = window.module5State?.isWall2Complete ? window.module5State.isWall2Complete() : false;
    const s3 = window.module5State?.isWall3Complete ? window.module5State.isWall3Complete() : false;
    const s4 = this.getState().isWall4Complete;

    const doors = [
      {
        num: 1,
        title: 'WALL 1 — MINDSET SCANNER',
        subtitle: 'THINK',
        desc: 'Explore the 4 Mindset Archetypes and practice Scan & Match analysis.',
        isComplete: s1,
        isPermitted: true,
        badgeColor: '#00f2fe'
      },
      {
        num: 2,
        title: 'WALL 2 — CAREER SIMULATION LAB',
        subtitle: 'PLAN',
        desc: 'Arrange chronological career horizons and build your Dream Career Journey.',
        isComplete: s2,
        isPermitted: true,
        badgeColor: '#38ef7d'
      },
      {
        num: 3,
        title: 'WALL 3 — REAL-WORLD SIMULATOR',
        subtitle: 'ACT',
        desc: 'Connect everyday situations, complete Module 2.4 & Module 2.5 Motivation Core.',
        isComplete: s3,
        isPermitted: true,
        badgeColor: '#f59e0b'
      },
      {
        num: 4,
        title: 'WALL 4 — MOTIVATION CORE',
        subtitle: 'GROW',
        desc: 'Synchronize your WHY, complete Module 2.6, and build My Career Roots.',
        isComplete: s4,
        isPermitted: true,
        badgeColor: '#ec4899'
      }
    ];

    container.innerHTML = doors.map(d => `
      <div class="m5-wall-door-card ${d.isComplete ? 'door-completed' : ''}"
           onclick="window.module5Wall4.selectWallDoor(${d.num})">
        <div class="m5-wd-header">
          <span class="m5-wd-number">DOOR 0${d.num}</span>
          <span class="m5-wd-status ${d.isComplete ? 'completed' : 'in-progress'}">
            ${d.isComplete ? '✓ COMPLETED' : 'IN PROGRESS'}
          </span>
        </div>
        <div class="m5-wd-portal-visual">
          <div class="m5-wd-portal-ring" style="border-color: ${d.badgeColor};"></div>
          <div class="m5-wd-portal-core" style="background: ${d.badgeColor}22;">
            <span class="m5-wd-subtitle-badge" style="color: ${d.badgeColor};">${d.subtitle}</span>
          </div>
        </div>
        <h3 class="m5-wd-title">${d.title}</h3>
        <p class="m5-wd-desc">${d.desc}</p>
        <button type="button" class="btn btn-primary m5-wd-enter-btn" style="border-color: ${d.badgeColor};">
          ENTER WALL ${d.num} ➔
        </button>
      </div>
    `).join('');
  }

  selectWallDoor(wallNum) {
    this.closeWallSelectionScreen();

    if (window.vintageRoomEngine) {
      window.vintageRoomEngine.setWall(wallNum);
    } else if (window.module5Engine) {
      window.module5Engine.setWall(wallNum);
    }

    window.app?.showToast(`Navigated to Wall ${wallNum}!`, 'info');
  }

  // ============================================================
  // WALL UI SYNCHRONIZATION
  // ============================================================
  syncWallUI() {
    const state = this.getState();

    // Central WHY Core machine
    const whyCore = document.getElementById('m5-w4-why-core');
    if (whyCore) {
      whyCore.classList.toggle('illuminated', !!state.isWhyCoreActive);
    }

    const whyOverlay = document.getElementById('m5-w4-why-core-overlay');
    if (whyOverlay) {
      whyOverlay.classList.toggle('active', !!state.isWhyCoreActive);
    }

    // Exit Door
    const exitDoor = document.getElementById('m5-w4-exit-door');
    if (exitDoor) {
      exitDoor.classList.toggle('unlocked', !!state.isWall4Complete);
    }

    const exitGlow = document.getElementById('m5-w4-exit-glow');
    if (exitGlow) {
      exitGlow.classList.toggle('active', !!state.isWall4Complete);
    }
  }
}

window.module5Wall4 = new Module5Wall4Controller();
