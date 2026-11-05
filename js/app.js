/**
 * ESCAPE ROOM: THE ENTREPRENEUR'S JOURNEY
 * Main Application Orchestrator & Event Router
 * 4-Wall Photorealistic Victorian Chamber Edition
 */

class App {
  constructor() {
    this.currentDialogueScript = null;
    this.currentDialogueLineIdx = 0;
    this.typewriterInterval = null;
    this.lampOn = true;
  }

  init() {
    // 1. Initialize Vintage Room Engine
    if (window.vintageRoomEngine) {
      window.vintageRoomEngine.init();
    }

    // 2. Setup HUD & UI Listeners
    this.setupEventListeners();
    this.updateHUD();
    if (window.puzzleManager?.syncVaultUI) {
      window.puzzleManager.syncVaultUI();
    }

    // 3. Start directly inside Room 1 (Study Room)
    this.startDirectInRoom1();
  }

  startDirectInRoom1() {
    const landing = document.getElementById('game-title-landing');
    if (landing) landing.style.display = 'none';

    this.closeModal('avatar-selection-screen');
    this.closeModal('building-lobby-screen');

    // Register player state
    window.gameState.state.player.registered = true;
    window.gameState.save();

    // Set Room 1 Wall 1 Active
    if (window.vintageRoomEngine) {
      window.vintageRoomEngine.setWall(1);
    }

    // Intro toast for Financial Vault
    setTimeout(() => {
      this.showToast('👑 THE MUSEUM OF LOST FORTUNES: Inspect the Royal Prince, Empire Painting & Electric Stand.', 'reward');
    }, 600);
  }

  // ==========================================
  // WALL 1: MUSEUM OF LOST FORTUNES INTERACTIONS
  // ==========================================
  triggerStatueAlarm() {
    if (window.soundEngine && window.soundEngine.playAlarm) {
      window.soundEngine.playAlarm();
    } else if (window.soundEngine && window.soundEngine.playError) {
      window.soundEngine.playError();
    }

    const overlay = document.getElementById('alarm-screen-overlay');
    if (overlay) {
      overlay.classList.remove('flickering');
      void overlay.offsetWidth; // force browser DOM reflow
      overlay.classList.add('flickering');
      setTimeout(() => {
        overlay.classList.remove('flickering');
      }, 1500);
    }
  }

  openRoyalPrince() {
    const isDisarmed = !!window.gameState?.state?.puzzle1?.circuitDisarmed;
    const isActivityDone = !!(window.gameState?.state?.puzzle1?.cabinetKeyAcquired || window.gameState?.state?.puzzle1?.empireActivityCompleted);
    const isCollected = !!window.gameState?.state?.puzzle1?.goldenBarCollected;

    const statusBox = document.getElementById('prince-status-box');
    const statusIcon = document.getElementById('prince-status-icon');
    const statusHeader = document.getElementById('prince-status-header');
    const statusDesc = document.getElementById('prince-status-desc');
    const btnCircuit = document.getElementById('btn-prince-go-circuit');
    const btnRecords = document.getElementById('btn-prince-go-records');
    const btnClaim = document.getElementById('btn-prince-claim-bar');

    if (btnCircuit) btnCircuit.style.display = 'none';
    if (btnRecords) btnRecords.style.display = 'none';
    if (btnClaim) btnClaim.style.display = 'none';

    if (isCollected) {
      if (statusBox) statusBox.className = 'prince-status-box unlocked';
      if (statusIcon) statusIcon.textContent = '✓';
      if (statusHeader) statusHeader.textContent = 'FIRST GOLDEN BAR SECURED';
      if (statusDesc) statusDesc.textContent = 'The Prince\'s Golden Bar has been safely stored in your inventory satchel.';
    } else if (isDisarmed && isActivityDone) {
      // Both wire fixing AND Prince's Empire & Records activity are complete!
      if (statusBox) statusBox.className = 'prince-status-box unlocked';
      if (statusIcon) statusIcon.textContent = '🔓';
      if (statusHeader) statusHeader.textContent = 'WRIST CLASP UNLOCKED & RELEASED';
      if (statusDesc) statusDesc.textContent = 'The security circuit is disarmed and the Prince\'s Records activity is complete! The statue\'s fingers have unlocked and released the Golden Bar!';
      if (btnClaim) btnClaim.style.display = 'block';
    } else {
      // TRIGGER THE SENSOR ALARM WITH RED LIGHT FLICKER!
      this.triggerStatueAlarm();

      if (!isDisarmed) {
        if (statusBox) statusBox.className = 'prince-status-box alarm-active';
        if (statusIcon) statusIcon.textContent = '🚨';
        if (statusHeader) statusHeader.textContent = 'SECURITY ALARM TRIPPED • CIRCUIT ACTIVE';
        if (statusDesc) statusDesc.textContent = '🚨 WARNING: An electric security sensor beneath the pedestal detected your touch! Disarm the electric circuit stand first before attempting to take the bar.';
        if (btnCircuit) btnCircuit.style.display = 'block';
        this.showToast('🚨 SENSOR TRIPPED! Red lights flicker! Disarm the Electric Circuit first!', 'error');
      } else {
        // Disarmed, but Prince Empire & Records activity not completed yet!
        if (statusBox) statusBox.className = 'prince-status-box alarm-active';
        if (statusIcon) statusIcon.textContent = '🔒';
        if (statusHeader) statusHeader.textContent = 'WRIST CLASP LOCKED • RECORDS REQUIRED';
        if (statusDesc) statusDesc.textContent = 'The electric sensor is disarmed, but the statue\'s mechanical wrist clasp remains shut! Complete "The Prince\'s Empire & Records" activity to obtain the release key.';
        if (btnRecords) btnRecords.style.display = 'block';
        this.showToast('🔒 Clasp Locked! Complete "The Prince\'s Empire & Records" activity to release the bar!', 'error');
      }
    }

    this.openModal('royal-prince-modal');
  }

  openVideo33() {
    this.openModal('video-3-3-modal');
    setTimeout(() => {
      if (window.puzzleManager && window.puzzleManager.initVideo33UI) {
        window.puzzleManager.initVideo33UI();
      }
    }, 120);
  }

  openPrinceEmpire() {
    const isVideoDone = !!window.gameState?.state?.puzzle1?.video33Completed;
    const isCircuitDone = !!window.gameState?.state?.puzzle1?.circuitDisarmed;

    if (!isCircuitDone) {
      this.showToast('🔒 Locked: Disarm the Electric Circuit stand first!', 'normal');
      this.openModal('prince-empire-modal');
      return;
    }

    if (!isVideoDone) {
      // Circuit is disarmed, clicking painting dot opens Video 3.3
      this.openVideo33();
      return;
    }

    // Video is done -> Open the Prince Empire painting activity directly
    const lockedView = document.getElementById('empire-locked-container');
    const unlockedView = document.getElementById('empire-unlocked-activity-container');
    if (lockedView) lockedView.style.display = 'none';
    if (unlockedView) unlockedView.style.display = 'block';

    this.openModal('prince-empire-modal');
  }

