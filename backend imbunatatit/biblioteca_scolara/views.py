
from rest_framework import generics, serializers
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from biblioteca_scolara.models import Utilizator, Carte, Exemplar, Imprumut, Recenzie
from biblioteca_scolara.serializers import ( UtilizatorSerializer, CarteSerializer, ImprumutSerializer, RecenzieSerializer )
from django.http import JsonResponse
from django.contrib.auth.hashers import check_password, make_password
from django.shortcuts import get_object_or_404
import json
import datetime

# Login utilizator
@api_view(["POST"])
@permission_classes([AllowAny])
def login_utilizator(request):
    data = request.data
    email = data.get("email")
    password = data.get("password")

    utilizator = get_object_or_404(Utilizator, email=email)

    if utilizator.check_password(password):
        refresh = RefreshToken.for_user(utilizator)
        refresh["user_id"] = utilizator.id
        refresh["tip"] = utilizator.tip  

        return JsonResponse({
            "message": "Autentificare reușită",
            "status": "success",
            "tip": utilizator.tip,
            "email": utilizator.email,
            "nume": utilizator.nume,
            "prenume": utilizator.prenume,
            "poza": utilizator.get_poza(),
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }, status=200)

    return JsonResponse({"message": "Parolă incorectă"}, status=401)


# Schimbare parolă
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def schimbare_parola(request):
    data = request.data
    email = request.user.email
    old_password = data.get("old_password")
    new_password = data.get("new_password")

    utilizator = request.user  # Se folosește utilizatorul autentificat

    if not check_password(old_password, utilizator.password):
        return JsonResponse({"message": "Parolă incorectă"}, status=401)

    utilizator.password = make_password(new_password)
    utilizator.save()
    return JsonResponse({"message": "Parola a fost schimbată cu succes."}, status=200)


# Resetare parolă
@api_view(["POST"])
@permission_classes([AllowAny])
def resetare_parola(request):
    try:
        data = request.data
        email = data.get("email")
        parola_noua = data.get("parola_noua")

        utilizator = get_object_or_404(Utilizator, email=email)

        utilizator.set_password(parola_noua) 
        utilizator.save()
        return JsonResponse({"message": "Parola a fost resetată cu succes."}, status=200)

    except json.JSONDecodeError:
        return JsonResponse({"message": "Format JSON invalid"}, status=400)
    
# Logout
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout_view(request):
    try:
        data = request.data
        refresh_token = data.get("refresh")

        if not refresh_token:
            return JsonResponse({"message": "Token lipsă"}, status=400)

        token = RefreshToken(refresh_token)
        token.blacklist()
        return JsonResponse({"message": "Utilizator deconectat"}, status=200)

    except Exception as e:
        return JsonResponse({"message": f"Eroare la deconectare: {str(e)}"}, status=400)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def imprumutare_carte(request):
    try:
        data = request.data
        email = data.get("email")
        cod_exemplar = data.get("cod_exemplar")
        
        utilizator = get_object_or_404(Utilizator, email=email)

        # Verificăm dacă exemplarul există și este disponibil
        exemplar = get_object_or_404(Exemplar, cod_unic=cod_exemplar)
        if exemplar.stare != "disponibil":
            return JsonResponse({"message": "Exemplarul nu este disponibil pentru împrumut."}, status=400)

        # Creăm împrumutul
        imprumut = Imprumut.objects.create(
            utilizator=utilizator,
            exemplar=exemplar,
            data_scadenta=datetime.date.today() + datetime.timedelta(days=14)
        )

        # Actualizăm starea exemplarului
        exemplar.stare = "imprumutat"
        exemplar.save()

        return JsonResponse({"message": "Cartea a fost împrumutată cu succes!", "id_imprumut": imprumut.id}, status=201)

    except json.JSONDecodeError:
        return JsonResponse({"message": "Format JSON invalid"}, status=400)
    except Exception as e:
        return JsonResponse({"message": f"Eroare internă: {str(e)}"}, status=500)

