# World Cup 2026 Sweepstake 🏆

A self-contained static website for running a 6-person sweepstake across all 48
teams of the 2026 World Cup. No build step, no backend — just open
`index.html` (or host the folder anywhere static, e.g. GitHub Pages/Netlify).

## Scoring

| Event | Points |
|---|---|
| Any win, any round (penalty-shootout wins count) | +1 |
| Reaching the Round of 32 | +2 |
| Reaching the Round of 16 | +3 |
| Reaching the Quarter-finals | +4 |
| Reaching the Semi-finals | +5 |
| Reaching the Final | +7 |
| Winning the World Cup | +10 |

Stage bonuses are **cumulative** — the champions bank 2+3+4+5+7+10 = 31 stage
points plus all their win points.

## How to use it

1. **Setup tab** — type the six names, then assign all 48 teams (8 each) with
   the dropdowns, or hit *Randomly assign* for any you haven't decided.
2. **Edit scores** (top right) — after each matchday, type the scores into the
   Matches tab. Group tables, the knockout bracket, and the leaderboard all
   update instantly. For knockout games that finish level, a "pens?" dropdown
   appears to pick the shootout winner.
3. **Bracket tab** — knockout slots fill themselves in from results. The
   third-placed-team slots (FIFA decides those by a chart) are picked manually
   in edit mode once the groups are done.
4. **Share** (top right) — copies a link that carries the full current state
   (names, teams, scores). Send it in the group chat; opening it imports
   everything into that person's browser.

## Where the data lives

- Fixed data (teams, all 104 fixtures, bracket) is in `data.js`.
- `seedResults` in `data.js` holds results that are baked into the published
  site — everyone sees them without needing a share link. Add results there
  as `matchId: [homeGoals, awayGoals]` (knockout shootouts:
  `[g, g, "h"|"a"]`) and redeploy/commit.
- Once your team draw is final, bake it in via `seedPlayers` /
  `seedAssignments` in `data.js` so every visitor sees it by default.
- Everything entered in the browser is saved to that browser's localStorage;
  share links merge state between browsers.

Match ids 1–72 are the group games (in `data.js` order); 73–104 are the
official FIFA knockout match numbers.
