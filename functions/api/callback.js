function base64UrlDecode(input) {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function base64UrlEncodeBytes(bytes) {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function signState(payload, secret) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return base64UrlEncodeBytes(new Uint8Array(signature));
}

async function verifyState(state, secret) {
  const [payload, signature] = state.split(".");
  if (!payload || !signature) return null;

  const expected = await signState(payload, secret);
  if (signature !== expected) return null;

  const parsed = JSON.parse(base64UrlDecode(payload));
  const maxAgeMs = 10 * 60 * 1000;
  if (!parsed.created_at || Date.now() - parsed.created_at > maxAgeMs) return null;

  return parsed;
}

function callbackHtml(provider, token, origin) {
  const payload = JSON.stringify({ token, provider });
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>GitHub Authentication</title>
  </head>
  <body>
    <script>
      (function () {
        var origin = ${JSON.stringify(origin)};
        var message = "authorization:${provider}:success:" + ${JSON.stringify(payload)};

        function receiveMessage(event) {
          if (event.data === "authorizing:${provider}") {
            window.opener.postMessage(message, event.origin || origin);
            window.close();
          }
        }

        window.addEventListener("message", receiveMessage, false);
        window.opener.postMessage("authorizing:${provider}", origin);
      })();
    </script>
    <p>Authentication complete. You can close this window.</p>
  </body>
</html>`;
}

function errorHtml(message) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Authentication Error</title>
  </head>
  <body>
    <h1>Authentication Error</h1>
    <p>${message}</p>
  </body>
</html>`;
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const clientId = env.GITHUB_CLIENT_ID;
  const clientSecret = env.GITHUB_CLIENT_SECRET;
  const authSecret = env.DECAP_AUTH_SECRET;

  if (!code || !state) {
    return new Response(errorHtml("Missing OAuth code or state."), {
      status: 400,
      headers: { "content-type": "text/html; charset=utf-8" }
    });
  }

  if (!clientId || !clientSecret || !authSecret) {
    return new Response(errorHtml("Missing GitHub OAuth environment variables."), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" }
    });
  }

  const verifiedState = await verifyState(state, authSecret);
  if (!verifiedState) {
    return new Response(errorHtml("Invalid or expired OAuth state."), {
      status: 401,
      headers: { "content-type": "text/html; charset=utf-8" }
    });
  }

  const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "user-agent": "la-ultima-vigilia-decap-cms"
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: `${url.origin}/api/callback`
    })
  });

  const tokenData = await tokenResponse.json();
  if (!tokenResponse.ok || !tokenData.access_token) {
    return new Response(errorHtml("GitHub did not return an access token."), {
      status: 502,
      headers: { "content-type": "text/html; charset=utf-8" }
    });
  }

  return new Response(callbackHtml("github", tokenData.access_token, verifiedState.origin), {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store"
    }
  });
}
