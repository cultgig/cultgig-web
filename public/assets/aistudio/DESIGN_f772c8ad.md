# Granola — Colour Design System

> **Scope:** Colour tokens only. This file defines the colour language, semantic roles, states, overlays, gradients, shadows and implementation rules for a production interface inspired by the current Granola website and the supplied Mobbin collection. It intentionally excludes typography, spacing, layout, component dimensions and motion.

**Reference audit date:** 22 November 2026  
**Primary reference:** https://www.granola.ai/  
**Mobbin reference collection:** https://mobbin.com/collections/5cd020bf-cd48-4529-b3c8-a3f3dbacc0cc/sites/sections  
**Collection:** Granola — 40 website sections, all tagged to the Granola site.

---

## 1. Colour direction

The visual system is a warm, low-noise light interface. White and warm off-white carry most of the canvas; graphite provides readable text; olive is the recognisable brand/action colour; light olive is a supporting highlight. Neutral surfaces step gently from page white to warm grey-green. Borders are subtle and shadows should remain soft and low-opacity.

**Do not turn the interface into a saturated green UI.** Olive is an accent and action colour, not a replacement for the neutral surface system. Avoid pure black as the default text colour and avoid cool blue-grey neutrals.

### Brand anchors

| Role | Token | HEX | RGB | Usage |
|---|---|---:|---:|---|
| Primary brand / action olive | `brand.olive` | `#5B6F00` | `91, 111, 0` | Primary buttons, selected states, key links and high-emphasis brand marks |
| Light olive | `brand.light` | `#B2C248` | `178, 194, 72` | Highlight fields, brand artwork, decorative emphasis and soft accent backgrounds |
| Olive ink | `brand.ink` | `#788C15` | `120, 140, 21` | Accent text and links where contrast is sufficient |
| Warm page surface | `surface.page` | `#FFFFFF` | `255, 255, 255` | Main page background |
| Warm off-white | `surface.warm` | `#F7F7F2` | `247, 247, 242` | Alternate page bands, large calm sections and raised low-contrast surfaces |
| Primary ink | `text.primary` | `#292929` | `41, 41, 41` | Default body text, headings and icons |
| Warm inverse text | `text.inverse` | `#FCFCF8` | `252, 252, 248` | Text on dark/olive surfaces |

The olive and light-olive values are supported by the Granola brand-guideline reference. The measured website palette also identifies `#B2C248` as the primary visible accent and `#5B6F00` as the deeper secondary accent. For production controls, use the deeper olive as the default filled-button background because it gives materially better text contrast than the light olive.

---

## 2. Complete neutral palette

| Token | HEX | RGB | Semantic use |
|---|---:|---:|---|
| `neutral.white` | `#FFFFFF` | `255, 255, 255` | Base canvas, cards on white sections |
| `neutral.snow` | `#F7F7F2` | `247, 247, 242` | Warm alternate canvas, subtle section background |
| `neutral.mist` | `#EAEBE5` | `234, 235, 229` | Cards, panels, inset areas and quiet containers |
| `neutral.silver` | `#D5D5D2` | `213, 213, 210` | Higher-emphasis neutral fill, pressed/hover fill and stronger separators |
| `neutral.gray` | `#ACADA8` | `172, 173, 168` | Disabled/muted metadata only; not small body copy |
| `neutral.slate` | `#72726E` | `114, 114, 110` | Secondary text, descriptions and supporting labels |
| `neutral.graphite` | `#292929` | `41, 41, 41` | Main text and icon colour |
| `neutral.charcoal` | `#0E0F0C` | `14, 15, 12` | Strong headings, high-emphasis text and deepest foreground |
| `neutral.black` | `#000000` | `0, 0, 0` | Only where a true black glyph or icon is required |

### Surface hierarchy

Use the following progression rather than introducing arbitrary greys:

1. `#FFFFFF` — page and default card surface.
2. `#F7F7F2` — warm section surface and low raised surface.
3. `#EAEBE5` — card/panel surface and inset content.
4. `#D5D5D2` — hover/pressed neutral fill or high-emphasis neutral divider.

Do not use `#D5D5D2` as a large page background. It is intentionally a stronger step in the neutral scale.

---

## 3. Text and icon colour roles