  claimHiddenCabinetKey() {
    if (!window.gameState.state.puzzle1) window.gameState.state.puzzle1 = {};
    window.gameState.state.puzzle1.cabinetKeyAcquired = true;
    window.gameState.state.puzzle1.empireActivityCompleted = true;

    if (!window.gameState.hasItem('hidden_cabinet_key')) {
      window.gameState.addItem({
        id: 'hidden_cabinet_key',
        name: 'Hidden Cabinet Key',
        icon: '🔑',
        type: 'key',
        desc: 'The ornate brass key retrieved from the Prince Empire records, used to unlock the Royal Prince\'s wrist clasp.'
      });
      window.gameState.addXP(200);
    }

    window.gameState.save();

    // Mark painting dot as completed
    const paintingDot = document.getElementById('w1-dot-painting');
    if (paintingDot) {
      paintingDot.classList.remove('active-puzzle');
      paintingDot.classList.remove('locked');
      paintingDot.classList.add('completed');
    }

    // Highlight statue dot as active puzzle
    const princeDot = document.getElementById('w1-dot-prince');
    if (princeDot && !window.gameState.state.puzzle1.goldenBarCollected) {
      princeDot.classList.add('active-puzzle');
      const princeText = document.querySelector('#w1-dot-prince .dot-label-text');
      if (princeText) princeText.textContent = 'Royal Prince (Ready to Unlock 🔑)';
    }

    this.closeModal('prince-empire-modal');
    this.updateHUD();

    if (window.soundEngine && window.soundEngine.playSuccess) {
      window.soundEngine.playSuccess();
    }

    this.showToast('🔑 PAINTING ACTIVITY COMPLETED! Hidden Cabinet Key acquired. Click the Royal Prince Statue to unlock the Golden Bar!', 'reward');
  }

  openElectricCircuit() {
    this.openModal('electric-circuit-modal');
    setTimeout(() => {
      if (window.puzzleManager && window.puzzleManager.initCircuitUI) {
        window.puzzleManager.initCircuitUI();
      }
    }, 120);
  }

  collectGoldenBar1() {
    if (window.gameState?.state?.puzzle1?.goldenBarCollected) {
      this.showToast('You already retrieved the Prince\'s Golden Bar!', 'normal');
      return;
    }

    const isDisarmed = !!window.gameState?.state?.puzzle1?.circuitDisarmed;
    const isActivityDone = !!(window.gameState?.state?.puzzle1?.cabinetKeyAcquired || window.gameState?.state?.puzzle1?.empireActivityCompleted);

    if (!isDisarmed || !isActivityDone) {
      this.triggerStatueAlarm();
      if (!isDisarmed) {
        this.showToast('🚨 SENSOR ACTIVE: Disarm the Electric Circuit stand first!', 'error');
      } else {
        this.showToast('🔒 Complete "The Prince\'s Empire & Records" activity to release the wrist clasp!', 'error');
      }
      return;
    }

    if (!window.gameState.state.puzzle1) window.gameState.state.puzzle1 = {};
    window.gameState.state.puzzle1.goldenBarCollected = true;

    window.gameState.addItem({
      id: 'golden_bar_1',
      name: 'The Prince\'s Golden Bar',
      icon: '⚜️',
      type: 'golden_bar',
      desc: 'The first of the seven sacred golden bars, recovered from the Royal Prince statue after completing the circuit and Prince\'s Empire records.'
    });

    window.gameState.addXP(250);
    window.gameState.save();

    // Mark statue dot as completed
    const princeDot = document.getElementById('w1-dot-prince');
    if (princeDot) {
      princeDot.classList.remove('active-puzzle');
      princeDot.classList.add('completed');
    }

    this.closeModal('royal-prince-modal');
    this.updateHUD();

    if (window.soundEngine && window.soundEngine.playSuccess) {
      window.soundEngine.playSuccess();
    }

    this.showToast('👑 ⚜️ THE FIRST GOLDEN BAR HAS BEEN CLAIMED! Added to Satchel! (+250 XP)', 'reward');
  }

  // ==========================================
  // WALL 2: THE MERCHANT'S CASH BOX & HIDDEN GOLD BARS
  // ==========================================
  openCashBox() {
    const isUnlocked = !!window.gameState?.state?.puzzle2?.cashBoxUnlocked;
    const lockedView = document.getElementById('cash-box-locked-view');
    const unlockedView = document.getElementById('cash-box-unlocked-view');

    if (isUnlocked) {
      if (lockedView) lockedView.style.display = 'none';
      if (unlockedView) unlockedView.style.display = 'block';
      if (window.puzzleManager) {
        window.puzzleManager.initSelfCheckUI();
      }
    } else {
      if (lockedView) lockedView.style.display = 'block';
      if (unlockedView) unlockedView.style.display = 'none';
    }

    this.openModal('cash-box-modal');
  }

  unlockCashBox() {
    if (!window.gameState.state.puzzle2) window.gameState.state.puzzle2 = {};
    window.gameState.state.puzzle2.cashBoxUnlocked = true;

    window.gameState.addXP(200);
    window.gameState.save();

    this.updateHUD();
    this.openCashBox();

    if (window.soundEngine && window.soundEngine.playSuccess) {
      window.soundEngine.playSuccess();
    }

    this.showToast('📦 CASH BOX UNLOCKED! Merchant\'s Diary, Receipts & Self-Check revealed! (+200 XP)', 'reward');
  }

  openMerchantRecords() {
    const p2 = window.gameState?.state?.puzzle2 || {};
    const isReady = !!p2.video31Completed;
    const lockedNotice = document.getElementById('records-locked-notice');
    const unlockedContent = document.getElementById('records-unlocked-content');

    if (isReady) {
      if (lockedNotice) lockedNotice.style.display = 'none';
      if (unlockedContent) unlockedContent.style.display = 'block';
    } else {
      if (lockedNotice) lockedNotice.style.display = 'block';
      if (unlockedContent) unlockedContent.style.display = 'none';
      this.showToast('🔒 Notice Board Locked: Solve the Cash Box Math & watch Video 3.1 first!', 'normal');
    }

    this.openModal('merchant-records-modal');
  }

  inspectMerchantDiaryDone() {
    if (!window.gameState.state.puzzle2) window.gameState.state.puzzle2 = {};
    window.gameState.state.puzzle2.diaryInspected = true;
    window.gameState.save();

    this.closeModal('merchant-records-modal');
    this.updateHUD();

    if (window.soundEngine && window.soundEngine.playSuccess) {
      window.soundEngine.playSuccess();
    }

    this.showToast('📌 Unrecorded ₹500 expense discovered in diary! Click the Account Ledger on the right desk to calculate the balance.', 'reward');
  }

  openAccountLedger() {
    const p2 = window.gameState?.state?.puzzle2 || {};
    const isReady = !!p2.diaryInspected;
    const lockedNotice = document.getElementById('ledger-modal-locked-notice');
    const unlockedContent = document.getElementById('ledger-modal-unlocked-content');

    if (isReady) {
      if (lockedNotice) lockedNotice.style.display = 'none';
      if (unlockedContent) unlockedContent.style.display = 'block';
      // If already solved, reveal reward immediately
      if (p2.ledgerCompleted) {
        const rewardBox = document.getElementById('ledger-modal-reward-container');
        if (rewardBox) rewardBox.style.display = 'block';
      }
    } else {
      if (lockedNotice) lockedNotice.style.display = 'block';
      if (unlockedContent) unlockedContent.style.display = 'none';
      this.showToast('🔒 Account Ledger Sealed: Inspect the Merchant\'s Diary on the Notice Board first!', 'normal');
    }

    this.openModal('account-ledger-modal');
  }

