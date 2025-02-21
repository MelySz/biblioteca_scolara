from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from biblioteca_scolara.views import (
    UtilizatorListView, LoginUtilizatorView, LogoutUtilizatorView, SchimbareParolaView, ResetareParolaView,
    StergereUtilizatorView, ListaUtilizatoriSuspendatiView,
    CarteListView, AdaugareCarteView, CautareCartiView, StergereCarteView,
    AdaugareExemplarView, StergereExemplarView,
    ImprumutListView, ImprumutareCarteView, ReturnareCarteView, IstoricImprumuturiView,
    RecenzieListView, AprobareRecenzieView,
    LogListView, StergereLoguriView
)

urlpatterns = [
    # Autentificare și gestionare conturi
    path("utilizatori/", UtilizatorListView.as_view(), name="utilizatori-list"),
    path("utilizatori/<int:pk>/", UtilizatorListView.as_view(), name="utilizator-detail"),
    path("login/", LoginUtilizatorView.as_view(), name="login_utilizator"),
    path("logout/", LogoutUtilizatorView.as_view(), name="logout"),
    path("schimbare-parola/", SchimbareParolaView.as_view(), name="schimbare-parola"),
    path("resetare-parola/", ResetareParolaView.as_view(), name="resetare-parola"),
    path("utilizatori/stergere/<int:pk>/", StergereUtilizatorView.as_view(), name="stergere-utilizator"),
    path("utilizatori/suspendati/", ListaUtilizatoriSuspendatiView.as_view(), name="lista_utilizatori_suspendati"),

    # Împrumuturi și returnări de cărți
    path("carti/", CarteListView.as_view(), name="carti-list"),
    path("carti/<int:pk>/", CarteListView.as_view(), name="carte-detail"),
    path("carte/adaugare/", AdaugareCarteView.as_view(), name="adaugare-carte"),
    path("cauta-carti/", CautareCartiView.as_view(), name="cauta-carti"),
    path("carte/stergere/<int:pk>/", StergereCarteView.as_view(), name="stergere-carte"),
    path("imprumuturi/", ImprumutListView.as_view(), name="imprumuturi-list"),
    path("imprumutare-carte/", ImprumutareCarteView.as_view(), name="imprumutare-carte"),
    path("istoric-imprumuturi/", IstoricImprumuturiView.as_view(), name="istoric-imprumuturi"),
    path("returnare-carte/<int:pk>/", ReturnareCarteView.as_view(), name="returnare_carte"),
    path("exemplar/adaugare/", AdaugareExemplarView.as_view(), name="adaugare-exemplar"),
    path("exemplar/stergere/<int:pk>/", StergereExemplarView.as_view(), name="stergere-exemplar"),
   
    # Recenzii
    path("recenzii/", RecenzieListView.as_view(), name="recenzii-list"),
    path("recenzii/<int:pk>/aprobare/", AprobareRecenzieView.as_view(), name="aprobare-recenzie"),

    # Alte funcționalități
    path("loguri/", LogListView.as_view(), name="loguri-list"),
    path("loguri/stergere/", StergereLoguriView.as_view(), name="stergere-loguri"),
]

# Servirea imaginilor pentru debug
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
