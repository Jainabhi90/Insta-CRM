const DEFAULT_INSTAGRAM_CLIENT_ID = "3306198099545111"
const DEFAULT_INSTAGRAM_SCOPE =
  "instagram_business_basic,instagram_business_manage_messages,instagram_business_manage_comments,instagram_business_content_publish,instagram_business_manage_insights"

export function getInstagramRedirectUri() {
  if (typeof window === "undefined") {
    return import.meta.env.VITE_INSTAGRAM_REDIRECT_URI || ""
  }

  return import.meta.env.VITE_INSTAGRAM_REDIRECT_URI || `${window.location.origin}/auth/callback`
}

export function buildInstagramAuthorizeUrl() {
  const clientId = import.meta.env.VITE_INSTAGRAM_CLIENT_ID || DEFAULT_INSTAGRAM_CLIENT_ID
  const redirectUri = getInstagramRedirectUri()

  if (!clientId || !redirectUri) {
    return null
  }

  const scope = import.meta.env.VITE_INSTAGRAM_SCOPE || DEFAULT_INSTAGRAM_SCOPE
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope,
    state: `instalead-signup-${Date.now()}`,
  })

  if (import.meta.env.VITE_INSTAGRAM_FORCE_REAUTH !== "false") {
    params.set("force_reauth", "true")
  }

  return `https://www.instagram.com/oauth/authorize?${params.toString()}`
}

export function buildDemoInstagramCallbackUrl() {
  if (typeof window === "undefined") {
    return getInstagramRedirectUri()
  }

  const redirectUrl = new URL(getInstagramRedirectUri(), window.location.origin)
  redirectUrl.searchParams.set("code", `demo-${Date.now()}`)
  redirectUrl.searchParams.set("state", "demo-local")

  return redirectUrl.toString()
}
