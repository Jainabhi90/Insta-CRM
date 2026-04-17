const DEFAULT_GOOGLE_SCOPE = "openid email profile";

export function getGoogleClientId() {
  return (import.meta.env.VITE_GOOGLE_CLIENT_ID || "").trim();
}

export function getGoogleRedirectUri() {
  const configuredRedirect = (import.meta.env.VITE_GOOGLE_REDIRECT_URI || "").trim();

  if (configuredRedirect) {
    return configuredRedirect;
  }

  if (typeof window === "undefined") {
    return "";
  }

  return `${window.location.origin}/auth/google/callback`;
}

export function buildGoogleAuthorizeUrl() {
  const clientId = getGoogleClientId();
  const redirectUri = getGoogleRedirectUri();

  if (!clientId || !redirectUri) {
    return null;
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: import.meta.env.VITE_GOOGLE_SCOPE || DEFAULT_GOOGLE_SCOPE,
    access_type: "offline",
    include_granted_scopes: "true",
    prompt: "select_account",
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}
