/**
 * ACADEMY ESCAPE ROOM
 * MODULE 5: THE BROKEN STARTUP — NOVALINK INCIDENT
 * Core Interactive Room Engine & Tactile Micro-Puzzle Controller
 */

class Module5Engine {
  constructor() {
    this.currentWall = 1;
    this.activeScenario = 'food_delivery';
    this.currentAct1Index = 0;
    this.currentAct2SelectedCardId = null;
    this.currentAct3Index = 0;
    this.currentCaseIndex = 0;
    this.combinationLockDigits = [0, 0, 0, 0, 0];
    this.detectiveCodeStrip = ['_', '_', '_', '_', '_'];

    // Product Time Machine Drag & Drop State
    this.ptmDragState = {
      scenarioKey: 'food_delivery',
      cards: [],
      slots: { USER: null, PROBLEM: null, NEED: null, PRODUCT: null },
      submitted: false,
      isCorrect: false,
      validationMessage: null
    };
  }

  init() {
    this.activeScenario = window.module5State?.state?.selectedProductScenario || 'food_delivery';
    this.currentWall = window.module5State?.state?.currentWall || 1;
    this.initPTMScenario(this.activeScenario);
    if (window.module5Wall1?.init) {
      window.module5Wall1.init();
    }
    if (window.module5Wall2?.init) {
      window.module5Wall2.init();
    }
  }

  open() {
    this.init();
    if (window.gameState) {
      window.gameState.state.currentRoomId = 5;
      window.gameState.save();
    }

    const stage = document.getElementById('walls-master-stage');
    if (stage) {
      stage.classList.remove('room-mode-room1', 'relationship-mode');
      stage.classList.add('room-mode-module5');
    }

    if (window.vintageRoomEngine) {
      window.vintageRoomEngine.setWall(this.currentWall);
    }

    this.updateDoorStatus();
    this.updateObjectiveText();
    this.updateHotspotLockBadges();

    if (window.soundEngine) window.soundEngine.playSuccess();
    if (window.app) window.app.updateHUD();
  }

  close() {
    if (window.roomController) {
      window.roomController.openMasteryCorridor();
    }
  }

  setWall(wallNum) {
    if (wallNum < 1) wallNum = 4;
    if (wallNum > 4) wallNum = 1;

    this.currentWall = wallNum;
    if (window.module5State) {
      window.module5State.state.currentWall = wallNum;
      window.module5State.save();
    }

    if (window.vintageRoomEngine && window.vintageRoomEngine.currentWall !== wallNum) {
      window.vintageRoomEngine.setWall(wallNum);
    }

    if (window.module5Wall1?.syncWallUI) {
      window.module5Wall1.syncWallUI();
    }
    if (window.module5Wall2?.syncWallUI) {
      window.module5Wall2.syncWallUI();
    }

    this.updateObjectiveText();
    this.updateHotspotLockBadges();
  }

  nextWall() {
    if (window.vintageRoomEngine) {
      window.vintageRoomEngine.nextWall();
    } else {
      this.setWall(this.currentWall + 1);
    }
  }

  prevWall() {
    if (window.vintageRoomEngine) {
      window.vintageRoomEngine.prevWall();
    } else {
      this.setWall(this.currentWall - 1);
    }
  }

  updateDoorStatus() {
    const badge = document.getElementById('m5-w1-status-tag');
    const isUnlocked = window.module5State?.state?.rootCauseIdentified || window.module5State?.state?.completed;

    if (badge) {
      if (isUnlocked) {
        badge.textContent = 'ROOT CAUSE IDENTIFIED • ACCESS GRANTED';
        badge.className = 'm5-door-status-badge unlocked';
      } else {
        badge.textContent = 'ROOT CAUSE NOT IDENTIFIED • LOCKED';
        badge.className = 'm5-door-status-badge locked';
      }
    }
  }

  updateObjectiveText() {
    const objEl = document.getElementById('hud-objective-text') || document.getElementById('m5-objective-text');
    if (!objEl) return;

    const progress = window.module5State ? window.module5State.getModule5Progress() : {};

    if (progress.exitGateUnlocked) {
      objEl.textContent = "🎯 Root Cause Identified! Return to Wall 1 & click the Emergency Exit door to escape!";
      return;
    }

    const activeW = window.vintageRoomEngine ? window.vintageRoomEngine.currentWall : this.currentWall;

    switch (activeW) {
      case 1:
        if (window.module5State && window.module5State.state.wall1) {
          const w1 = window.module5State.state.wall1;
          if (!w1.isPuzzleComplete) {
            objEl.textContent = "🎯 Wall 1: Match the 3 founder stories on the Scan & Match console to activate the Scanner!";
          } else if (!w1.completedModule21MediaIds || w1.completedModule21MediaIds.length === 0) {
            objEl.textContent = "🎯 Wall 1: Scanner active! Open Knowledge Box 1 & listen to Module 2.1 Podcast.";
          } else if (!w1.isModule21QuizPassed) {
            objEl.textContent = "🎯 Wall 1: Complete Module 2.1 Knowledge Check (score 4/5 required).";
          } else if (!w1.completedModule21ActivityIds || w1.completedModule21ActivityIds.length < 3) {
            objEl.textContent = "🎯 Wall 1: Complete the Inspiring Founder Stories trait activity.";
          } else if (!w1.isPuzzle2Complete) {
            objEl.textContent = "🎯 Wall 1: Solve Transition Puzzle 2 to unlock Module 2.2!";
          } else if (!w1.completedModule22MediaIds || w1.completedModule22MediaIds.length === 0) {
            objEl.textContent = "🎯 Wall 1: Listen to Module 2.2 Podcast in Knowledge Box 1.";
          } else if (!w1.isModule22QuizPassed) {
            objEl.textContent = "🎯 Wall 1: Pass Module 2.2 Knowledge Check.";
          } else if (!window.module5Wall1?.hasCompletedModule22SelfAssessment(w1)) {
            objEl.textContent = "🎯 Wall 1: Rate all 15 Module 2.2 characteristics from 1 to 5 to unlock Clue 01.";
          } else {
            objEl.textContent = "🎯 Wall 1 Complete! Clue 01 revealed. Proceed to Wall 2 (Career Simulation Lab).";
          }
        } else {
          objEl.textContent = "🎯 Wall 1: Match the founder stories on the console to activate the Mindset Scanner.";
        }
        break;
      case 2:
        if (window.module5State && window.module5State.state.wall2) {
          const w2 = window.module5State.state.wall2;
          if (!w2.isPuzzleSolved) {
            objEl.textContent = "🎯 Wall 2: Arrange the 30-year career timeline on the console to activate the Career Simulator!";
          } else if (!w2.isPodcastWatched) {
            objEl.textContent = "🎯 Wall 2: Timeline complete! Open Knowledge Box 2 & listen to Podcast 2.3.";
          } else if (!w2.isCareerActivityCompleted) {
            objEl.textContent = "🎯 Wall 2: Complete the 'Design Your Dream Career Journey' activity in Knowledge Box 2.";
          } else {
            objEl.textContent = "🎯 Wall 2 Complete! Clue 02 revealed — Proceed to Wall 3 (Marketplace).";
          }
        } else {
          objEl.textContent = "🎯 Wall 2: Arrange the 30-year career timeline on the console to activate the Career Simulator!";
        }
        break;
      case 3:
        if (window.module5State?.state?.wall3) {
          const w3 = window.module5State.state.wall3;
          if (!w3.isMatchingPuzzleComplete) {
            objEl.textContent = "🎯 Wall 3: Solve the matching puzzle to unlock Knowledge Box 3.";
          } else if (!w3.module24?.isPodcastComplete) {
            objEl.textContent = "🎯 Wall 3: Open Knowledge Box 3 and complete the Module 2.4 video.";
          } else if (!w3.module24?.quizPassed) {
            objEl.textContent = "🎯 Wall 3: Complete the Module 2.4 quiz in Knowledge Box 3.";
          } else if (!w3.module25?.isPodcastComplete) {
            objEl.textContent = "🎯 Wall 3: Click the desk laptop to open Module 2.5.";
          } else if (!w3.module25?.isDiscussionGuideReviewed) {
            objEl.textContent = "🎯 Wall 3: Review the Module 2.5 discussion guide.";
          } else if (!w3.module25?.quizPassed) {
            objEl.textContent = "🎯 Wall 3: Complete the Module 2.5 quiz.";
          } else {
            objEl.textContent = "🎯 Wall 3: Module 2.5 complete! Click the exit when you are ready to continue.";
          }
        } else if (!progress.activity1GateUnlocked) {
          objEl.textContent = "🎯 Wall 3: Open Knowledge Box & complete Founder Training video.";
        } else if (!progress.activity2GateUnlocked) {
          objEl.textContent = `🎯 Wall 3: Complete Founder's Decision Terminal (${progress.act1Count}/10 solved).`;
        } else if (!progress.activity3GateUnlocked) {
          objEl.textContent = `🎯 Wall 3: Classify scenarios on Design Thinking Workbench (${progress.act2Count}/10 sorted).`;
        } else if (!progress.evidenceFilesGateUnlocked) {
          objEl.textContent = `🎯 Wall 3: Solve Design Detective Cases & enter code into Combination Lock (${progress.act3Count}/5 solved).`;
        } else {
          objEl.textContent = "🎯 Wall 3: Evidence File Unlocked! Go to Wall 4 to investigate NOVALINK.";
        }
        break;
      case 4:
        if (!progress.casesGateUnlocked) {
          objEl.textContent = "🎯 Wall 4: Run Product Time Machine to align User -> Problem -> Need -> Product.";
        } else if (!progress.evidenceBoardGateUnlocked) {
          objEl.textContent = `🎯 Wall 4: Complete Central Desk Case Studies (${progress.casesCount}/5 solved).`;
        } else if (!progress.fiveWhysGateUnlocked) {
          objEl.textContent = `🎯 Wall 4: Organize evidence on Evidence Board (${progress.ebCount}/4 classified).`;
        } else {
          objEl.textContent = "🎯 Wall 4: Execute 5 Whys analysis to isolate NOVALINK's Root Cause!";
        }
        break;
    }
  }

