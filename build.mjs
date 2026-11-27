// Builds the site into dist/. No dependencies: run with `node build.mjs`.
import { cpSync, mkdirSync, rmSync, writeFileSync, existsSync } from "node:fs";
import { site } from "./content/site.mjs";
import { projects } from "./content/projects.mjs";

const OUT = "dist";

// ---------- helpers ----------
const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// **bold**, *italic*, [link](url)
const inline = (t = "") =>
  esc(t)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function parseDate(d) {
  const m = /^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?$/.exec(d || "");
  if (!m) return null;
  const mon = m[2] ? MONTHS[+m[2] - 1] : "";
  const day = m[3] ? +m[3] : "";
  return {
    year: m[1],
    short: day ? `${mon} ${day}` : mon || m[1],
    long: day ? `${mon} ${day}, ${m[1]}` : mon ? `${mon} ${m[1]}` : m[1],
  };
}

const abs = (p) => (p && !/^https?:/.test(p) ? site.url.replace(/\/$/, "") + p : p);
const ext = (u) => (/^https?:/.test(u) ? ' target="_blank" rel="noopener"' : "");

const ICONS = {
  linkedin:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.75h4V21H3zM9.5 9.75h3.8v1.6h.06c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.77 2.6 4.77 6V21h-4v-5c0-1.2-.02-2.73-1.66-2.73-1.67 0-1.92 1.3-1.92 2.64V21h-4z"/></svg>',
  github:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .5a11.5 11.5 0 0 0-3.64 22.4c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.82 1.19 3.08 0 4.41-2.7 5.38-5.26 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5z"/></svg>',
  instagram:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.2c3.2 0 3.58 0 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s0 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.65.07-4.85.07s-3.58 0-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92C2.17 15.58 2.16 15.2 2.16 12s0-3.58.07-4.85C2.38 3.92 3.9 2.38 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33 0 7.05.07 2.7.27.27 2.69.07 7.05 0 8.33 0 8.74 0 12s0 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98C8.33 24 8.74 24 12 24s3.67 0 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s0-3.67-.07-4.95c-.2-4.35-2.62-6.78-6.98-6.98C15.67 0 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z"/></svg>',
};

function socialLinks(cls) {
  const items = [
    site.linkedin && ["linkedin", site.linkedin, "LinkedIn"],
    site.github && ["github", site.github, "GitHub"],
    site.instagram && ["instagram", site.instagram, "Instagram"],
    site.email && ["", `mailto:${site.email}`, "Email"],
    site.resume && ["", site.resume, "Résumé"],
  ].filter(Boolean);
  return `<ul class="${cls}">${items
    .map(([icon, url, label]) => `<li><a href="${esc(url)}"${ext(url)}>${ICONS[icon] || ""}<span>${label}</span></a></li>`)
    .join("")}</ul>`;
}

// ---------- sections ----------
const dotId = (p, i) => `${p.code || p.slug}·${i + 1}`;
const firstSentence = (t = "") => (t.match(/^.*?[.!?](?=\s|$)/) || [t])[0];
// even spacing, with a little room at both ends
const dotPos = (i, n) => (n === 1 ? 50 : 4 + (i * 92) / (n - 1));

