import json
import re
from datetime import timedelta, date
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.db.models import Q
from django.utils.timezone import now
from django.core.mail import send_mail
from django.conf import settings
from rest_framework import generics, serializers, status
from rest_framework.views import APIView
from rest_framework.generics import DestroyAPIView
from rest_framework.generics import CreateAPIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import PermissionDenied
from rest_framework_simplejwt.tokens import RefreshToken
from biblioteca_scolara.models import Utilizator, TokenResetareParola, Carte, Exemplar, Imprumut, Recenzie, Log
from biblioteca_scolara.serializers import (
    UtilizatorSerializer, CerereResetareParolaSerializer, SetareNouaParolaSerializer, 
    CarteSerializer, ImprumutSerializer, ExemplarSerializer, RecenzieSerializer, LogSerializer
)

# Lista utilizatori
class UtilizatorListView(generics.ListCreateAPIView):
    """ API pentru listarea și crearea utilizatorilor """
    queryset = Utilizator.objects.all()
    serializer_class = UtilizatorSerializer
    permission_classes = [IsAuthenticated]  # Doar utilizatorii autentificați pot accesa

    def get_queryset(self):
        """Elevii nu vor putea vedea lista utilizatorilor"""
        if self.request.user.tip == "elev":
            raise PermissionDenied("Nu ai permisiunea de a accesa această resursă.")
        return super().get_queryset()

    def perform_create(self, serializer):
        """Doar bibliotecarii și adminii pot crea utilizatori"""
        if self.request.user.tip not in ["bibliotecar", "admin"]:
            raise PermissionDenied("Nu ai permisiunea de a adăuga utilizatori.")
        utilizator_nou = serializer.save()  # Salvăm utilizatorul creat într-o variabilă

        # Salvăm log automat
        Log.objects.create(utilizator=self.request.user, actiune=f"A adăugat utilizatorul {utilizator_nou.email}")

    def get_serializer_context(self):
        """Adaugă request-ul în context pentru a folosi în serializer"""
        return {'request': self.request}
    
# Login utilizator
class LoginUtilizatorView(APIView):
    """ Endpoint pentru autentificarea utilizatorilor """
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        utilizator = get_object_or_404(Utilizator, email=email)

        if utilizator.check_password(password):
            refresh = RefreshToken.for_user(utilizator)
            refresh["user_id"] = utilizator.id
            refresh["tip"] = utilizator.tip  

            return Response({
                "message": "Autentificare reușită",
                "status": "success",
                "tip": utilizator.tip,
                "email": utilizator.email,
                "nume": utilizator.nume,
                "prenume": utilizator.prenume,
                "poza": utilizator.get_poza(),
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            }, status=status.HTTP_200_OK)

        return Response({"message": "Parolă incorectă"}, status=status.HTTP_401_UNAUTHORIZED)

# Logout utilizator
class LogoutUtilizatorView(APIView):
    """ Endpoint pentru deconectarea utilizatorilor """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")

            if not refresh_token:
                return Response({"message": "Token lipsă"}, status=status.HTTP_400_BAD_REQUEST)

            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Utilizator deconectat"}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"message": f"Eroare la deconectare: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

# Ștergere utilizator
class StergereUtilizatorView(DestroyAPIView):
    """ Endpoint pentru ștergerea utilizatorilor """
    queryset = Utilizator.objects.all()
    permission_classes = [IsAuthenticated]
    lookup_field = "pk"  # Căutăm utilizatorul după pk

    def delete(self, request, *args, **kwargs):
        utilizator = self.get_object()

        if request.user.tip not in ["bibliotecar", "admin"]:
            return Response({"message": "Nu ai permisiunea de a șterge utilizatori."}, status=status.HTTP_403_FORBIDDEN)

        email = utilizator.email
        response = super().delete(request, *args, **kwargs)

        # Salvăm log automat
        Log.objects.create(utilizator=request.user, actiune=f"A șters utilizatorul {email}")

        return Response({"message": "Utilizator șters cu succes."}, status=status.HTTP_200_OK)

# Schimbare parolă
class SchimbareParolaView(APIView):
    """ Endpoint pentru schimbarea parolei """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        utilizator = request.user
        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")

        if not utilizator.check_password(old_password):
            return Response({"message": "Parolă incorectă"}, status=status.HTTP_401_UNAUTHORIZED)

        # Verificăm dacă noua parolă respectă regulile de securitate
        if len(new_password) < 8 or not re.search(r"[A-Z]", new_password) or not re.search(r"[0-9]", new_password) or not re.search(r"[!@#$%^&*(),.?\":{}|<>]", new_password):
            return Response(
                {"message": "Parola trebuie să aibă minim 8 caractere, o literă mare, o cifră și un caracter special."},
                status=status.HTTP_400_BAD_REQUEST
            )

        utilizator.set_password(new_password)
        utilizator.save()

        # Salvăm log automat
        Log.objects.create(utilizator=utilizator, actiune="A schimbat parola")

        return Response({"message": "Parola a fost schimbată cu succes."}, status=status.HTTP_200_OK)

