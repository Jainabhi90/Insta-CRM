import { apiRequest } from "../core/apiClient"

export function createRazorpayCheckoutOrder(payload) {
  return apiRequest("/api/payments/razorpay/order", {
    method: "POST",
    body: payload,
  })
}

export function verifyRazorpayCheckoutPayment(payload) {
  return apiRequest("/api/payments/razorpay/verify", {
    method: "POST",
    body: payload,
  })
}