  claimMerchantMirrors() {
    if (window.gameState?.state?.puzzle2?.mirrorsAcquired) {
      this.showToast('You have already collected the 4 Optical Mirrors!', 'normal');
      return;
    }

    if (!window.gameState.state.puzzle2) window.gameState.state.puzzle2 = {};
    window.gameState.state.puzzle2.mirrorsAcquired = true;
    window.gameState.state.puzzle2.yearClueFound = 1748;

    window.gameState.addItem({
      id: 'merchant_mirrors',
      name: '4 Optical Mirrors',
      icon: '🪞',
      type: 'mirror',
      count: 4,
      desc: 'Four precision brass-mounted optical mirrors retrieved from the Merchant\'s Cash Box. Essential for redirecting the laser grid on Wall 4.'
    });

    window.gameState.addXP(250);
    window.gameState.save();

    this.closeModal('cash-box-modal');
    this.closeModal('account-ledger-modal');

    this.updateHUD();

    if (window.soundEngine && window.soundEngine.playSuccess) {
      window.soundEngine.playSuccess();
    }

    this.showToast('🪞 4 Optical Mirrors & Year Clue 1748 added to Satchel! Wall 3 unlocked! (+250 XP)', 'reward');
  }

  collectPotGoldBar(potSide, barName, wallNum, dotId) {
    const key = potSide || 'left';
    const itemId = 'gold_bar_' + key;
    if (window.gameState.hasItem(itemId) || window.gameState.hasItem('gold_bar_pot_' + key)) {
      this.showToast('You already retrieved this Golden Bar!', 'normal');
      return;
    }

    this.pendingPotBar = {
      key: key,
      name: barName || 'Sacred Golden Bar',
      wall: wallNum || 2,
      dotId: dotId || (key === 'left' ? 'w2-dot-gold-pot-left' : 'w2-dot-gold-pot-right')
    };

    const titleEl = document.querySelector('#gold-bar-pot-modal .modal-title');
    if (titleEl) {
      titleEl.innerHTML = `⚜️ ${this.pendingPotBar.name.toUpperCase()}`;
    }
    this.openModal('gold-bar-pot-modal');
  }

  claimPotGoldBarConfirm() {
    const info = this.pendingPotBar || { key: 'left', name: 'Sacred Golden Bar', dotId: 'w2-dot-gold-pot-left' };
    const key = typeof info === 'string' ? info : info.key;
    const itemId = 'gold_bar_' + key;
    const name = (typeof info === 'object' && info.name) ? info.name : ('Sacred Golden Bar (' + key + ')');
    const dotId = (typeof info === 'object' && info.dotId) ? info.dotId : (key === 'left' ? 'w2-dot-gold-pot-left' : 'w2-dot-gold-pot-right');

    if (window.gameState.hasItem(itemId) || window.gameState.hasItem('gold_bar_pot_' + key)) return;

    window.gameState.addItem({
      id: itemId,
      name: name,
      icon: '⚜️',
      type: 'golden_bar',
      desc: 'One of the seven sacred golden bars hidden within the Museum of Lost Fortunes.'
    });

    window.gameState.addXP(150);
    window.gameState.save();

    const potDot = document.getElementById(dotId);
    if (potDot) potDot.classList.add('completed');

    this.closeModal('gold-bar-pot-modal');
    this.updateHUD();

    if (window.soundEngine && window.soundEngine.playSuccess) {
      window.soundEngine.playSuccess();
    }

    const goldBars = window.gameState.state.inventory.filter(i => i.type === 'golden_bar');
    this.showToast(`⚜️ ${name.toUpperCase()} COLLECTED! (${goldBars.length}/7 in satchel) (+150 XP)`, 'reward');
  }

  openPaintingClue() {
    this.openModal('painting-clue-modal');
  }

  openSuitcasePuzzle() {
    if (window.puzzleManager) {
      window.puzzleManager.openSuitcaseModal();
    } else {
      this.openModal('suitcase-modal');
    }
  }

  openSafeModal() {
    if (window.puzzleManager) {
      window.puzzleManager.openSafeModal();
    } else {
      this.openModal('safe-modal');
    }
  }

  beginGameFromLanding() {
    const landing = document.getElementById('game-title-landing');
    if (window.soundEngine) {
      window.soundEngine.playSuccess();
    }

    // 1. Instantly open Avatar Selection Screen underneath so Room 1 is never glimpsed
    this.openModal('avatar-selection-screen');

    // 2. Smoothly fade out the title cover
    if (landing) {
      landing.classList.add('fade-out');
      setTimeout(() => {
        landing.style.display = 'none';
      }, 700);
    }
  }

