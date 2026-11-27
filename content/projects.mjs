// Each project is one timeline on the page, in this order.
//
// Project fields:
//   slug     short id used in the link, e.g. /#fpv-drone (lowercase, dashes)
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
//   text      1–3 sentences: where the project stood at this point
//   image     a photo or screenshot, e.g. "/img/fpv-drone/first-flight.jpg"
//             (put images in static/img/<slug>/; landscape, about 1600px wide)
//   imageAlt  what the image shows, for screen readers
//   upcoming  true for a step that hasn't happened yet

export const projects = [
  {
    slug: "fpv-drone",
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
    slug: "trel",
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
    slug: "kinematic-studio",
    title: "Kinematic Studio",
    color: "#2d5bd8",
    years: "2026 – now",
    tagline:
      "A browser tool for designing linkages: sketch a mechanism, run it through its motion, and see the load on every joint and motor.",
    role: "Solo project", // TODO: confirm
    links: [
      // { label: "Try it", url: "https://…" }, // TODO: add once it's hosted
      { label: "Source", url: "https://github.com/travis-z/kinematic-studio" },
    ],
    milestones: [
      {
        date: "2026-10-08",
        title: "First working version",
        text: "The math came first: a solver that finds every link's position as the mechanism moves, and the force each joint and motor has to hold. It worked, but the screen was crowded.",
        image: "/img/kinematic-studio/v1-fourbar-motion.jpg",
        imageAlt: "First version of Kinematic Studio simulating a four-bar linkage, with motion charts underneath.",
      },
      {
        date: "2026-10-09",
        title: "Redesign, same numbers",
        text: "Cut 15 font sizes down to 4 and about 80 one-off colors down to one palette. No solver code changed, and the tests showed every result stayed identical.",
        image: "/img/kinematic-studio/v2-fourbar-motion.jpg",
        imageAlt: "The same four-bar linkage after the visual redesign.",
      },
      {
        date: "2026-11-26",
        title: "Laid out like CAD",
        text: "Rebuilt around how SolidWorks users already work: tools in build order, a model tree, a properties panel, play/stop for the motion, and sketch relations between links.",
        image: "/img/kinematic-studio/v3-fourbar-motion.jpg",
        imageAlt: "CAD-style layout with a model tree on the left, properties on the right and the linkage in the middle.",
      },
      {
        date: "2026-11-27",
        title: "Joint loads you can design to",
        text: "Axial force, shear and moment at every weld or pin, at the worst pose, plus the swing over the whole motion for fatigue checks.",
        image: "/img/kinematic-studio/joint-loads.jpg",
        imageAlt: "A motor-driven arm carrying payloads, with the weld's force and moment table underneath.",
      },
      {
        date: "",
        title: "Public release",
        text: "Hosting it on Cloudflare so anyone can open it from a link.",
        upcoming: true,
      },
    ],
  },

  {
    slug: "texas-aerial-robotics",
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
