import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
if (!apiKey) {
  console.error("❌ ERROR: RESEND_API_KEY is not defined in the environment variables.");
  console.error("Please add RESEND_API_KEY to your .env.local or .env file.");
  process.exit(1);
}

const resend = new Resend(apiKey);

async function testEmail() {
  console.log("🚀 Attempting to send a test email...");
  console.log("Using From: Luwia Orders <orders@luwia.in>");
  console.log("To: luwiaskinscience@gmail.com");

  try {
    const response = await resend.emails.send({
      from: "Luwia Orders <orders@luwia.in>",
      to: "luwiaskinscience@gmail.com",
      subject: "Test Diagnostic Email — Luwia",
      html: "<p>If you are reading this, your Resend API configuration is working correctly! 🎉</p>",
    });

    if (response.error) {
      console.error("\n❌ FAILED TO SEND EMAIL");
      console.error("Resend returned the following error:");
      console.error(response.error);
      
      if (response.error.name === "validation_error" && response.error.message.includes("domain")) {
        console.error("\n💡 HINT: Your domain 'luwia.in' might not be fully verified in your Resend account, or something is misconfigured.");
        console.error("You must go to https://resend.com/domains and add the required DNS records.");
      }
    } else {
      console.log("\n✅ EMAIL SENT SUCCESSFULLY!");
      console.log("Response ID:", response.data?.id);
      console.log("Please check your luwiaskinscience@gmail.com inbox (and spam folder).");
    }
  } catch (err) {
    console.error("\n❌ FATAL EXCEPTION OCCURRED:", err);
  }
}

testEmail();
