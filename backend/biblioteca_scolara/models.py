from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator, RegexValidator
from django.contrib.auth.hashers import make_password, check_password
import datetime

### Model pentru Bibliotecar
class Bibliotecar(models.Model):
    nume = models.CharField(max_length=255)
    prenume = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    parola = models.CharField(max_length=255)  # Criptăm parola
    nr_telefon = models.CharField(max_length=20, blank=True, null=True)
    adresa = models.TextField(blank=True, null=True)
    oras = models.CharField(max_length=100, blank=True, null=True)
    data_nasterii = models.DateField(blank=True, null=True)
    data_inregistrare = models.DateTimeField(auto_now_add=True)
    poza = models.URLField(blank=True, null=True)

    def save(self, *args, **kwargs):
        # Criptăm parola doar dacă este nouă
        if not self.pk or not check_password(self.parola, self.parola):
            self.parola = make_password(self.parola)
        super().save(*args, **kwargs)

    def verifica_parola(self, parola):
        return check_password(parola, self.parola)

    def __str__(self):
        return f"{self.nume} {self.prenume} - Bibliotecar"

    class Meta:
        db_table = 'bibliotecari'
        ordering = ['nume', 'prenume']
        verbose_name = "Bibliotecar"
        verbose_name_plural = "Bibliotecari"

### Model pentru Elev
class Elev(models.Model):
    nr_matricol = models.CharField(max_length=10, unique=True, primary_key=True)
    nume = models.CharField(max_length=255)
    prenume = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    parola = models.CharField(max_length=255)  # Criptăm parola
    clasa = models.CharField(max_length=10)
    nr_telefon = models.CharField(max_length=20, blank=True, null=True)
    adresa = models.TextField(blank=True, null=True)
    oras = models.CharField(max_length=100, blank=True, null=True)
    data_nasterii = models.DateField(blank=True, null=True)
    data_inregistrare = models.DateTimeField(auto_now_add=True)
    poza = models.URLField(blank=True, null=True)

    def save(self, *args, **kwargs):
        # Criptăm parola doar dacă este nouă
        if not self.pk or not check_password(self.parola, self.parola):
            self.parola = make_password(self.parola)
        super().save(*args, **kwargs)

    def verifica_parola(self, parola):
        return check_password(parola, self.parola)

    def __str__(self):
        return f"{self.nume} {self.prenume} - {self.clasa} ({self.nr_matricol})"

    class Meta:
        db_table = 'elevi'
        ordering = ['nume', 'prenume']
        verbose_name = "Elev"
        verbose_name_plural = "Elevi"

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
            MinValueValidator(1400),
            MaxValueValidator(datetime.date.today().year)
        ]
    )

    isbn = models.CharField(unique=True, max_length=13, blank=True, null=True)
    exemplare_disponibile = models.PositiveIntegerField(default=1)
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
    cod_unic = models.CharField(max_length=20, unique=True, help_text="Cod unic al exemplarului, de ex. C12345")
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
    elev = models.ForeignKey(Elev, on_delete=models.CASCADE, related_name="imprumuturi")
    exemplar = models.ForeignKey(Exemplar, on_delete=models.CASCADE, related_name="imprumuturi")
    data_imprumut = models.DateField(auto_now_add=True)
    data_scadenta = models.DateField(blank=True, null=True)
    data_restituire = models.DateField(blank=True, null=True)
    returnat = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.elev.nume} {self.elev.prenume} a împrumutat {self.exemplar.carte.titlu} (Exemplar: {self.exemplar.cod_unic})"

    class Meta:
        db_table = 'imprumuturi'
        ordering = ['-data_imprumut']
        verbose_name = "Împrumut"
        verbose_name_plural = "Împrumuturi"

### Model pentru Recenzie
class Recenzie(models.Model):
    elev = models.ForeignKey(Elev, on_delete=models.CASCADE, related_name="recenzii")
    carte = models.ForeignKey(Carte, on_delete=models.CASCADE, related_name="recenzii")
    rating = models.IntegerField(choices=[(i, i) for i in range(5, 11)])
    comentariu = models.TextField(blank=True, null=True)
    data_postare = models.DateTimeField(auto_now_add=True)
    aprobat = models.BooleanField(default=False)

    def __str__(self):
        return f"Recenzie {self.elev.nume} {self.elev.prenume} - {self.carte.titlu}"

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

