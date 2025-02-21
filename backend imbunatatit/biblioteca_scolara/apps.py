from django.apps import AppConfig


class BibliotecaScolaraConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'biblioteca_scolara'

    def ready(self):
        """Importăm semnalele la pornirea aplicației."""
        try:
            import biblioteca_scolara.signals  # Importăm semnalele
        except ImportError:
            pass
