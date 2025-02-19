from django.apps import AppConfig


class BibliotecaScolaraConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'biblioteca_scolara'

    def ready(self):
        import biblioteca_scolara.signals  # Importăm semnalele
