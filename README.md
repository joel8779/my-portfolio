# Cinematic Engineering Portfolio

> **Interactive 3D Exhibit Developer Website** — Procedural WebGL mechanics, Framer Motion scroll bindings, and spatial sound design.

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-teal?style=flat-square&logo=vercel)](https://my-portfolio-ten-green-65.vercel.app/)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js_15-black?style=flat-square&logo=nextdotjs)](https://nextjs.org/)
[![React](https://img.shields.io/badge/UI-React_19-blue?style=flat-square&logo=react)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Graphics-Three.js-orange?style=flat-square&logo=three-dot-js)](https://threejs.org/)
[![Animations](https://img.shields.io/badge/Animations-Framer_Motion-purple?style=flat-square)](https://www.framer.com/motion/)
[![Sound](https://img.shields.io/badge/Audio-Howler.js-red?style=flat-square)](https://howlerjs.com/)

---

## 📌 Overview

This is an interactive developer portfolio designed as a 3D cinematic museum exhibit. It features a custom procedural robot model rendered in a WebGL canvas, responding dynamically to scroll interactions and viewport changes with responsive mechanical clicks and hydraulic hums.

---

## ⚡ Live Deployments

*   **Production URL**: [https://my-portfolio-ten-green-65.vercel.app/](https://my-portfolio-ten-green-65.vercel.app/)

---

## ✨ Features

*   **Cinematic Audio Boot Sequence**: Automatically binds and unlocks the Web Audio API context on the first user interaction (`pointerdown`, `keydown`, etc.), playing an initialization startup sound exactly once per session.
*   **Procedural 3D Robot Exhibit**: Constructed in a WebGL canvas using `@react-three/fiber` mesh primitives. Responds to page scroll by translating position, rotating, scaling, and triggering spatial audio cues.
*   **Audio Controller**: Custom global Audio Provider with session persistence (`localStorage`) allowing users to mute or toggle interface sound design.
*   **Dynamic Repository Archive**: Integrates a client-side proxy route fetching active repository metrics directly from the GitHub GraphQL API with caching controls.
*   **Sleek Custom Typography**: Modern dark-mode layout built using custom utility variables, Framer Motion transitions, and fully responsive CSS layouts.

---

## 🏗️ Technical Architecture & Design Decisions

### 1. Zero-Asset Procedural 3D Modeling (R3F)
*   **Problem**: Importing external `.gltf` or `.obj` assets from modeling tools like Blender often introduces `20MB - 50MB` file download footprints, stalling PageSpeed loads.
*   **Solution**: The **HeroicMech** robot is modeled procedurally directly in React using native Three.js box geometries (`boxGeometry`) and custom physical materials (`meshPhysicalMaterial`). By fine-tuning clearcoat, roughness, metalness, and environment map parameters, the project achieves high-fidelity metallic lighting with a **zero-asset download footprint**.

### 2. Scroll-to-Model Interpolation Loop
*   **Problem**: Direct bindings between scrolling events (`scrollYProgress`) and WebGL camera vectors can cause jittery frame rates (stuttering) under different scroll speeds.
*   **Solution**: Integrated Three.js `MathUtils.damp` within the React Three Fiber `useFrame` render loop. This decouples raw scroll values from rendering vectors, smoothly interpolating the camera position (`cameraY`, `cameraZ`) and model rotation (`rotationY`) to guarantee consistent 60fps animations.

### 3. Autoplay-Compliant Audio System
*   **Problem**: Modern browser security policies prevent programmatic audio playback before explicit user interaction, throwing `AudioContext not allowed to start` exceptions.
*   **Solution**: Configured a global `AudioProvider` that listens for initial interactions (`pointerdown`, `keydown`, `touchstart`, or `wheel`) across the viewport. Upon detection, it initializes the `Howler` instance, plays the startup boot sound, and dismantles the event listeners to prevent memory leaks.

---

## 🛠️ Tech Stack

| Layer | Technology | Role |
| :--- | :--- | :--- |
| **Framework** | Next.js 15 (App Router), React 19, TypeScript | Routing structure and component architecture. |
| **Graphics** | Three.js, `@react-three/fiber`, `@react-three/drei` | WebGL canvas setup, materials, and procedural group nesting. |
| **Animations**| Framer Motion | Scroll tracking (`useScroll`), transforms, and text overlays. |
| **Audio** | Howler.js | Mechanical sound player with volume controls. |
| **Mail** | EmailJS | Contact form email delivery. |

---

## 📁 Folder Structure

```
my-portfolio/
├── app/
│   ├── components/
│   │   ├── BootSequence.tsx      # Loader panel and sound trigger
│   │   ├── FixedExhibit.tsx      # R3F WebGL Canvas and procedural robot
│   │   ├── AudioProvider.tsx     # Global volume & local storage toggle
│   │   ├── PortfolioShell.tsx    # Scroll tracker layout wrapper
│   │   └── ...                   # Reusable content panels
│   ├── lib/
│   │   └── audio.ts              # Howler sound mapping library
│   ├── page.tsx                  # Landing structure
│   └── globals.css               # Theme variables and root styles
├── public/
│   └── audio/                    # Compressed MP3 audio assets
└── package.json
```

---

## 🚀 Local Setup

### Prerequisites
*   Node.js 20+

### Setup Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/joel8779/my-portfolio.git
   cd my-portfolio
   ```
2. Install package dependencies:
   ```bash
   npm install
   ```
3. Copy environment configuration:
   ```bash
   cp .env.example .env.local
   # Edit with EmailJS credentials
   ```
4. Run the local development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:3000`.

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.
