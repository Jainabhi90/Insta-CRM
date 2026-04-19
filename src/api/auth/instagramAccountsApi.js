import { apiRequest } from "../core/apiClient";

// Future backend contract (example):
// { items: [{ id, instagramUserId, instagramUsername, connectedAt, lastUsedAt }] }
export function getSavedInstagramAccounts(email) {
  const normalizedEmail = String(email || "").trim();
  const query = normalizedEmail ? `?email=${encodeURIComponent(normalizedEmail)}` : "";
  return apiRequest(`/api/auth/instagram/accounts${query}`);
}