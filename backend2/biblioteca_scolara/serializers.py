from rest_framework import serializers
from biblioteca_scolara.models import Utilizator, Carte, Exemplar, Imprumut

class UtilizatorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Utilizator
        fields = ['id', 'email', 'tip', 'nume', 'prenume', 'data_nasterii', 'poza']


class CarteSerializer(serializers.ModelSerializer):
    exemplare_disponibile = serializers.IntegerField(source='exemplare.count', read_only=True)

    class Meta:
        model = Carte
        fields = ['id', 'titlu', 'autor', 'descriere', 'publicatie', 'isbn', 'categorie', 'poza', 'exemplare_disponibile']


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
    data_restituire = serializers.DateField(format="%d.%m.%Y", allow_null=True, read_only=True)

    class Meta:
        model = Imprumut
        fields = ['id', 'utilizator_nume', 'carte', 'exemplar_cod', 'data_imprumut', 'data_scadenta', 'data_restituire', 'returnat']