  // Dynamic Physical Lock Badges rendered directly onto Wall Hotspots
  updateHotspotLockBadges() {
    const progress = window.module5State ? window.module5State.getModule5Progress() : {};

    const lockConfigs = [
      { id: 'm5-w3-kb', unlocked: progress.knowledgeBoxGateUnlocked, lockedLabel: `🔒 ${progress.chitsFound}/5 CHITS`, unlockedLabel: '🔓 UNLOCKED' },
      { id: 'm5-w3-act1', unlocked: progress.activity1GateUnlocked, lockedLabel: `🔒 TRAINING REQ`, unlockedLabel: '🔓 UNLOCKED' },
      { id: 'm5-w3-act2', unlocked: progress.activity2GateUnlocked, lockedLabel: `🔒 ${progress.act1Count}/10 REQ`, unlockedLabel: '🔓 UNLOCKED' },
      { id: 'm5-w3-act3', unlocked: progress.activity3GateUnlocked, lockedLabel: `🔒 ${progress.act2Count}/10 REQ`, unlockedLabel: '🔓 UNLOCKED' },
      { id: 'm5-w4-evidence-files', unlocked: progress.evidenceFilesGateUnlocked, lockedLabel: `🔒 CODE REQ`, unlockedLabel: '🔓 UNLOCKED' },
      { id: 'm5-w4-time-machine', unlocked: progress.productTimeMachineGateUnlocked, lockedLabel: `🔒 CODE REQ`, unlockedLabel: '🔓 UNLOCKED' },
      { id: 'm5-w4-central-desk', unlocked: progress.casesGateUnlocked, lockedLabel: `🔒 TIME MACHINE REQ`, unlockedLabel: '🔓 UNLOCKED' },
      { id: 'm5-w4-evidence-board', unlocked: progress.evidenceBoardGateUnlocked, lockedLabel: `🔒 ${progress.casesCount}/5 CASES REQ`, unlockedLabel: '🔓 UNLOCKED' },
      { id: 'm5-w4-five-whys', unlocked: progress.fiveWhysGateUnlocked, lockedLabel: `🔒 ${progress.ebCount}/4 EVIDENCE REQ`, unlockedLabel: '🔓 UNLOCKED' }
    ];

    lockConfigs.forEach(cfg => {
      const el = document.getElementById(cfg.id);
      if (!el) return;

      let badge = el.querySelector('.m5-hotspot-lock-badge');
      if (!badge) {
        badge = document.createElement('div');
        badge.className = 'm5-hotspot-lock-badge';
        el.appendChild(badge);
      }

      if (cfg.unlocked) {
        badge.textContent = cfg.unlockedLabel;
        badge.className = 'm5-hotspot-lock-badge unlocked';
      } else {
        badge.textContent = cfg.lockedLabel;
        badge.className = 'm5-hotspot-lock-badge';
      }
    });
  }

  // ==========================================
  // WALL 1 INTERACTIONS
  // ==========================================
  clickExitDoor() {
    const progress = window.module5State?.getModule5Progress() || {};
    if (progress.exitGateUnlocked) {
      if (window.soundEngine) window.soundEngine.playEscapeFanfare();
      if (window.app) window.app.showToast("🎉 ROOT CAUSE IDENTIFIED! Emergency Exit Unlocked!", "success");
      
      if (window.module5State) {
        window.module5State.markModule5Complete();
      }
    } else {
      if (window.soundEngine) window.soundEngine.playError();
      if (window.app) window.app.showToast("🔒 EMERGENCY EXIT SEALED: Identify Root Cause & Submit Final Investigation Report first!", "error");
    }
  }

  openWhiteboardModal() {
    if (window.soundEngine) window.soundEngine.playClick();
    if (window.app) window.app.openModal('m5-whiteboard-modal');
  }

  // ==========================================
  // WALL 2 INTERACTIONS — CHALLENGE CHIT HUNT (5/5 GATED)
  // ==========================================
  openTimelineModal() {
    if (window.soundEngine) window.soundEngine.playClick();
    if (window.app) window.app.openModal('m5-timeline-modal');
  }

  openCorkboardModal() {
    if (window.soundEngine) window.soundEngine.playClick();
    if (window.app) window.app.openModal('m5-corkboard-modal');
  }

  collectClue(clueId) {
    if (!window.module5State) return;

    const added = window.module5State.collectChit(clueId);
    const count = window.module5State.state.challengeChitsFound.length;

    if (added) {
      if (window.soundEngine) window.soundEngine.playSuccess();
      if (window.app) {
        window.app.showToast(`✨ CHALLENGE CHIT FOUND — ${count}/5!`, 'reward');
      }
      this.updateObjectiveText();
      this.updateHotspotLockBadges();

      if (count >= 5) {
        if (window.module5State) {
          window.module5State.state.knowledgeUnlocked = true;
          window.module5State.save();
        }
        setTimeout(() => {
          this.renderFiveChitsAssemblyModal();
          if (window.app) window.app.openModal('m5-chits-complete-modal');
        }, 400);
      }
    } else if (window.app) {
      window.app.showToast(`Chit already collected in Satchel!`, 'normal');
    }
  }

  renderFiveChitsAssemblyModal() {
    const modalEl = document.getElementById('m5-chits-complete-modal');
    if (!modalEl) return;

    const chits = window.MODULE5_DATA.challengeClues || [];
    let html = `
      <div class="m5-modal-card wide" style="text-align: center;">
        <button class="modal-close-btn" onclick="window.app.closeModal('m5-chits-complete-modal')">✕</button>
        <div class="modal-header" style="margin-bottom: 12px;">
          <span class="m5-modal-subtitle">NOVALINK FIELD INVESTIGATION</span>
          <h2 class="m5-modal-title" style="color: #00ff88;">🧩 5 CHALLENGE CHITS ASSEMBLED (5/5)</h2>
        </div>
        <p style="font-size: 13px; color: #ffd700; margin-bottom: 16px;">
          The 5 collected field notes form a diagnostic pattern revealing NOVALINK's core breakdown.
        </p>
        <div class="m5-activity-stage" style="height: 280px; display: flex; align-items: center; justify-content: center; gap: 10px; padding: 12px; background: rgba(10, 20, 15, 0.9);">
    `;

    chits.forEach((chit, idx) => {
      const rot = (idx % 2 === 0 ? -3 : 3) + 'deg';
      html += `
        <div class="m5-physical-card" style="position: relative; width: 18%; height: 220px; font-size: 11px; transform: rotate(${rot}); border-color: #00ff88; box-shadow: 0 0 15px rgba(0, 255, 136, 0.4);">
          <span class="m5-card-stamp">CHIT #0${idx + 1}</span>
          <div class="m5-card-label" style="color: #008855;">${chit.icon} ${chit.id}</div>
          <div style="font-weight: 800; color: #111; margin: 6px 0;">${chit.name.split(':')[1] || chit.name}</div>
          <div class="m5-card-body" style="font-size: 10.5px; color: #333; max-height: 120px; overflow-y: auto;">${chit.desc}</div>
        </div>
      `;
    });

    html += `
        </div>
        <div style="background: rgba(0, 255, 136, 0.15); border: 1.5px solid #00ff88; border-radius: 8px; padding: 10px; margin: 16px 0; font-size: 13px; color: #00ff88; font-weight: 700;">
          🔓 KNOWLEDGE BOX UNLOCKED ON WALL 3! Proceed to Wall 3 to inspect Founder Training.
        </div>
        <button class="btn btn-gold" style="width: 100%; font-weight: 800;" onclick="window.app.closeModal('m5-chits-complete-modal'); window.module5Engine.setWall(3);">
          OPEN WALL 3 KNOWLEDGE BOX →
        </button>
      </div>
    `;

    modalEl.innerHTML = html;
  }

  // ==========================================
  // WALL 3 INTERACTIONS — KNOWLEDGE BOX & TRAINING
  // ==========================================
  openKnowledgeBox() {
    const progress = window.module5State?.getModule5Progress() || {};
    if (!progress.knowledgeBoxGateUnlocked) {
      if (window.soundEngine) window.soundEngine.playError();
      if (window.app) {
        window.app.showToast(`🔒 KNOWLEDGE BOX IS LOCKED: Find all 5 Challenge Chits on Wall 2 first! (${progress.chitsFound}/5 found)`, "error");
      }
      return;
    }

    if (window.soundEngine) window.soundEngine.playClick();
    this.renderKnowledgeBoxModal();
    if (window.app) window.app.openModal('m5-kb-modal');
  }

  renderKnowledgeBoxModal() {
    const modalEl = document.getElementById('m5-kb-modal');
    if (!modalEl) return;

    modalEl.innerHTML = `
      <div class="m5-modal-card wide">
        <button class="modal-close-btn" onclick="window.app.closeModal('m5-kb-modal')">✕</button>
        <div class="modal-header">
          <span class="m5-modal-subtitle">FOUNDER'S INVESTIGATION KIT • WALL 3</span>
          <h2 class="m5-modal-title">🧰 KNOWLEDGE BOX & TRAINING TERMINAL</h2>
        </div>
        
        <div class="m5-activity-stage" style="height: 340px; background: linear-gradient(180deg, #101820 0%, #080c10 100%); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px;">
          <div style="background: #000; border: 2.5px solid #00e5ff; border-radius: 12px; padding: 24px; text-align: center; max-width: 540px; box-shadow: 0 0 30px rgba(0, 229, 255, 0.4);">
            <div style="font-size: 11px; font-weight: 800; letter-spacing: 2px; color: #00e5ff; margin-bottom: 8px;">NOVALINK FOUNDER TRAINING TERMINAL</div>
            <div style="font-size: 18px; font-weight: 900; color: #ffd700; margin-bottom: 12px;">FIELD SKILL: PROBLEM IDENTIFICATION</div>
            <div style="background: rgba(0, 229, 255, 0.1); border: 1px dashed rgba(0,229,255,0.4); padding: 14px; border-radius: 8px; margin-bottom: 16px; font-size: 13px; color: #e0f7fa;">
              🎬 <strong>"How to Identify Problems in Daily Life & Business"</strong><br/>
              Learn how successful founders distinguish between surface symptoms and real human problem statements.
            </div>
            <button class="btn btn-gold" style="font-weight: 900; letter-spacing: 1px; padding: 12px 24px;" onclick="window.module5Engine.completeKnowledgeBoxVideo()">
              ▶ PLAY FOUNDER LESSON & UNLOCK DECISION TERMINAL
            </button>
          </div>
        </div>
      </div>
    `;
  }

  completeKnowledgeBoxVideo() {
    if (window.module5State) window.module5State.completeVideo();
    if (window.soundEngine) window.soundEngine.playSuccess();
    this.updateHotspotLockBadges();
    if (window.app) {
      window.app.closeModal('m5-kb-modal');
      window.app.showToast("📚 Training Complete! Founder's Decision Terminal Unlocked!", "reward");
      this.openActivity1Modal();
    }
  }

  // ==========================================
  // ACTIVITY 1 — FOUNDER'S DECISION TERMINAL (10/10 GATED)
  // ==========================================
  openActivity1Modal() {
    const progress = window.module5State?.getModule5Progress() || {};
    if (!progress.activity1GateUnlocked) {
      if (window.soundEngine) window.soundEngine.playError();
      if (window.app) window.app.showToast("🔒 DECISION TERMINAL LOCKED: Complete Founder Training in Knowledge Box first!", "error");
      return;
    }

    this.renderActivity1Question();
    if (window.soundEngine) window.soundEngine.playClick();
    if (window.app) window.app.openModal('m5-activity1-modal');
  }

