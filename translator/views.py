from django.shortcuts import render

def home(request):
    return render(request, 'home.html')

from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import speech_recognition as sr
import requests
import logging
from .models import Translation

# Set up logging
logging.basicConfig(level=logging.DEBUG)

@csrf_exempt
def translate_audio(request):
    if request.method == 'POST':
        try:
            # Handle file and recognize speech
            audio_file = request.FILES['audio_data']
            recognizer = sr.Recognizer()
            with sr.AudioFile(audio_file) as source:
                audio_data = recognizer.record(source)
                logging.debug("Audio data recorded")

            text = recognizer.recognize_google(audio_data, language='en-US')
            logging.debug(f"Recognized text: {text}")

            # Using MyMemory API for translation
            translate_url = "https://api.mymemory.translated.net/get"
            params = {
                'q': text,
                'langpair': 'en|ro'
            }
            response = requests.get(translate_url, params=params)
            result = response.json()
            translated_text = result['responseData']['translatedText']
            logging.debug(f"Translated text: {translated_text}")

            # Save the translation to the database
            translation = Translation(original_text=text, translated_text=translated_text)
            translation.save()

            # Respond with the translation
            response = {'text': translated_text}
            return JsonResponse(response)
        except Exception as e:
            logging.error(f"Error: {e}", exc_info=True)
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Invalid request'}, status=400)

def translation_history(request):
    translations = Translation.objects.all().order_by('-timestamp')
    history = [{"original_text": t.original_text, "translated_text": t.translated_text, "timestamp": t.timestamp} for t in translations]
    return JsonResponse(history, safe=False)
