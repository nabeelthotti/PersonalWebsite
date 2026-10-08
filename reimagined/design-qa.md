## Résumé beside experience — 7 October 2026

Added the original-site résumé beside “The path so far,” with a PDF-rendered preview, Resume arrow link targeting a new tab, and Download PDF link. Copied PDF hash matches the original; the document was not edited. Browser verified preview rendering and link attributes; PDF viewer handling is delegated to the browser. Responsive layout stacks the sidebar on narrow screens. Production build passes. Screenshot: `qa/scroll-chapters/about-resume-sidebar.jpg`.

## About photo collections — 7 October 2026

Removed the Hosting interest, Airbnb photo block, and Airbnb sentence from the About bio. Interior and Travel now use manual Polaroid slideshows sharing the homepage interiorPhotos and globe travelPlaces sources. Extracted the existing interior controls into reusable PhotoSlideshow. Travel defaults now preserve photo/caption values supplied on each place. All sources currently contain placeholders. Browser checked both next buttons, travel wrap 1→28, keyboard return 28→1, and absence of Hosting/Airbnb content. Build passes. Screenshot: `qa/scroll-chapters/about-matching-slideshows.jpg`.

## Confirmed Shorts and separate sections — 7 October 2026

Fetched public YouTube oEmbed titles and confirmed all four max-resolution thumbnail URLs. Replaced placeholders with real Shorts links, dates supplied by Nabeel, and portrait 9:16 thumbnail crops. Shared ShortVideos component serves the homepage and writing page. Homepage order now Work → Writing → Videos → Life → Contact, with individual chapter links. Browser verified all four thumbnails loaded (1280×720 source images), correct destination URLs, visible titles, and DOM section order. Production build passes. Screenshot: `qa/scroll-chapters/shorts-complete.jpg`.

## Native text selection — 7 October 2026

Enabled text selection for site copy and labels, restored pointer interaction on hero text, active story panels, channel labels and work captions, and removed the project-visual selection restriction. Inactive scenes remain inert; globe and canvas handlers are unchanged. Browser verified native drag selection of the hero, story heading and work collection label. Screenshot: `qa/scroll-chapters/selectable-story.jpg`.

## Restored homepage ending — 7 October 2026

Restored Writing & videos after Interiors, followed by the closing contact form and social links. Added both to chapter navigation. The two original essays link to existing articles; four video placeholders use existing data and still need URLs/thumbnails. Contact reuses the existing FormSubmit component without sending a new test message; email activation status remains unverified. Desktop browser verified the writing section, video list, and contact fields. Production build and all 33 tests pass. Screenshots: `qa/scroll-chapters/writing-restored.jpg`, `qa/scroll-chapters/contact-restored.jpg`.

## Beel outbound channels — 7 October 2026

Replaced four incoming text bubbles with eight icon marks: iMessage, SMS, phone call, email, LinkedIn, X, Instagram and Facebook. Native scroll sends the marks from behind the central Beel wordmark outward in staggered paths; Beel gently reduces in size to make room. Updated copy to describe an outbound sequencer. Desktop browser verified eight channels, outward movement on downward scroll, and reverse movement on upward scroll. Mobile/reduced-motion CSS presents the expanded arrangement; the browser viewport override did not change its actual dimensions, so mobile visual QA was not confirmed. Production build passes. Screenshot: `qa/scroll-chapters/beel-outbound.jpg`.

## Tiny leftward hand nudge — 7 October 2026

Replaced the rejected offscreen hand withdrawal with a 20px leftward nudge over 300ms. No added rotation or vertical movement. Browser confirmed transform translation (-20, 0) while the page expands and the hand remains visible. Production build passes. Screenshot: `qa/scroll-chapters/hand-small-nudge.jpg`.

## Hand withdrawal and single gallery toggle — 7 October 2026

Removed the duplicate Still view control inside the work stage; the heading toggle remains and was verified in both directions. Clicking the letter or hand now moves the hand aside for 420ms before the existing 1.25s page flip begins. On return, the hand slides back as the page settles into the letter. Reduced motion still opens directly. Browser verified the hand clearing the letter before expansion and the final story; production build passes. Screenshots: `qa/scroll-chapters/hand-pulls-away.jpg`, `qa/scroll-chapters/work-single-toggle.jpg`.

## Proportional page zoom and stronger blur — 7 October 2026

