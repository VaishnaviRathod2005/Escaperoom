/**
 * Five-box relationship-skills journey for the supplied four-wall spaceship.
 * Original course videos are not present; supplied assessment questions are
 * used where available, and missing media is clearly identified in the UI.
 */
class RelationshipJourney {
  constructor() {
    this.storageKey = 'relationshipJourney.v1';
    this.currentScreen = '';
    this.activeBoxId = 0;
    this.feedback = '';
    this.quizFeedback = null;
    this.puzzleOrders = {};
    this.logFeedback = null;
    this.podcastSimulationTimer = null;
    this.podcastSimulationDuration = 12;
    this.vaultUnlocking = false;
    this.stage = null;
    this.layer = null;
    this.card = null;
    this.state = this.loadState();
  }

  get boxes() {
    return [
      {
        id: 1,
        wall: 1,
        object: 'Metallic Storage Box',
        objectLabel: 'Inspect storage box',
        position: { top: '66%', left: '14%', width: '11%', height: '16%' },
        chestPosition: { top: '66%', left: '14%', width: '11%', height: '16%' },
        title: 'Emotional Intelligence & Relationship Awareness',
        podcast: 'Module 5.1 – Emotional Intelligence & Relationship Awareness',
        story: 'A hidden emotional signal has been detected inside this storage unit. Solve the puzzle to unlock the knowledge stored inside.',
        takeaway: 'Your body often recognises emotional stress before your mind does. Detect the signal, name the emotion, create a mental buffer, and respond intentionally.',
        outline: [
          'Build a personal Emotional Early Warning System by noticing physical triggers such as jaw clenching, foot tapping, hot ears, or shallow breathing.',
          'Use the Name It Strategy to identify emotions such as feeling overlooked, rushed, or defensive.',
          'Use a Validation Pivot: acknowledge the other person, pause tension, and give yourself time to think.'
        ],
        puzzle: [
          {
            title: 'Decode the Emotion',
            instruction: 'A crew member sends you this message: “You ignored my update again! Now the entire mission is delayed!” What emotion might the crew member be experiencing?',
            items: [
              { label: 'Choose the emotion', options: ['Frustration', 'Happiness', 'Excitement', 'Calmness'], correct: 'Frustration', hint: 'The crew member is upset that their update was ignored and the mission is delayed.' }
            ],
            explanation: 'The words “ignored my update again” and “mission is delayed” indicate frustration about not being heard and the impact on the mission.'
          }
        ],
        quiz: [
          {
            question: 'What does it mean to “detect physical cues” before reacting to someone?',
            options: [
              'Recognize that your body signals stress through physical signs such as a racing heart, shallow breathing, or clenched jaw before your brain processes anger.',
              'Ignore physical sensations and focus only on what the other person is saying.',
              'Immediately respond to the other person’s behaviour without considering your emotional state.',
              'Avoid difficult conversations whenever you experience stress.'
            ],
            answer: 'Recognize that your body signals stress through physical signs such as a racing heart, shallow breathing, or clenched jaw before your brain processes anger.',
            explanation: 'Your body often detects stress before your mind fully processes the emotion. Recognising these physical warning signs gives you time to slow down and choose a thoughtful response.'
          },
          {
            question: 'How can a “mental buffer” help someone stay professional during a heated moment?',
            options: [
              'It helps someone avoid taking responsibility for difficult situations.',
              'It creates intentional space between an emotional trigger and a verbal response, allowing a person to move from reflexive to intentional behaviour.',
              'It encourages someone to immediately express every emotion.',
              'It helps someone win an argument against another person.'
            ],
            answer: 'It creates intentional space between an emotional trigger and a verbal response, allowing a person to move from reflexive to intentional behaviour.',
            explanation: 'A mental buffer gives you time to breathe, think logically, and choose a response that supports the professional goal instead of reacting through ego or anger.'
          },
          {
            question: 'Why are non-verbal signals just as important as the words someone is saying?',
            options: [
              'Words are always more important than body language.',
              'Non-verbal signals are irrelevant in professional communication.',
              'Tone of voice and body language communicate emotional information that may sometimes contradict spoken words.',
              'Body language should be ignored during difficult conversations.'
            ],
            answer: 'Tone of voice and body language communicate emotional information that may sometimes contradict spoken words.',
            explanation: 'Tone and body language communicate emotional truth. Understanding these signals helps develop empathy and prevents us from unintentionally showing aggression, boredom, or dismissal.'
          },
          {
            question: 'What’s one tip for a young professional to improve their self-control in real-time?',
            options: [
              'Immediately reply whenever someone criticises you.',
              'Avoid communicating with people who disagree with you.',
              'Practise the Three-Breath Rule after an emotional trigger, name the emotion, and redirect attention towards the shared goal.',
              'Suppress all emotions during professional conversations.'
            ],
            answer: 'Practise the Three-Breath Rule after an emotional trigger, name the emotion, and redirect attention towards the shared goal.',
            explanation: 'The Three-Breath Rule creates a physical pause. Naming the emotion helps you understand it, while focusing on the shared goal shifts the conversation from conflict towards collaboration.'
          }
        ],
        clue: 'Your emotional signals are now clear. Understanding yourself is the next step. Find the Crew Network Panel on Wall 2.',
        nextObject: 'Crew Network Panel'
      },
      {
        id: 2,
        wall: 2,
        object: 'Crew Network Panel',
        objectLabel: 'CREW NETWORK PANEL',
        position: { top: '23%', left: '6.5%', width: '13.5%', height: '29%' },
        chestPosition: { top: '23%', left: '6.5%', width: '13.5%', height: '29%' },
        title: 'Self-Awareness & Attachment',
        podcast: 'Module 5.2 – Self-Awareness & Attachment',
        story: 'Multiple crew relationship patterns have been detected. Their communication responses are disconnected. Identify the correct behavioural pattern to restore the network.',
        takeaway: 'Understanding your behavioural patterns helps you build healthier professional relationships. Recognise your attachment responses, pause before reacting, understand your need for solitude or connection, and communicate your boundaries clearly.',
        outline: [
          'Notice how attachment patterns can influence professional responses.',
          'Use STOP → REFLECT → RESPOND rather than reacting automatically.',
          'Avoidant stress patterns and the difference between restorative solitude and disconnection are topics in this module.',
          'Use I-statements to communicate professional boundaries.',
          'Relationship self-awareness can support long-term career relationships.'
        ],
        puzzle: [
          {
            title: 'Decode the Crew Behaviour',
            instruction: 'Your manager provides detailed feedback on your project. You feel uncomfortable and start avoiding conversations with your manager. Instead of asking questions or discussing the feedback, you prefer to work alone. Which behavioural response does this situation most closely represent?',
            items: [
              {
                label: 'Choose the behavioural pattern',
                options: [
                  'A. Anxious attachment – Seeking constant reassurance and validation.',
                  'B. Avoidant attachment – Withdrawing from interactions and avoiding team pressure.',
                  'C. Healthy communication – Openly discussing feedback.',
                  'D. Collaborative behaviour – Actively asking for support.'
                ],
                correct: 'B. Avoidant attachment – Withdrawing from interactions and avoiding team pressure.',
                hint: 'Anxious attachment seeks reassurance; avoidant attachment withdraws; healthy communication discusses the feedback; collaborative behaviour asks for support. Which pattern matches avoiding the manager and working alone?'
              }
            ],
            explanation: 'An avoidant response may involve withdrawing from interactions or working independently to avoid emotional discomfort or team pressure. Recognising this pattern helps you respond more consciously instead of automatically withdrawing.'
          }
        ],
        quiz: [
          {
            question: 'How do our childhood habits (attachment styles) show up in our work life today?',
            options: [
              'They have no influence on professional relationships.',
              'They influence how safe we feel asking for help and how we respond to close feedback from managers.',
              'They only affect personal relationships and not workplace behaviour.',
              'They determine our technical skills and productivity.'
            ],
            answer: 'They influence how safe we feel asking for help and how we respond to close feedback from managers.',
            explanation: 'Attachment styles can influence workplace interactions. Anxious patterns may lead to overworking to seek validation, while avoidant patterns may lead to withdrawing or working in silos. Recognising these patterns helps us communicate more effectively.'
          },
          {
            question: 'What is the "Stop-Reflect-Respond" technique?',
            options: [
              'Immediately respond to criticism to defend your work.',
              'Stop communicating whenever you experience an emotional trigger.',
              'Pause when triggered, reflect on why the situation affects you, and choose a thoughtful response that respects professional boundaries.',
              'Ignore the situation until the other person apologises.'
            ],
            answer: 'Pause when triggered, reflect on why the situation affects you, and choose a thoughtful response that respects professional boundaries.',
            explanation: 'Stop: Pause the interaction when you feel a strong emotional urge. Reflect: Understand why the situation is triggering your response. Respond: Choose a constructive response that addresses the business need while maintaining healthy boundaries.'
          },
          {
            question: 'How does knowing your need for "solitude vs. connection" prevent burnout?',
            options: [
              'By avoiding all social interactions at work.',
              'By understanding your energy levels, scheduling quiet time when needed, and communicating your need for focused work.',
              'By attending every meeting and collaborative activity.',
              'By depending on teammates for all professional decisions.'
            ],
            answer: 'By understanding your energy levels, scheduling quiet time when needed, and communicating your need for focused work.',
            explanation: 'Understanding whether social interaction drains or recharges you helps you manage your energy. Scheduling deep-work time and maintaining a social budget can support productivity and prevent burnout.'
          },
          {
            question: 'How can someone set better workplace boundaries based on their self-awareness?',
            options: [
              'Accept every additional task to maintain good relationships.',
              'Avoid explaining personal limits to colleagues.',
              'Establish clear working hours, practise the Graceful No, and use I-statements to communicate personal limits.',
              'Stop helping colleagues completely.'
            ],
            answer: 'Establish clear working hours, practise the Graceful No, and use I-statements to communicate personal limits.',
            explanation: 'Self-awareness helps professionals understand their limits. Clear working hours, respectful refusals, alternative suggestions, and I-statements help communicate boundaries without blaming others.'
          }
        ],
        clue: 'Understanding yourself is the first step towards stronger relationships. Now restore the communication channels between crew members. Find the atom-like Signal Repair Hub on the right side of Wall 2.',
        nextObject: 'Signal Repair Hub'
      },
      {
        id: 3,
        wall: 2,
        object: 'Signal Repair Hub',
        objectLabel: 'SIGNAL HUB',
        position: { top: '21%', left: '78%', width: '15%', height: '32%' },
        chestPosition: { top: '21%', left: '78%', width: '15%', height: '32%' },
        title: 'Communication – Building Better Conversations',
        podcast: 'Module 5.3 – Communication',
        story: 'Communication signals between crew members are corrupted. A misunderstanding has interrupted the network. Solve the communication puzzle to restore the signal and unlock the knowledge stored inside.',
        outline: [
          'Reflective listening restates a concern and checks that you understood it correctly.',
          'I-statements describe your experience and request without accusation.',
          'Text can hide tone and context, creating misunderstandings.',
          'The Three-Message Rule suggests switching channels after three unsuccessful back-and-forth exchanges.'
        ],
        puzzle: [
          {
            title: 'The Reflective Listening Challenge',
            instruction: 'A crew member sends you the following message: “Your team keeps changing the delivery date, and our budget is already stretched.” Which response demonstrates reflective listening and helps reduce the misunderstanding?',
            items: [
              {
                label: 'Choose a response',
                options: [
                  'A. You should understand that our team is already working hard. Stop complaining.',
                  'B. You are always unhappy with our delivery schedule.',
                  'C. You need a reliable delivery date that stays within your budget. Let’s review the timeline and available options.',
                  'D. We cannot do anything about the situation. Please wait.'
                ],
                correct: 'C. You need a reliable delivery date that stays within your budget. Let’s review the timeline and available options.',
                hint: 'Reflective listening focuses on understanding the other person’s concern rather than defending yourself.'
              }
            ],
            explanation: 'Reflective listening means understanding and repeating the main concern in your own words before responding. It makes the other person feel heard, builds trust and reduces misunderstandings.'
          }
        ],
        quiz: [
          {
            question: 'What is "reflective listening" and why is it a superpower in business?',
            options: [
              'Repeating the core of what someone said in your own words to ensure understanding before responding.',
              'Listening without responding to anyone.',
              'Immediately disagreeing with the other person’s opinion.',
              'Avoiding difficult conversations with clients.'
            ],
            answer: 'Repeating the core of what someone said in your own words to ensure understanding before responding.',
            explanation: 'Reflective listening involves repeating the main idea of someone’s message in your own words. It builds trust, reduces misunderstandings and helps prevent small communication errors from becoming bigger problems.'
          },
          {
            question: 'How can we replace "accusatory language" with "vulnerability" to get better results?',
            options: [
              'Blame the other person directly whenever something goes wrong.',
              'Avoid expressing your feelings in professional conversations.',
              'Replace accusatory “You” statements with “I” statements that explain your feelings, experiences and needs.',
              'Ignore the impact of the situation on yourself.'
            ],
            answer: 'Replace accusatory “You” statements with “I” statements that explain your feelings, experiences and needs.',
            explanation: '“I” statements focus on your own experience rather than judging another person’s behaviour. This reduces defensiveness and encourages honest communication.'
          },
          {
            question: 'Why is "digital text" so risky for important conversations?',
            options: [
              'Text messages always communicate emotions accurately.',
              'Text lacks tone, facial expressions and body language, making messages easier to misunderstand.',
              'Digital communication should never be used professionally.',
              'Long messages always create better relationships.'
            ],
            answer: 'Text lacks tone, facial expressions and body language, making messages easier to misunderstand.',
            explanation: 'Text is a flat communication medium. Without tone and facial expressions, people may interpret neutral messages negatively. Overanalysing punctuation or emojis can create unnecessary misunderstandings.'
          },
          {
            question: 'When should a learner "escalate" from text to a voice or face-to-face call?',
            options: [
              'Whenever someone sends a short message.',
              'Only when the other person refuses to reply.',
              'When the topic involves strong emotions, sensitive feedback or unresolved disagreement. The Three-Message Rule suggests switching channels after three unsuccessful back-and-forth exchanges.',
              'Never. All professional conversations should happen through text.'
            ],
            answer: 'When the topic involves strong emotions, sensitive feedback or unresolved disagreement. The Three-Message Rule suggests switching channels after three unsuccessful back-and-forth exchanges.',
            explanation: 'When emotions or misunderstandings increase, voice or face-to-face communication can help. If three messages have not resolved the issue, switching communication channels can prevent further confusion.'
          }
        ],
        clue: 'Your communication signals are now connected, but not every interaction is healthy. Some connections need protection and clear limits. Locate the Crew Vital Monitor on Wall 3 and restore the crew’s boundary protocols.',
        nextObject: 'Crew Vital Monitor'
      },
      {
        id: 4,
        wall: 3,
        object: 'Crew Vital Monitor',
        objectLabel: 'MODULE 5.4 • BOUNDARIES',
        position: { top: '24%', left: '8%', width: '25%', height: '32%' },
        chestPosition: { top: '24%', left: '8%', width: '25%', height: '32%' },
        title: 'Professional & Social Boundaries',
        podcast: 'Module 5.4 – Professional & Social Boundaries',
        story: 'Warning! Several crew interactions have been identified as potential boundary violations. The relationship monitoring system requires your attention. Identify the correct response to restore the crew’s boundary protocols.',
        takeaway: 'Healthy relationships require mutual respect, appreciation and clear boundaries. Understanding warning signs, communicating your limits and addressing conflicts constructively help build stronger professional relationships.',
        outline: [
          'Gottman Ratio – Maintain five positive interactions for every negative interaction.',
          'Micro-No’s – Practise saying no to small requests to build confidence.',
          'Red and Yellow Flags – Identify serious warning signs and manageable differences.',
          'Sandwich Method – Give constructive feedback without attacking someone’s character.'
        ],
        puzzle: [
          {
            title: 'Identify the Relationship Warning',
            instruction: 'A teammate repeatedly sends you insulting messages, ignores your clearly communicated boundaries and makes you uncomfortable during professional interactions. How should this behaviour be classified?',
            items: [
              {
                label: 'Choose a response',
                options: [
                  'A. Green Flag – A healthy professional relationship.',
                  'B. Yellow Flag – A minor difference in working styles.',
                  'C. Red Flag – Repeated disrespect and ignored boundaries.',
                  'D. Normal Behaviour – Something that should always be accepted.'
                ],
                correct: 'C. Red Flag – Repeated disrespect and ignored boundaries.',
                hint: 'A yellow flag is a manageable difference. Repeated disrespect and ignored boundaries are serious warning signs.'
              }
            ],
            explanation: 'Repeated disrespect and ignoring clearly communicated boundaries are serious warning signs. Red flags indicate behaviours that should not be ignored or normalised.'
          }
        ],
        quiz: [
          {
            question: 'What is the "Gottman Ratio" and how does it apply to professional harmony?',
            options: [
              'Maintain five positive interactions, such as appreciation and helpfulness, for every one negative interaction, such as criticism or conflict.',
              'Maintain five negative interactions for every positive interaction.',
              'Avoid giving feedback to maintain professional relationships.',
              'Focus only on completing work rather than building relationships.'
            ],
            answer: 'Maintain five positive interactions, such as appreciation and helpfulness, for every one negative interaction, such as criticism or conflict.',
            explanation: 'The Gottman Ratio follows the 5-to-1 Rule. Five positive interactions for every one negative interaction help build trust and make professional relationships more resilient during disagreements.'
          },
          {
            question: 'How can a "people-pleaser" start setting boundaries without feeling guilty?',
            options: [
              'Accept every request to avoid disappointing others.',
              'Stop helping colleagues completely.',
              'Start practising Micro-No’s by declining small, low-stakes requests and understanding that saying no to one thing can mean saying yes to important priorities.',
              'Avoid communicating personal limits.'
            ],
            answer: 'Start practising Micro-No’s by declining small, low-stakes requests and understanding that saying no to one thing can mean saying yes to important priorities.',
            explanation: 'Micro-No’s help gradually build confidence in setting boundaries. Saying no to an unnecessary request allows you to protect your priorities, time and mental health.'
          },
          {
            question: 'What is the difference between a "Red Flag" and a "Yellow Flag" in a relationship?',
            options: [
              'Red flags and yellow flags both represent healthy behaviour.',
              'Red flags are serious deal-breakers such as dishonesty and disrespect, while yellow flags are manageable differences that can be addressed through communication.',
              'Yellow flags are always more dangerous than red flags.',
              'Red flags should always be ignored to maintain relationships.'
            ],
            answer: 'Red flags are serious deal-breakers such as dishonesty and disrespect, while yellow flags are manageable differences that can be addressed through communication.',
            explanation: 'Red flags indicate serious concerns such as dishonesty, lack of respect or gaslighting. Yellow flags indicate uncomfortable differences in personality or working styles that may be resolved through open communication.'
          },
          {
            question: 'How do you address a conflict without attacking the other person’s character?',
            options: [
              'Blame the person directly for every mistake.',
              'Focus on personal characteristics instead of the actual issue.',
              'Avoid discussing the problem.',
              'Focus on observable behaviour, use the Sandwich Method and discuss a future solution rather than assigning past blame.'
            ],
            answer: 'Focus on observable behaviour, use the Sandwich Method and discuss a future solution rather than assigning past blame.',
            explanation: 'Focus on specific observable behaviour instead of labelling a person. The Sandwich Method begins with a positive observation, addresses the issue and finishes with a collaborative solution.'
          }
        ],
        clue: 'Your boundaries are now protected, but strong relationships require continuous care. Find the Signal Repair Hub on the right side of Wall 3 and restore the final trust connection.',
        nextObject: 'Signal Repair Hub'
      },
      {
        id: 5,
        wall: 3,
        object: 'Signal Repair Hub',
        objectLabel: 'FINAL TRUST CONNECTION',
        position: { top: '23%', left: '66%', width: '23%', height: '33%' },
        chestPosition: { top: '23%', left: '66%', width: '23%', height: '33%' },
        title: 'Nurturing',
        podcast: 'Module 5.5 – Nurturing',
        story: 'All previous communication systems have been restored, but the crew relationship network remains incomplete. The station requires one final task. Restore trust through meaningful appreciation, sincere apologies and consistent relationship maintenance.',
        outline: [
          'Appreciation can be tailored to the way each teammate prefers to be recognized.',
          'A proper apology includes regret, responsibility, restitution and a plan for change.',
          'Small, regular check-ins build trust and surface small frustrations before they grow.',
          'Genuine, mutually supportive connections create a resilient long-term career network.'
        ],
        puzzle: [
          {
            title: 'The Missing Trust Connection',
            instruction: 'Crew Member A is waiting for appreciation, Crew Member B is waiting for an apology, and Crew Member C is waiting for a relationship check-in. Which action will help rebuild and maintain all three professional relationships?',
            items: [
              {
                label: 'Choose a response',
                options: [
                  'A. Contact people only when you need their help.',
                  'B. Avoid discussing mistakes and wait for conflicts to disappear.',
                  'C. Regularly appreciate others, take responsibility for mistakes and maintain connections through small check-ins.',
                  'D. Focus only on completing assigned tasks.'
                ],
                correct: 'C. Regularly appreciate others, take responsibility for mistakes and maintain connections through small check-ins.',
                hint: 'Look for the choice that combines appreciation, sincere accountability and consistent check-ins.'
              }
            ],
            explanation: 'Strong relationships require consistent effort. Appreciation builds trust, sincere apologies repair damaged relationships, and regular check-ins prevent small misunderstandings from becoming bigger problems.'
          }
        ],
        quiz: [
          {
            question: 'How can "appreciation languages" be used in a professional setting?',
            options: [
              'Give everyone public appreciation regardless of their preferences.',
              'Understand whether teammates prefer public praise, private thank-you notes or practical help, and tailor appreciation to their preferences.',
              'Appreciate teammates only when they complete important projects.',
              'Avoid expressing appreciation in professional relationships.'
            ],
            answer: 'Understand whether teammates prefer public praise, private thank-you notes or practical help, and tailor appreciation to their preferences.',
            explanation: 'People appreciate recognition differently. Some prefer public praise, others value private messages or practical support. Tailoring appreciation makes people feel genuinely valued.'
          },
          {
            question: 'What are the four parts of a "proper" apology framework?',
            options: [
              'Regret, Responsibility, Restitution and Plan for Change.',
              'Explanation, Excuse, Blame and Forget.',
              'Regret, Silence, Avoidance and Acceptance.',
              'Responsibility, Criticism, Justification and Closure.'
            ],
            answer: 'Regret, Responsibility, Restitution and Plan for Change.',
            explanation: 'A proper apology includes expressing sincere regret, accepting responsibility without excuses, offering restitution to make things right and explaining how you will change your behaviour.'
          },
          {
            question: 'Why are small, regular check-ins better than big "grand gestures"?',
            options: [
              'They help people avoid all professional responsibilities.',
              'They are useful only when someone needs a favour.',
              'Consistent small interactions build trust, keep relationships active and help identify small frustrations before they become major conflicts.',
              'They replace the need for communication during disagreements.'
            ],
            answer: 'Consistent small interactions build trust, keep relationships active and help identify small frustrations before they become major conflicts.',
            explanation: 'Regular check-ins act like small deposits in a trust savings account. They keep relationships warm and help prevent minor problems from becoming serious conflicts.'
          },
          {
            question: 'How does nurturing connections today build a "resilient career network" for tomorrow?',
            options: [
              'By connecting with people only when looking for a job.',
              'By building relationships based on trust, consistent positive interactions and mutual support, creating a network that can support future career opportunities and challenges.',
              'By focusing only on the number of professional contacts.',
              'By avoiding professional relationships outside the workplace.'
            ],
            answer: 'By building relationships based on trust, consistent positive interactions and mutual support, creating a network that can support future career opportunities and challenges.',
            explanation: 'A nurtured professional network creates a support system for career changes, job loss and business challenges. A positive reputation and genuine relationships become valuable long-term professional assets.'
          }
        ],
        clue: '',
        nextObject: ''
      }
    ];
  }

