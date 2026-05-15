# Collapsible Sidebar — Design

## Problem

The sidebar collapse feature was implemented but has two visual issues:

1. **Collapsed state**: `flex-1` on the `<nav>` stretches the icons across the full sidebar height, leaving large empty gaps between items. The `>` chevron toggle floats isolated at the top. The active item (gear icon) renders at a different size than inactive icons — inconsistent.
2. **Toggle button placement**: The `<` ChevronLeft button sits inside the profile card as a positioned element — it looks like it belongs to the card content rather than being a navigation control.

## Design — Approach B: Dedicated top row

### Expanded state (264px)

```
┌─────────────────────────────┐
│  Ana Almeida                │  ← profile card, no toggle inside
│  CRP 06/123456              │
└─────────────────────────────┘
                     ← Recolher  ← right-aligned subtle text button
  ■ Dashboard
  ■ Pacientes
  ...nav items with text + badges...
┌─────────────────────────────┐
│  ◎ Ana Almeida              │  ← user card
└─────────────────────────────┘
```

- Profile card: no toggle button inside
- Toggle row: `flex justify-end`, `← Recolher` text button, `text-[11px] font-medium text-muted`
- Nav: `flex-1 mt-3 space-y-1.5` — unchanged from current expanded behavior

### Collapsed state (72px)

```
  [›]         ← h-8 w-8, rounded-xl, border, centered at top
  [■]
  [■]         ← h-8 w-8 rounded-2xl, all same size
  [■⁴]        ← badge as number overlay, top-right corner
  [■]         ← active: same h-8 w-8, primary bg
              ← flex-1 spacer
  [◎]         ← avatar only at bottom
```

- Toggle: `h-8 w-8 rounded-xl border` centered, `ChevronRight` icon
- Nav: `flex-none mt-4 space-y-1 flex flex-col items-center w-full`
- All icon buttons: uniform `h-8 w-8 rounded-2xl border border-transparent`
- Active: primary bg, same dimensions (no oversized treatment)
- Badge overlay: `absolute -right-1 -top-1`, `h-4 min-w-4`, `text-[9px]`
- Spacer: `<div className="flex-1" />` between nav and avatar

## Files

- Modify: `apps/web/src/components/shell/sidebar.tsx`
  - Remove ChevronLeft from inside profile card
  - Add toggle row between profile card and nav (expanded)
  - Fix collapsed nav to `flex-none` + spacer div after nav
  - Uniform `h-8 w-8` for all collapsed icon buttons
- No changes to `app-shell.tsx` or any other file
