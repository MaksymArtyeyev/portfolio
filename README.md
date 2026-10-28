# portfolio

Minimal static portfolio site for Maksym Artyeyev. Plain HTML, CSS, and vanilla JavaScript. No framework and no build step.

## Files

- `index.html`: page structure, impact strip, summary, role selector, contact links.
- `styles.css`: all styling. The single accent color is `--accent` at the top.
- `script.js`: project data and the card rendering and role selector logic.

## Edit project cards

Cards are rendered from the `PROJECTS` array at the top of `script.js`. To add a card, add one object:

```js
{
  id: "unique-id",
  title: "Project name",
  status: "",              // "soon" shows a "Coming soon" tag
  plan: "",                // optional short note under the title
  tags: ["integrations"],  // any of "bsa", "integrations", "automation"
  problem: "...",
  built: "...",
  result: "...",           // a real, measured result
  demo: "https://...",     // or null for a disabled placeholder
  code: "https://..."      // or null for a disabled placeholder
}
```

The "What are you hiring for?" selector moves cards whose `tags` include the chosen role to the top and highlights them. The choice is stored in the URL hash (for example `#for=automation`) and restored on load.

## Edit placeholders

- Impact numbers: the four `.tile` items in `index.html`. Replace the value and label, and remove the `Placeholder` tag only once the number is real and verifiable.
- Contact links: the `.contact-list` in `index.html`. Set each `href` (for example `mailto:you@example.com`), remove the `Placeholder` tag and the `placeholder-link` class.

## Run locally

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Deploy to Vercel (static)

1. Import this GitHub repo in Vercel.
2. Framework preset: Other. Leave the build command and output directory empty (the root `index.html` is served as is).
3. Deploy. Pushes to `main` redeploy automatically.
