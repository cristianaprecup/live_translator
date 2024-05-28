from django.urls import path
from .views import home, translate_audio

urlpatterns = [
    path('', home, name='home'),
    path('translate_audio/', translate_audio, name='translate_audio'),
]
