from django.urls import path
from biblioteca_scolara.views import (
    login_view, logout_view, ElevListView, BibliotecarListView, CarteListView, ImprumutListView 
)

urlpatterns = [
    path("login/", login_view, name="login"),
    path("logout/", logout_view, name="logout"),
    path("elevi/", ElevListView.as_view(), name="elevi-list"),
    path("bibliotecari/", BibliotecarListView.as_view(), name="bibliotecari-list"),
    path("carti/", CarteListView.as_view(), name="carti-list"),
    path("imprumuturi/", ImprumutListView.as_view(), name="imprumuturi-list"),

]

    
