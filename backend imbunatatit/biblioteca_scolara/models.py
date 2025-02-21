from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.contrib.auth.hashers import check_password
from django.core.validators import MinValueValidator, MaxValueValidator
import datetime

### Manager pentru utilizator
class UtilizatorManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Adresa de email este obligatorie")
        email = self.normalize_email(email)
        extra_fields.setdefault("is_active", True)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)  # Setează parola corect criptată
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, **extra_fields):
        """Creează un superuser """
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        
        if extra_fields.get("tip"):  # Ne asigurăm că 'tip' nu este necesar
            del extra_fields["tip"]

        return self.create_user(email, password, **extra_fields)


### Model pentru Utilizator
class Utilizator(AbstractBaseUser, PermissionsMixin):
    TIP_UTILIZATOR = [
        ("elev", "Elev"),
        ("bibliotecar", "Bibliotecar"),
    ]

    id = models.AutoField(primary_key=True)
    email = models.EmailField(unique=True)
    tip = models.CharField(max_length=15, choices=TIP_UTILIZATOR, blank=True, null=True)
    nume = models.CharField(max_length=255)
    prenume = models.CharField(max_length=255)
    data_nasterii = models.DateField()
    oras = models.CharField(max_length=100, blank=True, null=True) 
    poza = models.ImageField(upload_to="poze_utilizatori/", blank=True, null=True, default="default/library.jpg")  

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["tip", "nume", "prenume", "data_nasterii"]

    objects = UtilizatorManager()

    class Meta:
        db_table = 'utilizatori'
        ordering = ['nume', 'prenume']
        verbose_name = "Utilizator"
        verbose_name_plural = "Utilizatori"

    def __str__(self):
        if self.is_superuser:
            return f"{self.nume} {self.prenume} - Admin"
        return f"{self.nume} {self.prenume} - {self.tip}"

    def verifica_parola(self, parola):
        """Verifică dacă parola introdusă corespunde cu parola utilizatorului."""
        return check_password(parola, self.password)  # Folosim metoda Django pentru verificare
    
    def save(self, *args, **kwargs):
        """Asigură criptarea parolei înainte de salvare"""
        if self.password and not self.password.startswith('pbkdf2_sha256$'):  # Verifică dacă parola există și nu e criptată
            self.set_password(self.password)  # Django criptează parola
        super().save(*args, **kwargs)

    def get_data_nasterii_display(self):
        return self.data_nasterii.strftime("%d.%m.%Y")

### Model pentru Carte
class Carte(models.Model):
    CATEGORII_CHOICES = [
        ('Literatură', 'Literatură'),
        ('Științe exacte', 'Științe exacte'),
        ('Științe sociale', 'Științe sociale'),
        ('Educație', 'Educație'),
        ('Dezvoltare personală', 'Dezvoltare personală'),
    ]

    titlu = models.CharField(max_length=255)
    autor = models.CharField(max_length=255)
    descriere = models.TextField(blank=True, null=True)
    publicatie = models.IntegerField(
        blank=True, null=True,
        validators=[
            MinValueValidator(1900),
            MaxValueValidator(datetime.date.today().year)
        ]
    )
    @property
    def exemplare_disponibile(self):
        """Calculează numărul de exemplare disponibile"""
        return self.exemplare.filter(stare="disponibil").count()
    isbn = models.CharField(unique=True, max_length=13, blank=True, null=True)
    categorie = models.CharField(max_length=30, choices=CATEGORII_CHOICES)
    poza = models.URLField(blank=True, null=True)

    def __str__(self):
        return f"{self.titlu} - {self.autor} ({self.categorie})"

    class Meta:
        db_table = 'carti'
        ordering = ['titlu']
        verbose_name = "Carte"
        verbose_name_plural = "Cărți"


### Model pentru Exemplar
class Exemplar(models.Model):
    STARE_CHOICES = [
        ('disponibil', 'Disponibil'),
        ('imprumutat', 'Împrumutat'),
        ('deteriorat', 'Deteriorat'),
    ]

    carte = models.ForeignKey(Carte, on_delete=models.CASCADE, related_name="exemplare")
    cod_unic = models.CharField(max_length=20, unique=True)
    locatie = models.CharField(max_length=255, blank=True, null=True)
    stare = models.CharField(max_length=20, choices=STARE_CHOICES, default='disponibil')

    def __str__(self):
        return f"Exemplar {self.cod_unic} - {self.carte.titlu} ({self.stare})"

    class Meta:
        db_table = 'exemplare'
        ordering = ['carte', 'cod_unic']
        verbose_name = "Exemplar"
        verbose_name_plural = "Exemplare"


### Model pentru Împrumut
class Imprumut(models.Model):
    utilizator = models.ForeignKey(Utilizator, on_delete=models.CASCADE, related_name="imprumuturi")
    exemplar = models.ForeignKey(Exemplar, on_delete=models.CASCADE, related_name="imprumuturi")
    data_imprumut = models.DateField(auto_now_add=True)
    data_scadenta = models.DateField(blank=True, null=True)
    data_restituire = models.DateField(blank=True, null=True)
    returnat = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if not self.data_scadenta:
            self.data_scadenta = self.data_imprumut + datetime.timedelta(days=14)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.utilizator.nume} {self.utilizator.prenume} a împrumutat {self.exemplar.carte.titlu} (Exemplar: {self.exemplar.cod_unic})"

    class Meta:
        db_table = 'imprumuturi'
        ordering = ['-data_imprumut']
        verbose_name = "Împrumut"
        verbose_name_plural = "Împrumuturi"


### Model pentru Recenzie
class Recenzie(models.Model):
    utilizator = models.ForeignKey(Utilizator, on_delete=models.CASCADE, related_name="recenzii")
    carte = models.ForeignKey(Carte, on_delete=models.CASCADE, related_name="recenzii")
    rating = models.IntegerField(choices=[(i, i) for i in range(5, 11)])
    comentariu = models.TextField(blank=True, null=True)
    data_postare = models.DateTimeField(auto_now_add=True)
    aprobat = models.BooleanField(default=False)

    def __str__(self):
        return f"Recenzie {self.utilizator.nume} {self.utilizator.prenume} - {self.carte.titlu}"

    class Meta:
        db_table = 'recenzii'
        ordering = ['-data_postare']
        verbose_name = "Recenzie"
        verbose_name_plural = "Recenzii"


### Model pentru Log
class Log(models.Model):
    utilizator_email = models.EmailField(blank=True, null=True)
    actiune = models.TextField(blank=True, null=True)
    data_actiune = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Log: {self.utilizator_email} - {self.data_actiune}"

    class Meta:
        db_table = 'loguri'
        ordering = ['-data_actiune']
        verbose_name = "Log activitate"
        verbose_name_plural = "Loguri activitate"
