export default (payload: {
  name: string;
  link: string;
  topic: string;
}) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Communication Invitation</title>
</head>
<body>
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
        <h2>Communication Invitation</h2>
        <p>${payload.name} has started a new discussion and invites you to join!</p>
        <p>Discussion Topic: ${payload.topic}</p>
        <p>You can join the discussion by clicking the link below:</p>
        <a href="${payload.link}" style="display: block; margin-top: 10px; color: #fff; background-color: #007BFF; text-align: center; padding: 10px; text-decoration: none; border-radius: 3px;">Join Discussion</a>
        <p>If you have any questions or concerns, feel free to reply to this email.</p>
        <p>Best regards,<br>${payload.name}</p>
    </div>
</body>
</html>`;
