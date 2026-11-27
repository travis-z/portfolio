# Portfolio

One page: a photo and links at the top, then one timeline per project. Moving the mouse along a project's line (or dragging on a phone) scrubs through its milestones, and the image and text above update to show where the project stood. No framework, no dependencies; `node build.mjs` writes the finished site to `dist/`.

## Editing

| What | Where |
|---|---|
| Name, photo, intro line, links | `content/site.mjs` |
| Projects and their milestones | `content/projects.mjs` (the field list is at the top of the file) |
| Images | `static/img/<project-slug>/`, referenced as `/img/<project-slug>/file.jpg` |
| Look and feel | `static/style.css` |
| Scrubbing behavior | `static/timeline.js` |

Projects appear in the order they're listed. Each timeline opens on its most recent finished milestone, so visitors see where the project is now. Milestones without an image show a numbered tile in the project's color.

Images: landscape, about 1600 px wide, JPEG. On a Mac, `sips -Z 1600 -s format jpeg -s formatOptions 80 in.png --out out.jpg`.

## Preview locally

```bash
npm run dev
```

Then open http://localhost:8090. Re-run after edits.

## Hosting

Live at **https://portfolio.traviszavaleta.workers.dev**, as a Cloudflare Worker named `portfolio` connected to the `travis-z/portfolio` GitHub repo. Every push to `main` rebuilds and redeploys it within a couple of minutes.

- Cloudflare build settings: build command `npm run build`, deploy command `npx wrangler deploy`.
- `wrangler.jsonc` tells Cloudflare to serve `dist/`. Its `name` must match the Worker's name in the dashboard, or the build fails.
- `site.url` in `content/site.mjs` must be the live address, so link previews (LinkedIn, Slack, email) show the right image.

A custom domain (e.g. `yourname.com`) can be bought through Cloudflare Registrar and attached in the Worker's **Settings → Domains & Routes**. Update `site.url` when you do.

## Hosting Kinematic Studio next to it

Kinematic Studio is a separate Vite app, so give it its own Worker from the `kinematic-studio` repo, the same way: a `wrangler.jsonc` pointing at its `dist/`, build command `npm run build`. Then uncomment the "Try it live" link in `content/projects.mjs`. With a custom domain you could serve it at `studio.yourname.com`.
