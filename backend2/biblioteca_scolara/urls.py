from django.urls import path
from biblioteca_scolara.views import (
    login_utilizator, schimbare_parola, resetare_parola, logout_view, imprumutare_carte, lista_imprumuturi, returnare_carte, 
    UtilizatorListView, CarteListView, ImprumutListView, RecenzieListView, 
)

urlpatterns = [
    path("login/", login_utilizator, name="login_utilizator"),
    path("schimbare-parola/", schimbare_parola, name="schimbare_parola"),
    path("resetare-parola/", resetare_parola, name="resetare_parola"),
    path("logout/", logout_view, name="logout"),
    path("imprumutare-carte/", imprumutare_carte, name="imprumutare_carte"),
    path("lista-imprumuturi/", lista_imprumuturi, name="lista_imprumuturi"),
    path("returnare-carte/", returnare_carte, name="returnare_carte"),
    path("utilizatori/", UtilizatorListView.as_view(), name="utilizatori-list"),
    path("carti/", CarteListView.as_view(), name="carti-list"),
    path("imprumuturi/", ImprumutListView.as_view(), name="imprumuturi-list"),
    path("recenzii/", RecenzieListView.as_view(), name="recenzii-list"),
    
]

