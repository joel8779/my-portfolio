# Alluri Jeswanth — Interactive Engineering Portfolio

An interactive, high-performance, and cinematically sound-designed engineering portfolio showcasing full-stack capabilities, backend systems, and Three.js-powered 3D exhibit mechanics.

---

## 🛠️ Tech Stack

- **Core Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **UI & Logic**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Styling**: Modern CSS with custom responsive layout models and custom utility variables
- **3D Graphics**: [Three.js](https://threejs.org/), [@react-three/fiber](https://r3f.docs.pmnd.rs/), [@react-three/drei](https://github.com/pmndrs/drei)
- **Audio System**: [Howler.js](https://howlerjs.com/) for mechanical sound design (with auto-unlocking, session caching, and mute control)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Contact Form**: [EmailJS](https://www.emailjs.com/)
- **GitHub Integration**: GitHub GraphQL API proxy route with caching

---

## ✨ Features

- **Cinematic Exhibit Boot Sound Design**: Automatically locks/unlocks audio context on the first user interaction (`pointerdown`, `keydown`, `touchstart`, or `wheel`), playing a museum-powering mechanical boot sound exactly once per session.
- **Fixed Exhibit 3D Robot**: Rendered in a real-time WebGL canvas, responding dynamically to scroll and rotation progress with mechanical clicks and hydraulic hums.
- **Top Pinned GitHub Projects & Table**: Fetches and renders live repository statistics, stars, and descriptions with proper clamp filters and links.
- **Sound Toggle**: Header controllers to enable/disable sound effects globally, persistent across page reloads using `localStorage`.
- **Dynamic SEO Router**: Auto-generated dynamic sitemaps and robots settings.

---

## 🚀 Local Setup

### 1. Clone & Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory (based on `.env.example`):

```env
GITHUB_TOKEN=your_github_personal_access_token_here
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_emailjs_service_id_here
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_emailjs_template_id_here
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_emailjs_public_key_here
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the portfolio.

---

## 📦 Build & Deploy

### Production Build

Compile the Next.js production build:

```bash
npm run build
```

---

## ⚡ Vercel Deployment

Deploy the application directly to Vercel:

1. **Import the repository** into your Vercel Dashboard.
2. Configure **Environment Variables** in project settings matching the `.env` setup.
3. Vercel automatically detects Next.js settings and runs:
   - **Framework Preset**: Next.js
   - **Build Command**: `next build`
   - **Output Directory**: Default (`.next`)
4. Click **Deploy**.
