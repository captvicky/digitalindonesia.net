---
name: design-system-basement-studio
description: Creates implementation-ready design-system guidance with tokens, component behavior, and accessibility standards. Use when creating or updating UI rules, component specifications, or design-system documentation.
---

<!-- TYPEUI_SH_MANAGED_START -->

# basement.studio

## Mission
Deliver implementation-ready design-system guidance for basement.studio that can be applied consistently across e-commerce storefront interfaces.

## Brand
- Product/brand: basement.studio
- URL: https://basement.studio/
- Audience: online shoppers and consumers
- Product surface: e-commerce storefront

## Style Foundations
- Visual style: structured, accessible, implementation-first
- Main font style: `font.family.primary=Geist`, `font.family.stack=Geist, Geist Fallback`, `font.size.base=16px`, `font.weight.base=400`, `font.lineHeight.base=24px`
- Typography scale: `font.size.xs=12px`, `font.size.sm=13px`, `font.size.md=16px`, `font.size.lg=20px`, `font.size.xl=24px`, `font.size.2xl=38px`, `font.size.3xl=76px`, `font.size.4xl=87px`
- Color palette: `color.text.primary=#e6e6e6`, `color.text.secondary=#ffffff`, `color.text.tertiary=#c4c4c4`, `color.text.inverse=#757575`, `color.surface.base=#000000`, `color.surface.muted=#2e2e2e`, `color.surface.raised=#1a1a1a`, `color.border.default=#e5e7eb`
- Spacing scale: `space.1=2px`, `space.2=4px`, `space.3=8px`, `space.4=16px`, `space.5=24px`, `space.6=56px`, `space.7=96px`
- Radius/shadow/motion tokens: `motion.duration.instant=60ms`, `motion.duration.fast=300ms`

## Accessibility
- Target: WCAG 2.2 AA
- Keyboard-first interactions required.
- Focus-visible rules required.
- Contrast constraints required.

## Writing Tone
concise, confident, implementation-focused

## Rules: Do
- Use semantic tokens, not raw hex values in component guidance.
- Every component must define required states: default, hover, focus-visible, active, disabled, loading, error.
- Responsive behavior and edge-case handling should be specified for every component family.
- Accessibility acceptance criteria must be testable in implementation.

## Rules: Don't
- Do not allow low-contrast text or hidden focus indicators.
- Do not introduce one-off spacing or typography exceptions.
- Do not use ambiguous labels or non-descriptive actions.

## Guideline Authoring Workflow
1. Restate design intent in one sentence.
2. Define foundations and tokens.
3. Define component anatomy, variants, and interactions.
4. Add accessibility acceptance criteria.
5. Add anti-patterns and migration notes.
6. End with QA checklist.

## Required Output Structure
- Context and goals
- Design tokens and foundations
- Component-level rules (anatomy, variants, states, responsive behavior)
- Accessibility requirements and testable acceptance criteria
- Content and tone standards with examples
- Anti-patterns and prohibited implementations
- QA checklist

## Component Rule Expectations
- Include keyboard, pointer, and touch behavior.
- Include spacing and typography token requirements.
- Include long-content, overflow, and empty-state handling.

## Quality Gates
- Every non-negotiable rule must use "must".
- Every recommendation should use "should".
- Every accessibility rule must be testable in implementation.
- Prefer system consistency over local visual exceptions.

<!-- TYPEUI_SH_MANAGED_END -->
