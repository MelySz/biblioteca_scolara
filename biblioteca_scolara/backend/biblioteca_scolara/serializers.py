from rest_framework import serializers
from biblioteca_scolara.models import Utilizator,  TokenResetareParola, Carte, Exemplar, Imprumut, Recenzie, Log
import re

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

class CerereResetareParolaSerializer(serializers.Serializer):
    """Serializer pentru cererea de resetare a parolei"""
    email = serializers.EmailField()

    def validate_email(self, value):
        if not Utilizator.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email invalid sau utilizator inexistent.")
        return value

class SetareNouaParolaSerializer(serializers.Serializer):
    """Serializer pentru setarea unei noi parole"""
    parola_noua = serializers.CharField(write_only=True)
    confirmare_parola = serializers.CharField(write_only=True)

    def validate(self, data):
        parola_noua = data.get("parola_noua")
        confirmare_parola = data.get("confirmare_parola")

        # Verificăm dacă parolele coincid
        if parola_noua != confirmare_parola:
            raise serializers.ValidationError({"confirmare_parola": "Parolele nu coincid."})

        # Regulile de securitate pentru parolă
        if len(parola_noua) < 8 or not re.search(r"[A-Z]", parola_noua) or not re.search(r"[0-9]", parola_noua) or not re.search(r"[!@#$%^&*(),.?\":{}|<>]", parola_noua):
            raise serializers.ValidationError(
                {"parola_noua": "Parola trebuie să aibă minim 8 caractere, o literă mare, o cifră și un caracter special."}
            )

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