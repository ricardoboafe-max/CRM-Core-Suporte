---
name: Field Operations Precision
colors:
  surface: '#f8f9ff'
  surface-dim: '#d5dae6'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e9eefa'
  surface-container-high: '#e3e8f4'
  surface-container-highest: '#dde3ee'
  on-surface: '#161c24'
  on-surface-variant: '#43474d'
  inverse-surface: '#2b3139'
  inverse-on-surface: '#ebf1fd'
  outline: '#74777e'
  outline-variant: '#c4c6ce'
  surface-tint: '#49607e'
  primary: '#000f22'
  on-primary: '#ffffff'
  primary-container: '#0a2540'
  on-primary-container: '#768dad'
  inverse-primary: '#b0c8eb'
  secondary: '#00687a'
  on-secondary: '#ffffff'
  secondary-container: '#6ae1ff'
  on-secondary-container: '#006374'
  tertiary: '#001020'
  on-tertiary: '#ffffff'
  tertiary-container: '#0e263b'
  on-tertiary-container: '#778ea7'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d2e4ff'
  primary-fixed-dim: '#b0c8eb'
  on-primary-fixed: '#001c37'
  on-primary-fixed-variant: '#314865'
  secondary-fixed: '#adecff'
  secondary-fixed-dim: '#5dd6f3'
  on-secondary-fixed: '#001f26'
  on-secondary-fixed-variant: '#004e5d'
  tertiary-fixed: '#cfe5ff'
  tertiary-fixed-dim: '#b2c9e4'
  on-tertiary-fixed: '#031d32'
  on-tertiary-fixed-variant: '#33495f'
  background: '#f8f9ff'
  on-background: '#161c24'
  surface-variant: '#dde3ee'
typography:
  headline-xl:
    fontFamily: Chivo
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 40px
  headline-xl-mobile:
    fontFamily: Chivo
    fontSize: 26px
    fontWeight: '800'
    lineHeight: 32px
  headline-lg:
    fontFamily: Chivo
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 30px
  headline-md:
    fontFamily: Chivo
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 26px
  title-lg:
    fontFamily: Chivo
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  title-md:
    fontFamily: Chivo
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
  body-lg:
    fontFamily: Chivo
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Chivo
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Chivo
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-code:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-status:
    fontFamily: Chivo
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.04em
  label-caption:
    fontFamily: Chivo
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-mobile: 0.75rem
  margin: 1rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system targets field technicians, service engineers, and operational coordinators managing work orders under demanding physical environments. The emotional response must be immediacy, absolute reliability, structural clarity, and zero cognitive friction. 

The aesthetic is Modern Functionalist: a blend of high-utility corporate precision and rugged digital ergonomics. Visual clutter, decorative drop-shadows, and ambiguous affordances are eliminated. Every interface element prioritizes ultra-high contrast, legible data hierarchy under harsh sunlight, and generous touch targets configured for one-handed operation or gloved interaction. The result is an authoritative, utilitarian interface that projects professional competence and mission-critical efficiency.

## Colors

The palette is engineered for field visibility, meeting strict WCAG AAA contrast ratios against bright ambient daylight.

- **Primary (`#0A2540`)**: Deep Technical Blue. Used for top app bars, primary structural headers, high-importance callouts, and key interaction anchors. Provides high-density grounding.
- **Secondary (`#00A3BF`)**: Vivid Cyan. Reserved for active interactive accents, key toggles, current step progress, and focal touchpoints. Pierces through glare without eye strain.
- **Tertiary (`#3E546B`)**: Slate Steel. Serves as secondary copy color, structural divider borders, and muted icon states.
- **Neutral Surface & Text (`#121820` / `#F4F6F9`)**: Neutral darks are near-black with a slate bias to preserve deep contrast; base canvases sit on Crisp Off-White (`#F4F6F9`) with pure white (`#FFFFFF`) card containers to separate stacked content cleanly.

### Specialized Status Tokens
Status tags use deliberate, high-saturation signifiers paired with deep matching text for immediate optical parsing:
- **Pendente**: Amber Warning â€” Background `#FEF3C7`, Border `#F59E0B`, Text `#78350F`.
- **Em ExecuÃ§Ã£o**: Tech Blue Progress â€” Background `#E0F2FE`, Border `#0284C7`, Text `#034975`.
- **Aguardando PeÃ§as**: Deep Violet Handoff â€” Background `#F3E8FF`, Border `#9333EA`, Text `#581C87`.
- **ConcluÃ­da**: High-Visibility Emerald â€” Background `#DCFCE7`, Border `#16A34A`, Text `#14532D`.
- **CrÃ­tica / Atrasada**: Urgent Crimson â€” Background `#FEE2E2`, Border `#DC2626`, Text `#7F1D1D`.

