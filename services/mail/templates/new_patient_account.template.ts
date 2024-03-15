// TODO: What can be done on the support team's contact
// TODO: provide the login or update password url page
export default (payload: { name: string; email: string; id: string }) => {
  return `
  <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to SwiftCare</title>
      <style>
        /* Add your styles here */
      </style>
    </head>
    <body>
      <div>
        <h1>Welcome to SwiftCare, ${payload.name}!</h1>
        <p>
          Your SwiftCare account has been created. To get started, check your patient record below:
        </p>
        <ul>
          <li>Email: ${payload.email}</li>
          <li>Patient ID: ${payload.id}</li>
        </ul>
        <p>
          Click <a href="[Your Login Page URL]">here</a> to log in. Once logged in, you can update your personal information in the account settings.
        </p>
        <p>
          If you have any questions or need assistance, feel free to contact our support team.
        </p>
        <p>
          Best regards,<br>
          The SwiftCare Team
        </p>
      </div>
    </body>
    </html>
  `;
};
