/**
 * ESCAPE ROOM: THE ENTREPRENEUR'S JOURNEY
 * Room Progression & Specialized Room Mini-Games Controller
 */

class RoomController {
  constructor() {
    this.activeKnowledgeBox = null;
    this.currentQuizQuestionIndex = 0;
    this.currentQuizScore = 0;
    this.videoProgressInterval = null;
  }

  // ==========================================
  // KNOWLEDGE BOX VIDEO & QUIZ FLOW
  // ==========================================
  startKnowledgeBox(kbId) {
    const data = window.LEARNING_CONTENT[kbId];
    if (!data) return;

    this.activeKnowledgeBox = data;
    this.currentQuizQuestionIndex = 0;
    this.currentQuizScore = 0;

    const modal = document.getElementById('kb-modal');
    const titleEl = document.getElementById('kb-modal-title');
    const videoTitleEl = document.getElementById('kb-video-title');
    const videoTopicEl = document.getElementById('kb-video-topic');
    const videoSummaryEl = document.getElementById('kb-video-summary');
    const videoContainer = document.getElementById('kb-video-view');
    const quizContainer = document.getElementById('kb-quiz-view');
    const rewardContainer = document.getElementById('kb-reward-view');
    const progressBar = document.getElementById('kb-video-bar');
    const continueBtn = document.getElementById('kb-video-continue-btn');

    if (titleEl) titleEl.textContent = data.boxName;
    if (videoTitleEl) videoTitleEl.textContent = data.videoTitle;
    if (videoTopicEl) videoTopicEl.textContent = data.videoTopic;
    if (videoSummaryEl) videoSummaryEl.textContent = data.videoSummary;

    // Show video view first
    videoContainer.style.display = 'block';
    quizContainer.style.display = 'none';
    rewardContainer.style.display = 'none';
    if (continueBtn) continueBtn.style.display = 'none';
    if (progressBar) progressBar.style.width = '0%';

    if (window.app) window.app.openModal('kb-modal');

    // Simulate 10-second interactive learning video playback
    let progress = 0;
    if (this.videoProgressInterval) clearInterval(this.videoProgressInterval);
    this.videoProgressInterval = setInterval(() => {
      progress += 1;
      if (progressBar) progressBar.style.width = `${(progress / 100) * 100}%`;
      if (progress >= 100) {
        clearInterval(this.videoProgressInterval);
        if (continueBtn) {
          continueBtn.style.display = 'inline-flex';
          if (window.soundEngine) window.soundEngine.playClick();
        }
      }
    }, 100);
  }

  showQuiz() {
    if (this.videoProgressInterval) clearInterval(this.videoProgressInterval);
    const videoContainer = document.getElementById('kb-video-view');
    const quizContainer = document.getElementById('kb-quiz-view');
    videoContainer.style.display = 'none';
    quizContainer.style.display = 'block';

    this.renderQuizQuestion();
  }

