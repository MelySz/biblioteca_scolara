from django.contrib.auth.hashers import make_password, check_password
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import generics
from biblioteca_scolara.models import Elev, Bibliotecar, Carte, Imprumut
from biblioteca_scolara.serializers import ElevSerializer, BibliotecarSerializer, CarteSerializer, ImprumutSerializer
import json
import datetime
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model

@csrf_exempt
def login_view(request):
    if request.method == "POST":
        data = json.loads(request.body)
        nume = data.get("nume")
        prenume = data.get("prenume")
        password = data.get("password")

        # Verificăm autentificarea pentru Elev
        try:
            elev = Elev.objects.get(nume=nume, prenume=prenume)
            if elev.verifica_parola(password):
                refresh = RefreshToken.for_user(elev)
                return JsonResponse({
                    "message": "Autentificare reușită",
                    "status": "success",
                    "tip": "elev",
                    "nume": elev.nume,
                    "prenume": elev.prenume,
                    "nr_matricol": elev.nr_matricol,
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                }, status=200)
        except Elev.DoesNotExist:
            pass

        # Verificăm autentificarea pentru Bibliotecar
        try:
            bibliotecar = Bibliotecar.objects.get(nume=nume, prenume=prenume)
            if bibliotecar.verifica_parola(password):
                refresh = RefreshToken.for_user(bibliotecar)
                return JsonResponse({
                    "message": "Autentificare reușită",
                    "status": "success",
                    "tip": "bibliotecar",
                    "nume": bibliotecar.nume,
                    "prenume": bibliotecar.prenume,
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                }, status=200)
        except Bibliotecar.DoesNotExist:
            pass

        return JsonResponse({"message": "Autentificare eșuată", "status": "error"}, status=401)

    return JsonResponse({"message": "Metodă neacceptată"}, status=405)


@csrf_exempt
def reset_password_view(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get("email")
            new_password = data.get("new_password")

            user = Elev.objects.filter(email=email).first() or Bibliotecar.objects.filter(email=email).first()
            if user:
                user.parola = make_password(new_password)  # Stocare parola criptată
                user.save()
                return JsonResponse({"message": "Parola a fost resetată cu succes."}, status=200)

            return JsonResponse({"message": "Email invalid"}, status=404)

        except json.JSONDecodeError:
            return JsonResponse({"message": "Format JSON invalid"}, status=400)

    return JsonResponse({"message": "Metodă neacceptată"}, status=405)

# Logout View
@csrf_exempt
def logout_view(request):
    if request.method == "POST":
        return JsonResponse({"message": "Utilizator deconectat"}, status=200)
    return JsonResponse({"message": "Metodă neacceptată"}, status=405)

# Listare Elevi
class ElevListView(generics.ListCreateAPIView):
    queryset = Elev.objects.all()
    serializer_class = ElevSerializer

# Listare Bibliotecari
class BibliotecarListView(generics.ListCreateAPIView):
    queryset = Bibliotecar.objects.all()
    serializer_class = BibliotecarSerializer

# Listare Cărți
class CarteListView(generics.ListCreateAPIView):
    queryset = Carte.objects.all()
    serializer_class = CarteSerializer

# Listare Împrumuturi pe baza nr. matricol
class ImprumutListView(generics.ListAPIView):
    serializer_class = ImprumutSerializer

    def get_queryset(self):
        nr_matricol = self.request.GET.get("nr_matricol")
        if nr_matricol:
            return Imprumut.objects.filter(elev__nr_matricol=nr_matricol)
        return Imprumut.objects.none()

@csrf_exempt
def return_book_view(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            imprumut_id = data.get("imprumut_id")

            imprumut = Imprumut.objects.filter(id=imprumut_id).first()
            if imprumut:
                imprumut.returnat = True
                imprumut.data_restituire = datetime.date.today()
                imprumut.save()
                return JsonResponse({"message": "Cartea a fost returnată!"}, status=200)

            return JsonResponse({"message": "Împrumut invalid"}, status=404)

        except json.JSONDecodeError:
            return JsonResponse({"message": "Format JSON invalid"}, status=400)

    return JsonResponse({"message": "Metodă neacceptată"}, status=405)