# Resetare parolă
class CerereResetareParolaView(APIView):
    """ Trimite un email cu un link pentru resetarea parolei """

    def post(self, request):
        serializer = CerereResetareParolaSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data["email"]
            utilizator = Utilizator.objects.get(email=email)

            # Ștergem tokenurile vechi și generăm unul nou
            TokenResetareParola.objects.filter(utilizator=utilizator).delete()
            token = TokenResetareParola.objects.create(
                utilizator=utilizator,
                data_expirare=now() + timedelta(minutes=15)
            )

            link_resetare = f"http://localhost:5173/resetare-parola/{token.token}/"

            # Trimitere email
            send_mail(
                subject="Resetare parolă - Biblioteca Școlară",
                message=f"Accesează acest link pentru a-ți reseta parola: {link_resetare}",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                fail_silently=True,
            )

            return Response({"message": "Emailul cu link-ul de resetare a fost trimis!"}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Verificare token resetare parolă
class VerificareTokenParolaView(APIView):
    """ Verifică dacă tokenul este valid """

    def get(self, request, token):
        token_obj = TokenResetareParola.objects.filter(token=token).first()

        if not token_obj or not token_obj.este_valid():
            return Response({"message": "Token invalid sau expirat."}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"message": "Token valid."}, status=status.HTTP_200_OK)