  renderQuizQuestion() {
    const qData = this.activeKnowledgeBox.quiz[this.currentQuizQuestionIndex];
    if (!qData) {
      this.completeKnowledgeBox();
      return;
    }

    const questionTitle = document.getElementById('quiz-q-title');
    const questionCount = document.getElementById('quiz-q-count');
    const optionsContainer = document.getElementById('quiz-options-box');

    if (questionTitle) questionTitle.textContent = qData.question;
    if (questionCount) {
      questionCount.textContent = `Question ${this.currentQuizQuestionIndex + 1} of ${this.activeKnowledgeBox.quiz.length}`;
    }

    if (optionsContainer) {
      optionsContainer.innerHTML = '';
      qData.options.forEach((optText, optIdx) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option-btn';
        btn.innerHTML = `<span style="font-weight:700;color:var(--amber-light);min-width:24px;">${String.fromCharCode(65 + optIdx)}.</span> <span>${optText}</span>`;
        btn.onclick = () => this.handleQuizAnswer(optIdx, btn);
        optionsContainer.appendChild(btn);
      });
    }
  }

  handleQuizAnswer(selectedIdx, btnElement) {
    const qData = this.activeKnowledgeBox.quiz[this.currentQuizQuestionIndex];
    const isCorrect = qData.correct.includes(selectedIdx);

    // Visual feedback
    if (isCorrect) {
      btnElement.classList.add('correct');
      if (window.soundEngine) window.soundEngine.playSuccess();
      this.currentQuizScore += 100;
    } else {
      btnElement.classList.add('wrong');
      if (window.soundEngine) window.soundEngine.playError();
    }

    // Disable all options
    const allBtns = document.querySelectorAll('.quiz-option-btn');
    allBtns.forEach(b => b.style.pointerEvents = 'none');

    // Next question or finish
    setTimeout(() => {
      this.currentQuizQuestionIndex++;
      this.renderQuizQuestion();
    }, 1200);
  }

  completeKnowledgeBox() {
    const kb = this.activeKnowledgeBox;
    const currentRoom = window.gameState.state.rooms[window.gameState.state.currentRoomId];

    if (!currentRoom.kbsFound.includes(kb.id)) {
      currentRoom.kbsFound.push(kb.id);
      currentRoom.quizzesCompleted.push(kb.id);
      currentRoom.quizScores[kb.id] = this.currentQuizScore;
      window.gameState.addXP(kb.xpAward);
      window.gameState.addItem(kb.reward);
      if (kb.extraReward) {
        window.gameState.addItem(kb.extraReward);
      }
      window.gameState.updateRoomProgress(window.gameState.state.currentRoomId);
      window.gameState.save();
    }

    const quizContainer = document.getElementById('kb-quiz-view');
    const rewardContainer = document.getElementById('kb-reward-view');
    const rewardTitle = document.getElementById('kb-reward-title');
    const rewardDesc = document.getElementById('kb-reward-desc');
    const rewardIcon = document.getElementById('kb-reward-icon');

    quizContainer.style.display = 'none';
    rewardContainer.style.display = 'flex';

    if (rewardTitle) rewardTitle.textContent = kb.reward.name;
    if (rewardDesc) rewardDesc.textContent = kb.reward.desc;
    if (rewardIcon) rewardIcon.textContent = kb.reward.icon;

    if (window.soundEngine) window.soundEngine.playSuccess();
  }

  // ==========================================
  // ROOM 1 ESCAPE & 4 MASTERY DOORS UNLOCK
  // ==========================================
  escapeRoom1() {
    const room1 = window.gameState.state.rooms[1];
    if (!room1.keyAcquired) {
      if (window.app) {
        window.app.showToast('🚪 The exit door is locked. Restore all 3 pieces of the flower painting to claim the Golden Escape Key!', 'error');
      }
      return;
    }

    room1.escaped = true;
    room1.status = 'completed';
    room1.progress = 100;
    window.gameState.unlockSpecializedRooms();
    window.gameState.save();

    if (window.soundEngine) {
      window.soundEngine.playEscapeFanfare();
    }

    // Open Grand 4-Door Mastery Corridor View & Trigger Professor Vance Dialogue
    if (window.app) {
      this.openMasteryCorridor();
      setTimeout(() => {
        window.app.startDialogue('room1_completed');
      }, 400);
    }
  }

  openMasteryCorridor() {
    this.updateCorridorDoorStatuses();
    if (window.app) {
      window.app.openModal('mastery-corridor-modal');
    }
  }

  updateCorridorDoorStatuses() {
    const rooms = window.gameState?.state?.rooms;
    if (!rooms) return;

    const doorMap = {
      101: 2, // Mindset Room
      102: 3, // Financial Vault
      103: 4, // Personal Branding
      104: 5  // Problem Solving & Ideation
    };

    Object.entries(doorMap).forEach(([doorNum, roomId]) => {
      const room = rooms[roomId];
      const pill = document.getElementById(`status-door-${doorNum}`);
      if (pill && room) {
        if (room.status === 'completed') {
          pill.textContent = 'COMPLETED ✓';
          pill.className = 'door-status-pill completed';
        } else {
          pill.textContent = 'STATUS: ENTER';
          pill.className = 'door-status-pill enter';
        }
      }
    });
  }

  // ==========================================
  // SPECIALIZED ROOMS (2 - 5) CONTROLLERS
  // ==========================================
  enterSpecializedRoom(roomId) {
    const room = window.gameState.state.rooms[roomId] || {};
    window.gameState.state.currentRoomId = roomId;

    if (window.app) {
      window.app.showToast(`🚪 ${room.name || 'Mastery Chamber'} UI Preview`, 'success');
      window.app.openSpecializedRoomModal(roomId);
    }
  }

  solveSpecializedRoom(roomId) {
    const room = window.gameState.state.rooms[roomId];
    if (!room) return;

    room.escaped = true;
    room.status = 'completed';
    room.progress = 100;
    window.gameState.addXP(300);

    // Check if all 5 rooms are completed
    const allDone = [1, 2, 3, 4, 5].every(id => window.gameState.state.rooms[id].status === 'completed');
    if (allDone) {
      window.gameState.unlockBadge('entrepreneur_master');
    }
    window.gameState.save();

    if (window.soundEngine) window.soundEngine.playEscapeFanfare();
    if (window.app) {
      window.app.closeModal(`room-${roomId}-modal`);
      window.app.showToast(`🎉 Mastered ${room.name}!`, 'reward');
      this.openMasteryCorridor();
    }
  }
}

window.roomController = new RoomController();