  defaultState() {
    return {
      boxes: Object.fromEntries(this.boxes.map(box => [box.id, {
        puzzleStep: 0,
        revealed: false,
        opened: false,
        outlineReviewed: false,
        podcastCompleted: false,
        podcastProgressSeconds: 0,
        quizPassed: false,
        quizIndex: 0,
        quizCorrectCount: 0,
        quizAttempts: 0,
        selectedQuizAnswer: '',
        pendingQuizFeedback: null,
        completed: false
      }])),
      log: {
        names: ['', ''],
        checkIn: '',
        apologies: ['', '', '', ''],
        appreciation: '',
        reflection: '',
        trustDepositSubmitted: false,
        apologySubmitted: false,
        submitted: false
      },
      reactorActivated: false,
      networkRestored: false,
      vaultOpened: false,
      lobbyEntered: false,
      lobbyView: 0,
      complete: false,
      module2Version: 2,
      module3Version: 3,
      module4Version: 1,
      module5Version: 1
    };
  }

  loadState() {
    const defaults = this.defaultState();
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (!saved) return defaults;
      const parsed = JSON.parse(saved);
      if (!parsed || typeof parsed !== 'object') throw new Error('Saved journey state is not an object.');
      const state = { ...defaults, ...parsed, boxes: { ...defaults.boxes } };
      for (const box of this.boxes) {
        const savedBox = parsed.boxes?.[box.id];
        if (savedBox && typeof savedBox === 'object') {
          state.boxes[box.id] = { ...defaults.boxes[box.id], ...savedBox };
        }
      }
      const savedFirstBox = parsed.boxes?.[1];
      if (savedFirstBox && !Object.prototype.hasOwnProperty.call(savedFirstBox, 'podcastCompleted')) {
        state.boxes[1] = { ...defaults.boxes[1] };
      }
      if (parsed.module2Version !== 2) {
        state.boxes[2] = { ...defaults.boxes[2] };
        state.module2Version = 2;
      }
      if (parsed.module3Version !== 3) {
        state.boxes[3] = { ...defaults.boxes[3] };
        state.module3Version = 3;
      }
      if (parsed.module4Version !== 1) {
        state.boxes[4] = { ...defaults.boxes[4] };
        state.module4Version = 1;
      }
      if (parsed.module5Version !== 1) {
        state.boxes[5] = { ...defaults.boxes[5] };
        state.log = { ...defaults.log, names: [...defaults.log.names], apologies: [...defaults.log.apologies] };
        state.reactorActivated = false;
        state.networkRestored = false;
        state.complete = false;
        state.module5Version = 1;
      }
      const savedLog = parsed.log;
      if (savedLog && typeof savedLog === 'object') {
        state.log = {
          ...defaults.log,
          ...savedLog,
          names: Array.isArray(savedLog.names) ? savedLog.names.slice(0, 2) : defaults.log.names,
          apologies: Array.isArray(savedLog.apologies) ? savedLog.apologies.slice(0, 4) : defaults.log.apologies
        };
        while (state.log.names.length < 2) state.log.names.push('');
        while (state.log.apologies.length < 4) state.log.apologies.push('');
      }
      state.lobbyView = Number.isInteger(state.lobbyView)
        ? (state.lobbyView + 4) % 4
        : defaults.lobbyView;
      return state;
    } catch (error) {
      console.error('Unable to load the saved relationship-skills journey.', error);
      return defaults;
    }
  }

  save() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.state));
      return true;
    } catch (error) {
      console.error('Unable to save the relationship-skills journey.', error);
      window.app?.showToast('Journey progress could not be saved in this browser.', 'error');
      return false;
    }
  }

  isActive() {
    return Boolean(document.getElementById('walls-master-stage')?.classList.contains('relationship-mode'));
  }

  isDialogOpen() {
    return Boolean(this.layer && !this.dialog.hidden);
  }

  open() {
    this.stage = document.getElementById('walls-master-stage');
    if (!this.stage) {
      throw new Error('Cannot start the relationship journey: the spaceship wall stage is missing.');
    }
    this.stage.classList.remove('room-mode-room1', 'room-mode-module5');
    this.stage.classList.add('relationship-mode');
    this.buildLayer();
    this.state = this.loadState();
    this.stage.classList.toggle('relationship-lobby-entered', this.state.lobbyEntered);
    this.save();
    if (this.state.boxes[1].completed && window.gameState?.addItem && !window.gameState.hasItem('access_fragment_01')) {
      window.gameState.addItem({
        id: 'access_fragment_01',
        name: 'ACCESS FRAGMENT 01',
        icon: '🔹',
        desc: 'A restored emotional signal fragment. The Crew Network Panel is the next module access point.',
        type: 'clue'
      });
    }
    if (this.state.boxes[2].completed && window.gameState?.addItem && !window.gameState.hasItem('access_fragment_02')) {
      window.gameState.addItem({
        id: 'access_fragment_02',
        name: 'ACCESS FRAGMENT 02',
        icon: '🔹',
        desc: 'A restored crew-network fragment. The Signal Repair Hub is the next module access point.',
        type: 'clue'
      });
    }
    if (this.state.boxes[3].completed && window.gameState?.addItem && !window.gameState.hasItem('access_fragment_03')) {
      window.gameState.addItem({
        id: 'access_fragment_03',
        name: 'ACCESS FRAGMENT 03 – SIGNAL KEY',
        icon: '🔹',
        desc: 'A restored communication signal fragment. The Crew Vital Monitor on Wall 3 is the next module access point.',
        type: 'clue'
      });
    }
    if (this.state.boxes[4].completed && window.gameState?.addItem && !window.gameState.hasItem('access_fragment_04')) {
      window.gameState.addItem({
        id: 'access_fragment_04',
        name: 'ACCESS FRAGMENT 04 – TRUST KEY',
        icon: '🔹',
        desc: 'A restored boundary protocol fragment. The Central Trust Reactor on Wall 2 is the next module access point.',
        type: 'clue'
      });
    }
    if (this.state.boxes[5].completed && window.gameState?.addItem && !window.gameState.hasItem('access_fragment_05')) {
      window.gameState.addItem({
        id: 'access_fragment_05',
        name: 'ACCESS FRAGMENT 05 – NURTURING KEY',
        icon: '🔹',
        desc: 'The final relationship-maintenance key. Activate the Central Trust Reactor on Wall 2 to restore the station.',
        type: 'clue'
      });
    }
    if (window.gameState) {
      window.gameState.state.currentRoomId = 5;
      window.gameState.save();
    }
    const wall = this.state.networkRestored
      ? 4
      : this.state.log.submitted
        ? 2
        : this.currentBox()?.wall || 1;
    window.vintageRoomEngine?.setWall(wall);
    this.renderTargets();
    this.renderTracker();
    this.renderLobbyView();
    window.app?.updateHUD();
  }

  buildLayer() {
    if (this.layer?.isConnected) return;
    this.layer = document.createElement('div');
    this.layer.className = 'relationship-layer';
    this.layer.innerHTML = `
      <aside class="relationship-tracker" aria-live="polite">
        <div class="relationship-tracker-title">TRUST NETWORK • <span id="relationship-tracker-progress">0/5 MODULES COMPLETE</span></div>
        <div class="relationship-tracker-objective" id="relationship-tracker-objective"></div>
      </aside>
      <div class="relationship-dialog" id="relationship-dialog" hidden>
        <section class="relationship-card" role="dialog" aria-modal="true" aria-labelledby="relationship-dialog-title">
          <div id="relationship-dialog-content"></div>
        </section>
      </div>
      <div class="relationship-vault-portal" id="relationship-vault-portal" hidden aria-hidden="true">
        <div class="relationship-vault-aperture">
          <div class="relationship-lobby-interior" aria-hidden="true">
            <div class="relationship-lobby-window"></div>
            <div class="relationship-lobby-interior-console"></div>
            <div class="relationship-lobby-interior-seating"></div>
            <div class="relationship-lobby-interior-label">CREW LOBBY • STATION OPERATIONAL</div>
          </div>
        </div>
        <div class="relationship-vault-door-surface" aria-hidden="true">
          <span class="relationship-vault-bolt bolt-top"></span>
          <span class="relationship-vault-bolt bolt-right"></span>
          <span class="relationship-vault-bolt bolt-bottom"></span>
          <span class="relationship-vault-bolt bolt-left"></span>
        </div>
        <span class="relationship-vault-lock-state" aria-hidden="true"></span>
        <span class="relationship-vault-scanner-state" aria-hidden="true"></span>
        <section class="relationship-vault-welcome" id="relationship-vault-welcome" hidden>
          <p class="relationship-lobby-kicker">ACCESS GRANTED – CREW VAULT UNLOCKED</p>
          <h2>WELCOME TO THE CREW LOBBY</h2>
          <p>Congratulations! You have successfully restored the station's communication network. The Crew Lobby is now accessible. Step inside and explore your new destination.</p>
          <button type="button" class="relationship-button primary" data-action="enter-lobby">ENTER LOBBY</button>
        </section>
      </div>
      <section class="relationship-lobby-room" id="relationship-lobby-room" data-view="0" hidden aria-label="Crew Lobby">
        <div class="relationship-lobby-ceiling"><span></span><span></span><span></span><span></span></div>
        <div class="relationship-lobby-panorama">
          <div class="relationship-lobby-sky"><div class="relationship-lobby-planet"></div></div>
          <div class="relationship-lobby-architecture"></div>
          <button type="button" class="relationship-lobby-side-screen screen-left" data-action="lobby-interact" data-message="Crew communications are online. All five relationship protocols are synchronized."><b>CREW COMMS</b><span>ALL CHANNELS ONLINE</span></button>
          <button type="button" class="relationship-lobby-side-screen screen-right" data-action="lobby-interact" data-message="Station status: all systems are operational and the crew network is restored."><b>STATION STATUS</b><span>NETWORK RESTORED</span></button>
          <div class="relationship-lobby-seats"><i></i><i></i><i></i></div>
          <div class="relationship-lobby-desk"><span>CREW INFORMATION</span><i></i></div>
          <div class="relationship-lobby-floor"></div>
        </div>
        <header class="relationship-lobby-header">
          <span class="relationship-lobby-kicker">NOVALINK • CREW DECK</span>
          <h1>CREW LOBBY – ACCESS SUCCESSFUL</h1>
          <p>Mission accomplished! The communication network has been restored, the crew is reconnected, and the station is operational again.</p>
        </header>
        <aside class="relationship-lobby-mission" aria-label="Mission summary">
          <h2>MISSION SUMMARY • 5/5 COMPLETE</h2>
          <ul>
            <li>Emotional Intelligence &amp; Relationship Awareness – Completed</li>
            <li>Self-Awareness &amp; Attachment – Completed</li>
            <li>Communication – Completed</li>
            <li>Professional &amp; Social Boundaries – Completed</li>
            <li>Nurturing – Completed</li>
          </ul>
          <p class="relationship-lobby-interaction-status" id="relationship-lobby-interaction-status" aria-live="polite">Welcome aboard. The crew information desk is ready.</p>
        </aside>
        <div class="relationship-lobby-interactions">
          <button type="button" class="relationship-button" data-action="lobby-interact" data-message="Crew communications are online. All five relationship protocols are synchronized.">CREW COMMUNICATIONS</button>
          <button type="button" class="relationship-button" data-action="lobby-interact" data-message="The information desk confirms the station is safe and operational.">INFORMATION DESK</button>
          <button type="button" class="relationship-button" data-action="lobby-interact" data-message="The lounge is open. Your crew is ready to reconnect.">CREW LOUNGE</button>
        </div>
        <nav class="relationship-lobby-navigation" aria-label="Explore the Crew Lobby">
          <button type="button" data-action="lobby-turn" data-direction="-1" aria-label="Look left">‹</button>
          <span id="relationship-lobby-view-label">ENTRY VIEW</span>
          <button type="button" data-action="lobby-turn" data-direction="1" aria-label="Look right">›</button>
        </nav>
      </section>`;
    this.stage.appendChild(this.layer);
    this.dialog = this.layer.querySelector('#relationship-dialog');
    this.card = this.layer.querySelector('#relationship-dialog-content');
    this.layer.addEventListener('click', event => this.handleClick(event));
    this.layer.addEventListener('submit', event => this.handleSubmit(event));
    this.layer.addEventListener('input', event => this.handleLogInput(event));
    this.layer.addEventListener('change', event => {
      this.handleLogInput(event);
      this.handleQuizSelection(event);
    });
    this.dialog.addEventListener('click', event => {
      if (event.target === this.dialog) this.closeDialog();
    });
  }

  renderTargets() {
    this.layer.querySelectorAll('.relationship-target').forEach(target => target.remove());
    this.boxes.forEach(box => {
      const available = this.isBoxAvailable(box.id);
      const panel = this.createTarget(`panel-${box.id}`, box.objectLabel, box.wall, box.position, `Inspect ${box.object}`);
      panel.hidden = (!available && box.id !== 4 && box.id !== 5) || this.state.boxes[box.id].revealed;
      panel.dataset.action = 'inspect';
      panel.dataset.boxId = String(box.id);
      if (box.id === 1) {
        panel.classList.add('relationship-storage-box');
        panel.innerHTML = '';
        panel.setAttribute('aria-label', 'Inspect the metallic storage box');
      }
      if (box.id === 2) {
        panel.classList.add('relationship-network-target');
        panel.innerHTML = '';
        panel.setAttribute('aria-label', 'Inspect the Crew Network Panel');
      }
      if (box.id === 3) {
        panel.classList.add('relationship-signal-target');
        panel.innerHTML = '';
        panel.setAttribute('aria-label', 'Open the atom-like Signal Repair Hub for Module 5.3');
      }
      if (box.id === 4) {
        panel.classList.add('relationship-monitor-target');
        panel.innerHTML = '';
        panel.setAttribute('aria-label', 'Open the Crew Vital Monitor for Module 5.4');
      }
      if (box.id === 5) {
        panel.classList.add('relationship-signal-target', 'relationship-final-signal-target');
        panel.innerHTML = '';
        panel.setAttribute('aria-label', 'Open the Signal Repair Hub for final Module 5.5');
      }
      this.layer.appendChild(panel);

      const chest = this.createTarget(`chest-${box.id}`, `KNOWLEDGE BOX ${String(box.id).padStart(2, '0')}`, box.wall, box.chestPosition, `Open revealed Knowledge Box ${String(box.id).padStart(2, '0')}`);
      chest.classList.add('is-revealed');
      chest.hidden = !available || !this.state.boxes[box.id].revealed;
      if (box.id === 3 && this.state.boxes[3].completed) chest.hidden = true;
      if (box.id === 5 && this.state.boxes[5].completed) chest.hidden = true;
      chest.dataset.action = 'open-box';
      chest.dataset.boxId = String(box.id);
      if (box.id === 1) {
        chest.classList.add('relationship-storage-box', 'relationship-storage-box-open');
        chest.innerHTML = '<span class="relationship-target-label">KNOWLEDGE BOX 01</span>';
        chest.setAttribute('aria-label', 'Open Knowledge Box 01');
      }
      if (box.id === 2) {
        chest.classList.add('relationship-network-chest');
        chest.setAttribute('aria-label', 'Open Knowledge Box 02');
      }
      if (box.id === 3) {
        chest.classList.add('relationship-signal-target', 'is-revealed');
        chest.innerHTML = '<span class="relationship-target-label">KNOWLEDGE BOX 03</span>';
        chest.setAttribute('aria-label', 'Open Knowledge Box 03');
      }
      if (box.id === 4) {
        chest.classList.add('relationship-monitor-target', 'relationship-monitor-chest', 'is-revealed');
        chest.innerHTML = '<span class="relationship-target-label">KNOWLEDGE BOX 04</span>';
        chest.setAttribute('aria-label', 'Open Knowledge Box 04 on the Crew Vital Monitor');
      }
      if (box.id === 5) {
        chest.classList.add('relationship-signal-target', 'relationship-final-signal-target', 'is-revealed');
        chest.innerHTML = '<span class="relationship-target-label">KNOWLEDGE BOX 05</span>';
        chest.setAttribute('aria-label', 'Open Knowledge Box 05 on the Signal Repair Hub');
      }
      this.layer.appendChild(chest);
    });

    const airlock = this.createTarget('airlock', this.state.networkRestored ? 'COMMUNICATION RESTORED – EXIT UNLOCKED' : 'COMMUNICATION RESTORATION REQUIRED', 1, { top: '49%', left: '42%', width: '16%', height: '12%' }, 'Open the emergency airlock');
    airlock.classList.add('is-revealed');
    airlock.hidden = !this.state.networkRestored;
    airlock.dataset.action = 'airlock';
    this.layer.appendChild(airlock);

    const reactor = this.createTarget('reactor', 'ACTIVATE TRUST REACTOR', 2, { top: '41%', left: '43%', width: '16%', height: '11%' }, 'Activate the Central Trust Reactor');
    reactor.classList.add('is-revealed');
    reactor.hidden = !this.state.log.submitted || this.state.reactorActivated;
    reactor.dataset.action = 'reactor';
    this.layer.appendChild(reactor);

    const vault = this.createTarget('vault', 'CREW SECURITY VAULT', 4, { top: '14%', left: '15%', width: '37%', height: '69%' }, 'Inspect the Crew Security Vault on Wall 4');
    vault.innerHTML = '';
    vault.setAttribute('aria-label', 'Inspect the Crew Security Vault');
    vault.dataset.action = 'vault';
    this.layer.appendChild(vault);
    this.syncTargets();
  }

  syncTargets() {
    if (!this.layer) return;
    const currentWall = window.vintageRoomEngine?.currentWall || 1;
    this.layer.querySelectorAll('.relationship-target').forEach(target => {
      const boxId = Number(target.dataset.boxId);
      let available = Number(target.dataset.wall) === currentWall;
      if (target.dataset.action === 'inspect') {
        const box = this.boxes.find(item => item.id === boxId);
        if (!box) return;
        const unlocked = this.isBoxAvailable(boxId);
        available = available && (unlocked || boxId === 4 || boxId === 5) && !this.state.boxes[boxId].revealed;
        if (boxId === 4 || boxId === 5) {
          target.classList.toggle('is-locked', !unlocked);
          target.setAttribute('aria-label', unlocked
            ? `Open ${box.object} for Module 5.${boxId}`
            : `Module 5.${boxId} is locked; click to view the prerequisites`);
        }
      } else if (target.dataset.action === 'open-box') {
        available = available && this.isBoxAvailable(boxId) && this.state.boxes[boxId].revealed;
        if (boxId === 3 && this.state.boxes[3].completed) available = false;
      } else if (target.dataset.action === 'reactor') {
        available = available && this.state.log.submitted && !this.state.reactorActivated;
      } else if (target.dataset.action === 'airlock') {
        available = false;
      } else if (target.dataset.action === 'vault') {
        available = available && !this.state.lobbyEntered;
      }
      target.hidden = !available;
    });
    const portal = this.layer.querySelector('#relationship-vault-portal');
    if (portal) {
      const onVaultWall = currentWall === 4;
      portal.hidden = !this.state.vaultOpened || this.state.lobbyEntered || !onVaultWall;
      portal.setAttribute('aria-hidden', String(portal.hidden));
      portal.classList.toggle('is-open', this.state.vaultOpened);
    }
    const welcome = this.layer.querySelector('#relationship-vault-welcome');
    if (welcome) welcome.hidden = !this.state.vaultOpened || this.state.lobbyEntered || currentWall !== 4;
    const lobby = this.layer.querySelector('#relationship-lobby-room');
    if (lobby) lobby.hidden = !this.state.lobbyEntered;
    this.layer.classList.toggle('is-lobby-entered', this.state.lobbyEntered);
  }

  createTarget(id, label, wall, position, title) {
    const target = document.createElement('button');
    target.type = 'button';
    target.id = `relationship-${id}`;
    target.className = 'relationship-target';
    target.textContent = label;
    target.title = title;
    Object.assign(target.style, position);
    target.dataset.wall = String(wall);
    target.hidden = true;
    return target;
  }

  currentBox() {
    return this.boxes.find(box => !this.state.boxes[box.id].completed) || null;
  }

  isBoxAvailable(boxId) {
    const box = this.boxes.find(item => item.id === boxId);
    if (!box) return false;
    if (boxId <= 3) return true;
    for (let prerequisite = 1; prerequisite < boxId; prerequisite += 1) {
      if (this.state.boxes[prerequisite]?.completed !== true) return false;
    }
    return true;
  }

  isVaultUnlocked() {
    return this.state.reactorActivated === true
      && this.state.networkRestored === true
      && this.state.log.submitted === true
      && Object.values(this.state.boxes).length === 5
      && Object.values(this.state.boxes).every(box => box.completed === true);
  }

  isLobbyEntered() {
    return this.state.lobbyEntered === true;
  }

  isVaultUnlocking() {
    return this.vaultUnlocking;
  }

  inspectVault() {
    if (!this.isVaultUnlocked()) {
      this.show('vault-denied', `
        <p class="relationship-kicker">CREW SECURITY VAULT – ACCESS DENIED</p>
        <h2>VAULT LOCKED</h2>
        <p>Complete all five relationship restoration protocols to gain access to the Crew Lobby.</p>
        <div class="relationship-button-row"><button type="button" class="relationship-button primary" data-action="close">CONTINUE</button></div>`);
      return;
    }
    if (this.vaultUnlocking) return;
    if (this.state.vaultOpened) {
      this.syncTargets();
      return;
    }
    this.vaultUnlocking = true;
    const portal = this.layer.querySelector('#relationship-vault-portal');
    portal.hidden = false;
    portal.setAttribute('aria-hidden', 'false');
    this.stage.classList.add('relationship-vault-unlocking');
    window.soundEngine?.playWhoosh();
    window.soundEngine?.playVaultUnlock();
    window.setTimeout(() => {
      this.state.vaultOpened = true;
      this.save();
      this.vaultUnlocking = false;
      this.stage.classList.remove('relationship-vault-unlocking');
      this.syncTargets();
      window.soundEngine?.playSuccess();
    }, 2300);
  }

  enterLobby() {
    if (!this.state.vaultOpened || !this.isVaultUnlocked()) {
      this.inspectVault();
      return;
    }
    this.stage.classList.add('relationship-lobby-entering');
    window.soundEngine?.playWhoosh();
    window.setTimeout(() => {
      this.state.lobbyEntered = true;
      this.state.complete = true;
      this.state.lobbyView = 0;
      this.save();
      this.stage.classList.remove('relationship-lobby-entering');
      this.stage.classList.add('relationship-lobby-entered');
      this.syncTargets();
      this.renderLobbyView();
    }, 1100);
  }

  rotateLobby(direction) {
    if (!this.isLobbyEntered()) return;
    const views = ['ENTRY VIEW', 'CREW COMMUNICATIONS', 'INFORMATION DESK', 'CREW LOUNGE'];
    this.state.lobbyView = (this.state.lobbyView + direction + views.length) % views.length;
    this.save();
    this.renderLobbyView();
  }

  renderLobbyView() {
    const lobby = this.layer?.querySelector('#relationship-lobby-room');
    if (!lobby) return;
    lobby.dataset.view = String(this.state.lobbyView || 0);
    const label = lobby.querySelector('#relationship-lobby-view-label');
    if (label) {
      label.textContent = ['ENTRY VIEW', 'CREW COMMUNICATIONS', 'INFORMATION DESK', 'CREW LOUNGE'][this.state.lobbyView || 0];
    }
  }

  objectiveText() {
    if (this.state.complete) return 'Mission complete. Explore the Crew Lobby with the wall-turn controls.';
    if (this.state.networkRestored) return 'Mission progress 5/5. Find the Crew Security Vault on Wall 4 to enter the Crew Lobby.';
    if (this.state.log.submitted && !this.state.reactorActivated) return 'Your Relationship Maintenance Log is saved. Find and activate the Central Trust Reactor on Wall 2.';
    if (!this.state.boxes[3].completed && window.vintageRoomEngine?.currentWall === 2) {
      const signalProgress = this.state.boxes[3];
      if (!signalProgress.revealed) return 'Module 5.3 is available now: click the labeled Signal Hub on the right side of Wall 2. Module 5.2 does not need to be completed first.';
      if (!signalProgress.opened) return 'Open Knowledge Box 03 on the Signal Repair Hub on Wall 2.';
      if (!signalProgress.podcastCompleted) return 'Watch the original Module 5.3 podcast outside the game, then confirm in Knowledge Box 03 to unlock the quiz.';
      return 'Module 5.3 podcast confirmed. Complete its four-question quiz and score at least 3/4.';
    }
    if (this.state.boxes[1].completed && this.state.boxes[2].completed && this.state.boxes[3].completed && !this.state.boxes[4].completed && window.vintageRoomEngine?.currentWall === 3) {
      return 'Click the Crew Vital Monitor on the left side of Wall 3 to start Module 5.4.';
    }
    if (this.state.boxes[4].completed && !this.state.boxes[5].completed && window.vintageRoomEngine?.currentWall === 3) {
      return 'Final module: click the Signal Repair Hub on the right of Wall 3 to restore the crew relationship network.';
    }
    if (!this.state.boxes[1].completed && window.vintageRoomEngine?.currentWall === 2) {
      return 'Click the Crew Network Panel to start Module 5.2. Module 5.1 is still available on Wall 1.';
    }
    const box = this.currentBox();
    if (!box) return 'Find and activate the Central Trust Reactor on Wall 2.';
    const progress = this.state.boxes[box.id];
    if (!progress.revealed) return `Wall ${box.wall}: find the ${box.object} and solve its environmental puzzle.`;
    if (!progress.opened) return `Wall ${box.wall}: open the revealed Knowledge Box ${String(box.id).padStart(2, '0')}.`;
    if (box.id === 1 && !progress.podcastCompleted) return 'Knowledge Box 01: complete the Module 5.1 video simulation to unlock its four-question quiz.';
    if (box.id === 2 && !progress.outlineReviewed) return 'Knowledge Box 02: watch the Module 5.2 podcast to unlock its four-question quiz.';
    if (box.id === 5 && !progress.outlineReviewed) return 'Knowledge Box 05: watch the original Module 5.5 podcast outside the game, then confirm to unlock the quiz.';
    if (box.id > 2 && !progress.outlineReviewed) return `Knowledge Box ${String(box.id).padStart(2, '0')}: review the clearly labelled course outline before the quiz.`;
    if (!progress.quizPassed) return `Knowledge Box ${String(box.id).padStart(2, '0')}: complete its quiz to unlock the next clue.`;
    if (box.id === 5 && !this.state.log.submitted) return 'Complete Your Relationship Maintenance Log in Knowledge Box 05.';
    const next = this.boxes[box.id];
    return next ? `Clue unlocked: find the ${next.object} on Wall ${next.wall}.` : 'Complete the Relationship Maintenance Log, then activate the reactor.';
  }

  renderTracker() {
    if (!this.layer) return;
    const objective = this.layer.querySelector('#relationship-tracker-objective');
    objective.textContent = this.objectiveText();
    const progress = this.layer.querySelector('#relationship-tracker-progress');
    if (progress) {
      const completed = Object.values(this.state.boxes).filter(box => box.completed).length;
      progress.textContent = `${completed}/5 MODULES COMPLETE`;
    }
    const panel = this.layer.querySelector('#relationship-reactor');
    const airlock = this.layer.querySelector('#relationship-airlock');
    if (panel) panel.hidden = !this.state.log.submitted || this.state.reactorActivated;
    if (airlock) airlock.hidden = !this.state.networkRestored;
    this.syncTargets();
  }

  show(screen, html) {
    this.stopPodcastSimulation();
    this.currentScreen = screen;
    this.card.innerHTML = `<button type="button" class="relationship-close" data-action="close" aria-label="Close">×</button>${html}`;
    this.dialog.hidden = false;
    const heading = this.card.querySelector('h2');
    if (heading) heading.id = 'relationship-dialog-title';
    this.card.querySelector('button:not(.relationship-close), input, select, textarea')?.focus();
  }

  closeDialog() {
    if (this.podcastSimulationTimer !== null) this.save();
    this.stopPodcastSimulation();
    if (this.dialog) this.dialog.hidden = true;
    this.currentScreen = '';
  }

  inspectBox(boxId) {
    const box = this.boxes.find(item => item.id === boxId);
    if (!box) return;
    if (!this.isBoxAvailable(boxId)) {
      if (boxId === 4) {
        this.show('locked-module', `
          <p class="relationship-kicker">CREW VITAL MONITOR • MODULE 5.4 LOCKED</p>
          <h2>CREW BOUNDARY PROTOCOL – LOCKED</h2>
          <p>Complete Modules 5.1, 5.2 and 5.3 to unlock Professional &amp; Social Boundaries. Your progress is saved, and this station will become available when all three Knowledge Boxes are complete.</p>
          <div class="relationship-button-row"><button type="button" class="relationship-button primary" data-action="close">CONTINUE</button></div>`);
      } else if (boxId === 5) {
        const remainingModules = this.boxes
          .filter(module => module.id < boxId && this.state.boxes[module.id]?.completed !== true)
          .map(module => `Module 5.${module.id} – ${module.title}`);
        this.show('locked-module', `
          <p class="relationship-kicker">SIGNAL REPAIR HUB • MODULE 5.5 LOCKED</p>
          <h2>FINAL TRUST CONNECTION – LOCKED</h2>
          <p>Module 5.5 is clickable, but its puzzle unlocks after Modules 5.1–5.4 are complete.</p>
          <p><strong>Still to complete:</strong></p>
          <ul>${remainingModules.map(module => `<li>${this.escapeHtml(module)}</li>`).join('')}</ul>
          <div class="relationship-button-row"><button type="button" class="relationship-button primary" data-action="close">CONTINUE</button></div>`);
      }
      return;
    }
    this.activeBoxId = boxId;
    if (window.vintageRoomEngine?.currentWall !== box.wall) window.vintageRoomEngine?.setWall(box.wall);
    if (box.id >= 2 && box.id <= 5) window.soundEngine?.playClick();
    if (box.id === 3) {
      window.soundEngine?.playWhoosh();
      this.layer.querySelector('#relationship-panel-3')?.classList.add('relationship-signal-activating');
    }
    if (box.id === 4) {
      window.soundEngine?.playWhoosh();
      const monitor = this.layer.querySelector('#relationship-panel-4');
      monitor?.classList.add('relationship-monitor-activating');
      window.setTimeout(() => monitor?.classList.remove('relationship-monitor-activating'), 2400);
    }
    if (box.id === 5) {
      window.soundEngine?.playWhoosh();
      const signal = this.layer.querySelector('#relationship-panel-5');
      signal?.classList.add('relationship-final-signal-activating');
      window.setTimeout(() => signal?.classList.remove('relationship-final-signal-activating'), 2400);
    }
    const progress = this.state.boxes[boxId];
    this.show('briefing', `
      <p class="relationship-kicker">WALL ${box.wall} • ACCESS COMPONENT</p>
      <h2>${boxId === 1 ? 'EMOTIONAL SIGNAL LOCKED' : boxId === 2 ? 'CREW NETWORK PANEL' : boxId === 3 ? 'SIGNAL REPAIR HUB – COMMUNICATION SYSTEM LOCKED' : boxId === 4 ? 'CREW BOUNDARY PROTOCOL – LOCKED' : 'FINAL COMMUNICATION PROTOCOL – OFFLINE'}</h2>
      <p>${this.escapeHtml(box.story)}</p>
      <p><strong>Environmental puzzle:</strong> ${this.escapeHtml(box.puzzle.map(item => item.title).join(' → '))}</p>
      ${progress.revealed
        ? `<div class="relationship-feedback is-success">The hidden compartment is open. The Knowledge Box is now visible in the room.</div><div class="relationship-button-row"><button type="button" class="relationship-button" data-action="close">Return to room and open the Knowledge Box</button></div>`
        : `<div class="relationship-button-row"><button type="button" class="relationship-button primary" data-action="start-puzzle">Start Puzzle</button></div>`}`);
  }

  startPuzzle() {
    const box = this.boxes.find(item => item.id === this.activeBoxId);
    if (!box) return;
    const progress = this.state.boxes[box.id];
    if (progress.revealed) {
      this.show('reveal', this.revealHtml(box));
      return;
    }
    this.feedback = '';
    this.renderPuzzle();
  }

  renderPuzzle() {
    const box = this.boxes.find(item => item.id === this.activeBoxId);
    const progress = this.state.boxes[this.activeBoxId];
    if (!box || !progress) return;
    const puzzle = box.puzzle[progress.puzzleStep];
    if (!puzzle) {
      progress.revealed = true;
      this.save();
      this.renderTargets();
      this.renderTracker();
      this.show('reveal', this.revealHtml(box));
      return;
    }

    let taskHtml = '';
    if (puzzle.type === 'order') {
      const orderKey = `${box.id}-${progress.puzzleStep}`;
      if (!this.puzzleOrders[orderKey]) this.puzzleOrders[orderKey] = [...puzzle.items];
      taskHtml = `<ol class="relationship-order-list">${this.puzzleOrders[orderKey].map((item, index) => `
        <li class="relationship-order-row"><span>${index + 1}. ${this.escapeHtml(item)}</span>
          <span>
            <button type="button" data-action="move-order" data-index="${index}" data-direction="-1" aria-label="Move ${this.escapeHtml(item)} up" ${index === 0 ? 'disabled' : ''}>↑</button>
            <button type="button" data-action="move-order" data-index="${index}" data-direction="1" aria-label="Move ${this.escapeHtml(item)} down" ${index === this.puzzleOrders[orderKey].length - 1 ? 'disabled' : ''}>↓</button>
          </span>
        </li>`).join('')}</ol>`;
    } else {
      taskHtml = `<div class="relationship-form-grid">${puzzle.items.map((item, index) => `
        <label class="relationship-field"><span>${this.escapeHtml(item.label)}</span>
          <select required data-puzzle-field="${index}">
            <option value="">Choose a response…</option>
            ${item.options.map(option => `<option value="${this.escapeHtml(option)}">${this.escapeHtml(option)}</option>`).join('')}
          </select>
        </label>`).join('')}</div>`;
    }

    this.show('puzzle', `
      <p class="relationship-kicker">KNOWLEDGE BOX ${String(box.id).padStart(2, '0')} • ENVIRONMENTAL PUZZLE ${progress.puzzleStep + 1} OF ${box.puzzle.length}</p>
      <h2>${this.escapeHtml(puzzle.title)}</h2>
      <p>${this.escapeHtml(puzzle.instruction)}</p>
      <form data-form="puzzle">
        ${taskHtml}
        ${this.feedback ? `<div class="relationship-feedback is-error" role="status">${this.escapeHtml(this.feedback)}</div>` : ''}
        <div class="relationship-button-row"><button class="relationship-button primary" type="submit">Check Puzzle</button></div>
      </form>`);
  }

  validatePuzzle() {
    const box = this.boxes.find(item => item.id === this.activeBoxId);
    const progress = this.state.boxes[this.activeBoxId];
    const puzzle = box?.puzzle[progress.puzzleStep];
    if (!puzzle) return;
    if (puzzle.type === 'order') {
      const orderKey = `${box.id}-${progress.puzzleStep}`;
      const order = this.puzzleOrders[orderKey] || [];
      if (JSON.stringify(order) !== JSON.stringify(puzzle.correct)) {
        this.feedback = puzzle.hint;
        this.renderPuzzle();
        return;
      }
    } else {
      const values = [...this.card.querySelectorAll('[data-puzzle-field]')].map(select => select.value);
      if (values.some(value => !value)) {
        this.feedback = 'Choose an answer for each item before checking the puzzle.';
        this.renderPuzzle();
        return;
      }
      const incorrectIndex = values.findIndex((value, index) => value !== puzzle.items[index].correct);
      if (incorrectIndex !== -1) {
        this.feedback = puzzle.items[incorrectIndex].hint;
        if (box.id === 5) window.soundEngine?.playError();
        this.renderPuzzle();
        return;
      }
    }

    if (box.id === 1) {
      progress.puzzleStep = 1;
      progress.revealed = true;
      this.feedback = '';
      this.save();
      window.soundEngine?.playSuccess();
      this.renderTargets();
      this.renderTracker();
      const target = this.layer.querySelector('#relationship-chest-1');
      target?.classList.add('relationship-storage-box-opening');
      this.show('reveal', this.revealHtml(box));
      return;
    }

    progress.puzzleStep += 1;
    this.feedback = '';
    if (box.id === 2 || box.id === 3 || box.id === 4 || box.id === 5) {
      progress.puzzleStep = box.puzzle.length;
      progress.revealed = true;
      this.save();
      window.soundEngine?.playSuccess();
      this.renderTargets();
      this.renderTracker();
      const targetId = `chest-${box.id}`;
      const activationClass = box.id === 2
        ? 'relationship-network-activating'
        : box.id === 3 ? 'relationship-signal-activating'
        : box.id === 4 ? 'relationship-monitor-activating' : 'relationship-final-signal-activating';
      const target = this.layer.querySelector(`#relationship-${targetId}`);
      target?.classList.add(activationClass);
      window.setTimeout(() => target?.classList.remove(activationClass), 2400);
      this.show('reveal', this.revealHtml(box));
      return;
    }
    this.save();
    if (progress.puzzleStep >= box.puzzle.length) {
      progress.revealed = true;
      this.save();
      this.renderTargets();
      this.renderTracker();
      this.show('reveal', this.revealHtml(box));
      return;
    }
    this.renderPuzzle();
  }

  revealHtml(box) {
    if (box.id === 1) {
      return `<p class="relationship-kicker">STORAGE UNIT OPENED • CYAN SIGNAL DETECTED</p>
        <div class="relationship-reveal relationship-emotion-reveal">
          <div class="relationship-emotion-light" aria-hidden="true"></div>
          <h2>KNOWLEDGE BOX 01</h2>
          <p><strong>MODULE 5.1 – EMOTIONAL INTELLIGENCE &amp; RELATIONSHIP AWARENESS</strong></p>
          <p>${this.escapeHtml(box.puzzle[0].explanation)}</p>
          <button type="button" class="relationship-button primary" data-action="open-revealed-box">OPEN KNOWLEDGE BOX</button>
        </div>`;
    }
    if (box.id === 2) {
      return `<p class="relationship-kicker">SUCCESS — BEHAVIOURAL PATTERN IDENTIFIED</p>
        <div class="relationship-reveal relationship-emotion-reveal relationship-network-reveal">
          <div class="relationship-emotion-light" aria-hidden="true"></div>
          <h2>KNOWLEDGE BOX 02</h2>
          <p><strong>MODULE 5.2 – SELF-AWARENESS &amp; ATTACHMENT</strong></p>
          <p>${this.escapeHtml(box.puzzle[0].explanation)}</p>
          <button type="button" class="relationship-button primary" data-action="open-revealed-box" data-box-id="2">OPEN KNOWLEDGE BOX</button>
        </div>`;
    }
    if (box.id === 3) {
      return `<p class="relationship-kicker">SUCCESS – COMMUNICATION PATTERN IDENTIFIED</p>
        <div class="relationship-reveal relationship-emotion-reveal relationship-network-reveal relationship-signal-reveal">
          <div class="relationship-emotion-light" aria-hidden="true"></div>
          <h2>KNOWLEDGE BOX 03</h2>
          <p><strong>MODULE 5.3 – COMMUNICATION</strong></p>
          <p>${this.escapeHtml(box.puzzle[0].explanation)}</p>
          <button type="button" class="relationship-button primary" data-action="open-revealed-box" data-box-id="3">OPEN KNOWLEDGE BOX</button>
        </div>`;
    }
    if (box.id === 4) {
        return `<p class="relationship-kicker">SUCCESS – BOUNDARY WARNING IDENTIFIED</p>
          <div class="relationship-reveal relationship-emotion-reveal relationship-monitor-reveal">
            <div class="relationship-emotion-light" aria-hidden="true"></div>
            <h2>KNOWLEDGE BOX 04</h2>
            <p><strong>MODULE 5.4 – PROFESSIONAL &amp; SOCIAL BOUNDARIES</strong></p>
            <p>${this.escapeHtml(box.puzzle[0].explanation)}</p>
            <button type="button" class="relationship-button primary" data-action="open-revealed-box" data-box-id="4">OPEN KNOWLEDGE BOX</button>
          </div>`;
    }
    if (box.id === 5) {
      return `<p class="relationship-kicker">SUCCESS – TRUST CONNECTION IDENTIFIED</p>
        <div class="relationship-reveal relationship-emotion-reveal relationship-network-reveal relationship-final-signal-reveal">
          <div class="relationship-emotion-light" aria-hidden="true"></div>
          <h2>KNOWLEDGE BOX 05 – NURTURING</h2>
          <p><strong>Relationship Maintenance Log</strong></p>
          <p>${this.escapeHtml(box.puzzle[0].explanation)}</p>
          <button type="button" class="relationship-button primary" data-action="open-revealed-box" data-box-id="5">OPEN KNOWLEDGE BOX</button>
        </div>`;
    }
    if (box.id === 3) {
      return `<p class="relationship-kicker">SUCCESS – COMMUNICATION PATTERN IDENTIFIED</p>
        <div class="relationship-reveal relationship-emotion-reveal relationship-network-reveal relationship-signal-reveal">
          <div class="relationship-emotion-light" aria-hidden="true"></div>
          <h2>KNOWLEDGE BOX 03</h2>
          <p><strong>MODULE 5.3 – COMMUNICATION</strong></p>
          <p>${this.escapeHtml(box.puzzle[0].explanation)}</p>
          <button type="button" class="relationship-button primary" data-action="open-revealed-box" data-box-id="3">OPEN KNOWLEDGE BOX</button>
        </div>`;
    }
    return `<p class="relationship-kicker">COMPARTMENT OPENED • KNOWLEDGE BOX REVEALED</p>
      <div class="relationship-reveal"><div style="font-size:38px" aria-hidden="true">▣</div>
        <h2>Knowledge Box ${String(box.id).padStart(2, '0')}</h2>
        <p>${this.escapeHtml(box.title)}</p>
        <p>The cyan-edged learning capsule is now visible beside the access panel. Click it in the room to open it.</p>
      </div>
      <div class="relationship-button-row"><button type="button" class="relationship-button" data-action="close">Return to the room</button></div>`;
  }

  openBox(boxId) {
    const box = this.boxes.find(item => item.id === boxId);
    const progress = this.state.boxes[boxId];
    if (!box || !progress?.revealed || !this.isBoxAvailable(boxId)) return;
    this.activeBoxId = boxId;
    progress.opened = true;
    this.save();
    this.renderTracker();
    if (boxId === 5 && progress.quizPassed) {
      this.renderActivity();
    } else if (boxId === 1 && progress.quizPassed && progress.completed) {
      this.renderClue(box);
    } else if (boxId === 1 && progress.podcastCompleted) {
      this.renderQuiz();
    } else if (boxId === 3 && progress.podcastCompleted) {
      this.renderQuiz();
    } else if (progress.quizPassed && progress.completed) {
      this.renderClue(box);
    } else if (progress.outlineReviewed) {
      this.renderQuiz();
    } else {
      this.renderPodcast();
    }
  }

  renderPodcast() {
    const box = this.boxes.find(item => item.id === this.activeBoxId);
    if (!box) return;
    if (box.id === 1) {
      const progress = this.state.boxes[1];
      this.show('podcast', `
        <p class="relationship-kicker">KNOWLEDGE BOX 01 • COURSE PODCAST</p>
        <h2>MODULE 5.1 – EMOTIONAL INTELLIGENCE &amp; RELATIONSHIP AWARENESS</h2>
        <p>The Emotional Early Warning System helps you notice physical triggers—jaw clenching, foot tapping, hot ears, or shallow breathing—before reacting.</p>
        <p><strong>Name It Strategy:</strong> identify an emotion such as feeling overlooked, rushed, or defensive. <strong>Validation Pivot:</strong> acknowledge the other person, pause tension, and give yourself time to think.</p>
        <div class="relationship-simulated-player" aria-label="Simulated Module 5.1 video player">
          <div class="relationship-video-placeholder">
            <span class="relationship-video-placeholder-icon" aria-hidden="true">▶</span>
            <strong>SIMULATED MODULE 5.1 VIDEO</strong>
            <span>No original course footage provided</span>
          </div>
          <div class="relationship-simulated-controls">
            <input class="relationship-simulated-progress" type="range" min="0" max="${this.podcastSimulationDuration}" value="${Math.min(progress.podcastProgressSeconds, this.podcastSimulationDuration)}" aria-label="Simulated video progress" disabled>
            <div class="relationship-simulated-control-row">
              <span class="relationship-simulated-time">${this.formatSimulationTime(progress.podcastProgressSeconds)} / ${this.formatSimulationTime(this.podcastSimulationDuration)}</span>
              <button type="button" class="relationship-button primary" data-action="${progress.podcastCompleted ? 'replay-simulated-video' : 'play-simulated-video'}">${progress.podcastCompleted ? 'REPLAY SIMULATION' : progress.podcastProgressSeconds > 0 ? 'RESUME SIMULATION' : 'PLAY SIMULATION'}</button>
            </div>
          </div>
        </div>
        ${this.feedback ? `<div class="relationship-feedback is-error" role="status">${this.escapeHtml(this.feedback)}</div>` : ''}
        ${progress.podcastCompleted
          ? '<div class="relationship-feedback is-success">Simulation complete. Loading the four-question Module 5.1 quiz…</div>'
          : '<p class="relationship-media-status" role="status">Complete the simulated video to continue to the four Module 5.1 questions.</p>'}`);
      return;
    }

    if (box.id === 2) {
      this.show('podcast', `
        <p class="relationship-kicker">KNOWLEDGE BOX 02 • COURSE PODCAST</p>
        <h2>SELF-AWARENESS &amp; ATTACHMENT</h2>
        <p>Explore how attachment patterns can influence feedback, help-seeking, the balance between solitude and connection, and workplace boundaries.</p>
        <div class="relationship-video-placeholder" role="img" aria-label="Module 5.2 course video placeholder">
          <span class="relationship-video-placeholder-icon" aria-hidden="true">▶</span>
          <strong>MODULE 5.2 VIDEO PLACEHOLDER</strong>
          <span>Original course video not provided</span>
        </div>
        <p class="relationship-course-note">The original Module 5.2 podcast was not found in the project assets. This clearly labelled placeholder is not course footage.</p>
        <div class="relationship-button-row">
          <button type="button" class="relationship-button primary" data-action="confirm-podcast-complete">I WATCHED THE ORIGINAL PODCAST — START QUIZ</button>
        </div>`);
      return;
    }

    if (box.id === 3) {
      const progress = this.state.boxes[3];
      this.show('podcast', `
        <p class="relationship-kicker">KNOWLEDGE BOX 03 • COURSE PODCAST</p>
        <h2>Communication – Building Better Conversations</h2>
        <p>Learn to listen reflectively, express needs without blame, recognize the limits of digital text, and move unresolved conversations to a richer communication channel.</p>
        <div class="relationship-video-placeholder" role="img" aria-label="Module 5.3 course video unavailable">
          <span class="relationship-video-placeholder-icon" aria-hidden="true">▶</span>
          <strong>MODULE 5.3 VIDEO NOT PROVIDED</strong>
          <span>The original course podcast was not found in the project assets</span>
        </div>
        <p class="relationship-course-note">No Module 5.3 video or project ZIP is present in the supplied project, so playback cannot be verified here. This placeholder is not course footage. Watch the original podcast outside the game, then confirm below to unlock the supplied four-question quiz.</p>
        ${progress.podcastCompleted
          ? '<div class="relationship-feedback is-success">COMMUNICATION SIGNAL RECEIVED – QUIZ UNLOCKED</div><div class="relationship-button-row"><button type="button" class="relationship-button primary" data-action="start-quiz">START QUIZ</button></div>'
          : '<div class="relationship-button-row"><button type="button" class="relationship-button primary" data-action="confirm-podcast-complete">I WATCHED THE ORIGINAL PODCAST — UNLOCK QUIZ</button></div>'}`);
      return;
    }

    if (box.id === 5) {
      const progress = this.state.boxes[5];
      this.show('podcast', `
        <p class="relationship-kicker">KNOWLEDGE BOX 05 • COURSE PODCAST</p>
        <h2>MODULE 5.5 – NURTURING</h2>
        <h3>Building Strong and Lasting Professional Relationships</h3>
        <p>Explore appreciation preferences, sincere apologies, small relationship check-ins and the long-term value of nurturing a genuine career network.</p>
        <div class="relationship-video-placeholder" role="img" aria-label="Module 5.5 course podcast placeholder">
          <span class="relationship-video-placeholder-icon" aria-hidden="true">▶</span>
          <strong>MODULE 5.5 PODCAST VIDEO NOT PROVIDED</strong>
          <span>The original Nurturing podcast is not included in the project assets</span>
        </div>
        <p class="relationship-course-note">This placeholder is not course footage. The game cannot track playback without the original video. Watch the original podcast outside the game, then confirm to unlock the exact four questions supplied for Module 5.5.</p>
        ${progress.outlineReviewed
          ? '<div class="relationship-feedback is-success">FINAL LEARNING TRANSMISSION RECEIVED – QUIZ UNLOCKED</div><div class="relationship-button-row"><button type="button" class="relationship-button primary" data-action="start-quiz">START QUIZ</button></div>'
          : '<div class="relationship-button-row"><button type="button" class="relationship-button primary" data-action="confirm-podcast-complete">I WATCHED THE ORIGINAL PODCAST — UNLOCK QUIZ</button></div>'}`);
      return;
    }

    const sourceNote = box.id === 4
      ? 'The project does not include the original Module 5.4 podcast video. The four quiz questions shown after your confirmation are the exact questions supplied in the Module 5.4 brief.'
      : 'The original podcast and expert-pointers file were not included. The temporary quiz below is based only on the supplied specification.';
    this.show('podcast', `
      <p class="relationship-kicker">KNOWLEDGE BOX ${String(box.id).padStart(2, '0')} • COURSE MEDIA</p>
      <h2>${this.escapeHtml(box.id === 4 ? 'Professional & Social Boundaries' : box.podcast)}</h2>
      <div class="relationship-placeholder">
        <strong>MODULE 5.4 PODCAST VIDEO NOT PROVIDED</strong>
        <p>This clickable knowledge-box station does not contain the original course video. No fake footage or unrelated media is shown.</p>
        <p>${this.escapeHtml(sourceNote)}</p>
      </div>
      <h3>Professional &amp; Social Boundaries</h3>
      <p>Learn to recognize serious warning signs, set respectful limits and address conflict without attacking someone’s character.</p>
      <h3>Course outline available in the supplied brief</h3>
      <ul>${box.outline.map(line => `<li>${this.escapeHtml(line)}</li>`).join('')}</ul>
      <div class="relationship-button-row">
        <button type="button" class="relationship-button primary" data-action="confirm-podcast-complete">I WATCHED THE ORIGINAL PODCAST — START QUIZ</button>
      </div>
      <p style="font-size:11px;opacity:.76">The game cannot verify playback because the original video is not present. Confirm only after watching the original podcast outside the game. Add the course video file to enable real playback tracking.</p>`);
  }

  formatSimulationTime(seconds) {
    const wholeSeconds = Math.max(0, Math.floor(seconds));
    return `0:${String(wholeSeconds).padStart(2, '0')}`;
  }

  stopPodcastSimulation() {
    if (this.podcastSimulationTimer !== null) {
      window.clearInterval(this.podcastSimulationTimer);
      this.podcastSimulationTimer = null;
    }
    this.card?.querySelector('.relationship-simulated-player')?.classList.remove('is-playing');
  }

  startPodcastSimulation(restart = false) {
    const progress = this.state.boxes[1];
    if (progress.podcastCompleted && !restart) return;
    this.stopPodcastSimulation();
    if (restart) {
      progress.podcastCompleted = false;
      progress.podcastProgressSeconds = 0;
    }
    const button = this.card.querySelector('[data-action="play-simulated-video"], [data-action="replay-simulated-video"], [data-action="pause-simulated-video"]');
    if (!button) return;
    this.card.querySelector('.relationship-simulated-player')?.classList.add('is-playing');
    button.dataset.action = 'pause-simulated-video';
    button.textContent = 'PAUSE SIMULATION';
    let lastSavedSecond = Math.floor(progress.podcastProgressSeconds);
    this.podcastSimulationTimer = window.setInterval(() => {
      progress.podcastProgressSeconds = Math.min(this.podcastSimulationDuration, progress.podcastProgressSeconds + 0.25);
      const progressBar = this.card.querySelector('.relationship-simulated-progress');
      const time = this.card.querySelector('.relationship-simulated-time');
      if (progressBar) progressBar.value = String(progress.podcastProgressSeconds);
      if (time) time.textContent = `${this.formatSimulationTime(progress.podcastProgressSeconds)} / ${this.formatSimulationTime(this.podcastSimulationDuration)}`;
      const currentSecond = Math.floor(progress.podcastProgressSeconds);
      if (currentSecond > lastSavedSecond) {
        lastSavedSecond = currentSecond;
        this.save();
      }
      if (progress.podcastProgressSeconds < this.podcastSimulationDuration) return;
      this.stopPodcastSimulation();
      progress.podcastCompleted = true;
      this.save();
      this.renderTracker();
      this.renderQuiz();
    }, 250);
  }

  renderQuiz() {
    const box = this.boxes.find(item => item.id === this.activeBoxId);
    const progress = this.state.boxes[this.activeBoxId];
    const podcastCompleted = box?.id === 1 || box?.id === 3 ? progress?.podcastCompleted : progress?.outlineReviewed;
    if (!box || !podcastCompleted) {
      if (box?.id === 1) this.renderPodcast();
      else if (box) this.renderPodcast();
      return;
    }
    if (progress.quizPassed) {
      this.renderClue(box);
      return;
    }
    if (box.id === 1 && progress.pendingQuizFeedback) {
      this.quizFeedback = progress.pendingQuizFeedback;
      this.renderQuizFeedback();
      return;
    }
    const question = box.quiz[progress.quizIndex];
    if (!question) {
      if (box.id === 1) {
        this.finishFirstQuiz();
        return;
      }
      if (box.id === 2) {
        this.finishSecondQuiz();
        return;
      }
      if (box.id === 3) {
        this.finishThirdQuiz();
        return;
      }
      if (box.id === 4) {
        this.finishFourthQuiz();
        return;
      }
      if (box.id === 5) {
        this.finishFifthQuiz();
        return;
      }
      progress.quizPassed = true;
      progress.completed = box.id !== 5 || this.state.log.submitted;
      this.save();
      this.renderTargets();
      this.renderTracker();
      this.renderClue(box);
      return;
    }
    const assessmentNote = box.id <= 5
      ? `Module 5.${box.id} course assessment • 4 questions • Pass with 3 out of 4`
      : 'Draft knowledge check based on the provided outline; original expert-pointers were not supplied.';
    const optionList = question.options
      ? question.options.map((text, index) => ({ key: String.fromCharCode(65 + index), text }))
      : [
          { key: 'correct', text: question.answer },
          ...question.wrong.map((text, index) => ({ key: `wrong-${index}`, text }))
        ].sort((a, b) => a.text.localeCompare(b.text));
    if (box.id <= 5 && progress.quizAttempts === 0) {
      progress.quizAttempts = 1;
      this.save();
    }
    this.show('quiz', `
      <p class="relationship-kicker">KNOWLEDGE BOX ${String(box.id).padStart(2, '0')} • ${box.id <= 5 ? 'COURSE QUIZ' : 'DRAFT KNOWLEDGE CHECK'}</p>
      <h2>${this.escapeHtml(box.title)}</h2>
      <p>${this.escapeHtml(assessmentNote)}</p>
      <div class="relationship-progress" aria-label="Quiz progress"><span style="width:${Math.round(((progress.quizIndex + 1) / box.quiz.length) * 100)}%"></span></div>
      <p><strong>Question ${progress.quizIndex + 1}/${box.quiz.length}:</strong> ${this.escapeHtml(question.question)}</p>
      ${this.feedback ? `<div class="relationship-feedback is-error" role="status">${this.escapeHtml(this.feedback)}</div>` : ''}
      <form data-form="quiz">
        <div class="relationship-form-grid">${optionList.map(option => `
          <label class="relationship-field" style="display:flex;grid-template-columns:20px 1fr;align-items:start;font-weight:500;">
            <span class="relationship-quiz-option"><input type="radio" name="quiz-answer" value="${this.escapeAttribute(option.key)}" ${progress.selectedQuizAnswer === option.key ? 'checked' : ''} required><span>${option.key === 'correct' ? '' : `<strong>${this.escapeHtml(option.key)}.</strong> `}${this.escapeHtml(option.text)}</span></span>
          </label>`).join('')}</div>
        <div class="relationship-button-row"><button class="relationship-button primary" type="submit">Submit Answer</button></div>
      </form>`);
  }

  submitQuiz() {
    const box = this.boxes.find(item => item.id === this.activeBoxId);
    const progress = this.state.boxes[this.activeBoxId];
    const question = box?.quiz[progress.quizIndex];
    const selected = this.card.querySelector('input[name="quiz-answer"]:checked');
    if (!question || !selected) {
      this.feedback = 'Select one answer before submitting.';
      this.renderQuiz();
      return;
    }
    const correct = question.options
      ? selected.value === String.fromCharCode(65 + question.options.indexOf(question.answer))
      : selected.value === 'correct';
    this.quizFeedback = { correct, explanation: question.explanation, answer: question.answer };
    progress.selectedQuizAnswer = selected.value;
    if (box.id === 1) {
      if (progress.pendingQuizFeedback) return this.renderQuizFeedback();
      progress.pendingQuizFeedback = this.quizFeedback;
    }
    if (correct) progress.quizCorrectCount += 1;
    this.save();
    this.renderQuizFeedback();
  }

  renderQuizFeedback() {
    const box = this.boxes.find(item => item.id === this.activeBoxId);
    const progress = this.state.boxes[this.activeBoxId];
    const question = box?.quiz[progress.quizIndex];
    if (!box || !question || !this.quizFeedback) return;
    const correct = this.quizFeedback.correct;
    const correctChoice = question.options
      ? String.fromCharCode(65 + question.options.indexOf(question.answer))
      : '';
    const feedbackActions = (box.id === 2 || box.id === 3 || box.id === 4 || box.id === 5) && !correct
      ? `<button type="button" class="relationship-button" data-action="retry-question">Try again</button>
         <button type="button" class="relationship-button primary" data-action="continue-incorrect">Continue without a point</button>`
      : `<button type="button" class="relationship-button primary" data-action="${box.id === 1 ? 'next-question' : correct ? 'next-question' : 'retry-question'}">${box.id === 1 ? (progress.quizIndex + 1 === box.quiz.length ? 'Finish Quiz' : 'Next Question') : correct ? (progress.quizIndex + 1 === box.quiz.length ? 'Finish quiz' : 'Next question') : 'Try again'}</button>`;
    this.show('quiz-feedback', `
      <p class="relationship-kicker">QUESTION ${progress.quizIndex + 1} FEEDBACK</p>
      <h2>${correct ? (box.id === 4 ? 'Correct — boundary restored' : 'Correct — signal aligned') : box.id === 1 ? 'Incorrect — review and continue' : 'Not quite — try again'}</h2>
      <div class="relationship-feedback ${correct ? 'is-success' : 'is-error'}">
        <p><strong>${correct ? 'Correct answer:' : 'Correct answer:'}</strong> ${correctChoice ? `${correctChoice}. ` : ''}${this.escapeHtml(this.quizFeedback.answer)}</p>
        <p>${this.escapeHtml(this.quizFeedback.explanation)}</p>
      </div>
      <div class="relationship-button-row">
        ${feedbackActions}
      </div>`);
  }

  advanceQuiz(allowIncorrect = false) {
    const box = this.boxes.find(item => item.id === this.activeBoxId);
    const progress = this.state.boxes[this.activeBoxId];
    if (!box || !this.quizFeedback || (box.id !== 1 && !this.quizFeedback.correct && !allowIncorrect)) return;
    progress.quizIndex += 1;
    this.quizFeedback = null;
    if (box.id === 1) {
      progress.pendingQuizFeedback = null;
      progress.selectedQuizAnswer = '';
    } else if (box.id === 2 || box.id === 3 || box.id === 4) {
      progress.selectedQuizAnswer = '';
    }
    this.save();
    if (progress.quizIndex < box.quiz.length) {
      this.renderQuiz();
      return;
    }
    if (box.id === 1) {
      this.finishFirstQuiz();
      return;
    }
    if (box.id === 2) {
      this.finishSecondQuiz();
      return;
    }
    if (box.id === 3) {
      this.finishThirdQuiz();
      return;
    }
    if (box.id === 4) {
      this.finishFourthQuiz();
      return;
    }
    if (box.id === 5) {
      this.finishFifthQuiz();
      return;
    }
    progress.quizPassed = true;
    progress.completed = box.id !== 5;
    this.save();
    this.renderTargets();
    this.renderTracker();
    this.renderClue(box);
  }

  finishFirstQuiz() {
    const progress = this.state.boxes[1];
    if (progress.quizCorrectCount < 3) {
      progress.quizPassed = false;
      progress.completed = false;
      this.save();
      this.show('quiz-failed', `
        <p class="relationship-kicker">MODULE 5.1 • QUIZ RESULTS</p>
        <h2>Score: ${progress.quizCorrectCount}/4 — Try Again</h2>
        <p>You need at least 3 correct answers to pass. Review the feedback, then retake all four questions.</p>
        <div class="relationship-button-row"><button type="button" class="relationship-button primary" data-action="retake-first-quiz">RETAKE QUIZ</button></div>`);
      return;
    }

    progress.quizPassed = true;
    progress.completed = true;
    progress.pendingQuizFeedback = null;
    progress.selectedQuizAnswer = '';
    this.save();
    if (window.gameState?.addItem && !window.gameState.hasItem('access_fragment_01')) {
      window.gameState.addItem({
        id: 'access_fragment_01',
        name: 'ACCESS FRAGMENT 01',
        icon: '🔹',
        desc: 'A restored emotional signal fragment. Find the Crew Network Panel to begin Module 5.2.',
        type: 'clue'
      });
    }
    window.soundEngine?.playSuccess();
    this.renderTargets();
    this.renderTracker();
    window.app?.updateHUD();
    this.show('first-box-complete', `
      <p class="relationship-kicker">MODULE 5.1 • FINAL SCORE ${progress.quizCorrectCount}/4</p>
      <div class="relationship-reveal relationship-emotion-reveal">
        <div class="relationship-emotion-light" aria-hidden="true"></div>
        <h2>EMOTIONAL SIGNAL RESTORED!</h2>
        <p>You have successfully completed the Emotional Intelligence module. You can now recognise emotional signals and respond thoughtfully instead of reacting automatically.</p>
        <h3>ACCESS FRAGMENT 01</h3>
        <p class="relationship-takeaway">${this.escapeHtml(this.boxes[0].takeaway)}</p>
        <p>Your emotional signals are now clear. Understanding yourself is the next step. Find the Crew Network Panel to restore the disconnected crew relationship patterns.</p>
        <p><strong>Next object:</strong> Crew Network Panel • Wall 2</p>
        <button type="button" class="relationship-button primary" data-action="close">CONTINUE</button>
      </div>`);
  }

  finishSecondQuiz() {
    const progress = this.state.boxes[2];
    if (progress.quizCorrectCount < 3) {
      progress.quizPassed = false;
      progress.completed = false;
      this.save();
      this.show('quiz-failed', `
        <p class="relationship-kicker">MODULE 5.2 • QUIZ RESULTS</p>
        <h2>Score: ${progress.quizCorrectCount}/4 — Try Again</h2>
        <p>You need at least 3 correct answers to pass. Review the feedback, then retake all four questions.</p>
        <div class="relationship-button-row"><button type="button" class="relationship-button primary" data-action="retake-second-quiz">RETAKE QUIZ</button></div>`);
      return;
    }

    progress.quizPassed = true;
    progress.completed = true;
    progress.selectedQuizAnswer = '';
    this.save();
    if (window.gameState?.addItem && !window.gameState.hasItem('access_fragment_02')) {
      window.gameState.addItem({
        id: 'access_fragment_02',
        name: 'ACCESS FRAGMENT 02',
        icon: '🔹',
        desc: 'A restored crew-network fragment. The Signal Repair Hub is the next module access point.',
        type: 'clue'
      });
    }
    window.soundEngine?.playSuccess();
    this.renderTargets();
    this.renderTracker();
    const panel = this.layer.querySelector('#relationship-chest-2');
    panel?.classList.add('relationship-network-activating');
    window.setTimeout(() => panel?.classList.remove('relationship-network-activating'), 2400);
    window.app?.updateHUD();
    this.show('second-box-complete', `
      <p class="relationship-kicker">MODULE 5.2 • FINAL SCORE ${progress.quizCorrectCount}/4 • ACCESS FRAGMENT 02</p>
      <div class="relationship-reveal relationship-emotion-reveal relationship-network-reveal">
        <div class="relationship-emotion-light" aria-hidden="true"></div>
        <h2>CREW NETWORK RESTORED!</h2>
        <p>You have successfully identified behavioural patterns and learned how self-awareness influences professional relationships.</p>
        <h3>ACCESS FRAGMENT 02</h3>
        <p class="relationship-takeaway">${this.escapeHtml(this.boxes[1].takeaway)}</p>
        <ul><li>Understand your attachment patterns.</li><li>Practise Stop-Reflect-Respond.</li><li>Communicate healthy professional boundaries.</li></ul>
        <p>${this.escapeHtml(this.boxes[1].clue)}</p>
        <p><strong>Next object:</strong> Atom-like Signal Repair Hub • Wall 2</p>
        <button type="button" class="relationship-button primary" data-action="close">CONTINUE</button>
      </div>`);
  }

  finishThirdQuiz() {
    const progress = this.state.boxes[3];
    if (progress.quizCorrectCount < 3) {
      progress.quizPassed = false;
      progress.completed = false;
      this.save();
      this.show('quiz-failed', `
        <p class="relationship-kicker">MODULE 5.3 • QUIZ RESULTS</p>
        <h2>Score: ${progress.quizCorrectCount}/4 — Try Again</h2>
        <p>You need at least 3 correct answers to pass. Review the feedback, then retake all four questions.</p>
        <div class="relationship-button-row"><button type="button" class="relationship-button primary" data-action="retake-third-quiz">RETAKE QUIZ</button></div>`);
      return;
    }

    progress.quizPassed = true;
    progress.completed = true;
    progress.selectedQuizAnswer = '';
    this.save();
    if (window.gameState?.addItem && !window.gameState.hasItem('access_fragment_03')) {
      window.gameState.addItem({
        id: 'access_fragment_03',
        name: 'ACCESS FRAGMENT 03 – SIGNAL KEY',
        icon: '🔹',
        desc: 'A restored communication signal fragment. The Crew Vital Monitor on Wall 3 is the next module access point.',
        type: 'clue'
      });
    }
    window.soundEngine?.playSuccess();
    this.renderTargets();
    this.renderTracker();
    this.layer.querySelector('#relationship-chest-3')?.classList.add('relationship-signal-activating');
    window.app?.updateHUD();
    this.show('third-box-complete', `
      <p class="relationship-kicker">MODULE 5.3 • FINAL SCORE ${progress.quizCorrectCount}/4 • ACCESS FRAGMENT 03</p>
      <div class="relationship-reveal relationship-emotion-reveal relationship-signal-reveal">
        <div class="relationship-emotion-light" aria-hidden="true"></div>
        <h2>SIGNAL PARTIALLY RESTORED!</h2>
        <p>You have successfully repaired the communication channel. You now understand how to listen actively, express yourself constructively and prevent misunderstandings.</p>
        <h3>ACCESS FRAGMENT 03 – SIGNAL KEY</h3>
        <p class="relationship-takeaway">Effective communication is not just about speaking. It is about listening carefully, expressing your feelings constructively and choosing the right communication channel.</p>
        <ul><li>Reflective Listening – Make others feel heard.</li><li>I-Statements – Express your feelings without blaming.</li><li>Digital Awareness – Understand the limitations of text messages.</li><li>Three-Message Rule – Switch to voice or face-to-face communication when text is not resolving the issue.</li></ul>
        <p>${this.escapeHtml(this.boxes[2].clue)}</p>
        <p><strong>Next destination:</strong> Crew Vital Monitor • Wall 3</p>
        <button type="button" class="relationship-button primary" data-action="close">CONTINUE</button>
      </div>`);
  }

  finishFourthQuiz() {
    const progress = this.state.boxes[4];
    if (progress.quizCorrectCount < 3) {
      progress.quizPassed = false;
      progress.completed = false;
      this.save();
      this.show('quiz-failed', `
        <p class="relationship-kicker">MODULE 5.4 • QUIZ RESULTS</p>
        <h2>Score: ${progress.quizCorrectCount}/4 — Try Again</h2>
        <p>You need at least 3 correct answers to pass. Review the feedback, then retake all four questions.</p>
        <div class="relationship-button-row"><button type="button" class="relationship-button primary" data-action="retake-fourth-quiz">RETAKE QUIZ</button></div>`);
      return;
    }

    progress.quizPassed = true;
    progress.completed = true;
    progress.selectedQuizAnswer = '';
    this.save();
    if (window.gameState?.addItem && !window.gameState.hasItem('access_fragment_04')) {
      window.gameState.addItem({
        id: 'access_fragment_04',
        name: 'ACCESS FRAGMENT 04 – TRUST KEY',
        icon: '🔹',
        desc: 'A restored boundary protocol fragment. The Central Trust Reactor on Wall 2 is the next module access point.',
        type: 'clue'
      });
    }
    window.soundEngine?.playSuccess();
    this.renderTargets();
    this.renderTracker();
    this.layer.querySelector('#relationship-chest-4')?.classList.add('relationship-monitor-activating');
    window.setTimeout(() => this.layer.querySelector('#relationship-chest-4')?.classList.remove('relationship-monitor-activating'), 2400);
    window.app?.updateHUD();
    this.show('fourth-box-complete', `
      <p class="relationship-kicker">MODULE 5.4 • FINAL SCORE ${progress.quizCorrectCount}/4 • ACCESS FRAGMENT 04</p>
      <div class="relationship-reveal relationship-emotion-reveal relationship-monitor-reveal">
        <div class="relationship-emotion-light" aria-hidden="true"></div>
        <h2>CREW BOUNDARY PROTOCOL RESTORED!</h2>
        <p>You have successfully identified unhealthy relationship patterns and learned how to establish professional boundaries while maintaining mutual respect.</p>
        <h3>ACCESS FRAGMENT 04 – TRUST KEY</h3>
        <p class="relationship-takeaway">${this.escapeHtml(this.boxes[3].takeaway)}</p>
        <ul>${this.boxes[3].outline.map(item => `<li>${this.escapeHtml(item)}</li>`).join('')}</ul>
        <p>${this.escapeHtml(this.boxes[3].clue)}</p>
        <p><strong>Next destination:</strong> Signal Repair Hub – Module 5.5 • Wall 3</p>
        <button type="button" class="relationship-button primary" data-action="close">CONTINUE</button>
      </div>`);
  }

  retakeFourthQuiz() {
    const progress = this.state.boxes[4];
    progress.quizIndex = 0;
    progress.quizCorrectCount = 0;
    progress.quizAttempts += 1;
    progress.selectedQuizAnswer = '';
    this.quizFeedback = null;
    this.save();
    this.renderQuiz();
  }

  finishFifthQuiz() {
    const progress = this.state.boxes[5];
    if (progress.quizCorrectCount < 3) {
      progress.quizPassed = false;
      progress.completed = false;
      this.save();
      this.show('quiz-failed', `
        <p class="relationship-kicker">MODULE 5.5 • QUIZ RESULTS</p>
        <h2>Score: ${progress.quizCorrectCount}/4 — Try Again</h2>
        <p>You need at least 3 correct answers to pass. Review the feedback, then retake all four questions.</p>
        <div class="relationship-button-row"><button type="button" class="relationship-button primary" data-action="retake-fifth-quiz">RETAKE QUIZ</button></div>`);
      return;
    }

    progress.quizPassed = true;
    progress.completed = false;
    progress.selectedQuizAnswer = '';
    this.save();
    this.renderTracker();
    this.renderClue(this.boxes[4]);
  }

  retakeFifthQuiz() {
    const progress = this.state.boxes[5];
    progress.quizIndex = 0;
    progress.quizCorrectCount = 0;
    progress.quizAttempts += 1;
    progress.selectedQuizAnswer = '';
    this.quizFeedback = null;
    this.save();
    this.renderQuiz();
  }

  retakeThirdQuiz() {
    const progress = this.state.boxes[3];
    progress.quizIndex = 0;
    progress.quizCorrectCount = 0;
    progress.quizAttempts += 1;
    progress.selectedQuizAnswer = '';
    this.quizFeedback = null;
    this.save();
    this.renderQuiz();
  }

  retakeFirstQuiz() {
    const progress = this.state.boxes[1];
    progress.quizIndex = 0;
    progress.quizCorrectCount = 0;
    progress.quizAttempts += 1;
    progress.selectedQuizAnswer = '';
    progress.pendingQuizFeedback = null;
    this.quizFeedback = null;
    this.save();
    this.renderQuiz();
  }

  retakeSecondQuiz() {
    const progress = this.state.boxes[2];
    progress.quizIndex = 0;
    progress.quizCorrectCount = 0;
    progress.quizAttempts += 1;
    progress.selectedQuizAnswer = '';
    this.quizFeedback = null;
    this.save();
    this.renderQuiz();
  }

  handleQuizSelection(event) {
    if (!event.target.matches('input[name="quiz-answer"]') || this.activeBoxId > 5) return;
    const progress = this.state.boxes[this.activeBoxId];
    progress.selectedQuizAnswer = event.target.value;
    this.feedback = '';
    this.card.querySelector('.relationship-feedback.is-error')?.remove();
    this.save();
  }

  renderClue(box) {
    if (box.id === 1) {
      this.show('first-box-complete', `
        <p class="relationship-kicker">MODULE 5.1 COMPLETE • ACCESS FRAGMENT 01</p>
        <h2>EMOTIONAL SIGNAL RESTORED!</h2>
        <p>You have successfully completed the Emotional Intelligence module. You can now recognise emotional signals and respond thoughtfully instead of reacting automatically.</p>
        <h3>ACCESS FRAGMENT 01</h3>
        <p class="relationship-takeaway">${this.escapeHtml(box.takeaway)}</p>
        <p>${this.escapeHtml(box.clue)}</p>
        <p><strong>Next object:</strong> Crew Network Panel • Wall 2</p>
        <div class="relationship-button-row"><button type="button" class="relationship-button primary" data-action="close">CONTINUE</button></div>`);
      return;
    }
    if (box.id === 2) {
      this.show('second-box-complete', `
        <p class="relationship-kicker">MODULE 5.2 COMPLETE • ACCESS FRAGMENT 02</p>
        <h2>CREW NETWORK RESTORED!</h2>
        <p>You have successfully identified behavioural patterns and learned how self-awareness influences professional relationships.</p>
        <h3>ACCESS FRAGMENT 02</h3>
        <p class="relationship-takeaway">${this.escapeHtml(box.takeaway)}</p>
        <ul><li>Understand your attachment patterns.</li><li>Practise Stop-Reflect-Respond.</li><li>Communicate healthy professional boundaries.</li></ul>
        <p>${this.escapeHtml(box.clue)}</p>
        <p><strong>Next destination:</strong> Atom-like Signal Repair Hub • Wall 2</p>
        <div class="relationship-button-row"><button type="button" class="relationship-button primary" data-action="close">CONTINUE</button></div>`);
      return;
    }
    if (box.id === 3) {
      this.show('third-box-complete', `
        <p class="relationship-kicker">MODULE 5.3 COMPLETE • ACCESS FRAGMENT 03</p>
        <h2>SIGNAL PARTIALLY RESTORED!</h2>
        <p>You have successfully repaired the communication channel. You now understand how to listen actively, express yourself constructively and prevent misunderstandings.</p>
        <h3>ACCESS FRAGMENT 03 – SIGNAL KEY</h3>
        <p class="relationship-takeaway">Effective communication is not just about speaking. It is about listening carefully, expressing your feelings constructively and choosing the right communication channel.</p>
        <ul><li>Reflective Listening – Make others feel heard.</li><li>I-Statements – Express your feelings without blaming.</li><li>Digital Awareness – Understand the limitations of text messages.</li><li>Three-Message Rule – Switch to voice or face-to-face communication when text is not resolving the issue.</li></ul>
        <p>${this.escapeHtml(box.clue)}</p>
        <p><strong>Next destination:</strong> Crew Vital Monitor • Wall 3</p>
        <div class="relationship-button-row"><button type="button" class="relationship-button primary" data-action="close">CONTINUE</button></div>`);
      return;
    }
    if (box.id === 4) {
      this.show('fourth-box-complete', `
        <p class="relationship-kicker">MODULE 5.4 COMPLETE • ACCESS FRAGMENT 04 – TRUST KEY</p>
        <div class="relationship-reveal relationship-emotion-reveal relationship-monitor-reveal">
          <div class="relationship-emotion-light" aria-hidden="true"></div>
          <h2>CREW BOUNDARY PROTOCOL RESTORED!</h2>
          <p>${this.escapeHtml(this.boxes[3].takeaway)}</p>
          <ul>${this.boxes[3].outline.map(item => `<li>${this.escapeHtml(item)}</li>`).join('')}</ul>
          <p>${this.escapeHtml(box.clue)}</p>
          <p><strong>Next destination:</strong> Signal Repair Hub – Module 5.5 • Wall 3</p>
          <div class="relationship-button-row"><button type="button" class="relationship-button primary" data-action="close">CONTINUE</button></div>
        </div>`);
      return;
    }
    if (box.id === 5) {
      this.show('final-quiz-complete', `
        <p class="relationship-kicker">KNOWLEDGE BOX 05 • QUIZ COMPLETE</p>
        <h2>Clue Unlocked!</h2>
        <p>${this.escapeHtml(box.clue || 'The final learning signal is aligned.')}</p>
        <p>Your last learning step is the <strong>Relationship Maintenance Log</strong>. Complete it before activating the Central Trust Reactor.</p>
        <div class="relationship-button-row"><button type="button" class="relationship-button primary" data-action="open-log">Continue to the Relationship Maintenance Log</button></div>`);
      return;
    }
    this.show('clue', `
      <p class="relationship-kicker">KNOWLEDGE BOX ${String(box.id).padStart(2, '0')} COMPLETE • NEXT OBJECT AVAILABLE</p>
      <h2>Clue Unlocked!</h2>
      <div class="relationship-reveal"><p>${this.escapeHtml(box.clue)}</p><p><strong>Next destination:</strong> ${this.escapeHtml(box.nextObject)} • Wall ${this.boxes[box.id].wall}</p></div>
      <p>The next access panel is now available in the room. Navigate to its wall and find it yourself.</p>
      <div class="relationship-button-row"><button type="button" class="relationship-button primary" data-action="close">Continue</button></div>`);
  }

  renderActivity() {
    const log = this.state.log;
    this.show('activity', `
      <p class="relationship-kicker">KNOWLEDGE BOX 05 • FINAL CREW RELATIONSHIP TASK</p>
      <h2>Your Relationship Maintenance Log</h2>
      <p>Relationships don’t stay healthy on their own; they need maintenance. Think of trust like a bank account. Small deposits every week help maintain strong connections.</p>
      <form data-form="log">
        <h3>Activity A — Identify Two People to Reconnect With</h3>
        <p>Think of two people in your professional circle or college formal group whom you haven’t spoken to in the last two weeks. Fictional names or placeholders are welcome.</p>
        <div class="relationship-form-grid">${log.names.map((name, index) => `
          <label class="relationship-field">Person ${index + 1}
            <input name="name-${index}" data-log-field="name" data-index="${index}" value="${this.escapeAttribute(name)}" placeholder="e.g. a fictional former project teammate" required>
          </label>`).join('')}</div>

        <h3>Activity B — The 5-Minute Trust Deposit</h3>
        <p>Write a one-sentence, low-pressure check-in message for one person on your Nurture List.</p>
        <label class="relationship-field">Your check-in message
          <textarea name="check-in" data-log-field="checkIn" required placeholder="Hey, saw your recent work and really liked it! Hope everything is going well. How have you been?">${this.escapeHtml(log.checkIn)}</textarea>
        </label>
        <div class="relationship-activity-result" aria-live="polite">${this.escapeHtml(this.evaluateCheckIn(log.checkIn))}</div>
        <div class="relationship-button-row">
          <button type="button" class="relationship-button primary" data-action="submit-trust-deposit">SUBMIT MESSAGE</button>
          ${log.trustDepositSubmitted ? '<span class="relationship-feedback is-success">TRUST DEPOSIT RECORDED!</span>' : ''}
        </div>

        <h3>Activity C — The Proper Apology</h3>
        <p>Think of a small mistake you made recently. Use a fictional situation if preferred and draft an apology with all four parts.</p>
        <div class="relationship-form-grid">
          ${['REGRET — I’m sorry for…', 'RESPONSIBILITY — I realize I messed up by…', 'RESTITUTION — How can I make this right?', 'PLAN FOR CHANGE — Next time, I will…'].map((label, index) => `
            <label class="relationship-field">${label}
              <textarea data-log-field="apology" data-index="${index}" required placeholder="${this.escapeAttribute(label)}">${this.escapeHtml(log.apologies[index] || '')}</textarea>
            </label>`).join('')}
        </div>
        <div class="relationship-button-row">
          <button type="button" class="relationship-button primary" data-action="submit-apology">SUBMIT APOLOGY</button>
          ${log.apologySubmitted ? '<span class="relationship-feedback is-success">RELATIONSHIP REPAIR COMPLETED!</span>' : ''}
        </div>
        ${log.submitted ? '<div class="relationship-feedback is-success">FINAL RELATIONSHIP MAINTENANCE LOG SAVED — REACTOR ACCESS UNLOCKED.</div>' : ''}
        ${this.logFeedback ? `<div class="relationship-feedback is-error" role="status">${this.escapeHtml(this.logFeedback)}</div>` : ''}
        <div class="relationship-button-row"><button type="button" class="relationship-button primary" data-action="complete-log">COMPLETE RELATIONSHIP MAINTENANCE LOG</button></div>
      </form>`);
  }

  evaluateCheckIn(text) {
    const value = String(text || '').trim();
    if (!value) return 'Check-in review: add a draft message to see the writing checklist.';
    const friendly = /\b(hi|hey|hello|hope|thanks|thank you|great|appreciate)\b/i.test(value);
    const relevant = /\b(post|project|week|work|update|exam|presentation|launch|meeting|saw|noticed)\b/i.test(value);
    const clear = value.length >= 25 && /[.!?]$/.test(value);
    const lowPressure = /\b(no rush|when you can|if you have time|hope|whenever works|if it suits)\b/i.test(value) && !/\b(asap|immediately|right now|urgent)\b/i.test(value);
    return `Writing checklist — Friendliness: ${friendly ? '✓' : 'add a warm greeting or appreciation'} · Relevance: ${relevant ? '✓' : 'mention a specific update or shared context'} · Clarity: ${clear ? '✓' : 'use a complete, clear sentence'} · Low-pressure tone: ${lowPressure ? '✓' : 'avoid urgency and make the reply optional'}.`;
  }

  handleLogInput(event) {
    const field = event.target.dataset.logField;
    if (!field) return;
    const index = Number(event.target.dataset.index);
    if (field === 'name' && Number.isInteger(index)) {
      this.state.log.names[index] = event.target.value;
      this.state.log.submitted = false;
      this.state.boxes[5].completed = false;
      this.logFeedback = null;
    }
    if (field === 'checkIn') {
      this.state.log.checkIn = event.target.value;
      this.state.log.trustDepositSubmitted = false;
      this.state.log.submitted = false;
      this.state.boxes[5].completed = false;
      this.logFeedback = null;
      const output = this.card.querySelector('.relationship-activity-result');
      if (output) output.textContent = this.evaluateCheckIn(event.target.value);
    }
    if (field === 'apology' && Number.isInteger(index)) {
      this.state.log.apologies[index] = event.target.value;
      this.state.log.apologySubmitted = false;
      this.state.log.submitted = false;
      this.state.boxes[5].completed = false;
      this.logFeedback = null;
    }
    if (field === 'appreciation') this.state.log.appreciation = event.target.value;
    if (field === 'reflection') this.state.log.reflection = event.target.value;
    this.save();
  }

  submitTrustDeposit() {
    const message = this.state.log.checkIn.trim();
    if (message.length < 25) {
      this.logFeedback = 'Write a complete, low-pressure check-in of at least 25 characters before submitting.';
      this.renderActivity();
      return;
    }
    this.state.log.trustDepositSubmitted = true;
    this.state.log.submitted = false;
    this.state.boxes[5].completed = false;
    this.logFeedback = null;
    this.save();
    this.renderActivity();
  }

  submitApology() {
    if (this.state.log.apologies.some(part => String(part || '').trim().length < 8)) {
      this.logFeedback = 'Complete all four apology parts with a meaningful response before submitting.';
      this.renderActivity();
      return;
    }
    this.state.log.apologySubmitted = true;
    this.state.log.submitted = false;
    this.state.boxes[5].completed = false;
    this.logFeedback = null;
    this.save();
    this.renderActivity();
  }

  submitLog() {
    const log = this.state.log;
    if (!this.state.boxes[5].quizPassed) {
      this.logFeedback = 'Pass the Module 5.5 quiz before completing the Relationship Maintenance Log.';
      this.renderActivity();
      return;
    }
    if (log.names.some(value => !String(value || '').trim()) || !log.trustDepositSubmitted || !log.apologySubmitted) {
      this.logFeedback = 'Add two Nurture List names, submit your Trust Deposit message, and submit all four apology parts before completing the log.';
      this.renderActivity();
      return;
    }
    log.submitted = true;
    this.state.boxes[5].completed = true;
    this.logFeedback = null;
    this.save();
    if (window.gameState?.addItem && !window.gameState.hasItem('access_fragment_05')) {
      window.gameState.addItem({
        id: 'access_fragment_05',
        name: 'ACCESS FRAGMENT 05 – NURTURING KEY',
        icon: '🔹',
        desc: 'The final relationship-maintenance key. Activate the Central Trust Reactor on Wall 2 to restore the station.',
        type: 'clue'
      });
    }
    this.renderTargets();
    this.renderTracker();
    window.app?.updateHUD();
    this.show('log-summary', `
      <p class="relationship-kicker">MODULE 5.5 COMPLETE • ACCESS FRAGMENT 05</p>
      <h2>YOUR FINAL CREW RELATIONSHIP TASK COMPLETE</h2>
      <p>Your entries are saved in this browser. Fictional names and examples are welcome; the log stays editable.</p>
      <div class="relationship-summary"><h3>Nurture list</h3><ul>${log.names.map(name => `<li>${this.escapeHtml(name)}</li>`).join('')}</ul>
        <h3>TRUST DEPOSIT RECORDED!</h3><p>${this.escapeHtml(log.checkIn)}</p>
        <h3>RELATIONSHIP REPAIR COMPLETED!</h3>
        <h3>Proper Apology</h3><ol>${log.apologies.map(part => `<li>${this.escapeHtml(part)}</li>`).join('')}</ol>
      </div>
      <div class="relationship-button-row">
        <button type="button" class="relationship-button primary" data-action="close">ACTIVATE THE CENTRAL TRUST REACTOR ON WALL 2</button>
      </div>`);
  }

  activateReactor() {
    if (!this.state.log.submitted || !Object.values(this.state.boxes).every(box => box.completed)) {
      window.app?.showToast('Complete all five Knowledge Boxes and the Relationship Maintenance Log before activating the Central Trust Reactor.', 'warning');
      return;
    }
    this.state.reactorActivated = true;
    this.state.networkRestored = true;
    this.save();
    this.renderTargets();
    this.renderTracker();
    const reactor = this.layer.querySelector('#relationship-reactor');
    reactor?.classList.add('relationship-reactor-activating');
    window.setTimeout(() => reactor?.classList.remove('relationship-reactor-activating'), 3300);
    window.soundEngine?.playWhoosh();
    window.soundEngine?.playSuccess();
    window.app?.updateHUD();
    this.show('reactor', `
      <p class="relationship-kicker">CENTRAL TRUST REACTOR • FINAL TRANSMISSION</p>
      <h2>MISSION ACCOMPLISHED – SIGNAL RESTORED!</h2>
      <div class="relationship-reveal relationship-final-signal-reveal">
        <p>Congratulations, crew member!</p>
        <p>You have successfully restored the station’s communication network. Through emotional awareness, self-awareness, effective communication, professional boundaries and relationship nurturing, you have rebuilt the foundation of a strong and connected crew.</p>
        <p>Remember: strong relationships are not built in one moment. They are maintained through consistent care, trust, appreciation and respect.</p>
        <p><strong>Crew transmission:</strong> “Attention, crew member! Communication network restored. All crew connections are online. Trust protocols are active. The station is fully operational. Excellent work!”</p>
      </div>
      <div class="relationship-button-row"><button type="button" class="relationship-button primary" data-action="navigate-vault">MISSION PROGRESS 5/5 – GO TO CREW SECURITY VAULT</button></div>`);
  }

  openAirlock() {
    if (!this.state.networkRestored || !Object.values(this.state.boxes).every(box => box.completed) || !this.state.log.submitted) {
      window.app?.showToast('The airlock requires all five Knowledge Boxes, the Relationship Maintenance Log, and the restored reactor network.', 'warning');
      return;
    }
    this.state.complete = true;
    this.save();
    this.renderTracker();
    this.show('complete', `
      <p class="relationship-kicker">MISSION COMPLETE • ALL FIVE KNOWLEDGE BOXES</p>
      <h2>MISSION COMPLETE – EMERGENCY AIRLOCK OPEN</h2>
      <div class="relationship-reveal relationship-final-signal-reveal"><p>The communication network is restored. You completed all five learning journeys and the Relationship Maintenance Log.</p><p>Strong relationships are maintained through consistent care, trust, appreciation and respect.</p></div>
      <div class="relationship-button-row"><button type="button" class="relationship-button primary" data-action="close">Return to the room</button></div>`);
  }

  handleClick(event) {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const action = button.dataset.action;
    if (action !== 'move-order') event.preventDefault();
    switch (action) {
      case 'close':
        this.closeDialog();
        break;
      case 'inspect':
        this.inspectBox(Number(button.dataset.boxId));
        break;
      case 'open-box':
        this.openBox(Number(button.dataset.boxId));
        break;
      case 'start-puzzle':
        this.startPuzzle();
        break;
      case 'open-revealed-box':
        this.openBox(Number(button.dataset.boxId || 1));
        break;
      case 'start-quiz':
        this.feedback = '';
        this.renderQuiz();
        break;
      case 'play-simulated-video':
        this.startPodcastSimulation();
        break;
      case 'pause-simulated-video':
        this.stopPodcastSimulation();
        button.dataset.action = 'play-simulated-video';
        button.textContent = 'RESUME SIMULATION';
        this.save();
        break;
      case 'replay-simulated-video':
        this.startPodcastSimulation(true);
        break;
      case 'retake-first-quiz':
        this.retakeFirstQuiz();
        break;
      case 'retake-second-quiz':
        this.retakeSecondQuiz();
        break;
      case 'retake-third-quiz':
        this.retakeThirdQuiz();
        break;
      case 'retake-fourth-quiz':
        this.retakeFourthQuiz();
        break;
      case 'retake-fifth-quiz':
        this.retakeFifthQuiz();
        break;
      case 'move-order':
        this.moveOrder(Number(button.dataset.index), Number(button.dataset.direction));
        break;
      case 'confirm-podcast-complete': {
        const progress = this.state.boxes[this.activeBoxId];
        if (this.activeBoxId === 3) progress.podcastCompleted = true;
        else progress.outlineReviewed = true;
        this.save();
        this.renderTracker();
        if (this.activeBoxId === 3) this.renderPodcast();
        else if (this.activeBoxId === 5) this.renderPodcast();
        else this.renderQuiz();
        break;
      }
      case 'next-question':
        this.advanceQuiz();
        break;
      case 'continue-incorrect':
        this.advanceQuiz(true);
        break;
      case 'retry-question':
        this.quizFeedback = null;
        this.renderQuiz();
        break;
      case 'open-log':
        this.renderActivity();
        break;
      case 'edit-log':
        this.renderActivity();
        break;
      case 'submit-trust-deposit':
        this.submitTrustDeposit();
        break;
      case 'submit-apology':
        this.submitApology();
        break;
      case 'complete-log':
        this.submitLog();
        break;
      case 'navigate-airlock':
        this.closeDialog();
        window.vintageRoomEngine?.setWall(1);
        break;
      case 'navigate-vault':
        this.closeDialog();
        window.vintageRoomEngine?.setWall(4);
        break;
      case 'reactor':
        this.activateReactor();
        break;
      case 'airlock':
        this.openAirlock();
        break;
      case 'vault':
        this.inspectVault();
        break;
      case 'enter-lobby':
        this.enterLobby();
        break;
      case 'lobby-turn':
        this.rotateLobby(Number(button.dataset.direction));
        break;
      case 'lobby-interact': {
        const status = this.layer.querySelector('#relationship-lobby-interaction-status');
        if (status) status.textContent = button.dataset.message;
        window.soundEngine?.playClick();
        break;
      }
    }
  }

  moveOrder(index, direction) {
    const box = this.boxes.find(item => item.id === this.activeBoxId);
    const progress = this.state.boxes[this.activeBoxId];
    const puzzle = box?.puzzle[progress.puzzleStep];
    if (!puzzle || puzzle.type !== 'order') return;
    const key = `${box.id}-${progress.puzzleStep}`;
    const order = this.puzzleOrders[key] || [...puzzle.items];
    const target = index + direction;
    if (index < 0 || target < 0 || index >= order.length || target >= order.length) return;
    [order[index], order[target]] = [order[target], order[index]];
    this.puzzleOrders[key] = order;
    this.renderPuzzle();
  }

  handleSubmit(event) {
    const form = event.target.closest('form[data-form]');
    if (!form) return;
    event.preventDefault();
    if (form.dataset.form === 'puzzle') this.validatePuzzle();
    if (form.dataset.form === 'quiz') this.submitQuiz();
    if (form.dataset.form === 'log') this.submitLog();
  }

  escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, character => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[character]);
  }

  escapeAttribute(value) {
    return this.escapeHtml(value).replace(/`/g, '&#96;');
  }
}

window.relationshipJourney = new RelationshipJourney();
