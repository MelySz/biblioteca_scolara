from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from biblioteca_scolara.views import (
    UtilizatorListView, DetaliiUtilizatorView, LoginUtilizatorView, LogoutUtilizatorView, SchimbareParolaView, 
    CerereResetareParolaView, VerificareTokenParolaView, SetareNouaParolaView,
    StergereUtilizatorView, ListaUtilizatoriSuspendatiView, ListaEleviView,
    CarteListView, AdaugareCarteView, CautareCartiView, StergereCarteView,
    AdaugareExemplarView, StergereExemplarView, EditareExemplarView, ExemplareExtinseView,
    SetareDomeniiInteresView, DomeniiUtilizatorCurentView, RecomandariCartiView,
    ImprumutListView, ImprumutareCarteView, ReturnareCarteView, IstoricImprumuturiView, RapoarteImprumuturiView, RecenzieListAllView,
    RecenzieListView, AprobareRecenzieView,
    UploadImagineView, ExportUtilizatoriExcelView, ExportExemplareExcelView, ExportImprumuturiRetururiView, ExportRecenziiExcelView, LogListView, StergereLoguriView
)

urlpatterns = [
    # Autentificare și gestionare conturi
    path("utilizatori/", UtilizatorListView.as_view(), name="utilizatori-list"),
    #path("utilizatori/<int:pk>/", UtilizatorListView.as_view(), name="utilizator-detail"),
    path("login/", LoginUtilizatorView.as_view(), name="login_utilizator"),
    path("logout/", LogoutUtilizatorView.as_view(), name="logout"),
    path("schimbare-parola/", SchimbareParolaView.as_view(), name="schimbare-parola"),
    path("resetare-parola/", CerereResetareParolaView.as_view(), name="cerere-resetare-parola"),
    path("resetare-parola/verificare/<uuid:token>/", VerificareTokenParolaView.as_view(), name="verificare-token-parola"),
    path("resetare-parola/setare/<uuid:token>/", SetareNouaParolaView.as_view(), name="setare-noua-parola"),
    path("utilizatori/<str:pk>/", DetaliiUtilizatorView.as_view(), name="editare-utilizator"),
    path("utilizatori/stergere/<str:pk>/", StergereUtilizatorView.as_view(), name="stergere-utilizator"),
    path("utilizatori/suspendati/", ListaUtilizatoriSuspendatiView.as_view(), name="lista_utilizatori_suspendati"),
    path("elevi/", ListaEleviView.as_view(), name="lista-elevi"),

    # Împrumuturi și returnări de cărți
    path("carti/", CarteListView.as_view(), name="carti-list"),
    path("carti/<int:pk>/", CarteListView.as_view(), name="carte-detail"),
    path("carte/adaugare/", AdaugareCarteView.as_view(), name="adaugare-carte"),
    path("carti/cautare/", CautareCartiView.as_view(), name="carti-cautare"),
    path("carte/stergere/<int:pk>/", StergereCarteView.as_view(), name="stergere-carte"),
    path("imprumuturi/", ImprumutListView.as_view(), name="imprumuturi-list"),
    path("imprumutare-carte/", ImprumutareCarteView.as_view(), name="imprumutare-carte"),
    path("istoric-imprumuturi/", IstoricImprumuturiView.as_view(), name="istoric-imprumuturi"),
    path("returnare-carte/<int:pk>/", ReturnareCarteView.as_view(), name="returnare_carte"),
    path("exemplar/adaugare/", AdaugareExemplarView.as_view(), name="adaugare-exemplar"),
    path("exemplar/stergere/<int:pk>/", StergereExemplarView.as_view(), name="stergere-exemplar"),
    path("exemplare/<int:pk>/", EditareExemplarView.as_view(), name="editare-exemplar"),
    path("exemplare-extinse/", ExemplareExtinseView.as_view(), name="exemplare-extinse"),
    path("rapoarte-imprumuturi/", RapoarteImprumuturiView.as_view(), name="rapoarte-imprumuturi"),
    path("setare-domenii/", SetareDomeniiInteresView.as_view(), name="setare-domenii"),
    path("domenii-curente/", DomeniiUtilizatorCurentView.as_view(), name="domenii-curente"),
    path("recomandari-carti/", RecomandariCartiView.as_view(), name="recomandari-carti"),
    

    # Recenzii
    path("recenzii/all/", RecenzieListAllView.as_view(), name="recenzii-all"),
    path("recenzii/", RecenzieListView.as_view(), name="recenzii-list"),
    path("recenzii/<int:pk>/aprobare/", AprobareRecenzieView.as_view(), name="aprobare-recenzie"),

    # Alte funcționalități
    path("export/utilizatori/", ExportUtilizatoriExcelView.as_view(), name="export-utilizatori"),
    path("export/exemplare/", ExportExemplareExcelView.as_view(), name="export-exemplare"),
    path("export/imprumuturi/", ExportImprumuturiRetururiView.as_view(), name="export-imprumuturi"),
    path("export/recenzii/", ExportRecenziiExcelView.as_view(), name="export-recenzii"),
    path("loguri/", LogListView.as_view(), name="loguri-list"),
    path("loguri/stergere/", StergereLoguriView.as_view(), name="stergere-loguri"),
    path("upload-imagine/", UploadImagineView.as_view(), name="upload-imagine"),
]

# Servirea imaginilor pentru debug
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)



    