| Token | HEX | Use |
|---|---:|---|
| `text.primary` | `#292929` | Default paragraph, headings, labels and body icons |
| `text.strong` | `#0E0F0C` | High-emphasis title or short emphasis |
| `text.secondary` | `#72726E` | Supporting copy, helper text and descriptions |
| `text.muted` | `#ACADA8` | Disabled text, tertiary metadata and low-priority timestamps only |
| `text.inverse` | `#FCFCF8` | Text on olive/dark surfaces |
| `text.on-primary` | `#FFFFFF` | Primary action label on `#5B6F00` |
| `text.on-light-accent` | `#292929` | Text/icons on light olive `#B2C248` |
| `icon.primary` | `#292929` | Default icons |
| `icon.secondary` | `#72726E` | Supporting icons |
| `icon.muted` | `#ACADA8` | Disabled icons |
| `icon.inverse` | `#FCFCF8` | Icons on dark/olive surfaces |
| `link.default` | `#5B6F00` | Inline links and text actions |
| `link.hover` | `#435300` | Hovered link (derived darker interaction state) |

**Accessibility rule:** `#ACADA8` on white is low contrast. Do not use it for normal-size essential copy, form labels, navigation or button labels. Reserve it for non-essential metadata, disabled states or large text. Use `#72726E` for readable secondary copy.

---

## 4. Brand and accent usage

| Token | HEX | Status | Usage |
|---|---:|---|---|
| `brand.primary` | `#5B6F00` | Reference brand colour | Main action, active navigation, key links, selected controls |
| `brand.primary-hover` | `#435300` | Derived state | Hover for primary actions |
| `brand.primary-pressed` | `#354200` | Derived state | Pressed/active primary actions |
| `brand.primary-subtle` | `#F0F2E5` | Derived tint | Selected row, soft tag, subtle callout |
| `brand.light` | `#B2C248` | Reference brand colour | Decorative highlight, logo/app-icon ground, accent panel |
| `brand.light-hover` | `#A5B43D` | Derived state | Hover on light olive surfaces |
| `brand.light-subtle` | `#F5F6E9` | Derived tint | Very soft highlight surface |
| `brand.ink` | `#788C15` | Reference brand colour | Accent text/link; verify contrast for each background |
| `brand.tertiary` | `#E0C976` | Measured accent | Restrained tertiary highlight, small decorative emphasis |

Do not use light olive `#B2C248` as a filled button with white text. Use `#5B6F00` with white text, or use `#B2C248` with dark graphite text.

---

## 5. Borders, dividers and outlines

| Token | HEX / CSS | Use |
|---|---|---|
| `border.default` | `rgba(0, 0, 0, 0.10)` / `#0000001A` | Default hairline border and separators |
| `border.subtle` | `rgba(71, 67, 42, 0.20)` / `#47432A33` | Warm secondary divider |
| `border.strong` | `#D5D5D2` | Stronger neutral boundary |
| `border.control` | `rgba(41, 41, 41, 0.18)` | Input and control outline (derived) |
| `border.focus` | `#788C15` | Focus outline/accent |
| `border.selected` | `#5B6F00` | Selected control/card outline |
| `divider.default` | `rgba(0, 0, 0, 0.10)` | Horizontal/vertical dividers |

Prefer 1px low-opacity borders over visible dark outlines. Do not use the focus colour as a permanent border on every component.

---

## 6. Backgrounds, overlays and scrims

| Token | HEX / CSS | Use |
|---|---|---|
| `overlay.warm` | `rgba(98, 90, 34, 0.06)` / `#625A220F` | Warm translucent tint over cards/controls |
| `overlay.black-04` | `rgba(0, 0, 0, 0.04)` | Subtle hover tint where a fill is not appropriate |
| `overlay.black-08` | `rgba(0, 0, 0, 0.08)` | Menu/popover backdrop tint |
| `overlay.black-20` | `rgba(0, 0, 0, 0.20)` | Light modal scrim |
| `overlay.black-40` | `rgba(0, 0, 0, 0.40)` | Strong modal/media scrim |
| `overlay.white-70` | `rgba(255, 255, 255, 0.70)` | Frosted/light overlay, only when needed |

The warm overlay `#625A220F` is present in the measured palette. The other overlay values are implementation recommendations, not claims about exact measured Granola CSS.

---

## 7. Drop shadows and elevation colours

The reference direction uses soft, restrained depth. Avoid hard black shadows, large blur halos or coloured neon shadows. The exact shadow recipes below are **derived implementation tokens**; the public palette measurement identifies shadow depth but does not expose a definitive canonical shadow colour/recipe.

