# live_translation/translator/urls.py

from django.urls import path
from .views import translate_audio, translation_history, home

urlpatterns = [
    path('', home, name='home'),
    path('translate_audio/', translate_audio, name='translate_audio'),
    path('translation_history/', translation_history, name='translation_history'),
]
