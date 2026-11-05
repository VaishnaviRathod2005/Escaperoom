/**
 * ESCAPE ROOM: THE ENTREPRENEUR'S JOURNEY
 * Interactive Puzzle Mechanics Controller
 */

class PuzzleManager {
  constructor() {
    this.scratchCanvas = null;
    this.scratchCtx = null;
    this.isScratching = false;
    this.scratchedPercent = 0;
    this.keypadInput = '';
    this.arrowInput = [];
    this.targetArrowSequence = ['left', 'up', 'up-right'];
    this.atmPinInput = '';
    this.selectedWire = null;
    this.connectedWires = {};

    // Video 3.3 State
    this.videoInterval = null;
    this.videoCurrentTime = 0;
    this.videoDuration = 10;
    this.videoIsPlaying = false;
    this.videoCaptionsOn = true;

    // Activity 1 State
    this.scenarioAnswers = { 1: null, 2: null, 3: null, 4: null };
    this.decayCalcVerified = false;

    // Puzzle 2: The Merchant's Missing Coins State
    this.selfCheckQuestions = [
      "Do you know how much money you spent last week?",
      "Do you save a fixed portion of your income regularly?",
      "Have you tracked your daily spending in a notebook or app?",
      "Do you compare prices and quality before major purchases?",
      "Do you know your long-term money goal for the next 1–3 years?",
      "Do you create a monthly spending plan before the month begins?",
      "Do you clearly distinguish between essential needs and impulse wants?",
      "Do you check your bank balance or cash accounts regularly?",
      "Do you avoid borrowing money for unnecessary luxury items?",
      "Do you keep an emergency cash buffer for sudden unexpected events?"
    ];
    this.selfCheckAnswers = {};
    this.video31Interval = null;
    this.video31CurrentTime = 0;
    this.video31Duration = 10;
    this.video31IsPlaying = false;
    this.video31CaptionsOn = true;
  }

  // ==========================================
  // WALL 1: ELECTRIC CIRCUIT BOARD PUZZLE
  // ==========================================
  initCircuitUI() {
    this.selectedWire = null;
    if (window.gameState?.state?.puzzle1?.circuitDisarmed) {
      this.connectedWires = { red: 'red', blue: 'blue', gold: 'gold', green: 'green' };
      document.querySelectorAll('.circuit-node-item').forEach(el => el.classList.add('connected'));
      const banner = document.getElementById('circuit-status-banner');
      if (banner) {
        banner.className = 'circuit-status-banner disarmed';
        banner.innerHTML = '⚡ STATUS: SECURITY DISARMED — MECHANICAL CLASP OPENED ⚡';
      }
      const returnBtn = document.getElementById('btn-circuit-return-prince');
      if (returnBtn) {
        returnBtn.style.display = 'inline-block';
        returnBtn.textContent = '👑 CLAIM GOLDEN BAR FROM PRINCE →';
      }
    }
    this.renderCircuitWires();
  }

  selectWire(color) {
    if (this.connectedWires[color]) return; // already connected

    this.selectedWire = color;

    document.querySelectorAll('.circuit-column.left-col .circuit-node-item').forEach(el => {
      const w = el.dataset.wire;
      el.classList.toggle('selected', w === color && !this.connectedWires[w]);
    });

    if (window.soundEngine && window.soundEngine.playClick) {
      window.soundEngine.playClick();
    }

    const info = document.getElementById('circuit-instruction-text');
    if (info) {
      info.textContent = `Selected: ${color.toUpperCase()} Wire. Now click the matching socket on the right!`;
    }
  }

  connectSocket(socketColor) {
    if (!this.selectedWire) {
      if (window.app) window.app.showToast('Select a power wire on the left first!', 'normal');
      return;
    }

    if (this.selectedWire === socketColor) {
      // Correct match!
      this.connectedWires[this.selectedWire] = socketColor;
      const wire = this.selectedWire;
      this.selectedWire = null;

      // Update classes
      const leftNode = document.querySelector(`.circuit-column.left-col .circuit-node-item[data-wire="${wire}"]`);
      if (leftNode) {
        leftNode.classList.remove('selected');
        leftNode.classList.add('connected');
      }

      const rightNode = document.querySelector(`.circuit-column.right-col .circuit-node-item[data-socket="${socketColor}"]`);
      if (rightNode) {
        rightNode.classList.add('connected');
      }

      if (window.soundEngine && window.soundEngine.playSuccess) {
        window.soundEngine.playSuccess();
      }

      this.renderCircuitWires();
      this.checkCircuitCompletion();
    } else {
      // Mismatch!
      if (window.soundEngine && window.soundEngine.playLockClick) {
        window.soundEngine.playLockClick();
      }
      if (window.app) {
        window.app.showToast(`Frequency Mismatch! ${this.selectedWire.toUpperCase()} cannot power ${socketColor.toUpperCase()} socket.`, 'error');
      }
    }
  }

