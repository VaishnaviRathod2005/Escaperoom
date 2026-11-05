# 🗝️ ESCAPE ROOM: The Entrepreneur's Journey

**Web-Based 4-Wall Interactive Escape Room Game**  
*deAsra inspireLIFE • Interactive Adventure & Gamified Learning*

---

## 🛰️ Relationship Skills Journey

The default game launches the spaceship relationship-skills journey across the four supplied wall images:

1. **Wall 1 — Emergency Airlock**
2. **Wall 2 — Central Trust Reactor, Crew Network, and Module 5.3 Signal Repair Hub**
3. **Wall 3 — Crew Vital Monitor, Crew Decision Console, and final Signal Repair Hub**
4. **Wall 4 — Crew Security Vault**

Knowledge Box 01 uses the metallic storage crate already shown on Wall 1. Knowledge Box 02 uses the Crew Network hologram on the left of Wall 2, and Knowledge Box 03 uses the Signal Repair Hub on the right of Wall 2. Knowledge Box 04 overlays the Crew Vital Monitor on the left of Wall 3; it is clickable as a locked placeholder and unlocks after Modules 5.1–5.3 are complete. After Module 5.4, final Module 5.5 uses the Signal Repair Hub on the right of Wall 3. Each box requires its environmental puzzle before the Knowledge Box is revealed, followed by the course-media step and knowledge check. Box 05 also includes the Relationship Maintenance Log. The existing Crew Security Vault on Wall 4 stays locked until all five modules and the Central Trust Reactor are complete; the existing door animates open to reveal a new in-world Crew Lobby behind it. Players enter the lobby and can explore its views with the same left/right arrows, A/D keys, or swipe navigation.

Knowledge Boxes 01, 02, and 03 can be started independently from Walls 1 and 2; Knowledge Box 04 requires all three to be complete, and Knowledge Box 05 unlocks after Box 04 on the Signal Repair Hub on Wall 3. The final Hub remains visibly clickable while locked and lists any incomplete prerequisites. After the reactor activates at 5/5, click the Crew Security Vault on Wall 4, wait for the locks and door animation, then select **ENTER LOBBY**. The bright Crew Lobby includes a mission summary, interactive communication/info/lounge controls, and four navigable camera views. Wall hotspots refresh when you switch scenes. Journey progress, vault status, and lobby access are saved in this browser.

### Course media availability

The project does not currently include the original Module 5.1–5.5 podcast videos. Module 5.1 uses a clearly labelled 12-second video simulation; completing it opens its four supplied course questions. Modules 5.2–5.5 clearly label missing podcasts and require an external-watch confirmation before quiz access; the game does not pretend to verify unavailable playback. Modules 5.4 and 5.5 use the exact four questions in their supplied briefs. Their quizzes can be retaken if the score is below 3/4. Other quizzes are clearly labelled drafts where original assessments were not provided. The game does not substitute unrelated videos.

---

## 🚀 How to Open and Run in VS Code

### Step 1: Open Folder in VS Code
1. Open **VS Code**.
2. Click **File** > **Open Folder...**
3. Select this directory:
   ```
   C:\Users\hp\.gemini\antigravity\scratch\escape-room-entrepreneur
   ```

### Step 2: Run the Web App
#### Option A: VS Code Live Server (Recommended)
1. Install the **Live Server** extension (by Ritwick Dey) from the VS Code Extensions tab (`Ctrl+Shift+X`).
2. Right-click on [`index.html`](file:///C:/Users/hp/.gemini/antigravity/scratch/escape-room-entrepreneur/index.html) in the file explorer.
3. Click **"Open with Live Server"**.
4. The escape room game will launch in your browser at `http://127.0.0.1:5500`.

#### Option B: Direct Browser Launch
- Double click [`index.html`](file:///C:/Users/hp/.gemini/antigravity/scratch/escape-room-entrepreneur/index.html) directly in Windows File Explorer or open it in Google Chrome / Edge.

#### Option C: Terminal Serve Command
Open the terminal in VS Code (`Ctrl+` `~`) and run:
```bash
npx -y serve .
```

---

## 🎮 Controls & Navigation

- **Rotate Left**: Click `[❮ LEFT WALL]` disc, press `←` (Left Arrow), or press `A`.
- **Rotate Right**: Click `[❯ RIGHT WALL]` disc, press `→` (Right Arrow), or press `D`.
- **Direct Wall Jump**: Click any of the 4 indicator dots at the bottom center.
- **Interact / Inspect**: Click any glowing item, door, clock, desk frame, drawer, book, or canvas.
- **Satchel Inventory**: Click the `🎒 SATCHEL` button in the bottom HUD.
- **Mentor Hints**: Click `💡 HINT` to get guidance from Professor Vance.
- **Print Certificate**: Click `📜 CERTIFICATE` to download/print your official deAsra inspireLIFE Certificate.
