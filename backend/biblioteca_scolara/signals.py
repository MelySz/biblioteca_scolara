from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import Elev, Bibliotecar

@receiver(post_save, sender=Elev)
def create_elev_user(sender, instance, created, **kwargs):
    if created:
        user = User.objects.create(
            username=f"{instance.nume} {instance.prenume}",  # Autentificare cu Nume Prenume
            email=instance.email, 
        )
        user.set_password(instance.nr_matricol)  # Parola = Nr. Matricol
        user.save()
        instance.user = user
        instance.save()

@receiver(post_save, sender=Bibliotecar)
def create_bibliotecar_user(sender, instance, created, **kwargs):
    if created:
        data_nasterii_str = instance.data_nasterii.strftime("%d.%m.%Y") if instance.data_nasterii else "00.00.0000"
        user = User.objects.create(
            username=f"{instance.nume} {instance.prenume}",  # Autentificare cu Nume Prenume
            email=instance.email, 
        )
        user.set_password(data_nasterii_str)  # Parola = Data Nașterii (DD.MM.YYYY)
        user.save()
        instance.user = user
        instance.save()
