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

## Deploy on Cloudflare (free)

1. Push this folder to its own GitHub repository.
2. In the Cloudflare dashboard: **Workers & Pages → Create → Pages → Connect to Git**, pick the repo.
3. Build settings: framework preset **None**, build command `node build.mjs`, output directory `dist`.
4. Deploy. You get `https://<project-name>.pages.dev`. Put that in `site.url` in `content/site.mjs` so link previews show the right image, then push again.

Every push to `main` redeploys. Pushes to other branches get their own preview URL, handy for checking a new story before it goes live.

A custom domain (e.g. `yourname.com`) can be bought through Cloudflare Registrar and attached under the project's **Custom domains** tab.

## Hosting Kinematic Studio next to it

Kinematic Studio is a separate Vite app, so give it its own Cloudflare Pages project from the `kinematic-studio` repo: build command `npm run build`, output directory `dist`, and environment variable `NODE_VERSION` = `22`. Then uncomment the "Try it live" link in `content/projects.mjs`. With a custom domain you could serve it at `studio.yourname.com`.
