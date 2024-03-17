// TODO: What can be done on the support team's contact

import { formatDate } from "../../../utils";

// TODO: provide the login or update password url page
export default (payload: {
    name: string,
    date: string,
    patient: {
        name: string,
        pid: string,
        email: string
    },
    status: string
}) => {
    return `
    <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Patient Appointment</title>
        <style>
          /* Add your styles here */
        </style>
      </head>
      <body>
        <div>
          <h1>Dear ${payload.name},</h1>
          <p>
            You have a new Appointment with Patient. Check your Appointment details below:
          </p>
          <ul>
            <li>Patient Name: ${payload.patient.name}</li>
            <li>Patient ID: ${payload.patient.pid}</li>
            <li>Date: ${formatDate(new Date(payload.date))}</li>
            <li>Date: ${payload.status}</li>
          </ul>
          <p>
            Kindly Login to your SwiftCare Portal to Approve appointment.
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
