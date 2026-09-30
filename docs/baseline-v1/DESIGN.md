---
name: Ladera
description: A forest-and-ivory photographic wine experience with a shared editorial stage.
colors:
  forest: "#111C16"
  ink: "#080F0B"
  ivory: "#F4F0DF"
  amber: "#BDA66D"
  muted: "#D5D6C9"
  rule: "rgba(244,240,223,.32)"
  focus: "#ffe3a0"
  primary-hover: "#fffbee"
  secondary-fill: "#080f0b99"
  field-fill: "#08100bcc"
typography:
  display:
    fontFamily: "LaderaDisplay, Arial, sans-serif"
    fontSize: "clamp(54px, 6.1vw, 106px)"
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: "-0.055em"
  headline:
    fontFamily: "LaderaDisplay, Arial, sans-serif"
    fontSize: "clamp(46px, 5.2vw, 88px)"
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: "-0.055em"
  body:
    fontFamily: "LaderaSerif, Georgia, serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.5
  control:
    fontFamily: "LaderaSans, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.4
  eyebrow:
    fontFamily: "LaderaSans, Arial, sans-serif"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0.22em"
rounded:
  control: "2px"
spacing:
  page-pad: "clamp(20px,5vw,80px)"
  action-gap: "14px"
  field-gap: "16px"
  content-gap: "26px"
components:
  button-primary:
    backgroundColor: "{colors.ivory}"
    textColor: "{colors.ink}"
    typography: "{typography.control}"
    rounded: "{rounded.control}"
    padding: "12px 22px"
    height: "52px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-secondary:
    backgroundColor: "{colors.secondary-fill}"
    textColor: "{colors.ivory}"
    typography: "{typography.control}"
    rounded: "{rounded.control}"
    padding: "12px 22px"
    height: "52px"
  button-secondary-hover:
    backgroundColor: "{colors.forest}"
  input:
    backgroundColor: "{colors.field-fill}"
    textColor: "{colors.ivory}"
    rounded: "{rounded.control}"
    padding: "10px 14px"
    height: "52px"
  format-option:
    textColor: "{colors.ivory}"
    rounded: "{rounded.control}"
    padding: "10px 16px"
    height: "52px"
  format-option-selected:
    backgroundColor: "{colors.ivory}"
    textColor: "{colors.ink}"
---

# Design System: Ladera

## Overview

**Creative North Star: "The Shared Vineyard"**

A forest-and-ivory photographic collage inherits the supplied Ladera production kit. Warm light from the upper right, dark granite, a single vineyard landscape and fixed product cutouts create an apparent shallow camera move. This is an established visual identity to preserve, not a new art direction.

Bold, tightly tracked local sans headlines sit beside quieter serif reading copy. Real HTML remains legible above the imagery; tonal veils provide contrast while controls stay restrained and direct. The supplied wordmark, local DejaVu fonts and master photographs are binding visual assets.

**Key Characteristics:**

- One shared photographic world with warm upper-right light.
- Bold compact headlines, serif reading copy and restrained sans controls.
- Forest and ink surfaces, ivory type and sparing amber accents.
- Shallow scene motion on capable layouts; complete static content in normal flow elsewhere.

This document records the inherited system in scan mode. Visual authority is `PROMPT_CODEX.md`, the supplied `ladera-handoff/docs/DESIGN_CONTRACT.md`, and its content, motion and token specifications. Implementation facts come from `src/styles/` and the Astro components. The North Star is a descriptive name for that supplied world, not a newly commissioned identity.

## Colors

### Primary

Forest and ink anchor the dark landscape and quiet interface surfaces. Amber is a restrained accent for selection, caret and active profile decoration; the warm photography supplies the principal warmth.

### Neutral

Ivory provides headlines, body text, control fills and borders. Muted ivory softens supporting labels. The translucent ivory rule separates content without introducing raised panels. Focus gold makes keyboard position visible. Primary hover warms the ivory fill; translucent secondary and field fills preserve the photographic context.

**The Shared Landscape Rule.** Preserve the same landscape through origin, grape and tasting notes; contrast comes from local tonal veils rather than a replacement image.

## Typography

Display uses **LaderaDisplay**, the supplied DejaVu Sans Bold. Controls and labels use **LaderaSans**, the supplied DejaVu Sans regular. Reading copy uses **LaderaSerif**, the supplied DejaVu Serif regular. Their WOFF files are served locally. Fallback families are resilience measures, not delivery substitutes. The logo is the supplied SVG with outlined lettering.

The frontmatter display and headline scales describe the enhanced desktop scene. Stacked hero type uses `clamp(28px, 8.6vw, 62px)`; stacked chapter headings use `clamp(32px, 9.3vw, 60px)`. Enhanced serif copy uses `clamp(20px, 1.65vw, 27px)` and stays within approximately 34 characters per line. Product naming and narrative subtitles use the same serif family. Commerce headings use their observed responsive scale rather than the larger hero scale.

**The Pinned Type Rule.** Keep the supplied tight display tracking and small, widely spaced uppercase eyebrows. Do not apply generic typography corrections to these intentional identity choices. The exact hero headline is ?UN LUJO EN NAVALUENGA?.

