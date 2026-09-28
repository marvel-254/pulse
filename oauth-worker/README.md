# Pulse OAuth Worker (Cloudflare Workers)

Swap GitHub OAuth authorization codes for access tokens.
The frontend calls `POST <worker-url>/exchange` with `{ "code": "..." }`.

## Deploy

1. Install Cloudflare CLI:
   ```bash
   npm install -g wrangler
   ```
2. Login & deploy from this folder:
   ```bash
   cd oauth-worker
   wrangler login
   wrangler deploy
   ```
3. Set the client secret as a **bound secret** (never committed):
   ```bash
   wrangler secret put GH_CLIENT_SECRET
   # paste your GitHub OAuth App client secret (keep it private)
   ```

The Client ID is public (`GH_CLIENT_ID` is in `wrangler.toml`).

## After deploy
- Note the worker URL: `https://pulse-oauth.<your-subdomain>.workers.dev`
- Put that URL into `js/config.js` → `workerUrl`, and set `enabled: true`.
- In your GitHub **OAuth App** (settings/developers), the **Authorization callback URL** must be:
  ```
  https://marvel-254.github.io/pulse/
  ```

## Test the endpoint (optional)
```bash
curl -X POST https://pulse-oauth.<subdomain>.workers.dev/exchange \
  -H "Content-Type: application/json" \
  -d '{"code":"test"}'
```

> Security: the secret should only exist as a Cloudflare secret. Rotate it in
> GitHub settings if it was ever exposed (e.g. pasted in a chat).
