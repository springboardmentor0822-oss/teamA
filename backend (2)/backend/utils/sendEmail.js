// const transporter = require("../config/emailConfig");

// const sendEmail = async (to, subject, html) => {
//   try {
//     await transporter.sendMail({
//       from: `"Civix" <${process.env.EMAIL_USER}>`,
//       to,
//       subject,
//       html,
//     });
//   } catch (error) {
//     console.error("Email error:", error);
//     throw new Error("Email sending failed");
//   }
// };

// module.exports = sendEmail;
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"Civix" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("Email sent successfully");
  } 
  catch(error){console.error("Email sending failed:", error.message);}
};

module.exports = sendEmail;