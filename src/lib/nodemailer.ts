// import { Resend } from "resend";
// export const resend = new Resend(process.env.RESEND_API_KEY);

import nodemailer from "nodemailer";
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});