// One row of the project list: name, then a small timeline whose dots show a hover card.
function indexRow(p, idx) {
  const ms = p.milestones || [];
  const n = ms.length;
  const lastDone = Math.max(0, ms.map((m) => !m.upcoming).lastIndexOf(true));
  const dots = ms
    .map((m, i) => {
      const d = parseDate(m.date);
      const x = dotPos(i, n);
      const side = x > 66 ? " tip-end" : x < 20 ? " tip-start" : "";
      return `<a class="mdot${m.upcoming ? " is-upcoming" : ""}${side}" href="#${p.slug}-${i + 1}" style="left:${x.toFixed(2)}%"
          aria-label="${esc(`${p.title}, ${d ? d.long : "step " + (i + 1)}: ${m.title}`)}">
          <span class="mthumb">${m.image ? `<img src="${esc(m.image)}" alt="" loading="lazy" decoding="async">` : `<span>${i + 1}</span>`}</span>
          <span class="mdot-tip" role="tooltip">
            ${m.image ? `<img src="${esc(m.image)}" alt="" loading="lazy" decoding="async">` : ""}
            <span class="tip-when">${site.showDotIds ? `<b>${esc(dotId(p, i))}</b>` : ""}<span>${esc(d ? d.long : m.upcoming ? "Up next" : "Date to add")}</span></span>
            <span class="tip-title">${inline(m.title)}</span>
            <span class="tip-text">${inline(m.short || firstSentence(m.text))}</span>
          </span>
        </a>`;
    })
    .join("");
  return `<li style="--c:${esc(p.color)}">
    <span class="index-num">${String(idx + 1).padStart(2, "0")}</span>
    <a class="index-title" href="#${p.slug}">${esc(p.title)}</a>
    <span class="mini" aria-label="${esc(p.title)} milestones" style="--t:${n > 6 ? 26 : 34}px">
      <span class="mini-rail" style="left:${dotPos(0, n)}%;right:${100 - dotPos(n - 1, n)}%">
        <span class="mini-done" style="width:${n > 1 ? ((dotPos(lastDone, n) - dotPos(0, n)) / (dotPos(n - 1, n) - dotPos(0, n))) * 100 : 100}%"></span>
        <span class="mini-hot"></span>
      </span>
      ${dots}
    </span>
    <span class="index-years">${esc(p.years)}</span>
  </li>`;
}
function intro() {
  return `<section class="intro">
  <figure class="portrait"><img src="${esc(site.photo)}" alt="${esc(site.photoAlt)}" width="880" height="1100" fetchpriority="high"></figure>
  <div class="intro-text">
    <h1>${esc(site.name).replace(" ", "<br>")}</h1>
    <p class="intro-line">${inline(site.intro)}</p>
    ${socialLinks("social")}
    <nav class="index" aria-label="Projects">
      <ol>
        ${projects.map(indexRow).join("")}
      </ol>
    </nav>
  </div>
</section>`;
}

function frame(p, m, i, n) {
  const d = parseDate(m.date);
  const when = d ? d.long : m.upcoming ? "Up next" : "Date to add";
  const media = m.image
    ? `<img src="${esc(m.image)}" alt="${esc(m.imageAlt || "")}" loading="lazy" decoding="async">`
    : `<div class="no-image" aria-hidden="true"><span>${String(i + 1).padStart(2, "0")}</span></div>`;
  return `<article class="frame${m.upcoming ? " is-upcoming" : ""}" data-i="${i}" id="${p.slug}-${i + 1}">
    <div class="frame-media">${media}</div>
    <div class="frame-text">
      <p class="frame-when"><time${d ? ` datetime="${esc(m.date)}"` : ""}>${esc(when)}</time><span>${site.showDotIds ? `<b class="dot-id">${esc(dotId(p, i))}</b>` : ""}${i + 1} / ${n}</span></p>
      <h3>${inline(m.title)}</h3>
      <p>${inline(m.text)}</p>
    </div>
  </article>`;
}

