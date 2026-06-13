# Product

## Register

product

## Users

Six friends running a private World Cup 2026 sweepstake. They check the site
mostly on phones, in the evening, mid-match or right after full-time, to see
who moved up the leaderboard. One of them (the owner) types in scores after
each matchday. Nobody reads documentation; everything must be obvious.

## Product Purpose

Track a 48-team sweepstake (8 teams each): enter match scores, compute group
standings and the knockout bracket, and rank the six players with a cumulative
points system (+1 per win, stage bonuses up to +10 for the champions). Success
is the group-chat moment: someone posts a screenshot of the leaderboard to
gloat.

## Brand Personality

Match-day broadcast energy: bold, loud, alive. Like a TV scoreboard graphic or
a stadium big-screen, not an admin panel. Three words: punchy, festive,
competitive. It should feel like the tournament is ON.

## Anti-references

- Generic SaaS dashboard grey-on-dark with one timid accent.
- Spreadsheet energy: rows of identical grey tables with no hierarchy.
- Corporate sports-betting sites (dense, hostile, ad-shaped).

## Design Principles

1. **Scoreline first.** The score and the leaderboard total are the hero on
   every surface; everything else supports them.
2. **Gloat-worthy.** The leaderboard should screenshot beautifully into a
   group chat. Rank 1 must look like rank 1.
3. **Thumb-grade.** Phone-first: big touch targets, no hover-dependent
   affordances, fast on mediocre connections (single static page, no fonts
   heavier than needed).
4. **The data is the decoration.** Flags, team colours, scores and rank
   movement give the page its colour; avoid ornament that carries no
   information.

## Accessibility & Inclusion

No formal WCAG mandate, but: body text ≥4.5:1 contrast, large numerals ≥3:1,
reduced-motion alternative for all animation, no colour-only meaning (player
identity carried by name + colour, qualification state by position + tint).
