// Builds the site into dist/. No dependencies: run with `node build.mjs`.
import { cpSync, mkdirSync, rmSync, writeFileSync, existsSync } from "node:fs";
import { site } from "./content/site.mjs";
import { projects as allProjects } from "./content/projects.mjs";

const OUT = "dist";
const projects = allProjects.filter((p) => !p.draft);

// ---------- helpers ----------
const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function inline(text) {
  const codes = [];
  let s = esc(text).replace(/`([^`]+)`/g, (_, c) => `\u0000${codes.push(c) - 1}\u0000`);
  s = s
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, u) => {
      const ext = /^https?:/.test(u);
      return `<a href="${u}"${ext ? ' target="_blank" rel="noopener"' : ""}>${t}</a>`;
    });
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${codes[i]}</code>`);
}

function md(text = "") {
  return text
    .trim()
    .split(/\n\s*\n/)
    .map((block) => {
      const lines = block.trim().split("\n");
      if (lines.every((l) => /^\s*- /.test(l)))
        return `<ul>${lines.map((l) => `<li>${inline(l.replace(/^\s*- /, ""))}</li>`).join("")}</ul>`;
      return `<p>${inline(lines.join(" "))}</p>`;
    })
    .join("\n");
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function fmtDate(d) {
  const m = /^(\d{4})-(\d{2})(?:-(\d{2}))?$/.exec(d || "");
  if (!m) return { short: d, year: "" };
  const mon = MONTHS[+m[2] - 1];
  return { short: m[3] ? `${mon} ${+m[3]}` : mon, year: m[1] };
}

const abs = (path) => (path && !/^https?:/.test(path) ? site.url.replace(/\/$/, "") + path : path);

function img({ src, alt = "", caption = "" }, cls = "") {
  return `<figure class="${cls}">
  <a href="${esc(src)}" target="_blank" rel="noopener"><img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" decoding="async"></a>
  ${caption ? `<figcaption>${inline(caption)}</figcaption>` : ""}
</figure>`;
}

function links(list = []) {
  return list
    .filter((l) => l && l.url)
    .map(
      (l, i) =>
        `<a class="btn${i === 0 ? " btn-primary" : ""}" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}<span aria-hidden="true">↗</span></a>`
    )
    .join("");
}

function contactLinks() {
  const items = [
    site.email && [`mailto:${site.email}`, "Email"],
    site.linkedin && [site.linkedin, "LinkedIn"],
    site.github && [site.github, "GitHub"],
    site.resume && [site.resume, "Résumé"],
  ].filter(Boolean);
  return items
    .map(([u, t]) => `<a href="${esc(u)}"${/^https?:/.test(u) ? ' target="_blank" rel="noopener"' : ""}>${t}</a>`)
    .join("");
}

function page({ title, description, path, image, body }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${esc(abs(path))}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(abs(path))}">
${image ? `<meta property="og:image" content="${esc(abs(image))}">\n<meta name="twitter:card" content="summary_large_image">` : ""}
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/style.css">
</head>
<body>
<header class="site-header"><div class="wrap">
  <a class="brand" href="/">${esc(site.name)}</a>
  <nav>${path === "/" ? "" : '<a href="/#projects">Projects</a>'}${contactLinks()}</nav>
</div></header>
<main>
${body}
</main>
<footer class="site-footer"><div class="wrap">
  <span>© ${new Date().getFullYear()} ${esc(site.name)}</span>
  <nav>${contactLinks()}</nav>
</div></footer>
</body>
</html>
`;
}

// ---------- home ----------
function projectCard(p) {
  const steps = p.timeline || [];
  const done = steps.filter((s) => !s.upcoming);
  return `<article class="card">
  <a class="card-link" href="/projects/${p.slug}/" aria-label="${esc(p.title)}: read the story"></a>
  ${p.cover ? `<div class="card-media"><img src="${esc(p.cover)}" alt="${esc(p.coverAlt || "")}" loading="lazy"></div>` : ""}
  <div class="card-body">
    <div class="meta-line"><span class="status status-${esc((p.status || "").toLowerCase())}">${esc(p.status)}</span><span>${esc(p.period)}</span></div>
    <h3>${esc(p.title)}</h3>
    <p>${inline(p.tagline)}</p>
    <ol class="mini-timeline" aria-label="Milestones">
      ${steps.map((s) => `<li class="${s.upcoming ? "upcoming" : ""}" title="${esc(fmtDate(s.date).short + " · " + s.title)}"><span></span></li>`).join("")}
    </ol>
    <div class="card-foot">
      <span class="muted">${done.length} milestone${done.length === 1 ? "" : "s"}${p.tools?.length ? " · " + esc(p.tools.slice(0, 3).join(", ")) : ""}</span>
      <span class="read">Read the story →</span>
    </div>
  </div>
</article>`;
}

function home() {
  return page({
    title: `${site.name} · ${site.headline}`,
    description: site.intro,
    path: "/",
    image: projects[0]?.cover,
    body: `
<section class="hero wrap">
  <p class="eyebrow">${esc([site.location].filter(Boolean).join(" · ") || "Portfolio")}</p>
  <h1>${esc(site.headline)}</h1>
  <p class="lede">${inline(site.intro)}</p>
  <div class="hero-links">${contactLinks()}</div>
</section>
<section id="projects" class="wrap">
  <h2 class="section-title">Projects</h2>
  <div class="cards">
    ${projects.map(projectCard).join("\n")}
  </div>
</section>`,
  });
}

// ---------- project ----------
function entry(e, i) {
  const d = fmtDate(e.date);
  const compare = e.compare
    ? `<div class="compare">
        ${img({ ...e.compare.before, caption: "" }, "before")}
        ${img({ ...e.compare.after, caption: "" }, "after")}
       </div>${e.compare.caption ? `<p class="compare-caption">${inline(e.compare.caption)}</p>` : ""}`
    : "";
  return `<li class="entry${e.upcoming ? " upcoming" : ""}" id="step-${i + 1}">
  <div class="when"><time${/^\d{4}/.test(e.date) ? ` datetime="${esc(e.date)}"` : ""}>${esc(d.short)}</time><span class="year">${esc(d.year)}</span></div>
  <div class="dot" aria-hidden="true"></div>
  <div class="what">
    ${e.tag ? `<span class="tag">${esc(e.tag)}</span>` : ""}
    <h3>${inline(e.title)}</h3>
    <div class="prose">${md(e.body)}</div>
    ${compare}
    ${(e.images || []).map((im) => img(im, "shot")).join("")}
  </div>
</li>`;
}

function projectPage(p, idx) {
  const next = projects[(idx + 1) % projects.length];
  const s = p.summary || {};
  return page({
    title: `${p.title} · ${site.name}`,
    description: p.tagline,
    path: `/projects/${p.slug}/`,
    image: p.cover,
    body: `
<article class="project">
  <header class="project-head wrap">
    <a class="back" href="/#projects">← All projects</a>
    <div class="meta-line"><span class="status status-${esc((p.status || "").toLowerCase())}">${esc(p.status)}</span><span>${esc(p.period)}</span></div>
    <h1>${esc(p.title)}</h1>
    <p class="lede">${inline(p.tagline)}</p>
    <dl class="facts">
      ${p.role ? `<div><dt>Role</dt><dd>${esc(p.role)}</dd></div>` : ""}
      ${p.tools?.length ? `<div><dt>Tools</dt><dd>${p.tools.map(esc).join(", ")}</dd></div>` : ""}
    </dl>
    <div class="actions">${links(p.links)}</div>
  </header>

  ${p.cover ? `<div class="wrap wide">${img({ src: p.cover, alt: p.coverAlt }, "cover")}</div>` : ""}

  <section class="wrap summary" aria-label="Summary">
    ${["problem", "approach", "outcome"]
      .filter((k) => s[k])
      .map((k) => `<div><h2>${k[0].toUpperCase() + k.slice(1)}</h2><p>${inline(s[k])}</p></div>`)
      .join("")}
  </section>

  <section class="wrap">
    <h2 class="section-title">Timeline</h2>
    <ol class="timeline">
      ${(p.timeline || []).map(entry).join("\n")}
    </ol>
  </section>

  ${
    p.lessons?.length
      ? `<section class="wrap lessons"><h2 class="section-title">What I learned</h2><ul>${p.lessons.map((l) => `<li>${inline(l)}</li>`).join("")}</ul></section>`
      : ""
  }

  ${
    projects.length > 1
      ? `<nav class="wrap next"><a href="/projects/${next.slug}/"><span class="muted">Next project</span><strong>${esc(next.title)} →</strong></a></nav>`
      : `<nav class="wrap next"><a href="/#projects"><span class="muted">Back to</span><strong>All projects →</strong></a></nav>`
  }
</article>`,
  });
}

// ---------- write ----------
const slugs = new Set();
for (const p of projects) {
  if (!/^[a-z0-9-]+$/.test(p.slug)) throw new Error(`Bad slug "${p.slug}": use lowercase letters, numbers and dashes`);
  if (slugs.has(p.slug)) throw new Error(`Duplicate slug "${p.slug}"`);
  slugs.add(p.slug);
  for (const im of [p.cover, ...(p.timeline || []).flatMap((e) => [...(e.images || []).map((i) => i.src), e.compare?.before?.src, e.compare?.after?.src])])
    if (im && !/^https?:/.test(im) && !existsSync("static" + im)) console.warn(`! ${p.slug}: missing image static${im}`);
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
cpSync("static", OUT, { recursive: true });
writeFileSync(`${OUT}/index.html`, home());
projects.forEach((p, i) => {
  mkdirSync(`${OUT}/projects/${p.slug}`, { recursive: true });
  writeFileSync(`${OUT}/projects/${p.slug}/index.html`, projectPage(p, i));
});
writeFileSync(
  `${OUT}/404.html`,
  page({
    title: `Not found · ${site.name}`,
    description: "Page not found",
    path: "/404",
    body: `<section class="hero wrap"><h1>That page isn't here.</h1><p class="lede"><a href="/">Back to the home page →</a></p></section>`,
  })
);
console.log(`Built ${projects.length} project page(s) into ${OUT}/`);
