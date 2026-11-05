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
  // PUZZLE 1: DRAWER KEYPAD (PASSCODE: 29)
  // ==========================================
  pressKeypad(digit) {
    if (this.keypadInput.length >= 2) return;
    this.keypadInput += digit;
    this.updateKeypadDisplay();
    if (window.soundEngine) window.soundEngine.playClick();

    if (this.keypadInput.length === 2) {
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
      display.textContent = this.keypadInput.padEnd(2, '_');
    }
  }

  validateKeypad() {
    if (this.keypadInput === '29') {
      const room1 = window.gameState.state.rooms[1];
      room1.drawerUnlocked = true;
      window.gameState.addXP(100);
      window.gameState.save();

      if (window.soundEngine) {
        window.soundEngine.playDrawerOpen();
        setTimeout(() => window.soundEngine.playSuccess(), 400);
      }
      if (window.app) {
        window.app.closeModal('keypad-modal');
        window.app.showToast('Drawer Unlocked! Knowledge Box 01 Found!', 'success');
        setTimeout(() => window.app.openKnowledgeBox(1), 600);
      }
    } else {
      if (window.soundEngine) window.soundEngine.playError();
      if (window.app) window.app.showToast('Incorrect Passcode. Look at the Desk Frame clue.', 'error');
      this.clearKeypad();
    }
  }

  // ==========================================
  // PUZZLE 2: BOOKSHELF RED BOOK & SAFE
  // ==========================================
  pullRedBook() {
    const room1 = window.gameState.state.rooms[1];
    if (window.soundEngine) window.soundEngine.playBookPull();

    if (!room1.redBookPulled) {
      room1.redBookPulled = true;
      window.gameState.addXP(75);
      window.gameState.save();
      if (window.app) {
        window.app.showToast('Hidden Mechanism Activated! Steel Safe Revealed!', 'success');
      }
    }

    // Open Safe inspection modal
    setTimeout(() => {
      if (window.app) window.app.openSafeModal();
    }, 400);
  }

  openSafe() {
    const room1 = window.gameState.state.rooms[1];
    room1.safeOpened = true;
    window.gameState.addXP(75);
    window.gameState.save();

    if (window.soundEngine) window.soundEngine.playSuccess();
    if (window.app) {
      window.app.closeModal('safe-modal');
      window.app.showToast('Steel Safe Opened! Knowledge Box 02 Found!', 'success');
      setTimeout(() => window.app.openKnowledgeBox(2), 500);
    }
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
      const hasItem = window.gameState.hasItem(`painting_piece_${i}`);

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
    if (!window.gameState.hasItem(pieceId)) {
      if (window.app) window.app.showToast(`You have not discovered Painting Fragment ${pieceNumber} yet. Complete Knowledge Box 0${pieceNumber}!`, 'error');
      return false;
    }

    // Place the piece
    room1.piecesPlaced.push(pieceNumber);
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

  collectGoldenKey() {
    const room1 = window.gameState.state.rooms[1];
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

    this.syncPaintingUI();

    if (window.app) {
      window.app.closeModal('painting-modal');
      window.app.showToast('Golden Escape Key Acquired! Proceed to Wall 3 Exit Door.', 'reward');
      if (window.vintageRoomEngine) window.vintageRoomEngine.setWall(3);
    }
  }
}

window.puzzleManager = new PuzzleManager();
