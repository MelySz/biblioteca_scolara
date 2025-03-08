from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Utilizator

@receiver(post_save, sender=Utilizator)
def setare_parola_implicita(sender, instance, created, **kwargs):
    if created and (not instance.password or not instance.password.startswith('pbkdf2_sha256$')):
        instance.set_password(instance.data_nasterii.strftime("%d.%m.%Y"))  # Setează parola implicită
        instance.save()
