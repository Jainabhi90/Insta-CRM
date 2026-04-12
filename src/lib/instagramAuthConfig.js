export function getInstagramRedirectUri() {
  if (typeof window === "undefined") {
    return import.meta.env.VITE_INSTAGRAM_REDIRECT_URI || ""
  }

  return import.meta.env.VITE_INSTAGRAM_REDIRECT_URI || `${window.location.origin}/dashboard`
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