| Token | CSS shadow | Intended use |
|---|---|---|
| `shadow.none` | `none` | Flat sections and low-emphasis surfaces |
| `shadow.xs` | `0 1px 2px rgba(14, 15, 12, 0.06)` | Hairline lift on small controls |
| `shadow.sm` | `0 2px 8px rgba(14, 15, 12, 0.06)` | Cards and compact popovers |
| `shadow.md` | `0 8px 24px rgba(14, 15, 12, 0.08)` | Floating panels and dropdowns |
| `shadow.lg` | `0 16px 40px rgba(14, 15, 12, 0.10)` | Dialogs and elevated overlays |
| `shadow.brand` | `0 4px 14px rgba(91, 111, 0, 0.14)` | Rare primary-action emphasis; avoid on every button |

**Shadow colour base:** `#0E0F0C` at low opacity. Use olive-tinted shadow only as a restrained accent. Shadows should support surface separation, not become a visible design feature.

---

## 8. Gradient palette

The measured Granola website palette reports these decorative gradient stops:

| Stop | HEX | Suggested role |
|---|---:|---|
| `gradient.sun` | `#FEBE29` | Warm yellow highlight |
| `gradient.pink` | `#FF91E0` | Soft pink highlight |
| `gradient.lavender` | `#CEBEF8` | Lavender highlight |
| `gradient.blue` | `#D2E4F8` | Pale blue highlight |

These are supporting artwork/gradient colours, **not** replacements for the core brand palette. Keep gradients out of primary controls and essential text. Use them in small decorative areas, artwork or product illustration only.

Recommended restrained gradient:

```css
background: linear-gradient(
  115deg,
  #FEBE29 0%,
  #FF91E0 34%,
  #CEBEF8 68%,
  #D2E4F8 100%
);
```

Treat this as an optional decorative blend. Do not apply it globally or to every section.

---

## 9. Interaction state colour matrix

| Component state | Background | Text / icon | Border |
|---|---|---|---|
| Primary button — default | `#5B6F00` | `#FFFFFF` | `#5B6F00` |
| Primary button — hover | `#435300` | `#FFFFFF` | `#435300` |
| Primary button — pressed | `#354200` | `#FFFFFF` | `#354200` |
| Primary button — disabled | `#D5D5D2` | `#72726E` | `#D5D5D2` |
| Secondary button — default | `#FFFFFF` | `#292929` | `#0000001A` |
| Secondary button — hover | `#F7F7F2` | `#292929` | `#0000001A` |
| Secondary button — pressed | `#EAEBE5` | `#292929` | `#D5D5D2` |
| Light-accent chip — default | `#B2C248` | `#292929` | transparent |
| Subtle chip — default | `#F0F2E5` | `#5B6F00` | transparent |
| Input — default | `#FFFFFF` | `#292929` | `rgba(41,41,41,.18)` |
| Input — hover | `#FFFFFF` | `#292929` | `#72726E` |
| Input — focus | `#FFFFFF` | `#292929` | `#788C15` |
| Input — disabled | `#F7F7F2` | `#ACADA8` | `#D5D5D2` |
| Selected row | `#F0F2E5` | `#292929` | `#788C15` |
| Hover row | `#F7F7F2` | `#292929` | transparent |
| Pressed row | `#EAEBE5` | `#292929` | transparent |

Derived state colours should remain inside the same warm/olive family. Do not introduce blue focus rings or bright generic SaaS purple.

---

## 10. Semantic status colours

Granola's visual identity is primarily olive and warm neutrals. Status colours below are **functional accessibility additions**, not part of the measured brand palette. Use them sparingly and never as decorative brand accents.

| Semantic token | Foreground | Soft background | Border | Usage |
|---|---:|---:|---:|---|
| `status.success` | `#356B3D` | `#EDF5EC` | `#C9DEC8` | Successful save, completed action |
| `status.warning` | `#805B12` | `#FBF4E4` | `#E9D7A8` | Caution, pending action |
| `status.error` | `#A33A32` | `#FBEFED` | `#EBC8C4` | Destructive/error state |
| `status.info` | `#365F78` | `#EDF4F7` | `#C9DCE5` | Informational system message |

Do not use these status colours for brand buttons, navigation or large promotional backgrounds.

---

## 11. Accessibility and contrast requirements

Contrast ratios below are approximate WCAG relative-luminance calculations for the specified foreground/background pairs.

