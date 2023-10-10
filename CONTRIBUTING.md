This repo is honestly not in a state for much outside contribution, so go at your own risk!

Setting up:

- make sure you have node 16 installed.
- `corepack prepare pnpm@8.6.12`
- from repo root: `pnpm install && pnpm build-client && pnpm dev`
- If you're making server changes, make sure to run `pnpm build-client` before checking typescript on the client to propgrate types down.
- deployments automatically on merge