All first-page content now lives on one viewport-size surface scaled with the expanding page. Heading and body copy retain their final proportions throughout the zoom instead of growing independently. Reduced the sideways label and increased its blur to 1.8px; hero blur reaches 18px. The page resolves from stronger soft focus to fully sharp. Browser verified mid-animation proportions, the sharp final story at scroll zero, and reverse closure. Production build passes. Screenshot: `qa/scroll-chapters/letter-proportional-flip.jpg`.

## Softer, slower letter flip — 7 October 2026

Opening now takes 1.25 seconds with an intermediate 3D tilt and shadow; the hero softly blurs behind it. Tiny sideways text starts blurred and resolves into sharp full-page type. Reverse takes one second. Browser verified the sharp landing at scroll position zero and the return to a locked entrance. Production build passes. Screenshot: `qa/scroll-chapters/letter-soft-flip.jpg`.

## Sideways letter entrance — 7 October 2026

Replaced the slow nail zoom and blank wash with a 650ms letter-to-page flip. The actual l contains the sideways sentence before interaction; both letter and hand open it. The title remains visible throughout rotation/expansion, landing at the measured typography/position of the real first story. Removed cursor:progress (the reported spinner). First-panel motion is neutralized only during measurement to keep the landing position consistent after returning from later chapters. Reverse closure lasts 550ms and retains the existing scroll lock. Screenshot: `qa/scroll-chapters/letter-flip.jpg`.

## Full-site finger entrance — 7 October 2026

Replaced the inline hero-to-story effect with a locked full-viewport entrance. Before clicking, content is hidden and the document measures one viewport (720px in desktop QA). Clicking expands the nail beyond the viewport, then reveals the real story at scroll position zero. Native scrolling then traverses the website. Browser verified: closed-state downward scroll stays at zero; entry reveals the full site; upward reading at 360→216px stays open; scrolling above the start triggers the reverse transition; the returned finger has hidden content and cannot scroll down. Reopening, Escape completion and content navigation were checked separately. Reduced-motion and touch return gestures are implemented. Screenshot: `qa/scroll-chapters/finger-entrance.jpg`.

## Fingertip story transition — 7 October 2026

The hero hand click now zooms the actual camera layer around the nail center, accounting for the hand rotation and hover transform. “I started with code.” appears inside the expanded nail, followed by a brief paper crossfade to the first story panel. Browser verified the zoom frame, normal completion, Escape skip, cleanup of camera transforms, focus on the story and restored native scrolling. Reduced-motion users keep direct anchor navigation. Screenshot: `qa/scroll-chapters/fingertip-story.jpg`.

## Interiors gallery — 7 October 2026

Removed the homepage Hosting/Airbnb scene and shortened the life track to two scenes. Interiors now supports up to seven images, with previous/next chevrons and a counter inside the existing Polaroid caption area. Browser verified next advances 1→2, previous wraps 1→7, and keyboard Right returns 7→1. Frame dimensions remain 486 × 566px at the desktop viewport. All seven entries are explicit placeholders pending real photos. Screenshot: `qa/scroll-chapters/interiors-gallery.jpg`.

## Shared life photo sizing — 7 October 2026

Travel now reuses the same life-photo frame as interiors and hosting, including responsive image proportions and caption height. Browser measured all three desktop frames at 486 × 566px at a 1280px viewport. Globe diameter matches frame width, and the photo is centered on the same stage baseline. Copy is “Find a country to open a memory.” Screenshot: `qa/scroll-chapters/globe-matched-polaroid.jpg`. Responsive styles share the same 90% / 460px width and 1.15 image ratio; attempted viewport override did not change the browser dimensions this pass, so a new mobile screenshot was not verified.

## Globe Polaroid overlay — 7 October 2026

Enlarged desktop globe canvas from 430px to 645px (50%). Photo Polaroid now overlays and dims the globe; left copy stays fixed. X and Escape both close it; focus returns to the globe. Tested with native browser pointer/key events: opening, both closing methods and wheel zoom preserve page scroll position. Pointer/wheel interaction has no blue focus rectangle; keyboard focus uses the circular globe edge. Mobile (390px) shows the complete overlay and close control without horizontal overflow. Screenshot: `qa/scroll-chapters/globe-polaroid.jpg`. Photos remain explicit placeholders.

## Compact globe revision — 7 October 2026