| Foreground | Background | Approx. ratio | Guidance |
|---|---|---:|---|
| `#292929` | `#FFFFFF` | 14.5:1 | AAA |
| `#0E0F0C` | `#FFFFFF` | 19.2:1 | AAA |
| `#72726E` | `#FFFFFF` | 4.8:1 | AA for normal text |
| `#ACADA8` | `#FFFFFF` | 2.3:1 | Fail for normal text; muted metadata only |
| `#FFFFFF` | `#5B6F00` | 6.0:1 | AA for normal text |
| `#292929` | `#B2C248` | 6.0:1 | AA for normal text |
| `#FFFFFF` | `#B2C248` | 2.2:1 | Fail; do not use white text on light olive |
| `#5B6F00` | `#FFFFFF` | 6.0:1 | AA for normal text |
| `#788C15` | `#FFFFFF` | 4.0:1 | Not sufficient for normal-size text; use for larger text or non-text accents only |

Requirements:
- Normal text must target at least **4.5:1**.
- Large text must target at least **3:1**.
- Essential UI boundaries and icons should target at least **3:1** against adjacent colours.
- Never communicate status using colour alone; pair it with a label/icon.
- Check contrast again when a token is placed on a non-white surface.
- The `text.muted` token is intentionally not an accessible body-text colour.

---

## 12. CSS custom properties — production tokens

Use semantic variables in components. Avoid hardcoding raw hex values throughout the application.

```css
:root {
  color-scheme: light;

  /* Brand */
  --color-brand-primary: #5B6F00;
  --color-brand-primary-hover: #435300;
  --color-brand-primary-pressed: #354200;
  --color-brand-primary-subtle: #F0F2E5;
  --color-brand-light: #B2C248;
  --color-brand-light-hover: #A5B43D;
  --color-brand-light-subtle: #F5F6E9;
  --color-brand-ink: #788C15;
  --color-brand-tertiary: #E0C976;

  /* Surfaces */
  --color-page: #FFFFFF;
  --color-surface: #FFFFFF;
  --color-surface-low: #F7F7F2;
  --color-surface-container: #EAEBE5;
  --color-surface-container-high: #D5D5D2;
  --color-surface-disabled: #F7F7F2;

  /* Text */
  --color-text-primary: #292929;
  --color-text-strong: #0E0F0C;
  --color-text-secondary: #72726E;
  --color-text-muted: #ACADA8;
  --color-text-inverse: #FCFCF8;
  --color-text-on-primary: #FFFFFF;
  --color-text-on-light-accent: #292929;

  /* Icons */
  --color-icon-primary: #292929;
  --color-icon-secondary: #72726E;
  --color-icon-muted: #ACADA8;
  --color-icon-inverse: #FCFCF8;

  /* Borders */
  --color-border: rgba(0, 0, 0, 0.10);
  --color-border-subtle: rgba(71, 67, 42, 0.20);
  --color-border-strong: #D5D5D2;
  --color-border-control: rgba(41, 41, 41, 0.18);
  --color-border-focus: #788C15;
  --color-border-selected: #5B6F00;

  /* Overlays */
  --color-overlay-warm: rgba(98, 90, 34, 0.06);
  --color-overlay-black-04: rgba(0, 0, 0, 0.04);
  --color-overlay-black-08: rgba(0, 0, 0, 0.08);
  --color-overlay-black-20: rgba(0, 0, 0, 0.20);
  --color-overlay-black-40: rgba(0, 0, 0, 0.40);
  --color-overlay-white-70: rgba(255, 255, 255, 0.70);

  /* Shadows */
  --shadow-xs: 0 1px 2px rgba(14, 15, 12, 0.06);
  --shadow-sm: 0 2px 8px rgba(14, 15, 12, 0.06);
  --shadow-md: 0 8px 24px rgba(14, 15, 12, 0.08);
  --shadow-lg: 0 16px 40px rgba(14, 15, 12, 0.10);
  --shadow-brand: 0 4px 14px rgba(91, 111, 0, 0.14);

  /* Status */
  --color-success: #356B3D;
  --color-success-soft: #EDF5EC;
  --color-success-border: #C9DEC8;
  --color-warning: #805B12;
  --color-warning-soft: #FBF4E4;
  --color-warning-border: #E9D7A8;
  --color-error: #A33A32;
  --color-error-soft: #FBEFED;
  --color-error-border: #EBC8C4;
  --color-info: #365F78;
  --color-info-soft: #EDF4F7;
  --color-info-border: #C9DCE5;
}
```

### Optional gradient custom property

```css
:root {
  --gradient-brand-art:
    linear-gradient(115deg, #FEBE29 0%, #FF91E0 34%, #CEBEF8 68%, #D2E4F8 100%);
}
```

---