# Setare parolă nouă
class SetareNouaParolaView(APIView):
    """ Permite utilizatorului să își seteze o nouă parolă după verificarea tokenului """

    def post(self, request, token):
        token_obj = TokenResetareParola.objects.filter(token=token).first()

        if not token_obj or not token_obj.este_valid():
            return Response({"message": "Token invalid sau expirat."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = SetareNouaParolaSerializer(data=request.data)
        if serializer.is_valid():
            utilizator = token_obj.utilizator
            parola_noua = serializer.validated_data["parola_noua"]

            # Verificăm dacă parola nouă este diferită de cea veche
            if utilizator.check_password(parola_noua):
                return Response(
                    {"message": "Parola nouă nu poate fi identică cu cea veche."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Schimbare parolă și ștergere token
            utilizator.set_password(parola_noua)
            utilizator.save()
            token_obj.delete()

            # Salvăm log automat
            Log.objects.create(utilizator=utilizator, actiune="A resetat parola")

            return Response({"message": "Parola a fost schimbată cu succes."}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Listă cărți
class CarteListView(generics.ListCreateAPIView):
    """ API pentru listarea și adăugarea cărților """
    queryset = Carte.objects.all()
    serializer_class = CarteSerializer

# Adăugare carte
class AdaugareCarteView(CreateAPIView):
    """ Endpoint pentru adăugarea unei cărți """
    queryset = Carte.objects.all()
    serializer_class = CarteSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        utilizator = self.request.user

        if utilizator.tip not in ["bibliotecar", "admin"]:
            raise PermissionDenied("Nu ai permisiunea de a adăuga cărți.")

        carte = serializer.save()

        # Salvăm log automat
        Log.objects.create(utilizator=utilizator, actiune=f"A adăugat cartea {carte.titlu}")

# Căutare cărți
class CautareCartiView(ListAPIView):
    """ Endpoint pentru căutarea cărților """
    serializer_class = CarteSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        query = self.request.GET.get("q", "").strip()
        
        if not query:
            return Carte.objects.none()  # Nu returnăm nimic dacă nu există termen de căutare

        return Carte.objects.filter(Q(titlu__icontains=query) | Q(autor__icontains=query))

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        if not queryset.exists():
            return Response({"message": "Nicio carte găsită."}, status=status.HTTP_404_NOT_FOUND)

        return super().list(request, *args, **kwargs)

# Ștergere carte
class StergereCarteView(DestroyAPIView):
    """ Endpoint pentru ștergerea unei cărți """
    queryset = Carte.objects.all()
    permission_classes = [IsAuthenticated]
    lookup_field = "pk"  # Căutăm cartea după pk

    def delete(self, request, *args, **kwargs):
        carte = self.get_object()

        if request.user.tip not in ["bibliotecar", "admin"]:
            return Response({"message": "Nu ai permisiunea de a șterge cărți."}, status=status.HTTP_403_FORBIDDEN)

        titlu = carte.titlu
        super().delete(request, *args, **kwargs) 

        # Salvăm log automat
        Log.objects.create(utilizator=request.user, actiune=f"A șters cartea {titlu}")

        return Response({"message": "Carte ștearsă cu succes."}, status=status.HTTP_200_OK)

# Listă împrumuturi   
class ImprumutListView(generics.ListAPIView):
    """ API pentru vizualizarea imprumuturilor """
    serializer_class = ImprumutSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        utilizator = self.request.user

        if utilizator.tip == "bibliotecar":
            return Imprumut.objects.all()  # Bibliotecarii văd toate împrumuturile
        return Imprumut.objects.filter(utilizator=utilizator)  # Elevii văd doar propriile împrumuturi
    
# Imprumutare carte
class ImprumutareCarteView(CreateAPIView):
    """ Endpoint pentru împrumutarea unei cărți """
    serializer_class = ImprumutSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        utilizator = self.request.user
        cod_exemplar = self.request.data.get("cod_exemplar")

        # Setăm limita maximă de împrumuturi active
        MAX_IMPRUMUTURI = 3
        imprumuturi_active = Imprumut.objects.filter(utilizator=utilizator, returnat=False).count()

        if imprumuturi_active >= MAX_IMPRUMUTURI:
            raise serializers.ValidationError(f"Ai atins limita maximă de {MAX_IMPRUMUTURI} împrumuturi active.")

        # Verificăm dacă exemplarul există și este disponibil
        exemplar = get_object_or_404(Exemplar, cod_unic=cod_exemplar)
        if exemplar.stare != "disponibil":
            raise serializers.ValidationError("Exemplarul nu este disponibil pentru împrumut.")

        # Creăm împrumutul
        imprumut = serializer.save(
            utilizator=utilizator,
            exemplar=exemplar,
            data_scadenta=date.today() + timedelta(days=14)
        )

        # Actualizăm starea exemplarului
        exemplar.stare = "imprumutat"
        exemplar.save()

        # Salvăm log automat
        Log.objects.create(utilizator=utilizator, actiune=f"A împrumutat cartea {exemplar.carte.titlu}")

        return Response({"message": "Cartea a fost împrumutată cu succes!", "id_imprumut": imprumut.id}, status=status.HTTP_201_CREATED)

# Istoric împrumuturi
class IstoricImprumuturiView(APIView):
    """ Endpoint pentru vizualizarea istoricului împrumuturilor unui utilizator """
    permission_classes = [IsAuthenticated]  # Doar utilizatorii autentificați pot accesa

    def get(self, request):
        utilizator = request.user  # Obținem utilizatorul autentificat

        # Obținem toate împrumuturile utilizatorului
        imprumuturi = Imprumut.objects.filter(utilizator=utilizator).order_by("-data_imprumut")

        if not imprumuturi.exists():
            return Response({"message": "Nu ai împrumutat nicio carte."}, status=status.HTTP_404_NOT_FOUND)

        # Serializăm datele
        serializer = ImprumutSerializer(imprumuturi, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

# Returnare carte
class ReturnareCarteView(APIView):
    """ Endpoint pentru returnarea unei cărți """
    permission_classes = [IsAuthenticated]  # Doar utilizatorii autentificați pot accesa

    def post(self, request, pk):  # Folosim pk din URL
        try:
            imprumut = get_object_or_404(Imprumut, id=pk)  # Căutăm împrumutul după pk
            utilizator = imprumut.utilizator
            exemplar = imprumut.exemplar  # Obține exemplarul împrumutat

            if imprumut.returnat:
                return Response({"message": "Această carte a fost deja returnată."}, status=status.HTTP_400_BAD_REQUEST)

            # Marcare împrumut ca returnat
            imprumut.returnat = True
            imprumut.data_restituire = now()
            imprumut.save()

            # Actualizare stoc carte
            exemplar.stare = "disponibil"
            exemplar.save()

            mesaj_suspendare = "Cartea a fost returnată cu succes!"

            # Verificăm dacă utilizatorul a întârziat returnarea
            if imprumut.data_restituire > imprumut.data_scadenta:
                utilizator.is_active = False  # Suspendăm utilizatorul
                utilizator.save()

                # Salvăm log automat
                Log.objects.create(
                    utilizator=utilizator,
                    actiune="A fost suspendat pentru întârzierea returnării unei cărți"
                )

                # Trimitem email de notificare
                send_mail(
                    subject="Suspendare cont - Biblioteca Școlară",
                    message=f"Contul tău a fost suspendat timp de 3 zile pentru întârzierea returnării cărții {exemplar.carte.titlu}.",
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[utilizator.email],
                    fail_silently=True,
                )

                mesaj_suspendare = "Cartea a fost returnată, dar ai întârziat returnarea și ai fost suspendat timp de 3 zile."

            # Salvăm log automat
            Log.objects.create(utilizator=utilizator, actiune=f"A returnat cartea {exemplar.carte.titlu}")

            return Response({"message": mesaj_suspendare}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"message": f"Eroare internă: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
      
# Listă utilizatori suspendați
class ListaUtilizatoriSuspendatiView(ListAPIView):
    """ Endpoint pentru listarea utilizatorilor suspendați """
    serializer_class = UtilizatorSerializer
    permission_classes = [IsAuthenticated]  # Doar utilizatorii autentificați pot accesa

    def get_queryset(self):
        """Returnează utilizatorii care sunt suspendați (is_active=False)"""
        if self.request.user.tip not in ["bibliotecar", "admin"]:
            raise PermissionDenied("Nu ai permisiunea de a vedea lista utilizatorilor suspendați.")
        return Utilizator.objects.filter(is_active=False)
    

# Adăugare exemplar
class AdaugareExemplarView(CreateAPIView):
    """ Endpoint pentru adăugarea unui exemplar de carte """
    serializer_class = ExemplarSerializer
    permission_classes = [IsAuthenticated]  # Doar utilizatorii autentificați pot accesa

    def perform_create(self, serializer):
        """Doar bibliotecarii și adminii pot adăuga exemplare"""
        if self.request.user.tip not in ["bibliotecar", "admin"]:
            raise PermissionDenied("Nu ai permisiunea de a adăuga exemplare.")

        # Obține cartea pe baza id-ului trimis în request
        carte_id = self.request.data.get("carte_id")
        carte = get_object_or_404(Carte, id=carte_id)

        # Crează un exemplar nou pentru cartea respectivă
        exemplar_nou = serializer.save(carte=carte)

        # Salvăm log automat
        Log.objects.create(
            utilizator=self.request.user,
            actiune=f"A adăugat un exemplar pentru cartea {carte.titlu}"
        )

        return exemplar_nou

# Ștergere exemplar
class StergereExemplarView(DestroyAPIView):
    """ Endpoint pentru ștergerea unui exemplar de carte """
    queryset = Exemplar.objects.all()
    permission_classes = [IsAuthenticated]  # Doar utilizatorii autentificați pot accesa

    def delete(self, request, *args, **kwargs):
        """Doar bibliotecarii și adminii pot șterge exemplare"""
        if self.request.user.tip not in ["bibliotecar", "admin"]:
            raise PermissionDenied("Nu ai permisiunea de a șterge exemplare.")

        exemplar = get_object_or_404(Exemplar, id=kwargs["pk"])
        carte = exemplar.carte  # Obține cartea asociată

        exemplar.delete()

        # Salvăm log automat
        Log.objects.create(
            utilizator=self.request.user,
            actiune=f"A șters un exemplar al cărții {carte.titlu}"
        )

        return Response({"message": "Exemplar șters cu succes."}, status=status.HTTP_200_OK)

# Listă recenzii
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

# Aprobare recenzie
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

        # Salvăm log automat
        Log.objects.create(
            utilizator=user, 
            actiune=f"A aprobat recenzia pentru cartea {recenzie.carte.titlu}"
        )

        return JsonResponse({"message": "Recenzia a fost aprobată!"}, status=200)

# Listă log-uri
class LogListView(generics.ListAPIView):
    """Adminii și bibliotecarii pot vedea log-urile"""
    queryset = Log.objects.all().order_by("-data_actiune")
    serializer_class = LogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.tip not in ["bibliotecar", "admin"]:
            raise PermissionDenied("Nu ai permisiunea de a vedea log-urile.")
        return Log.objects.filter(data_actiune__gte=now() - timedelta(days=30)).order_by("-data_actiune")

# Ștergere log-uri
class StergereLoguriView(DestroyAPIView):
    """ Endpoint pentru ștergerea tuturor logurilor """
    queryset = Log.objects.all()
    permission_classes = [IsAuthenticated]  # Doar utilizatorii autentificați pot accesa

    def delete(self, request, *args, **kwargs):
        """Doar adminii pot șterge loguri"""
        if self.request.user.tip != "admin":
            raise PermissionDenied("Nu ai permisiunea de a șterge logurile.")

        Log.objects.all().delete()

        return Response({"message": "Toate logurile au fost șterse cu succes."}, status=status.HTTP_200_OK)
    