function project(p, idx) {
  const ms = p.milestones || [];
  const n = ms.length;
  const pos = (i) => (n === 1 ? 50 : 3 + (i * 94) / (n - 1));
  const lastDone = Math.max(0, ms.map((m) => !m.upcoming).lastIndexOf(true));
  let prevYear = "";
  const stops = ms
    .map((m, i) => {
      const d = parseDate(m.date);
      const label = d ? d.short : m.upcoming ? "Next" : `Step ${i + 1}`;
      const year = d && d.year !== prevYear && d.short !== d.year ? d.year : "";
      if (d) prevYear = d.year;
      return `<a class="stop${m.upcoming ? " is-upcoming" : ""}" href="#${p.slug}-${i + 1}" data-i="${i}" style="left:${pos(i).toFixed(2)}%" aria-label="${esc((d ? d.long : label) + ": " + m.title)}">
        <span class="stop-dot"></span><span class="stop-label">${esc(label)}${year ? `<small>${year}</small>` : ""}</span></a>`;
    })
    .join("");
  const meta = [p.role].filter(Boolean).map(esc).join(" · ");
  const links = (p.links || [])
    .filter((l) => l.url)
    .map((l) => `<a href="${esc(l.url)}"${ext(l.url)}>${esc(l.label)} ↗</a>`)
    .join("");

  return `<section class="project" id="${p.slug}" style="--c:${esc(p.color)}" data-active="${lastDone}">
  <header class="p-head">
    <span class="p-num">${String(idx + 1).padStart(2, "0")}</span>
    <div class="p-title">
      <h2>${esc(p.title)}</h2>
      <p class="p-tagline">${inline(p.tagline)}</p>
    </div>
    <div class="p-side">
      ${p.years ? `<p class="p-years">${esc(p.years)}</p>` : ""}
      ${meta ? `<p class="p-meta">${meta}</p>` : ""}
      ${links ? `<p class="p-links">${links}</p>` : ""}
    </div>
  </header>
  <div class="viewer">
    <div class="stage">${ms.map((m, i) => frame(p, m, i, n)).join("")}</div>
    <div class="track" aria-label="${esc(p.title)} timeline">
      <div class="rail" style="left:${pos(0)}%;right:${100 - pos(n - 1)}%">
        <span class="rail-done" style="width:${n > 1 ? ((pos(lastDone) - pos(0)) / (pos(n - 1) - pos(0))) * 100 : 100}%"></span>
        <span class="rail-fill"></span>
      </div>
      <span class="playhead" aria-hidden="true"></span>
      ${stops}
    </div>
  </div>
</section>`;
}

function page() {
  const title = `${site.name}: projects`;
  const firstImage = projects.flatMap((p) => p.milestones || []).find((m) => m.image)?.image;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(site.name)}</title>
<meta name="description" content="${esc(site.intro)}">
<link rel="canonical" href="${esc(abs("/"))}">
<meta property="og:type" content="profile">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(site.intro)}">
<meta property="og:url" content="${esc(abs("/"))}">
<meta property="og:image" content="${esc(abs(site.photo || firstImage))}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/style.css">
<script>document.documentElement.classList.add("js")</script>
</head>
<body>
<main>
${intro()}
${projects.map(project).join("\n")}
</main>
<footer class="foot">
  <p>${esc(site.name)}</p>
  ${socialLinks("foot-links")}
</footer>
<script src="/timeline.js" defer></script>
</body>
</html>
`;
}

// ---------- write ----------
const slugs = new Set();
for (const p of projects) {
  if (!/^[a-z0-9-]+$/.test(p.slug)) throw new Error(`Bad slug "${p.slug}": use lowercase letters, numbers and dashes`);
  if (slugs.has(p.slug)) throw new Error(`Duplicate slug "${p.slug}"`);
  slugs.add(p.slug);
  for (const m of p.milestones || [])
    if (m.image && !/^https?:/.test(m.image) && !existsSync("static" + m.image)) console.warn(`! ${p.slug}: missing image static${m.image}`);
}
if (site.photo && !existsSync("static" + site.photo)) console.warn(`! missing photo static${site.photo}`);

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
cpSync("static", OUT, { recursive: true });
writeFileSync(`${OUT}/index.html`, page());
writeFileSync(
  `${OUT}/404.html`,
  `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Not found</title><link rel="stylesheet" href="/style.css"></head><body><main class="missing"><h1>Nothing here.</h1><p><a href="/">Back to ${esc(site.name)} →</a></p></main></body></html>`
);
console.log(`Built ${projects.length} project timeline(s) into ${OUT}/`);
