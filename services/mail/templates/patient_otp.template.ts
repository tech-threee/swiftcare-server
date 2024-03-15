// TODO: What can be done on the support team's contact
// TODO: provide the login or update password url page
export default (payload: { otp: string }) => {
    return `
    <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Swiftcare Login OTP</title>
        <style>
          /* Add your styles here */
        </style>
      </head>
      <body>
        <div>
          <h1>Swiftcare Login OTP!</h1>
          <p>
            Hello SwiftCare Connector, Your OTP is: ${payload.otp}
          </p>

          <p>
            If you did not perform this login action on your account, do not share this PIn with anyone.
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
