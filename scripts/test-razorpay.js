const dotenv = require("dotenv");
const path = require("path");

// Load the local .env file
dotenv.config({ path: path.join(__dirname, "../.env") });

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

async function testRazorpay() {
  console.log("=== Razorpay Local Diagnostic ===");
  console.log("Key ID from .env:", keyId);
  console.log("Key Secret Length:", keySecret ? keySecret.length : 0);
  
  if (!keyId || !keySecret || keySecret === "YOUR_RAZORPAY_KEY_SECRET_HERE") {
    console.error("❌ Please open your local .env file and set RAZORPAY_KEY_SECRET to your actual test secret key.");
    process.exit(1);
  }

  const token = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  const authHeader = `Basic ${token}`;

  try {
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: 100, // 1 INR
        currency: "INR",
        receipt: "test_diagnostic_receipt",
      }),
    });

    const data = await response.json().catch(() => null);

    if (response.ok) {
      console.log("✅ SUCCESS! Razorpay API accepted the credentials and created an order:");
      console.log(data);
    } else {
      console.error(`❌ Razorpay API rejected request with status ${response.status}:`);
      console.error(data);
    }
  } catch (error) {
    console.error("❌ Fetch error:", error.message);
  }
}

testRazorpay();
