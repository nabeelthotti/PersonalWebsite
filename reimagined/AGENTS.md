# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Nabeel's design preferences

- Latest mobile direction: phones must retain desktop-style full-screen pinned chapters, layered work cards, outbound Beel motion, and fixed essay pages before Personal. Do not replace motion with a long static layout based on screen size. Shorten the phone project scroll distance; keep a Still view option and respect reduced-motion preferences. This supersedes earlier mobile static essays and horizontal work rail.

- Mobile: preserve the finger/letter entrance, anchoring the nail to the actual l after resize/font loading. Phone hand rises from the bottom; landscape keeps a horizontal composition. Keep the simultaneous wrist sway/page opening. Provide 44px touch controls, a local drag/pinch globe, horizontal work swiping, photo swipes and arrows, readable full-height mobile essays, and no page-wide horizontal overflow. Browser Back should restore the open homepage; a return-to-entrance touch gesture must begin at the top, not fire during ordinary upward reading.

- Native text highlighting uses yellow with dark text everywhere. Desktop has a small cream/oxblood illustrated arrow cursor and a red pointing-hand cursor over links/buttons; preserve I-beam for text and grab/drawing cursors for interactive surfaces. Beel summary: “Go to outreach platform. Releasing soon.”

- Notes stay in a pinned viewport with article content fixed in place; scroll reveals the next opaque article page, with no vertical drifting or faded ghost articles. After the second article finishes, continue into Personal. Story copy ends “right in front of me...”

- Label the shortcut to /about “Skip the scenic route” on the entrance and homepage footer, replacing “Simple Site.” Keep the shortcut unhighlighted; yellow applies to native text selection site-wide, not the link background. It is the playful shortcut for visitors who prefer regular navigation.

- Text selection must work across the whole live site, including chapter labels, captions, links, metadata, and visible hint text. Keep empty animation containers pointer-transparent and put labels above them. Disable native link dragging and suppress link/button activation only when the pointer gesture selects text in that control. Keep globe/canvas geometry interactive. Once the idle hint appears, leave it visible until entry opens so it can be approached and selected.

- Writing-to-life transition: remove the writing progress/divider line. Personal life has an oxblood background with warm-white text to separate it from the cream Writing section, and a proper “Away from the screen.” section heading styled like “Thinking out loud.” above the Travel/Interiors scenes.

- Latest work skip: right-pointing arrow, shuffle through remaining projects and then smoothly scroll into Writing automatically. Do not stop on the last card. Arrow remains usable at the last card to continue directly. Homepage only.

- The animated project collection belongs ONLY on the scrolling homepage. /work is the simple site: project index with search/filters, plus résumé/career history, with no animated gallery or motion controls. Supersedes the earlier instruction to have animated galleries on both pages.

- Both animated work galleries have a down-arrow skip to the final project. Quickly shuffle through remaining cards using the real scroll position, stop on the last card, and keep native scrolling available. User scroll/touch/key input interrupts the shuffle; reduced motion skips directly.

- Entrance: after two seconds of inactivity, show a small “Click me” hint with an arrow pointing to the l. Reset on user activity and hide during opening. Top-right “Simple Site” opens /about. Regular navigation order is About → Work → Notes → Personal → Contact. Personal is a dedicated /personal page containing Away from the screen and shared slideshows, moved out of About. Move career history and actual résumé preview/download from About to Work, with a Resume jump link.

- Latest: Writing is a pinned full-screen scroll sequence: first essay alone, then second essay alone, then Personal life. Never show both side by side. Mobile/reduced motion uses consecutive full-height essay panels. Remove Videos from the homepage, chapter navigation, and writing detail page. Order: Work → Writing → Personal life → Contact. This supersedes the earlier separate Videos section request.

- About’s “The path so far” has the actual résumé PDF alongside the experience list, with a paper preview, “Resume” + arrow link opening a new tab, and a separate Download PDF link. Source is the existing original-site public/NabeelsResume.pdf; do not rewrite its contents.

- About: remove Hosting/Airbnb copy and its photo block. Interior decorating and Travel use manual photo slideshows, sharing the homepage interiorPhotos and globe travelPlaces photo/caption sources so photos always match. Retain explicit placeholders while photos are not supplied.

- Remove the bottom work-gallery navigation strip, including numbered project-name tabs and previous/next arrow buttons. Keep scrolling through the layered gallery and the Still view option.

- Homepage order: Work → Writing → Videos → Personal life → Contact. Writing and Videos are separate sections with separate chapter links. Use the four supplied YouTube Shorts, confirmed titles, and portrait 9:16 thumbnail links. Video data is shared with the writing detail page; no video placeholders remain.

