function base64UrlEncode(input) {
  const bytes = new TextEncoder().encode(input);
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
  return btoa(String.fromCharCode(...new Uint8Array(signature))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const clientId = env.GITHUB_CLIENT_ID;
  const authSecret = env.DECAP_AUTH_SECRET;

  if (!clientId || !authSecret) {
    return new Response("Missing GitHub OAuth configuration.", { status: 500 });
  }

  const origin = url.origin;
  const payload = JSON.stringify({
    origin,
    nonce: crypto.randomUUID(),
    created_at: Date.now()
  });
  const encodedPayload = base64UrlEncode(payload);
  const signature = await signState(encodedPayload, authSecret);
  const state = `${encodedPayload}.${signature}`;

  const redirectUri = `${url.origin}/api/callback`;
  const githubUrl = new URL("https://github.com/login/oauth/authorize");
  githubUrl.searchParams.set("client_id", clientId);
  githubUrl.searchParams.set("redirect_uri", redirectUri);
  githubUrl.searchParams.set("scope", "repo,user");
  githubUrl.searchParams.set("state", state);

  return Response.redirect(githubUrl.toString(), 302);
}