## 13. Tailwind CSS mapping

For Tailwind v4, expose the CSS variables through `@theme`:

```css
@theme {
  --color-brand: var(--color-brand-primary);
  --color-brand-hover: var(--color-brand-primary-hover);
  --color-brand-light: var(--color-brand-light);
  --color-brand-ink: var(--color-brand-ink);

  --color-page: var(--color-page);
  --color-surface-low: var(--color-surface-low);
  --color-surface-container: var(--color-surface-container);
  --color-surface-high: var(--color-surface-container-high);

  --color-ink: var(--color-text-primary);
  --color-ink-strong: var(--color-text-strong);
  --color-ink-secondary: var(--color-text-secondary);
  --color-ink-muted: var(--color-text-muted);
  --color-ink-inverse: var(--color-text-inverse);

  --color-border-default: var(--color-border);
  --color-border-strong: var(--color-border-strong);
  --color-focus: var(--color-border-focus);
}
```

For Tailwind v3, map the same semantic names in `theme.extend.colors` and reference CSS variables. Do not duplicate the hex values in multiple configuration files.

---

## 14. Rules for applying colour across the website

1. Keep the majority of the interface white and warm off-white.
2. Use `#5B6F00` for primary actions and meaningful interactive emphasis.
3. Use `#B2C248` as a highlight, not as the default button background with white text.
4. Use `#292929` as the standard foreground; reserve `#0E0F0C` for stronger emphasis.
5. Use `#72726E` for secondary copy; do not use `#ACADA8` for essential small text.
6. Use the four-step neutral surface scale consistently.
7. Prefer subtle borders to heavy outlines.
8. Keep shadows neutral, diffuse and low-opacity.
9. Keep pink, lavender, blue and amber gradient colours in decorative artwork only.
10. Use status colours only when communicating a real state.
11. Do not add unrelated SaaS colours such as saturated purple, electric blue or neon green.
12. Every new colour must be added as a named semantic token and pass contrast checks before use.

---

## 15. Mobbin collection coverage

The supplied public Mobbin collection contains **40 Granola website-section references** across two result pages. The available section taxonomy covers:

- Hero sections and navigation
- Feature explanations and how-it-works sections
- Downloads and use cases
- Social proof and testimonials
- Pricing and comparison
- FAQ, contact and about
- Blog and footer

The collection is a section-level reference library, not a complete crawl of every live URL on granola.ai. The live website audit additionally checked the homepage, pricing, customers, integrations and security pages. The palette in this file is a shared brand/system palette; individual artwork, customer logos and third-party product marks should retain their own source colours rather than being recoloured into the brand palette.

**Mobbin source:** https://mobbin.com/collections/5cd020bf-cd48-4529-b3c8-a3f3dbacc0cc/sites/sections  
**Live pages checked:**  
- https://www.granola.ai/
- https://www.granola.ai/pricing
- https://www.granola.ai/customers
- https://www.granola.ai/integrations
- https://www.granola.ai/security

---

## 16. Source and confidence notes

- **Reference-measured palette:** the 15-colour palette, neutral surface steps, text roles, border colours and decorative gradient stops are reported by Sitepeel's measured Granola website audit (measurement date 29 October 2026; 325 rendered elements at desktop and mobile viewports).
- **Brand-guideline cross-check:** Rainbrand's Granola brand-guideline page independently lists Olive `#5B6F00`, Light olive `#B2C248`, Ink `#292929`, Warm surface `#F7F7F2`, Olive ink `#788C15` and Warm off-white `#FCFCF8`.
- **Derived engineering values:** hover/pressed shades, semantic status colours, focus/control border, overlay extensions and shadow recipes are implementation recommendations. They are explicitly not represented as exact Granola source CSS.
- **No fabricated exactness:** where the public reference does not expose a canonical value (notably the precise shadow recipe), this document provides a conservative production token and labels it as derived.

### Research references

- Granola live website: https://www.granola.ai/
- Granola pricing: https://www.granola.ai/pricing
- Granola customer stories: https://www.granola.ai/customers
- Granola integrations: https://www.granola.ai/integrations
- Granola security: https://www.granola.ai/security
- Sitepeel measured palette and design-system analysis: https://sitepeel.dev/design-md/granola.ai/
- Rainbrand Granola brand guidelines: https://www.rainbrand.com/brand-guidelines/granola/
- Supplied Mobbin collection: https://mobbin.com/collections/5cd020bf-cd48-4529-b3c8-a3f3dbacc0cc/sites/sections
