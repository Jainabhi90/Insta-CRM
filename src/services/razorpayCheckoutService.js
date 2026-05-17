const RAZORPAY_SCRIPT_ID = "instalead-razorpay-checkout"
const RAZORPAY_SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js"

function isRazorpayAvailable() {
  return typeof window !== "undefined" && typeof window.Razorpay === "function"
}

export function loadRazorpayCheckout() {
  if (isRazorpayAvailable()) {
    return Promise.resolve(window.Razorpay)
  }

  if (typeof document === "undefined") {
    return Promise.reject(new Error("Razorpay checkout can only load in the browser."))
  }

  const existingScript = document.getElementById(RAZORPAY_SCRIPT_ID)

  if (existingScript) {
    return new Promise((resolve, reject) => {
      existingScript.addEventListener("load", () => resolve(window.Razorpay), { once: true })
      existingScript.addEventListener(
        "error",
        () => reject(new Error("Razorpay checkout could not be loaded right now.")),
        { once: true },
      )
    })
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script")
    script.id = RAZORPAY_SCRIPT_ID
    script.src = RAZORPAY_SCRIPT_SRC
    script.async = true
    script.onload = () => resolve(window.Razorpay)
    script.onerror = () => reject(new Error("Razorpay checkout could not be loaded right now."))
    document.body.appendChild(script)
  })
}
