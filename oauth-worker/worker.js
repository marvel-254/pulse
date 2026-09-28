/**
 * Pulse OAuth token-exchange Worker
 * Exposes POST /exchange  ->  body { code }
 * Swaps the GitHub OAuth authorization code for an access token.
 * The client_secret lives ONLY here, in the Worker env (GH_CLIENT_SECRET).
 */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    if (request.method === "POST" && url.pathname === "/exchange") {
      const body = await request.json().catch(() => ({}));
      const code = body.code;
      if (!code) {
        return new Response(JSON.stringify({ error: "missing code" }), {
          status: 400,
          headers: { ...cors, "Content-Type": "application/json" },
        });
      }

      const res = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          client_id: env.GH_CLIENT_ID,
          client_secret: env.GH_CLIENT_SECRET,
          code,
        }),
      });

      const data = await res.json();
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true, name: "pulse-oauth" }), {
      status: 200,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  },
};
