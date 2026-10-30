# DESIGN.md — Neo-Brutalism Design System

## 1. Visual World & Direction
- **Style**: **Neo-Brutalism** (Bold geometric borders, high-contrast hard shadows, tactile micro-feedback, purposeful asymmetric density).
- **Core Stance**: Rejecting generic AI templates, soft glow gradients, and sterile minimalism. Visual elements feel physical, mechanical, and crafted.
- **Dial Setting**: **ENERGY 3 / RHYTHM 2 / MOTION 2**
  - High structural energy through bold weights and contrasting accents.
  - Consistent layout rhythm with intentional breaks for highlights.
  - Subdued tactile motion (press physics, instant snappy state changes, no endless idle loops).

## 2. Color Architecture
Dual-theme system respecting system preference with a manual override toggle.

### Light Substrate (Warm Neo Paper)
- **Background**: `#F7F0D4` / `#FFFDF5` (Warm Creamy Paper khas Neo-Brutalism seperti di `Contoh/neo.html` dan `neobrutalism_com.html`)
- **Foreground / Text**: `#141210` (Deep Carbon)
- **Surface / Card**: `#FFFFFF` / `#FFFDF5`
- **Border**: `#000000` (2px solid)
- **Primary Accent**: `#EBB956` / `#FCBA28` (Warm Neo Amber) & `#D04060` (Punch Red)
- **Secondary Accent**: `#14B6E5` / `#2563EB` (Electric Blue)
- **Hard Shadow**: `shadow-[4px_4px_0px_0px_#000]` / `shadow-[6px_6px_0px_0px_#000]`

### Dark Substrate (Industrial Terminal)
- **Background**: `#141210` / `#1E1A16` (Warm Dark Matte Charcoal)
- **Foreground / Text**: `#FFFDF5` / `#F7F0D4` (Warm Light Text)
- **Surface / Card**: `#1E1A16`
- **Border**: `#F7F0D4` / `#444444` (2px solid)
- **Primary Accent**: `#EBB956` (Warm Amber Glow)
- **Secondary Accent**: `#14B6E5` (Vivid Cyan)
- **Hard Shadow**: `shadow-[4px_4px_0px_0px_#F7F0D4]` / `shadow-[4px_4px_0px_0px_#000]`

## 3. Typography Architecture
- **Display / Headers**: `Space Grotesk` or `Archivo Black`
  - High visual weight (`font-bold` to `font-black`).
  - Uppercase for category markers, telemetry labels, and major section titles (`tracking-tight` or `tracking-wide` for badges).
- **Body Text**: `Geist` or `Inter`
  - Crisp readability, line-height `leading-relaxed`, line-length capped at `max-w-[65ch]`.
- **Telemetry / Tags**: `Geist Mono` or `JetBrains Mono`
  - Used for tech tags (`PHP`, `LARAVEL`, `SQL`), dates, metrics, and system status indicators.

## 4. UI Mechanics & Components
- **Borders & Corners**: Strict 2px borders (`border-2 border-black dark:border-white`). Sharp or slight boxy corner radius (`rounded-none` or `rounded-sm`).
- **Drop Shadows**: Crisp, non-diffuse hard shadows:
  - Standard: `shadow-[4px_4px_0px_0px_#121212] dark:shadow-[4px_4px_0px_0px_#f4f4f0]`
  - Compact / Buttons: `shadow-[2px_2px_0px_0px_#121212] dark:shadow-[2px_2px_0px_0px_#f4f4f0]`
- **Tactile Feedback**:
  - Hover: `hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#121212]`
  - Active / Press: `active:translate-x-1 active:translate-y-1 active:shadow-none`
  - Transition: `transition-all duration-100 ease-out`
- **Badges**: Boxy uppercase pills with solid border and accent background fill.
- **Modals / Lightboxes**: Solid backdrop scrim (`bg-black/70 backdrop-blur-none`), heavy bordered container with top title bar.

## 5. Accessibility & Guardrails
- Contrast ratio strictly exceeds 4.5:1 across normal text and 3:1 for all borders/interactive elements.
- Visible high-contrast focus rings for keyboard navigation (`focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2`).
- Touch targets strictly ≥ 44x44px.
- Zero horizontal overflow across viewports (tested at 375px, 768px, 1024px, 1440px).