  renderCircuitWires() {
    const svg = document.getElementById('circuit-wire-svg');
    const container = document.getElementById('circuit-board-container');
    if (!svg || !container) return;

    svg.innerHTML = '';
    const containerRect = container.getBoundingClientRect();

    const colors = {
      red: '#ff4757',
      blue: '#1e90ff',
      gold: '#ffd700',
      green: '#2ed573'
    };

    Object.keys(this.connectedWires).forEach(wireColor => {
      const leftEl = document.querySelector(`.circuit-column.left-col .circuit-node-item[data-wire="${wireColor}"] .node-terminal-peg`);
      const rightEl = document.querySelector(`.circuit-column.right-col .circuit-node-item[data-socket="${wireColor}"] .node-terminal-peg`);

      if (leftEl && rightEl) {
        const lRect = leftEl.getBoundingClientRect();
        const rRect = rightEl.getBoundingClientRect();

        const x1 = lRect.left + lRect.width / 2 - containerRect.left;
        const y1 = lRect.top + lRect.height / 2 - containerRect.top;
        const x2 = rRect.left + rRect.width / 2 - containerRect.left;
        const y2 = rRect.top + rRect.height / 2 - containerRect.top;

        const cx1 = x1 + (x2 - x1) * 0.45;
        const cy1 = y1;
        const cx2 = x1 + (x2 - x1) * 0.55;
        const cy2 = y2;

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`);
        path.setAttribute('stroke', colors[wireColor] || '#ffd700');
        path.setAttribute('stroke-width', '4');
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('filter', 'drop-shadow(0 0 6px ' + (colors[wireColor] || '#ffd700') + ')');
        svg.appendChild(path);
      }
    });
  }

  resetCircuit() {
    this.selectedWire = null;
    this.connectedWires = {};

    document.querySelectorAll('.circuit-node-item').forEach(el => {
      el.classList.remove('selected', 'connected');
    });

    const svg = document.getElementById('circuit-wire-svg');
    if (svg) svg.innerHTML = '';

    const banner = document.getElementById('circuit-status-banner');
    if (banner) {
      banner.className = 'circuit-status-banner';
      banner.textContent = 'STATUS: SECURITY SENSOR ACTIVE (0/4 CIRCUITS ALIGNED)';
    }

    const returnBtn = document.getElementById('btn-circuit-return-prince');
    if (returnBtn) returnBtn.style.display = 'none';

    if (window.app) window.app.showToast('Circuit connections reset.', 'normal');
  }

  checkCircuitCompletion() {
    const totalConnected = Object.keys(this.connectedWires).length;
    const banner = document.getElementById('circuit-status-banner');

    if (totalConnected === 4) {
      if (banner) {
        banner.className = 'circuit-status-banner disarmed';
        banner.innerHTML = '⚡ STATUS: SECURITY DISARMED — MECHANICAL CLASP OPENED ⚡';
      }

      const returnBtn = document.getElementById('btn-circuit-return-prince');
      if (returnBtn) returnBtn.style.display = 'inline-block';

      // Save state
      if (!window.gameState.state.puzzle1) window.gameState.state.puzzle1 = {};
      window.gameState.state.puzzle1.circuitDisarmed = true;
      window.gameState.save();

      // Update dot appearance on stand
      const circuitDot = document.getElementById('w1-dot-circuit');
      if (circuitDot) circuitDot.classList.add('completed');

      if (window.soundEngine && window.soundEngine.playSuccess) {
        window.soundEngine.playSuccess();
      }

      if (window.app) {
        window.app.showToast('⚡ ALL CIRCUITS ALIGNED! Security sensor disarmed. Click the Prince Painting on the wall to begin!', 'reward');
        window.app.updateHUD();
        // Close electric circuit modal without auto-redirecting to next activity
        setTimeout(() => {
          window.app.closeModal('electric-circuit-modal');
        }, 850);
      }
    } else {
      if (banner) {
        banner.textContent = `STATUS: ALIGNING CIRCUITS (${totalConnected}/4 ALIGNED)`;
      }
    }
  }

  // ==========================================
  // WALL 1: VIDEO 3.3 — SMARTER SPENDING DECISIONS
  // ==========================================
  initVideo33UI() {
    this.videoCurrentTime = 0;
    this.videoIsPlaying = false;
    this.updateVideoProgressUI();

    const p1 = window.gameState?.state?.puzzle1 || {};
    const continueBtn = document.getElementById('btn-video-continue-records');
    if (p1.video33Completed && continueBtn) {
      continueBtn.style.display = 'block';
    }

    // Auto-start playback
    this.startVideoPlayback();
  }

  toggleVideoPlayback() {
    if (this.videoIsPlaying) {
      this.pauseVideoPlayback();
    } else {
      this.startVideoPlayback();
    }
  }

  startVideoPlayback() {
    if (this.videoInterval) clearInterval(this.videoInterval);
    this.videoIsPlaying = true;
    const playBtn = document.getElementById('btn-video-play-pause');
    if (playBtn) playBtn.textContent = '⏸ PAUSE';

    this.videoInterval = setInterval(() => {
      this.videoCurrentTime += 0.2;
      if (this.videoCurrentTime >= this.videoDuration) {
        this.videoCurrentTime = this.videoDuration;
        this.pauseVideoPlayback();
        this.completeVideo33();
      }
      this.updateVideoProgressUI();
    }, 200);
  }

  pauseVideoPlayback() {
    if (this.videoInterval) clearInterval(this.videoInterval);
    this.videoInterval = null;
    this.videoIsPlaying = false;
    const playBtn = document.getElementById('btn-video-play-pause');
    if (playBtn) playBtn.textContent = '▶ PLAY';
  }

  skipVideoPlayback() {
    this.pauseVideoPlayback();
    this.videoCurrentTime = this.videoDuration;
    this.updateVideoProgressUI();
    this.completeVideo33();
  }

  toggleVideoCaptions() {
    this.videoCaptionsOn = !this.videoCaptionsOn;
    const box = document.getElementById('video-captions-box');
    const btn = document.getElementById('btn-video-captions');
    if (box) box.style.display = this.videoCaptionsOn ? 'flex' : 'none';
    if (btn) btn.textContent = this.videoCaptionsOn ? '💬 CAPTIONS: ON' : '💬 CAPTIONS: OFF';
  }

  seekVideoProgress(e) {
    const track = e.currentTarget;
    const rect = track.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    this.videoCurrentTime = ratio * this.videoDuration;
    this.updateVideoProgressUI();
    if (this.videoCurrentTime >= this.videoDuration) {
      this.completeVideo33();
    }
  }

  updateVideoProgressUI() {
    const pct = Math.min(100, (this.videoCurrentTime / this.videoDuration) * 100);
    const fill = document.getElementById('video-progress-fill');
    if (fill) fill.style.width = `${pct}%`;

    const timeDisp = document.getElementById('video-time-display');
    if (timeDisp) {
      const curSec = Math.floor(this.videoCurrentTime).toString().padStart(2, '0');
      timeDisp.textContent = `00:${curSec} / 00:10`;
    }

    // Dynamic educational stages and captions
    const stageBadge = document.getElementById('video-stage-badge');
    const stageTitle = document.getElementById('video-stage-title');
    const stageSub = document.getElementById('video-stage-sub');
    const captionsText = document.getElementById('video-captions-text');

    if (this.videoCurrentTime < 3.5) {
      if (stageBadge) stageBadge.textContent = 'PART 1: NEEDS VS. WANTS';
      if (stageTitle) stageTitle.textContent = '💡 Needs vs. Impulses';
      if (stageSub) stageSub.textContent = 'Every financial decision either builds an enduring foundation or drains your reserves.';
      if (captionsText) captionsText.textContent = '“A cracked essential tool is a need; a brand-new upgrade is an impulsive want.”';
    } else if (this.videoCurrentTime < 7.0) {
      if (stageBadge) stageBadge.textContent = 'PART 2: SPEND, POSTPONE, OR SKIP?';
      if (stageTitle) stageTitle.textContent = '⚖ The Triple Filter';
      if (stageSub) stageSub.textContent = 'Spend on high-value skills and necessary repairs. Postpone luxury trips. Skip unverified quick returns.';
      if (captionsText) captionsText.textContent = '“Never commit funds to unplanned luxuries or promises of get-rich-quick returns.”';
    } else {
      if (stageBadge) stageBadge.textContent = 'PART 3: THE VALUE DECAY FORMULA';
      if (stageTitle) stageTitle.textContent = '📉 Real One-Year Cost';
      if (stageSub) stageSub.textContent = 'Real Cost = Purchase Price − Resale Value + Maintenance Costs.';
      if (captionsText) captionsText.textContent = '“Understand true value decay before trading your hard-earned capital for depreciating assets.”';
    }
  }

  completeVideo33() {
    if (!window.gameState.state.puzzle1) window.gameState.state.puzzle1 = {};
    window.gameState.state.puzzle1.video33Completed = true;
    window.gameState.save();

    const continueBtn = document.getElementById('btn-video-continue-records');
    if (continueBtn) {
      continueBtn.style.display = 'block';
    }

    // Activate the painting dot on Wall 1
    const paintingDot = document.getElementById('w1-dot-painting');
    if (paintingDot) {
      paintingDot.classList.add('active-puzzle');
    }

    if (window.soundEngine && window.soundEngine.playSuccess) {
      window.soundEngine.playSuccess();
    }
    if (window.app) {
      window.app.showToast('🎬 Video 3.3 Completed! Prince\'s Records Activity Unlocked.', 'reward');
      window.app.updateHUD();
    }
  }

  // ==========================================
  // WALL 1: ACTIVITY 1 — SMARTER SPENDING DECISIONS
  // ==========================================
  switchActivityTab(tabName) {
    const tabScenariosBtn = document.getElementById('tab-btn-scenarios');
    const tabDecayBtn = document.getElementById('tab-btn-decay');
    const panelScenarios = document.getElementById('activity-tab-scenarios-panel');
    const panelDecay = document.getElementById('activity-tab-decay-panel');

    if (tabName === 'scenarios') {
      if (tabScenariosBtn) tabScenariosBtn.classList.add('active');
      if (tabDecayBtn) tabDecayBtn.classList.remove('active');
      if (panelScenarios) panelScenarios.style.display = 'block';
      if (panelDecay) panelDecay.style.display = 'none';
    } else {
      if (tabDecayBtn) tabDecayBtn.classList.add('active');
      if (tabScenariosBtn) tabScenariosBtn.classList.remove('active');
      if (panelDecay) panelDecay.style.display = 'block';
      if (panelDecay) panelDecay.style.display = 'none';
    }
    if (window.soundEngine && window.soundEngine.playClick) {
      window.soundEngine.playClick();
    }
  }

  selectScenarioChoice(scenarioNum, choice) {
    const correctMap = {
      1: 'spend',     // Repair essential phone
      2: 'postpone',  // Weekend luxury trip not budgeted
      3: 'spend',     // Certified career course
      4: 'skip'       // Unverified scheme
    };

    const explanations = {
      1: '✓ Correct! Spend on the repair if the phone is needed and repair is the sensible option. Avoid an unnecessary ₹15,000 upgrade.',
      2: '✓ Correct! Postpone until the trip can be afforded, or spend only if it fits the planned recreation budget.',
      3: '✓ Correct! Spending on useful education can be worthwhile when it fits the available budget and builds future earning power.',
      4: '✓ Correct! Skip the offer rather than invest without research. Unverified quick returns carry extreme loss risk.'
    };

    const card = document.getElementById(`scenario-card-${scenarioNum}`);
    const feedback = document.getElementById(`scenario-feedback-${scenarioNum}`);
    const symbolEl = document.getElementById(`scenario-symbol-${scenarioNum}`);
    if (!card) return;

    const buttons = card.querySelectorAll('.choice-btn');

    if (choice === correctMap[scenarioNum]) {
      this.scenarioAnswers[scenarioNum] = choice;
      card.classList.add('solved');

      buttons.forEach(btn => {
        if (btn.dataset.choice === choice) {
          btn.className = 'choice-btn selected-correct';
        } else {
          btn.className = 'choice-btn';
          btn.disabled = true;
          btn.style.opacity = '0.4';
        }
      });

      if (symbolEl) {
        symbolEl.style.display = 'inline-block';
      }

      if (feedback) {
        feedback.style.display = 'block';
        feedback.textContent = explanations[scenarioNum];
      }

      if (window.soundEngine && window.soundEngine.playSuccess) {
        window.soundEngine.playSuccess();
      }

      this.checkAllScenariosSolved();
    } else {
      // Wrong choice
      if (window.soundEngine && window.soundEngine.playLockClick) {
        window.soundEngine.playLockClick();
      }
      buttons.forEach(btn => {
        if (btn.dataset.choice === choice) {
          btn.classList.add('selected-wrong');
          setTimeout(() => btn.classList.remove('selected-wrong'), 600);
        }
      });

      if (window.app) {
        const hintTexts = {
          1: 'Hint: Is it wiser to repair an essential tool for ₹1,200 or waste ₹15,000 on a brand new phone?',
          2: 'Hint: Since the ₹6,000 luxury trip is NOT budgeted, what should a disciplined spender do?',
          3: 'Hint: A certified skill course directly increases future earning power. Is it worth investing in?',
          4: 'Hint: An unverified scheme with "guaranteed" quick returns is a classic financial trap!'
        };
        window.app.showToast(hintTexts[scenarioNum] || 'Think carefully about long-term financial security!', 'error');
      }
    }
  }

  checkAllScenariosSolved() {
    const solvedCount = Object.values(this.scenarioAnswers).filter(a => a !== null).length;
    if (solvedCount === 4) {
      if (window.app) {
        window.app.showToast('📜 All 4 Wiser Purchases Identified! Now check the Value Decay Calculator.', 'reward');
      }
      setTimeout(() => {
        this.switchActivityTab('decay');
      }, 700);
    }
  }

  verifyDecayCalculation() {
    this.decayCalcVerified = true;
    const btn = document.getElementById('btn-verify-decay-calc');
    if (btn) {
      btn.textContent = '✓ CALCULATION CONFIRMED (REAL COST: ₹9,000)';
      btn.disabled = true;
      btn.style.background = '#2ecc71';
    }

    if (window.soundEngine && window.soundEngine.playSuccess) {
      window.soundEngine.playSuccess();
    }

    const revealSection = document.getElementById('cabinet-key-reveal-section');
    if (revealSection) {
      revealSection.style.display = 'block';
    }

    // Immediately claim key, turn painting dot green, and navigate to Royal Prince Statue!
    if (window.app && window.app.claimHiddenCabinetKey) {
      window.app.claimHiddenCabinetKey();
    }
  }

  // ==========================================
  // PUZZLE 1: TABLE FRAME SCRATCH MINI-GAME
  // ==========================================
  initScratchCard() {
    this.scratchCanvas = document.getElementById('scratch-canvas-el');
    if (!this.scratchCanvas) return;
    this.scratchCtx = this.scratchCanvas.getContext('2d');

    const parent = this.scratchCanvas.parentElement;
    const rect = parent.getBoundingClientRect();
    const width = this.scratchCanvas.width = Math.round(rect.width) || 160;
    const height = this.scratchCanvas.height = Math.round(rect.height) || 140;

    // Reset composite operation to normal draw
    this.scratchCtx.globalCompositeOperation = 'source-over';

    // 1. Draw opaque antique golden-bronze wax parchment coating
    const grad = this.scratchCtx.createRadialGradient(width / 2, height / 2, 5, width / 2, height / 2, width);
    grad.addColorStop(0, '#cca872');
    grad.addColorStop(0.4, '#b38c53');
    grad.addColorStop(0.85, '#8c6530');
    grad.addColorStop(1, '#6b491e');
    this.scratchCtx.fillStyle = grad;
    this.scratchCtx.fillRect(0, 0, width, height);

    // 2. Antique double border lines
    this.scratchCtx.strokeStyle = '#4a2f14';
    this.scratchCtx.lineWidth = 2;
    this.scratchCtx.strokeRect(4, 4, width - 8, height - 8);
    this.scratchCtx.strokeStyle = 'rgba(255, 235, 180, 0.45)';
    this.scratchCtx.lineWidth = 1;
    this.scratchCtx.strokeRect(7, 7, width - 14, height - 14);

    // 3. Top filigree ornament
    this.scratchCtx.fillStyle = '#2c1507';
    this.scratchCtx.font = 'bold 9px "Cinzel", Georgia, serif';
    this.scratchCtx.textAlign = 'center';
    this.scratchCtx.fillText('⚜ ──── ❖ ──── ⚜', width / 2, height * 0.32);

    // 4. Center bold headline
    this.scratchCtx.font = '900 15px "Cinzel", Georgia, serif';
    this.scratchCtx.fillStyle = '#180a03';
    this.scratchCtx.fillText('SCRATCH ME', width / 2, height * 0.53);

    // 5. Bottom filigree
    this.scratchCtx.font = 'bold 9px "Cinzel", Georgia, serif';
    this.scratchCtx.fillStyle = '#2c1507';
    this.scratchCtx.fillText('─ ❖ ─', width / 2, height * 0.72);

    // Track scratching points
    let lastX = null;
    let lastY = null;
    this.isScratching = false;

    const erasePoint = (x, y) => {
      this.scratchCtx.globalCompositeOperation = 'destination-out';
      this.scratchCtx.beginPath();
      this.scratchCtx.arc(x, y, 18, 0, Math.PI * 2);
      this.scratchCtx.fill();
    };

    const eraseLine = (x1, y1, x2, y2) => {
      const dist = Math.hypot(x2 - x1, y2 - y1);
      const steps = Math.max(1, Math.ceil(dist / 4));
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        erasePoint(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t);
      }
    };

    const getPos = (e) => {
      const r = this.scratchCanvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: (clientX - r.left) * (this.scratchCanvas.width / r.width),
        y: (clientY - r.top) * (this.scratchCanvas.height / r.height)
      };
    };

    const onStart = (e) => {
      e.preventDefault();
      this.isScratching = true;
      const p = getPos(e);
      lastX = p.x;
      lastY = p.y;
      erasePoint(p.x, p.y);
      if (window.soundEngine) window.soundEngine.playScratch();
      this.checkScratchProgress();
    };

    const onMove = (e) => {
      if (!this.isScratching) return;
      e.preventDefault();
      const p = getPos(e);
      if (lastX !== null && lastY !== null) {
        eraseLine(lastX, lastY, p.x, p.y);
      } else {
        erasePoint(p.x, p.y);
      }
      lastX = p.x;
      lastY = p.y;

      if (window.soundEngine && Math.random() > 0.6) {
        window.soundEngine.playScratch();
      }
      this.checkScratchProgress();
    };

    const onEnd = () => {
      this.isScratching = false;
      lastX = null;
      lastY = null;
    };

    this.scratchCanvas.onmousedown = onStart;
    this.scratchCanvas.onmousemove = onMove;
    window.onmouseup = onEnd;

    this.scratchCanvas.ontouchstart = onStart;
    this.scratchCanvas.ontouchmove = onMove;
    window.ontouchend = onEnd;
  }

  checkScratchProgress() {
    if (!this.scratchCtx || !this.scratchCanvas) return;
    const room1 = window.gameState?.state?.rooms?.[1];

    // Calculate transparency
    const imgData = this.scratchCtx.getImageData(0, 0, this.scratchCanvas.width, this.scratchCanvas.height);
    let transparentPixels = 0;
    for (let i = 3; i < imgData.data.length; i += 4) {
      if (imgData.data[i] === 0) transparentPixels++;
    }

    const percent = (transparentPixels / (imgData.data.length / 4)) * 100;
    if (percent > 38 && room1 && !room1.scratchCompleted) {
      room1.scratchCompleted = true;
      window.gameState.addXP(50);
      window.gameState.save();
      if (window.soundEngine) window.soundEngine.playSuccess();
      if (window.app) {
        window.app.showToast('Passcode Discovered: 29! Enter it into Drawer 01.', 'success');
      }
    }
  }

  // ==========================================
  // FINANCIAL VAULT: DRAWER PIN PUZZLE (PIN: 4629 FROM ATM RECEIPT)
  // ==========================================
  openDrawerModal() {
    const room1 = window.gameState?.state?.rooms?.[1] || {};
    const lockedView = document.getElementById('drawer-locked-view');
    const openedView = document.getElementById('drawer-opened-view');
    const subtitle = document.getElementById('drawer-modal-subtitle');
    const title = document.getElementById('drawer-modal-title');

    if (room1.drawerUnlocked) {
      if (lockedView) lockedView.style.display = 'none';
      if (openedView) openedView.style.display = 'block';
      if (subtitle) subtitle.textContent = 'WALL 2 • HEAVY DARK-METAL DRAWER';
      if (title) title.textContent = 'DRAWER UNLOCKED';
      this.updateDrawerItemsUI();
      this.checkDrawerCompletion();
    } else {
      if (lockedView) lockedView.style.display = 'block';
      if (openedView) openedView.style.display = 'none';
      if (subtitle) subtitle.textContent = 'WALL 2 • HEAVY DARK-METAL DRAWER';
      if (title) title.textContent = 'LOCKED DRAWER';
      this.clearKeypad();
    }

    if (window.app) window.app.openModal('keypad-modal');
  }

  pressKeypad(digit) {
    if (this.keypadInput.length >= 4) return;
    this.keypadInput += digit;
    this.updateKeypadDisplay();
    if (window.soundEngine) window.soundEngine.playClick();

    if (this.keypadInput.length === 4) {
      setTimeout(() => this.validateKeypad(), 300);
    }
  }

  clearKeypad() {
    this.keypadInput = '';
    this.updateKeypadDisplay();
    if (window.soundEngine) window.soundEngine.playClick();
  }

  updateKeypadDisplay() {
    const display = document.getElementById('keypad-display-text');
    if (display) {
      if (this.keypadInput.length === 0) {
        display.textContent = '____';
      } else {
        display.textContent = '•'.repeat(this.keypadInput.length).padEnd(4, '_');
      }
    }
  }

  validateKeypad() {
    if (this.keypadInput === '4629') {
      const room1 = window.gameState.state.rooms[1];
      room1.drawerUnlocked = true;
      window.gameState.addXP(100);
      window.gameState.save();

      if (window.soundEngine) {
        window.soundEngine.playDrawerOpen();
        setTimeout(() => window.soundEngine.playSuccess(), 400);
      }

      if (window.app) {
        window.app.showToast('PIN ACCEPTED! Drawer Unlocked!', 'success');
      }

      // Show Knowledge Box 02 first ("YOU GOT A KNOWLEDGE BOX!").
      // Clicking NEXT will claim reward and transition to 2nd screen (Drawer Opened Interior View)!
      setTimeout(() => {
        if (window.roomController) {
          window.roomController.startKnowledgeBox(2, () => {
            const lockedView = document.getElementById('drawer-locked-view');
            const openedView = document.getElementById('drawer-opened-view');
            const title = document.getElementById('drawer-modal-title');
            if (lockedView) lockedView.style.display = 'none';
            if (openedView) openedView.style.display = 'block';
            if (title) title.textContent = 'DRAWER UNLOCKED';
            this.updateDrawerItemsUI();
            if (window.app) window.app.openModal('keypad-modal');
          });
        }
      }, 500);
    } else {
      const card = document.querySelector('#keypad-modal .modal-card');
      if (card) {
        card.classList.add('shake');
        setTimeout(() => card.classList.remove('shake'), 500);
      }
      if (window.soundEngine) window.soundEngine.playError();
      if (window.app) window.app.showToast('INCORRECT PIN. Check the ATM receipt.', 'error');
      this.clearKeypad();
    }
  }

  collectLockerKey() {
    const room1 = window.gameState.state.rooms[1];
    if (room1.lockerKeyCollected) return;

    room1.lockerKeyCollected = true;
    window.gameState.addItem({
      id: 'locker_key',
      name: 'Locker Key',
      icon: '🗝️',
      desc: 'A metallic key with a distinctive design.'
    });
    window.gameState.addXP(75);
    window.gameState.save();

    if (window.soundEngine) window.soundEngine.playSuccess();
    if (window.app) window.app.showToast('ITEM ACQUIRED: LOCKER KEY 🗝️', 'reward');

    this.updateDrawerItemsUI();
    this.checkDrawerCompletion();
  }

  collectAdditionalCash() {
    const room1 = window.gameState.state.rooms[1];
    if (room1.additionalCashCollected) return;

    room1.additionalCashCollected = true;
    window.gameState.addItem({
      id: 'additional_cash',
      name: 'Additional Cash',
      icon: '💵',
      desc: 'An additional envelope of cash found inside the drawer.'
    });
    window.gameState.addXP(75);
    window.gameState.save();

    if (window.soundEngine) window.soundEngine.playSuccess();
    if (window.app) window.app.showToast('ITEM ACQUIRED: ADDITIONAL CASH 💵', 'reward');

    this.updateDrawerItemsUI();
    this.checkDrawerCompletion();
  }

  updateDrawerItemsUI() {
    const room1 = window.gameState?.state?.rooms?.[1] || {};
    const cardKey = document.getElementById('drawer-item-key');
    const cardCash = document.getElementById('drawer-item-add-cash');
    const cardKb2 = document.getElementById('drawer-item-kb2');
    const statusKey = document.getElementById('status-locker-key');
    const statusCash = document.getElementById('status-additional-cash');
    const statusKb2 = document.getElementById('status-kb2');

    if (room1.lockerKeyCollected) {
      if (cardKey) cardKey.classList.add('collected');
      if (statusKey) statusKey.textContent = '✓ COLLECTED';
    }
    if (room1.additionalCashCollected) {
      if (cardCash) cardCash.classList.add('collected');
      if (statusCash) statusCash.textContent = '✓ COLLECTED';
    }
    if (room1.kbsFound && room1.kbsFound.includes(2)) {
      if (cardKb2) cardKb2.classList.add('collected');
      if (statusKb2) { statusKb2.textContent = '✓ COMPLETED'; statusKb2.style.color = '#2ecc71'; }
    }
  }

  checkDrawerCompletion() {
    const room1 = window.gameState?.state?.rooms?.[1] || {};
    if (room1.lockerKeyCollected && room1.additionalCashCollected) {
      const noteBanner = document.getElementById('drawer-engraved-note');
      if (noteBanner) noteBanner.style.display = 'block';
    }
  }

  // ==========================================
  // FINANCIAL VAULT: ARROW-PATTERN SUITCASE PUZZLE
  // ==========================================
  openSuitcaseModal() {
    const room1 = window.gameState?.state?.rooms?.[1];
    const lockedView = document.getElementById('suitcase-locked-view');
    const openedView = document.getElementById('suitcase-opened-view');
    const subtitle = document.getElementById('suitcase-status-subtitle');

    if (room1 && room1.suitcaseOpened) {
      if (lockedView) lockedView.style.display = 'none';
      if (openedView) openedView.style.display = 'block';
      if (subtitle) subtitle.textContent = 'UNLOCKED • Suitcase Opened';
      this.updateSuitcaseItemsUI();
    } else {
      if (lockedView) lockedView.style.display = 'block';
      if (openedView) openedView.style.display = 'none';
      if (subtitle) subtitle.textContent = 'LOCKED • The pattern must be matched.';
      this.clearArrowKeys();
    }
    if (window.app) window.app.openModal('suitcase-modal');
  }

  pressArrowKey(dir) {
    if (this.arrowInput.length >= 3) return;
    this.arrowInput.push(dir);
    if (window.soundEngine) window.soundEngine.playClick();
    this.updateArrowDisplay();

    if (this.arrowInput.length === 3) {
      setTimeout(() => this.validateArrowPattern(), 300);
    }
  }

  clearArrowKeys() {
    this.arrowInput = [];
    this.updateArrowDisplay();
    if (window.soundEngine) window.soundEngine.playClick();
  }

  updateArrowDisplay() {
    const symbols = {
      'up-left': '↖',
      'up': '⬆',
      'up-right': '↗',
      'right': '➡',
      'down-right': '↘',
      'down': '⬇',
      'down-left': '↙',
      'left': '⬅'
    };
    for (let i = 0; i < 3; i++) {
      const slot = document.getElementById(`arrow-slot-${i}`);
      if (slot) {
        if (i < this.arrowInput.length) {
          slot.textContent = symbols[this.arrowInput[i]] || '_';
          slot.classList.add('filled');
        } else {
          slot.textContent = '_';
          slot.classList.remove('filled');
        }
      }
    }
  }

  validateArrowPattern() {
    const isCorrect = this.arrowInput.length === 3 &&
      this.arrowInput[0] === 'left' &&
      this.arrowInput[1] === 'up' &&
      this.arrowInput[2] === 'up-right';

    const subtitle = document.getElementById('suitcase-status-subtitle');

    if (isCorrect) {
      const room1 = window.gameState.state.rooms[1];
      room1.suitcaseUnlocked = true;
      room1.suitcaseOpened = true;
      window.gameState.addXP(100);
      window.gameState.save();

      if (subtitle) subtitle.textContent = 'PATTERN MATCHED!';

      if (window.soundEngine) {
        if (window.soundEngine.playDrawerOpen) window.soundEngine.playDrawerOpen();
        setTimeout(() => window.soundEngine.playSuccess(), 400);
      }

      if (window.app) {
        window.app.showToast('PATTERN MATCHED! Suitcase Unlocked!', 'success');
        window.app.closeModal('suitcase-modal');
      }

      // Show Knowledge Box 01 first ("YOU DISCOVERED A KNOWLEDGE CHEST!").
      // Clicking NEXT will claim reward and transition to 2nd screen (Suitcase Opened Interior View)!
      setTimeout(() => {
        if (window.roomController) {
          window.roomController.startKnowledgeBox(1, () => {
            const lockedView = document.getElementById('suitcase-locked-view');
            const openedView = document.getElementById('suitcase-opened-view');
            if (lockedView) lockedView.style.display = 'none';
            if (openedView) openedView.style.display = 'block';
            this.updateSuitcaseItemsUI();
            if (window.app) window.app.openModal('suitcase-modal');
          });
        }
      }, 400);

    } else {
      const card = document.querySelector('#suitcase-modal .modal-card');
      if (card) {
        card.classList.add('shake');
        setTimeout(() => card.classList.remove('shake'), 500);
      }
      if (subtitle) subtitle.textContent = 'Incorrect Pattern';
      if (window.soundEngine) window.soundEngine.playError();
      if (window.app) window.app.showToast('Incorrect Pattern. Observe the tree direction clue.', 'error');
      setTimeout(() => this.clearArrowKeys(), 600);
    }
  }

  collectSuitcaseItem(itemId) {
    const room1 = window.gameState.state.rooms[1];
    if (itemId === 'atm_card') {
      if (!room1.atmCardCollected) {
        room1.atmCardCollected = true;
        window.gameState.addItem({ id: 'atm_card', name: 'ATM Card', icon: '💳' });
        if (window.app) window.app.showToast('ITEM ACQUIRED: ATM CARD', 'reward');
        this.updateSuitcaseItemsUI();
      }
    } else if (itemId === 'main_safe_handle') {
      if (!room1.safeHandleCollected) {
        room1.safeHandleCollected = true;
        window.gameState.addItem({ id: 'main_safe_handle', name: 'Main Safe Handle', icon: '⚙️' });
        if (window.app) window.app.showToast('ITEM ACQUIRED: MAIN SAFE HANDLE ⚙️', 'reward');
        this.updateSuitcaseItemsUI();

        // Subtle glow connection to main vault on Wall 4
        const vaultDot = document.getElementById('w4-sticky-note-dot');
        if (vaultDot) {
          vaultDot.classList.add('subtle-pulse-glow');
          setTimeout(() => vaultDot.classList.remove('subtle-pulse-glow'), 2500);
        }
      }
    }
  }

  updateSuitcaseItemsUI() {
    const room1 = window.gameState?.state?.rooms?.[1];
    const statusAtm = document.getElementById('status-atm-card');
    const statusHandle = document.getElementById('status-main-safe-handle');
    const statusKb1 = document.getElementById('status-kb1');
    const cardAtm = document.getElementById('suitcase-item-card-atm');
    const cardHandle = document.getElementById('suitcase-item-card-handle');
    const cardKb1 = document.getElementById('suitcase-item-card-kb1');

    if (room1?.atmCardCollected) {
      if (statusAtm) statusAtm.textContent = '✓ COLLECTED';
      if (cardAtm) cardAtm.classList.add('collected');
    }
    if (room1?.safeHandleCollected) {
      if (statusHandle) statusHandle.textContent = '✓ COLLECTED';
      if (cardHandle) cardHandle.classList.add('collected');
    }
    if (room1?.kbsFound?.includes(1)) {
      if (statusKb1) { statusKb1.textContent = '✓ COMPLETED'; statusKb1.style.color = '#2ecc71'; }
      if (cardKb1) cardKb1.classList.add('collected');
    }
  }

  // ==========================================
  // FINANCIAL VAULT: ATM MACHINE PUZZLE (PIN 7358)
  // ==========================================
  openATMPuzzle() {
    const room1 = window.gameState?.state?.rooms?.[1] || {};
    const hasCard = window.gameState?.hasItem('atm_card') || room1.atmCardCollected;

    const initialPanel = document.getElementById('atm-state-initial');
    const processingPanel = document.getElementById('atm-state-processing');
    const pinRequiredPanel = document.getElementById('atm-state-pin-required');
    const grantedPanel = document.getElementById('atm-state-granted');
    const completedPanel = document.getElementById('atm-state-completed');

    const statusBadge = document.getElementById('atm-status-tag');
    const keypadSec = document.getElementById('atm-keypad-section');
    const compartmentSec = document.getElementById('atm-lower-compartment');
    const slotLight = document.getElementById('atm-slot-light');
    const insertBtn = document.getElementById('btn-insert-atm-card');

    // Hide all state panels first
    if (initialPanel) initialPanel.style.display = 'none';
    if (processingPanel) processingPanel.style.display = 'none';
    if (pinRequiredPanel) pinRequiredPanel.style.display = 'none';
    if (grantedPanel) grantedPanel.style.display = 'none';
    if (completedPanel) completedPanel.style.display = 'none';

    if (room1.cashCollected && room1.safeDialCollected && room1.receiptCollected) {
      // Completed state
      if (completedPanel) completedPanel.style.display = 'flex';
      if (statusBadge) {
        statusBadge.textContent = 'COMPLETED';
        statusBadge.className = 'atm-status-badge active';
      }
      if (keypadSec) keypadSec.style.display = 'none';
      if (compartmentSec) compartmentSec.style.display = 'block';
      if (slotLight) slotLight.className = 'card-slot-light active';
      if (insertBtn) insertBtn.style.display = 'none';
      this.updateDispensedItemsUI();

    } else if (room1.atmUnlocked) {
      // Unlocked state (Access granted & Dispenser open)
      if (grantedPanel) grantedPanel.style.display = 'flex';
      if (statusBadge) {
        statusBadge.textContent = 'UNLOCKED';
        statusBadge.className = 'atm-status-badge active';
      }
      if (keypadSec) keypadSec.style.display = 'none';
      if (compartmentSec) compartmentSec.style.display = 'block';
      if (slotLight) slotLight.className = 'card-slot-light active';
      if (insertBtn) insertBtn.style.display = 'none';
      this.updateDispensedItemsUI();

    } else if (room1.atmCardInserted) {
      // Card inserted state -> Keypad active
      if (pinRequiredPanel) pinRequiredPanel.style.display = 'flex';
      if (statusBadge) {
        statusBadge.textContent = 'CARD INSERTED';
        statusBadge.className = 'atm-status-badge active';
      }
      if (keypadSec) keypadSec.style.display = 'block';
      if (compartmentSec) compartmentSec.style.display = 'none';
      if (slotLight) slotLight.className = 'card-slot-light active';
      if (insertBtn) insertBtn.style.display = 'none';
      this.updateATMPinDisplay();

    } else {
      // Initial state -> Insert card required
      if (initialPanel) initialPanel.style.display = 'flex';
      if (statusBadge) {
        statusBadge.textContent = 'LOCKED';
        statusBadge.className = 'atm-status-badge';
      }
      if (keypadSec) keypadSec.style.display = 'none';
      if (compartmentSec) compartmentSec.style.display = 'none';
      if (slotLight) slotLight.className = 'card-slot-light';

      if (insertBtn) {
        insertBtn.style.display = 'block';
        if (hasCard) {
          insertBtn.disabled = false;
          insertBtn.innerHTML = '💳 INSERT ATM CARD FROM INVENTORY →';
        } else {
          insertBtn.disabled = true;
          insertBtn.innerHTML = '🔒 ATM CARD REQUIRED (FIND IN SUITCASE)';
        }
      }
    }

    if (window.app) window.app.openModal('atm-modal');
  }

  insertATMCard() {
    const room1 = window.gameState?.state?.rooms?.[1];
    const hasCard = window.gameState?.hasItem('atm_card') || room1?.atmCardCollected;

    if (!hasCard) {
      if (window.app) window.app.showToast('ATM Card required! Collect it from the Suitcase on Wall 2.', 'error');
      return;
    }

    if (room1) {
      room1.atmCardInserted = true;
      window.gameState.save();
    }

    const animCard = document.getElementById('atm-anim-card');
    const initialPanel = document.getElementById('atm-state-initial');
    const processingPanel = document.getElementById('atm-state-processing');
    const pinRequiredPanel = document.getElementById('atm-state-pin-required');
    const insertBtn = document.getElementById('btn-insert-atm-card');
    const statusBadge = document.getElementById('atm-status-tag');
    const slotLight = document.getElementById('atm-slot-light');
    const keypadSec = document.getElementById('atm-keypad-section');

    if (insertBtn) insertBtn.style.display = 'none';

    // Play card animation & sound
    if (animCard) animCard.style.display = 'block';
    if (window.soundEngine) {
      if (window.soundEngine.playDrawerOpen) window.soundEngine.playDrawerOpen();
    }

    // Step 1: Processing
    if (initialPanel) initialPanel.style.display = 'none';
    if (processingPanel) processingPanel.style.display = 'flex';
    if (statusBadge) {
      statusBadge.textContent = 'PROCESSING...';
      statusBadge.className = 'atm-status-badge active';
    }

    setTimeout(() => {
      if (animCard) animCard.style.display = 'none';
      if (processingPanel) processingPanel.style.display = 'none';
      if (pinRequiredPanel) pinRequiredPanel.style.display = 'flex';
      if (keypadSec) keypadSec.style.display = 'block';
      if (slotLight) slotLight.className = 'card-slot-light active';
      if (statusBadge) statusBadge.textContent = 'ENTER PIN';

      if (window.soundEngine) window.soundEngine.playClick();
      if (window.app) window.app.showToast('CARD DETECTED! Find the 4-digit PIN in the room.', 'reward');

      this.clearATMKeypad();
    }, 1400);
  }

  pressATMKeypad(digit) {
    if (this.atmPinInput.length >= 4) return;
    this.atmPinInput += digit;
    if (window.soundEngine) window.soundEngine.playClick();
    this.updateATMPinDisplay();

    if (this.atmPinInput.length === 4) {
      setTimeout(() => this.validateATMPin(), 350);
    }
  }

  clearATMKeypad() {
    this.atmPinInput = '';
    this.updateATMPinDisplay();
    if (window.soundEngine) window.soundEngine.playClick();
  }

  updateATMPinDisplay() {
    const display = document.getElementById('atm-pin-digits');
    if (display) {
      if (this.atmPinInput.length === 0) {
        display.textContent = '____';
      } else {
        display.textContent = '•'.repeat(this.atmPinInput.length).padEnd(4, '_');
      }
    }
  }

  validateATMPin() {
    if (this.atmPinInput === '7358') {
      const room1 = window.gameState.state.rooms[1];
      room1.atmUnlocked = true;
      window.gameState.addXP(150);
      window.gameState.save();

      const pinRequiredPanel = document.getElementById('atm-state-pin-required');
      const grantedPanel = document.getElementById('atm-state-granted');
      const statusBadge = document.getElementById('atm-status-tag');
      const keypadSec = document.getElementById('atm-keypad-section');
      const compartmentSec = document.getElementById('atm-lower-compartment');

      if (pinRequiredPanel) pinRequiredPanel.style.display = 'none';
      if (grantedPanel) grantedPanel.style.display = 'flex';
      if (statusBadge) {
        statusBadge.textContent = 'ACCESS GRANTED';
        statusBadge.className = 'atm-status-badge active';
      }

      if (window.soundEngine) {
        window.soundEngine.playSuccess();
        setTimeout(() => {
          if (window.soundEngine.playDrawerOpen) window.soundEngine.playDrawerOpen();
        }, 500);
      }

      if (window.app) window.app.showToast('PIN ACCEPTED! ACCESS GRANTED!', 'success');

      setTimeout(() => {
        if (keypadSec) keypadSec.style.display = 'none';
        if (compartmentSec) compartmentSec.style.display = 'block';
        this.updateDispensedItemsUI();
      }, 800);

    } else {
      const card = document.querySelector('#atm-modal .modal-card');
      if (card) {
        card.classList.add('shake');
        setTimeout(() => card.classList.remove('shake'), 500);
      }
      if (window.soundEngine) window.soundEngine.playError();
      if (window.app) window.app.showToast('Incorrect PIN! Match the clue note to the 4 Financial Counters.', 'error');
      this.clearATMKeypad();
    }
  }

  collectCash() {
    const room1 = window.gameState.state.rooms[1];
    if (room1.cashCollected) return;

    room1.cashCollected = true;
    window.gameState.addItem({
      id: 'cash',
      name: 'Cash Bundle',
      icon: '💵',
      desc: 'A stack of currency dispensed from the Financial Vault ATM.'
    });
    window.gameState.addXP(75);
    window.gameState.save();

    if (window.soundEngine) window.soundEngine.playSuccess();
    if (window.app) window.app.showToast('ITEM ACQUIRED: CASH 💵', 'reward');

    this.updateDispensedItemsUI();
    this.checkATMCompletion();
  }

  collectSafeDial() {
    const room1 = window.gameState.state.rooms[1];
    if (room1.safeDialCollected) return;

    room1.safeDialCollected = true;
    window.gameState.addItem({
      id: 'safe_dial',
      name: 'Safe Dial',
      icon: '⚙️',
      desc: 'A heavy metallic Safe Dial matching the Main Safe combination lock.'
    });
    window.gameState.addXP(75);
    window.gameState.save();

    if (window.soundEngine) window.soundEngine.playSuccess();
    if (window.app) window.app.showToast('ITEM ACQUIRED: SAFE DIAL ⚙️', 'reward');

    this.updateDispensedItemsUI();
    this.checkATMCompletion();
  }

  collectReceipt() {
    const room1 = window.gameState.state.rooms[1];
    if (room1.receiptCollected) return;

    room1.receiptCollected = true;
    window.gameState.addItem({
      id: 'atm_receipt',
      name: 'ATM Receipt (#481)',
      icon: '🧾',
      desc: 'ATM Transaction Receipt with Receipt No. #481 printed at the top.'
    });
    window.gameState.addXP(75);
    window.gameState.save();

    if (window.soundEngine) window.soundEngine.playSuccess();
    if (window.app) window.app.showToast('ITEM ACQUIRED: ATM RECEIPT (#481) 🧾', 'reward');

    this.updateDispensedItemsUI();
    this.checkATMCompletion();

    setTimeout(() => {
      this.openReceiptModal();
    }, 400);
  }

  openReceiptModal() {
    if (window.soundEngine) window.soundEngine.playClick();
    if (window.app) window.app.openModal('receipt-modal');
  }

  updateDispensedItemsUI() {
    const room1 = window.gameState?.state?.rooms?.[1] || {};
    const itemCash = document.getElementById('atm-item-cash');
    const itemDial = document.getElementById('atm-item-safe-dial');
    const itemReceipt = document.getElementById('atm-item-receipt');
    const textCash = document.getElementById('cash-status-text');
    const textDial = document.getElementById('dial-status-text');
    const textReceipt = document.getElementById('receipt-status-text');

    if (room1.cashCollected) {
      if (itemCash) itemCash.classList.add('collected');
      if (textCash) textCash.textContent = '✓ COLLECTED';
    }
    if (room1.safeDialCollected) {
      if (itemDial) itemDial.classList.add('collected');
      if (textDial) textDial.textContent = '✓ COLLECTED';
    }
    if (room1.receiptCollected) {
      if (itemReceipt) itemReceipt.classList.add('collected');
      if (textReceipt) textReceipt.textContent = '✓ COLLECTED';
    }
  }

  checkATMCompletion() {
    const room1 = window.gameState?.state?.rooms?.[1] || {};
    if (room1.cashCollected && room1.safeDialCollected && room1.receiptCollected) {
      const grantedPanel = document.getElementById('atm-state-granted');
      const completedPanel = document.getElementById('atm-state-completed');
      const statusBadge = document.getElementById('atm-status-tag');

      if (grantedPanel) grantedPanel.style.display = 'none';
      if (completedPanel) completedPanel.style.display = 'flex';
      if (statusBadge) {
        statusBadge.textContent = 'TRANSACTION COMPLETE';
        statusBadge.className = 'atm-status-badge active';
      }

      if (window.app) {
        setTimeout(() => {
          window.app.showToast('🎉 RECEIPT ACQUIRED! Passcode 481 unlocks Drawer 01 Keypad!', 'reward');
        }, 500);
      }
    }
  }

  openPinNoteModal() {
    if (window.soundEngine) window.soundEngine.playClick();
    if (window.app) window.app.openNoticeBoard();
  }

  inspectCounter(type) {
    const counters = {
      deposit: { name: 'DEPOSIT', number: '7', clue: 'Money coming in (Line 1)', icon: '📈' },
      withdrawal: { name: 'WITHDRAWAL', number: '3', clue: 'Money going out (Line 2)', icon: '📉' },
      transfer: { name: 'TRANSFER', number: '8', clue: 'Money moving away (Line 3)', icon: '💸' },
      savings: { name: 'SAVINGS', number: '5', clue: 'Money kept aside (Line 4)', icon: '🏦' }
    };

    const sel = counters[type] || counters.deposit;

    const titleEl = document.getElementById('counter-modal-title');
    const iconEl = document.getElementById('counter-modal-icon');
    const nameEl = document.getElementById('counter-modal-name');
    const numEl = document.getElementById('counter-modal-number');
    const clueEl = document.getElementById('counter-modal-clue');

    if (titleEl) titleEl.textContent = sel.name;
    if (iconEl) iconEl.textContent = sel.icon;
    if (nameEl) nameEl.textContent = sel.name;
    if (numEl) numEl.textContent = sel.number;
    if (clueEl) clueEl.textContent = sel.clue;

    if (window.soundEngine) window.soundEngine.playClick();
    if (window.app) window.app.openModal('counter-modal');
  }

  // ==========================================
  syncVaultUI() {
    const room1 = window.gameState?.state?.rooms?.[1] || {};
    const isInstalled1 = room1.safeHandle1Installed || room1.safeHandleInstalled;
    const angle1 = room1.handle1Angle || 0;

    const w3Wheel = document.getElementById('w3-installed-handle1-container');
    if (w3Wheel) {
      w3Wheel.style.display = isInstalled1 ? 'block' : 'none';
      w3Wheel.style.transform = `translate(-50%, -50%) rotate(${angle1}deg)`;
    }

    const w3Badge1 = document.getElementById('w3-handle1-degree-badge');
    if (w3Badge1) {
      w3Badge1.style.display = isInstalled1 ? 'block' : 'none';
      w3Badge1.textContent = `${angle1}°`;
    }

    const modalWheel = document.getElementById('safe-modal-handle1-container');
    if (modalWheel) {
      modalWheel.style.display = isInstalled1 ? 'block' : 'none';
      modalWheel.style.transform = `translate(-50%, -50%) rotate(${angle1}deg)`;
    }

    const modalBadge1 = document.getElementById('safe-modal-handle1-degree-badge');
    if (modalBadge1) {
      modalBadge1.style.display = isInstalled1 ? 'block' : 'none';
      modalBadge1.textContent = `${angle1}°`;
    }

    const zoomWheel = document.getElementById('handle1-placed-wheel-img');
    if (zoomWheel) {
      zoomWheel.style.display = isInstalled1 ? 'block' : 'none';
      zoomWheel.style.transform = `translate(-50%, -50%) rotate(${angle1}deg)`;
    }

    const zoomBadge1 = document.getElementById('handle1-zoom-degree-badge');
    if (zoomBadge1) {
      zoomBadge1.style.display = isInstalled1 ? 'block' : 'none';
      zoomBadge1.textContent = `${angle1}°`;
    }

    const isInstalled2 = room1.safeHandle2Installed;
    const angle2 = room1.handle2Angle || 0;

    const w3Wheel2 = document.getElementById('w3-installed-handle2-container');
    if (w3Wheel2) {
      w3Wheel2.style.display = isInstalled2 ? 'block' : 'none';
      w3Wheel2.style.transform = `translate(-50%, -50%) rotate(${angle2}deg)`;
    }

    const modalWheel2 = document.getElementById('safe-modal-handle2-container');
    if (modalWheel2) {
      modalWheel2.style.display = isInstalled2 ? 'block' : 'none';
      modalWheel2.style.transform = `translate(-50%, -50%) rotate(${angle2}deg)`;
    }

    const zoomWheel2 = document.getElementById('handle2-placed-wheel-img');
    if (zoomWheel2) {
      zoomWheel2.style.display = isInstalled2 ? 'block' : 'none';
      zoomWheel2.style.transform = `translate(-50%, -50%) rotate(${angle2}deg)`;
    }

    const safeSubtitle = document.getElementById('safe-modal-subtitle');
    if (safeSubtitle) {
      if (room1.vaultSafeUnlocked) {
        safeSubtitle.textContent = '🔓 VAULT SAFE UNLOCKED! Locker Room is open and accessible.';
        safeSubtitle.style.color = '#2ecc71';
      } else {
        safeSubtitle.textContent = `Vault Safe Combination: Handle 1 [${angle1}° / Target 60°] • Handle 2 [${angle2}° / Target 120°]`;
      }
    }
  }

  rotateHandle(handleNum) {
    const room1 = window.gameState.state.rooms[1];

    if (handleNum === 1) {
      const isInstalled1 = room1.safeHandle1Installed || room1.safeHandleInstalled;
      if (!isInstalled1) {
        this.installHandle(1);
        return;
      }
      room1.handle1Angle = ((room1.handle1Angle || 0) + 30) % 360;
      if (window.soundEngine) window.soundEngine.playClick();
      if (window.app) window.app.showToast(`🔄 Handle 1 Rotated to ${room1.handle1Angle}°`, 'normal');
      window.gameState.save();
      this.syncVaultUI();
      this.openHandle1Modal();
      this.checkVaultSafeCombination();

    } else if (handleNum === 2) {
      const isInstalled2 = room1.safeHandle2Installed;
      if (!isInstalled2) {
        this.installHandle(2);
        return;
      }
      room1.handle2Angle = ((room1.handle2Angle || 0) + 30) % 360;
      if (window.soundEngine) window.soundEngine.playClick();
      if (window.app) window.app.showToast(`🔄 Handle 2 Rotated to ${room1.handle2Angle}°`, 'normal');
      window.gameState.save();
      this.syncVaultUI();
      this.openHandle2Modal();
      this.checkVaultSafeCombination();
    }
  }

  checkVaultSafeCombination() {
    const room1 = window.gameState.state.rooms[1];
    const isInstalled1 = room1.safeHandle1Installed || room1.safeHandleInstalled;
    const isInstalled2 = room1.safeHandle2Installed;
    const angle1 = room1.handle1Angle || 0;
    const angle2 = room1.handle2Angle || 0;

    if (isInstalled1 && isInstalled2 && angle1 === 60 && angle2 === 120) {
      if (!room1.vaultSafeUnlocked) {
        room1.vaultSafeUnlocked = true;
        window.gameState.addXP(250);
        window.gameState.save();

        if (window.soundEngine) {
          if (window.soundEngine.playDrawerOpen) window.soundEngine.playDrawerOpen();
          setTimeout(() => window.soundEngine.playSuccess(), 350);
        }

        if (window.app) {
          window.app.showToast('🔓 VAULT SAFE UNLOCKED! (Handle 1: 60°, Handle 2: 120°) — WALL 5 UNLOCKED!', 'success');
        }

        this.syncVaultUI();

        const goToWall5 = () => {
          if (window.app) {
            window.app.closeModal('safe-modal');
            window.app.closeModal('handle1-zoom-modal');
            window.app.closeModal('handle2-zoom-modal');
          }
          if (window.vintageRoomEngine) {
            window.vintageRoomEngine.unlockWall5();
          }
          if (window.app) {
            window.app.showToast('🔍 Wall 5 Unlocked! Click Locker No. 7533 on Wall 5 to open the Budget Allocation Terminal.', 'info');
          }
        };

        // Show Knowledge Box 03 first ("YOU GOT A KNOWLEDGE BOX!").
        // Clicking NEXT will unlock and switch view to Wall 5 (Locker Room)!
        setTimeout(() => {
          if (window.roomController) {
            window.roomController.startKnowledgeBox(3, goToWall5);
          } else {
            goToWall5();
          }
        }, 500);
      }
    }
  }

  openLockerRoomModal() {
    this.syncVaultUI();
    if (window.app) {
      window.app.closeModal('safe-modal');
      window.app.closeModal('handle1-zoom-modal');
      window.app.closeModal('handle2-zoom-modal');
    }
    if (window.vintageRoomEngine) {
      window.vintageRoomEngine.unlockWall5();
    }
  }

  collectVaultCash() {
    const room1 = window.gameState?.state?.rooms?.[1];
    if (!room1) return;
    if (room1.vaultCashCollected) {
      if (window.app) window.app.showToast('Reserve cash already collected! +$10,000 in funds.', 'normal');
      return;
    }
    room1.vaultCashCollected = true;
    window.gameState.addXP(250);
    window.gameState.save();

    const cashStatus = document.getElementById('locker-cash-status-text');
    if (cashStatus) {
      cashStatus.textContent = '✓ COLLECTED (+$10,000)';
      cashStatus.style.color = '#2ecc71';
    }

    if (window.soundEngine) window.soundEngine.playSuccess();
    if (window.app) window.app.showToast('💵 VAULT RESERVE CASH COLLECTED! +$10,000 added to budget funds!', 'reward');
  }

  openSafeModal() {
    this.syncVaultUI();
    const room1 = window.gameState.state.rooms[1];
    if (room1.vaultSafeUnlocked) {
      this.openLockerRoomModal();
    } else {
      if (window.app) window.app.openModal('safe-modal');
    }
  }

  openHandle1Modal() {
    this.syncVaultUI();
    const room1 = window.gameState?.state?.rooms?.[1] || {};
    const btn1 = document.getElementById('btn-place-handle-1');
    const subtitle = document.getElementById('handle1-prompt-subtitle');
    const socketGlow = document.getElementById('handle1-center-socket-glow');

    if (room1.vaultSafeUnlocked) {
      this.openLockerRoomModal();
      return;
    }

    const hasHandle1 = window.gameState?.hasItem('main_safe_handle') || room1.safeHandle1Installed || room1.safeHandleInstalled;
    const isInstalled1 = room1.safeHandle1Installed || room1.safeHandleInstalled;
    const angle1 = room1.handle1Angle || 0;

    if (socketGlow) {
      socketGlow.style.display = isInstalled1 ? 'none' : 'block';
    }

    if (btn1) {
      if (isInstalled1) {
        btn1.textContent = `🔄 ROTATE HANDLE 1 (30°/CLICK) — CURRENT: ${angle1}°`;
        btn1.disabled = false;
        btn1.onclick = () => this.rotateHandle(1);
        if (subtitle) subtitle.textContent = `Handle 1 Installed! Current Rotation: ${angle1}° (Target: 60°). Click wheel or button to rotate.`;
      } else if (hasHandle1) {
        btn1.textContent = '⚙️ PLACE HANDLE 1 HERE →';
        btn1.disabled = false;
        btn1.onclick = () => this.installHandle(1);
        if (subtitle) subtitle.textContent = 'Place Handle 1 here.';
      } else {
        btn1.textContent = '🔒 HANDLE 1 REQUIRED (FIND IN SUITCASE)';
        btn1.disabled = true;
        btn1.onclick = null;
        if (subtitle) subtitle.textContent = 'Place Handle 1 here. (Main Safe Handle required)';
      }
    }

    if (!isInstalled1 && !hasHandle1 && window.app) {
      window.app.showToast('🔒 You need Handle 1 to place here! Find it in the Suitcase on Wall 2.', 'error');
    }

    if (window.app) window.app.openModal('handle1-zoom-modal');
  }

  openHandle2Modal() {
    this.syncVaultUI();
    const room1 = window.gameState?.state?.rooms?.[1] || {};
    const btn2 = document.getElementById('btn-place-handle-2');
    const subtitle = document.getElementById('handle2-prompt-subtitle');
    const socketGlow = document.getElementById('handle2-center-socket-glow');

    if (room1.vaultSafeUnlocked) {
      this.openLockerRoomModal();
      return;
    }

    const hasHandle2 = window.gameState?.hasItem('safe_dial') || room1.safeHandle2Installed;
    const isInstalled2 = room1.safeHandle2Installed;
    const angle2 = room1.handle2Angle || 0;

    if (socketGlow) {
      socketGlow.style.display = isInstalled2 ? 'none' : 'block';
    }

    if (btn2) {
      if (isInstalled2) {
        btn2.textContent = `🔄 ROTATE HANDLE 2 (30°/CLICK) — CURRENT: ${angle2}°`;
        btn2.disabled = false;
        btn2.onclick = () => this.rotateHandle(2);
        if (subtitle) subtitle.textContent = `Handle 2 Installed! Current Rotation: ${angle2}° (Target: 120°). Click wheel or button to rotate.`;
      } else if (hasHandle2) {
        btn2.textContent = '⚙️ PLACE HANDLE 2 HERE →';
        btn2.disabled = false;
        btn2.onclick = () => this.installHandle(2);
        if (subtitle) subtitle.textContent = 'Place Handle 2 here.';
      } else {
        btn2.textContent = '🔒 HANDLE 2 REQUIRED (FIND IN ATM)';
        btn2.disabled = true;
        btn2.onclick = null;
        if (subtitle) subtitle.textContent = 'Place Handle 2 here. (Safe Dial required from ATM)';
      }
    }

    if (!isInstalled2 && !hasHandle2 && window.app) {
      window.app.showToast('🔒 You need Handle 2 (Safe Dial) to place here! Collect it from the ATM on Wall 2.', 'error');
    }

    if (window.app) window.app.openModal('handle2-zoom-modal');
  }

  installHandle(handleNumber) {
    const room1 = window.gameState.state.rooms[1];

    if (handleNumber === 1) {
      if (room1.safeHandle1Installed || room1.safeHandleInstalled) {
        this.rotateHandle(1);
        return;
      }
      const hasHandle = window.gameState?.hasItem('main_safe_handle');
      if (!hasHandle) {
        if (window.app) window.app.showToast('Handle 1 required! Find the Main Safe Handle inside the Suitcase on Wall 2.', 'error');
        return;
      }

      room1.safeHandle1Installed = true;
      room1.safeHandleInstalled = true;
      room1.handle1Angle = 0;
      window.gameState.addXP(100);
      window.gameState.save();

      if (window.soundEngine) {
        if (window.soundEngine.playDrawerOpen) window.soundEngine.playDrawerOpen();
        setTimeout(() => window.soundEngine.playSuccess(), 300);
      }

      if (window.app) window.app.showToast('HANDLE 1 INSTALLED! Click to rotate in 30° steps (Target: 60°).', 'success');
      this.syncVaultUI();
      this.openHandle1Modal();

    } else if (handleNumber === 2) {
      if (room1.safeHandle2Installed) {
        this.rotateHandle(2);
        return;
      }
      const hasDial = window.gameState?.hasItem('safe_dial');
      if (!hasDial) {
        if (window.app) window.app.showToast('Handle 2 required! Collect the Safe Dial from the ATM on Wall 2.', 'error');
        return;
      }

      room1.safeHandle2Installed = true;
      room1.handle2Angle = 0;
      window.gameState.addXP(100);
      window.gameState.save();

      if (window.soundEngine) {
        if (window.soundEngine.playDrawerOpen) window.soundEngine.playDrawerOpen();
        setTimeout(() => window.soundEngine.playSuccess(), 300);
      }

      if (window.app) window.app.showToast('HANDLE 2 INSTALLED! Click to rotate in 30° steps (Target: 120°).', 'success');
      this.syncVaultUI();
      this.openHandle2Modal();
    }
  }

  installMainSafeHandle() {
    this.installHandle(1);
  }

  openSafeDialCombination() {
    this.openSafeModal();
  }

  pullRedBook() {
    this.openSafeModal();
  }

  openSafe() {
    this.openSafeModal();
  }

  // ==========================================
  // PUZZLE 3: WALL CLOCK (TIME: 04:00 or 4:00)
  // ==========================================
  initClockModalEvents() {
    const input = document.getElementById('clock-input-val');
    if (input) {
      input.oninput = () => {
        const val = input.value.trim();
        const parts = val.split(':');
        let h = parseInt(parts[0]) || 0;
        let m = parseInt(parts[1]) || 0;
        const hDeg = (h % 12) * 30 + (m / 60) * 30;
        const mDeg = (m % 60) * 6;

        const modalH = document.getElementById('modal-clock-hand-h');
        const modalM = document.getElementById('modal-clock-hand-m');
        const wallH = document.getElementById('wall-1-svg-hour-hand');
        const wallM = document.getElementById('wall-1-svg-min-hand');

        if (modalH) modalH.style.transform = `rotate(${hDeg}deg)`;
        if (modalM) modalM.style.transform = `rotate(${mDeg}deg)`;
        if (wallH) wallH.style.transform = `rotate(${hDeg}deg)`;
        if (wallM) wallM.style.transform = `rotate(${mDeg}deg)`;
      };
    }
  }

  submitClockTime(timeString) {
    const clean = timeString.trim().toLowerCase();
    if (clean === '04:00' || clean === '4:00' || clean === '0400' || clean === '4') {
      const room1 = window.gameState.state.rooms[1];
      room1.clockSolved = true;
      window.gameState.addXP(100);
      window.gameState.save();

      if (window.soundEngine) {
        window.soundEngine.playClockChime();
        setTimeout(() => window.soundEngine.playSuccess(), 600);
      }
      if (window.app) {
        window.app.closeModal('clock-modal');
        window.app.showToast('Clock Hands Align! Secret Compartment Opened!', 'success');
        setTimeout(() => window.app.openKnowledgeBox(3), 700);
      }
      return true;
    } else {
      if (window.soundEngine) window.soundEngine.playError();
      if (window.app) {
        window.app.showToast('Incorrect Time. Re-read the Mysterious Note.', 'error');
      }
      return false;
    }
  }

  // ==========================================
  // FINAL PUZZLE: 3-PIECE PAINTING ASSEMBLY & RESTORATION
  // ==========================================
  syncPaintingUI() {
    const room1 = window.gameState?.state?.rooms?.[1];
    if (!room1) return;
    if (!room1.piecesPlaced) room1.piecesPlaced = [];

    // Sync each of the 3 slots in Modal & Wall 3
    for (let i = 1; i <= 3; i++) {
      const slot = document.getElementById(`painting-slot-${i}`);
      const btn = document.getElementById(`piece-thumb-${i}`);
      const isPlaced = room1.piecesPlaced.includes(i);
      const hasItem = window.gameState.hasItem(`painting_piece_${i}`) || (room1.kbsFound?.includes(i) && !isPlaced);

      if (slot) {
        slot.classList.toggle('filled', isPlaced);
      }

      if (btn) {
        if (isPlaced) {
          btn.classList.add('placed');
          btn.disabled = true;
          btn.innerHTML = `<span>✓</span> Fragment ${i} (Restored)`;
        } else if (hasItem) {
          btn.classList.remove('placed');
          btn.disabled = false;
          btn.innerHTML = `<span>🧩</span> Place Fragment ${i}`;
        } else {
          btn.classList.remove('placed');
          btn.disabled = true;
          btn.innerHTML = `<span>🔒</span> Fragment ${i} (in KB 0${i})`;
        }
      }

      // Sync Wall 3 visual slice
      const wallSlice = document.getElementById(`wall3-slice-${i}`);
      if (wallSlice) {
        wallSlice.classList.toggle('revealed', isPlaced);
      }
    }

    const allPlaced = room1.piecesPlaced.length >= 3;
    const canvasContainer = document.getElementById('wall3-painting-canvas');
    if (canvasContainer) {
      canvasContainer.classList.toggle('completed', allPlaced);
    }

    const keySection = document.getElementById('painting-golden-key-section');
    if (keySection) {
      if (allPlaced && !room1.keyAcquired && !window.gameState.hasItem('golden_escape_key')) {
        keySection.style.display = 'flex';
      } else {
        keySection.style.display = 'none';
      }
    }

    const subtitle = document.getElementById('painting-assembly-subtitle');
    if (subtitle) {
      if (allPlaced) {
        subtitle.textContent = '✨ Masterpiece fully restored! All 3 fragments united.';
      } else {
        subtitle.textContent = `Restoration Progress: ${room1.piecesPlaced.length}/3 fragments placed on canvas.`;
      }
    }
  }

  placePaintingPiece(pieceNumber) {
    const room1 = window.gameState.state.rooms[1];
    if (!room1.piecesPlaced) room1.piecesPlaced = [];

    if (room1.piecesPlaced.includes(pieceNumber)) {
      if (window.app) window.app.showToast(`Fragment ${pieceNumber} is already placed on the canvas.`, 'normal');
      return false;
    }

    const pieceId = `painting_piece_${pieceNumber}`;
    const hasPiece = window.gameState.hasItem(pieceId) || room1.kbsFound?.includes(pieceNumber);
    if (!hasPiece) {
      if (window.app) window.app.showToast(`You have not discovered Painting Fragment ${pieceNumber} yet. Complete Knowledge Box 0${pieceNumber}!`, 'error');
      return false;
    }

    // Place the piece
    room1.piecesPlaced.push(pieceNumber);
    window.gameState.removeItem(pieceId);
    window.gameState.save();

    if (window.soundEngine) window.soundEngine.playClick();

    // Sync UI on both modal and Wall 3
    this.syncPaintingUI();

    if (window.app) {
      window.app.showToast(`Fragment ${pieceNumber} restored on the canvas!`, 'success');
    }

    // Check if all 3 pieces are placed
    if (room1.piecesPlaced.length >= 3) {
      room1.paintingCompleted = true;
      window.gameState.unlockBadge('puzzle_art');
      window.gameState.addXP(200);
      window.gameState.save();

      if (window.soundEngine) {
        setTimeout(() => window.soundEngine.playEscapeFanfare(), 300);
      }

      this.syncPaintingUI();

      if (window.app) {
        setTimeout(() => {
          window.app.showToast('🎉 Masterpiece Fully Restored! Golden Escape Key Revealed!', 'reward');
        }, 500);
      }
    }
    return true;
  }

  // ==========================================
  // LOCKER 07 & DIGITAL PERSONAL MONEY MANAGEMENT TERMINAL
  // ==========================================
  clickLocker07() {
    const room1 = window.gameState?.state?.rooms?.[1] || {};

    room1.lockerLocated = true;
    room1.lockerOpened = true;
    window.gameState.save();

    if (window.soundEngine) {
      if (window.soundEngine.playLockClick) window.soundEngine.playLockClick();
      setTimeout(() => {
        if (window.soundEngine && window.soundEngine.playDrawerOpen) window.soundEngine.playDrawerOpen();
      }, 200);
      setTimeout(() => {
        if (window.soundEngine && window.soundEngine.playSuccess) window.soundEngine.playSuccess();
      }, 500);
    }

    if (window.app) {
      window.app.updateHUD();
      window.app.showToast('🔑 Inserting Key #7533 into Locker No. 7533... *CLICK!* Locker door unlocks & opens.', 'success');
      setTimeout(() => {
        window.app.openModal('digital-budget-terminal-modal');
        this.initBudgetTerminalView();
      }, 650);
    } else {
      this.initBudgetTerminalView();
    }
  }

  initBudgetTerminalView() {
    const room1 = window.gameState?.state?.rooms?.[1] || {};
    const availMoney = room1.availableMoney || 10000;

    const availDisp = document.getElementById('terminal-available-money-disp');
    const summaryAvail = document.getElementById('summary-available-val');
    if (availDisp) availDisp.textContent = `₹${availMoney.toLocaleString()}`;
    if (summaryAvail) summaryAvail.textContent = `₹${availMoney.toLocaleString()}`;

    // Restore saved allocations if present
    if (room1.budgetAllocations) {
      const b = room1.budgetAllocations;
      if (document.getElementById('input-rent')) document.getElementById('input-rent').value = b.rent || '';
      if (document.getElementById('input-groceries')) document.getElementById('input-groceries').value = b.groceries || '';
      if (document.getElementById('input-utilities')) document.getElementById('input-utilities').value = b.utilities || '';
      if (document.getElementById('input-wifi')) document.getElementById('input-wifi').value = b.wifi || '';
      if (document.getElementById('input-emi')) document.getElementById('input-emi').value = b.emi || '';
      if (document.getElementById('input-gym')) document.getElementById('input-gym').value = b.gym || '';
      if (document.getElementById('input-dining')) document.getElementById('input-dining').value = b.dining || '';
      if (document.getElementById('input-hobbies')) document.getElementById('input-hobbies').value = b.hobbies || '';
    }

    this.calculateLiveBudget();

    const successComp = document.getElementById('budget-success-compartment');
    const btnDone = document.getElementById('btn-submit-budget-done');
    const keyStatusBtn = document.getElementById('terminal-key-status-btn');

    if (room1.budgetSubmitted) {
      if (successComp) successComp.style.display = 'block';
      if (btnDone) {
        btnDone.textContent = '✓ BUDGET BALANCED & SUBMITTED';
        btnDone.disabled = true;
        btnDone.style.opacity = '0.6';
      }
    } else {
      if (successComp) successComp.style.display = 'none';
      if (btnDone) {
        btnDone.textContent = '[ DONE ]';
        btnDone.disabled = false;
        btnDone.style.opacity = '1';
      }
    }

    if (room1.keyAcquired && keyStatusBtn) {
      keyStatusBtn.textContent = '✓ ESCAPE KEY ACQUIRED';
      keyStatusBtn.style.background = '#2ecc71';
    }
  }

  calculateLiveBudget() {
    const room1 = window.gameState?.state?.rooms?.[1] || {};
    const availMoney = room1.availableMoney || 10000;

    const rent = parseFloat(document.getElementById('input-rent')?.value) || 0;
    const groceries = parseFloat(document.getElementById('input-groceries')?.value) || 0;
    const utilities = parseFloat(document.getElementById('input-utilities')?.value) || 0;
    const wifi = parseFloat(document.getElementById('input-wifi')?.value) || 0;
    const emi = parseFloat(document.getElementById('input-emi')?.value) || 0;

    const totalSurvival = rent + groceries + utilities + wifi + emi;

    const dispSurvival = document.getElementById('disp-total-survival');
    const summarySurvival = document.getElementById('summary-survival-val');
    if (dispSurvival) dispSurvival.textContent = `₹${totalSurvival.toLocaleString()}`;
    if (summarySurvival) summarySurvival.textContent = `₹${totalSurvival.toLocaleString()}`;

    const gym = parseFloat(document.getElementById('input-gym')?.value) || 0;
    const dining = parseFloat(document.getElementById('input-dining')?.value) || 0;
    const hobbies = parseFloat(document.getElementById('input-hobbies')?.value) || 0;

    const totalThrive = gym + dining + hobbies;

    const dispThrive = document.getElementById('disp-total-thrive');
    const summaryThrive = document.getElementById('summary-thrive-val');
    if (dispThrive) dispThrive.textContent = `₹${totalThrive.toLocaleString()}`;
    if (summaryThrive) summaryThrive.textContent = `₹${totalThrive.toLocaleString()}`;

    const totalAllocated = totalSurvival + totalThrive;
    const remaining = availMoney - totalAllocated;

    const summaryAllocated = document.getElementById('summary-allocated-val');
    const summaryRemaining = document.getElementById('summary-remaining-val');
    const warningBox = document.getElementById('budget-overbudget-warning');

    if (summaryAllocated) summaryAllocated.textContent = `₹${totalAllocated.toLocaleString()}`;
    if (summaryRemaining) {
      summaryRemaining.textContent = `₹${remaining.toLocaleString()}`;
      if (remaining < 0) {
        summaryRemaining.style.color = '#ff6b6b';
      } else {
        summaryRemaining.style.color = '#2ecc71';
      }
    }

    if (warningBox) {
      if (totalAllocated > availMoney) {
        warningBox.style.display = 'block';
      } else {
        warningBox.style.display = 'none';
      }
    }
  }

  submitBudgetDone() {
    const room1 = window.gameState?.state?.rooms?.[1] || {};
    const availMoney = room1.availableMoney || 10000;

    const valRent = document.getElementById('input-rent')?.value?.trim();
    const valGroceries = document.getElementById('input-groceries')?.value?.trim();
    const valUtilities = document.getElementById('input-utilities')?.value?.trim();
    const valWifi = document.getElementById('input-wifi')?.value?.trim();
    const valEmi = document.getElementById('input-emi')?.value?.trim();
    const valGym = document.getElementById('input-gym')?.value?.trim();
    const valDining = document.getElementById('input-dining')?.value?.trim();
    const valHobbies = document.getElementById('input-hobbies')?.value?.trim();

    const rent = parseFloat(valRent) || 0;
    const groceries = parseFloat(valGroceries) || 0;
    const utilities = parseFloat(valUtilities) || 0;
    const wifi = parseFloat(valWifi) || 0;
    const emi = parseFloat(valEmi) || 0;
    const gym = parseFloat(valGym) || 0;
    const dining = parseFloat(valDining) || 0;
    const hobbies = parseFloat(valHobbies) || 0;

    const valMsg = document.getElementById('budget-validation-msg');

    // Rule 4: No negative values
    if (rent < 0 || groceries < 0 || utilities < 0 || wifi < 0 || emi < 0 || gym < 0 || dining < 0 || hobbies < 0) {
      if (valMsg) {
        valMsg.textContent = '⚠️ Please enter valid amounts for all categories.';
        valMsg.style.display = 'block';
      }
      if (window.soundEngine && window.soundEngine.playLockClick) window.soundEngine.playLockClick();
      if (window.app) window.app.showToast('⚠️ Enter a valid amount.', 'error');
      return;
    }

    // Rule 1 & Rule 3: None of the 5 Survival categories can be <= 0 or empty
    const survivalInputs = [
      { val: valRent, num: rent },
      { val: valGroceries, num: groceries },
      { val: valUtilities, num: utilities },
      { val: valWifi, num: wifi },
      { val: valEmi, num: emi }
    ];

    const hasZeroSurvival = survivalInputs.some(item => !item.val || item.num <= 0);

    if (hasZeroSurvival) {
      if (valMsg) {
        valMsg.textContent = '⚠️ Your essential expenses are incomplete. Every Survival category must receive an allocation.';
        valMsg.style.display = 'block';
      }
      if (window.soundEngine && window.soundEngine.playLockClick) window.soundEngine.playLockClick();
      if (window.app) window.app.showToast('⚠️ Survival expenses cannot be zero. Allocate money to every essential category.', 'error');
      return;
    }

    // Rule 2: Total Allocated <= Available Money
    const totalSurvival = rent + groceries + utilities + wifi + emi;
    const totalThrive = gym + dining + hobbies;
    const totalAllocated = totalSurvival + totalThrive;

    if (totalAllocated > availMoney) {
      if (valMsg) {
        valMsg.textContent = '⚠️ Your budget exceeds your available money. Rebalance your expenses.';
        valMsg.style.display = 'block';
      }
      if (window.soundEngine && window.soundEngine.playLockClick) window.soundEngine.playLockClick();
      if (window.app) window.app.showToast('⚠️ Your budget exceeds your available money. Rebalance your expenses.', 'error');
      return;
    }

    // Validation Successful!
    if (valMsg) valMsg.style.display = 'none';

    room1.budgetSubmitted = true;
    room1.budgetAllocations = { rent, groceries, utilities, wifi, emi, gym, dining, hobbies };
    window.gameState.unlockBadge('budget_master');
    window.gameState.addXP(250);
    window.gameState.save();

    if (window.soundEngine) {
      if (window.soundEngine.playEscapeFanfare) window.soundEngine.playEscapeFanfare();
      else if (window.soundEngine.playSuccess) window.soundEngine.playSuccess();
    }

    if (window.app) window.app.updateHUD();

    const successComp = document.getElementById('budget-success-compartment');
    const btnDone = document.getElementById('btn-submit-budget-done');

    if (successComp) successComp.style.display = 'block';
    if (btnDone) {
      btnDone.textContent = '✓ BUDGET BALANCED';
      btnDone.disabled = true;
      btnDone.style.opacity = '0.6';
    }

    if (window.app) {
      window.app.showToast('✅ Budget successfully balanced! Room Escape Key revealed.', 'reward');
    }
  }

  collectRoomEscapeKey() {
    const room1 = window.gameState?.state?.rooms?.[1] || {};

    if (!room1.budgetSubmitted) {
      if (window.app) {
        window.app.showToast('🔒 Golden Escape Key is locked! Complete & submit your Budget Plan in Locker 07 first.', 'error');
      }
      return false;
    }

    if (room1.keyAcquired) {
      if (window.app) window.app.showToast('Golden Escape Key already acquired! Proceed to Wall 3 Exit Door.', 'normal');
      return true;
    }

    room1.keyAcquired = true;
    window.gameState.addItem({
      id: 'golden_escape_key',
      name: 'Golden Escape Key',
      icon: '🗝️',
      type: 'escape_key',
      desc: 'The ornate golden key unlocking the exit door of the inspireLIFE chamber.'
    });
    window.gameState.addXP(100);
    window.gameState.save();

    const keyStatusBtn = document.getElementById('terminal-key-status-btn');
    if (keyStatusBtn) {
      keyStatusBtn.textContent = '✓ ESCAPE KEY ACQUIRED';
      keyStatusBtn.style.background = '#2ecc71';
    }

    const completionSummary = document.getElementById('terminal-completion-summary');
    if (completionSummary) completionSummary.style.display = 'block';

    const lockerKeyStatusText = document.getElementById('locker-key-status-text');
    if (lockerKeyStatusText) {
      lockerKeyStatusText.textContent = '✓ COLLECTED';
      lockerKeyStatusText.style.color = '#2ecc71';
    }

    if (window.soundEngine) {
      if (window.soundEngine.playEscapeFanfare) window.soundEngine.playEscapeFanfare();
      else if (window.soundEngine.playSuccess) window.soundEngine.playSuccess();
    }

    if (window.app) {
      window.app.updateHUD();
      window.app.showToast('🗝️ GOLDEN ESCAPE KEY ACQUIRED! Proceed to Wall 3 Exit Door to Escape!', 'reward');
    }
    return true;
  }

  collectGoldenKey() {
    const success = this.collectRoomEscapeKey();
    if (success && window.app) {
      window.app.closeModal('locker-room-modal');
      window.app.closeModal('digital-budget-terminal-modal');
      if (window.vintageRoomEngine) window.vintageRoomEngine.setWall(3);
    }
  }

  // ==========================================================================
  // WALL 2: PUZZLE 2 — THE MERCHANT'S MISSING COINS & INNER ARCHIVE
  // ==========================================================================

  switchMerchantTab(tabName) {
    const tabs = ['habits', 'video', 'clues', 'ledger'];
    tabs.forEach(t => {
      const btn = document.getElementById(`tab-btn-m-${t}`);
      const panel = document.getElementById(`merchant-tab-${t}-panel`);
      if (btn) btn.classList.toggle('active', t === tabName);
      if (panel) panel.style.display = t === tabName ? 'block' : 'none';
    });

    if (tabName === 'habits') {
      this.initSelfCheckUI();
    } else if (tabName === 'video') {
      this.initVideo31UI();
    }

    if (window.soundEngine && window.soundEngine.playClick) {
      window.soundEngine.playClick();
    }
  }

  autoFillCashBoxMath() {
    const in1 = document.getElementById('cashbox-math-1');
    const in2 = document.getElementById('cashbox-math-2');
    const in3 = document.getElementById('cashbox-math-3');
    if (in1) in1.value = 2400;
    if (in2) in2.value = 6500;
    if (in3) in3.value = 3500;
    if (window.app) {
      window.app.showToast('⚡ Cash box math equations auto-filled! Click "Solve & Unlock Cash Box".', 'normal');
    }
  }

  submitCashBoxMath() {
    const in1 = parseInt(document.getElementById('cashbox-math-1')?.value, 10);
    const in2 = parseInt(document.getElementById('cashbox-math-2')?.value, 10);
    const in3 = parseInt(document.getElementById('cashbox-math-3')?.value, 10);

    // 4500 - 2100 = 2400
    // 4200 + 2300 = 6500
    // 10000 - 6500 = 3500
    if (in1 === 2400 && in2 === 6500 && in3 === 3500) {
      if (window.soundEngine && window.soundEngine.playSuccess) {
        window.soundEngine.playSuccess();
      }
      if (window.app) {
        window.app.unlockCashBox();
      }
    } else {
      if (window.soundEngine && window.soundEngine.playLockClick) {
        window.soundEngine.playLockClick();
      }
      if (window.app) {
        window.app.showToast('⚠️ Incorrect equation answers. Check your math: 4,500−2,100=?, 4,200+2,300=?, 10,000−6,500=?', 'error');
      }
    }
  }

  finishCashBoxVideo() {
    if (window.app) {
      window.app.closeModal('cash-box-modal');
      window.app.updateHUD();
      window.app.showToast('📦 Cash Box Archive Complete! Click the Notice Board to inspect the Merchant\'s Diary.', 'reward');
    }
  }

  // --- TAB 1: MONEY HABITS SELF-CHECK (10 QUESTIONS) ---
  initSelfCheckUI() {
    const container = document.getElementById('self-check-questions-container');
    if (!container) return;

    const savedState = window.gameState?.state?.puzzle2 || {};
    if (savedState.selfCheckAnswers) {
      this.selfCheckAnswers = Object.assign({}, savedState.selfCheckAnswers);
    }

    container.innerHTML = '';
    this.selfCheckQuestions.forEach((q, idx) => {
      const qNum = idx + 1;
      const currentAns = this.selfCheckAnswers[qNum];
      const card = document.createElement('div');
      card.className = 'self-check-card' + (currentAns !== undefined ? ' answered' : '');
      card.id = `self-check-card-${qNum}`;
      card.innerHTML = `
        <div class="self-check-q-left">
          <span class="self-check-q-num">#${qNum < 10 ? '0' + qNum : qNum}</span>
          <span class="self-check-q-text">${q}</span>
        </div>
        <div class="self-check-btn-group">
          <button class="btn-yn yes ${currentAns === true ? 'active' : ''}" onclick="window.puzzleManager.answerSelfCheck(${qNum}, true)">
            YES ✓
          </button>
          <button class="btn-yn no ${currentAns === false ? 'active' : ''}" onclick="window.puzzleManager.answerSelfCheck(${qNum}, false)">
            NO ✕
          </button>
        </div>
      `;
      container.appendChild(card);
    });

    this.updateSelfCheckScoreUI();
  }

  answerSelfCheck(qNum, isYes) {
    this.selfCheckAnswers[qNum] = isYes;

    const card = document.getElementById(`self-check-card-${qNum}`);
    if (card) {
      card.classList.add('answered');
      const yesBtn = card.querySelector('.btn-yn.yes');
      const noBtn = card.querySelector('.btn-yn.no');
      if (yesBtn) yesBtn.classList.toggle('active', isYes === true);
      if (noBtn) noBtn.classList.toggle('active', isYes === false);
    }

    if (window.soundEngine && window.soundEngine.playClick) {
      window.soundEngine.playClick();
    }

    this.updateSelfCheckScoreUI();
  }

  updateSelfCheckScoreUI() {
    const answeredCount = Object.keys(this.selfCheckAnswers).length;
    let score = 0;
    for (const k in this.selfCheckAnswers) {
      if (this.selfCheckAnswers[k] === true) score++;
    }

    const scoreBox = document.getElementById('self-check-score-box');
    const badge = document.getElementById('self-check-score-badge');
    const feedback = document.getElementById('self-check-feedback-text');
    const videoScoreDisp = document.getElementById('video31-score-disp');

    if (videoScoreDisp) {
      videoScoreDisp.textContent = `Your Money-Awareness Score: ${score} / 10`;
    }

    if (answeredCount >= 10) {
      if (scoreBox) scoreBox.style.display = 'block';
      if (badge) badge.textContent = `YOUR MONEY-AWARENESS SCORE: ${score} / 10`;

      let msg = '';
      if (score >= 9) {
        msg = '🌟 9–10: Strong money-awareness habits! You maintain mindful control over your cashflows and guard against silent financial leaks.';
      } else if (score >= 6) {
        msg = '👍 6–8: Good progress; some habits need improvement. You have a solid baseline, but unrecorded small daily expenses can quietly erode your wealth.';
      } else {
        msg = '💡 Below 6: Time to build stronger financial-awareness habits. Tracking every expense immediately turns financial chaos into clarity.';
      }
      if (feedback) feedback.textContent = msg;

      // Save to game state
      if (!window.gameState.state.puzzle2) window.gameState.state.puzzle2 = {};
      window.gameState.state.puzzle2.selfCheckAnswers = this.selfCheckAnswers;
      window.gameState.state.puzzle2.selfCheckScore = score;
      window.gameState.state.puzzle2.selfCheckCompleted = true;
      window.gameState.save();
    } else {
      if (scoreBox) scoreBox.style.display = 'none';
    }
  }

  // --- TAB 2: VIDEO 3.1 (HOW AWARE ARE YOU ABOUT MONEY?) ---
  initVideo31UI() {
    this.video31CurrentTime = 0;
    this.video31IsPlaying = false;
    this.updateVideo31ProgressUI();

    const p2 = window.gameState?.state?.puzzle2 || {};
    const continueBtn = document.getElementById('btn-video31-continue-ledger');
    if (p2.video31Completed && continueBtn) {
      continueBtn.style.display = 'block';
    }

    this.startVideo31Playback();
  }

  toggleVideo31Playback() {
    if (this.video31IsPlaying) {
      this.pauseVideo31Playback();
    } else {
      this.startVideo31Playback();
    }
  }

  startVideo31Playback() {
    if (this.video31Interval) clearInterval(this.video31Interval);
    this.video31IsPlaying = true;
    const playBtn = document.getElementById('btn-video31-play-pause');
    if (playBtn) playBtn.textContent = '⏸ PAUSE';

    this.video31Interval = setInterval(() => {
      this.video31CurrentTime += 0.2;
      if (this.video31CurrentTime >= this.video31Duration) {
        this.video31CurrentTime = this.video31Duration;
        this.pauseVideo31Playback();
        this.completeVideo31();
      }
      this.updateVideo31ProgressUI();
    }, 200);
  }

  pauseVideo31Playback() {
    if (this.video31Interval) clearInterval(this.video31Interval);
    this.video31Interval = null;
    this.video31IsPlaying = false;
    const playBtn = document.getElementById('btn-video31-play-pause');
    if (playBtn) playBtn.textContent = '▶ PLAY';
  }

  skipVideo31Playback() {
    this.pauseVideo31Playback();
    this.video31CurrentTime = this.video31Duration;
    this.updateVideo31ProgressUI();
    this.completeVideo31();
  }

  replayVideo31() {
    this.video31CurrentTime = 0;
    this.startVideo31Playback();
  }

  toggleVideo31Captions() {
    this.video31CaptionsOn = !this.video31CaptionsOn;
    const box = document.getElementById('video31-captions-box');
    const btn = document.getElementById('btn-video31-captions');
    if (box) box.style.display = this.video31CaptionsOn ? 'flex' : 'none';
    if (btn) btn.textContent = this.video31CaptionsOn ? '💬 CAPTIONS: ON' : '💬 CAPTIONS: OFF';
  }

  seekVideo31Progress(e) {
    const track = e.currentTarget;
    const rect = track.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    this.video31CurrentTime = ratio * this.video31Duration;
    this.updateVideo31ProgressUI();
    if (this.video31CurrentTime >= this.video31Duration) {
      this.completeVideo31();
    }
  }

  updateVideo31ProgressUI() {
    const pct = Math.min(100, (this.video31CurrentTime / this.video31Duration) * 100);
    const fill = document.getElementById('video31-progress-fill');
    if (fill) fill.style.width = `${pct}%`;

    const timeDisp = document.getElementById('video31-time-display');
    if (timeDisp) {
      const curSec = Math.floor(this.video31CurrentTime).toString().padStart(2, '0');
      timeDisp.textContent = `00:${curSec} / 00:10`;
    }

    const stageBadge = document.getElementById('video31-stage-badge');
    const icon = document.getElementById('video31-visual-icon');
    const caption = document.getElementById('video31-caption-text');

    if (this.video31CurrentTime < 2.5) {
      if (stageBadge) {
        stageBadge.textContent = 'STAGE 1: THE INVISIBLE LEAKS';
        stageBadge.style.color = '#00e5ff';
        stageBadge.style.borderColor = '#00e5ff';
      }
      if (icon) icon.textContent = '🧭';
      if (caption) caption.textContent = '"Tracking your money is like checking your compass before a voyage. Unseen daily leaks sink the greatest fortunes."';
    } else if (this.video31CurrentTime < 5.0) {
      if (stageBadge) {
        stageBadge.textContent = 'STAGE 2: MYSTERY DEFICITS';
        stageBadge.style.color = '#ffd700';
        stageBadge.style.borderColor = '#ffd700';
      }
      if (icon) icon.textContent = '🪙';
      if (caption) caption.textContent = '"The merchant feared theft had taken his coins — but casual, untracked cash transactions were the true drain."';
    } else if (this.video31CurrentTime < 7.5) {
      if (stageBadge) {
        stageBadge.textContent = 'STAGE 3: ACTIVE RECORDING';
        stageBadge.style.color = '#2ecc71';
        stageBadge.style.borderColor = '#2ecc71';
      }
      if (icon) icon.textContent = '📜';
      if (caption) caption.textContent = '"When you match every receipt against your diary immediately, mystery shortages disappear forever."';
    } else {
      if (stageBadge) {
        stageBadge.textContent = 'STAGE 4: CAPITAL MINDFULNESS';
        stageBadge.style.color = '#e056fd';
        stageBadge.style.borderColor = '#e056fd';
      }
      if (icon) icon.textContent = '🛡️';
      if (caption) caption.textContent = '"Every rupee given a clear purpose strengthens your financial runway and unlocks lasting peace of mind."';
    }
  }

  completeVideo31() {
    if (!window.gameState.state.puzzle2) window.gameState.state.puzzle2 = {};
    window.gameState.state.puzzle2.video31Completed = true;
    window.gameState.save();

    const continueBtn = document.getElementById('btn-video31-continue-ledger');
    if (continueBtn) continueBtn.style.display = 'block';

    if (window.soundEngine && window.soundEngine.playSuccess) {
      window.soundEngine.playSuccess();
    }
    if (window.app) {
      window.app.showToast('🎬 Video 3.1 Completed! Proceed to Reconstruct the Fortune.', 'reward');
      window.app.updateHUD();
    }
  }

  // --- TAB 4: RECONSTRUCT THE FORTUNE (ACCOUNT LEDGER PUZZLE) ---
  calculateLedgerHelper() {
    const missingInput = document.getElementById('ledger-input-missing');
    const balanceInput = document.getElementById('ledger-input-balance');
    const valMissing = parseInt(missingInput?.value, 10) || 0;

    const starting = 8000;
    const sales = 5000;
    const totalInflow = starting + sales; // 13000
    const knownExpenses = 1200 + 850 + 450; // 2500
    const totalExpenses = knownExpenses + valMissing;
    const computedBalance = totalInflow - totalExpenses;

    if (balanceInput && !balanceInput.value) {
      balanceInput.value = computedBalance;
    }

    if (window.app) {
      window.app.showToast(`🧮 Ledger Calculation: ₹${totalInflow} Inflow − ₹${totalExpenses} Expenses = ₹${computedBalance} Balance`, 'normal');
    }
  }

  calculateLedgerHelperModal() {
    const missingInput = document.getElementById('ledger-modal-input-missing');
    const balanceInput = document.getElementById('ledger-modal-input-balance');
    const valMissing = parseInt(missingInput?.value, 10) || 0;

    const starting = 8000;
    const sales = 5000;
    const totalInflow = starting + sales;
    const knownExpenses = 1200 + 850 + 450;
    const totalExpenses = knownExpenses + valMissing;
    const computedBalance = totalInflow - totalExpenses;

    if (balanceInput && !balanceInput.value) {
      balanceInput.value = computedBalance;
    }

    if (window.app) {
      window.app.showToast(`🧮 Ledger Calculation: ₹${totalInflow} Inflow − ₹${totalExpenses} Expenses = ₹${computedBalance} Balance`, 'normal');
    }
  }

  submitLedgerSolution() {
    const missingInput = document.getElementById('ledger-input-missing');
    const balanceInput = document.getElementById('ledger-input-balance');
    const valMissing = parseInt(missingInput?.value, 10);
    const valBalance = parseInt(balanceInput?.value, 10);

    if (valMissing === 500 && valBalance === 10000) {
      this.handleLedgerSuccess();
    } else {
      let hint = '';
      if (valMissing !== 500) {
        hint = 'Check the Merchant\'s Diary margin note on March 28th for the unrecorded courier expense!';
      } else {
        hint = 'Re-check your balance: ₹8,000 + ₹5,000 − ₹1,200 − ₹850 − ₹450 − ₹500 = ?';
      }
      if (window.app) window.app.showToast(`❌ Incorrect Ledger Balance. ${hint}`, 'error');
    }
  }

  submitLedgerModalSolution() {
    const missingInput = document.getElementById('ledger-modal-input-missing');
    const balanceInput = document.getElementById('ledger-modal-input-balance');
    const valMissing = parseInt(missingInput?.value, 10);
    const valBalance = parseInt(balanceInput?.value, 10);

    if (valMissing === 500 && valBalance === 10000) {
      this.handleLedgerSuccess();
    } else {
      let hint = '';
      if (valMissing !== 500) {
        hint = 'Check the Merchant\'s Diary margin note on March 28th for the unrecorded courier expense!';
      } else {
        hint = 'Re-check your balance: ₹8,000 + ₹5,000 − ₹1,200 − ₹850 − ₹450 − ₹500 = ?';
      }
      if (window.app) window.app.showToast(`❌ Incorrect Ledger Balance. ${hint}`, 'error');
    }
  }

  handleLedgerSuccess() {
    if (!window.gameState.state.puzzle2) window.gameState.state.puzzle2 = {};
    window.gameState.state.puzzle2.ledgerCompleted = true;
    window.gameState.save();

    // Show reward container in both views
    const rewardBox = document.getElementById('ledger-reward-container');
    const modalRewardBox = document.getElementById('ledger-modal-reward-container');
    if (rewardBox) rewardBox.style.display = 'block';
    if (modalRewardBox) modalRewardBox.style.display = 'block';

    const submitBtn = document.getElementById('btn-submit-ledger');
    const modalSubmitBtn = document.getElementById('btn-modal-submit-ledger');
    if (submitBtn) {
      submitBtn.textContent = '✓ LEDGER BALANCED & RECONCILED';
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';
    }
    if (modalSubmitBtn) {
      modalSubmitBtn.textContent = '✓ LEDGER BALANCED & RECONCILED';
      modalSubmitBtn.disabled = true;
      modalSubmitBtn.style.opacity = '0.7';
    }

    if (window.soundEngine && window.soundEngine.playSuccess) {
      window.soundEngine.playSuccess();
    }

    if (window.app) {
      window.app.showToast('✨ LEDGER RECONCILED! Secret compartment released — Year Clue 1748 & Mirrors revealed!', 'reward');
      window.app.updateHUD();
    }
  }


  // ==========================================================================
  // WALL 3: PUZZLE 3 — THE ANTIQUE BALANCE, VIDEO 3.2, & SEVEN ENVELOPES
  // ==========================================================================
  initPuzzle3State() {
    this.scaleSlots = this.scaleSlots || [false, false, false, false, false, false, false];
    this.video32IsPlaying = false;
    this.video32CurrentTime = 0;
    this.video32Duration = 10;
    this.video32CaptionsOn = true;
    this.video32Interval = null;
    this.justifications = { emergency: 1, living: 1, recreation: 1 };
  }

  placeAllBarsOnScale() {
    this.initPuzzle3State();
    this.scaleSlots = [true, true, true, true, true, true, true];
    for (let i = 0; i < 7; i++) {
      const row = document.getElementById('scale-slot-row-' + i);
      const badge = document.getElementById('slot-badge-' + i);
      if (row) row.classList.add('filled');
      if (badge) {
        badge.classList.add('placed');
        badge.textContent = '⚜️ BAR PLACED';
      }
    }
    if (window.soundEngine && window.soundEngine.playClick) {
      window.soundEngine.playClick();
    }
    if (window.app) {
      window.app.showToast('⚜️ All seven sacred golden bars seated into the category slots!', 'normal');
    }
  }

  toggleScaleSlot(slotIdx) {
    this.initPuzzle3State();
    this.scaleSlots[slotIdx] = !this.scaleSlots[slotIdx];
    const row = document.getElementById('scale-slot-row-' + slotIdx);
    const badge = document.getElementById('slot-badge-' + slotIdx);
    if (this.scaleSlots[slotIdx]) {
      if (row) row.classList.add('filled');
      if (badge) {
        badge.classList.add('placed');
        badge.textContent = '⚜️ BAR PLACED';
      }
    } else {
      if (row) row.classList.remove('filled');
      if (badge) {
        badge.classList.remove('placed');
        badge.textContent = '[ BAR SLOT ]';
      }
    }
    if (window.soundEngine && window.soundEngine.playClick) {
      window.soundEngine.playClick();
    }
  }

  calibrateBalanceScale() {
    this.initPuzzle3State();
    const placedCount = this.scaleSlots.filter(Boolean).length;
    if (placedCount < 7) {
      this.placeAllBarsOnScale();
    }

    if (!window.gameState.state.puzzle3) window.gameState.state.puzzle3 = {};
    window.gameState.state.puzzle3.scaleBalanced = true;
    window.gameState.addXP(200);
    window.gameState.save();

    if (window.soundEngine && window.soundEngine.playSuccess) {
      window.soundEngine.playSuccess();
    }

    if (window.app) {
      window.app.showToast('⚖️ THE ANTIQUE BALANCE IS COUNTERBALANCED! (+200 XP) Click the Weight Balancer on Wall 3 to access the Seven Envelopes.', 'reward');
      window.app.closeModal('balance-scale-modal');
      window.app.updateHUD();
    }
  }

  // --------------------------------------------------------------------------
  // VIDEO 3.2: UNDERSTANDING BUDGETING THROUGH SEVEN ENVELOPES
  // --------------------------------------------------------------------------
  openVideo32() {
    this.initPuzzle3State();
    if (window.app) {
      window.app.openModal('video-3-2-modal');
    }
    this.updateVideo32ProgressUI();
    this.startVideo32Playback();
  }

  toggleVideo32Playback() {
    if (this.video32IsPlaying) {
      this.pauseVideo32Playback();
    } else {
      this.startVideo32Playback();
    }
  }

  startVideo32Playback() {
    if (this.video32Interval) clearInterval(this.video32Interval);
    this.video32IsPlaying = true;
    const playBtn = document.getElementById('btn-video32-play-pause');
    if (playBtn) playBtn.textContent = '⏸ PAUSE';

    this.video32Interval = setInterval(() => {
      this.video32CurrentTime += 0.2;
      if (this.video32CurrentTime >= this.video32Duration) {
        this.video32CurrentTime = this.video32Duration;
        this.pauseVideo32Playback();
        this.completeVideo32();
      }
      this.updateVideo32ProgressUI();
    }, 200);
  }

  pauseVideo32Playback() {
    if (this.video32Interval) clearInterval(this.video32Interval);
    this.video32Interval = null;
    this.video32IsPlaying = false;
    const playBtn = document.getElementById('btn-video32-play-pause');
    if (playBtn) playBtn.textContent = '▶ PLAY';
  }

  skipVideo32Playback() {
    this.pauseVideo32Playback();
    this.video32CurrentTime = this.video32Duration;
    this.updateVideo32ProgressUI();
    this.completeVideo32();
  }

  toggleVideo32Captions() {
    this.video32CaptionsOn = !this.video32CaptionsOn;
    const box = document.getElementById('video32-captions-box');
    const btn = document.getElementById('btn-video32-captions');
    if (box) box.style.display = this.video32CaptionsOn ? 'flex' : 'none';
    if (btn) btn.textContent = this.video32CaptionsOn ? '💬 CAPTIONS: ON' : '💬 CAPTIONS: OFF';
  }

  seekVideo32Progress(e) {
    const track = e.currentTarget;
    const rect = track.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    this.video32CurrentTime = ratio * this.video32Duration;
    this.updateVideo32ProgressUI();
    if (this.video32CurrentTime >= this.video32Duration) {
      this.completeVideo32();
    }
  }

  updateVideo32ProgressUI() {
    const pct = Math.min(100, (this.video32CurrentTime / this.video32Duration) * 100);
    const fill = document.getElementById('video32-progress-fill');
    if (fill) fill.style.width = `${pct}%`;

    const timeDisp = document.getElementById('video32-time-display');
    if (timeDisp) {
      const curSec = Math.floor(this.video32CurrentTime).toString().padStart(2, '0');
      timeDisp.textContent = `00:${curSec} / 00:10`;
    }

    const stageBadge = document.getElementById('video32-stage-badge');
    const stageTitle = document.getElementById('video32-stage-title');
    const stageSub = document.getElementById('video32-stage-sub');
    const captionsText = document.getElementById('video32-captions-text');

    if (this.video32CurrentTime < 3.5) {
      if (stageBadge) stageBadge.textContent = 'MODULE 3.2 • PART 1: THE POWER OF ALLOCATION';
      if (stageTitle) stageTitle.textContent = '✉️ Give Every Rupee a Job';
      if (stageSub) stageSub.textContent = 'When income is pooled in one loose pile, money evaporates. Dividing into seven envelopes creates unbreakable boundaries.';
      if (captionsText) captionsText.textContent = '“Assign every rupee a specific purpose before you spend a single penny.”';
    } else if (this.video32CurrentTime < 7.0) {
      if (stageBadge) stageBadge.textContent = 'MODULE 3.2 • PART 2: THE DEFENSIVE BOUNDARIES';
      if (stageTitle) stageTitle.textContent = '🛡️ Living Costs & Emergency Shields';
      if (stageSub) stageSub.textContent = 'Cap Living Expenses at 50% (max ₹5,000). Hold at least 10% (min ₹1,000) for Emergencies to prevent debt traps.';
      if (captionsText) captionsText.textContent = '“Never let everyday necessities eat into your emergency safety reserves.”';
    } else {
      if (stageBadge) stageBadge.textContent = 'MODULE 3.2 • PART 3: GROWTH, RECREATION & SKILL';
      if (stageTitle) stageTitle.textContent = '🚀 Future Independence';
      if (stageSub) stageSub.textContent = 'Savings (5% min), Investment (10% min), Business (5% min), Education (10% max), and planned Recreation (10% min).';
      if (captionsText) captionsText.textContent = '“A balanced budget funds essential joy today while building compounding wealth for tomorrow.”';
    }
  }

  completeVideo32() {
    if (!window.gameState.state.puzzle3) window.gameState.state.puzzle3 = {};
    window.gameState.state.puzzle3.video32Completed = true;
    window.gameState.save();

    const continueBtn = document.getElementById('btn-video32-continue-envelopes');
    if (continueBtn) {
      continueBtn.style.display = 'block';
    }

    if (window.soundEngine && window.soundEngine.playSuccess) {
      window.soundEngine.playSuccess();
    }
  }

  // --------------------------------------------------------------------------
  // ACTIVITY 3: THE SEVEN-ENVELOPE CHALLENGE
  // --------------------------------------------------------------------------
  updateEnvelopeTotal() {
    const valSavings = parseInt(document.getElementById('env-input-savings')?.value, 10) || 0;
    const valInvestment = parseInt(document.getElementById('env-input-investment')?.value, 10) || 0;
    const valLiving = parseInt(document.getElementById('env-input-living')?.value, 10) || 0;
    const valEmergency = parseInt(document.getElementById('env-input-emergency')?.value, 10) || 0;
    const valBusiness = parseInt(document.getElementById('env-input-business')?.value, 10) || 0;
    const valRecreation = parseInt(document.getElementById('env-input-recreation')?.value, 10) || 0;
    const valEducation = parseInt(document.getElementById('env-input-education')?.value, 10) || 0;

    const total = valSavings + valInvestment + valLiving + valEmergency + valBusiness + valRecreation + valEducation;

    const totalDisp = document.getElementById('env-total-disp');
    if (totalDisp) {
      totalDisp.textContent = `₹${total.toLocaleString()} / ₹10,000`;
      totalDisp.style.color = (total === 10000) ? '#2ecc71' : '#e74c3c';
    }

    const badgeSavings = document.getElementById('env-row-status-savings');
    if (badgeSavings) {
      badgeSavings.textContent = (valSavings >= 500) ? '✓' : '⚠️';
      badgeSavings.style.color = (valSavings >= 500) ? '#2ecc71' : '#e74c3c';
    }

    const badgeInvest = document.getElementById('env-row-status-investment');
    if (badgeInvest) {
      badgeInvest.textContent = (valInvestment >= 1000) ? '✓' : '⚠️';
      badgeInvest.style.color = (valInvestment >= 1000) ? '#2ecc71' : '#e74c3c';
    }

    const badgeLiving = document.getElementById('env-row-status-living');
    if (badgeLiving) {
      badgeLiving.textContent = (valLiving <= 5000 && valLiving > 0) ? '✓' : '⚠️';
      badgeLiving.style.color = (valLiving <= 5000 && valLiving > 0) ? '#2ecc71' : '#e74c3c';
    }

    const badgeEmerg = document.getElementById('env-row-status-emergency');
    if (badgeEmerg) {
      badgeEmerg.textContent = (valEmergency >= 1000) ? '✓' : '⚠️';
      badgeEmerg.style.color = (valEmergency >= 1000) ? '#2ecc71' : '#e74c3c';
    }

    const badgeBiz = document.getElementById('env-row-status-business');
    if (badgeBiz) {
      badgeBiz.textContent = (valBusiness >= 500) ? '✓' : '⚠️';
      badgeBiz.style.color = (valBusiness >= 500) ? '#2ecc71' : '#e74c3c';
    }

    const badgeRec = document.getElementById('env-row-status-recreation');
    if (badgeRec) {
      badgeRec.textContent = (valRecreation >= 1000) ? '✓' : '⚠️';
      badgeRec.style.color = (valRecreation >= 1000) ? '#2ecc71' : '#e74c3c';
    }

    const badgeEdu = document.getElementById('env-row-status-education');
    if (badgeEdu) {
      badgeEdu.textContent = (valEducation <= 1000 && valEducation >= 0) ? '✓' : '⚠️';
      badgeEdu.style.color = (valEducation <= 1000 && valEducation >= 0) ? '#2ecc71' : '#e74c3c';
    }

    const statusBadge = document.getElementById('env-status-badge');
    const isAllValid = (total === 10000 && valSavings >= 500 && valInvestment >= 1000 && valLiving <= 5000 && valEmergency >= 1000 && valBusiness >= 500 && valRecreation >= 1000 && valEducation <= 1000);
    if (statusBadge) {
      statusBadge.textContent = isAllValid ? 'PERFECT ALLOCATION ✓' : 'ADJUSTMENT REQUIRED';
      statusBadge.style.color = isAllValid ? '#2ecc71' : '#e74c3c';
    }
  }

  checkMyBudget() {
    this.updateEnvelopeTotal();
    const valSavings = parseInt(document.getElementById('env-input-savings')?.value, 10) || 0;
    const valInvestment = parseInt(document.getElementById('env-input-investment')?.value, 10) || 0;
    const valLiving = parseInt(document.getElementById('env-input-living')?.value, 10) || 0;
    const valEmergency = parseInt(document.getElementById('env-input-emergency')?.value, 10) || 0;
    const valBusiness = parseInt(document.getElementById('env-input-business')?.value, 10) || 0;
    const valRecreation = parseInt(document.getElementById('env-input-recreation')?.value, 10) || 0;
    const valEducation = parseInt(document.getElementById('env-input-education')?.value, 10) || 0;

    const total = valSavings + valInvestment + valLiving + valEmergency + valBusiness + valRecreation + valEducation;
    const feedbackBox = document.getElementById('envelope-validation-feedback');

    if (total !== 10000) {
      const diff = total - 10000;
      const msg = diff > 0 
        ? `⚠️ Over budget! Total allocated is ₹${total.toLocaleString()} (₹${diff.toLocaleString()} over ₹10,000). Reduce an envelope.`
        : `⚠️ Incomplete allocation! Total allocated is ₹${total.toLocaleString()} (₹${Math.abs(diff).toLocaleString()} unallocated). Allocate all ₹10,000.`;
      this.showBudgetFeedback(msg, false);
      if (window.soundEngine && window.soundEngine.playClick) window.soundEngine.playClick();
      return;
    }

    if (valSavings < 500) {
      this.showBudgetFeedback('⚠️ Savings envelope is ₹' + valSavings.toLocaleString() + '. Minimum required is 5% (₹500). Increase savings.', false);
      return;
    }
    if (valInvestment < 1000) {
      this.showBudgetFeedback('⚠️ Investment envelope is ₹' + valInvestment.toLocaleString() + '. Minimum required is 10% (₹1,000). Increase investment.', false);
      return;
    }
    if (valLiving > 5000) {
      this.showBudgetFeedback('⚠️ Living Expenses is ₹' + valLiving.toLocaleString() + '. Maximum allowed is 50% (₹5,000). Reduce living expenses to prevent lifestyle creep.', false);
      return;
    }
    if (valEmergency < 1000) {
      this.showBudgetFeedback('⚠️ Emergency Fund is ₹' + valEmergency.toLocaleString() + '. Minimum required is 10% (₹1,000). Increase emergency reserves.', false);
      return;
    }
    if (valBusiness < 500) {
      this.showBudgetFeedback('⚠️ Business Capital is ₹' + valBusiness.toLocaleString() + '. Minimum required is 5% (₹500). Increase business capital.', false);
      return;
    }
    if (valRecreation < 1000) {
      this.showBudgetFeedback('⚠️ Recreation envelope is ₹' + valRecreation.toLocaleString() + '. Minimum required is 10% (₹1,000). Currently ₹' + (1000 - valRecreation) + ' short! Adjust amounts to meet the recreation minimum.', false);
      return;
    }
    if (valEducation > 1000) {
      this.showBudgetFeedback('⚠️ Education / skilling is ₹' + valEducation.toLocaleString() + '. Maximum allowed is 10% (₹1,000). Reduce education allocation to fit constraint.', false);
      return;
    }

    // Budget Valid!
    this.showBudgetFeedback('✨ Outstanding! Every single constraint is respected and total equals ₹10,000. Now complete the short Justification Step below.', true);

    const justSection = document.getElementById('envelope-justification-section');
    if (justSection) {
      justSection.style.display = 'block';
      justSection.scrollIntoView({ behavior: 'smooth' });
    }

    if (window.soundEngine && window.soundEngine.playSuccess) {
      window.soundEngine.playSuccess();
    }
  }

  showBudgetFeedback(msg, isSuccess) {
    const feedbackBox = document.getElementById('envelope-validation-feedback');
    if (!feedbackBox) return;
    feedbackBox.style.display = 'block';
    feedbackBox.style.background = isSuccess ? 'rgba(46, 204, 113, 0.15)' : 'rgba(231, 76, 60, 0.15)';
    feedbackBox.style.border = isSuccess ? '1.5px solid #2ecc71' : '1.5px solid #e74c3c';
    feedbackBox.style.color = isSuccess ? '#2ecc71' : '#f1a9a0';
    feedbackBox.textContent = msg;
  }

  selectJustification(category, optionNum) {
    this.initPuzzle3State();
    this.justifications[category] = optionNum;

    if (category === 'emergency') {
      const btn1 = document.getElementById('just-opt-em-1');
      const btn2 = document.getElementById('just-opt-em-2');
      if (btn1) btn1.className = 'justification-option-btn' + (optionNum === 1 ? ' selected' : '');
      if (btn2) btn2.className = 'justification-option-btn' + (optionNum === 2 ? ' selected' : '');
    } else if (category === 'living') {
      const btn1 = document.getElementById('just-opt-liv-1');
      const btn2 = document.getElementById('just-opt-liv-2');
      if (btn1) btn1.className = 'justification-option-btn' + (optionNum === 1 ? ' selected' : '');
      if (btn2) btn2.className = 'justification-option-btn' + (optionNum === 2 ? ' selected' : '');
    } else if (category === 'recreation') {
      const btn1 = document.getElementById('just-opt-rec-1');
      const btn2 = document.getElementById('just-opt-rec-2');
      if (btn1) btn1.className = 'justification-option-btn' + (optionNum === 1 ? ' selected' : '');
      if (btn2) btn2.className = 'justification-option-btn' + (optionNum === 2 ? ' selected' : '');
    }

    if (window.soundEngine && window.soundEngine.playClick) {
      window.soundEngine.playClick();
    }
  }

  submitBudgetWithJustifications() {
    this.initPuzzle3State();
    if (this.justifications.emergency !== 1 || this.justifications.living !== 1 || this.justifications.recreation !== 1) {
      if (window.app) {
        window.app.showToast('Please select the sensible financial rationales for your budget justification!', 'error');
      }
      return;
    }

    if (!window.gameState.state.puzzle3) window.gameState.state.puzzle3 = {};
    window.gameState.state.puzzle3.budgetCompleted = true;
    window.gameState.save();

    const gBox = document.getElementById('glasses-reward-container');
    if (gBox) {
      gBox.style.display = 'block';
      gBox.scrollIntoView({ behavior: 'smooth' });
    }

    const subBtn = document.getElementById('btn-submit-justifications');
    if (subBtn) {
      subBtn.textContent = '✓ BUDGET & JUSTIFICATIONS VALIDATED';
      subBtn.disabled = true;
      subBtn.style.opacity = '0.7';
    }

    if (window.soundEngine && window.soundEngine.playSuccess) {
      window.soundEngine.playSuccess();
    }

    if (window.app) {
      window.app.showToast('✨ ALL 7 BUDGET CONSTRAINTS & REASONING VALIDATED! Secret compartment opened!', 'reward');
      window.app.updateHUD();
    }
  }

  // ==========================================================================
  // WALL 4: PUZZLE 4 — LASER GRID, OPTICAL MIRRORS, & TREASURE CHEST
  // ==========================================================================
  initPuzzle4State() {
    if (this.p4Initialized) return;
    this.p4Initialized = true;
    this.laserVisionActive = false;
    this.activeMirrorMount = 1;
    this.mirrorsPlaced = { 1: false, 2: false, 3: false, 4: false };
    this.mirrorAngles = { 1: 0, 2: 0, 3: 0, 4: 0 };
    this.safeAngles = { 1: 45, 2: 315, 3: 135, 4: 225 };
    this.selectedLifeStage = 'student';
    this.goalChoice = 1;
    this.actionChoice = 1;

    this.video34IsPlaying = false;
    this.video34CurrentTime = 0;
    this.video34Duration = 10;
    this.video34CaptionsOn = true;
    this.video34Interval = null;

    this.stageIncomes = {
      student: 10000,
      earning: 25000,
      partner: 40000,
      hustler: 20000,
      retirement: 50000
    };

    this.stageDefaults = {
      student: { ess: 4000, em: 1500, edu: 2000, inv: 1500, rec: 1000 },
      earning: { ess: 12000, em: 4000, edu: 2000, inv: 5000, rec: 2000 },
      partner: { ess: 20000, em: 6000, edu: 3000, inv: 8000, rec: 3000 },
      hustler: { ess: 9000, em: 4000, edu: 2500, inv: 3000, rec: 1500 },
      retirement: { ess: 22000, em: 8000, edu: 2000, inv: 14000, rec: 4000 }
    };
  }

  toggleLaserVision() {
    this.initPuzzle4State();
    const hasGlasses = window.gameState.hasItem('financial_glasses') || !!window.gameState?.state?.puzzle3?.glassesAcquired;

    if (!hasGlasses) {
      if (window.soundEngine && window.soundEngine.playLockClick) {
        window.soundEngine.playLockClick();
      }
      if (window.app) {
        window.app.showToast('🔒 You must acquire the Special Financial Glasses from Wall 3\'s Seven-Envelope Challenge to see the laser grid!', 'error');
      }
      return;
    }

    this.laserVisionActive = !this.laserVisionActive;
    const svgEl = document.getElementById('wall4-laser-svg');
    if (svgEl) {
      svgEl.classList.toggle('lasers-off', !this.laserVisionActive);
    }

    const wall4View = document.getElementById('wall-view-4');
    if (wall4View) {
      wall4View.classList.toggle('wall4-lasers-dormant', !this.laserVisionActive);
    }

    const titleEl = document.getElementById('w4-glasses-title');
    if (titleEl) {
      titleEl.textContent = this.laserVisionActive ? 'LASER VISION ACTIVE' : 'GLASSES REMOVED (INVISIBLE BEAMS)';
    }

    const toggleBtn = document.getElementById('btn-toggle-laser-vision');
    if (toggleBtn) {
      toggleBtn.textContent = this.laserVisionActive ? '👓 REMOVE GLASSES' : '👓 EQUIP GLASSES';
    }

    const badge = document.getElementById('w4-laser-status-badge');
    if (badge) {
      badge.style.display = this.laserVisionActive ? 'inline-flex' : 'none';
    }

    if (window.soundEngine && window.soundEngine.playClick) {
      window.soundEngine.playClick();
    }

    if (window.app) {
      window.app.showToast(this.laserVisionActive ? '👓 Special Financial Glasses Equipped: Laser grid & optical mounts revealed!' : '👓 Glasses removed. Lasers are now invisible security beams.', 'normal');
    }

    this.updateLaserGridVisuals();
  }

  interactMirrorMount(mountId) {
    this.initPuzzle4State();
    this.activeMirrorMount = mountId;

    const hasGlasses = window.gameState.hasItem('financial_glasses') || !!window.gameState?.state?.puzzle3?.glassesAcquired;

    if (!hasGlasses) {
      if (window.soundEngine && window.soundEngine.playLockClick) {
        window.soundEngine.playLockClick();
      }
      if (window.app) {
        window.app.showToast('🔒 You need the Special Financial Glasses from Wall 3 to detect optical mirror mountings!', 'error');
      }
      return;
    }

    if (!this.laserVisionActive) {
      // Auto equip glasses if held
      this.toggleLaserVision();
    }

    // Check if player holds mirrors from Puzzle 2
    if (!window.gameState.hasItem('merchant_mirrors') && !this.mirrorsPlaced[mountId]) {
      if (window.app) {
        window.app.showToast('🔒 You need the Optical Mirrors from the Merchant\'s Cash Box (Wall 2) to place on this pedestal!', 'error');
      }
      return;
    }

    // Place mirror if not yet placed
    if (!this.mirrorsPlaced[mountId]) {
      this.mirrorsPlaced[mountId] = true;
      if (window.soundEngine && window.soundEngine.playSuccess) {
        window.soundEngine.playSuccess();
      }
      if (window.app) {
        window.app.showToast(`🪞 Optical Mirror placed on Mount ${mountId}!`, 'reward');
      }
    }

    this.updateMountModalUI();
    this.updateLaserGridVisuals();

    if (window.app) {
      window.app.openModal('mirror-mount-modal');
    }
  }

  updateMountModalUI() {
    const mountId = this.activeMirrorMount;
    const isPlaced = this.mirrorsPlaced[mountId];
    const angle = this.mirrorAngles[mountId];
    const isSafe = (angle === this.safeAngles[mountId]);

    const titleEl = document.getElementById('modal-mirror-mount-title');
    if (titleEl) {
      const names = { 1: '1 (Front Left Pedestal)', 2: '2 (Front Right Pedestal)', 3: '3 (Mid Left Pedestal)', 4: '4 (Mid Right Pedestal)' };
      titleEl.textContent = `🪞 OPTICAL MIRROR MOUNT ${names[mountId]}`;
    }

    const angleDisp = document.getElementById('modal-mirror-angle-disp');
    if (angleDisp) angleDisp.textContent = `${angle}°`;

    const statusBadge = document.getElementById('modal-mirror-status-badge');
    if (statusBadge) {
      if (!isPlaced) {
        statusBadge.textContent = '🔒 NO MIRROR PLACED YET';
        statusBadge.style.color = '#ffa502';
        statusBadge.style.borderColor = '#ffa502';
        statusBadge.style.background = 'rgba(255, 165, 2, 0.15)';
      } else if (isSafe) {
        statusBadge.textContent = '✓ BEAM DEFLECTED SAFELY AWAY FROM CHEST';
        statusBadge.style.color = '#2ecc71';
        statusBadge.style.borderColor = '#2ecc71';
        statusBadge.style.background = 'rgba(46, 204, 113, 0.15)';
      } else {
        statusBadge.textContent = '⚠️ BEAM AIMED DIRECTLY AT TREASURE CHEST';
        statusBadge.style.color = '#ff4757';
        statusBadge.style.borderColor = '#ff4757';
        statusBadge.style.background = 'rgba(255, 71, 87, 0.15)';
      }
    }

    const modalImg = document.getElementById('modal-mirror-graphic-img');
    if (modalImg) {
      modalImg.style.transform = `rotate(${angle}deg)`;
    }
    const names = { 1: '1 (Left Arch Pillar)', 2: '2 (Right Arch Pillar)', 3: '3 (Left Column Base)', 4: '4 (Right Stand Base)' };
    if (titleEl) {
      titleEl.textContent = `🪞 OPTICAL MIRROR HOOK ${names[mountId]}`;
    }
  }

  previewLaserPath() {
    this.initPuzzle4State();
    const mountId = this.activeMirrorMount;
    const isSafe = (this.mirrorAngles[mountId] === this.safeAngles[mountId]);

    if (window.soundEngine && window.soundEngine.playClick) {
      window.soundEngine.playClick();
    }

    if (window.app) {
      if (isSafe) {
        window.app.showToast(`🔍 PREVIEW: Mirror Mount ${mountId} safely deflects the laser beam away from the chest route!`, 'reward');
      } else {
        window.app.showToast(`⚠️ PREVIEW: Mirror Mount ${mountId} angle (${this.mirrorAngles[mountId]}°) directs the beam straight at the treasure chest!`, 'error');
      }
    }
  }

  showLaserHint() {
    const hints = [
      'Hook 1 (Upper Left Arch Pillar): Set to 45° to deflect beam upward into vaulted arch.',
      'Hook 2 (Upper Right Arch Pillar): Set to 315° to deflect beam upward into vaulted arch.',
      'Hook 3 (Lower Left Column Base): Set to 135° to deflect beam downward to floor perimeter.',
      'Hook 4 (Lower Right Stand Base): Set to 225° to deflect beam downward to floor perimeter.'
    ];
    if (window.app) {
      window.app.showToast('💡 Laser Hint: ' + hints[this.activeMirrorMount - 1 || 0], 'reward');
    }
  }

  rotateActiveMirror(degDelta) {
    this.initPuzzle4State();
    const mountId = this.activeMirrorMount;
    this.mirrorsPlaced[mountId] = true;
    this.mirrorAngles[mountId] = (this.mirrorAngles[mountId] + degDelta + 360) % 360;

    if (window.soundEngine && window.soundEngine.playClick) {
      window.soundEngine.playClick();
    }

    this.updateMountModalUI();
    this.updateLaserGridVisuals();
  }

  autoAlignActiveMirror() {
    this.initPuzzle4State();
    const mountId = this.activeMirrorMount;
    this.mirrorsPlaced[mountId] = true;
    this.mirrorAngles[mountId] = this.safeAngles[mountId];

    if (window.soundEngine && window.soundEngine.playSuccess) {
      window.soundEngine.playSuccess();
    }

    this.updateMountModalUI();
    this.updateLaserGridVisuals();
  }

  autoAlignAllMirrors() {
    this.initPuzzle4State();
    for (let i = 1; i <= 4; i++) {
      this.mirrorsPlaced[i] = true;
      this.mirrorAngles[i] = this.safeAngles[i];
    }

    if (window.soundEngine && window.soundEngine.playSuccess) {
      window.soundEngine.playSuccess();
    }

    if (window.app) {
      window.app.showToast('✨ All four optical mirrors placed & aligned to safe deflection angles!', 'reward');
    }

    this.updateMountModalUI();
    this.updateLaserGridVisuals();
  }

  updateLaserGridVisuals() {
    this.initPuzzle4State();
    let beamsOnChest = 4;

    // Check each beam
    for (let i = 1; i <= 4; i++) {
      const isSafe = this.mirrorsPlaced[i] && (this.mirrorAngles[i] === this.safeAngles[i]);
      const badge = document.getElementById(`mirror-${i}-angle-badge`);
      const mountDot = document.getElementById(`w4-dot-mirror-${i}`);

      if (mountDot) {
        mountDot.classList.toggle('completed', isSafe);
        mountDot.classList.toggle('active-puzzle', !isSafe && this.mirrorsPlaced[i]);
      }

      if (badge) {
        if (!this.mirrorsPlaced[i]) {
          badge.textContent = 'Empty Hook';
          badge.style.color = '#bfb098';
        } else if (isSafe) {
          badge.textContent = `${this.mirrorAngles[i]}° (Safe ✓)`;
          badge.style.color = '#2ecc71';
        } else {
          badge.textContent = `${this.mirrorAngles[i]}° (Blocked ⚠️)`;
          badge.style.color = '#ff4757';
        }
      }

      // Update Hanging Mirror Image on Wall 4
      const hangingImg = document.getElementById(`mirror-hanging-img-${i}`);
      if (hangingImg) {
        hangingImg.style.display = this.mirrorsPlaced[i] ? 'block' : 'none';
        hangingImg.style.transform = `translateX(-50%) rotate(${this.mirrorAngles[i]}deg)`;
      }

      const directLine = document.getElementById(`laser-beam-${i}`);
      const directLineCore = document.getElementById(`laser-beam-${i}-core`);
      const deflectedLine = document.getElementById(`laser-beam-${i}-deflected`);
      const deflectedLineCore = document.getElementById(`laser-beam-${i}-deflected-core`);
      const spark = document.getElementById(`laser-spark-${i}`);

      if (isSafe) {
        beamsOnChest--;
        // Re-route beam to pedestal then reflect away
        const newTargets = { 1: [395, 322], 2: [598, 320], 3: [291, 492], 4: [654, 492] };
        if (directLine) {
          directLine.setAttribute('x2', newTargets[i][0]);
          directLine.setAttribute('y2', newTargets[i][1]);
        }
        if (directLineCore) {
          directLineCore.setAttribute('x2', newTargets[i][0]);
          directLineCore.setAttribute('y2', newTargets[i][1]);
        }
        if (deflectedLine) deflectedLine.style.display = 'block';
        if (deflectedLineCore) deflectedLineCore.style.display = 'block';
        if (spark) spark.style.display = 'none';
      } else {
        // Direct beam aimed at chest or chest dais
        const chestTargets = { 1: [468, 345], 2: [468, 345], 3: [468, 355], 4: [468, 355] };
        if (directLine) {
          directLine.setAttribute('x2', chestTargets[i][0]);
          directLine.setAttribute('y2', chestTargets[i][1]);
        }
        if (directLineCore) {
          directLineCore.setAttribute('x2', chestTargets[i][0]);
          directLineCore.setAttribute('y2', chestTargets[i][1]);
        }
        if (deflectedLine) deflectedLine.style.display = 'none';
        if (deflectedLineCore) deflectedLineCore.style.display = 'none';
        if (spark) spark.style.display = 'block';
      }
    }

    // Update HUD status badge
    const countBadge = document.getElementById('w4-laser-status-badge');
    const countText = document.getElementById('w4-laser-status-text');
    const countIcon = document.getElementById('w4-laser-status-icon');
    const safeAura = document.getElementById('w4-chest-safe-aura');
    const chestDot = document.getElementById('w4-dot-chest');
    const chestText = document.getElementById('w4-chest-text');
    const chestIcon = document.getElementById('w4-chest-icon');

    // Update mirrors placed count text
    const placedCount = Object.values(this.mirrorsPlaced).filter(Boolean).length;
    const placedEl = document.getElementById('w4-mirrors-placed-text');
    if (placedEl) {
      placedEl.textContent = `Mirrors placed: ${placedCount} / 4`;
      placedEl.style.color = (placedCount === 4) ? '#2ecc71' : '#ffd700';
    }

    if (beamsOnChest === 0) {
      if (!window.gameState.state.puzzle4) window.gameState.state.puzzle4 = {};
      window.gameState.state.puzzle4.lasersRedirected = true;
      window.gameState.save();

      if (countBadge) countBadge.className = 'glasses-indicator-pill';
      if (countText) countText.textContent = 'NO LASERS ON CHEST (SAFE ✓)';
      if (countIcon) countIcon.textContent = '✓';
      if (safeAura) safeAura.style.display = 'block';

      if (chestDot) {
        chestDot.classList.remove('locked');
        chestDot.classList.add('completed');
      }
      if (chestText) chestText.textContent = 'Treasure Chest (Unlocked ✓)';
      if (chestIcon) chestIcon.textContent = '⚜️';
    } else {
      if (countBadge) countBadge.className = 'glasses-indicator-pill blocked';
      if (countText) countText.textContent = `${beamsOnChest} BEAMS BLOCKING CHEST`;
      if (countIcon) countIcon.textContent = '⚠️';
      if (safeAura) safeAura.style.display = 'none';

      if (chestDot) {
        chestDot.classList.add('locked');
        chestDot.classList.remove('completed');
      }
      if (chestText) chestText.textContent = `Treasure Chest (${beamsOnChest} Lasers Active 🔒)`;
      if (chestIcon) chestIcon.textContent = '🔒';
    }
  }

  interactTreasureChest() {
    this.initPuzzle4State();
    const p4 = window.gameState?.state?.puzzle4 || {};

    if (!p4.lasersRedirected) {
      if (window.soundEngine && window.soundEngine.playLockClick) {
        window.soundEngine.playLockClick();
      }
      const hasGlasses = window.gameState.hasItem('financial_glasses') || !!window.gameState?.state?.puzzle3?.glassesAcquired;
      if (!hasGlasses) {
        if (window.app) {
          window.app.showToast('🔒 The Grand Treasure Chest is protected by invisible laser sensors! Complete Wall 3 to acquire Special Financial Glasses.', 'error');
        }
      } else if (!this.laserVisionActive) {
        this.toggleLaserVision();
        if (window.app) {
          window.app.showToast('⚠️ Lasers detected! Rotate the 4 optical mirrors so no lasers touch the chest.', 'error');
        }
      } else {
        if (window.app) {
          window.app.showToast('⚠️ LASER BARRIER ACTIVE: Rotate the 4 optical mirrors so that NO lasers touch the chest!', 'error');
        }
      }
      return;
    }

    // Chest is safe! Open modal
    if (window.soundEngine && window.soundEngine.playSuccess) {
      window.soundEngine.playSuccess();
    }
    if (window.app) {
      window.app.openModal('treasure-chest-modal');
    }
    this.updateVideo34ProgressUI();
  }

  // --------------------------------------------------------------------------
  // VIDEO 3.4: LIFE STAGE SIMULATION
  // --------------------------------------------------------------------------
  toggleVideo34Playback() {
    if (this.video34IsPlaying) {
      this.pauseVideo34Playback();
    } else {
      this.startVideo34Playback();
    }
  }

  startVideo34Playback() {
    if (this.video34Interval) clearInterval(this.video34Interval);
    this.video34IsPlaying = true;
    const playBtn = document.getElementById('btn-video34-play-pause');
    if (playBtn) playBtn.textContent = '⏸ PAUSE';

    this.video34Interval = setInterval(() => {
      this.video34CurrentTime += 0.2;
      if (this.video34CurrentTime >= this.video34Duration) {
        this.video34CurrentTime = this.video34Duration;
        this.pauseVideo34Playback();
        this.completeVideo34();
      }
      this.updateVideo34ProgressUI();
    }, 200);
  }

  pauseVideo34Playback() {
    if (this.video34Interval) clearInterval(this.video34Interval);
    this.video34Interval = null;
    this.video34IsPlaying = false;
    const playBtn = document.getElementById('btn-video34-play-pause');
    if (playBtn) playBtn.textContent = '▶ PLAY';
  }

  skipVideo34Playback() {
    this.pauseVideo34Playback();
    this.video34CurrentTime = this.video34Duration;
    this.updateVideo34ProgressUI();
    this.completeVideo34();
  }

  toggleVideo34Captions() {
    this.video34CaptionsOn = !this.video34CaptionsOn;
    const box = document.getElementById('video34-captions-box');
    const btn = document.getElementById('btn-video34-captions');
    if (box) box.style.display = this.video34CaptionsOn ? 'flex' : 'none';
    if (btn) btn.textContent = this.video34CaptionsOn ? '💬 CAPTIONS: ON' : '💬 CAPTIONS: OFF';
  }

  seekVideo34Progress(e) {
    const track = e.currentTarget;
    const rect = track.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    this.video34CurrentTime = ratio * this.video34Duration;
    this.updateVideo34ProgressUI();
    if (this.video34CurrentTime >= this.video34Duration) {
      this.completeVideo34();
    }
  }

  updateVideo34ProgressUI() {
    const pct = Math.min(100, (this.video34CurrentTime / this.video34Duration) * 100);
    const fill = document.getElementById('video34-progress-fill');
    if (fill) fill.style.width = `${pct}%`;

    const timeDisp = document.getElementById('video34-time-display');
    if (timeDisp) {
      const curSec = Math.floor(this.video34CurrentTime).toString().padStart(2, '0');
      timeDisp.textContent = `00:${curSec} / 00:10`;
    }

    const stageBadge = document.getElementById('video34-stage-badge');
    const stageTitle = document.getElementById('video34-stage-title');
    const stageSub = document.getElementById('video34-stage-sub');
    const captionsText = document.getElementById('video34-captions-text');

    if (this.video34CurrentTime < 3.5) {
      if (stageBadge) stageBadge.textContent = 'MODULE 3.4 • PART 1: PRIORITIES EVOLVE';
      if (stageTitle) stageTitle.textContent = '🌱 What Would You Prioritize?';
      if (stageSub) stageSub.textContent = 'A student\'s top asset is earning potential; a new earner must avoid lifestyle creep; a partner must manage combined responsibilities.';
      if (captionsText) captionsText.textContent = '“Financial success is not one fixed formula—it is adapting wisely to each life chapter.”';
    } else if (this.video34CurrentTime < 7.0) {
      if (stageBadge) stageBadge.textContent = 'MODULE 3.4 • PART 2: COPING WITH VOLATILITY';
      if (stageTitle) stageTitle.textContent = '🛡️ Defending Your Future';
      if (stageSub) stageSub.textContent = 'Side hustlers require thicker emergency buffers. Early retirees must live off compounding dividends rather than panic-selling capital.';
      if (captionsText) captionsText.textContent = '“Never bet your primary safety cushion on speculative ventures.”';
    } else {
      if (stageBadge) stageBadge.textContent = 'MODULE 3.4 • PART 3: THE ACTION COMMITMENT';
      if (stageTitle) stageTitle.textContent = '🚀 Building Your Custom Plan';
      if (stageSub) stageSub.textContent = 'Balance essential costs, maintain emergency reserves, invest in continuous skills, and commit to consistent monthly saving.';
      if (captionsText) captionsText.textContent = '“Small, automated monthly commitments build unstoppable generational wealth.”';
    }
  }

  completeVideo34() {
    if (!window.gameState.state.puzzle4) window.gameState.state.puzzle4 = {};
    window.gameState.state.puzzle4.video34Completed = true;
    window.gameState.save();

    const continueBtn = document.getElementById('btn-video34-continue-plan');
    if (continueBtn) {
      continueBtn.style.display = 'block';
    }

    if (window.soundEngine && window.soundEngine.playSuccess) {
      window.soundEngine.playSuccess();
    }
  }

  unlockFuturePlanActivity() {
    const videoStage = document.getElementById('chest-video-stage');
    const actStage = document.getElementById('chest-activity-stage');
    if (videoStage) videoStage.style.display = 'none';
    if (actStage) {
      actStage.style.display = 'block';
      this.selectLifeStage('student');
    }
  }

  // --------------------------------------------------------------------------
  // ACTIVITY 4: BUILD YOUR FUTURE PLAN
  // --------------------------------------------------------------------------
  selectLifeStage(stageKey) {
    this.initPuzzle4State();
    this.selectedLifeStage = stageKey;

    ['student', 'earning', 'partner', 'hustler', 'retirement'].forEach(k => {
      const btn = document.getElementById(`btn-stage-${k}`);
      if (btn) btn.className = 'btn btn-secondary' + (k === stageKey ? ' selected' : '');
    });

    const income = this.stageIncomes[stageKey];
    const def = this.stageDefaults[stageKey];

    const headline = document.getElementById('plan-stage-headline');
    const badge = document.getElementById('plan-income-badge');
    const names = { student: 'STUDENT', earning: 'STARTED EARNING', partner: 'LIVING WITH PARTNER', hustler: 'SIDE HUSTLER', retirement: 'EARLY RETIREMENT' };

    if (headline) headline.textContent = `CHOSEN STAGE: ${names[stageKey]}`;
    if (badge) badge.textContent = `MONTHLY INCOME: ₹${income.toLocaleString()}`;

    const inEss = document.getElementById('plan-input-essentials');
    const inEm = document.getElementById('plan-input-emergency');
    const inEdu = document.getElementById('plan-input-education');
    const inInv = document.getElementById('plan-input-investment');
    const inRec = document.getElementById('plan-input-recreation');

    if (inEss) inEss.value = def.ess;
    if (inEm) inEm.value = def.em;
    if (inEdu) inEdu.value = def.edu;
    if (inInv) inInv.value = def.inv;
    if (inRec) inRec.value = def.rec;

    this.updatePlanTotal();
  }

  updatePlanTotal() {
    const valEss = parseInt(document.getElementById('plan-input-essentials')?.value, 10) || 0;
    const valEm = parseInt(document.getElementById('plan-input-emergency')?.value, 10) || 0;
    const valEdu = parseInt(document.getElementById('plan-input-education')?.value, 10) || 0;
    const valInv = parseInt(document.getElementById('plan-input-investment')?.value, 10) || 0;
    const valRec = parseInt(document.getElementById('plan-input-recreation')?.value, 10) || 0;

    const total = valEss + valEm + valEdu + valInv + valRec;
    const target = this.stageIncomes[this.selectedLifeStage] || 10000;

    const totalDisp = document.getElementById('plan-total-disp');
    if (totalDisp) {
      totalDisp.textContent = `₹${total.toLocaleString()} / ₹${target.toLocaleString()}`;
      totalDisp.style.color = (total === target) ? '#2ecc71' : '#e74c3c';
    }
  }

  selectGoalOption(num) {
    this.goalChoice = num;
    for (let i = 1; i <= 3; i++) {
      const b = document.getElementById(`goal-opt-${i}`);
      if (b) b.className = 'justification-option-btn' + (num === i ? ' selected' : '');
    }
  }

  selectActionOption(num) {
    this.actionChoice = num;
    for (let i = 1; i <= 3; i++) {
      const b = document.getElementById(`action-opt-${i}`);
      if (b) b.className = 'justification-option-btn' + (num === i ? ' selected' : '');
    }
  }

  evaluatePlanRules() {
    this.initPuzzle4State();
    const valEss = parseInt(document.getElementById('plan-input-essentials')?.value, 10) || 0;
    const valEm = parseInt(document.getElementById('plan-input-emergency')?.value, 10) || 0;
    const valEdu = parseInt(document.getElementById('plan-input-education')?.value, 10) || 0;
    const valInv = parseInt(document.getElementById('plan-input-investment')?.value, 10) || 0;
    const valRec = parseInt(document.getElementById('plan-input-recreation')?.value, 10) || 0;

    const total = valEss + valEm + valEdu + valInv + valRec;
    const income = this.stageIncomes[this.selectedLifeStage] || 10000;

    const feedback = [];
    let isValid = true;

    // Rule 1: Planned spending does not exceed available income
    if (total > income) {
      isValid = false;
      feedback.push(`❌ Over-budget: Allocated ₹${total.toLocaleString()} exceeds available income of ₹${income.toLocaleString()} by ₹${(total - income).toLocaleString()}.`);
    } else if (total < income) {
      isValid = false;
      feedback.push(`⚠️ Under-allocated: ₹${(income - total).toLocaleString()} unallocated. All funds should have a dedicated category purpose.`);
    } else {
      feedback.push(`✓ Spending matches available income exactly (₹${total.toLocaleString()} / ₹${income.toLocaleString()}).`);
    }

    // Rule 2: Essential expenses are covered
    const minEss = Math.round(income * 0.30);
    if (valEss <= 0) {
      isValid = false;
      feedback.push(`❌ Essential expenses cannot be ₹0. Living basics (food, shelter, utilities) must be funded first.`);
    } else if (valEss < minEss) {
      isValid = false;
      feedback.push(`⚠️ Essential expenses of ₹${valEss.toLocaleString()} are unrealistically low for this life stage (recommend at least ₹${minEss.toLocaleString()}).`);
    } else {
      feedback.push(`✓ Essential living expenses realistically covered (₹${valEss.toLocaleString()}).`);
    }

    // Rule 3: Some money allocated to emergency savings
    if (valEm <= 0) {
      isValid = false;
      feedback.push(`❌ Emergency savings cannot be ₹0. Unexpected emergencies require an immediate liquidity buffer.`);
    } else if (valEm < Math.round(income * 0.05)) {
      isValid = false;
      feedback.push(`⚠️ Emergency savings of ₹${valEm.toLocaleString()} is thin (recommend at least 5-10% of income).`);
    } else {
      feedback.push(`✓ Emergency cushion protected (₹${valEm.toLocaleString()}).`);
    }

    // Rule 4: Long-term goal is realistic
    if (this.goalChoice === 2) {
      isValid = false;
      feedback.push(`❌ High-interest consumer loans for luxury status symbols deplete future wealth.`);
    } else {
      feedback.push(`✓ Long-term goal is constructive and builds financial independence.`);
    }

    // Rule 5: Practical next action selected
    if (this.actionChoice === 2) {
      isValid = false;
      feedback.push(`❌ Spending freely and hoping to save loose change leads to chronic financial distress.`);
    } else {
      feedback.push(`✓ Next action enforces disciplined 'Pay Yourself First' habits.`);
    }

    return { isValid, feedback, total, income };
  }

  reviewFuturePlan() {
    const res = this.evaluatePlanRules();
    const box = document.getElementById('plan-review-feedback-box');
    if (!box) return;

    box.style.display = 'block';
    if (res.isValid) {
      box.style.background = 'rgba(46, 204, 113, 0.15)';
      box.style.border = '1.5px solid #2ecc71';
      box.style.color = '#e8f8f5';
      box.innerHTML = `<strong style="color: #2ecc71; font-size: 14px;">✓ PLAN REVIEW PASSED:</strong><br>` + res.feedback.map(f => `<div style="margin: 3px 0;">${f}</div>`).join('') + `<div style="margin-top: 8px; font-weight: 800; color: #ffd700;">Click "SUBMIT FINAL PLAN" to unseal the treasure chest!</div>`;
      if (window.soundEngine && window.soundEngine.playSuccess) window.soundEngine.playSuccess();
    } else {
      box.style.background = 'rgba(231, 76, 60, 0.15)';
      box.style.border = '1.5px solid #e74c3c';
      box.style.color = '#fdebd0';
      box.innerHTML = `<strong style="color: #e74c3c; font-size: 14px;">⚠️ ADJUSTMENTS REQUIRED:</strong><br>` + res.feedback.map(f => `<div style="margin: 3px 0;">${f}</div>`).join('');
      if (window.soundEngine && window.soundEngine.playLockClick) window.soundEngine.playLockClick();
    }
  }

  submitFuturePlan() {
    const res = this.evaluatePlanRules();
    this.reviewFuturePlan();

    if (!res.isValid) {
      if (window.app) window.app.showToast('Please review the adjustments highlighted above before submitting!', 'error');
      return;
    }

    // Success! Reveal Golden Escape Key
    if (!window.gameState.state.puzzle4) window.gameState.state.puzzle4 = {};
    window.gameState.state.puzzle4.futurePlanSubmitted = true;
    window.gameState.save();

    const actStage = document.getElementById('chest-activity-stage');
    const rewardStage = document.getElementById('chest-key-reward-stage');
    if (actStage) actStage.style.display = 'none';
    if (rewardStage) {
      rewardStage.style.display = 'block';
    }

    if (window.soundEngine && window.soundEngine.playSuccess) {
      window.soundEngine.playSuccess();
    }

    if (window.app) {
      window.app.showToast('✨ FUTURE PLAN APPROVED! The Golden Escape Key has appeared!', 'reward');
    }
  }

  openPlanListPlaque() {
    if (window.app) {
      window.app.openModal('plan-list-modal');
    }
  }

}

window.puzzleManager = new PuzzleManager();
