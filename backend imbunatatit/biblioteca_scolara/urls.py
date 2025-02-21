from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from biblioteca_scolara.views import (
    login_utilizator, schimbare_parola, resetare_parola, logout_view, imprumutare_carte, lista_imprumuturi, returnare_carte, 
    UtilizatorListView, CarteListView, ImprumutListView,  RecenzieListView, AprobareRecenzieView
)

urlpatterns = [
    # Autentificare și gestionare conturi
    path("login/", login_utilizator, name="login_utilizator"),
    path("schimbare-parola/", schimbare_parola, name="schimbare_parola"),
    path("resetare-parola/", resetare_parola, name="resetare_parola"),
    path("logout/", logout_view, name="logout"),

    # Împrumuturi și returnări de cărți
    path("imprumutare-carte/", imprumutare_carte, name="imprumutare_carte"),
    path("lista-imprumuturi/", lista_imprumuturi, name="lista_imprumuturi"),
    path("returnare-carte/", returnare_carte, name="returnare_carte"),

    # API pentru datele din bibliotecă
    path("utilizatori/", UtilizatorListView.as_view(), name="utilizatori-list"),
    path("utilizatori/<int:pk>/", UtilizatorListView.as_view(), name="utilizator-detail"),
    path("carti/", CarteListView.as_view(), name="carti-list"),
    path("carti/<int:pk>/", CarteListView.as_view(), name="carte-detail"),
    path("imprumuturi/", ImprumutListView.as_view(), name="imprumuturi-list"),

    # Recenzii
    path("recenzii/", RecenzieListView.as_view(), name="recenzii-list"),
    path("recenzii/<int:pk>/aprobare/", AprobareRecenzieView.as_view(), name="aprobare-recenzie"),
]
    

# Servirea imaginilor pentru debug
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
