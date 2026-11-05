/**
 * ESCAPE ROOM: THE ENTREPRENEUR'S JOURNEY
 * Profile, 3-Tier Progressive Hint Engine, Analytics & Certificate Generator
 */

class ProfileReportManager {
  constructor() {}

  // ==========================================
  // PROGRESSIVE 3-TIER HINT SYSTEM
  // ==========================================
  getHint() {
    const state = window.gameState.state;

    if (window.relationshipJourney?.isActive()) {
      const journey = window.relationshipJourney;
      const wall = window.vintageRoomEngine?.currentWall || 1;
      const hintTitle = `RELATIONSHIP SKILLS • WALL ${wall}`;
      let hintText = journey.objectiveText();
      if (wall === 2 && journey.state.boxes[2].completed && !journey.state.boxes[3].completed) {
        hintText = 'On Wall 2, click the atom-like holographic panel on the right, opposite the Crew Network Panel, to start Module 5.3.';
      } else if (wall === 2 && !journey.state.boxes[2].completed) {
        hintText = 'On Wall 2, click the Crew Network Panel hologram on the left to start Module 5.2.';
      } else if (wall === 3 && journey.state.boxes[4].completed && !journey.state.boxes[5].completed) {
        hintText = 'On Wall 3, click the Signal Repair Hub panel on the right to start final Module 5.5.';
      } else if (wall === 3 && !journey.state.boxes[4].completed) {
        hintText = journey.isBoxAvailable(4)
          ? 'On Wall 3, click the Crew Vital Monitor on the left to start Module 5.4.'
          : 'On Wall 3, the Crew Vital Monitor is the Module 5.4 station. Complete Modules 5.1, 5.2 and 5.3 to unlock its boundary protocol.';
      }

      state.hintsUsed++;
      window.gameState.save();
      const hintModalText = document.getElementById('hint-content-text');
      const hintLevelBadge = document.getElementById('hint-level-tag');
      if (hintModalText) hintModalText.textContent = hintText;
      if (hintLevelBadge) hintLevelBadge.textContent = hintTitle;
      if (window.app) window.app.openModal('hint-modal');
      return;
    }

    // If Module 5 is currently active, deliver Module 5 contextual hints
    const isM5 = state.currentRoomId === 5 || document.getElementById('walls-master-stage')?.classList.contains('room-mode-module5');
    if (isM5) {
      const wall = window.vintageRoomEngine?.currentWall || 1;
      let hintTitle = `WALL ${wall} GUIDANCE`;
      let hintText = '';

      if (wall === 4 && window.module5Wall4) {
        const w4State = window.module5Wall4.getState();
        hintTitle = 'WALL 4: MOTIVATION CORE';
        if (!w4State.isMotivationPuzzleComplete) {
          hintText = 'Look at the console on the lower left of the wall image: "PLACE THE MOTIVATION CARDS". Connect all 6 everyday scenarios to their matching motivation drivers (Passion, Independence, Financial Stability, Family Expectations, Purpose and Impact, Market Opportunity).';
        } else if (!w4State.isWhyCoreActive) {
          hintText = 'Motivation Core is synchronized! Click the console or central WHY CORE engine to activate the machine and unlock Knowledge Box 4.';
        } else if (!w4State.isPodcast26Reviewed) {
          hintText = 'Open Knowledge Box 4 and complete the verified Podcast 2.6 source-text review on continuous learning, networking, and early financial literacy.';
        } else if (!w4State.isDiscussionGuideReviewed) {
          hintText = 'In Knowledge Box 4, review all 3 Original Discussion Questions and expert pointers, then mark the discussion guide as reviewed.';
        } else if (!w4State.isCareerRootsComplete) {
          hintText = 'In Knowledge Box 4, complete the "My Career Roots" reflection tool across Learning, Network, Financial Awareness, and Superpower, then save and confirm.';
        } else {
          hintText = 'All Wall 4 learning is complete! View the Final Clue or click the Exit Door on the far right to complete the Entrepreneurial Lab and access all room doors.';
        }
      } else if (wall === 2 && window.module5Wall2) {
        const w2State = window.module5Wall2.getState();
        hintTitle = 'WALL 2: CAREER SIMULATION LAB';
        if (!w2State.isPuzzleSolved) {
          hintText = 'Look at the wide timeline screen and console on the left of Wall 2. Arrange the 5 career milestone horizons in chronological order (Year 1 -> Year 10 -> Year 20 -> Year 30 -> Beyond 30).';
        } else if (!w2State.isPodcastWatched || !w2State.isModule23QuizPassed || !w2State.isCareerActivityCompleted) {
          hintText = 'The Career Simulation Chamber (center-right) is activated! Click it to open Knowledge Vault 2, complete Video 2.3, pass Quiz 2.3, and fill in your Dream Career Journey plan.';
        } else {
          hintText = 'All Wall 2 objectives are complete! Clue 02 is revealed. Use the navigation controls to proceed to the next wall.';
        }
      } else if (wall === 3 && window.module5Wall3) {
        const w3State = window.module5Wall3.getState();
        hintTitle = 'WALL 3: REAL-WORLD ENTREPRENEURSHIP SIMULATOR';
        if (!w3State.isMatchingPuzzleComplete) {
          hintText = 'Look at the console in the center: "MATCH THE PERSON WITH THEIR SITUATION". Connect all 5 people (Shubham ➔ Rideshare, Tanvi ➔ Cafeteria, Nikhil ➔ Tutor, Anushka ➔ Gaming, Karan ➔ Cycle Repair) to activate the simulator.';
        } else if (!w3State.module24.isPodcastComplete) {
          hintText = 'The simulator is activated! Click Knowledge Box 3 (the blue capsule on the right) to watch Video Lecture 2.4 ("Entrepreneurship Everyday!").';
        } else if (!w3State.module24.quizPassed) {
          hintText = 'In Knowledge Box 3, review the Discussion Guide and take the Module 2.4 Scenario Quiz (10 MCQs). Score at least 7/10 to unlock the next Podcast Terminal.';
        } else if (!w3State.module25.isPodcastComplete) {
          hintText = 'Module 2.4 complete! Click the Podcast Terminal (the vertical screen with headphones on the right: "Unlock to access your next podcast") to watch Podcast 2.5 ("What Motivates You?").';
        } else if (!w3State.module25.quizPassed) {
          hintText = 'On the Podcast Terminal, complete the Module 2.5 Motivation Quiz (8 MCQs). Score at least 6/8 to complete Wall 3 learning and escape to Wall 4.';
        } else {
          hintText = 'All Wall 3 modules are complete! Click the floor beacon or the pathway on the far right to view the Final Clue and proceed to Wall 4.';
        }
      } else if (wall === 1 && window.module5Wall1) {
        const w1State = window.module5Wall1.getState();
        hintTitle = 'WALL 1: NOVALINK WHITEBOARD & MINDSET';
        if (!w1State.isPuzzleComplete) {
          hintText = 'Look at the Scan & Match console in the bottom-left corner of Wall 1. Match the 3 founders to their correct artifacts to activate the Mindset Scanner.';
        } else if (!w1State.isPuzzle2Complete) {
          hintText = 'The Mindset Scanner is glowing in the center-right of Wall 1! Click it to open Puzzle 2 and identify actions that demonstrate an entrepreneurial mindset.';
        } else if (!w1State.isModule22QuizPassed) {
          hintText = 'Open Knowledge Box 1 on the far right to watch Video 2.2 and complete the Knowledge Check.';
        } else {
          hintText = 'Clue 01 is unlocked! Navigate to Wall 2 using the right arrow or bottom dot to enter the Career Simulation Lab.';
        }
      } else {
        hintText = `Explore Wall ${wall} for clues, interact with consoles, and investigate the environment.`;
      }

      state.hintsUsed++;
      window.gameState.save();

      const hintModalText = document.getElementById('hint-content-text');
      const hintLevelBadge = document.getElementById('hint-level-tag');
      if (hintModalText) hintModalText.textContent = hintText;
      if (hintLevelBadge) hintLevelBadge.textContent = hintTitle;

      if (window.app) window.app.openModal('hint-modal');
      return;
    }

    const room1 = state.rooms[1];
    let hintLevel = (state.hintsUsed % 3) + 1;
    let hintText = '';

    if (!room1.scratchCompleted) {
      if (hintLevel === 1) hintText = 'Look closely at the executive desk on Wall 2. Something decorative holds a secret.';
      else if (hintLevel === 2) hintText = 'The picture frame on the desk can be scratched to reveal a hidden code.';
      else hintText = 'Scratch the desk frame to find code "29", then enter it into the desk drawer keypad.';
    } else if (!room1.drawerUnlocked) {
      if (hintLevel === 1) hintText = 'Use the number you uncovered from the desk frame.';
      else if (hintLevel === 2) hintText = 'The desk drawer has a 2-digit passcode lock.';
      else hintText = 'Enter "29" into the desk drawer keypad to unlock Knowledge Box 01.';
    } else if (!room1.redBookPulled) {
      if (hintLevel === 1) hintText = 'Inspect the notice board on Wall 2. Clue 2 mentions a specific piece of furniture.';
      else if (hintLevel === 2) hintText = 'Head to the large bookshelf on Wall 4 and look at the second shelf.';
      else hintText = 'Click the distinct RED BOOK on Shelf 2 to reveal the hidden steel safe and Knowledge Box 02.';
    } else if (!room1.clockSolved) {
      if (hintLevel === 1) hintText = 'Inspect the Mysterious Note in your inventory and read the riddle carefully.';
      else if (hintLevel === 2) hintText = 'Look at the vintage Wall Clock on Wall 1.';
      else hintText = 'Enter "4:00" on the Wall Clock to open its hidden compartment for Knowledge Box 03.';
    } else if (!room1.paintingCompleted) {
      if (hintLevel === 1) hintText = 'You have collected painting pieces from the Knowledge Boxes. Where do they belong?';
      else if (hintLevel === 2) hintText = 'Inspect the large Framed Canvas on Wall 3.';
      else hintText = 'Place all 3 painting pieces onto the Wall 3 canvas to reveal the Golden Escape Key.';
    } else if (!room1.escaped) {
      hintText = 'Take the Golden Escape Key and click the Exit Door on Wall 3 to escape!';
    } else {
      hintText = 'Open the Building Map and explore any of the 4 unlocked specialized rooms!';
    }

    state.hintsUsed++;
    window.gameState.save();

    const hintModalText = document.getElementById('hint-content-text');
    const hintLevelBadge = document.getElementById('hint-level-tag');
    if (hintModalText) hintModalText.textContent = hintText;
    if (hintLevelBadge) hintLevelBadge.textContent = `HINT LEVEL ${hintLevel} OF 3`;

    if (window.app) window.app.openModal('hint-modal');
  }

