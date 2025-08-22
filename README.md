# 🎮 Tetris Classic (Web Version)

A modern, responsive **Tetris clone** built with **HTML, CSS, and JavaScript**.  
Designed to run directly in the browser with full support for **desktop keyboard controls** and **mobile touch controls** (buttons, swipes, and touch-only mode).  

👉 **Play it here:** [Tetris Classic Online](https://mariam-elbishbeashy.github.io/Tetris-Game/)

---

## 🚀 Features
- Classic **Tetris gameplay** (line clears, scoring, increasing difficulty).  
- **Responsive design** that works on desktop, tablet, and mobile.  
- **Keyboard controls** for desktop.  
- **Touch controls** for mobile:
  - On-screen buttons for left, right, rotate, and drop.
  - Swipe gestures (left/right/down) for smooth control.
  - Tap / double tap for rotation (in touch-only mode).  
- **Customizable settings**:
  - Adjust **Game Speed** (affects block falling speed).
  - Adjust **Move Speed** (controls left/right button repeat speed).
  - Toggle **Touch-Only Mode** (hide on-screen buttons).
  - Reset your **High Score**.  
- **High Score saving** via `localStorage`.  
- **Game Over screen** with replay option.  
- **Loading screen with tips** for better UX.  
- Retro sound effects for moves, line clears, level-ups, and game over.  

---

## 🕹️ Controls

### Desktop (Keyboard)
- **← / →**: Move piece left / right  
- **↑**: Rotate piece  
- **↓**: Soft drop (move down faster)  

### Mobile (Touch)
- **On-screen buttons**:
  - ← : Move left  
  - → : Move right  
  - ↻ : Rotate piece  
  - ↓ : Soft drop  
- **Gestures**:
  - Swipe left/right: Move piece  
  - Swipe down: Drop piece faster  
  - (Touch-only mode) Double tap: Rotate  

---

## ⚙️ Settings
Accessible from the **Settings page**:
- **High Score** – view your best score.  
- **Reset Progress** – clear high score.  
- **Game Speed** – adjust difficulty (falling speed).  
- **Move Speed** – adjust how quickly left/right buttons repeat.  
- **Touch Only Mode** – hide on-screen controls and use gestures only.  

All settings are saved in **localStorage** and persist across sessions.  

---

## 📱 Tips for Mobile
- If controls feel too sensitive, adjust **Move Speed** in Settings.  
- Enable **Touch-Only Mode** if you prefer to use gestures instead of buttons.  
- Use double tap for rotation in touch-only mode.  

---

## 🏆 Scoring
- **Soft drop** (↓): +1 per cell  
- **Line clear**: +1000 per row  
- **Extra points**: For higher difficulty levels as speed increases.  

---

## 🛠️ Built With
- **HTML5 Canvas** for rendering.  
- **JavaScript (ES6)** for game logic.  
- **CSS3** for styling and responsive layout.  
- **LocalStorage** for saving scores and settings.  

---

## 📜 License
This project is open-source and free to use for personal and educational purposes.  



