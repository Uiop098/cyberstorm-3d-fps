# CYBERSTORM: PROTOCOL 0

A high-performance, self-contained 3D Sci-Fi First-Person (FPP) & Third-Person (TPP) Shooter built with HTML5, CSS3, Three.js (WebGL), and Web Audio API.

![CYBERSTORM Gameplay](https://img.shields.io/badge/Platform-Web%20%7C%20Mobile%20%7C%20Desktop-cyan)
![License](https://img.shields.io/badge/License-MIT-green)
![Three.js](https://img.shields.io/badge/3D%20Engine-Three.js%20r128-blue)
![Audio](https://img.shields.io/badge/Audio-Web%20Audio%20API-orange)

---

## ⚡ Features

### 🎮 Dual Camera Perspectives (FPP / TPP)
- **First-Person Perspective (FPP):** Responsive weapon viewmodels with recoil spring kickback, walk bobbing, and dynamic muzzle flash lights.
- **Third-Person Perspective (TPP):** Full 3D cyborg character mesh (glowing visor, chest reactor core, dual jetpack with particle exhaust, animated walking limbs, and pitch-aimed weapon arm) with over-the-shoulder follow camera and wall-collision raycast anti-clipping.
- **Toggle seamlessly:** Press `V` on desktop or tap the `POV` button on mobile.

### 🎯 Combat Mechanics & 50% Smart Aim Assist
- **Smart Aim Assist:** 24° viewcone scan with magnetic reticle lock-on that smoothly blends camera yaw and pitch toward hostile hitboxes (default 50% strength, configurable in Settings).
- **3-Way Fire Mode Selector ("Fun Switch"):** Toggle between Full-Auto, 3-Round Burst, and Semi-Auto via `B` or mobile `MODE` button with mechanical click feedback.
- **Consumable Nano-Stim Recovery:** Carry up to 3 nano-stims (+40 HP heal over 1.2s with heal flare and pneumatic hiss SFX, activated via `H` / `Q` or the `STIM` button).
- **4 Distinct Weapons:**
  1. *Plasma Carbine V4:* High-frequency automatic raycast rifle with cyan tracers.
  2. *Scattergun ST-8:* 6-pellet high-impact spread blast with amber tracers.
  3. *Hyper-Railgun X:* Instant piercing beam with multi-target penetration.
  4. *Void Rocket Launcher:* 3D moving projectile with area-of-effect splash damage.

### 👾 Enemy Archetypes & Apex Boss Encounter
- **Drone Scout:** Flying hover craft firing laser bolts.
- **Bruiser Heavy:** Heavily armored close-range charger.
- **Swarm Leaper:** Fast low-profile swarming crawler.
- **Phantom Sniper:** Teleporting marksman.
- **Cyber Titan Mech-X (Boss):** Multi-phase apex encounter with alternating shoulder cannons, rocket salvos, and dedicated top-center health bar.

### 🎵 Procedural Web Audio Synthesizer
- Dynamic cyberpunk background soundtrack (ambient exploration pads and 16th-note driving basslines and percussion during combat waves).
- Zero external audio files required — 100% synthesized in real time.
- Haptic vibration feedback (`navigator.vibrate`) on mobile devices.

### ⚙️ System Settings & Persistence
- Difficulty Presets: Recruit (Easy), Soldier (Medium), Veteran (Hard), Nightmare (Ultra).
- Sliders for FOV (60°–105°), Horizontal/Vertical Look Sensitivity, Aim Assist Strength, Music Volume, and SFX Volume.
- 4 Reticle Styles (Crosshair, Ring, Tactical Dot, Cyber Hexagon) and 5 Neon Colors.
- Touch controls scale and opacity adjustments.
- High Score and settings persisted in `localStorage`.

---

## 🚀 How to Run

Simply open `index.html` in any modern web browser on Desktop or Mobile (Chrome, Firefox, Safari, Edge):

```bash
# Clone the repository
git clone https://github.com/Uiop098/cyberstorm-3d-fps.git

# Open index.html directly or serve with any static web server:
npx serve .
# or
python3 -m http.server 8080
```

---

## 🕹️ Controls

| Action | Desktop | Mobile / Touch |
|---|---|---|
| **Move / Strafe** | `W` `A` `S` `D` | Left Virtual Joystick |
| **Look / Aim** | Mouse | Right Screen Drag |
| **Fire** | Left Click | `FIRE` Action Button |
| **Perspective (FPP/TPP)** | `V` | `POV` Button |
| **Nano-Stim Medkit** | `H` / `Q` | `STIM` Button |
| **Fire Mode Switch** | `B` | `MODE` Button |
| **Dash / Sprint** | `Shift` | `DASH` Button |
| **Jump / Thruster** | `Space` | `JUMP` Button |
| **Reload** | `R` | `R` Button |
| **Switch Weapon** | `1` `2` `3` `4` / Scroll Wheel | `◄` `►` Buttons |
| **Pause / Menu** | `Esc` / `P` | `PAUSE` Button |

---

## 📜 License

MIT License. Created by Nous Research / Hermes Agent for Uiop098.
