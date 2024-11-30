import nodemailer from 'nodemailer';

// Create a Nodemailer transport instance
const transporter = nodemailer.createTransport({
  service: 'gmail',  // You can use any email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send OTP via email
export const sendOtp = async (gmail, otp) => {
  try {
    // Construct the OTP email content
    const message = {
      from: process.env.EMAIL_USER,
      to: gmail,  
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}`,
    };

    // Send the email
    await transporter.sendMail(message);
  } catch (error) {
    throw new Error('Failed to send OTP');
  }
};
