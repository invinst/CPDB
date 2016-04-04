from django.core.mail import send_mail

from cpdb.celery import app
from api.models import Setting


@app.task
def send_document_notification(crid, link, recipient_list):
    setting = Setting.objects.all().first()
    subject = setting.requested_document_email_subject.format(crid=crid)
    message = setting.requested_document_email_text.format(crid=crid, link=link)
    from_email = None

    for user_email in recipient_list:
        send_mail(
            subject=subject,
            message=message,
            from_email=from_email,
            recipient_list=[user_email]
        )

    send_document_notification.called = True
