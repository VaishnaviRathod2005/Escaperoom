/**
 * ESCAPE ROOM: THE ENTREPRENEUR'S JOURNEY
 * 2D Vintage Perspective Room Controller & Hotspots Engine
 * Matching User's Reference Layout & Vintage Blueprint Images
 */

class VintageRoomEngine {
  constructor() {
    this.currentWall = 1;
    this.totalWalls = 4;
  }

  init() {
    this.bindNavigation();
    this.setWall(1);
    this.updateRoomVisuals();
  }

  bindNavigation() {
    // Left & Right Wall Buttons
    const leftBtn = document.getElementById('btn-room-left-wall');
    const rightBtn = document.getElementById('btn-room-right-wall');

    if (leftBtn) {
      leftBtn.onclick = () => this.prevWall();
    }
    if (rightBtn) {
      rightBtn.onclick = () => this.nextWall();
    }

    // Keyboard Arrow navigation
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.prevWall();
      if (e.key === 'ArrowRight') this.nextWall();
    });
  }

  setWall(wallNum, forceDirection = null) {
    if (this.isTransitioning) return;

    let targetWall = wallNum;
    if (targetWall < 1) targetWall = this.totalWalls;
    if (targetWall > this.totalWalls) targetWall = 1;

    const fromWall = this.currentWall;
    const toWall = targetWall;

    if (fromWall === toWall && document.getElementById(`wall-view-${toWall}`)?.classList.contains('active')) {
      return;
    }

    // Determine 3D pan direction ('right' or 'left')
    let direction = forceDirection;
    if (!direction) {
      if ((fromWall === 4 && toWall === 1) || (toWall > fromWall && !(fromWall === 1 && toWall === 4))) {
        direction = 'right';
      } else {
        direction = 'left';
      }
    }

    this.isTransitioning = true;
    this.currentWall = toWall;

    const oldView = document.getElementById(`wall-view-${fromWall}`);
    const newView = document.getElementById(`wall-view-${toWall}`);

    if (window.soundEngine) {
      window.soundEngine.playWhoosh();
    }

    // Update bottom wall indicator dots
    document.querySelectorAll('.wall-nav-dot, .room-wall-dot').forEach((dot, idx) => {
      dot.classList.toggle('active', idx + 1 === this.currentWall);
    });

    if (oldView && newView && fromWall !== toWall) {
      // Clear non-involved views
      for (let i = 1; i <= this.totalWalls; i++) {
        if (i !== fromWall && i !== toWall) {
          const v = document.getElementById(`wall-view-${i}`);
          if (v) v.className = 'wall-scene';
        }
      }

      const enterClass = direction === 'right' ? 'slide-enter-from-right' : 'slide-enter-from-left';
      const exitClass = direction === 'right' ? 'slide-exit-left' : 'slide-exit-right';

      // Position new wall off-screen without animation first
      newView.style.transition = 'none';
      newView.className = `wall-scene ${enterClass}`;
      void newView.offsetWidth; // Force layout recalculation

      // Restore transition styles
      newView.style.transition = '';
      oldView.style.transition = '';

      // Execute smooth 3D panoramic transition
      requestAnimationFrame(() => {
        oldView.className = `wall-scene ${exitClass}`;
        newView.className = 'wall-scene active';
      });

      setTimeout(() => {
        oldView.className = 'wall-scene';
        newView.className = 'wall-scene active';
        this.isTransitioning = false;
      }, 540);
    } else if (newView) {
      newView.className = 'wall-scene active';
      this.isTransitioning = false;
    } else {
      this.isTransitioning = false;
    }

    if (window.app) window.app.updateHUD();
    this.updateRoomVisuals();
  }

  nextWall() {
    this.setWall(this.currentWall + 1, 'right');
  }

  prevWall() {
    this.setWall(this.currentWall - 1, 'left');
  }

  updateRoomVisuals() {
    const room1 = window.gameState?.state?.rooms?.[1];
    if (!room1) return;

    // Sync Painting Slices on Wall 3
    if (window.puzzleManager) {
      window.puzzleManager.syncPaintingUI();
    }
  }
}

window.vintageRoomEngine = new VintageRoomEngine();
