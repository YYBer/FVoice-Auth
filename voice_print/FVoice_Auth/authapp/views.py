# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# from django.core.files.storage import default_storage
# import os
# import subprocess
# import numpy as np

# class RecordVoiceView(APIView):
#     def post(self, request):
#         record_seconds = int(request.data.get('record_seconds', 5))
#         subprocess.run(['python', 'record_voice.py', str(record_seconds)])
#         return Response({'message': 'Voice recorded successfully!'})

# class ExtractVoiceprintView(APIView):
#     def post(self, request):
#         subprocess.run(['python', 'extract_voiceprint.py'])
#         return Response({'message': 'Voiceprint extracted successfully!'})

# class CompareVoiceprintView(APIView):
#     def post(self, request):
#         file = request.FILES['file']
#         file_name = default_storage.save('new_output.wav', file)
#         subprocess.run(['python', 'extract_voiceprint.py', 'new_output.wav'])
#         result = subprocess.run(['python', 'compare_voiceprint.py'], capture_output=True, text=True)
#         os.remove(file_name)
#         return Response({'result': result.stdout.strip()})


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.files.storage import default_storage
import os
import subprocess
import numpy as np

class RecordVoiceView(APIView):
    def post(self, request):
        record_seconds = int(request.data.get('record_seconds', 5))
        subprocess.run(['python', 'record_voice.py', str(record_seconds)])
        return Response({'message': 'Voice recorded successfully!'})

class ExtractVoiceprintView(APIView):
    def post(self, request):
        file = request.FILES['voice_sample']
        file_name = default_storage.save('output.wav', file)
        subprocess.run(['python', 'extract_voiceprint.py'])
        return Response({'message': 'Voiceprint extracted successfully!'})

class CompareVoiceprintView(APIView):
    def post(self, request):
        file = request.FILES['voice_sample']
        file_name = default_storage.save('new_output.wav', file)
        subprocess.run(['python', 'extract_voiceprint.py', 'new_output.wav'])
        result = subprocess.run(['python', 'compare_voiceprint.py'], capture_output=True, text=True)
        os.remove(file_name)
        return Response({'result': result.stdout.strip()})
