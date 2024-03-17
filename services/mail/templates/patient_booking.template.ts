// TODO: What can be done on the support team's contact

import { formatDate } from "../../../utils";

// TODO: provide the login or update password url page
export default (payload: {
    name: string,
    date: string,
    doctor: string,
    status: string
}) => {
    return `
    <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmed Appointment Booking</title>
        <style>
          /* Add your styles here */
        </style>
      </head>
      <body>
        <div>
          <h1>Dear ${payload.name},</h1>
          <p>
            You have successfuly booked a Doctor Appointment. Check your Appointment detailes below:
          </p>
          <ul>
            <li>Docor: ${payload.doctor}</li>
            <li>Date: ${formatDate(new Date(payload.date))}</li>
            <li>Status: ${payload.status}</li>
          </ul>
          <p>
            You can check your appointment status from your SwiftCare Connect App.
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
