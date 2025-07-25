import emailjs from "@emailjs/browser";

export const sendEmailAutoReply = async ({
  name,
  email,
  platform,
  questions_summary,
  ai_reply,
  title,
}) => {
  try {
    const result = await emailjs.send(
      "service_ko8pwss",
      "template_1gmz1nt",
      {
        name,
        email,
        platform,
        questions_summary,
        ai_reply,
        title,
      },
      "f4sieCt7NtKKMnxFd"
    );

    console.log("✅ Email sent:", result.text);
    return true;
  } catch (error) {
    console.error("❌ Failed to send email:", error);
    return false;
  }
};
