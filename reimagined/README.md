# Nabeel Thotti

A personal website about Nabeel’s work in GTM engineering, the products he is building, his writing, and life outside work. It uses the red visual direction throughout.

The site lives in `reimagined/`; the original application at the repository root is retained separately. The homepage begins with a locked finger entrance. Clicking opens the scrolling website: progressive personal story, Beel, the full twelve-project gallery, and personal interests. After Work, a pinned Writing sequence shows each essay alone at full-screen size before leading into personal life, followed by a closing contact form and social links. Videos are removed from the homepage and writing page. The separate writing and contact pages remain available. Scroll drives the desktop scenes. Mobile uses normal reading flow and a swipeable project collection; reduced-motion preferences remove the pinned story transitions. Optional detail pages remain available.

The illustrated hand has been recolored red; yellow is no longer part of the homepage direction. Photos and private project artifacts remain explicitly marked placeholders. Earlier concept URLs load the current homepage; the illustrated door room remains archived in `qa/retired-door/`. Current screenshots are in `qa/scroll-chapters/`.

## Development

Use Node.js 22. From `reimagined/`:

```sh
npm install
npm run dev
```

Open the local address printed by Vite. Run checks and create the production build with:

```sh
npm test
npm run build
```

The deployable browser site is generated in `dist/client/`. There is one canonical build; no variant environment variable or separate edition build is required.

## Content and routes

| Route | Content |
| --- | --- |
| `/` | Personal introduction, all 12 work entries, writing, videos, and personal interests |
| `/poke`, `/room` | Legacy aliases displaying the current scroll homepage |
| `/work` | All 12 entries in the motion gallery and a searchable project index |
| `/work/:slug` | Project or case study, with real screenshots or clearly identified visual placeholders |
| `/how-i-work` | The GTM workflow, including account research, outreach, reporting, and agent operations |
| `/writing` | Two original essays and four linked YouTube Shorts with portrait thumbnails |
| `/writing/:slug` | The complete original essay and its PDF |
| `/about` | Career story, current work, locations, interests, and experience |
| `/contact` | Confirmed contact channels; public email and booking are awaiting confirmation |
| `/draw` | An interactive drawing pad inspired by Rekognize |
| `/chess` | Chess for two people sharing a device |

The work collection starts with **Beel**, an outreach sequencer in development. It also includes Syft GTM, four anonymized engagements, and the six original engineering projects. The homepage and Work page both expose the complete collection.

The profile reflects Nabeel’s current role as a GTM engineer at Syft Data, his move from software engineering into customer-facing GTM, his Los Angeles background, and his current home in Pleasanton. Interior decorating, travel, and hosting in Culver City are part of the personal story.

Legacy paths such as `/projects`, `/articles`, and `/rekognize` resolve to their current pages. The old résumé is retired from the current public presentation. Unknown routes display the site’s 404 page.

## Interaction behavior