# Returnare carte
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def returnare_carte(request):
    try:
        data = request.data
        imprumut_id = data.get("imprumut_id")

        imprumut = get_object_or_404(Imprumut, id=imprumut_id)
        exemplar = imprumut.exemplar  # Obține exemplarul împrumutat

        if imprumut.returnat:
            return JsonResponse({"message": "Această carte a fost deja returnată."}, status=400)

        # Marcare împrumut ca returnat
        imprumut.returnat = True
        imprumut.data_restituire = datetime.date.today()
        imprumut.save()

        # Actualizare stoc carte
        exemplar.stare = "disponibil"
        exemplar.save()

        return JsonResponse({"message": "Cartea a fost returnată cu succes!"}, status=200)

    except json.JSONDecodeError:
        return JsonResponse({"message": "Format JSON invalid"}, status=400)
    except Exception as e:
        return JsonResponse({"message": f"Eroare internă: {str(e)}"}, status=500)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def lista_imprumuturi(request):
    utilizator = request.user  # Utilizatorul autentificat

    if utilizator.tip == "bibliotecar":
        imprumuturi = Imprumut.objects.all()
    else:
        imprumuturi = Imprumut.objects.filter(utilizator=utilizator)

    data = [
        {
            "id": imprumut.id,
            "carte": imprumut.exemplar.carte.titlu,
            "exemplar_cod": imprumut.exemplar.cod_unic,
            "data_imprumut": imprumut.data_imprumut.strftime("%d.%m.%Y"),
            "data_scadenta": imprumut.data_scadenta.strftime("%d.%m.%Y"),
            "data_restituire": imprumut.data_restituire.strftime("%d.%m.%Y") if imprumut.data_restituire else None,
            "returnat": imprumut.returnat,
        }
        for imprumut in imprumuturi
    ]

    return JsonResponse({"imprumuturi": data}, status=200)

# Vizualizări generice pentru API
class UtilizatorListView(generics.ListCreateAPIView):
    """ API pentru listarea și crearea utilizatorilor """
    queryset = Utilizator.objects.all()
    serializer_class = UtilizatorSerializer

    def get_serializer_context(self):
        """Adaugă request-ul în context pentru a folosi în serializer"""
        return {'request': self.request}

class CarteListView(generics.ListCreateAPIView):
    """ API pentru listarea și adăugarea cărților """
    queryset = Carte.objects.all()
    serializer_class = CarteSerializer


class ImprumutListView(generics.ListAPIView):
    """ API pentru vizualizarea imprumuturilor """
    serializer_class = ImprumutSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        utilizator = self.request.user

        if utilizator.tip == "bibliotecar":
            return Imprumut.objects.all()  # Bibliotecarii văd toate împrumuturile
        return Imprumut.objects.filter(utilizator=utilizator)  # Elevii văd doar propriile împrumuturi

class RecenzieListView(generics.ListCreateAPIView):
    """Elevii pot adăuga recenzii dar se pot vedea doar recenziile aprobate de bibliotecar"""
    queryset = Recenzie.objects.filter(aprobat=True)  # Doar recenziile aprobate apar
    serializer_class = RecenzieSerializer
    permission_classes = [IsAuthenticated]  # Doar utilizatorii autentificați pot accesa

    def perform_create(self, serializer):
        """Elevii își pot adăuga doar propriile recenzii"""
        user = self.request.user
        if user.tip != "elev":
            raise serializers.ValidationError("Doar elevii pot scrie recenzii.")
        serializer.save(utilizator=user, aprobat=False)  # Recenzia va fi în așteptare

class AprobareRecenzieView(generics.UpdateAPIView):
    """Bibliotecarii pot aproba recenzii"""
    permission_classes = [IsAuthenticated]
    queryset = Recenzie.objects.all()
    serializer_class = RecenzieSerializer

    def update(self, request, *args, **kwargs):
        user = request.user
        recenzie = get_object_or_404(Recenzie, pk=kwargs["pk"])
        
        if user.tip != "bibliotecar":
            return JsonResponse({"message": "Doar bibliotecarii pot aproba recenzii."}, status=403)

        recenzie.aprobat = True
        recenzie.save()
        return JsonResponse({"message": "Recenzia a fost aprobată!"}, status=200)

