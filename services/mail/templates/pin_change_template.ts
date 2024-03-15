// TODO: What can be done on the support team's contact
export default (payload: { name: string; studentID: string; pin: string }) => {
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
          <h1>Hello ${payload.name}!</h1>
          <p>
           Your pin has been changed successfully. From now onwards, use the following information to log in:
          </p>
          <ul>
            <li>ID: ${payload.studentID}</li>
            <li>PIN: ${payload.pin}</li>
          </ul>
          <p>
            Click <a href="[Your Login Page URL]">here</a> to log in. Once logged in, you can re-change your pin in the account settings.
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
