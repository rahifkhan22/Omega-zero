import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os


def send_email_notification(
    to_email: str, subject: str, body: str
) -> bool:
    """
    Send an email notification via SMTP.

    Args:
        to_email: Recipient email address.
        subject: Email subject line.
        body: HTML body content.

    Returns:
        True if email sent successfully, False otherwise.
    """
    smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_USER", "")
    smtp_pass = os.getenv("SMTP_PASS", "")

    if not smtp_user or not smtp_pass:
        print("⚠️  SMTP credentials not configured. Skipping email.")
        return False

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = smtp_user
        msg["To"] = to_email

        html_part = MIMEText(body, "html")
        msg.attach(html_part)

        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_pass)
            server.sendmail(smtp_user, to_email, msg.as_string())

        print(f"✅ Email sent to {to_email}")
        return True

    except Exception as e:
        print(f"❌ Failed to send email: {e}")
        return False
