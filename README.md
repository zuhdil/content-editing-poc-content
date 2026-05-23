# Content Editing POC — Content Repo

This repo holds the editable content for the
[content-editing-poc-site](https://github.com/zuhdil/content-editing-poc-site)
Next.js site. Each text key lives as its own file, organised by
page-folder.

## Editing content

1. Find the page folder for the screen you want to edit
   (`home/`, `about/`, `features/`, or `layout/`).
2. Click into the file for the specific key. Filenames preserve
   the dotted key (e.g. `hero.title.txt`).
3. Click the pencil icon (top-right of the file view).
4. Edit the text.
5. Scroll down, write a short commit message (optional but
   encouraged), and click "Commit changes" → "Commit directly to
   the `main` branch".

The site will update at
`https://zuhdil.github.io/content-editing-poc-site/` within
~1 minute.

## When something doesn't update

1. Open the [Actions tab](https://github.com/zuhdil/content-editing-poc-content/actions).
2. If you see a red X on the most recent run, click into it.
   The error message tells you what's wrong — usually a length
   limit, or the wrong file extension for a markdown-typed key.
3. Fix the file (edit + commit again). The next run will publish
   if it passes.

If the run is green but the site still hasn't updated, ask a dev
to trigger `workflow_dispatch` on the site repo's `content-sync.yml`.

## File extensions

- `.txt` — plain text. Newlines are preserved literally.
- `.md` — markdown. Rendered as HTML on the site.

The expected extension for each key is defined in `schema.json` —
**do not edit `schema.json` directly**; it's managed by the sync
bot.

## What NOT to edit

The following are managed by the dev team or by automated scripts.
Editing them will not break the site immediately, but the next
sync run will overwrite your changes:

- `schema.json`
- `package.json`, `package-lock.json`
- Anything under `scripts/`
- Anything under `.github/`
