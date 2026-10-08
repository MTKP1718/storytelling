# 🌟 Story Teacher — Enchanted School Concept Fairy Tales

**Story Teacher** is a production-ready, fully responsive web and mobile application designed for children aged 6–12, parents, and educators. It transforms standard school curriculum concepts (math, science, physics, history, and reading) into rich, interactive fairy tales, assesses comprehension through story-immersed mini-games, and delivers actionable diagnostic insights to parents and teachers.

---

## 🎨 Visual & Art Direction
- **Aesthetic**: Warm golden hour illumination spilling from arched windows, enchanted hollow-tree doorways with glowing mushrooms, and twilight bedrooms with magical illuminated books casting soft glows.
- **Characters**: Whimsical Pixar/Disney-inspired animated characters with continuous breathing animations and automatic eyelid blinking keyframes.
- **Color Palette**:
  - Deep Midnight Navy: `#101426`, `#1B1F38`, `#242A4A`
  - Magic Violet: `#5B42F3`, `#7E69FF`
  - Starlight Gold: `#FFD166`, `#FFB703`
  - Forest Moss Green: `#2EC4B6`
  - Warm Amber / Peach: `#FF9F68`
  - Warm Parchment: `#FFFDF7`, `#FBF6E9`
- **Typography**:
  - Headings: *Cinzel* & *Playfair Display*
  - Body: *Nunito* & *Quicksand* (dyslexia-friendly with font-size controls A, A+, A++)

---

## 🚀 Key Features

### 1. Enchanting Hero Landing & Onboarding
- Twilight storybook cover titled *"Once Upon a Concept..."* with ambient golden rays and drifting fireflies.
- **Adventurer Customization**:
  - Child's Name input.
  - Avatar picker featuring 6 animated characters:
    - 👦 **Leo** — The Brave Explorer
    - 👧 **Maya** — The Star Weaver
    - 🧙‍♂️ **Pip** — The Apprentice Wizard
    - 🦊 **Barnaby** — The Clever Fox Guide
    - 🦉 **Orion** — The Starlight Owl
    - 🧚 **Celeste** — The Forest Sprite
  - Quick Age selection pills (Ages 6 to 12) with real-time level tier badge.
- **"Open the Magic Book"** with a smooth 3D opening transition.

### 2. Story Creation Flow
- **School Topics**:
  - One-click presets: *Fractions & Equal Parts*, *Photosynthesis & Solar Plants*, *Gravity & The Invisible Pull*, *The Water Cycle & Weather*, *Addition with Regrouping*, *Ancient Pyramids*.
  - Free-text input to enter **any custom concept** (e.g. *Long Division, Volcanoes, Mitosis, Roman History*).
- **4 Enchanting Worlds / Themes**:
  1. 🌳 *The Enchanted Tree Kingdom*
  2. 🚀 *Cosmic Starlight Quest*
  3. 🔍 *Detective Mystery Guild*
  4. 🌊 *Ocean Whispers*
- **Dynamic Age Adaptation**:
  - **Ages 6–8**: 250–350 words, concrete actions, simple phonics, rich imagery.
  - **Ages 9–10**: 400–550 words, cause-and-effect reasoning, natural introduction of core terms.
  - **Ages 11–12**: 600–750 words, narrative tension, dilemma deduction.
- **AI Engine & Offline Database**:
  - 4 built-in pre-crafted illustrated fairy tales (100% offline, zero setup required).
  - Procedural story synthesizer that creates dynamic tales for any typed topic.
  - Optional Google Gemini API integration for custom AI-powered tale generation.

### 3. Interactive Reading Experience
- Segmented chapters (3 readable cards with illustrated vignettes).
- **Interactive Concept Popups**: Tap any glowing gold keyword to open a child-friendly definition modal with pronunciation phonics, real-world analogies, and audio speech pronunciation.
- **Web Speech API ("Read to Me")**: Warm, paced voice narration with real-time word boundary highlighting and play/pause/replay controls.
- Living canvas particle background matching the active theme (fireflies, starlight, falling leaves, or bubbles).

### 4. "Word Magic" Vocabulary Scramble Mini-Game
- The magical words from the tale scatter into sparkling letter tiles.
- Interactive drag-and-drop or tap-to-slot letter tiles with tactile wooden sounds (`sound.playTilePlace()`).
- Animal guide (Barnaby/Orion) provides in-character riddle clues.
- Sparkle confetti burst (`canvas-confetti`) upon solving each word.
- Magic hint button and reset rack controls.

### 5. "Did the Magic Work?" Concept Assessment
- 3–4 story-immersed scenario questions (never a dry test!).
- Interactive visual choices (e.g. 4-slice visual pie fractions, balance scales, science lab beakers).
- **Supportive Hints**: Selecting a wrong answer provides a gentle, encouraging whisper recalling story events rather than saying "Incorrect".
- Audio feedback synthesized via Web Audio API.

### 6. Reward & Badge Celebration Ceremony
- 3D tilted gold foil medal showcase.
- Star rating calculation (3 to 5 stars) + celebratory fanfare audio + confetti shower.
- Actions: Save to Quest Journal, embark on another quest, or print official diploma.

### 7. Parent & Teacher Insights Dashboard (Gate-Protected)
- Protected by adult verification math challenge (`8 × 7 = 56`) or 4-digit PIN (default: `1234`).
- **Comprehensive Analytics**: Stories completed, vocabulary mastered, average star rating, engagement.
- **Skill Diagnosis**:
  - ✅ *Mastered Concepts* (e.g. "Divides wholes into equal fractional parts with visual models").
  - 💡 *Needs Practice / Growth Areas* with actionable home activity ideas.
- **Conversation Starter Prompts**: 2 suggested real-world dinner/classroom questions per completed story.
- **Printable / Exportable Certificate**: Formatted parchment *"Certificate of Bravery & Wisdom"* with official seal of Arboria, custom name, topic, stars, signature line, and one-click PDF print styling (`@media print`).

---

## 🛠️ Tech Stack
- **Framework**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4, Custom CSS Keyframes & Gradients
- **Icons**: Lucide React
- **Animations & Effects**: Canvas Confetti, HTML5 Canvas Particle Engine, CSS 3D Transforms
- **Audio**: Web Audio API Sound Synthesizer (zero external audio file dependencies), Web Speech API (`SpeechSynthesis`)
- **Storage**: Browser LocalStorage persistence

---

## 🏃 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build production bundle
npm run build

# Preview production build
npm run preview
```