Restored the three shared sticky life scenes: Travel → Interiors → Hosting. Globe reduced to 430px maximum layout width (387px sphere); navy water, seafoam visited countries and coral selection. Removed dropdown, pins, navigation buttons and zoom controls. Browser verified that wheel over the globe changes the projection without changing page scroll position; scrolling beside it advances to interiors and hosting. Clicking France opens its own photo placeholder. Mobile at 390px has no horizontal overflow and presents the three scenes in normal flow. Added Mexico, Dominican Republic and Bahamas, for 28 confirmed places/regions. Tests (33) and production build pass. New screenshot: `qa/scroll-chapters/globe-compact.jpg`. Actual trip photos still need supplying.

## Earlier travel globe — superseded layout

Added all 25 user-confirmed destinations; 24 filled country/constituent-country shapes plus the Jammu and Kashmir photo pin. Geography coverage, UK ring winding, exclusion of Wales/unvisited countries, projection visibility and date-line rotation covered by tests. Browser verified: click France, choose Japan and rotate toward it, drag without changing the selected photo, zoom controls, Northern Ireland and Jammu/Kashmir selection, and phone-width layout without horizontal overflow. Phone keeps native vertical scrolling. Actual personal photos are not provided; each destination intentionally shows its own labeled placeholder. Screenshots: `qa/scroll-chapters/globe-japan.jpg` and `globe-mobile.jpg`.

## Contact delivery update — 7 October 2026

Replaced the Netlify Forms placeholder integration with FormSubmit AJAX to nabeelthotti02@gmail.com. Removed the preview-only notice and static Netlify blueprint. The service documents free unlimited submissions and cross-origin support. Native required/email validation, honeypot, timeout, duplicate-click protection, failure draft preservation, and provider-response checks remain. The activation response is distinct from submission success.

All 29 tests and the production build passed. After explicit user approval, submitted the labeled setup test through the browser to FormSubmit. The provider response triggered the activation-required state; no browser errors were reported. Email-owner activation is pending at nabeelthotti02@gmail.com. Mailbox receipt and final delivery remain unverified. Screenshot: `qa/scroll-chapters/contact-activation-requested.jpg`.

## Current pass — one continuous scroll page (7 October 2026)

Accepted direction: clear, spacious scenes; red hand; contrasting reds and warm white; no yellow-led hero or required activity. Built opening → story → Beel → twelve-project gallery → personal life → contact. Detail pages remain optional. The main navigation jumps between page sections.

Browser verified at 1335×724 and 390×844: red hand asset, opening viewport fit, story progression with PageDown, Beel scene, project advance and focused card, life photo placeholder, mobile menu open/close and chapter jump, all twelve projects in mobile collection, no horizontal document overflow. Screenshots in `qa/scroll-chapters/`. Motion follows native scroll and has media-query fallbacks for reduced motion and short/mobile screens. Reduced-motion CSS was inspected; the OS preference was not changed during QA.

