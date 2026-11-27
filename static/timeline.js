// Timeline scrubbing: move the pointer along a project's line (or drag on a phone)
// and the frame above jumps to the nearest milestone. Arrow keys work on focused stops.
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