  // ==========================================
  // PLAYER PROFILE MODAL
  // ==========================================
  renderProfile() {
    const player = window.gameState.state.player;
    const badges = window.gameState.state.badges;

    const avatarNameEl = document.getElementById('profile-avatar-name');
    const avatarTitleEl = document.getElementById('profile-avatar-title');
    const avatarDescEl = document.getElementById('profile-avatar-desc');
    const avatarIconEl = document.getElementById('profile-avatar-icon');
    const xpEl = document.getElementById('profile-xp-val');
    const levelEl = document.getElementById('profile-level-val');
    const badgesContainer = document.getElementById('profile-badges-grid');

    if (avatarNameEl) avatarNameEl.textContent = player.name + ` (${player.avatarName})`;
    if (avatarTitleEl) avatarTitleEl.textContent = player.avatarTitle;
    if (avatarDescEl) avatarDescEl.textContent = player.avatarDesc;
    if (avatarIconEl) avatarIconEl.textContent = player.avatarIcon;
    if (xpEl) xpEl.textContent = player.xp;
    if (levelEl) levelEl.textContent = player.level;

    if (badgesContainer) {
      badgesContainer.innerHTML = '';
      badges.forEach(b => {
        const badgeCard = document.createElement('div');
        badgeCard.className = `badge-card ${b.unlocked ? 'unlocked' : 'locked'}`;
        badgeCard.style.cssText = `
          background: rgba(18, 9, 6, 0.7);
          border: 1px solid ${b.unlocked ? 'var(--gold-primary)' : 'var(--border-glass)'};
          padding: 12px;
          border-radius: var(--radius-md);
          text-align: center;
          opacity: ${b.unlocked ? '1' : '0.4'};
        `;
        badgeCard.innerHTML = `
          <div style="font-size:32px;margin-bottom:6px;">${b.icon}</div>
          <div style="font-size:12px;font-weight:700;color:#fff;">${b.name}</div>
          <div style="font-size:10px;color:var(--text-muted);">${b.desc}</div>
        `;
        badgesContainer.appendChild(badgeCard);
      });
    }

    if (window.app) window.app.openModal('profile-modal');
  }

