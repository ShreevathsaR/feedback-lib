import { transporter } from "@/lib/nodemailer";
import { ApiResponse } from "@/types/apiResponse";
import { emailHtml } from "../../mails/VerificationMail";

const sendVerificationEmail = async (
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> => {

  console.log(`Sending mail to ${email} ${username} with ${verifyCode}`)

  const options = {
    from: "feedbacklib.app@gmail.com",
    to: [email],
    subject: "Feeback Lib | Verification code",
    html: await emailHtml({username,otp: verifyCode}),
  };

  try {
    const info = await transporter.sendMail(options);

    if (info.rejected.length > 0) {
      console.log("Error sending mail", info.rejected);
      return {
        success: false,
        message: "Verification email not sent",
      };
    }

    console.log("Sent mail", info.messageId);
    return {
      success: true,
      message: "Verification email sent successfully",
    };
  } catch (error) {
    console.error("Error sending verification email", error);
    return {
      success: false,
      message: "Error sending verification email",
    };
  }
};

export default sendVerificationEmail;
