# Phillip — animated portfolio

## Open locally

Open this folder in VS Code. In its terminal run:

```sh
npm install
npm run dev
```

Open http://localhost:3000. Use Node.js 20 or later.

For production: `npm run build`, then `npm start`.

## Experience

- The supplied character walks, sits, and triggers a circular water ripple reveal.
- The seated character remains on the top edge of the full page and plays the supplied idle frames.
- The intro plays on every fresh page load, including reloads. The Replay intro button starts it again. Returning from a section does not replay it.
- About me, Projects, My stack and Résumé flip and expand into expanded panels on the same page. Close reverses the animation; Escape and browser Back also work.
- This revision enables the explicitly requested animations by default. Use Tile animations: on/off to control hover and flip motion. Replay intro plays the complete introduction.
- Supplied sprite sheets are read directly at runtime; their transparent margins are normalized without changing the artwork.

## Personalize

- Content and links: `data/site.ts`.
- Replace `public/chibi/phillip.png` with your portrait, keeping the filename, or update the portrait source and alt text in `components/Portfolio.tsx`.
- Your existing email, social links and sample project entries remain placeholders. Set real destinations before publishing.
- Animation and navigation: `components/Portfolio.tsx`.
- Hero design and responsive styling: `app/globals.css`.
- About, projects, stack and contact content remain in their original components.

The About, Projects and GitHub artwork is supplied by you. Contact now uses your supplied speech-bubble icon. LinkedIn uses your supplied pixel icon in the introduction and contact area. Add your profile URL to `site.socials.linkedin` to activate the link. Stack uses your supplied blue pixel layers icon.

## Reference layout

The hero keeps the wireframe's weighted grid without an enclosing rectangle: a thin upper line supports the character above the photo. A wide introduction sits on the left, with About and Projects stacked below, a narrow Stack tile, a taller Contact tile, and a full-height photo tile on the right. On phones, Contact moves to the bottom to keep the other tiles readable. Short summaries remain visible on every navigation tile.

## Color direction

Near-black background with soft purple/pink glows on the left and blue/cyan glows on the right. Glows fade in with the hero reveal. Tiles use translucent charcoal surfaces, backdrop blur, soft borders, restrained icon motion and cool hover highlights.

## Typography and glass refresh

Space Grotesk is used for headings and Fira Sans for body text and controls. Both are bundled locally through Fontsource. Run `npm install` after updating to install the fonts. Hero tiles and expanded panels use brighter translucent gradients, soft highlights and rounded glass surfaces. Expanded panels have a floating white X in the top-right corner, with no dark header strip; Escape still closes them.

The upgraded animation uses twelve walking frames, twelve stopping/sitting frames, and all sixteen seated frames. Frame sizing uses a shared scale to avoid resizing each idle pose.

## Intro timing and repair

Walk for 2.3 seconds, turn/sit over 1.65 seconds, hold the seated pose for 0.5 seconds, then reveal with a 1.6-second ripple (about 6.05 seconds total after assets load). Negative first-frame timestamps are clamped and invalid sprite bounds have a safe fallback, fixing the reported undefined `f.h` crash. Reduced motion and explicit replay remain supported.

## Interaction correction

The support line is visible before the hero reveal. The character walks from the start of that line, stops above the photo center, and sits with his feet below the line. A ResizeObserver maintains alignment on resizing. Each tile has an accent title (violet, mint, gold or blue), a looping hover animation, and a glass surface that samples the background glow. Clicking flips the actual front before expanding its back over 1.15 seconds. Close reverses the sequence. The expanded panel has keyboard focus containment and Escape closes it.

## Animate.css

Animate.css 4.1.1 is installed as a production dependency and imported by `app/layout.tsx`. Its swing, bounce, pulse and tada keyframes handle icon hover/focus effects. Expanded topic content uses `animate__animated animate__fadeInUp`. The tile flip-and-expand and sprite/ripple choreography remain custom because they depend on live element geometry and sprite frames. The tile motion toggle disables hover and content entrance animations. Run `npm install` after updating to install the new dependency.

## Verification pass

Production build and local production HTTP checks pass. Homepage, all eight images and bundled Animate.css keyframes respond correctly. Logic checks cover all four panels at viewport widths 390, 560, 580 and 1200; flip-before-expand, reverse close/Escape, rapid-click protection, motion-off behavior, negative/non-finite initial timestamps, intro skip, and missing/empty sprite fallback. The upgraded sheets contain 24 walking/sitting cells and 16 seated cells. These are code/HTTP checks, not rendered browser or visual mobile testing. Visual QA remains outstanding.

Unconfigured email, GitHub, LinkedIn and project destinations are displayed as coming soon rather than linking to placeholders. Add real values to `data/site.ts` before publishing.

## Focus areas and contact

The hero introduces Web Development, Linux & Systems and Cybersecurity using the supplied artwork. Phillip B. Lisboa and the supplied subtitle sit above the support line. GitHub, LinkedIn and Email pixel icons sit to the right of the character. Contact flips its heading and unfolds an inline list, without opening a panel. Résumé occupies the other half of the former Contact column and opens its own panel. Set `resumeUrl`, `email` and `socials` in `data/site.ts` to enable real destinations; no résumé PDF or contact details have been invented.

## Latest tile refinements

Contact remains 210px tall in both states. Its icon fades away, the title rises, and the three contact methods appear in the same footprint. The name and subtitle now rise from the upper line on the left during the hero reveal. Social icons are hidden until that reveal too. The new Linux & Systems emblem replaces the previous artwork. Tile icons use alpha-bound view boxes and a shared 48px size, leaving the original artwork intact. My stack is split into Stack and Next steps; the latter opens a panel for Building now, Learning next and Coming up. Edit this draft in `components/NextSteps.tsx`.

## Varied layout, motion and workstation

About Me and Projects are broader than the supporting tiles; the portrait remains tall. All nine content/navigation cards have centered 48px icons. Focus cards and navigation tiles have hover treatments, with Animate.css icon motion (including Next steps, Résumé and Contact). The full supplied About Me story replaces the placeholder copy. The supplied workstation sheet is displayed beneath the hero as a centered 12-frame loop at 280ms per frame. It pauses when offscreen, when the browser tab is hidden, or when animations are off. Original PNG artwork is preserved; frame rectangles are in `data/workstationFrames.ts`.

## Aligned grid and closing transition

Three equal focus cards share a common outer grid with the wide About/Projects cards, narrow Stack/Next steps cards and the Résumé/Contact row. The new About caption is “Turning curiosity into code, systems, and security.” Python and Java are included in My stack, LinkedIn is configured, and the hoodie portrait replaces the earlier placeholder. Closing keeps the panel mounted and animates a snapshot back to its source tile to avoid the previous abrupt content removal. CV language slots are provisionally English and German; set their PDF URLs in `site.resumes`. No replacement workstation sprite or CV PDFs were included with this request, so the existing workstation remains and CV downloads are pending.

## Supplied CVs and replacement workstation

Both original CV PDFs are now bundled in `public/cv`, with working English and German links in Résumé. The files are unmodified. PCUPDATE replaces the old workstation sheet; its 12 frames are mapped against the new 1774×887 dimensions and transparent row boundaries. The centered placement, loop controls and visibility pauses are preserved.

## Continuous transition timing
Opening uses one 660ms timeline (200ms flip, 460ms expansion); closing uses 620ms (420ms shrinking, 200ms flip). The phases share a boundary with no delay. The final content entrance lasts 160ms. GitHub now points to lisboaphe and omachi-pet is linked from Projects. Its detailed description awaits README content.
