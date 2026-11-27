// Each project is one timeline on the page, in this order.
//
// Project fields:
//   slug     short id used in the link, e.g. /#fpv-drone (lowercase, dashes)
//   code     short label for its dots, e.g. "FPV" gives FPV·1, FPV·2 …
//   title    name shown on the page
//   color    the timeline's color
//   years    e.g. "2024 – 2025" or "2025 – now"
//   tagline  one sentence on what it is
//   role     your part in it, e.g. "Propulsion team, 1 of 12"
//   links    buttons: [{ label, url }]
//
// Milestones (the stops on the timeline, oldest first):
//   date      "2025-03-14", "2025-03" or "2025". Leave "" if you don't know it yet.
//   title     a few words
//   short     one sentence for the hover card in the project list at the top
//             (if left out, the first sentence of text is used)
//   text      1–3 sentences: where the project stood at this point
//   image     a photo or screenshot, e.g. "/img/fpv-drone/first-flight.jpg"
//             (put images in static/img/<slug>/; landscape, about 1600px wide)
//   imageAlt  what the image shows, for screen readers
//   upcoming  true for a step that hasn't happened yet

export const projects = [
  {
    slug: "trel",
    code: "TREL", // short label for dot ids, e.g. TREL·2
    title: "TREL",
    color: "#7b4bc4",
    years: "", // TODO
    tagline: "TODO: one sentence on what TREL is and what you worked on.",
    role: "", // TODO
    links: [],
    milestones: [
      // TODO: replace these placeholders with real milestones.
      { date: "", title: "Placeholder: joined the team", text: "What team or subsystem you joined and what it was working toward." },
      { date: "", title: "Placeholder: your first part", text: "Something you designed, built or tested." },
      { date: "", title: "Placeholder: test or launch", text: "What happened and what the team learned." },
    ],
  },

  {
    slug: "2dbeamcalc-motion",
    code: "BC", // short label for dot ids, e.g. BC·2
    title: "2dbeamcalc-motion",
    color: "#2d5bd8",
    years: "2026 – now",
    tagline:
      "A browser tool for designing linkages: sketch a mechanism, run it through its motion, and see the load on every joint and motor.",
    role: "Solo project", // TODO: confirm
    links: [
      { label: "Try it", url: "https://2dbeamcalc-motion.traviszavaleta.workers.dev" },
      // The GitHub repo is private, so no "Source" link. If you make it public, add:
      // { label: "Source", url: "https://github.com/travis-z/2dbeamcalc-motion" },
    ],
    milestones: [
      {
        date: "2026-10-08",
        title: "First working version",
        short: "First version: the math worked, the screen was crowded.",
        text: "The math came first: a solver that finds every link's position as the mechanism moves, and the force each joint and motor has to hold. It worked, but the screen was crowded.",
        image: "/img/2dbeamcalc-motion/v1-fourbar-motion.jpg",
        imageAlt: "First version of the app simulating a four-bar linkage, with motion charts underneath.",
      },
      {
        date: "2026-10-09",
        title: "Redesign, same numbers",
        short: "Redesigned the look without changing a single result.",
        text: "Cut 15 font sizes down to 4 and about 80 one-off colors down to one palette. No solver code changed, and the tests showed every result stayed identical.",
        image: "/img/2dbeamcalc-motion/v2-fourbar-motion.jpg",
        imageAlt: "The same four-bar linkage after the visual redesign.",
      },
      {
        date: "2026-11-26",
        title: "Laid out like CAD",
        short: "Rebuilt the layout to work like SolidWorks.",
        text: "Rebuilt around how SolidWorks users already work: tools in build order, a model tree, a properties panel, play/stop for the motion, and sketch relations between links.",
        image: "/img/2dbeamcalc-motion/v3-fourbar-motion.jpg",
        imageAlt: "CAD-style layout with a model tree on the left, properties on the right and the linkage in the middle.",
      },
      {
        date: "2026-11-27",
        title: "Joint loads you can design to",
        short: "Shows the force and moment every joint has to carry.",
        text: "Axial force, shear and moment at every weld or pin, at the worst pose, plus the swing over the whole motion for fatigue checks.",
        image: "/img/2dbeamcalc-motion/joint-loads.jpg",
        imageAlt: "A motor-driven arm carrying payloads, with the weld's force and moment table underneath.",
      },
      {
        date: "2026-11-27",
        title: "Live on the web",
        short: "Online for anyone to try, no install or account.",
        text: "Renamed to 2dbeamcalc-motion and put it online with Cloudflare, so anyone can open it from a link. No install and no account.",
      },
    ],
  },

  {
    slug: "fpv-drone",
    code: "FPV", // short label for dot ids, e.g. FPV·2
    title: "FPV Drone",
    color: "#e0601f",
    years: "", // TODO
    tagline: "TODO: one sentence on what you built and why.",
    role: "", // TODO
    links: [],
    milestones: [
      // TODO: replace these placeholders with real milestones.
      { date: "", title: "Placeholder: the idea", text: "What you set out to build, and why." },
      { date: "", title: "Placeholder: first build", text: "Frame, motors, electronics. What worked and what didn't." },
      { date: "", title: "Placeholder: first flight", text: "How it flew, what broke, what you changed." },
    ],
  },

  {
    slug: "texas-aerial-robotics",
    code: "TAR", // short label for dot ids, e.g. TAR·2
    title: "Texas Aerial Robotics",
    color: "#1f8a5b",
    years: "", // TODO
    tagline: "TODO: one sentence on the team and what you worked on.",
    role: "", // TODO
    links: [],
    milestones: [
      // TODO: replace these placeholders with real milestones.
      { date: "", title: "Placeholder: joined the team", text: "What the team was building and where you fit in." },
      { date: "", title: "Placeholder: what you built", text: "Your part of the vehicle or software." },
      { date: "", title: "Placeholder: competition", text: "How it went and what you'd do differently." },
    ],
  },
];
