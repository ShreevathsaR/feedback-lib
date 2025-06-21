import { resend } from "@/lib/resend";
import VerificationEmail from "../../mails/VerificationMail";
import { ApiResponse } from "@/types/apiResponse";

const sendVerificationEmail = async (
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> => {
  try {
    const {data, error} = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [email],
      subject: "Feeback Lib | Verification code",
      react: VerificationEmail({ username, otp: verifyCode}),
    });

    if(error){
        console.log("Error sending mail", error)
        return {
            success: false,
            message: "Verification email not sent",
        };
    }
    
    console.log("Sent mail", data)
    return {
        success: true,
        message: "Verification email sent successfully",
    };
  } catch (error) {
    console.error("Error sending verification email");
    return {
      success: false,
      message: "Error sending verification email",
    };
  }
};

export default sendVerificationEmail;