  renderActivity1Question() {
    const modalEl = document.getElementById('m5-activity1-modal');
    if (!modalEl) return;

    const qList = window.MODULE5_DATA.activity1Questions || [];
    const qData = qList[this.currentAct1Index] || qList[0];
    const posList = window.MODULE5_POSITIONS.MODULE5_DECISION_CARD_POSITIONS;
    const progress = window.module5State ? window.module5State.getModule5Progress() : {};

    // PERSISTENT OPTION SHUFFLE per question ID
    const shuffledIndexed = window.module5State.getShuffledOptions('act1_q_' + qData.id, qData.options);

    let html = `
      <div class="m5-modal-card wide">
        <button class="modal-close-btn" onclick="window.app.closeModal('m5-activity1-modal')">✕</button>
        <div class="modal-header">
          <span class="m5-modal-subtitle">FOUNDER'S DECISION TERMINAL • CASE 0${this.currentAct1Index + 1} OF ${qList.length} (${progress.act1Count}/10 SOLVED)</span>
          <h2 class="m5-modal-title">💡 PROBLEM-SOLVING MINDSET</h2>
        </div>

        <!-- Incident Report Header -->
        <div class="m5-incident-report" style="margin-top: 10px;">
          <div class="m5-incident-header">NOVALINK INCIDENT REPORT • CASE 0${this.currentAct1Index + 1}</div>
          <div style="font-size: 14px; font-weight: 700; color: #111;">${qData.question}</div>
        </div>

        <!-- Tabletop Workbench with Manually Positioned Shuffled Decision Cards -->
        <div class="m5-activity-stage" style="height: 320px;">
          <!-- Central Drop Zone -->
          <div style="position: absolute; top: 12%; left: 50%; transform: translateX(-50%); width: 70%; height: 38%; border: 2px dashed rgba(255, 215, 0, 0.5); border-radius: 10px; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; color: #ffd700; font-weight: 800; font-size: 12px; letter-spacing: 1px;">
            📌 YOUR FOUNDER DECISION AREA (SELECT A SHUFFLED CARD BELOW)
          </div>

          <!-- Physical Decision Cards (Persistently Shuffled Position & Metadata) -->
    `;

    shuffledIndexed.forEach((indexedOpt, cardPosIdx) => {
      const pos = posList[cardPosIdx] || { left: `${10 + cardPosIdx * 22}%`, top: "60%", rotation: "0deg", zIndex: 10 };
      html += `
        <div class="m5-physical-card" style="left: ${pos.left}; top: ${pos.top}; transform: rotate(${pos.rotation}); z-index: ${pos.zIndex}; width: 26%; max-height: 100px; font-size: 11px;" onclick="window.module5Engine.selectActivity1Answer(${indexedOpt.originalIdx}, ${qData.correct}, \`${qData.explanation.replace(/`/g, "'")}\`, ${qData.id})">
          <span class="m5-card-stamp">CARD 0${cardPosIdx + 1}</span>
          <div class="m5-card-label">DECISION OPTION ${String.fromCharCode(65 + cardPosIdx)}</div>
          <div class="m5-card-body">${indexedOpt.data}</div>
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;

    modalEl.innerHTML = html;
  }

  selectActivity1Answer(selectedOriginalIdx, correctOriginalIdx, explanation, qId) {
    if (selectedOriginalIdx === correctOriginalIdx) {
      if (window.soundEngine) window.soundEngine.playSuccess();
      if (window.gameState) window.gameState.addXP(20);

      if (window.module5State) {
        window.module5State.markActivity1QuestionSolved(qId);
      }

      const qList = window.MODULE5_DATA.activity1Questions || [];
      const solvedCount = window.module5State ? window.module5State.state.activity1SolvedCount : (this.currentAct1Index + 1);

      if (this.currentAct1Index < qList.length - 1) {
        this.currentAct1Index++;
        if (window.app) window.app.showToast(`✓ Correct Decision! (${solvedCount}/10 solved) ${explanation}`, "success");
        this.renderActivity1Question();
      } else {
        if (window.module5State) window.module5State.completeActivity1();
        this.updateHotspotLockBadges();
        if (window.app) {
          window.app.closeModal('m5-activity1-modal');
          window.app.showToast("🎉 FOUNDER'S CHALLENGE 10/10 COMPLETE! Design Thinking Workbench Unlocked!", "reward");
        }
        this.updateObjectiveText();
      }
    } else {
      if (window.soundEngine) window.soundEngine.playError();
      if (window.app) window.app.showToast(`❌ Reconsider the evidence! ${explanation}`, "error");
    }
  }

  // ==========================================
  // DESIGN THINKING STAGE INSPECTION
  // ==========================================
  openDesignThinkingStage(stageId) {
    const data = window.MODULE5_DATA.designThinkingStages.find(s => s.id === stageId);
    if (!data) return;

    const modalEl = document.getElementById('m5-dt-stage-modal');
    if (!modalEl) return;

    modalEl.innerHTML = `
      <div class="m5-modal-card">
        <button class="modal-close-btn" onclick="window.app.closeModal('m5-dt-stage-modal')">✕</button>
        <div class="modal-header">
          <span class="m5-modal-subtitle">DESIGN THINKING WORKBENCH TILE</span>
          <h2 class="m5-modal-title" style="color: ${data.color};">${data.title} • ${data.subtitle}</h2>
        </div>
        
        <div class="m5-physical-card" style="position: relative; width: 100%; margin: 16px 0; background: #faf5e8; border: 2px solid ${data.color}; transform: rotate(-1deg); box-shadow: 0 10px 30px rgba(0,0,0,0.8);">
          <span class="m5-card-stamp">STAGE 0${data.num}</span>
          <div class="m5-card-label" style="color: ${data.color};">USER PROFILE & EVIDENCE</div>
          <div class="m5-card-body" style="font-size: 13.5px; line-height: 1.5; color: #111; margin-bottom: 12px;">${data.desc}</div>
          <div style="background: rgba(0,0,0,0.06); border-left: 3px solid ${data.color}; padding: 10px; font-size: 12px; color: #333; font-style: italic;">
            💡 NOVALINK Case Insight: "${data.example}"
          </div>
        </div>

        <button class="btn btn-gold" style="width: 100%; font-weight: 800;" onclick="window.app.closeModal('m5-dt-stage-modal')">
          MARK STAGE UNDERSTOOD ✓
        </button>
      </div>
    `;

    if (window.soundEngine) window.soundEngine.playClick();
    if (window.app) window.app.openModal('m5-dt-stage-modal');
  }

  // ==========================================
  // ACTIVITY 2 — DESIGN THINKING SORTING WORKBENCH (10/10 GATED)
  // ==========================================
  openActivity2Modal() {
    const progress = window.module5State?.getModule5Progress() || {};
    if (!progress.activity2GateUnlocked) {
      if (window.soundEngine) window.soundEngine.playError();
      if (window.app) window.app.showToast(`🔒 DESIGN THINKING WORKBENCH LOCKED: Complete all 10 Founder's Challenge cases first! (${progress.act1Count}/10 completed)`, "error");
      return;
    }

