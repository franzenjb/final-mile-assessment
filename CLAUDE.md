# CLAUDE.md — final-mile-assessment

## Project facts
| Field | Value |
|---|---|
| Repo | https://github.com/franzenjb/final-mile-assessment |
| Live URL | https://lastmile.jbf.com |
| Vercel project | final-mile-assessment |
| Custom domains | — |
| Local path | ~/dev/final-mile-assessment |

## Operating rules
- Dragon is the user. Be direct, no filler.
- One logical change per task. No unrequested refactors.
- After every code change run `npx playwright test` if tests exist.
- Use `.env` for secrets. Never hardcode. Always `.gitignore` first.
- Visualize UI changes in chat as HTML/SVG before coding.

## Session protocol
1. Start of session: read this file and `sessions/` (or last commit) to recover context.
2. End of session: write a short summary to `sessions/<date>-<slug>.md` or run `mem closeout`.
3. Commit + push with `-c core.hooksPath=/dev/null` (git-secrets hook bypass).
4. Run `bash ~/dev/update-projects.sh` if you created a new deploy, domain, or repo.

## Things to remember
- Accessibility floor: 13px font, #aaa contrast on dark, 44px touch targets.
- GIS coord gotcha: REST extents are Web Mercator (WKID 102100), pass `spatialReference` to `goTo()`.
- DNS changes via Hover take ~15–30 min. Don't risk demos.

## Current state
- (empty — fill in when you start your next session here)