- All visible website text should be natively selectable/highlightable, including hero, active scroll story, channel labels, and work captions. Keep inactive layers inert and preserve globe/canvas drag behavior.

- Restore the full homepage ending after Interiors: Writing & videos, then Contact with the working contact form and social links. The user expects these in the continuous scroll, not only on separate pages. This supersedes the prior instruction that the homepage ends at Interiors. Keep original essays and honest placeholders for video URLs/thumbnails still missing.

- Latest hand correction: sway/pivot the finger toward the right around the wrist (9 degrees), like its hover motion. Do not translate or slide the whole hand sideways. Keep the quicker hand motion and slower simultaneous letter expansion.

- No period after Nabeel in the entrance headline. The hand pullback and letter expansion start simultaneously and start without a delay; the hand finishes in 850ms with an immediate gentle pullback while the letter takes 1.4s with a slower initial easing, giving the fingertip room before expansion; no hand-first delay or two-step opening. This supersedes earlier sequential entrance instructions.

- The homepage entrance contains only the large headline/letter and hand. Remove the top Nabeel Thotti name link, the GTM/Beel blurb, and the click-to-step-in instruction. Interior-page headers remain.

- Beel is an OUTBOUND sequencer: replace incoming text bubbles with nine recognizable channel marks (iMessage, SMS, Call, Voicemail, email, LinkedIn, X, Instagram, Facebook), spreading outward from behind Beel as visitors scroll. Preserve the red palette and a clear still/mobile arrangement.

- On entry, the hand makes a 96px pullback to the RIGHT to clear the letter (latest direction correction), staying on screen, then the sideways letter unfolds into the website. The earlier leftward direction was rejected as wrong. Large withdrawals, flinging the hand offscreen, and extra rotation are explicitly rejected. Preserve proportional page zoom and blur. Keep only one Still view/Motion view toggle in the work gallery heading; remove the duplicate inside the stage.

- Latest refinement: stronger blur on the tiny sideways text and receding hero. Scale all first-page content together with the page during the flip; text must stay proportional, not grow independently. Keep the final reading view sharp.

- Latest motion refinement: softly blur the tiny sideways letter text, then resolve it to sharp text during a slower continuous 1.25s opening. Add modest 3D tilt and a soft-focus receding hero background. Reverse takes 1s. No pauses, spinners or blank frames; full page ends sharp. Supersedes the earlier 650ms timing.

- Latest entrance: put “I started with code.” sideways inside the l in Nabeel where the hand points. Click the letter or finger to rotate/expand that existing text into the real full-page site in ~650ms. No wait cursor, spinner, blank wash, delayed text reveal or long fingernail zoom. Keep the return-upward/relock behavior. This supersedes the nail-only transition.

- The finger is a full-screen locked entrance, not a homepage scroll chapter. Clicking the fingertip expands the nail into the entire website, beginning with the real “I started with code.” scene. Only then can visitors scroll through the website. An upward gesture beyond the beginning returns to the finger and locks content again until another click. Keep regular upward reading within content working. Reduced motion opens/closes directly; Escape skips the transition. This supersedes the prior transient fingertip-text overlay and freely scrollable hero.

- Latest life section: remove the Airbnb/Hosting scene. Keep Travel then Interiors in the scroll sequence. Interiors has left/right photo arrows and up to seven photos configured in `src/data/interiors.js`; use seven labeled placeholders until supplied. Preserve the shared Polaroid size. This supersedes earlier three-scene instructions.

- Remove the visible Map credits disclosure from the globe. Keep source attribution in `public/assets/travel/ATTRIBUTION.txt`. User also explicitly confirmed removing the entire homepage closing section (location line, closing headline, form and social links). Homepage now ends with the life scenes; remove the Hello again chapter and its header anchor. This supersedes the earlier closing-copy/form requirement on the homepage. The separate contact page remains.

- Travel layout: keep the original three-scene sticky scroll sequence: travel first, then interiors, then hosting. All three life Polaroids share the same frame dimensions, image ratio, padding and caption height. Travel uses the interiors/Airbnb size as the reference, and the globe diameter matches their frame width. This supersedes the earlier 50%/645px sizing. Travel copy: “Find a country to open a memory.” Country photos open as Polaroids over the globe, close with X or Escape; keep left-side copy fixed. No blue pointer/scroll focus rectangle; preserve keyboard focus via the globe edge. deep blue water, seafoam visited land and coral selection are approved palette exploration beyond red/white (no pink/yellow). No dropdown, pins, rotate/zoom controls or next/previous place buttons. Drag to discover countries, wheel over globe to zoom, click filled countries for photo. Page scrolling outside the globe continues through the life scenes. Added Mexico, Dominican Republic and Bahamas.

