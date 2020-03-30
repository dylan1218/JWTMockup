from django.urls import path
from rest_framework_simplejwt import views as jwt_views
from myapi.core import views
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('hello/', views.HelloView.as_view(), name='hello'),
    path('login/', views.index, name='index'),
    path('api/token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) 