    this.renderActivity2Workbench();
    if (window.soundEngine) window.soundEngine.playClick();
    if (window.app) window.app.openModal('m5-activity2-modal');
  }

  renderActivity2Workbench() {
    const modalEl = document.getElementById('m5-activity2-modal');
    if (!modalEl) return;

    const qList = window.MODULE5_DATA.activity2Questions || [];
    const posList = window.MODULE5_POSITIONS.MODULE5_SORTING_CARD_POSITIONS;
    const progress = window.module5State ? window.module5State.getModule5Progress() : {};

    // PERSISTENT SHUFFLE for Stage Tray visual placement
    const shuffledTrays = window.module5State.getShuffledOptions('act2_trays', ["EMPATHIZE", "DEFINE", "IDEATE", "PROTOTYPE", "TEST"]);

    let html = `
      <div class="m5-modal-card wide">
        <button class="modal-close-btn" onclick="window.app.closeModal('m5-activity2-modal')">✕</button>
        <div class="modal-header">
          <span class="m5-modal-subtitle">ACTIVITY 2 • DESIGN THINKING SORTING WORKBENCH (${progress.act2Count}/10 SORTED)</span>
          <h2 class="m5-modal-title">🛠️ SORT SCENARIOS INTO STAGE TRAYS</h2>
        </div>
        <p style="font-size: 12px; color: #ffd700; margin-bottom: 10px;">
          Click any scenario card on the workbench below to select it, then click the correct Stage Tray at top to classify!
        </p>

        <!-- 5 Physical Stage Trays at Top (Visually Shuffled Order) -->
        <div style="display: flex; gap: 8px; margin-bottom: 12px; justify-content: space-between;">
    `;

    shuffledTrays.forEach(indexedTray => {
      const stgName = indexedTray.data;
      html += `
        <div style="flex: 1; background: rgba(0, 229, 255, 0.1); border: 2px solid #00e5ff; border-radius: 8px; padding: 10px 4px; text-align: center; cursor: pointer; transition: all 0.2s ease;" onclick="window.module5Engine.placeSortingCardInTray('${stgName}')" onmouseover="this.style.background='rgba(0, 229, 255, 0.25)'" onmouseout="this.style.background='rgba(0, 229, 255, 0.1)'">
          <div style="font-size: 11px; font-weight: 900; color: #00e5ff; letter-spacing: 1px;">📥 ${stgName}</div>
        </div>
      `;
    });

    html += `
        </div>

        <!-- Scattered Tabletop Workbench with Percentage Positioning -->
        <div class="m5-activity-stage" style="height: 380px;">
    `;

    qList.forEach((qItem, idx) => {
      const pos = posList[idx] || { left: `${(idx % 5) * 18 + 5}%`, top: `${Math.floor(idx / 5) * 45 + 10}%`, rotation: "0deg", zIndex: 10 };
      const isSelected = this.currentAct2SelectedCardId === qItem.id;
      const isSolved = window.module5State?.state?.activity2Progress?.[qItem.id];

      if (isSolved) {
        html += `
          <div class="m5-physical-card" style="left: ${pos.left}; top: ${pos.top}; transform: rotate(${pos.rotation}); width: 17%; background: #d4edda; border-color: #28a745; opacity: 0.6; pointer-events: none;">
            <span class="m5-card-stamp" style="color: #155724; border-color: #155724;">✓ SOLVED</span>
            <div class="m5-card-label" style="color: #155724;">CASE ${qItem.id}</div>
            <div class="m5-card-body" style="font-size: 10px;">${qItem.scenario.substring(0, 35)}...</div>
          </div>
        `;
      } else {
        html += `
          <div class="m5-physical-card ${isSelected ? 'selected' : ''}" style="left: ${pos.left}; top: ${pos.top}; transform: rotate(${pos.rotation}); z-index: ${isSelected ? 40 : pos.zIndex}; width: 17%; border-color: ${isSelected ? '#ffd700' : '#d4c49d'}; box-shadow: ${isSelected ? '0 0 20px #ffd700' : '0 6px 18px rgba(0,0,0,0.6)'};" onclick="window.module5Engine.selectSortingCard(${qItem.id})">
            <span class="m5-card-stamp">CARD 0${qItem.id}</span>
            <div class="m5-card-label">SCENARIO ${qItem.id}</div>
            <div class="m5-card-body" style="font-size: 10.5px; line-height: 1.3;">${qItem.scenario}</div>
          </div>
        `;
      }
    });

    html += `
        </div>
      </div>
    `;

    modalEl.innerHTML = html;
  }

  selectSortingCard(cardId) {
    this.currentAct2SelectedCardId = cardId;
    if (window.soundEngine) window.soundEngine.playClick();
    this.renderActivity2Workbench();
  }

  placeSortingCardInTray(stageName) {
    if (!this.currentAct2SelectedCardId) {
      if (window.app) window.app.showToast("⚠️ Select a Scenario Card on the workbench first!", "normal");
      return;
    }

    const qList = window.MODULE5_DATA.activity2Questions || [];
    const qData = qList.find(q => q.id === this.currentAct2SelectedCardId);

    if (qData && qData.correctStage === stageName) {
      if (window.soundEngine) window.soundEngine.playSuccess();
      if (window.gameState) window.gameState.addXP(20);

      if (!window.module5State.state.activity2Progress) {
        window.module5State.state.activity2Progress = {};
      }
      window.module5State.state.activity2Progress[qData.id] = true;
      window.module5State.save();

      const solvedCount = Object.keys(window.module5State.state.activity2Progress).length;
      this.currentAct2SelectedCardId = null;

      if (solvedCount < qList.length) {
        if (window.app) window.app.showToast(`✓ Correct! Case ${qData.id} belongs to ${stageName} (${solvedCount}/10 sorted)!`, "success");
        this.renderActivity2Workbench();
      } else {
        if (window.module5State) window.module5State.completeActivity2();
        this.updateHotspotLockBadges();
        if (window.app) {
          window.app.closeModal('m5-activity2-modal');
          window.app.showToast("🎉 DESIGN THINKING WORKBENCH 10/10 COMPLETE! Detective Desk Unlocked!", "reward");
        }
        this.openActivity3Modal();
      }
    } else {
      if (window.soundEngine) window.soundEngine.playError();
      if (window.app) window.app.showToast(`❌ Reconsider what the team is doing! This card returns to the desk.`, "error");
    }
  }

  // ==========================================
  // ACTIVITY 3 — DETECTIVE DESK & COMBINATION LOCK (5/5 GATED)
  // ==========================================
  openActivity3Modal() {
    const progress = window.module5State?.getModule5Progress() || {};
    if (!progress.activity3GateUnlocked) {
      if (window.soundEngine) window.soundEngine.playError();
      if (window.app) window.app.showToast(`🔒 DETECTIVE STATION LOCKED: Complete all 10 Design Thinking Workbench scenarios first! (${progress.act2Count}/10 completed)`, "error");
      return;
    }

    this.renderActivity3DetectiveDesk();
    if (window.soundEngine) window.soundEngine.playClick();
    if (window.app) window.app.openModal('m5-activity3-modal');
  }

  renderActivity3DetectiveDesk() {
    const modalEl = document.getElementById('m5-activity3-modal');
    if (!modalEl) return;

    const cases = window.MODULE5_DATA.activity3Cases || [];
    const posList = window.MODULE5_POSITIONS.MODULE5_CASE_POSITIONS;
    const progress = window.module5State ? window.module5State.getModule5Progress() : {};

    let html = `
      <div class="m5-modal-card wide">
        <button class="modal-close-btn" onclick="window.app.closeModal('m5-activity3-modal')">✕</button>
        <div class="modal-header">
          <span class="m5-modal-subtitle">ACTIVITY 3 • DESIGN DETECTIVE STATION (${progress.act3Count}/5 CASES SOLVED)</span>
          <h2 class="m5-modal-title">🕵️ DETECTIVE DESK & COMBINATION LOCK</h2>
        </div>

        <!-- Detective Code Strip Display -->
        <div style="display: flex; align-items: center; justify-content: center; gap: 12px; margin: 10px 0; background: rgba(0,0,0,0.6); padding: 10px; border-radius: 8px; border: 1.5px solid rgba(255,215,0,0.4);">
          <span style="font-size: 11px; font-weight: 900; color: #ffd700; letter-spacing: 1px;">DETECTIVE CODE STRIP:</span>
    `;

    for (let i = 0; i < 5; i++) {
      const digit = this.detectiveCodeStrip[i] || '_';
      html += `
        <div style="width: 32px; height: 38px; background: #000; border: 1px solid #00e5ff; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-family: monospace; font-size: 20px; font-weight: 900; color: ${digit !== '_' ? '#00ff88' : '#666'};">
          ${digit}
        </div>
      `;
    }

    html += `
        </div>

        <!-- Desk Stage with 5 Manila Folders -->
        <div class="m5-activity-stage" style="height: 260px;">
    `;

    cases.forEach((cItem, idx) => {
      const pos = posList[idx] || { left: `${6 + idx * 18}%`, top: "25%", rotation: "0deg", zIndex: 10 };
      const isSolved = this.detectiveCodeStrip[idx] !== '_';

      html += `
        <div class="m5-manila-folder" style="left: ${pos.left}; top: ${pos.top}; transform: rotate(${pos.rotation}); z-index: ${pos.zIndex};" onclick="window.module5Engine.openDetectiveFolder(${idx})">
          <div class="m5-folder-clip"></div>
          <span class="m5-card-stamp" style="top: 18px;">${isSolved ? '✓ SOLVED' : 'CONFIDENTIAL'}</span>
          <div style="font-size: 10px; font-weight: 900; color: #4a361c; margin-top: 30px;">CASE 0${idx + 1}</div>
          <div style="font-size: 11.5px; font-weight: 800; color: #1a1005; margin: 4px 0; line-height: 1.3;">${cItem.title.split(':')[1] || cItem.title}</div>
        </div>
      `;
    });

    html += `
        </div>

        <!-- Physical 5-Wheel Combination Lock Entry -->
        <div style="margin-top: 14px; background: rgba(12, 6, 3, 0.95); border: 2px solid #ffd700; border-radius: 12px; padding: 14px; text-align: center;">
          <div style="font-size: 11px; font-weight: 900; color: #ffd700; letter-spacing: 1.5px; margin-bottom: 8px;">🔐 PHYSICAL COMBINATION LOCK</div>
          
          <div class="m5-combination-lock" style="margin-bottom: 12px;">
    `;

    for (let i = 0; i < 5; i++) {
      html += `
        <div class="m5-digit-wheel">
          <button class="m5-wheel-btn" onclick="window.module5Engine.updateCombinationLockWheel(${i}, 1)">▲</button>
          <div class="m5-digit-display">${this.combinationLockDigits[i]}</div>
          <button class="m5-wheel-btn" onclick="window.module5Engine.updateCombinationLockWheel(${i}, -1)">▼</button>
        </div>
      `;
    }

    html += `
          </div>

          <button class="btn btn-gold" style="width: 100%; font-weight: 900; letter-spacing: 1px;" onclick="window.module5Engine.validateCombinationLock()">
            UNLOCK FILING CABINET →
          </button>
        </div>
      </div>
    `;

    modalEl.innerHTML = html;
  }

  openDetectiveFolder(caseIdx) {
    const cases = window.MODULE5_DATA.activity3Cases || [];
    const cData = cases[caseIdx];
    if (!cData) return;

    this.currentAct3Index = caseIdx;

    const modalEl = document.getElementById('m5-activity3-modal');
    if (!modalEl) return;

    // PERSISTENT OPTION SHUFFLE for Case options
    const shuffledIndexed = window.module5State.getShuffledOptions('act3_case_' + cData.id, cData.options);

    let html = `
      <div class="m5-modal-card">
        <button class="modal-close-btn" onclick="window.module5Engine.renderActivity3DetectiveDesk()">✕</button>
        <div class="modal-header">
          <span class="m5-modal-subtitle">CASE FILE 0${caseIdx + 1} OF ${cases.length}</span>
          <h2 class="m5-modal-title">${cData.title}</h2>
        </div>
        
        <div class="m5-physical-card" style="position: relative; width: 100%; margin: 14px 0; background: #faf5e8; transform: rotate(-1deg); box-shadow: 0 10px 30px rgba(0,0,0,0.8);">
          <span class="m5-card-stamp">EVIDENCE DOSSIER</span>
          <div class="m5-card-label">SCENARIO DETAILS</div>
          <div class="m5-card-body" style="font-size: 13px; color: #111; margin-bottom: 10px;">${cData.scenario}</div>
          <div style="font-weight: 800; color: #8b0000; font-size: 13.5px; margin-top: 8px;">QUESTION: ${cData.question}</div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 8px;">
    `;

    shuffledIndexed.forEach((indexedOpt, optIdx) => {
      html += `
        <button class="btn btn-gold" style="text-align: left; padding: 10px 14px; font-size: 12.5px;" onclick="window.module5Engine.selectActivity3Answer(${indexedOpt.originalIdx}, ${cData.correct}, \`${cData.explanation.replace(/`/g, "'")}\`, ${cData.id})">
          Option ${String.fromCharCode(65 + optIdx)}: ${indexedOpt.data}
        </button>
      `;
    });

    html += `
        </div>
      </div>
    `;

    modalEl.innerHTML = html;
  }

  selectActivity3Answer(selectedOriginalIdx, correctOriginalIdx, explanation, caseId) {
    if (selectedOriginalIdx === correctOriginalIdx) {
      if (window.soundEngine) window.soundEngine.playSuccess();
      if (window.gameState) window.gameState.addXP(30);

      // Reward code digit sequence: 4 - 7 - 2 - 8 - 5
      const codeDigits = ['4', '7', '2', '8', '5'];
      this.detectiveCodeStrip[this.currentAct3Index] = codeDigits[this.currentAct3Index];

      if (window.module5State) {
        window.module5State.markActivity3CaseSolved(caseId);
      }

      const solvedCount = window.module5State ? Object.keys(window.module5State.state.activity3Progress || {}).length : (this.currentAct3Index + 1);
      if (window.app) window.app.showToast(`✓ Case Solved! Digit unlocked: ${codeDigits[this.currentAct3Index]} (${solvedCount}/5 solved)`, "success");
      this.renderActivity3DetectiveDesk();
    } else {
      if (window.soundEngine) window.soundEngine.playError();
      if (window.app) window.app.showToast(`❌ Re-evaluate the case! ${explanation}`, "error");
    }
  }

  updateCombinationLockWheel(wheelIdx, delta) {
    if (window.soundEngine) window.soundEngine.playClick();
    this.combinationLockDigits[wheelIdx] = (this.combinationLockDigits[wheelIdx] + delta + 10) % 10;
    this.renderActivity3DetectiveDesk();
  }

  validateCombinationLock() {
    const progress = window.module5State ? window.module5State.getModule5Progress() : {};

    if (progress.act3Count < 5) {
      if (window.soundEngine) window.soundEngine.playError();
      if (window.app) window.app.showToast(`🔒 COMBINATION LOCK SEALED: Solve all 5 Detective Cases first! (${progress.act3Count}/5 solved)`, "error");
      return;
    }

    const entered = this.combinationLockDigits.join('');
    if (entered === '47285') {
      if (window.soundEngine) window.soundEngine.playSuccess();
      if (window.module5State) window.module5State.completeActivity3();
      this.updateHotspotLockBadges();

      if (window.app) {
        window.app.closeModal('m5-activity3-modal');
        window.app.showToast("🔓 COMBINATION LOCK UNLOCKED! Filing Cabinet Opened on Wall 4!", "reward");
      }
      this.updateObjectiveText();
    } else {
      if (window.soundEngine) window.soundEngine.playError();
      if (window.app) window.app.showToast(`❌ Lock Sealed! Entered PIN ${entered}. Match the code strip: 47285.`, "error");
    }
  }

  // ==========================================
  // WALL 4 INTERACTIONS — EVIDENCE FILES & PRODUCT TIME MACHINE
  // ==========================================
  openEvidenceFilesModal() {
    const progress = window.module5State?.getModule5Progress() || {};
    if (!progress.productTimeMachineGateUnlocked) {
      if (window.soundEngine) window.soundEngine.playError();
      if (window.app) window.app.showToast("🔒 EVIDENCE FILES LOCKED: Solve Detective Cases & Combination Lock first!", "error");
      return;
    }

    this.renderEvidenceFilesCabinet();
    if (window.soundEngine) window.soundEngine.playClick();
    if (window.app) window.app.openModal('m5-evidence-modal');
  }

  renderEvidenceFilesCabinet() {
    const modalEl = document.getElementById('m5-evidence-modal');
    if (!modalEl) return;

    const files = window.MODULE5_DATA.evidenceFiles || [];

    let html = `
      <div class="m5-modal-card wide">
        <button class="modal-close-btn" onclick="window.app.closeModal('m5-evidence-modal')">✕</button>
        <div class="modal-header">
          <span class="m5-modal-subtitle">WALL 4 • NOVALINK EVIDENCE CABINET</span>
          <h2 class="m5-modal-title">🗄️ INVESTIGATION EVIDENCE FILES</h2>
        </div>

        <div class="m5-activity-stage" style="height: 380px; display: grid; grid-template-columns: 1fr 1fr; gap: 14px; padding: 16px; overflow-y: auto;">
    `;

    files.forEach((f, idx) => {
      let icon = "📄";
      let bgStyle = "#fdfbf7";
      if (f.type.includes("Financial")) { icon = "📊"; bgStyle = "#fff9e6"; }
      if (f.type.includes("User")) { icon = "📝"; bgStyle = "#fef2f2"; }
      if (f.type.includes("Internal")) { icon = "📜"; bgStyle = "#f5f3ff"; }

      html += `
        <div class="m5-physical-card" style="position: relative; width: 100%; height: 160px; background: ${bgStyle}; transform: rotate(${idx % 2 === 0 ? -1 : 1}deg);" onclick="window.module5Engine.inspectEvidenceDocument('${f.id}')">
          <span class="m5-card-stamp">${f.type}</span>
          <div class="m5-card-label" style="color: #6b4c1b;">${icon} ${f.id}: ${f.title}</div>
          <div class="m5-card-body" style="font-size: 11.5px; color: #111; margin: 4px 0; line-height: 1.3;">${f.desc}</div>
          <div style="background: rgba(0,0,0,0.06); padding: 6px; border-left: 2.5px solid #d4c49d; font-size: 10.5px; color: #444; margin-top: 6px; font-style: italic;">
            💡 Why It Matters: ${f.whyItMatters}
          </div>
        </div>
      `;
    });

    html += `
        </div>
        <button class="btn btn-gold" style="width: 100%; margin-top: 14px; font-weight: 800;" onclick="window.app.closeModal('m5-evidence-modal')">
          CLOSE EVIDENCE CABINET ✓
        </button>
      </div>
    `;

    modalEl.innerHTML = html;
  }

  inspectEvidenceDocument(evidId) {
    const f = window.MODULE5_DATA.evidenceFiles.find(item => item.id === evidId);
    if (!f) return;

    if (window.module5State) {
      window.module5State.discoverEvidence(f.id);
    }
    if (window.soundEngine) window.soundEngine.playSuccess();
    if (window.app) window.app.showToast(`📁 DISCOVERED EVIDENCE: ${f.title} added to Investigation Notes!`, "reward");
  }

  // ==========================================
  // PRODUCT TIME MACHINE (DRAG & DROP MECHANICAL SLOTS)
  // ==========================================
  initPTMScenario(scenarioKey) {
    if (!scenarioKey) scenarioKey = window.module5State?.state?.selectedProductScenario || 'food_delivery';
    const scenarioData = window.MODULE5_DATA.productScenarios[scenarioKey] || window.MODULE5_DATA.productScenarios['food_delivery'];

    this.ptmDragState = {
      scenarioKey: scenarioKey,
      slots: { USER: null, PROBLEM: null, NEED: null, PRODUCT: null },
      cards: [],
      submitted: false,
      isCorrect: false,
      validationMessage: null
    };

    // Scramble starting cards and desktop layout positions
    const clues = scenarioData.clues || [];
    const shuffledClues = window.module5State ? window.module5State.getShuffledOptions('ptm_init_' + scenarioKey, clues) : clues.map((d, i) => ({ data: d, originalIdx: i }));

    // 4 scattered tabletop desk positions (percentage based)
    const posList = [
      { left: '4%', top: '15%', rot: '-3deg' },
      { left: '28%', top: '48%', rot: '+3deg' },
      { left: '52%', top: '15%', rot: '-2deg' },
      { left: '74%', top: '48%', rot: '+4deg' }
    ];

    this.ptmDragState.cards = shuffledClues.map((item, idx) => {
      const pos = posList[idx % posList.length];
      return {
        id: `ptm_card_${item.data.label.toLowerCase()}`,
        label: item.data.label,
        value: item.data.value,
        left: pos.left,
        top: pos.top,
        rot: pos.rot,
        inSlot: null
      };
    });
  }

  switchPTMScenario(scenarioKey) {
    if (window.module5State) {
      window.module5State.state.selectedProductScenario = scenarioKey;
      window.module5State.save();
    }
    this.initPTMScenario(scenarioKey);
    this.renderProductTimeMachine();
  }

  openProductTimeMachine() {
    const progress = window.module5State?.getModule5Progress() || {};
    if (!progress.productTimeMachineGateUnlocked) {
      if (window.soundEngine) window.soundEngine.playError();
      if (window.app) window.app.showToast("🔒 PRODUCT TIME MACHINE LOCKED: Complete Detective Station & Combination Lock first!", "error");
      return;
    }

    if (!window.module5State?.state?.productTimeMachineComplete && (!this.ptmDragState.cards || this.ptmDragState.cards.length === 0)) {
      this.initPTMScenario(this.ptmDragState.scenarioKey);
    }

    this.renderProductTimeMachine();
    if (window.soundEngine) window.soundEngine.playClick();
    if (window.app) window.app.openModal('m5-time-machine-modal');
  }

  renderProductTimeMachine() {
    const modalEl = document.getElementById('m5-time-machine-modal');
    if (!modalEl) return;

    const scenarioKey = this.ptmDragState.scenarioKey || 'food_delivery';
    const slots = this.ptmDragState.slots;
    const cards = this.ptmDragState.cards;
    const msg = this.ptmDragState.validationMessage;
    const isCompleted = window.module5State?.state?.productTimeMachineComplete || false;

    const slotKeys = ['USER', 'PROBLEM', 'NEED', 'PRODUCT'];

    let html = `
      <div class="m5-modal-card wide m5-ptm-container">
        <button class="modal-close-btn" onclick="window.app.closeModal('m5-time-machine-modal')">✕</button>

        <div class="modal-header" style="margin-bottom: 8px;">
          <span class="m5-modal-subtitle">WALL 4 • REWIND THE PRODUCT HISTORY</span>
          <h2 class="m5-modal-title">⚙️ PRODUCT TIME MACHINE</h2>
        </div>

        <!-- Scenario Selector & Header Bar -->
        <div class="m5-ptm-header-bar">
          <div class="m5-scenario-selector">
            <span>SCENARIO:</span>
            <select class="m5-scenario-select" onchange="window.module5Engine.switchPTMScenario(this.value)">
              <option value="food_delivery" ${scenarioKey === 'food_delivery' ? 'selected' : ''}>🍔 Food Delivery App</option>
              <option value="ride_hailing" ${scenarioKey === 'ride_hailing' ? 'selected' : ''}>🚗 Ride-Hailing App</option>
              <option value="online_shopping" ${scenarioKey === 'online_shopping' ? 'selected' : ''}>🛍️ Online Shopping App</option>
              <option value="smartwatch" ${scenarioKey === 'smartwatch' ? 'selected' : ''}>⌚ Smartwatch</option>
              <option value="earbuds" ${scenarioKey === 'earbuds' ? 'selected' : ''}>🎧 Wireless Earbuds</option>
            </select>
          </div>
          <div style="font-size: 11px; font-weight: 800; color: #ffd700;">
            DRAG CARDS INTO TARGET SLOTS BELOW
          </div>
        </div>

        <!-- 4 Physical Drop Slots -->
        <div class="m5-ptm-slots-grid">
    `;

    slotKeys.forEach((sKey, sIdx) => {
      const placedCardId = slots[sKey];
      const placedCard = placedCardId ? cards.find(c => c.id === placedCardId) : null;
      const isCorrectSlot = isCompleted || (msg && msg.type === 'success');

      html += `
        <div class="m5-ptm-slot ${placedCard ? 'occupied' : ''} ${isCorrectSlot ? 'correct-slot' : ''}" data-slot-key="${sKey}">
          <div class="m5-ptm-slot-title">0${sIdx + 1}. ${sKey} SLOT</div>
      `;

      if (placedCard) {
        html += `
          <div class="m5-ptm-card in-slot" style="background: #ffffff; border-color: #00e5ff;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
              <span class="m5-card-stamp" style="position: static; transform: none; opacity: 1;">${placedCard.label}</span>
              <button style="background: rgba(255,0,0,0.2); border: 1px solid #ff4d4d; color: #ff4d4d; border-radius: 3px; font-size: 9px; cursor: pointer; padding: 0 4px;" onclick="window.module5Engine.ejectPTMCardFromSlot('${sKey}')">✕ Eject</button>
            </div>
            <div class="m5-card-body" style="font-size: 10.5px; line-height: 1.2; color: #111;">${placedCard.value}</div>
          </div>
        `;
      } else {
        html += `
          <div class="m5-ptm-slot-placeholder">
            ┌────────────┐<br/>
            │ DROP ${sKey} │<br/>
            └────────────┘
          </div>
        `;
      }

      html += `</div>`;
    });

    html += `
        </div>

        <!-- Desktop Workbench Area for Scrambled Unplaced Cards -->
        <div class="m5-ptm-desk-stage" id="ptm-desk-stage">
          <div style="position: absolute; top: 6px; left: 10px; font-size: 9.5px; font-weight: 800; color: rgba(0, 229, 255, 0.4); letter-spacing: 1px;">
            📌 INVESTIGATION DESK (CLICK & DRAG CARDS TO SLOTS AT TOP)
          </div>
    `;

    cards.forEach((card) => {
      if (!card.inSlot) {
        html += `
          <div class="m5-ptm-card" id="${card.id}" data-card-id="${card.id}" style="left: ${card.left}; top: ${card.top}; transform: rotate(${card.rot});" onpointerdown="window.module5Engine.startPTMCardDrag(event, '${card.id}')">
            <span class="m5-card-stamp">${card.label}</span>
            <div class="m5-card-label" style="color: #0088cc;">${card.label} EVIDENCE</div>
            <div class="m5-card-body" style="font-size: 11px; line-height: 1.3;">${card.value}</div>
          </div>
        `;
      }
    });

    html += `
        </div>

        <!-- Validation / Feedback Banner -->
    `;

    if (msg) {
      const isErr = msg.type === 'error';
      html += `
        <div style="background: ${isErr ? 'rgba(255, 77, 77, 0.15)' : 'rgba(0, 255, 136, 0.15)'}; border: 1.5px solid ${isErr ? '#ff4d4d' : '#00ff88'}; border-radius: 8px; padding: 10px 14px; margin-top: 10px; font-size: 12.5px; color: ${isErr ? '#ff6666' : '#00ff88'}; font-weight: 800; text-align: center; white-space: pre-line;">
          ${msg.text}
        </div>
      `;
    }

    html += `
        <!-- Action Buttons -->
        <div style="display: flex; gap: 10px; margin-top: 12px;">
          <button class="btn btn-gold" style="flex: 2; font-weight: 900; letter-spacing: 1px;" onclick="window.module5Engine.checkPTMArrangement()">
            CHECK ARRANGEMENT ✓
          </button>
          <button class="btn" style="flex: 1; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.2); color: #ccc; font-weight: 700;" onclick="window.module5Engine.resetPTMCards()">
            RESET DESK 🔄
          </button>
        </div>
      </div>
    `;

    modalEl.innerHTML = html;
  }

  startPTMCardDrag(e, cardId) {
    e.preventDefault();
    const card = this.ptmDragState.cards.find(c => c.id === cardId);
    if (!card) return;

    const cardEl = document.getElementById(cardId);
    if (!cardEl) return;

    cardEl.setPointerCapture(e.pointerId);
    cardEl.classList.add('dragging');

    const deskStage = document.getElementById('ptm-desk-stage');

    const startX = e.clientX;
    const startY = e.clientY;
    const initialLeft = cardEl.offsetLeft;
    const initialTop = cardEl.offsetTop;

    const onPointerMove = (moveEvt) => {
      const deltaX = moveEvt.clientX - startX;
      const deltaY = moveEvt.clientY - startY;

      cardEl.style.left = (initialLeft + deltaX) + 'px';
      cardEl.style.top = (initialTop + deltaY) + 'px';

      const slots = document.querySelectorAll('.m5-ptm-slot');
      slots.forEach(sEl => {
        const sRect = sEl.getBoundingClientRect();
        if (
          moveEvt.clientX >= sRect.left &&
          moveEvt.clientX <= sRect.right &&
          moveEvt.clientY >= sRect.top &&
          moveEvt.clientY <= sRect.bottom
        ) {
          sEl.classList.add('hover-target');
        } else {
          sEl.classList.remove('hover-target');
        }
      });
    };

    const onPointerUp = (upEvt) => {
      cardEl.releasePointerCapture(upEvt.pointerId);
      cardEl.classList.remove('dragging');
      cardEl.onpointermove = null;
      cardEl.onpointerup = null;

      const slotEls = document.querySelectorAll('.m5-ptm-slot');
      let droppedSlotKey = null;

      slotEls.forEach(sEl => {
        sEl.classList.remove('hover-target');
        const sRect = sEl.getBoundingClientRect();
        if (
          upEvt.clientX >= sRect.left &&
          upEvt.clientX <= sRect.right &&
          upEvt.clientY >= sRect.top &&
          upEvt.clientY <= sRect.bottom
        ) {
          droppedSlotKey = sEl.getAttribute('data-slot-key');
        }
      });

      if (droppedSlotKey) {
        const existingCardId = this.ptmDragState.slots[droppedSlotKey];
        if (existingCardId && existingCardId !== card.id) {
          const oldCard = this.ptmDragState.cards.find(c => c.id === existingCardId);
          if (oldCard) oldCard.inSlot = null;
        }

        this.ptmDragState.slots[droppedSlotKey] = card.id;
        card.inSlot = droppedSlotKey;
        if (window.soundEngine) window.soundEngine.playClick();
      } else {
        card.inSlot = null;
        if (deskStage) {
          const dRect = deskStage.getBoundingClientRect();
          const percentX = Math.max(2, Math.min(75, ((cardEl.offsetLeft) / dRect.width) * 100));
          const percentY = Math.max(5, Math.min(65, ((cardEl.offsetTop) / dRect.height) * 100));
          card.left = `${percentX.toFixed(1)}%`;
          card.top = `${percentY.toFixed(1)}%`;
        }
      }

      this.renderProductTimeMachine();
    };

    cardEl.onpointermove = onPointerMove;
    cardEl.onpointerup = onPointerUp;
  }

  ejectPTMCardFromSlot(slotKey) {
    const cardId = this.ptmDragState.slots[slotKey];
    if (cardId) {
      const card = this.ptmDragState.cards.find(c => c.id === cardId);
      if (card) card.inSlot = null;
      this.ptmDragState.slots[slotKey] = null;
      if (window.soundEngine) window.soundEngine.playClick();
      this.renderProductTimeMachine();
    }
  }

  resetPTMCards() {
    this.initPTMScenario(this.ptmDragState.scenarioKey);
    if (window.soundEngine) window.soundEngine.playClick();
    this.renderProductTimeMachine();
  }

  checkPTMArrangement() {
    const slots = this.ptmDragState.slots;
    const cards = this.ptmDragState.cards;

    if (!slots.USER || !slots.PROBLEM || !slots.NEED || !slots.PRODUCT) {
      if (window.soundEngine) window.soundEngine.playError();
      if (window.app) window.app.showToast("⚠️ INCOMPLETE ARRANGEMENT: Place all 4 cards into their respective slots before checking!", "normal");
      return;
    }

    const userCard = cards.find(c => c.id === slots.USER);
    const problemCard = cards.find(c => c.id === slots.PROBLEM);
    const needCard = cards.find(c => c.id === slots.NEED);
    const productCard = cards.find(c => c.id === slots.PRODUCT);

    const isUserCorrect = userCard && userCard.label === 'USER';
    const isProblemCorrect = problemCard && problemCard.label === 'PROBLEM';
    const isNeedCorrect = needCard && needCard.label === 'NEED';
    const isProductCorrect = productCard && productCard.label === 'PRODUCT';

    if (isUserCorrect && isProblemCorrect && isNeedCorrect && isProductCorrect) {
      if (window.soundEngine) window.soundEngine.playSuccess();
      if (window.gameState) window.gameState.addXP(100);

      this.ptmDragState.submitted = true;
      this.ptmDragState.isCorrect = true;
      this.ptmDragState.validationMessage = {
        type: 'success',
        text: "✓ PRODUCT HISTORY RECONSTRUCTED!\nUSER ✓ | PROBLEM ✓ | NEED ✓ | PRODUCT ✓\nYou identified why this product exists."
      };

      if (window.module5State) window.module5State.completeTimeMachine();
      this.updateHotspotLockBadges();
      this.updateObjectiveText();

      if (window.app) {
        window.app.showToast("⚙️ PRODUCT HISTORY RECONSTRUCTED! Central Desk Case Studies Unlocked!", "reward");
      }
      this.renderProductTimeMachine();
    } else {
      if (window.soundEngine) window.soundEngine.playError();

      this.ptmDragState.submitted = true;
      this.ptmDragState.isCorrect = false;
      this.ptmDragState.validationMessage = {
        type: 'error',
        text: "❌ ARRANGEMENT INCORRECT\nSomething doesn't connect correctly. Review the relationship between the user, their problem, their need and the product."
      };

      this.renderProductTimeMachine();
    }
  }

  // ==========================================
  // CENTRAL DESK CASE STUDIES (5/5 GATED)
  // ==========================================
  openCentralDeskModal() {
    const progress = window.module5State?.getModule5Progress() || {};
    if (!progress.casesGateUnlocked) {
      if (window.soundEngine) window.soundEngine.playError();
      if (window.app) window.app.showToast("🔒 CENTRAL DESK LOCKED: Execute Product Time Machine alignment first!", "error");
      return;
    }

    this.renderCentralDeskDesk();
    if (window.soundEngine) window.soundEngine.playClick();
    if (window.app) window.app.openModal('m5-central-desk-modal');
  }

  renderCentralDeskDesk() {
    const modalEl = document.getElementById('m5-central-desk-modal');
    if (!modalEl) return;

    const cases = window.MODULE5_DATA.centralDeskCases || [];
    const posList = window.MODULE5_POSITIONS.MODULE5_CASE_POSITIONS;
    const progress = window.module5State ? window.module5State.getModule5Progress() : {};

    let html = `
      <div class="m5-modal-card wide">
        <button class="modal-close-btn" onclick="window.app.closeModal('m5-central-desk-modal')">✕</button>
        <div class="modal-header">
          <span class="m5-modal-subtitle">WALL 4 • FOUNDER'S DESK (${progress.casesCount}/5 SOLVED)</span>
          <h2 class="m5-modal-title">🏢 CENTRAL DESK CASE STUDY FOLDERS</h2>
        </div>
        <p style="font-size: 12px; color: #ffd700; margin-bottom: 12px;">
          Solve each case study sequentially to complete the Founder's Investigation.
        </p>

        <div class="m5-activity-stage" style="height: 300px;">
    `;

    cases.forEach((cItem, idx) => {
      const pos = posList[idx] || { left: `${6 + idx * 18}%`, top: "25%", rotation: "0deg", zIndex: 10 };
      const isSolved = window.module5State?.state?.casesCompleted?.includes(cItem.id);
      const isUnlocked = idx === 0 || window.module5State?.state?.casesCompleted?.includes(cases[idx - 1].id);

      html += `
        <div class="m5-manila-folder" style="left: ${pos.left}; top: ${pos.top}; transform: rotate(${pos.rotation}); z-index: ${pos.zIndex}; opacity: ${isUnlocked ? 1 : 0.5}; pointer-events: ${isUnlocked ? 'auto' : 'none'};" onclick="window.module5Engine.openCentralCaseFolder(${idx})">
          <div class="m5-folder-clip"></div>
          <span class="m5-card-stamp" style="top: 18px;">${isSolved ? '✓ SOLVED' : isUnlocked ? 'OPEN CASE' : '🔒 LOCKED'}</span>
          <div style="font-size: 10px; font-weight: 900; color: #4a361c; margin-top: 30px;">CASE 0${idx + 1}</div>
          <div style="font-size: 11px; font-weight: 800; color: #1a1005; margin: 4px 0; line-height: 1.3;">${cItem.title}</div>
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;

    modalEl.innerHTML = html;
  }

  openCentralCaseFolder(caseIdx) {
    const cases = window.MODULE5_DATA.centralDeskCases || [];
    const cData = cases[caseIdx];
    if (!cData) return;

    this.currentCaseIndex = caseIdx;

    const modalEl = document.getElementById('m5-central-desk-modal');
    if (!modalEl) return;

    // PERSISTENT OPTION SHUFFLE for Central Desk options
    const shuffledIndexed = window.module5State.getShuffledOptions('act5_case_' + cData.id, cData.options);

    let html = `
      <div class="m5-modal-card">
        <button class="modal-close-btn" onclick="window.module5Engine.renderCentralDeskDesk()">✕</button>
        <div class="modal-header">
          <span class="m5-modal-subtitle">FOUNDER'S CASE FILE 0${caseIdx + 1} OF ${cases.length}</span>
          <h2 class="m5-modal-title">${cData.title}</h2>
        </div>
        
        <div class="m5-physical-card" style="position: relative; width: 100%; margin: 14px 0; background: #faf5e8; transform: rotate(-1deg); box-shadow: 0 10px 30px rgba(0,0,0,0.8);">
          <span class="m5-card-stamp">SITUATION DOSSIER</span>
          <div class="m5-card-label">SITUATION</div>
          <div class="m5-card-body" style="font-size: 13px; color: #111; margin-bottom: 10px;">${cData.situation}</div>
          <div style="font-weight: 800; color: #8b0000; font-size: 13.5px; margin-top: 8px;">QUESTION: ${cData.question}</div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 8px;">
    `;

    shuffledIndexed.forEach((indexedOpt, optIdx) => {
      html += `
        <button class="btn btn-gold" style="text-align: left; padding: 10px 14px; font-size: 12.5px;" onclick="window.module5Engine.selectCentralDeskAnswer(${indexedOpt.originalIdx}, ${cData.correct}, \`${cData.explanation.replace(/`/g, "'")}\`)">
          Option ${String.fromCharCode(65 + optIdx)}: ${indexedOpt.data}
        </button>
      `;
    });

    html += `
        </div>
      </div>
    `;

    modalEl.innerHTML = html;
  }

  selectCentralDeskAnswer(selectedOriginalIdx, correctOriginalIdx, explanation) {
    if (selectedOriginalIdx === correctOriginalIdx) {
      if (window.soundEngine) window.soundEngine.playSuccess();
      if (window.gameState) window.gameState.addXP(25);

      const cases = window.MODULE5_DATA.centralDeskCases || [];
      if (window.module5State) window.module5State.completeCase(this.currentCaseIndex + 1);

      const solvedCount = window.module5State ? window.module5State.state.casesCompleted.length : (this.currentCaseIndex + 1);

      if (this.currentCaseIndex < cases.length - 1) {
        this.currentCaseIndex++;
        if (window.app) window.app.showToast(`✓ Case Solved! (${solvedCount}/5 solved) ${explanation}`, "success");
        this.renderCentralDeskDesk();
      } else {
        this.updateHotspotLockBadges();
        if (window.app) {
          window.app.closeModal('m5-central-desk-modal');
          window.app.showToast("🎉 ALL 5 CASE STUDIES SOLVED! Evidence Board Unlocked!", "reward");
        }
        this.updateObjectiveText();
      }
    } else {
      if (window.soundEngine) window.soundEngine.playError();
      if (window.app) window.app.showToast(`❌ Re-examine the situation! ${explanation}`, "error");
    }
  }

  // ==========================================
  // FINAL EVIDENCE BOARD (4/4 CLASSIFICATION GATED)
  // ==========================================
  openEvidenceBoardModal() {
    const progress = window.module5State?.getModule5Progress() || {};
    if (!progress.evidenceBoardGateUnlocked) {
      if (window.soundEngine) window.soundEngine.playError();
      if (window.app) window.app.showToast(`🔒 EVIDENCE BOARD LOCKED: Solve all 5 Central Desk Case Studies first! (${progress.casesCount}/5 solved)`, "error");
      return;
    }

    this.renderEvidenceBoardCorkboard();
    if (window.soundEngine) window.soundEngine.playClick();
    if (window.app) window.app.openModal('m5-evidence-board-modal');
  }

  renderEvidenceBoardCorkboard() {
    const modalEl = document.getElementById('m5-evidence-board-modal');
    if (!modalEl) return;

    const cards = window.MODULE5_DATA.evidenceBoardCards || [];
    const posList = window.MODULE5_POSITIONS.MODULE5_EVIDENCE_POSITIONS;
    const cats = ["EFFECT", "SYMPTOM", "PROBLEM", "UNDERLYING PROBLEM"];
    const progress = window.module5State ? window.module5State.getModule5Progress() : {};

    // PERSISTENT SCRAMBLE for Evidence Board Cards
    const scrambledCards = window.module5State.getShuffledOptions('eb_cards', cards);

    let html = `
      <div class="m5-modal-card wide">
        <button class="modal-close-btn" onclick="window.app.closeModal('m5-evidence-board-modal')">✕</button>
        <div class="modal-header">
          <span class="m5-modal-subtitle">WALL 4 • DETECTIVE CORKBOARD (${progress.ebCount}/4 CLASSIFIED)</span>
          <h2 class="m5-modal-title">📌 EVIDENCE CLASSIFICATION BOARD</h2>
        </div>

        <div class="m5-activity-stage m5-corkboard-stage" style="height: 380px;">
          <!-- SVG Animated String Connection Lines -->
          <svg class="m5-svg-strings">
            <line x1="15%" y1="18%" x2="38%" y2="18%" class="m5-string-line" />
            <line x1="38%" y1="18%" x2="62%" y2="18%" class="m5-string-line" />
            <line x1="62%" y1="18%" x2="85%" y2="18%" class="m5-string-line" />
          </svg>

          <!-- 4 Corkboard Pinned Regions -->
          <div style="position: absolute; top: 6%; left: 4%; width: 92%; display: flex; gap: 10px; justify-content: space-between; z-index: 15;">
    `;

    cats.forEach((cat, cIdx) => {
      html += `
        <div style="flex: 1; background: rgba(20, 10, 5, 0.85); border: 2px solid #ffd700; border-radius: 8px; padding: 8px; text-align: center; color: #ffd700; font-size: 10.5px; font-weight: 900; letter-spacing: 1px;">
          <div class="m5-pin" style="top: -6px; left: 50%; transform: translateX(-50%);"></div>
          ${cIdx + 1}. ${cat}
        </div>
      `;
    });

    html += `
          </div>

          <!-- Initial Scrambled Evidence Cards -->
    `;

    scrambledCards.forEach((indexedCard, cardIdx) => {
      const card = indexedCard.data;
      const pos = posList[cardIdx] || { left: `${6 + cardIdx * 24}%`, top: "45%", rotation: "0deg", zIndex: 20 };
      const solvedCat = window.module5State?.state?.evidenceBoardPlacements?.[card.id];

      html += `
        <div class="m5-physical-card" style="left: ${pos.left}; top: ${pos.top}; transform: rotate(${pos.rotation}); z-index: ${pos.zIndex}; width: 21%; font-size: 10.5px;">
          <div class="m5-pin" style="top: 4px; right: 6px;"></div>
          <span class="m5-card-stamp">${solvedCat || 'UNCLASSIFIED'}</span>
          <div class="m5-card-label">${card.id}</div>
          <div class="m5-card-body" style="font-size: 10.5px; line-height: 1.3; margin-bottom: 6px;">${card.text}</div>
          
          <div style="display: flex; flex-direction: column; gap: 4px;">
            ${cats.map(c => `
              <button class="btn btn-gold" style="font-size: 9px; padding: 2px 4px;" onclick="window.module5Engine.classifyEvidenceCard('${card.id}', '${c}', '${card.correctCategory}')">
                📌 PIN TO ${c}
              </button>
            `).join('')}
          </div>
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;

    modalEl.innerHTML = html;
  }

  classifyEvidenceCard(cardId, selectedCat, correctCat) {
    if (selectedCat === correctCat) {
      if (window.soundEngine) window.soundEngine.playSuccess();
      if (window.gameState) window.gameState.addXP(30);

      const cards = window.MODULE5_DATA.evidenceBoardCards || [];
      const placements = window.module5State?.state?.evidenceBoardPlacements || {};
      placements[cardId] = correctCat;

      if (window.module5State) {
        window.module5State.completeEvidenceBoard(placements);
      }

      const count = Object.keys(placements).length;

      if (count < cards.length) {
        if (window.app) window.app.showToast(`✓ Evidence placed correctly: ${cardId} pinned to ${correctCat}! (${count}/4 classified)`, "success");
        this.renderEvidenceBoardCorkboard();
      } else {
        this.updateHotspotLockBadges();
        if (window.app) {
          window.app.closeModal('m5-evidence-board-modal');
          window.app.showToast("🎉 ALL EVIDENCE ORGANIZED • THE INVESTIGATION PATTERN IS CLEAR! 5 Whys Unlocked!", "reward");
        }
        this.updateObjectiveText();
      }
    } else {
      if (window.soundEngine) window.soundEngine.playError();
      if (window.app) window.app.showToast(`❌ Not quite! Look at what this evidence represents.`, "error");
    }
  }

  // ==========================================
  // FINAL 5 WHYS ROOT CAUSE ANALYSIS (5/5 GATED)
  // ==========================================
  openFiveWhysModal() {
    const progress = window.module5State?.getModule5Progress() || {};
    if (!progress.fiveWhysGateUnlocked) {
      if (window.soundEngine) window.soundEngine.playError();
      if (window.app) window.app.showToast(`🔒 5 WHYS LOCKED: Classify all 4 evidence items on Evidence Board first! (${progress.ebCount}/4 classified)`, "error");
      return;
    }

    this.renderFiveWhysChain();
    if (window.soundEngine) window.soundEngine.playClick();
    if (window.app) window.app.openModal('m5-five-whys-modal');
  }

  renderFiveWhysChain() {
    const modalEl = document.getElementById('m5-five-whys-modal');
    if (!modalEl) return;

    const currentStepNum = window.module5State?.state?.fiveWhysStep || 1;
    const posList = window.MODULE5_POSITIONS.MODULE5_WHY_POSITIONS;

    let html = `
      <div class="m5-modal-card wide">
        <button class="modal-close-btn" onclick="window.app.closeModal('m5-five-whys-modal')">✕</button>
        <div class="modal-header">
          <span class="m5-modal-subtitle">WALL 4 • INVESTIGATION CHAIN (STEP ${Math.min(5, currentStepNum)}/5)</span>
          <h2 class="m5-modal-title">🔍 5 WHYS ROOT CAUSE ANALYSIS</h2>
        </div>

        <div class="m5-activity-stage m5-corkboard-stage" style="height: 380px; overflow-y: auto;">
    `;

    // Render completed why cards in descending staircase chain
    for (let s = 1; s <= 5; s++) {
      const whyData = window.MODULE5_DATA.fiveWhysSteps.find(item => item.step === s);
      const pos = posList[s - 1] || { left: `${10 + s * 12}%`, top: `${(s - 1) * 18 + 5}%`, rotation: "0deg", zIndex: s };
      const isCurrent = s === currentStepNum;
      const isPast = s < currentStepNum;

      if (isPast) {
        html += `
          <div class="m5-physical-card" style="left: ${pos.left}; top: ${pos.top}; transform: rotate(${pos.rotation}); z-index: ${pos.zIndex}; width: 45%; background: #e8f5e9; border-color: #2e7d32;">
            <div class="m5-pin" style="top: 4px; right: 6px;"></div>
            <span class="m5-card-stamp" style="color: #2e7d32; border-color: #2e7d32;">✓ VERIFIED</span>
            <div class="m5-card-label" style="color: #2e7d32;">STEP 0${s}: ${whyData.why}</div>
            <div class="m5-card-body" style="font-size: 11px; color: #111;">${whyData.answer}</div>
          </div>
        `;
      } else if (isCurrent) {
        // PERSISTENT OPTION SHUFFLE for 5 Whys options
        const shuffledIndexed = window.module5State.getShuffledOptions('five_whys_step_' + whyData.step, whyData.options);

        html += `
          <div class="m5-physical-card" style="left: ${pos.left}; top: ${pos.top}; transform: rotate(${pos.rotation}); z-index: ${pos.zIndex}; width: 50%; border-color: #00e5ff; box-shadow: 0 0 25px rgba(0, 229, 255, 0.6);">
            <div class="m5-pin" style="top: 4px; right: 6px;"></div>
            <span class="m5-card-stamp" style="color: #00e5ff; border-color: #00e5ff;">ACTIVE STEP</span>
            <div class="m5-card-label" style="color: #00e5ff;">INVESTIGATION STEP 0${s}</div>
            <div style="font-size: 12.5px; font-weight: 800; color: #111; margin: 4px 0;">${whyData.why}</div>
            
            <div style="display: flex; flex-direction: column; gap: 6px; margin-top: 8px;">
              ${shuffledIndexed.map((indexedOpt, oIdx) => `
                <button class="btn btn-gold" style="font-size: 11px; padding: 6px 10px; text-align: left;" onclick="window.module5Engine.selectFiveWhysAnswer(${s}, ${indexedOpt.originalIdx}, ${whyData.correct})">
                  Option ${String.fromCharCode(65 + oIdx)}: ${indexedOpt.data}
                </button>
              `).join('')}
            </div>
          </div>
        `;
      }
    }

    html += `
        </div>
      </div>
    `;

    modalEl.innerHTML = html;
  }

  selectFiveWhysAnswer(stepNum, selectedOriginalIdx, correctOriginalIdx) {
    if (selectedOriginalIdx === correctOriginalIdx) {
      if (window.soundEngine) window.soundEngine.playSuccess();
      if (stepNum < 5) {
        if (window.app) window.app.showToast(`✓ Step ${stepNum} Verified! Advancing to Step ${stepNum + 1}...`, "success");
        if (window.module5State) window.module5State.markFiveWhysStep(stepNum + 1);
        this.renderFiveWhysChain();
      } else {
        if (window.soundEngine) window.soundEngine.playEscapeFanfare();
        if (window.app) window.app.showToast("🎉 ROOT CAUSE DISCOVERED VIA 5 WHYS!", "reward");
        if (window.module5State) window.module5State.markFiveWhysStep(5);
        if (window.app) {
          window.app.closeModal('m5-five-whys-modal');
          this.openSolutionsModal();
        }
      }
    } else {
      if (window.soundEngine) window.soundEngine.playError();
      if (window.app) window.app.showToast("❌ Incorrect reasoning step. Re-evaluate the evidence!", "error");
    }
  }

  // ==========================================
  // SOLUTIONS & FOUNDER NOTEBOOK REFLECTION (STRICT INPUT GATED)
  // ==========================================
  openSolutionsModal() {
    const progress = window.module5State?.getModule5Progress() || {};
    if (!progress.solutionsGateUnlocked) {
      if (window.soundEngine) window.soundEngine.playError();
      if (window.app) window.app.showToast("🔒 SOLUTIONS DESK LOCKED: Complete 5 Whys Root Cause Analysis first!", "error");
      return;
    }

    this.renderSolutionsNotebook();
    if (window.soundEngine) window.soundEngine.playClick();
    if (window.app) window.app.openModal('m5-solutions-modal');
  }

  renderSolutionsNotebook() {
    const modalEl = document.getElementById('m5-solutions-modal');
    if (!modalEl) return;

    let html = `
      <div class="m5-modal-card wide">
        <button class="modal-close-btn" onclick="window.app.closeModal('m5-solutions-modal')">✕</button>
        <div class="modal-header">
          <span class="m5-modal-subtitle">FINAL STAGE • INNOVATION DESK</span>
          <h2 class="m5-modal-title">💡 3 SOLUTION CARDS & FOUNDER NOTEBOOK</h2>
        </div>

        <!-- 3 Physical Invention Concept Cards -->
        <div style="display: flex; gap: 10px; margin: 12px 0;">
          <div class="m5-physical-card" style="position: relative; flex: 1; transform: rotate(-2.5deg); box-shadow: 0 6px 15px rgba(0,0,0,0.6);">
            <span class="m5-card-stamp">IDEA 01</span>
            <div class="m5-card-label">SOLUTION CONCEPT #01</div>
            <div class="m5-card-body" style="font-size: 11px;">Sunset unvalidated features & restore core rapid task logging workflow.</div>
          </div>
          <div class="m5-physical-card" style="position: relative; flex: 1; transform: rotate(1.8deg); box-shadow: 0 6px 15px rgba(0,0,0,0.6);">
            <span class="m5-card-stamp">IDEA 02</span>
            <div class="m5-card-label">SOLUTION CONCEPT #02</div>
            <div class="m5-card-body" style="font-size: 11px;">Establish mandatory Customer Empathy interviews before scoping any feature build.</div>
          </div>
          <div class="m5-physical-card" style="position: relative; flex: 1; transform: rotate(-1.2deg); box-shadow: 0 6px 15px rgba(0,0,0,0.6);">
            <span class="m5-card-stamp">IDEA 03</span>
            <div class="m5-card-label">SOLUTION CONCEPT #03</div>
            <div class="m5-card-body" style="font-size: 11px;">Implement rapid low-fidelity prototyping & user testing loops for all releases.</div>
          </div>
        </div>

        <!-- Founder Notebook Reflection Area -->
        <div class="m5-founder-notebook m5-notebook-lines" style="margin-bottom: 14px;">
          <div style="font-size: 16px; font-weight: 900; color: #283618; margin-bottom: 8px;">📓 WHAT DID YOU LEARN FROM THE NOVALINK INCIDENT?</div>
          <textarea id="m5-reflection-text" placeholder="Write your founder reflection here before submitting..." style="width: 100%; height: 90px; background: transparent; border: none; color: #1b263b; font-family: 'Caveat', 'Comic Sans MS', cursive; font-size: 16px; font-weight: 700; outline: none; resize: none;"></textarea>
          
          <div class="m5-founder-stamp">INVESTIGATION COMPLETE • ROOT CAUSE RESOLVED</div>
        </div>

        <button class="btn btn-gold" style="width: 100%; font-weight: 900; letter-spacing: 1px;" onclick="window.module5Engine.submitSolutionForm()">
          SUBMIT SOLUTIONS & UNLOCK EMERGENCY EXIT DOOR →
        </button>
      </div>
    `;

    modalEl.innerHTML = html;
  }

  submitSolutionForm() {
    const reflectionText = document.getElementById('m5-reflection-text')?.value || '';

    // STRICT VALIDATION: Require non-empty reflection input
    if (!reflectionText || reflectionText.trim().length === 0) {
      if (window.soundEngine) window.soundEngine.playError();
      if (window.app) window.app.showToast("⚠️ INVESTIGATION INCOMPLETE: Write your founder reflection before submitting.", "error");
      return;
    }

    if (window.module5State) {
      window.module5State.submitSolutions([
        "Sunset unvalidated features & restore core rapid task logging workflow",
        "Establish mandatory Customer Empathy interviews before scoping any feature build",
        "Implement rapid low-fidelity prototyping & user testing loops for all releases"
      ], reflectionText);
      window.module5State.state.rootCauseIdentified = true;
      window.module5State.save();
    }

    this.updateDoorStatus();
    this.updateHotspotLockBadges();

    if (window.soundEngine) window.soundEngine.playEscapeFanfare();
    if (window.app) {
      window.app.closeModal('m5-solutions-modal');
      window.app.showToast("🔑 FINAL INVESTIGATION REPORT SUBMITTED! Emergency Exit Unlocked on Wall 1!", "reward");
      this.setWall(1);
    }
  }
}

window.module5Engine = new Module5Engine();