Eyebrows are noninteractive labels. Controls and fields use at least 16px text; supporting notes and chapter navigation retain their observed smaller editorial sizes.

## Layout

The repeated page gutter uses the frontmatter page-pad token. The fixed desktop header is 76px tall; at widths up to 1099px it becomes 68px, with a compact wordmark and menu. Main navigation and direct purchase access remain available without forcing a journey through the narrative.

The enhanced narrative is one bounded track of five viewport-height units and a sticky viewport-height stage. The five states are inicio, origen, uva, nariz and boca. Copy appears on the left for inicio, origen and boca, and on the right for uva and nariz. The hero copy occupies 58% of the stage, later left copy 49%, and right copy 43%. The underlying composition positions remain sourced from `ladera-handoff/spec/motion.json`.

Enhancement requires width at least 1100px, height at least 700px and no reduced-motion preference. This deliberately conservative implementation stacks all tablet widths through 1099px and short desktop windows. Stacked sections place the heading above centered artwork, then reading copy and actions; height grows with content. The central artwork uses `clamp(280px, 44svh, 420px)`. No horizontal text movement is introduced.

Purchase and tasting remain in normal flow. At 768px and above the purchase panel becomes two columns and the date/person fields share a row. Below this, both stack. Inputs and standard actions have a 52px minimum height; compact header buttons and menu controls retain 48px minimum targets, and supporting text navigation retains at least 44px targets. The frontmatter component height records this minimum, not a fixed clipping height.

## Elevation & Depth

Depth comes from the supplied landscape, photographic cutouts and translucent tonal layers. Interface components have no decorative box shadows. The scene order is landscape, shade, bottle/grapes/glass, branch, local reading veil, HTML copy, then navigation. The implementation header sits above the stage at z-index 30. Decorative layers do not intercept pointer input.

A right-side reading veil becomes visible for right-aligned chapters; it preserves the landscape while making text legible. Dialogs use a dark backdrop and a flat forest surface. The tasting photograph is an editorial cut to another view, not a geometrically continuous camera move.

## Shapes

Controls are nearly square, with the supplied small corner radius. Thin ivory or translucent ivory borders define actions, fields and options. Dividers are single-pixel rules; tasting descriptors are underlined serif text rather than rounded badges. Photographic silhouettes retain their native aspect ratio and transparent padding. No independent reconstruction of the bottle label is allowed.

## Components

### Buttons

Restrained, rectangular actions use the frontmatter primary and secondary variants. Primary hover warms the fill; secondary hover becomes forest. Background and text transitions use the fast duration. Keyboard focus has a three-pixel gold outline offset by five pixels. Disabled controls retain their shape, lower opacity and show a wait cursor. Actions wrap or stack instead of clipping text.

### Inputs / Fields

Dark translucent fields use visible labels, thin rules and the shared corner language. Date, quantity and attendee controls use 16px text and dark native control chrome. Associated validation text uses focus gold. Purchase format options are native radios rendered as adjacent rectangular choices; the selected option inverts to ivory with ink text, and focus is applied to its visible label.

### Navigation

Desktop links are plain sans text with an underline on hover. A fixed header keeps the supplied SVG wordmark and purchase action available. The compact menu opens a native dialog. Chapter navigation uses a thin upper rule and an ivory underline for the current state; profile links use an amber underline. Preserve actual anchor destinations and visible focus behavior.

### Tasting Descriptors

Short serif descriptors form a wrapping row with a fine bottom rule per item. Keep them as descriptive tasting language, not ingredients or interactive filter chips.

### Shared Scene

A single reused landscape and one instance of each bottle, cluster, glass and branch comprise the enhanced stage. Movement uses transform and opacity, smoothstep easing and a transition fraction of 0.22, leaving reading plateaus. Keep the glass upright. Purchase and tasting never join the sticky sequence.

GSAP and ScrollTrigger load dynamically only when the enhanced layout qualifies. Mode changes revert the GSAP context, remove the shared scene and restore every chapter to accessible normal flow; listeners and observers are cleaned up. Mobile has no scroll-driven decorative displacement, which is within the supplied maximum of 12px. Reduced motion removes the pinned sequence and transforms, including the static mobile bottle tilt. Motion is a progressive enhancement, never a requirement for reading content.

## Do's and Don'ts

### Do:

- Do reuse the supplied wordmark, local fonts and unchanged master assets.
- Do preserve the exact hero title, pinned eyebrow styling and tight display tracking.
- Do use the reading veil behind right-aligned narrative copy.
- Do keep purchase and tasting in normal document flow with visible labels and focus.
- Do grow stacked sections to fit complete text, imagery and actions.

### Don't:

- Don't regenerate, mirror, relabel or distort the photographic assets.
- Don't replace the shared landscape between origin, grape and tasting-note chapters.
- Don't rotate the filled glass, morph photographic subjects or imply continuous 3D travel into the tasting image.
- Don't add scroll-jacking, a special cursor, mandatory video, default audio or continuous decorative animation.
- Don't substitute system fonts, round the controls into pills or turn page screenshots into backgrounds.
