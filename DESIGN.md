# Cultgig — Colour Design System

> **Scope:** colour only. Typography (Bricolage Grotesque for headings, Poppins for body and interface), spacing, layout and motion are defined in code
> (`src/styles/globals.css`, `tailwind.config.ts`). This palette follows the warm olive direction
> supplied by the product owner on 2026-11-23 (reference: granola.ai colour audit) and supersedes the
> earlier plum palette.

**Single source of truth:** every colour is a CSS variable in `src/styles/globals.css`. Tailwind and
shadcn/ui read those variables; no hex values appear in components or in `tailwind.config.ts`.

## 1. Direction

A warm, low-noise light interface. White and warm off-white carry most of the canvas; graphite is the
readable text colour; olive is the brand/action colour; light olive is a supporting highlight.
**Olive is an accent, never a surface system.** No pure black body text, no cool blue-grey neutrals,
no saturated purple, electric blue or neon green.

## 2. Tokens and Tailwind classes

| Role | Hex | CSS variable | Tailwind |
|---|---|---|---|
| Primary action / selected | `#5B6F00` | `--color-brand-primary` | `bg-brand`, `text-brand`, `bg-primary` |
| Primary hover | `#435300` | `--color-brand-primary-hover` | `bg-brand-hover` |
| Primary pressed | `#354200` | `--color-brand-primary-pressed` | `bg-brand-pressed` |
| Primary subtle (selected row, soft tag) | `#F0F2E5` | `--color-brand-primary-subtle` | `bg-brand-subtle` |
| Light olive highlight (dark text only) | `#B2C248` | `--color-brand-light` | `bg-brand-light` |
| Light olive hover | `#A5B43D` | `--color-brand-light-hover` | `bg-brand-light-hover` |
| Light olive subtle | `#F5F6E9` | `--color-brand-light-subtle` | `bg-brand-light-subtle` |
| Olive ink (large text, focus, non-text) | `#788C15` | `--color-brand-ink` | `text-brand-ink` |
| Tertiary decorative | `#E0C976` | `--color-brand-tertiary` | `bg-brand-tertiary` |
| Page / card | `#FFFFFF` | `--color-page`, `--color-surface` | `bg-page`, `bg-surface` |
| Warm band / low raised | `#F7F7F2` | `--color-surface-low` | `bg-surface-low` |
| Panel / inset | `#EAEBE5` | `--color-surface-container` | `bg-surface-container` |
| Hover/pressed fill (never a page bg) | `#D5D5D2` | `--color-surface-container-high` | `bg-surface-high` |
| Text primary | `#292929` | `--color-text-primary` | `text-ink` |
| Text strong | `#0E0F0C` | `--color-text-strong` | `text-ink-strong` |
| Text secondary | `#72726E` | `--color-text-secondary` | `text-ink-secondary` |
| Text muted (disabled / non-essential only) | `#ACADA8` | `--color-text-muted` | `text-ink-muted` |
| Text inverse | `#FCFCF8` | `--color-text-inverse` | `text-ink-inverse` |
| Border default | `rgba(0,0,0,.10)` | `--color-border` | `border-line` |
| Border subtle (warm) | `rgba(71,67,42,.20)` | `--color-border-subtle` | `border-line-subtle` |
| Border strong | `#D5D5D2` | `--color-border-strong` | `border-line-strong` |
| Control outline | `rgba(41,41,41,.18)` | `--color-border-control` | `border-line-control` |
| Focus | `#788C15` | `--color-border-focus` | `ring-line-focus`, `border-line-focus` |
| Selected outline | `#5B6F00` | `--color-border-selected` | `border-line-selected` |

Overlays: `bg-overlay-warm` (`rgba(98,90,34,.06)`), `bg-overlay-04/08/20/40`, `bg-overlay-white-70`.
Shadows: `shadow-xs`, `shadow-sm`, `shadow-md`, `shadow-lg` (base `#0E0F0C` at 6–10%); `shadow-brand`
is rare primary-action emphasis only.

## 3. Status (functional only — always paired with a label or icon)

| Status | Foreground | Soft background | Border | Tailwind |
|---|---|---|---|---|
| Success | `#356B3D` | `#EDF5EC` | `#C9DEC8` | `text-status-success`, `bg-status-success-soft`, `border-status-success-border` |
| Warning | `#805B12` | `#FBF4E4` | `#E9D7A8` | `…-warning…` |
| Error | `#A33A32` | `#FBEFED` | `#EBC8C4` | `…-error…` |
| Info | `#365F78` | `#EDF4F7` | `#C9DCE5` | `…-info…` |

## 4. Interaction state matrix

| State | Background | Text | Border |
|---|---|---|---|
| Primary button | `#5B6F00` → hover `#435300` → pressed `#354200` | `#FFFFFF` | same as bg |
| Primary disabled | `#D5D5D2` | `#72726E` | `#D5D5D2` |
| Secondary button | `#FFFFFF` → hover `#F7F7F2` → pressed `#EAEBE5` | `#292929` | `rgba(0,0,0,.10)` (pressed `#D5D5D2`) |
| Light-accent chip | `#B2C248` | `#292929` | — |
| Subtle chip | `#F0F2E5` | `#5B6F00` | — |
| Input | `#FFFFFF` | `#292929` | control → hover `#72726E` → focus `#788C15` |
| Input disabled | `#F7F7F2` | `#ACADA8` | `#D5D5D2` |
| Selected row | `#F0F2E5` | `#292929` | `#788C15` |
| Hover / pressed row | `#F7F7F2` / `#EAEBE5` | `#292929` | — |

## 5. Decorative gradient (artwork only)

`bg-brand-art` = `linear-gradient(115deg, #FEBE29 0%, #FF91E0 34%, #CEBEF8 68%, #D2E4F8 100%)`.
Never on controls, essential text or whole sections.

## 6. Contrast rules

- Normal text ≥ 4.5:1, large text ≥ 3:1, essential UI boundaries and icons ≥ 3:1.
- `#292929` on white 14.5:1 · `#72726E` on white 4.8:1 · white on `#5B6F00` 6.0:1 · `#292929` on `#B2C248` 6.0:1.
- **Never** white text on `#B2C248` (2.2:1). **Never** `#ACADA8` for essential small text (2.3:1).
- `#788C15` on white is 4.0:1 — large text or non-text accents only.
- Never communicate status by colour alone.

## 7. Rules

1. Keep most of the interface white and warm off-white.
2. `#5B6F00` for primary actions and meaningful interactive emphasis.
3. `#B2C248` is a highlight, never a white-text button.
4. `#292929` is the standard foreground; `#0E0F0C` for strong emphasis.
5. `#72726E` for secondary copy.
6. Use the four-step surface scale; don't invent greys.
7. Prefer 1px low-opacity borders over dark outlines.
8. Keep shadows neutral, diffuse and low-opacity.
9. Gradient colours only in decorative artwork.
10. Status colours only for real states.
11. Every new colour becomes a named token in `globals.css` and passes contrast checks first.
12. Photography and third-party marks keep their own colours.
