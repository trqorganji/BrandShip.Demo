# Brandship team profiles

## Sources and mapping

The user supplied `BRANDHSIP Team.pptx`, `Brandship team.key`, and screenshots showing
the board and organisation slides with captions. Portraits are extracted from the
PowerPoint media and associated with the adjacent names using slide coordinates.
No identities were inferred from faces.

- Leadership slide: Ziyad Organji, Nawaf Al-Rajhi, Omar Basamh, Omar Al-Shabaan,
  Abdullah Aljeraiwi, in the supplied left-to-right order. Roles follow the captions,
  with Ziyad's previously confirmed Chairman & Founder wording retained.
- Organisation slide: 31 distinct employees/directors across seven teams.
- The duplicated Lana Trabzoni image on the slide is included once.
- A stray cropped `n Yahya` text object has no associated portrait and is not present
  in the visible organisation screenshot. It has not been turned into a profile.
- Names now follow the supplied slide, including Rayan Organji and Amr Naeim.

The authoritative website mapping is `src/team-people-data.mjs`. `source` records the
original media filename. `image` points to the optimised website copy. Original
presentations and legacy website assets are unchanged.

To regenerate the web portraits on macOS:

```sh
node scripts/prepare-team-assets.mjs '/path/to/BRANDHSIP Team.pptx'
```

This extracts the embedded images and downsamples JPEG copies to a maximum 1,100 px
edge, without enlarging smaller originals. It does not retouch, generate, crop or
change anyone's appearance. The 36
website copies total about 3.4 MB, rather than copying the full presentation media.
The About slider requests one active portrait and only preloads the next nearby one.

## About composition

1. Founder, partners and board: five fixed profiles, never part of the slider.
2. Employees and directors: one centered portrait at a time with name, team and role
   underneath. Department filtering, previous/next controls, keyboard arrows and
   touch swipes remain available without a dedicated pause/play button. The visible
   counter and progress line are removed; slide position remains in accessible labels.
3. Directors' word: an inline message beneath each director's name and role, with a
   centered Brandship blue quotation mark. There is no duplicate white quote card,
   second portrait or separate director picker. Portraits are 240 px wide on desktop
   and 200 px on mobile, with tighter heading and control spacing.

The employee slider advances every three seconds only while visible. Pointer hover,
arrow clicks and touch swipes do not stop autoplay. Keyboard interaction pauses
autoplay until focus leaves the region or the visitor switches back to pointer input.
A hidden browser tab, an offscreen section or reduced-motion preference also stops it.
Manual changes restart
the three-second interval. Each outgoing profile slides left and fades before the
next portrait, name, role and quote enter together from the right. Previous reverses
the direction, while team filtering uses a simple fade. The transition takes 450 ms
(130 ms out, 320 ms in). The next portrait decodes
before the current profile leaves. Rapid navigation cancels outdated transitions.
These transitions use only opacity and transforms. Profiles without a visible director
message collapse the quote wrapper and extra role spacing, bringing the arrows directly
below the role. The controls remain usable with motion reduced. The
separate Team page contains a static directory of the same 31 people.

## Director messages

No approved director quotations were supplied. Every `quote` is therefore `null`.
Do not invent first-person statements or treat generic role descriptions as quotes.
Once the user supplies approved wording, the corresponding record can use:

```js
quote: { text: 'The exact approved message.', approved: true }
```

Only approved messages render as blockquotes. Otherwise the page explicitly says
the message is awaiting approval. Non-director profiles do not display a director
message or reserve an empty quote area. The Directors' word
navigation link opens a director's inline message and focuses the carousel. Keyboard
navigation holds the selected message; pointer navigation keeps automatic rotation.

## Verification

`scripts/check-team-profiles.mjs` checks assets, board membership, all employee names,
profile changes, centered layouts, no counter, forward/reverse animation, rapid navigation,
filters, keyboard/swipe controls, autoplay while hovered and after arrow clicks,
keyboard pause and pointer resumption, reduced motion, safe quote
placeholders and responsive layouts. The general site contrast/build checks also apply.
