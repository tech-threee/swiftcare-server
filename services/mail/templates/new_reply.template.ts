export default (payload: {
  name: string;
  link: string;
  topic: string;
}) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Reply Notification</title>
</head>
<body>
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
        <h2>New Reply Notification</h2>
        <p>${payload.name} has replied to a discussion you're a part of!</p>
        <p>Discussion Topic: ${payload.topic}</p>
        <p>Reply:</p>
        <p>You can view the reply by clicking the link below:</p>
        <a href="${payload.link}" style="display: block; margin-top: 10px; color: #fff; background-color: #007BFF; text-align: center; padding: 10px; text-decoration: none; border-radius: 3px;">View Reply</a>
    </div>
</body>
</html>`;
