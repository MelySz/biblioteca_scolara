from django import forms
from django.contrib import admin
from .models import Utilizator, Carte, Exemplar, Imprumut, Recenzie, Log

# Formular personalizat pentru a seta formatul de dată (DD.MM.YYYY)
class DateInput(forms.DateInput):
    input_type = "text"
    format = "%d.%m.%Y"
    attrs = {"placeholder": "DD.MM.YYYY"}

# Formular pentru Utilizatori cu format de dată personalizat
class UtilizatorForm(forms.ModelForm):
    id = forms.CharField(required=True)  # ID-ul trebuie completat manual
    data_nasterii = forms.DateField(
        input_formats=["%d.%m.%Y"],
        widget=DateInput
    )

    class Meta:
        model = Utilizator
        fields = '__all__'

# Admin pentru Utilizatori
class UtilizatorAdmin(admin.ModelAdmin):
    form = UtilizatorForm
    list_display = ('email', 'nume', 'prenume', 'tip', 'oras', 'data_nasterii_formatata', 'poza')
    search_fields = ('email', 'nume', 'prenume')
    list_filter = ('tip', 'oras', 'is_active')
    ordering = ('nume',)
    readonly_fields = ("is_superuser", "is_staff", "is_active", "last_login")

    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        if 'user_permissions' in form.base_fields:
            del form.base_fields['user_permissions']
        if 'groups' in form.base_fields:
            del form.base_fields['groups']
        return form

    def data_nasterii_formatata(self, obj):
        return obj.data_nasterii.strftime("%d.%m.%Y") if obj.data_nasterii else "-"
    data_nasterii_formatata.admin_order_field = 'data_nasterii'
    data_nasterii_formatata.short_description = "Data nașterii"

    def get_queryset(self, request):
        """Ascunde superuserii din lista utilizatorilor normali"""
        qs = super().get_queryset(request)
        if not request.user.is_superuser:
            return qs.filter(is_superuser=False)
        return qs

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
    list_display = ('utilizator', 'exemplar', 'format_data_imprumut', 'format_data_restituire', 'returnat')
    list_filter = ('returnat', 'data_imprumut', 'data_scadenta')
    search_fields = ('utilizator__email', 'exemplar__cod_unic', 'exemplar__carte__titlu')

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
    list_display = ('utilizator', 'carte', 'rating', 'data_postare', 'aprobat')
    list_filter = ('aprobat', 'rating', 'data_postare')
    search_fields = ('utilizator__nume', 'utilizator__prenume', 'carte__titlu')

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
    list_display = ["get_utilizator_email", "actiune", "data_actiune"]
    
    def get_utilizator_email(self, obj):
        """Returnează email-ul utilizatorului sau 'Anonim' dacă nu există."""
        return obj.utilizator.email if obj.utilizator else "Anonim"

    get_utilizator_email.short_description = "Utilizator"

    list_filter = ('data_actiune',)
    search_fields = ("utilizator__email", "actiune") 

# Înregistrăm modelele în Django Admin
admin.site.register(Utilizator, UtilizatorAdmin)
admin.site.register(Carte, CarteAdmin)
admin.site.register(Exemplar, ExemplarAdmin)
admin.site.register(Imprumut, ImprumutAdmin)
admin.site.register(Recenzie, RecenzieAdmin)
admin.site.register(Log, LogAdmin)
