# Mobile experience

The mobile layer is in `src/mobile-refinement.css`. It loads after the shared theme and enquiry styles. Desktop compositions remain in their existing stylesheets.

## Design decisions

- Keep Brandship ink, blue, light editorial chapters and existing artwork.
- Use a compact glass header with a visible contact action on phones. Do not show the unavailable language switcher there.
- Keep primary controls at least 44 px high. Use 48 to 50 px for form actions, profile arrows and key navigation controls.
- Set main mobile prose to 16 px with comfortable line spacing. Form inputs stay at 16 px to avoid phone focus zoom.
- Give About a single-row, horizontally scrollable chapter rail. Active chapters stay in view without moving the page vertically.
- Bring the enquiry form directly after its short introduction. Move, rather than duplicate, direct email and phone links below the form on phones. Restore their original position on desktop.
- Keep every existing service choice, proposal upload, validation and review step. No extra required questions.
- Preserve swipe browsing and the existing reduced-motion behaviour. Stop the rapidly animated hero grain on phones.

## Navigation behaviour

`src/navigation.js` controls the menu and desktop search. Opening an overlay locks the reading position, makes background content inert and moves focus into the overlay. Tab is contained, Escape closes, and closing restores focus and scroll position. Closed overlays are inert. Navigation links and browser history retain their native behaviour.

`src/mobile-experience.js` handles enquiry contact placement and keeping the active About chapter visible.

## Verification

Run with an installed Playwright module and Chrome executable supplied through `PLAYWRIGHT_MODULE` and `CHROME_EXECUTABLE`. Set `RESPONSIVE_BASE_URL` for a production preview, including the GitHub Pages base path.

- `scripts/check-responsive.mjs`: 12 routes at 320, 390 and 768 px; desktop project deck regression.
- `scripts/check-mobile-experience.mjs`: phone, tablet and landscape header targets; menu focus and scroll restoration; enquiry, proposal upload and review; chapter destinations; browser-dispatched touch swipe; desktop search and enquiry layout.
- Existing enquiry, team, footer and story-connection checks cover their respective behaviours.

Tests intercept submission requests or remain in preview mode. No real enquiry should be delivered by a test.

Before release, also check on a physical iPhone/Safari and Android phone: browser toolbar resizing, notch areas, software keyboard, device file picker, touch scrolling, screen reader navigation and video playback. Browser emulation does not replace these device checks. The enquiry backend is still a separate deployment configuration.
