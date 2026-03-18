import nodemailer from "nodemailer";

export const sendInvoiceEmail = async (userEmail, invoicePath) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.email,          // tumhara Gmail
        pass: process.env.app_password,   // 16-digit app password
      },
    });

    const mailOptions = {
      from: process.env.email,
      to: userEmail,
      subject: "APNACART Online Shoping",
      text: "Thank you for your order. Please find attached APNACART PDF.",
      attachments: [
        {
          filename: "APNACART.pdf",
          path: invoicePath,
        },
      ],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("EMAIL SENT SUCCESSFULLY:", info.messageId);
    return info;

  } catch (error) {
    console.error("EMAIL SENDING ERROR:", error.message);
    throw new Error("Failed to send invoice email");
  }
};


// deleverd OTP

export const sendSimpleEmail = async (to, subject, message) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.email,
        pass: process.env.app_password,
      },
    });

    const mailOptions = {
      from: process.env.email,
      to,
      subject,
      text: message,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("SIMPLE EMAIL SENT:", info.messageId);
    return info;

  } catch (error) {
    console.error("SIMPLE EMAIL ERROR:", error.message);
    throw new Error("Failed to send simple email");
  }
};
