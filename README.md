# Portfolio

A plain static site: each project is a story told as a timeline. No framework, no dependencies; `node build.mjs` writes the finished site to `dist/`.

## Editing

| What | Where |
|---|---|
| Your name, intro, contact links | `content/site.mjs` |
| Projects and their timelines | `content/projects.mjs` |
| Images | `static/img/<project-slug>/` (reference them as `/img/<project-slug>/file.jpg`) |
| Look and feel | `static/style.css` |

To add a project, copy the `TEMPLATE` block at the bottom of `content/projects.mjs`, fill it in, and set `draft: false`. Projects show in the order they appear in the list. Drafts are left out of the build.

Each timeline entry can have:
- `date`: `"2026-10-08"`, `"2026-10"`, or any text such as `"Next"`
- `title`, `tag` (a short label like Build, Test, Design), `body` (a little Markdown)
- `images`: a list of `{ src, alt, caption }`
- `compare`: `{ before: { src, alt }, after: { src, alt }, caption }` for a side-by-side
- `upcoming: true` to draw it as a planned step

Screenshots: save as JPEG around 1400–1600 px wide to keep pages fast. On a Mac, `sips -s format jpeg -s formatOptions 80 in.png --out out.jpg`.

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