  setupEventListeners() {
    // Wall Navigation buttons (syncs with vintageRoomEngine)
    document.getElementById('btn-prev-wall')?.addEventListener('click', () => {
      window.vintageRoomEngine.prevWall();
    });

    document.getElementById('btn-next-wall')?.addEventListener('click', () => {
      window.vintageRoomEngine.nextWall();
    });

    // Bottom HUD Action Buttons
    document.getElementById('hud-btn-hint')?.addEventListener('click', () => {
      window.profileReportManager.getHint();
    });

    document.getElementById('hud-btn-inventory')?.addEventListener('click', () => {
      this.openInventory();
    });

    document.getElementById('hud-btn-map')?.addEventListener('click', () => {
      this.openBuildingMap();
    });

    document.getElementById('hud-btn-profile')?.addEventListener('click', () => {
      window.profileReportManager.renderProfile();
    });

    document.getElementById('hud-btn-report')?.addEventListener('click', () => {
      window.profileReportManager.renderReport();
    });

    document.getElementById('hud-btn-audio')?.addEventListener('click', () => {
      const isMuted = window.soundEngine.toggleMute();
      const icon = document.getElementById('audio-btn-icon');
      if (icon) icon.textContent = isMuted ? '🔇' : '🔊';
      this.showToast(isMuted ? 'Audio Muted' : 'Audio Unmuted', 'success');
    });

    // Close buttons for modals
    document.querySelectorAll('.modal-close-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal-backdrop');
        if (modal) modal.classList.remove('active');
        if (window.soundEngine) window.soundEngine.playClick();
      });
    });
  }

  updateHUD() {
    const state = window.gameState.state;
    const currentWall = window.vintageRoomEngine ? window.vintageRoomEngine.currentWall : 1;

    // Update Wall Indicator Dots
    document.querySelectorAll('.wall-dot').forEach((dot, idx) => {
      dot.classList.toggle('active', idx + 1 === currentWall);
    });

    const wallNames = {
      1: 'Wall 1: Entrance & Wall Clock',
      2: 'Wall 2: Notice Board & Study Desk',
      3: 'Wall 3: Exit Door & Flower Painting',
      4: 'Wall 4: Library Bookshelf & Secret Book'
    };
    const wallLabel = document.getElementById('wall-name-label');
    if (wallLabel) wallLabel.textContent = wallNames[currentWall] || `Wall ${currentWall}`;

    // Update XP & Inventory Count
    const xpVal = document.getElementById('hud-xp-val');
    if (xpVal) xpVal.textContent = state.player.xp;
    const settingsXpVal = document.getElementById('settings-xp-val');
    if (settingsXpVal) settingsXpVal.textContent = state.player.xp;

    const invCount = document.getElementById('hud-inv-count');
    if (invCount) {
      const displayItems = state.inventory.filter(i => i.type !== 'painting_piece' && !i.id?.startsWith('painting_piece_'));
      invCount.textContent = displayItems.length;
    }

    // Update Current Objective Banner
    const objText = document.getElementById('hud-objective-text');
    if (objText) objText.textContent = this.getCurrentObjective();

    // Wall 1 Exit Gate Status
    const exitDot = document.getElementById('w1-dot-exit-door');
    const exitText = document.getElementById('w1-dot-exit-text');
    const exitIcon = document.getElementById('w1-dot-exit-icon');
    if (exitDot) {
      const hasKey = window.gameState.hasItem('golden_escape_key') || !!window.gameState?.state?.puzzle4?.escapeKeyAcquired;
      const isEscaped = !!window.gameState?.state?.puzzle4?.escaped;
      exitDot.classList.toggle('completed', isEscaped);
      exitDot.classList.toggle('active-puzzle', hasKey && !isEscaped);
      exitDot.classList.toggle('locked', !hasKey);
      if (exitText) {
        if (isEscaped) {
          exitText.textContent = 'Museum Exit Gate (Escaped! 🏆)';
          if (exitIcon) exitIcon.textContent = '🏆';
        } else if (hasKey) {
          exitText.textContent = 'Museum Exit Gate (Ready to Escape 🗝️)';
          if (exitIcon) exitIcon.textContent = '🗝️';
        } else {
          exitText.textContent = 'Museum Exit Gate (Locked 🔒)';
          if (exitIcon) exitIcon.textContent = '🔒';
        }
      }
    }

    // Sync Wall 1 Museum Dots
    const p1 = state.puzzle1 || {};
    const isPaintingDone = !!(
      p1.cabinetKeyAcquired || 
      p1.empireActivityCompleted || 
      window.gameState.hasItem('hidden_cabinet_key') || 
      p1.goldenBarCollected || 
      window.gameState.hasItem('golden_bar_1')
    );

    const princeDot = document.getElementById('w1-dot-prince');
    if (princeDot) {
      const isPrinceDone = !!(p1.goldenBarCollected || window.gameState.hasItem('golden_bar_1'));
      princeDot.classList.toggle('completed', isPrinceDone);
      princeDot.classList.toggle('active-puzzle', isPaintingDone && !isPrinceDone);
      princeDot.classList.toggle('locked', !isPaintingDone);
      const princeText = document.querySelector('#w1-dot-prince .dot-label-text');
      if (princeText) {
        if (isPrinceDone) {
          princeText.textContent = 'Royal Prince (Clasp Unlocked ✓)';
        } else if (isPaintingDone) {
          princeText.textContent = 'Royal Prince (Ready to Unlock 🔑)';
        } else {
          princeText.textContent = 'Royal Prince (Protected 🔒)';
        }
      }
    }

    const circuitDot = document.getElementById('w1-dot-circuit');
    if (circuitDot) {
      circuitDot.classList.toggle('completed', !!p1.circuitDisarmed);
      circuitDot.classList.toggle('active-puzzle', !p1.circuitDisarmed);
    }

    const paintingDot = document.getElementById('w1-dot-painting');
    const paintingText = document.getElementById('w1-dot-painting-text');
    const paintingIcon = document.getElementById('w1-dot-painting-icon');
    if (paintingDot) {
      paintingDot.classList.toggle('completed', isPaintingDone);
      paintingDot.classList.toggle('active-puzzle', !isPaintingDone && !!p1.video33Completed);
      paintingDot.classList.toggle('locked', !p1.video33Completed);

      if (paintingText) {
        if (isPaintingDone) {
          paintingText.textContent = 'Prince Empire (Records Solved ✓)';
          if (paintingIcon) paintingIcon.textContent = '✓';
        } else if (p1.video33Completed) {
          paintingText.textContent = 'Prince Empire (Activity Unlocked ⚜)';
          if (paintingIcon) paintingIcon.textContent = '⚜';
        } else {
          paintingText.textContent = 'Prince Empire (Locked 🔒)';
          if (paintingIcon) paintingIcon.textContent = '🔒';
        }
      }
    }

    // Sync Wall 2 Museum Dots (Sequential Chain: Box -> Diary -> Ledger)
    const p2 = state.puzzle2 || {};
    const boxDot = document.getElementById('w2-dot-box');
    const boxText = document.querySelector('#w2-dot-box .dot-label-text');
    const boxIcon = document.querySelector('#w2-dot-box .dot-label-icon');
    if (boxDot) {
      const isBoxDone = !!p2.video31Completed;
      boxDot.classList.toggle('completed', isBoxDone);
      boxDot.classList.toggle('active-puzzle', !isBoxDone);
      if (boxText) boxText.textContent = isBoxDone ? 'Antique Cash Box (Solved ✓)' : 'Antique Cash Box (Active 📦)';
      if (boxIcon) boxIcon.textContent = isBoxDone ? '✓' : '📦';
    }

    const recordsDot = document.getElementById('w2-dot-records');
    const recordsIcon = document.getElementById('w2-dot-records-icon');
    const recordsText = document.getElementById('w2-dot-records-text');
    if (recordsDot) {
      const isRecordsUnlocked = !!p2.video31Completed;
      const isDiaryDone = !!p2.diaryInspected;
      recordsDot.classList.toggle('locked', !isRecordsUnlocked);
      recordsDot.classList.toggle('completed', isDiaryDone);
      recordsDot.classList.toggle('active-puzzle', isRecordsUnlocked && !isDiaryDone);
      if (recordsText) {
        if (isDiaryDone) {
          recordsText.textContent = "Merchant's Diary (Inspected ✓)";
          if (recordsIcon) recordsIcon.textContent = "✓";
        } else if (isRecordsUnlocked) {
          recordsText.textContent = "Merchant's Diary (Ready 📌)";
          if (recordsIcon) recordsIcon.textContent = "📌";
        } else {
          recordsText.textContent = "Merchant's Diary (Locked 🔒)";
          if (recordsIcon) recordsIcon.textContent = "🔒";
        }
      }
    }

    const ledgerDot = document.getElementById('w2-dot-ledger');
    const ledgerIcon = document.getElementById('w2-dot-ledger-icon');
    const ledgerText = document.getElementById('w2-dot-ledger-text');
    if (ledgerDot) {
      const isLedgerUnlocked = !!p2.diaryInspected;
      const isLedgerDone = !!p2.ledgerCompleted;
      ledgerDot.classList.toggle('locked', !isLedgerUnlocked);
      ledgerDot.classList.toggle('completed', isLedgerDone);
      ledgerDot.classList.toggle('active-puzzle', isLedgerUnlocked && !isLedgerDone);
      if (ledgerText) {
        if (isLedgerDone) {
          ledgerText.textContent = "Account Ledger (Balanced ✓)";
          if (ledgerIcon) ledgerIcon.textContent = "✓";
        } else if (isLedgerUnlocked) {
          ledgerText.textContent = "Account Ledger (Ready 📜)";
          if (ledgerIcon) ledgerIcon.textContent = "📜";
        } else {
          ledgerText.textContent = "Account Ledger (Locked 🔒)";
          if (ledgerIcon) ledgerIcon.textContent = "🔒";
        }
      }
    }

    // Wall 1 Gold Bars
    const w1PotDot = document.getElementById('w1-dot-gold-pot');
    if (w1PotDot) {
      w1PotDot.classList.toggle('completed', window.gameState.hasItem('gold_bar_w1_pot'));
    }
    const w1CornerDot = document.getElementById('w1-dot-gold-corner');
    if (w1CornerDot) {
      w1CornerDot.classList.toggle('completed', window.gameState.hasItem('gold_bar_w1_corner'));
    }

    // Wall 2 Gold Bars
    const potLeftDot = document.getElementById('w2-dot-gold-pot-left');
    if (potLeftDot) {
      potLeftDot.classList.toggle('completed', window.gameState.hasItem('gold_bar_w2_left') || window.gameState.hasItem('gold_bar_pot_left'));
    }
    const potRightDot = document.getElementById('w2-dot-gold-pot-right');
    if (potRightDot) {
      potRightDot.classList.toggle('completed', window.gameState.hasItem('gold_bar_w2_right') || window.gameState.hasItem('gold_bar_pot_right'));
    }

    // Wall 3 Gold Bars
    const w3PotDot = document.getElementById('w3-dot-gold-pot');
    if (w3PotDot) {
      w3PotDot.classList.toggle('completed', window.gameState.hasItem('gold_bar_w3_pot'));
    }
    const w3StoolDot = document.getElementById('w3-dot-gold-stool');
    if (w3StoolDot) {
      w3StoolDot.classList.toggle('completed', window.gameState.hasItem('gold_bar_w3_stool'));
    }

    // Wall 3 Scale & Envelopes
    const p3 = state.puzzle3 || {};
    const scaleDot = document.getElementById('w3-dot-scale');
    const scaleIcon = document.getElementById('w3-dot-scale-icon');
    const scaleText = document.getElementById('w3-dot-scale-text');
    if (scaleDot) {
      scaleDot.classList.toggle('completed', !!p3.glassesAcquired);
      scaleDot.classList.toggle('active-puzzle', !p3.glassesAcquired && (p3.scaleBalanced || (state.inventory.filter(i => i.type === 'golden_bar').length >= 7)));
      if (scaleText) {
        if (p3.glassesAcquired) {
          scaleText.textContent = "Weight Balancer (Balanced ✓)";
          if (scaleIcon) scaleIcon.textContent = "✓";
        } else {
          scaleText.textContent = "Weight Balancer";
          if (scaleIcon) scaleIcon.textContent = "⚖️";
        }
      }
    }

    const envDot = document.getElementById('w3-dot-envelopes');
    const envIcon = document.getElementById('w3-dot-envelopes-icon');
    const envText = document.getElementById('w3-dot-envelopes-text');
    if (envDot) {
      envDot.classList.toggle('locked', !p3.scaleBalanced);
      envDot.classList.toggle('completed', !!p3.glassesAcquired);
      envDot.classList.toggle('active-puzzle', p3.scaleBalanced && !p3.glassesAcquired);
      if (envText) {
        if (p3.glassesAcquired) {
          envText.textContent = "Seven Envelopes (Budgeted ✓)";
          if (envIcon) envIcon.textContent = "✓";
        } else if (p3.scaleBalanced) {
          envText.textContent = "Seven Envelopes (Active ✉️)";
          if (envIcon) envIcon.textContent = "✉️";
        } else {
          envText.textContent = "Seven Envelopes (Locked 🔒)";
          if (envIcon) envIcon.textContent = "🔒";
        }
      }
    }

    if (window.vintageRoomEngine) {
      window.vintageRoomEngine.updateRoomVisuals();
      if (window.vintageRoomEngine.currentWall === 4 && window.puzzleManager && window.puzzleManager.updateLaserGridVisuals) {
        window.puzzleManager.updateLaserGridVisuals();
      }
    }
  }

  getCurrentObjective() {
    const state = window.gameState ? window.gameState.state : null;
    if (!state) return '1. Disarm the Electric Circuit on the lectern stand.';

    // Priority: Museum of Lost Fortunes 4-Puzzle Progression
    const p1 = state.puzzle1 || {};
    const p2 = state.puzzle2 || {};
    const p3 = state.puzzle3 || {};
    const p4 = state.puzzle4 || {};

    if (p4.escaped) {
      return 'Museum of Lost Fortunes Escaped! Congratulations!';
    }
    if (p4.treasureOpened) {
      return '4. Life Stage Simulation: Build your future financial plan & claim the Golden Escape Key.';
    }
    if (p4.lasersRedirected) {
      return '4. The lasers are bypassed! Open the Treasure Chest.';
    }
    if (p3.glassesAcquired) {
      return '4. Equip the Special Financial Glasses to reveal the laser grid on Wall 4.';
    }
    if (p3.sevenBarsArranged) {
      return '3. The Seven-Envelope Challenge: Distribute ₹10,000 across all 7 categories.';
    }
    if (p2.cashBoxUnlocked) {
      return '2. Inspect the Merchant\'s Records & solve the Account Ledger to find the missing ₹500.';
    }
    if (p1.goldenBarCollected) {
      return '2. Insert the Prince\'s Golden Bar into the Antique Cash Box on Wall 2.';
    }
    if (p1.cabinetKeyAcquired) {
      return '1. Use the Hidden Cabinet Key on the Royal Prince Statue to unlock the Golden Bar.';
    }
    if (p1.video33Completed) {
      return '1. Solve the Smarter Spending decisions & Value Decay Calculator on the Prince Empire painting.';
    }
    if (p1.circuitDisarmed) {
      return '1. Watch Video 3.3: Smarter Spending Decisions.';
    }
    return '1. Disarm the Electric Circuit on the lectern stand to deactivate the statue sensor.';
  }

  updateSettingsModalState() {
    const state = window.gameState ? window.gameState.state : { player: { xp: 0 } };
    const settingsXpVal = document.getElementById('settings-xp-val');
    if (settingsXpVal) settingsXpVal.textContent = state.player.xp;

    const isMuted = window.soundEngine ? window.soundEngine.isMuted : false;
    const icon = document.getElementById('settings-audio-icon');
    const status = document.getElementById('settings-audio-status');
    if (icon) icon.textContent = isMuted ? '🔇' : '🔊';
    if (status) {
      status.textContent = isMuted ? 'MUTED' : 'ENABLED';
      status.style.color = isMuted ? '#ff6b6b' : '#4cd964';
    }
  }

  toggleAudioInSettings() {
    if (!window.soundEngine) return;
    const isMuted = window.soundEngine.toggleMute();
    const topIcon = document.getElementById('audio-btn-icon');
    if (topIcon) topIcon.textContent = isMuted ? '🔇' : '🔊';
    this.updateSettingsModalState();
    this.showToast(isMuted ? 'Audio Muted' : 'Audio Unmuted', 'success');
  }

  showToast(message, type = 'normal') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span style="font-size:18px;">${type === 'reward' ? '🎁' : type === 'success' ? '✓' : type === 'error' ? '⚠️' : 'ℹ️'}</span> <span>${message}</span>`;
    container.appendChild(toast);

    if (window.soundEngine && type === 'error') {
      window.soundEngine.playError();
    }

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(50px)';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'flex';
      modal.classList.add('active');
      if (window.soundEngine) window.soundEngine.playClick();
    }
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
  }

  // ==========================================
  // PROFESSOR VANCE DIALOGUE CONTROLLER
  // ==========================================
  startDialogue(dialogueKey, onComplete = null) {
    const diag = window.DIALOGUES[dialogueKey];
    if (!diag) return;

    this.currentDialogueScript = diag;
    this.currentDialogueLineIdx = 0;

    const overlay = document.getElementById('dialogue-overlay');
    const nameEl = document.getElementById('diag-npc-name');
    const roleEl = document.getElementById('diag-npc-role');
    const continueBtn = document.getElementById('diag-continue-btn');

    if (nameEl) nameEl.textContent = diag.npcName;
    if (roleEl) roleEl.textContent = diag.npcRole;

    overlay.classList.add('active');

    const nextLine = () => {
      if (this.currentDialogueLineIdx < diag.lines.length) {
        let line = diag.lines[this.currentDialogueLineIdx];
        if (this.currentDialogueLineIdx === 0 && diag.avatarBranch) {
          const avatarId = window.gameState.state.player.avatarId;
          line = diag.avatarBranch[avatarId] || line;
        }

        this.typewriterEffect(line);
        this.currentDialogueLineIdx++;

        if (this.currentDialogueLineIdx >= diag.lines.length) {
          if (continueBtn) continueBtn.textContent = diag.buttonText || 'Continue';
        } else {
          if (continueBtn) continueBtn.textContent = 'Next →';
        }
      } else {
        overlay.classList.remove('active');
        if (onComplete) onComplete();
      }
    };

    continueBtn.onclick = () => {
      if (window.soundEngine) window.soundEngine.playClick();
      nextLine();
    };

    nextLine();
  }

  typewriterEffect(text) {
    const textEl = document.getElementById('diag-text');
    if (!textEl) return;
    if (this.typewriterInterval) clearInterval(this.typewriterInterval);

    textEl.textContent = '';
    let i = 0;
    this.typewriterInterval = setInterval(() => {
      if (i < text.length) {
        textEl.textContent += text.charAt(i);
        i++;
      } else {
        clearInterval(this.typewriterInterval);
      }
    }, 20);
  }

  // ==========================================
  // VOXEL CHARACTER SELECTION & ONBOARDING
  // ==========================================
  chooseVoxelAvatar(avatarId, avatarName) {
    const avatars = {
      creator: { name: 'The Creator', title: 'Creative • Innovative • Imaginative', desc: 'You see possibilities where others see limitations.', icon: '💡' },
      leader: { name: 'The Leader', title: 'Confident • Decisive • Influential', desc: 'You inspire people and turn ideas into action.', icon: '👑' },
      explorer: { name: 'The Explorer', title: 'Adventurous • Curious • Bold', desc: 'You are always ready to discover what’s next.', icon: '🧭' },
      strategist: { name: 'The Strategist', title: 'Smart • Analytical • Logical', desc: 'You think ahead and find the smartest path.', icon: '♟️' }
    };

    const sel = avatars[avatarId] || avatars.creator;

    // Highlight selected card
    document.querySelectorAll('.avatar-char-card').forEach(card => {
      card.classList.toggle('selected', card.id === `avatar-card-${avatarId}`);
    });

    // Update bottom button text
    const btnText = document.getElementById('avatar-btn-text');
    if (btnText) {
      btnText.textContent = `SELECT AVATAR (${sel.name.toUpperCase()}) →`;
    }

    window.gameState.state.player.avatarId = avatarId;
    window.gameState.state.player.avatarName = sel.name;
    window.gameState.state.player.avatarTitle = sel.title;
    window.gameState.state.player.avatarDesc = sel.desc;
    window.gameState.state.player.avatarIcon = sel.icon;

    if (window.soundEngine) window.soundEngine.playClick();
  }

  confirmVoxelAvatar() {
    const player = window.gameState.state.player;
    if (!player.avatarId) {
      player.avatarId = 'creator';
      player.avatarName = 'The Creator';
      player.avatarTitle = 'Creative • Innovative • Imaginative';
      player.avatarIcon = '💡';
    }

    player.registered = true;
    window.gameState.save();

    if (window.soundEngine) {
      window.soundEngine.playSuccess();
    }

    // Update Lobby Top Avatar Tag
    const tag = document.getElementById('lobby-avatar-name-tag');
    if (tag) {
      tag.textContent = player.avatarName.toUpperCase();
    }

    // 1. Open Building Lobby Concourse first
    this.openModal('building-lobby-screen');

    // 2. Close avatar selection modal
    this.closeModal('avatar-selection-screen');
    this.showToast(`✨ Character Selected: ${player.avatarName}`, 'reward');

    // 3. Immediately launch Professor Vance Welcome Dialogue in the Lobby
    setTimeout(() => {
      this.startDialogue('lobby_intro');
    }, 200);
  }

  enterRoom1FromLobby() {
    if (window.soundEngine) {
      window.soundEngine.playSuccess();
    }
    this.closeModal('building-lobby-screen');
    window.vintageRoomEngine.setWall(1);
    this.showToast('🚪 Stepping through Room 1 Entrance into the Study...', 'success');
  }

  // ==========================================
  // BUILDING MAP & PARCHMENT BLUEPRINT UI
  // ==========================================
  openBuildingMap() {
    if (window.soundEngine) {
      window.soundEngine.playClick();
    }
    this.openModal('map-modal');
  }

  selectMapRoom(zoneId) {
    if (window.soundEngine) {
      window.soundEngine.playClick();
    }

    switch (zoneId) {
      case 'entrance':
        this.closeModal('map-modal');
        this.openModal('building-lobby-screen');
        this.showToast('🏛️ Entrance Lobby & Professor Vance Concourse', 'success');
        break;

      case 'room1':
        this.closeModal('map-modal');
        this.closeModal('building-lobby-screen');
        window.vintageRoomEngine.setWall(1);
        this.showToast('🚪 Inside Room 1: Introduction to deAsra inspireLIFE', 'success');
        break;

      case 'lobby':
        this.closeModal('map-modal');
        window.roomController.openMasteryCorridor();
        break;

      case 'mindset':
        this.closeModal('map-modal');
        window.roomController.enterSpecializedRoom(2);
        break;

      case 'finance':
        this.closeModal('map-modal');
        window.roomController.enterSpecializedRoom(3);
        break;

      case 'branding':
        this.closeModal('map-modal');
        window.roomController.enterSpecializedRoom(4);
        break;

      case 'ideas':
        this.closeModal('map-modal');
        window.roomController.enterSpecializedRoom(5);
        break;

      default:
        this.closeModal('map-modal');
        break;
    }
  }

  // ==========================================
  // INVENTORY DRAWER
  // ==========================================
  openInventory() {
    const inv = window.gameState.state.inventory.filter(i => i.type !== 'painting_piece' && !i.id?.startsWith('painting_piece_'));
    const grid = document.getElementById('inventory-items-grid');
    if (!grid) return;

    // Update Golden Bars Count
    const goldBars = inv.filter(i => i.type === 'golden_bar');
    const barCountEl = document.getElementById('inventory-gold-bars-count');
    if (barCountEl) {
      barCountEl.textContent = `${goldBars.length} / 7 COLLECTED`;
    }

    grid.innerHTML = '';
    const hasGlasses = inv.some(i => i.id === 'financial_glasses');
    const equipFooterBtn = document.getElementById('btn-inventory-equip-glasses');
    if (equipFooterBtn) {
      equipFooterBtn.style.display = hasGlasses ? 'block' : 'none';
      const isWorn = !!window.puzzleManager?.laserVisionActive;
      equipFooterBtn.textContent = isWorn ? '👓 REMOVE SPECIAL GLASSES' : '👓 WEAR SPECIAL GLASSES (ACTIVATE LASER VISION)';
    }

    if (inv.length === 0) {
      grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:24px;">No clues or items collected yet. Explore the room!</div>`;
    } else {
      inv.forEach(item => {
        const slot = document.createElement('div');
        slot.className = 'inventory-slot-card has-item' + (item.type === 'golden_bar' ? ' golden-bar-item' : '');

        let statusText = (item.type || '').replace('_', ' ').toUpperCase();
        let actionBtnHtml = '';

        if (item.type === 'golden_bar') {
          statusText = 'USED / IN SATCHEL';
        } else if (item.id === 'merchant_mirrors') {
          const placedCount = Object.values(window.puzzleManager?.mirrorsPlaced || {}).filter(Boolean).length;
          statusText = `${4 - placedCount} AVAILABLE`;
        } else if (item.id === 'financial_glasses') {
          const isWorn = !!window.puzzleManager?.laserVisionActive;
          statusText = isWorn ? 'EQUIPPED ✓' : 'READY TO WEAR';
          actionBtnHtml = `<button class="btn btn-gold" style="padding: 2px 8px; font-size: 10px; margin-top: 4px;" onclick="event.stopPropagation(); window.app.equipGlassesFromInventory();">${isWorn ? 'REMOVE' : 'WEAR'}</button>`;
        }

        slot.innerHTML = `
          <div class="inv-item-icon">${item.icon}</div>
          <div class="inv-item-name">${item.name}</div>
          <div style="font-size:9px;color:${item.type === 'golden_bar' ? '#ffd700' : 'var(--text-muted)'}; font-weight: 700;">${statusText}</div>
          ${actionBtnHtml}
        `;

        slot.onclick = () => {
          if (item.id === 'financial_glasses') {
            this.equipGlassesFromInventory();
            return;
          }
          this.showToast(`${item.name}: ${item.desc}`, 'reward');
        };
        grid.appendChild(slot);
      });
    }

    this.openModal('inventory-modal');
  }

  openLockerKeyInspectModal() {
    this.openModal('locker-key-inspect-modal');
  }

  // ==========================================
  // ROOM 1 INTERACTIVE PUZZLE TRIGGERS
  // ==========================================
  openScratchPuzzle() {
    this.openModal('scratch-modal');
    setTimeout(() => {
      if (window.puzzleManager) window.puzzleManager.initScratchCard();
    }, 60);
  }

  openKeypadPuzzle() {
    if (window.puzzleManager) {
      window.puzzleManager.openDrawerModal();
    } else {
      this.openModal('keypad-modal');
    }
  }

  pullRedBook() {
    window.puzzleManager.pullRedBook();
  }

  openSafeModal() {
    if (window.puzzleManager) window.puzzleManager.openSafeModal();
    else this.openModal('safe-modal');
  }

  openHandle1Modal() {
    if (window.puzzleManager) window.puzzleManager.openHandle1Modal();
    else this.openModal('handle1-zoom-modal');
  }

  openHandle2Modal() {
    if (window.puzzleManager) window.puzzleManager.openHandle2Modal();
    else this.openModal('handle2-zoom-modal');
  }

  openLockerRoomModal() {
    if (window.puzzleManager) window.puzzleManager.clickLocker07();
    else this.openModal('digital-budget-terminal-modal');
  }

  openClockPuzzle() {
    window.puzzleManager.initClockModalEvents();
    this.openModal('clock-modal');
  }

  inspectPortraits() {
    this.openModal('portraits-modal');
  }

  inspectFloorNote() {
    this.showToast('📜 Blueprint Clue: "The 3 painting fragments are locked in Drawer 01, the Library Safe, and the Wall Clock!"', 'reward');
  }

  toggleLamp() {
    this.lampOn = !this.lampOn;
    if (window.soundEngine) window.soundEngine.playClick();
    this.showToast(this.lampOn ? "💡 The banker's lamp casts warm illumination across the desk." : "💡 Desk lamp toggled.", 'normal');
  }

  openPaintingPuzzle() {
    if (window.puzzleManager) {
      window.puzzleManager.syncPaintingUI();
    }
    this.openModal('painting-modal');
  }

  openNoticeBoard() {
    this.openModal('notice-board-modal');
  }

  openStickyNoteZoom() {
    this.openModal('sticky-note-zoom-modal');
  }

  openATMPuzzle() {
    if (window.puzzleManager) {
      window.puzzleManager.openATMPuzzle();
    } else {
      this.openModal('atm-modal');
    }
  }

  openPinNoteModal() {
    this.openNoticeBoard();
  }

  inspectCounter(type) {
    if (window.puzzleManager) {
      window.puzzleManager.inspectCounter(type);
    } else {
      this.openModal('counter-modal');
    }
  }

  openReceiptModal() {
    if (window.puzzleManager) {
      window.puzzleManager.openReceiptModal();
    } else {
      this.openModal('receipt-modal');
    }
  }

  openKnowledgeBox(kbId) {
    window.roomController.startKnowledgeBox(kbId);
  }

  attemptEscape() {
    window.roomController.escapeRoom1();
  }

  openSpecializedRoomModal(roomId) {
    this.openModal(`room-${roomId}-modal`);
  }

  openLearningReport() {
    window.profileReportManager.renderReport();
  }

  restartGame() {
    if (window.soundEngine) {
      window.soundEngine.playClick();
    }
    if (confirm('Start a completely fresh escape run from the beginning? All puzzles will be reset to unsolved.')) {
      window.gameState.reset();
      window.location.reload();
    }
  }

  // ==========================================
  // WALL 3: PUZZLE 3 — ANTIQUE BALANCE SCALE & SEVEN ENVELOPES
  // ==========================================
  openBalanceScale() {
    const goldBars = window.gameState.state.inventory.filter(i => i.type === 'golden_bar');
    const p3 = window.gameState?.state?.puzzle3 || {};

    const statusBox = document.getElementById('scale-status-box');
    const statusIcon = document.getElementById('scale-status-icon');
    const statusHeader = document.getElementById('scale-status-header');
    const statusDesc = document.getElementById('scale-status-desc');
    const progressText = document.getElementById('scale-bars-progress-text');
    const slotsSection = document.getElementById('scale-slots-section');
    const missingGuide = document.getElementById('scale-missing-bars-guide');

    if (progressText) {
      progressText.textContent = `Bars found: ${goldBars.length} / 7`;
    }

    if (p3.glassesAcquired) {
      if (statusBox) statusBox.className = 'prince-status-box unlocked';
      if (statusIcon) statusIcon.textContent = '✓';
      if (statusHeader) statusHeader.textContent = 'SCALE BALANCED & GLASSES EQUIPPED';
      if (statusDesc) statusDesc.textContent = 'The seven golden bars are counterbalanced and you hold the Special Financial Glasses in your satchel!';
      if (slotsSection) slotsSection.style.display = 'block';
      if (missingGuide) missingGuide.style.display = 'none';
      if (window.puzzleManager) window.puzzleManager.placeAllBarsOnScale();
    } else if (p3.scaleBalanced) {
      if (statusBox) statusBox.className = 'prince-status-box unlocked';
      if (statusIcon) statusIcon.textContent = '⚖️';
      if (statusHeader) statusHeader.textContent = 'SCALE COUNTERBALANCED';
      if (statusDesc) statusDesc.textContent = 'The scale pans are in perfect equilibrium! Open the Seven Envelopes on the right wall to complete the budget.';
      if (slotsSection) slotsSection.style.display = 'block';
      if (missingGuide) missingGuide.style.display = 'none';
      if (window.puzzleManager) window.puzzleManager.placeAllBarsOnScale();
    } else if (goldBars.length >= 7) {
      if (statusBox) statusBox.className = 'prince-status-box unlocked';
      if (statusIcon) statusIcon.textContent = '✨';
      if (statusHeader) statusHeader.textContent = 'ALL 7 GOLDEN BARS ASSEMBLED!';
      if (statusDesc) statusDesc.textContent = 'You have gathered all seven sacred bars! Place them onto the engraved category slots to test the balance.';
      if (slotsSection) slotsSection.style.display = 'block';
      if (missingGuide) missingGuide.style.display = 'none';
    } else {
      if (statusBox) statusBox.className = 'prince-status-box';
      if (statusIcon) statusIcon.textContent = '🔒';
      if (statusHeader) statusHeader.textContent = `7 GOLDEN BARS REQUIRED (${goldBars.length}/7 FOUND)`;
      if (statusDesc) statusDesc.textContent = 'The balance pans require all seven sacred golden bars to activate the weight counterbalance mechanism. Search the plant pots, furniture, and exhibits on Walls 1, 2, and 3!';
      if (slotsSection) slotsSection.style.display = 'none';
      if (missingGuide) missingGuide.style.display = 'block';
    }

    this.openModal('balance-scale-modal');
  }

  openSevenEnvelopesBoard() {
    const p3 = window.gameState?.state?.puzzle3 || {};
    if (!p3.scaleBalanced) {
      this.showToast('🔒 Envelopes Locked: Place and balance all 7 Golden Bars on the scale first!', 'normal');
      this.openBalanceScale();
      return;
    }
    if (window.puzzleManager) {
      window.puzzleManager.updateEnvelopeTotal();
    }
    this.openModal('seven-envelopes-modal');
  }

  claimSpecialGlasses() {
    if (window.gameState?.state?.puzzle3?.glassesAcquired) {
      this.showToast('You already hold the Special Financial Glasses!', 'normal');
      return;
    }

    if (!window.gameState.state.puzzle3) window.gameState.state.puzzle3 = {};
    window.gameState.state.puzzle3.glassesAcquired = true;

    window.gameState.addItem({
      id: 'financial_glasses',
      name: 'Special Financial Glasses',
      icon: '👓',
      type: 'glasses',
      desc: 'Enchanted spectacled lenses revealing the invisible laser grid and optical mirror mountings on Wall 4.'
    });

    window.gameState.addXP(250);
    window.gameState.save();

    this.closeModal('seven-envelopes-modal');
    this.closeModal('balance-scale-modal');
    this.updateHUD();

    if (window.soundEngine && window.soundEngine.playSuccess) {
      window.soundEngine.playSuccess();
    }

    this.showToast('👓 SPECIAL FINANCIAL GLASSES EQUIPPED! Moving to Wall 4 Laser Chamber! (+250 XP)', 'reward');

    if (window.vintageRoomEngine) {
      setTimeout(() => {
        window.vintageRoomEngine.setWall(4);
      }, 700);
    }
  }

  // ==========================================
  // WALL 4 & ESCAPE VICTORY METHODS
  // ==========================================
  equipGlassesFromInventory() {
    this.closeModal('inventory-modal');
    if (window.vintageRoomEngine) {
      window.vintageRoomEngine.setWall(4);
    }
    if (window.puzzleManager) {
      if (!window.puzzleManager.laserVisionActive) {
        window.puzzleManager.toggleLaserVision();
      } else {
        this.showToast('👓 Laser vision is already active on Wall 4! Redirect the beams away from the chest.', 'normal');
      }
    }
  }

  claimGoldenEscapeKey() {
    if (!window.gameState.state.puzzle4) window.gameState.state.puzzle4 = {};
    window.gameState.state.puzzle4.escapeKeyAcquired = true;
    window.gameState.state.puzzle4.treasureOpened = true;

    window.gameState.addItem({
      id: 'golden_escape_key',
      name: 'The Golden Escape Key',
      icon: '🗝️',
      type: 'key',
      desc: 'The ancient royal escape key recovered from the Grand Treasure Chest, unlocking the Museum Entrance Door on Wall 1.'
    });

    window.gameState.addXP(300);
    window.gameState.save();

    this.closeModal('treasure-chest-modal');
    this.updateHUD();

    if (window.soundEngine && window.soundEngine.playSuccess) {
      window.soundEngine.playSuccess();
    }

    this.showToast('🗝️ THE GOLDEN ESCAPE KEY ACQUIRED! (+300 XP) Proceeding to Wall 1 Exit Door...', 'reward');

    setTimeout(() => {
      if (window.vintageRoomEngine) {
        window.vintageRoomEngine.setWall(1);
      }
      this.showToast('🚪 Wall 1: Click the Entrance Door to unlock and escape the museum!', 'normal');
    }, 1200);
  }

  interactExitDoor() {
    const hasKey = window.gameState.hasItem('golden_escape_key') || !!window.gameState?.state?.puzzle4?.escapeKeyAcquired;

    if (!hasKey) {
      if (window.soundEngine && window.soundEngine.playLockClick) {
        window.soundEngine.playLockClick();
      }
      this.showToast('🔒 The Exit Door is locked with the royal seal. Obtain the Golden Escape Key from the Wall 4 Treasure Chest!', 'error');
      return;
    }

    // Victory!
    if (!window.gameState.state.puzzle4) window.gameState.state.puzzle4 = {};
    window.gameState.state.puzzle4.escaped = true;
    window.gameState.save();

    if (window.soundEngine && window.soundEngine.playSuccess) {
      window.soundEngine.playSuccess();
    }

    this.openModal('escape-victory-modal');
  }
}

window.app = new App();
window.addEventListener('DOMContentLoaded', () => {
  window.app.init();
});
