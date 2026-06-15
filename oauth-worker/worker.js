/**
 * GitHub OAuth proxy for Decap CMS, running on a free Cloudflare Worker.
 *
 * Why this exists: GitHub Pages serves only static files, so it can't keep
 * the OAuth client secret. This tiny Worker does the GitHub login handshake
 * and hands the editor (/admin/) a token. Deploy once, then never touch it.
 *
 * Set these as Worker secrets (NOT in this file):
 *   GITHUB_CLIENT_ID
 *   GITHUB_CLIENT_SECRET
 */

const ALLOWED_ORIGIN = "https://carlogiorgio.github.io";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Step 1: editor sends the user here -> redirect to GitHub login
    if (url.pathname === "/auth") {
      const redirect = `${url.origin}/callback`;
      const gh = new URL("https://github.com/login/oauth/authorize");
      gh.searchParams.set("client_id", env.GITHUB_CLIENT_ID);
      gh.searchParams.set("redirect_uri", redirect);
      gh.searchParams.set("scope", "repo");
      gh.searchParams.set("state", crypto.randomUUID());
      return Response.redirect(gh.toString(), 302);
    }

    // Step 2: GitHub redirects back here with a code -> swap for a token
    if (url.pathname === "/callback") {
      const code = url.searchParams.get("code");
      if (!code) return new Response("Missing code", { status: 400 });

      const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code,
        }),
      });
      const data = await tokenRes.json();

      const content = data.access_token
        ? { token: data.access_token, provider: "github" }
        : { error: data.error_description || "OAuth failed" };
      const status = data.access_token ? "success" : "error";

      // Hand the token back to the editor window via postMessage
      const body = `<!doctype html><html><body><script>
        (function () {
          function send(e) {
            window.opener.postMessage(
              'authorization:github:${status}:${JSON.stringify(content)}',
              "${ALLOWED_ORIGIN}"
            );
          }
          window.addEventListener("message", send, false);
          window.opener.postMessage("authorizing:github", "${ALLOWED_ORIGIN}");
        })();
      </script></body></html>`;

      return new Response(body, { headers: { "Content-Type": "text/html" } });
    }

    return new Response("Decap OAuth worker is running.", { status: 200 });
  },
};
