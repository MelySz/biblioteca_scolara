from rest_framework import serializers
from biblioteca_scolara.models import Utilizator, Carte, Exemplar, Imprumut, Recenzie, Log

class UtilizatorSerializer(serializers.ModelSerializer):
    poza = serializers.SerializerMethodField()
    class Meta:
        model = Utilizator
        fields = ['id', 'email', 'tip', 'nume', 'prenume', 'data_nasterii', 'clasa', 'oras', 'password', 'poza']
        extra_kwargs = {'password': {'write_only': True}}  # Ascunde parola la afișare

    def get_poza(self, obj):  # Metoda corect definită
        """Returnează URL-ul imaginii de profil"""
        request = self.context.get('request')  # Obține request-ul
        if obj.poza:
            if request:
                return request.build_absolute_uri(obj.poza.url)
            return obj.poza.url
        return "/media/default/library.jpg"  # Imagine implicită

    def get_data_nasterii(self, obj):
        """Returnează data nașterii în format DD.MM.YYYY"""
        return obj.data_nasterii.strftime("%d.%m.%Y")

    def validate(self, data):
        if data.get("tip") == "elev" and not data.get("clasa"):
            raise serializers.ValidationError("Elevii trebuie să aibă o clasă.")
        return data
  
class CarteSerializer(serializers.ModelSerializer):
    exemplare_disponibile = serializers.SerializerMethodField()
    class Meta:
        model = Carte
        fields = ['id', 'titlu', 'autor', 'descriere', 'publicatie', 'isbn', 'categorie', 'poza', 'exemplare_disponibile']
    
    def get_exemplare_disponibile(self, obj):
        """Returnează numărul de exemplare disponibile"""
        return obj.exemplare_disponibile  # Apelează @property din model

class ExemplarSerializer(serializers.ModelSerializer):
    titlu_carte = serializers.CharField(source='carte.titlu', read_only=True)

    class Meta:
        model = Exemplar
        fields = ['id', 'titlu_carte', 'cod_unic', 'locatie', 'stare']


class ImprumutSerializer(serializers.ModelSerializer):
    carte = serializers.CharField(source='exemplar.carte.titlu', read_only=True)
    exemplar_cod = serializers.CharField(source='exemplar.cod_unic', read_only=True)
    utilizator_nume = serializers.CharField(source='utilizator.nume', read_only=True)
    data_imprumut = serializers.DateField(format="%d.%m.%Y", read_only=True)
    data_scadenta = serializers.DateField(format="%d.%m.%Y", read_only=True)
    data_restituire = serializers.SerializerMethodField()  # Returnează data restituirii doar dacă există

    class Meta:
        model = Imprumut
        fields = ['id', 'utilizator_nume', 'carte', 'exemplar_cod', 'data_imprumut', 'data_scadenta', 'data_restituire', 'returnat']

    def get_data_restituire(self, obj):
        """Returnează data restituirii în format DD.MM.YYYY sau None"""
        return obj.data_restituire.strftime("%d.%m.%Y") if obj.data_restituire else None


class RecenzieSerializer(serializers.ModelSerializer):
    utilizator_nume = serializers.CharField(source="utilizator.nume", read_only=True)
    carte_titlu = serializers.CharField(source="carte.titlu", read_only=True)

    class Meta:
        model = Recenzie
        fields = ['id', 'utilizator', 'utilizator_nume', 'carte', 'carte_titlu', 'rating', 'comentariu', 'data_postare', 'aprobat']
        read_only_fields = ['aprobat']  # Elevii nu pot aproba recenzii

class LogSerializer(serializers.ModelSerializer):
    utilizator_email = serializers.CharField(source="utilizator.email", read_only=True)

    class Meta:
        model = Log
        fields = ["utilizator_email", "actiune", "data_actiune"]
        ordering = ["-data_actiune"]  # Logurile cele mai recente primele