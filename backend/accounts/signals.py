from django.db.models.signals import post_save
from django.core.mail import send_mail
from django.dispatch import receiver
from accounts.models import CustomUser

@receiver(post_save, sender=CustomUser)
def set_group_to_user_from_user_type(sender, instance, *args, **kwargs):
    user = instance
    user_type = user.type
    if user_type:
        # Assign only the group of the user_type
        user.groups.set([user_type.group])
    else:
        # If user_type is null, clean all the group from user
        user.groups.clear()

@receiver(post_save, sender=CustomUser)
def send_welcome_email(sender, instance, created, **kwargs):
    """Send a welcome email when a new user is created"""
    if created:
        send_mail(
            'Welcome!',
            'Thanks for signing up!',
            'admin@django.com', # from-email
            [instance.email],   # to-email list
            fail_silently=False
        )