// Every project is one object in this list, shown on the home page in this order.
// Each one gets its own page at /projects/<slug>/ with its story as a timeline.
//
// Text fields accept a little Markdown: **bold**, *italic*, `code`, [links](https://…),
// blank lines between paragraphs, and "- " bullet lists.
//
// Copy the TEMPLATE at the bottom of this file to start a new project.

export const projects = [
  {
    slug: "kinematic-studio",
    title: "Kinematic Studio",
    tagline:
      "A browser tool for designing planar linkages, simulating their motion, and finding the loads every joint and motor has to carry.",
    status: "Active", // Active · Shipped · Completed · Paused
    period: "Oct 2026 – present",
    role: "Solo: engineering, solver, UI", // TODO: confirm
    tools: ["TypeScript", "React", "Web Workers", "Vitest", "Playwright"],
    cover: "/img/kinematic-studio/v3-fourbar-motion.jpg",
    coverAlt:
      "Kinematic Studio showing a four-bar linkage with its coupler path traced, and position, velocity and acceleration charts below.",
    links: [
      // { label: "Try it live", url: "https://kinematic-studio.pages.dev" }, // TODO: uncomment after deploying
      { label: "Source on GitHub", url: "https://github.com/travis-z/kinematic-studio" },
    ],

    // The short version. Someone skimming should get the whole project from these three.
    summary: {
      problem:
        "Sizing a linkage, like a four-bar or a motor-driven arm, usually means going back and forth between CAD, a spreadsheet and hand calcs to answer two questions: does it move the way I want, and what do the motor and each joint have to hold?", // TODO: your words, ideally a real situation you were in
      approach:
        "One tool that does both in the browser. You sketch the mechanism with CAD-style constraints, drive it with a motor or cylinder, and read off motion, holding torque and joint loads at every pose. Nothing to install and no account.",
      outcome:
        "A working app with a Newton–Raphson kinematic solver, Lagrange-multiplier statics, four-bar path fitting, and 94 unit tests plus a browser end-to-end suite.",
    },

    timeline: [
      {
        date: "2026-10-08",
        title: "First working version",
        tag: "Build",
        body: `
Started from the math. Each moving link is a rigid body with position and angle; joints, sliders, welds and actuators become constraint equations, and the solver finds the pose that satisfies all of them.

- **Position solver:** Newton–Raphson with an SVD pseudo-inverse and a line search. Each frame starts from a prediction off the last two, so it stays on the same assembly branch as the mechanism moves.
- **Statics:** applied loads go into the same constraint Jacobian, \`Φqᵀλ = Q\`, which gives every pin reaction, weld moment and motor torque at once, and says when the answer is indeterminate rather than guessing.
- **Path fitting:** give it target points and it searches for a four-bar whose coupler passes through them (Nelder–Mead, several seeded starts, in a Web Worker).
`,
        images: [
          {
            src: "/img/kinematic-studio/v1-fourbar-motion.jpg",
            alt: "First version of Kinematic Studio simulating a four-bar crank-rocker with motion charts.",
            caption: "The first version: the solver worked, the interface was busy.",
          },
        ],
      },
      {
        date: "2026-10-09",
        title: "Redesign without touching the math",
        tag: "Design",
        body: `
The numbers were right but the screen was hard to read. I audited it and found 15 font sizes, 13 corner radii, about 80 hard-coded colors and 10 shadows. I replaced them with a small design system: 4 type sizes, 2 radii, one set of color tokens for light and dark.

The rule for this pass was that no solver, statics or analysis code could change, so every computed value stayed identical and the tests proved it. Along the way the redesign turned up three real bugs, including a CSV export that raced the background solver after a reload.
`,
        compare: {
          before: {
            src: "/img/kinematic-studio/v1-fourbar-motion.jpg",
            alt: "Before the redesign.",
          },
          after: {
            src: "/img/kinematic-studio/v2-fourbar-motion.jpg",
            alt: "After the redesign: same mechanism, same values.",
          },
          caption: "Same mechanism, same numbers. Only how they're shown changed.",
        },
      },
      {
        date: "2026-11-26",
        title: "Reworked around how CAD users already work",
        tag: "UX",
        body: `
People who design mechanisms already know SolidWorks-style tools, so I rebuilt the layout around that: a tool bar in the order you build a mechanism, a model tree on the left, properties on the right, and a play/stop transport for the motion.

Links are now drawn as physical bars, and selecting two links offers the usual sketch relations (equal, parallel, perpendicular, collinear, angle) with the symbols a CAD user expects.
`,
        compare: {
          before: {
            src: "/img/kinematic-studio/v2-fourbar-motion.jpg",
            alt: "Layout before the UX overhaul.",
          },
          after: {
            src: "/img/kinematic-studio/v3-fourbar-motion.jpg",
            alt: "CAD-style layout with a model tree, tool bar and properties panel.",
          },
        },
      },
      {
        date: "2026-11-27",
        title: "Joint loads you can design to",
        tag: "Analysis",
        body: `
For each weld or pin, the app reports axial force, shear and moment at the worst pose, plus the min, max and range over the motion, since the range is what matters for fatigue. If the mechanism can't be solved, it says why and offers a fix, such as turning a pivot into a weld.
`,
        images: [
          {
            src: "/img/kinematic-studio/joint-loads.jpg",
            alt: "A motor-held arm with payloads, showing the weld's force, shear and moment table at the worst pose.",
            caption: "A motor-held arm: holding torque on the canvas, weld loads in the table below.",
          },
        ],
      },
      {
        date: "Next",
        title: "Public release",
        tag: "Planned",
        upcoming: true,
        body: `Host it on Cloudflare so anyone can open it from a link.`,
      },
    ],

    lessons: [
      "Writing the numerical methods down (tolerances, failure cases, what isn't modeled) made the solver better, because every vague spot became obvious.",
      "Keeping the math and the interface separate meant I could redesign the whole UI and prove with tests that no result changed.",
    ], // TODO: your words
  },

  // ---------------------------------------------------------------------------
  // TEMPLATE: copy this block above the line, fill it in, and set draft: false.
  // Drafts are left out of the built site.
  {
    draft: true,
    slug: "project-two",
    title: "Project title",
    tagline: "One sentence on what it is and why it matters.",
    status: "Completed",
    period: "Jan 2025 – May 2025",
    role: "Your role, team size",
    tools: ["Tool", "Tool"],
    cover: "", // e.g. "/img/project-two/cover.jpg" (put images in static/img/project-two/)
    coverAlt: "",
    links: [],
    summary: {
      problem: "What needed solving, and for whom.",
      approach: "What you did about it.",
      outcome: "What happened. Numbers if you have them.",
    },
    timeline: [
      {
        date: "2025-01-15",
        title: "Milestone title",
        tag: "Research",
        body: "What happened at this point, what you decided, and why.",
        images: [], // { src, alt, caption }
      },
    ],
    lessons: [],
  },
];