- Travel: an interactive globe with only confirmed visited countries/regions filled. Click a place to open Nabeel’s photo from there; use explicit photo placeholders until supplied. Current list is in `src/data/travel.js` (28 places including UK constituent countries and Jammu and Kashmir). Do not mark Wales or other unlisted places visited. Czechia is the Prague visit. Jammu and Kashmir is a separate photo stop, not a country count. Preserve the confirmed list when adding future trips.

- Closing copy: “That’s a little bit of me. Tell me a bit about you?” Include a name/email/message contact form. Use free FormSubmit delivery to nabeelthotti02@gmail.com. Remove the preview-only notice. Email-owner activation is required once; report activation/errors honestly and keep drafts. Hosting/deployment remains for later.

- Keep the work gallery’s original layered depth animation: multiple cards visible in a stack, moving from the back to the front as the visitor scrolls. The simpler one-project lateral transition was rejected. Keep the spacious surrounding page and current red palette.

- The red hand must layer in front of the hero headline, including its period, rather than behind the text.

- Current accepted direction: one continuous scroll page with clearly divided, spacious scenes. One dominant thing per scene: introduction, progressive story, Beel, moving project gallery, personal life, contact. Optional detail pages remain available. Retain the illustrated hand, recolored a different red; yellow now feels derivative and must be removed from the main direction. Motion is driven by native scroll and pauses when scrolling stops. No signal exercise, room game, version chooser, dense card collection, or required task for visitors. This supersedes earlier palette and interaction instructions below.

- Latest feedback, after the three interactive builds: none is an accepted final direction. The signal exercise is too complicated. The generated room behind the door feels too AI and is removed from the active site. The sofa interaction is fun but feels unrelated to the purpose of a personal website. Research actual personal websites with strong motion and interactions before designing another version. Prefer interactions that reveal Nabeel's real personality/content without making visitors complete exercises.

- Keep only the red edition. The workbench edition is retired; old URLs should resolve to the red site.
- Latest hero direction: https://www.sennep.com/ is an explicit reference, especially its playful finger animation. Nabeel finds the current giant-name/portrait hero insufficiently catchy or creative. Explore an immediately playful personal interaction rather than relying only on decorative scrolling.
- Keep red, eliminate pink and yellow. Use contrasting red shades with warm white; this palette preference supersedes the initial yellow-accent direction.
- Historical: Nabeel initially selected three Sennep-inspired concepts, then rejected all three. `/poke` and `/room` retain previous explorations only; `/door` is retired. Do not restore the illustrated room or treat prior selected mockups as an approved new direction. Research captures and notes are in `qa/personal-references/index.html`.
- Interactions must have a meaningful outcome. Word swaps, furniture that only shifts position, and a door that reveals a navigation menu are insufficient. Each entrance should invite visitors to make, explore, or understand something: a GTM system, a room arrangement, or activities in a personal space. Preserve the selected visual language while giving every gesture a purpose.
- Nabeel likes his current job. Treat this as a personal website; emphasize real interests, perspective, and curiosity rather than recruiting or freelance conversion. Do not invent hobbies or first-person opinions to fill the layout.
- The Work section at https://wodniack.dev/ is an explicit motion reference: use scroll to move through a spatial gallery with depth, large typography, and real project imagery. Adapt that behavior to each edition's own visual identity.
- Keep the motion gallery below the personal introduction. Show the full project collection on the homepage, not a three-project selection. Add purposeful motion to the personal story, Beel, and interests as well. Preserve native scrolling, direct project links, a normal project index, and useful mobile/reduced-motion layouts.
- Netlify and domain work are for later; do not deploy as part of local design iterations.

## Confirmed personal content (October 2026)

- GTM engineer at Syft Data; started as a software engineer and moved toward direct customer problems. Building Beel, his own all-in-one outreach sequencer; present it as in development and feature it above client work.
- Lives in Pleasanton, from Los Angeles. Helps clients decorate their houses, has visited 30+ countries, and hosts an Airbnb in Culver City.
- Made four videos for Syft, including a LinkedIn automation Short. Exact video URLs and thumbnails are still needed.
- Client names are not approved for publication. Use anonymous company types; no internal Syft numbers or private customer records. Metrics in the brief require confirmation and should be omitted meanwhile.
- Public email, booking link, freelance/advisory availability, and new photos are unconfirmed. Use LinkedIn as the main contact CTA; explicit media placeholders are authorized.
- Do not make the homepage a services landing page or recruiting pitch. Name, story, product, interests, writing, and relationships make up the personal site.
