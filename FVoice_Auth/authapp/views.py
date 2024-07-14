from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from django.conf import settings
import os
import subprocess
import base64
import logging

logger = logging.getLogger(__name__)

class RecordVoiceView(APIView):
    def post(self, request):
        record_seconds = int(request.data.get('record_seconds', 5))
        script_path = os.path.join(settings.BASE_DIR, 'backend', 'record_voice.py')
        result = subprocess.run(['python', script_path, str(record_seconds)], capture_output=True, text=True)
        
        if result.returncode != 0:
            logger.error(f"Error recording voice: {result.stderr}")
            return Response({'message': 'Failed to record voice'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response({'message': 'Voice recorded successfully!'})

class ExtractVoiceprintView(APIView):
    def post(self, request):
        voice_sample = request.data['voice_sample']
        voice_sample_binary = base64.b64decode(voice_sample)
        file_path = default_storage.save('output.wav', ContentFile(voice_sample_binary))
        full_path = os.path.join(settings.MEDIA_ROOT, file_path)
        
        script_path = os.path.join(settings.BASE_DIR, 'backend', 'extract_voiceprint.py')
        result = subprocess.run(['python', script_path, full_path], capture_output=True, text=True)
        
        if result.returncode != 0:
            logger.error(f"Error extracting voiceprint: {result.stderr}")
            return Response({'message': 'Failed to extract voiceprint'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response({'message': 'Voiceprint extracted successfully!'})

class CompareVoiceprintView(APIView):
    def post(self, request):
        voice_sample = request.data['voice_sample']
        voice_sample_binary = base64.b64decode(voice_sample)
        file_path = default_storage.save('new_output.wav', ContentFile(voice_sample_binary))
        full_path = os.path.join(settings.MEDIA_ROOT, file_path)
        
        script_path = os.path.join(settings.BASE_DIR, 'backend', 'extract_voiceprint.py')
        result = subprocess.run(['python', script_path, full_path], capture_output=True, text=True)
        
        if result.returncode != 0:
            logger.error(f"Error extracting voiceprint: {result.stderr}")
            return Response({'message': 'Failed to extract voiceprint'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        os.rename('voiceprint.npy', 'new_voiceprint.npy')
        
        script_path = os.path.join(settings.BASE_DIR, 'backend', 'compare_voiceprint.py')
        result = subprocess.run(['python', script_path], capture_output=True, text=True)
        
        if result.returncode != 0:
            logger.error(f"Error comparing voiceprint: {result.stderr}")
            return Response({'message': 'Failed to compare voiceprint'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        os.remove(full_path)
        return Response({'result': result.stdout.strip()})