## Typography

The type system pairs **Chivo**â€”a sharp, high-legibility geometric sans-serif with distinct terminal cutsâ€”with **JetBrains Mono** for alphanumeric technical data (OS numbers, equipment serials, part codes, telemetry coordinates).

- **Chivo** features wide open counters and pronounced x-heights that resist letter blending even when the screen is viewed from an angle or under bright outdoor reflections.
- **JetBrains Mono** anchors technical parameters, preventing misreading between characters like `0`/`O` or `1`/`I` during field input.
- All numbers, quantities, and monetary values in work order summaries must use tabular figures (`font-variant-numeric: tabular-nums`) to preserve column alignment across inventory lists and time tracking.

## Layout & Spacing

The layout philosophy follows a mobile-first fluid single-column stack expanding to a structured column canvas on larger field tablets.

- **Mobile Canvas**: Outer padding uses `margin-mobile` (16px), keeping content safely away from hardware edges. The baseline vertical grid operates strictly on a 4px/8px modular scale.
- **Touch-First Hit Zones**: Interactive elements (action buttons, check toggles, form fields) enforce an absolute minimum touch zone of 48px by 48px, with `space-sm` (8px) minimum separation between adjacent interactive touchpoints to prevent errant taps on field hardware.
- **Tablet Reflow**: On screens $\ge$ 768px, screens transition to an asymmetrical master-detail split (40% list view, 60% OS work area) with a fixed 16px gutter between panels.
- **Dense Data Zones**: Card interiors apply compact inner padding (`space-md` / 16px) with stacked key-value pairs separated by `space-xs` (4px) to maximize above-the-fold screen efficiency.

## Elevation & Depth

To guarantee daylight performance, elevation avoids soft diffuse ambient blurs, which wash out in high-lux natural environments. Instead, depth is constructed using **structural tonal layering** combined with **crisp low-contrast outlines**.

- **Level 0 (Canvas Base)**: `#F4F6F9` â€” The foundational viewport tone.
- **Level 1 (Card & List Containers)**: Pure `#FFFFFF` surface bordered with an engineered 1px solid stroke of `#D8E0E9`. This distinct physical edge ensures cards remain sharply delineated against the off-white canvas.
- **Level 2 (Sticky Headers & Floating Trays)**: `#FFFFFF` surface with a 1px bottom or top edge (`#BAC7D5`) and a tactile direct offset shadow: `0px 4px 0px 0px rgba(10, 37, 64, 0.06)`. This directional drop preserves edge clarity without relying on opacity-heavy gradients.
- **Level 3 (Modals & Emergency Confirmations)**: `#FFFFFF` with a crisp outer edge (`#0A2540` at 15%) and a crisp, tight dual shadow: `0px 8px 16px -2px rgba(10, 37, 64, 0.16)`. Dark scrim background uses `#0A2540` at 65% opacity.

## Shapes

The design system employs **Soft** geometry (`roundedness: 1`), keeping edge radiuses understated and industrial.

