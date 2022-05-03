import smtplib
from email.mime.text import MIMEText
import os
from dotenv import load_dotenv

load_dotenv()

async def send_email(sender, receivers, subject, body):

    host = os.getenv("SMTP_HOST")
    port = os.getenv("SMTP_PORT")

    # sender = 'admin@example.com'
    # receivers = ['test@gmail.com']

    msg = MIMEText(body)
    msg['Subject'] = subject
    #msg['From'] = 'admin@example.com'
    #msg['To'] = 'test@gmail.com'

    with smtplib.SMTP(host, port) as server:

        # server.login('username', 'password')
        server.sendmail(sender, receivers, msg.as_string())
        print("Successfully sent email")