The three entrances use original generated artwork inspired by the human interaction on [Sennep](https://www.sennep.com/). Each leads to a different activity:

- **Poke:** springy typography opens a GTM playground. Drag a fictional signal onto Context, choose a conversation angle, edit the resulting prepared draft, and review it before keeping or copying it. Three signals have different branches. No outreach is sent and no AI service is called.
- **Room:** arrange a reading corner or conversation space. Move furniture in two dimensions, turn chairs, and switch the lamp on. Feedback responds to blocked walkways, collisions, lighting, seat alignment, and table reach. Save the arrangement as a PNG.
- **Door:** enter a room with an essay book, drawing desk, and chess table. Read the two original essays with page controls, create a downloadable postcard, or play chess on the same device. Drawing and chess progress survive returning to the room during the visit.

Each experience has keyboard controls, close/Escape behavior, and scroll-lock cleanup. Reduced motion skips the entrance and pulse animations; furniture movement follows direct input. The furniture and room are conceptual artwork, not photos of Nabeel’s actual interiors or Airbnb. Shared pages use red, warm white, charcoal and yellow, with pink removed.

The work gallery uses native scrolling and CSS perspective. Selectors bring any project into view, and a separate link opens its detail page. A Still view control removes the motion. Reduced-motion preferences default to the still layout; smaller screens use a native horizontal rail or static layout. There is no wheel interception.

The drawing pad supports pen, eraser, undo, touch input, keyboard drawing, and PNG download. It does not run the original handwriting recognition model. Chess uses `chess.js` for legal moves and game state; it has no online matchmaking or AI opponent.

## Content maintenance

- `src/data.js`: projects, profile, and confirmed video titles/links/thumbnails.
- `src/articles.json`: full text extracted from the original essay PDFs.
- `src/variants/RedHome.jsx`: homepage composition.
- `src/components/`: shared pages, project visuals, gallery, drawing, and chess.
- `src/lib/navigation.js`: canonical paths and legacy aliases.
- `public/assets/`: published images and other assets.

## Search, AI answers, and images (October 8, 2026)

The build now pre-renders the actual React pages into HTML. Every indexable route gets its own title, description, canonical URL, social metadata, and JSON-LD. The same data drives browser navigation metadata. `/about` identifies Nabeel with `ProfilePage`/`Person`; essays identify their author and original publication date. The biography remains in `src/data.js` so copy edits flow into the rendered site without maintaining a second SEO-only bio.

`scripts/prerender.mjs` generates `robots.txt`, a page/image sitemap, permanent redirects for retired paths, and a true Netlify 404 fallback. The MCP proxy is preserved. Unknown URLs no longer receive a successful homepage response on Netlify. The Sites worker is retained unchanged and is not the production host for this domain.

Live audit before this change: `/`, `/about`, `/robots.txt`, `/sitemap.xml`, and a nonexistent URL all returned the same empty React shell with HTTP 200. There was no canonical or structured data. These are confirmed technical weaknesses, not proof of Google's specific exclusion reason; only the site's Search Console can report that.

### Adding real photos

1. Put public JPG, PNG, WebP, or AVIF photos in `public/assets/photos/`. Use descriptive filenames such as `nabeel-thotti-japan.jpg`. Optimize file sizes; keep a good-resolution original suitable for the displayed size.
2. Set `profile.portrait` in `src/data.js` to `{ src: '/assets/photos/nabeel-thotti-portrait.jpg', alt: 'Nabeel Thotti in San Francisco', width: 1200, height: 1500 }`, using the actual dimensions and an accurate description. The portrait appears on About and supplies the Person image and homepage/About sharing image.
3. In `src/data/travel.js`, set a place's `photo`, `caption`, and optional `alt`, `width`, and `height`. Describe the actual image; if Nabeel isn't in the frame, don't claim he is.
4. In `src/data/interiors.js`, fill `src`, `alt`, `caption`, and optionally `title`, `width`, and `height`. Don't claim Nabeel took a photo unless confirmed.
5. Rebuild. Real photos receive image markup on About and image sitemap entries without separate album or photo pages. The portrait is not clickable; travel and interior photos remain in the existing galleries. Missing configured local files fail the build; null placeholders are excluded from indexing/image schema.

### Deployment and owner setup

- Run `npm run build` and `npm test` before deploying. `npm run test:seo` checks generated HTML, metadata, content, sitemaps, redirects, and future photo configuration.
- Deploy through the existing Netlify build. Check that `/robots.txt` is text, `/sitemap.xml` is XML, `/about` includes the biography in View Source, and a random nonexistent URL returns HTTP 404. Run the Google Rich Results Test against `/about` and an essay after deployment.
- Verify `nabeelthotti.com` as a Domain property in Google Search Console using its exact DNS TXT verification value. Do not invent a verification token. Submit `https://nabeelthotti.com/sitemap.xml`, inspect `/` and `/about`, and request indexing once. Check Google's selected canonical, rendered HTML, exclusion reasons, security issues, and manual actions.
- Use the same official website link on Nabeel's existing LinkedIn, GitHub, X, and YouTube profiles. Ask for an accurate linked author/team bio on Syft if appropriate; this is an owner/editor action, not something the site code can supply.
- After adding photos, inspect their landing pages and track Search Console's Image search performance for the name query. Discovery, indexing, appearance in AI answers, and ranking first are not guaranteed. Monitor Web impressions for `Nabeel Thotti` as well as Image impressions over the following weeks.

Research sources: [Google JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics), [Google image guidance](https://developers.google.com/search/docs/appearance/google-images), [ProfilePage markup](https://developers.google.com/search/docs/appearance/structured-data/profile-page), [AI features](https://developers.google.com/search/docs/appearance/ai-features), [sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), [requesting a recrawl](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl), [OpenAI search crawlers](https://developers.openai.com/api/docs/bots), and [Netlify redirect/404 behavior](https://docs.netlify.com/manage/routing/redirects/redirect-options/).

Google says no special AI file or schema is required for AI Overviews/AI Mode. We prioritize crawlable original content and accurate identity rather than adding synthetic FAQs, keyword stuffing, or a supposed ranking boost from `llms.txt`. The wildcard robots policy permits public search crawlers, including Googlebot, Googlebot-Image, Bingbot, and OAI-SearchBot. Training-bot policy has not been changed separately.

See [CONTENT_CHECKLIST.md](./CONTENT_CHECKLIST.md) for the remaining images, links, and confirmations. Client names, private customer data, and unconfirmed performance metrics are excluded. Visual placeholders represent content slots, not screenshots or evidence of results. Beel remains labeled as in development.

GitHub has been verified. LinkedIn uses the URL from the original portfolio. The supplied X and YouTube handle paths still need checking; blocked public fetches do not establish that those links are broken.

## Netlify

For a Git-connected deployment:

- Base directory: `reimagined`
- Build command: `npm run build`
- Publish directory: `dist/client`

The build includes SPA redirects for direct visits to nested routes. Domain work is separate. These settings document a future deployment; they do not mean the site has been published.

## Asset credits

Original engineering screenshots and essays come from the [PersonalWebsite repository](https://github.com/nabeelthotti/PersonalWebsite). Generated decorative assets are kept separate from project evidence.

Chess piece SVGs are by Colin M. L. Burnett, from [Lichess’s CBurnett set](https://github.com/lichess-org/lila/tree/master/public/piece/cburnett), under [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/). The asset directory includes attribution. Fonts are self-hosted through Fontsource, and interface icons use [Phosphor](https://phosphoricons.com/).

The gallery’s spatial motion is influenced by [Wodniack’s Work section](https://wodniack.dev/), adapted to this site’s typography, red palette, and content. Browser verification and its limits are recorded in `design-qa.md`.

## Contact form

The homepage ending and `/contact` share `ContactForm`. Submissions go directly to [FormSubmit](https://formsubmit.co/documentation), addressed to **nabeelthotti02@gmail.com**. The service documents free, unlimited forms/submissions and cross-origin AJAX support. No Netlify Forms usage, server function, API key, or paid plan is needed. Static Netlify hosting uses the same HTTPS endpoint.

The email owner must click the one-time FormSubmit activation email triggered by the first submission. Do not claim mailbox delivery until an actual message is received. The confirmation may provide an opaque recipient token; optionally set `VITE_FORMSUBMIT_ID` to that token before building to replace the email in the endpoint. No token is required for the email-address endpoint.

The form sends name/email/message, uses email as Reply-To, includes a honeypot, validates required fields/email, times out stalled requests, prevents duplicate clicks, and preserves drafts on failure or activation requirements. Only a successful provider response clears the form; the success notice says “submitted”, not “delivered”. Local and deployed forms use the same real service. No preview-only warning is shown.

When deploying the site, submit a clearly labeled test from the final Netlify URL and confirm receipt in Gmail. No deployment is performed by this local integration task.

## Travel globe

The Life chapter contains a draggable orthographic globe, with the 28 confirmed travel destinations in `src/data/travel.js`. Only those shapes are filled. England, Scotland and Northern Ireland use separate boundaries; Wales remains unvisited. Jammu and Kashmir is a separate photo stop selected by clicking its region; Prague is labeled Czechia. The UI counts places, not sovereign countries.

To add real photographs, put each file in `public/assets/travel/` and set that destination’s `photo` to its public URL (for example `/assets/travel/japan.jpg`), plus an optional `caption`. Each currently has an explicit placeholder; no trip photos or memories have been invented. Broken images fall back to the placeholder. Add new destinations to the same list when confirmed.

The bundled map is `public/assets/travel/world.json` (279 KB, lazy-loaded when near the section). Source and license details are in `public/assets/travel/ATTRIBUTION.txt`. No external map API, paid service or runtime CDN is used. The globe is the first of the three life scenes, followed by interiors and hosting. Drag to rotate, wheel over the globe to zoom, and click filled countries for Polaroid photos over the globe. Close them with X or Escape. Travel, interiors and hosting use the same Polaroid frame dimensions, image ratio and caption height. The globe diameter matches the frame width; all sizes respond together on smaller screens. There are no pins, dropdowns or visible globe controls. Arrow keys rotate and +/− zoom when the globe is focused. Motion follows reduced-motion preferences.


## Interior photo gallery

The homepage life sequence is Travel → Interiors; the Airbnb scene has been removed. Interiors uses the shared Polaroid with previous/next arrows and keyboard Left/Right navigation. Nine supplied home photos are configured in `src/data/interiors.js`, shared with About and the image sitemap. Add or remove entries in that array and edit their `alt` and `caption` as needed. There is no fixed photo limit. No upload/admin interface is included.


## Letter entrance

“I started with code.” sits sideways inside the l in Nabeel, where the finger points. Clicking either the letter or hand simultaneously pivots the hand 9 degrees around the wrist over 850ms and expands and rotates the same text into the full-screen first story page in 1.4 seconds, with a gentle 3D tilt. The smaller sideways text starts blurred; the entire page and its typography scale together into focus as the hero recedes into a stronger blur. There is no wait cursor or blank/loading interstitial. Content is already mounted locally; the entrance simply controls its visibility. An upward gesture beyond the start closes the page back into the letter in one second and locks scrolling until another click. Reduced motion opens/closes directly; Escape completes the transition.

The entrance offers a Simple Site link to `/about` and a Click me hint after two idle seconds. Regular navigation is About, Work, Notes, Personal, Contact. `/personal` contains the shared travel and interiors slideshows; Work includes career history and the résumé PDF preview/download.
