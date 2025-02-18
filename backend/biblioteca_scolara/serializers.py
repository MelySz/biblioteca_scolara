from rest_framework import serializers
from biblioteca_scolara.models import Elev, Bibliotecar, Carte

class ElevSerializer(serializers.ModelSerializer):
    data_nasterii = serializers.DateField(format="%d.%m.%Y", input_formats=["%d.%m.%Y"])

    class Meta:
        model = Elev
        fields = '__all__'

class BibliotecarSerializer(serializers.ModelSerializer):
    data_nasterii = serializers.DateField(format="%d.%m.%Y", input_formats=["%d.%m.%Y"])

    class Meta:
        model = Bibliotecar
        fields = '__all__'

class CarteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Carte
        fields = '__all__'
