// Timeline scrubbing: move the pointer along a project's line (or drag on a phone)
// and the frame above jumps to the nearest milestone. Arrow keys work on focused stops.
const showers = {}; // project id -> function that shows milestone i

for (const sec of document.querySelectorAll(".project")) {
  const track = sec.querySelector(".track");
  const head = sec.querySelector(".playhead");
  const fill = sec.querySelector(".rail-fill");
  const stops = [...sec.querySelectorAll(".stop")];
  const frames = [...sec.querySelectorAll(".frame")];
  if (!stops.length) continue;

  const xs = stops.map((s) => parseFloat(s.style.left));
  const first = xs[0];
  const span = xs[xs.length - 1] - first || 1;
  let active = -1;

  function show(i) {
    if (i === active) return;
    active = i;
    stops.forEach((s, k) => {
      s.classList.toggle("is-active", k === i);
      s.classList.toggle("is-past", k < i);
      k === i ? s.setAttribute("aria-current", "step") : s.removeAttribute("aria-current");
    });
    frames.forEach((f, k) => f.classList.toggle("is-active", k === i));
    fill.style.width = ((xs[i] - first) / span) * 100 + "%";
  }

  const pctAt = (e) => {
    const r = track.getBoundingClientRect();
    return Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100));
  };
  const nearest = (p) => xs.reduce((best, x, k) => (Math.abs(x - p) < Math.abs(xs[best] - p) ? k : best), 0);

  function scrub(e) {
    const p = pctAt(e);
    head.style.left = p + "%";
    track.classList.add("is-scrubbing");
    show(nearest(p));
  }

  track.addEventListener("pointermove", scrub);
  track.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "mouse") track.setPointerCapture(e.pointerId);
    scrub(e);
  });
  const stop = () => track.classList.remove("is-scrubbing");
  track.addEventListener("pointerleave", stop);
  track.addEventListener("pointerup", (e) => e.pointerType !== "mouse" && stop());

  stops.forEach((s, k) => {
    s.addEventListener("click", (e) => (e.preventDefault(), show(k)));
    s.addEventListener("focus", () => show(k));
    s.addEventListener("keydown", (e) => {
      const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (!d) return;
      e.preventDefault();
      stops[Math.max(0, Math.min(stops.length - 1, k + d))].focus();
    });
  });

  show(Math.min(+sec.dataset.active || 0, stops.length - 1));
  showers[sec.id] = show;

  // Load every image in this timeline once it's near the screen, so scrubbing never waits.
  new IntersectionObserver(
    (entries, io) => {
      if (!entries[0].isIntersecting) return;
      sec.querySelectorAll("img[loading=lazy]").forEach((img) => (img.loading = "eager"));
      io.disconnect();
    },
    { rootMargin: "400px" }
  ).observe(sec);
}

// Links like #2dbeamcalc-motion-3 (the dots in the project list, or a shared link)
// open that project's timeline at that milestone.
function openMilestone(hash, smooth) {
  const m = /^#(.+)-(\d+)$/.exec(hash || "");
  const sec = m && document.getElementById(m[1]);
  if (!sec || !showers[m[1]]) return false;
  showers[m[1]](+m[2] - 1);
  sec.scrollIntoView({ behavior: smooth ? "smooth" : "instant", block: "start" });
  return true;
}

// The small timelines in the project list: anywhere along a line snaps to the
// nearest dot, shows its card, and fills the line up to it. Clicking opens that step.
for (const mini of document.querySelectorAll(".mini")) {
  const dots = [...mini.querySelectorAll(".mdot")];
  if (!dots.length) continue;
  const thumbs = dots.map((d) => d.querySelector(".mthumb"));
  const row = mini.closest("li");
  const hot = mini.querySelector(".mini-hot");
  const xs = dots.map((d) => parseFloat(d.style.left));
  const span = xs[xs.length - 1] - xs[0] || 1;
  let cur = -1;

  function pick(i) {
    if (i === cur) return;
    cur = i;
    dots.forEach((d, k) => {
      d.classList.toggle("is-hot", k === i);
      d.classList.toggle("is-before", k < i);
    });
    hot.style.width = ((xs[i] - xs[0]) / span) * 100 + "%";
  }
  function clear() {
    cur = -1;
    row.classList.remove("is-scrubbing");
    dots.forEach((d) => d.classList.remove("is-hot", "is-before"));
    thumbs.forEach((t) => t.style.removeProperty("--s"));
  }

  mini.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    const r = mini.getBoundingClientRect();
    const p = ((e.clientX - r.left) / r.width) * 100;
    row.classList.add("is-scrubbing");
    const near = xs.reduce((b, x, k) => (Math.abs(x - p) < Math.abs(xs[b] - p) ? k : b), 0);
    pick(near);
    // Dock-style: thumbnails swell with closeness to the pointer; the nearest one is always big.
    thumbs.forEach((t, k) => {
      const px = (Math.abs(xs[k] - p) / 100) * r.width;
      const f = Math.max(0, 1 - px / 110);
      const s = k === near ? Math.max(1.6, 1 + 0.8 * f) : 1 + 0.45 * f * f;
      t.style.setProperty("--s", s.toFixed(3));
    });
  });
  mini.addEventListener("pointerleave", clear);
  mini.addEventListener("click", (e) => {
    if (cur < 0) return; // keyboard or touch: let the dot's own link handle it
    const a = dots[cur];
    e.preventDefault();
    e.stopPropagation();
    clear();
    if (openMilestone(a.hash, true)) history.replaceState(null, "", a.hash);
  });
}

document.addEventListener("click", (e) => {
  const a = e.target.closest("a.mdot");
  if (a && openMilestone(a.hash, true)) {
    e.preventDefault();
    history.replaceState(null, "", a.hash);
  }
});
openMilestone(location.hash, false);
