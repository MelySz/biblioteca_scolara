from django import forms
from django.contrib import admin
from .models import Bibliotecar, Elev, Carte, Exemplar, Imprumut, Recenzie, Log

# Formular personalizat pentru a seta formatul de dată (DD.MM.YYYY)
class DateInput(forms.DateInput):
    input_type = "text"
    format = "%d.%m.%Y"
    attrs = {"placeholder": "DD.MM.YYYY"}

# Formular pentru Bibliotecari cu format de dată personalizat
class BibliotecarForm(forms.ModelForm):
    data_nasterii = forms.DateField(
        input_formats=["%d.%m.%Y"],
        widget=DateInput
    )

    class Meta:
        model = Bibliotecar
        fields = '__all__'

# Formular pentru Elevi cu format de dată personalizat
class ElevForm(forms.ModelForm):
    data_nasterii = forms.DateField(
        input_formats=["%d.%m.%Y"],
        widget=DateInput
    )

    class Meta:
        model = Elev
        fields = '__all__'

# Admin pentru Bibliotecari
class BibliotecarAdmin(admin.ModelAdmin):
    form = BibliotecarForm
    list_display = ('nume', 'prenume', 'email', 'oras', 'data_nasterii_formatata', 'data_inregistrare')
    search_fields = ('nume', 'prenume', 'email')
    list_filter = ('oras', 'data_inregistrare')

    def data_nasterii_formatata(self, obj):
        return obj.data_nasterii.strftime("%d.%m.%Y") if obj.data_nasterii else "-"
    data_nasterii_formatata.admin_order_field = 'data_nasterii'
    data_nasterii_formatata.short_description = "Data nașterii"

# Admin pentru Elevi
class ElevAdmin(admin.ModelAdmin):
    form = ElevForm
    list_display = ('nr_matricol', 'nume', 'prenume', 'clasa', 'email', 'oras', 'data_nasterii_formatata')
    search_fields = ('nr_matricol', 'nume', 'prenume', 'email')
    list_filter = ('clasa', 'oras')

    def data_nasterii_formatata(self, obj):
        return obj.data_nasterii.strftime("%d.%m.%Y") if obj.data_nasterii else "-"
    data_nasterii_formatata.admin_order_field = 'data_nasterii'
    data_nasterii_formatata.short_description = "Data nașterii"

# Admin pentru Cărți
class CarteAdmin(admin.ModelAdmin):
    list_display = ('titlu', 'autor', 'categorie', 'publicatie', 'isbn', 'exemplare_disponibile')
    search_fields = ('titlu', 'autor', 'isbn')
    list_filter = ('categorie', 'publicatie')

# Admin pentru Exemplare
class ExemplarAdmin(admin.ModelAdmin):
    list_display = ('cod_unic', 'carte', 'stare', 'locatie')
    search_fields = ('cod_unic', 'carte__titlu')
    list_filter = ('stare',)

# Admin pentru Împrumuturi
class ImprumutAdmin(admin.ModelAdmin):
    list_display = ('elev', 'exemplar', 'format_data_imprumut', 'format_data_restituire', 'returnat')
    list_filter = ('returnat', 'data_imprumut', 'data_scadenta')
    search_fields = ('elev__nume', 'elev__prenume', 'exemplar__cod_unic', 'exemplar__carte__titlu')

    def format_data_imprumut(self, obj):
        return obj.data_imprumut.strftime("%d.%m.%Y") if obj.data_imprumut else "-"
    format_data_imprumut.admin_order_field = 'data_imprumut'
    format_data_imprumut.short_description = "Data împrumut"

    def format_data_restituire(self, obj):
        return obj.data_restituire.strftime("%d.%m.%Y") if obj.data_restituire else "-"
    format_data_restituire.admin_order_field = 'data_restituire'
    format_data_restituire.short_description = "Data restituire"

# Admin pentru Recenzii
class RecenzieAdmin(admin.ModelAdmin):
    list_display = ('elev', 'carte', 'rating', 'data_postare', 'aprobat')
    list_filter = ('aprobat', 'rating', 'data_postare')
    search_fields = ('elev__nume', 'elev__prenume', 'carte__titlu')

    actions = ['aproba_recenzii', 'respingere_recenzii']

    def aproba_recenzii(self, request, queryset):
        queryset.update(aprobat=True)
        self.message_user(request, "Recenziile selectate au fost aprobate.")
    aproba_recenzii.short_description = "Aprobă recenziile selectate"

    def respingere_recenzii(self, request, queryset):
        queryset.update(aprobat=False)
        self.message_user(request, "Recenziile selectate au fost respinse.")
    respingere_recenzii.short_description = "Respinge recenziile selectate"

# Admin pentru Loguri
class LogAdmin(admin.ModelAdmin):
    list_display = ('utilizator_email', 'actiune', 'data_actiune')
    list_filter = ('data_actiune',)
    search_fields = ('utilizator_email', 'actiune')

# Înregistrăm modelele în Django Admin
admin.site.register(Bibliotecar, BibliotecarAdmin)
admin.site.register(Elev, ElevAdmin)
admin.site.register(Carte, CarteAdmin)
admin.site.register(Exemplar, ExemplarAdmin)
admin.site.register(Imprumut, ImprumutAdmin)
admin.site.register(Recenzie, RecenzieAdmin)
admin.site.register(Log, LogAdmin)
