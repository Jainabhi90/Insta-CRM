export function readInstagramCallbackParams(search) {
  const params = new URLSearchParams(search)
  const code = params.get("code")
  const state = params.get("state")
  const error = params.get("error")
  const errorReason = params.get("error_reason")
  const errorDescription = params.get("error_description")

  if (!code && !error && !errorReason) {
    return null
  }

  return {
    code,
    state,
    error,
    errorReason,
    errorDescription,
  }
}
