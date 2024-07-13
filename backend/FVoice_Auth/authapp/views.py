from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.conf import settings
import os
import subprocess
import logging

logger = logging.getLogger(__name__)

class RecordVoiceView(APIView):
    def post(self, request):
        record_seconds = int(request.data.get('record_seconds', 5))
        result = subprocess.run(['python', 'record_voice.py', str(record_seconds)], capture_output=True, text=True)
        
        if result.returncode != 0:
            logger.error(f"Error recording voice: {result.stderr}")
            return Response({'message': 'Failed to record voice'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response({'message': 'Voice recorded successfully!'})

class ExtractVoiceprintView(APIView):
    def post(self, request):
        file = request.FILES['voice_sample']
        file_path = default_storage.save('output.wav', ContentFile(file.read()))
        full_path = os.path.join(settings.MEDIA_ROOT, file_path)
        
        result = subprocess.run(['python', 'extract_voiceprint.py', full_path], capture_output=True, text=True)
        
        if result.returncode != 0:
            logger.error(f"Error extracting voiceprint: {result.stderr}")
            return Response({'message': 'Failed to extract voiceprint'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response({'message': 'Voiceprint extracted successfully!'})

class CompareVoiceprintView(APIView):
    def post(self, request):
        file = request.FILES['voice_sample']
        file_path = default_storage.save('new_output.wav', ContentFile(file.read()))
        full_path = os.path.join(settings.MEDIA_ROOT, file_path)
        
        result = subprocess.run(['python', 'extract_voiceprint.py', full_path], capture_output=True, text=True)
        
        if result.returncode != 0:
            logger.error(f"Error extracting voiceprint: {result.stderr}")
            return Response({'message': 'Failed to extract voiceprint'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        # Rename the extracted voiceprint file to match the expected filename in compare_voiceprint.py
        os.rename('voiceprint.npy', 'new_voiceprint.npy')
        
        result = subprocess.run(['python', 'compare_voiceprint.py'], capture_output=True, text=True)
        
        if result.returncode != 0:
            logger.error(f"Error comparing voiceprint: {result.stderr}")
            return Response({'message': 'Failed to compare voiceprint'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        os.remove(full_path)
        return Response({'result': result.stdout.strip()})
