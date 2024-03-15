// TODO: Look into getting the users location
export default (payload: {
  name: string;
  ip?: string;
  device?: string;
  location?: string;
}) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Notification</title>
  </head>
  <body>
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Login Notification</h2>
      <p>Dear ${payload.name},</p>
      <p>We wanted to inform you that there has been a successful login to your account.</p>
      <p>If you did not perform this action or suspect any unauthorized access, please contact our support team immediately.</p>
      <p>Details of the login:</p>
      <ul>
      <li><strong>Date and Time:</strong> ${new Date().toString()}</li>
      <li><strong>IP Address:</strong> ${payload.ip ?? 'IP not found'}</li>
      <li><strong>Device:</strong> ${
        payload.device ?? 'Device information not found'
      }</li>
      <li><strong>Location:</strong>  ${
        payload.location ?? 'Location not found'
      }</li>
      </ul>
      <p>Thank you for using our services!</p>
      <p>Best regards,<br>SwiftCare</p>
    </div>
  </body>
  </html>
`;
};
