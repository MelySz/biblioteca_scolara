from django.apps import AppConfig
import importlib

class BibliotecaScolaraConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'biblioteca_scolara'

    def ready(self):
        """Importăm semnalele la pornirea aplicației."""
        importlib.import_module("biblioteca_scolara.signals")
