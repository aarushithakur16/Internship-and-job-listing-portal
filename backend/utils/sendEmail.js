const nodemailer = require("nodemailer");

/**
 * Send application confirmation email using Nodemailer
 * @param {Object} options
 * @param {string} options.to - Recipient email address
 * @param {string} options.applicantName - Name of the applicant
 * @param {string} options.opportunityTitle - Job/Internship title
 * @param {string} options.companyName - Company name
 */
const sendApplicationEmail = async ({ to, applicantName, opportunityTitle, companyName }) => {
  const { EMAIL_SERVICE, EMAIL_USER, EMAIL_PASS, EMAIL_FROM } = process.env;

  // Gracefully fallback if credentials are not configured in environment
  if (!EMAIL_USER || !EMAIL_PASS) {
    return {
      success: true,
      mocked: true,
      message: `[Email Service Notice] Email credentials not set in environment. Mocking confirmation email to ${to} for "${opportunityTitle}" at "${companyName}".`,
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      service: EMAIL_SERVICE || "gmail",
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: EMAIL_FROM || `InternHub Careers <${EMAIL_USER}>`,
      to,
      subject: `Application Received: ${opportunityTitle} at ${companyName}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #fafafa;">
          <div style="background: linear-gradient(135deg, #ddd6fe 0%, #fbcfe8 100%); padding: 20px; border-radius: 8px; text-align: center;">
            <h1 style="color: #4338ca; margin: 0; font-size: 24px;">✨ InternHub</h1>
            <p style="color: #6b21a8; margin: 4px 0 0; font-size: 14px;">Application Confirmation</p>
          </div>
          <div style="padding: 24px 8px; color: #334155;">
            <p style="font-size: 16px;">Dear <strong>${applicantName}</strong>,</p>
            <p style="font-size: 15px; line-height: 1.6;">
              Thank you for applying for the <strong>${opportunityTitle}</strong> role at <strong>${companyName}</strong> through InternHub!
            </p>
            <div style="background-color: #ffffff; border: 1px solid #e0e7ff; border-radius: 8px; padding: 16px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px; color: #4338ca; font-size: 16px;">Application Details</h3>
              <p style="margin: 4px 0; font-size: 14px;"><strong>Position:</strong> ${opportunityTitle}</p>
              <p style="margin: 4px 0; font-size: 14px;"><strong>Company:</strong> ${companyName}</p>
              <p style="margin: 4px 0; font-size: 14px;"><strong>Status:</strong> Successfully Submitted</p>
            </div>
            <p style="font-size: 14px; color: #64748b; line-height: 1.5;">
              The hiring team has received your application and resume. If your profile matches their requirements, they will reach out directly.
            </p>
            <p style="font-size: 14px; color: #64748b; margin-top: 24px;">
              Best regards,<br />
              <strong>The InternHub Team</strong>
            </p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    // Non-fatal error so application submission doesn't fail if SMTP server fails
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendApplicationEmail,
};