- Base elements (cards, input fields, and standard buttons) utilize **4px (`0.25rem`)** corner radiuses.
- Larger sheet containers and primary modals use **8px (`0.5rem`)**.
- Status indicator tags and micro metric badges use **4px (`0.25rem`)**â€”never full-pill circular capsulep %™Z[™›Ü˜Ú[™ÈHÜš\ÜX[\‹›Y\š[Z[œÜ\™Yš\İX[[™İXYÙH]ÛÛœÙ\™\ÈÜš^›Û[™XY[™ÈÜXÙK‚‚ˆÈÈÛÛ\Û™[Â‚ˆÈÈÈ]ÛœÂ‹H
Š”š[X\HXİ[Ûˆ
K™Ë‹’[šXÚX\ˆ][™[Y[È‹ÛÛ˜ÛZ\ˆÔÈŠJŠˆZYÚLœˆÛÛYÌLM˜XÚÙÜ›İ[™\™HÚ]H›Û^ÛÜ›™\ˆ˜Y]\Ëˆ›Øİ\È[™Xİ]™Hİ]\È›\ÚÌLĞ‘˜‚‹H
Š”ÙXÛÛ™\HÈ]ZXÚÈXİ[ÛŠŠˆZYÚLœˆÑ‘‘‘‘‘˜˜XÚÙÜ›İ[™Ú]HK\ÛÛY›Ü™\ˆ[ˆÌLM[™^[ˆÌLM‚‹H
Š‘[Y\™Ù[˜ŞHÈØ[˜Ù[Xİ[ÛŠŠˆYÚXÛÛ˜\İİ][™H[ˆÑÌŒ˜Ú]X]Ú[™È^Èš[ÈÛÛYÑÌŒ˜Ú]Ú]H^Ûˆ™\ÜË‚‚ˆÈÈÈİ]\ÈÚ\È
YÜÊB‹HÛÛ\Xİ]]Ë]ÚYÛÛ\Û™[È™[™\™YÚ]H\ÛÛYİ][™KX]Ú[™ÈYÚ][˜XÚÙÜ›İ[™[™\šÈ[Y^‚‹H]\İ™XÙYHİ]\ÈÛÜHÚ]HÛÛYœ[™XØ]Üˆİ™[™\™Y[ˆHİ]\ÈXØÙ[ÛÛÜˆ›Üˆ[œİ[\š\\˜[™XÛÙÛš][Û‹‚‹H^›Ü›X]ˆ\\˜Ø\ÙHÚ]›ÈLœÌÙZYÚÚ]]\ˆÜXÚ[™Ë‚‚ˆÈÈÈÛÜšÈÜ™\ˆØ\™È
Ø\™ÔÊB‹Hİ\™˜XÙHÑ‘‘‘‘‘˜›Ü™\ˆ\ÛÛYÑLNX˜Y]\ÈY[™ÈMœ‚‹H
Š’XY\ˆ[™JŠˆ[Û›ÜÜXÙHÔÈÛÙH
ÌLM™]œ˜Z[œÈ[Û›ÊHYX[YÛ™YÈİ]\ÈÚ\šYÚX[YÛ™Y‚‹H
Š“ZYHÙXİ[ÛŠŠˆÛY[˜[YH[™\ÚXØ[Y™\ÜÈ[ˆ›ÛMœ›ÙKZ\™YÚ]]ZXÚËYX[[™ÔÈ›İ][™ÈXÛÛˆšYÙÙ\œÈ
Ü]X\™HİXÚ\™Ù]ÊK‚‹H
Š‘›Ûİ\ŠŠˆÙ\šXÙHÚ[™İÈ[YH˜[™ÙHÚ]HYÚXÛÛ˜\İÛØÚÈXÛÛˆ[™XÚšXÚX[ˆ\ÜÚYÛ›Y[]˜]\‹‚‚ˆÈÈÈ[œ]šY[È	ˆÚXÚÛ\İÂ‹HZYÚZ[š[][Kˆ˜XÚÙÜ›İ[™Ñ‘‘‘‘‘˜›Ü™\ˆK\ÛÛYĞPÍÑX‚‹HXİ]™H›Øİ\Èİ]Nˆœ›Ü™\ˆ[ˆÌLĞ‘˜Ú]™\›È›\ˆÛİË‚‹HšY[[œÜXİ[ÛˆÚXÚÛ\İÎˆÚXÚØ›Ş\È[™˜Y[È\™Ù]ÈYX\İ\™H›ŞÚ^™HÙX]Y[œÚYH[]ÚY\›İÜÈ
Z[š[][H›İÈZYÚM
H™X]\š[™È[\›˜][™ÈİXHİš\[™ÈÜˆ\]šY\œÈÈ[[Z[˜]H[œ]\œ›ÜœË‚‚ˆÈÈÈİÈØ\\™H	ˆÚYÛ˜]\™H›ØÚÜÂ‹HYXØ]Y]XÚY[[\ÈÚ]\ÚYœ›Ü™\œÈ[ˆÌÑMM˜\Ü^Z[™ÈYÚXÛÛ˜\İØ[Y\˜HXÛÛœËˆ‹HÚYÛ˜]\™HØ[˜\ÈÚ]È[œÚYH[ˆ^XÚ]Ú]H›ŞÚ][ˆ[˜[XšYİ[İ\È›XÚÈ[šÈ˜\Ù[[™H[™HÛX\ˆ“[\\ˆ\ÜÚ[˜]\˜Hˆ^Xİ[Û‹