  // ==========================================
  // LEARNING ANALYTICS REPORT & CERTIFICATE
  // ==========================================
  renderReport() {
    const state = window.gameState.state;
    const player = state.player;

    const completedRoomsCount = Object.values(state.rooms).filter(r => r.status === 'completed').length;
    const totalRooms = 5;
    const overallProgress = Math.round((completedRoomsCount / totalRooms) * 100);

    // Calculate total Knowledge Boxes found
    let totalKbs = 0;
    Object.values(state.rooms).forEach(r => { totalKbs += r.kbsFound.length; });

    document.getElementById('report-completed-rooms').textContent = `${completedRoomsCount} / ${totalRooms}`;
    document.getElementById('report-overall-pct').textContent = `${overallProgress}%`;
    document.getElementById('report-total-xp').textContent = player.xp;
    document.getElementById('report-kbs-found').textContent = `${totalKbs} / 7`;

    // Student Certificate Preview
    document.getElementById('cert-student-name-text').textContent = player.name;
    document.getElementById('cert-avatar-role-text').textContent = player.avatarTitle;
    document.getElementById('cert-date-text').textContent = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    if (window.app) window.app.openModal('report-modal');
  }

  printCertificate() {
    window.print();
  }
}

window.profileReportManager = new ProfileReportManager();