Asset: `public/assets/heroes/poke-hand-red.png`, built-in image generation edit of the existing hand. Prompt: “Change only yellow fill to saturated deep scarlet red (#ad191b with subtle red shading). Preserve exact pose, silhouette, black contours, wrinkle lines, proportions, diagonal orientation, warm-white nail, cropped wrist, and transparency. No pink, yellow, added objects, text or backdrop.” The original asset is retained.

Validation: all 26 tests passed, including new centered-gallery and transition-bound tests; production build passed. Mobile project navigation and Back restoration were also verified. A React dependency warning occurred during hot replacement while editing the effect; the page was fully reloaded afterward.

Historical QA below applies to prior designs, not the current accepted direction.

> Superseded design direction: Nabeel rejected all three concepts after this QA pass. The illustrated door/room is now removed from the active app and archived locally. Reference research: `qa/personal-references/index.html`. Removal validation: 24 tests passed and production build passed (7 October 2026). The record below describes the earlier implementation only.

# Design QA — three purposeful entrances

Date: 2026-10-07

final result: passed within the local prototype and requested placeholder-content scope

## Direction

Nabeel selected all three Sennep-inspired concepts, then rejected decorative interactions without a useful outcome. The three complete site versions are `/poke`, `/room`, and `/door`; `/` defaults to the poke entrance. Red, warm ivory, charcoal, and yellow replace pink. All twelve projects, Beel's lead placement, personal story, interests, essays, and shared routes remain.

The source concepts and initial implementations were reviewed together in `qa/three-heroes/compare-poke.jpg`, `compare-room.jpg`, and `compare-door.jpg`. New activity screens intentionally extend those selected compositions in response to the interaction feedback.

## Experiences and checks

### Poke

- Poking the period springs live typography and opens the GTM playground. A draggable signal token connects to Context; a yellow connection follows the pointer and progression pulses between nodes.
- Browser testing dragged the website signal onto Context, chose an angle, created its prepared draft, edited the wording, and completed human review. Keep was disabled before both review choices were checked.
- LinkedIn-comment and new-role signals produced distinct Maya and Alex drafts. Switching signals reset the prior path. These are fictional prepared examples; no outreach is sent or AI service called.
- Mobile progression brings the active draft into view beneath step navigation. Close remains visible. Escape restored focus to the period and restored scrolling. Keyboard re-entry retained the draft.
- Moving the dialog into a portal fixed inherited homepage paragraph spacing. The final mobile and desktop draft layouts were rechecked.

### Room

- The chair opens a furniture workspace with reading and conversation briefs, two-dimensional dragging, chair direction controls, a lamp, and a side table.
- Browser testing moved the chair out of the walkway, brought the lamp and table within reach, and switched the light on. Feedback changed from individual problems to a completed reading corner.
- PNG export downloaded successfully and was opened for visual inspection. It reproduced the arrangement and lighting.
- At mobile width, selecting the conversation brief and turning both chairs completed the seating requirements. Select and keyboard controls accompany direct dragging. Escape restored focus to the hero chair and unlocked scrolling.
- Four automated tests cover walkways, collisions, lamp proximity and state, conversation direction/alignment, table reach, and bounded movement.

### Door

- Knocking opens the door and enters an illustrated personal room. Book, drawing-desk, and chess-table hotspots open real activities in place.
- The reader shows both original essays with page controls. Long pages scroll within the paper; a cue indicates more text below.
- A legal e2–e4 chess move persisted after returning to the room and opening the board again. The game is explicitly two people sharing one device.
- Keyboard drawing created a mark; it persisted across a room visit and exported successfully as `a-postcard-from-the-room.png`.
- Desktop room composition and mobile room, chess, and drawing controls were checked. Mobile dialog width and scroll width both measured 390px. Nested promotion and drawing Escape handling are guarded in source.

## Evidence

All paths below are in `qa/three-heroes/`.

- `poke-desktop.jpg`, `room-desktop.jpg`, `door-desktop.jpg`: selected heroes at 1536 × 1024.
- `poke-mobile.jpg`, `room-mobile.jpg`, `door-mobile.jpg`: responsive heroes at 390 × 844.
- `poke-system-desktop.jpg`: signal connection workspace at 1440 × 1000.
- `poke-draft-desktop.jpg`: final draft workspace after spacing correction.
- `poke-reviewed-desktop.jpg`: completed human review.
- `poke-system-mobile.jpg`: final mobile draft and persistent close control.
- `room-designer-desktop.jpg`: initial furniture workspace.
- `room-complete-desktop.jpg`: completed reading corner and PNG export status.
- `room-designer-mobile.jpg`: completed conversation arrangement.
- `door-room-desktop.jpg`, `door-room-mobile.jpg`: enterable room.
- `door-reading-desktop.jpg`: essay page two; the scroll cue was added after capture.
- `door-chess-desktop.jpg`, `door-chess-mobile.jpg`: retained e4 position.
- `door-drawing-mobile.jpg`: retained drawing and export controls.

Earlier personal-site QA is in `qa/design-qa-personal-first-pass.md`. Its former pink palette and decorative hero descriptions are historical.

## Content and verification limits

Furniture and rooms are generated conceptual artwork, not Nabeel's home, Airbnb, or client work. Client names remain anonymous. Private records and unconfirmed metrics are excluded. Photos, product artifacts, and video links remain explicitly pending user content; see `CONTENT_CHECKLIST.md`.

Checks used desktop/mobile viewport sizes, mouse interaction, and keyboard controls. This is not a physical-device or complete screen-reader audit. Reduced-motion branches were reviewed in source; browser media-preference emulation was unavailable. Entrance and pulse animations skip or stop for reduced motion, and furniture follows direct input.

`npm test`: 24 passed. Production build passes and produces `dist/client/`, SPA redirects, and compatibility output. Vite reports a non-blocking main-chunk size warning (approximately 513 KB before gzip). The final checked preview console had no errors. Deployment, domains, and Git publication remain outside this local iteration.
