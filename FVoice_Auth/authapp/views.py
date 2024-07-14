from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from django.conf import settings
import os
import subprocess
import base64
import numpy as np
import requests
from web3 import Web3
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
        
        mfcc_base64 = result.stdout.strip()
        return Response({'voiceprint': mfcc_base64})

class CompareVoiceprintView(APIView):
    def post(self, request):
        voice_sample = request.data['voice_sample']
        user_address = request.data['user_address']
        voice_sample_binary = base64.b64decode(voice_sample)
        file_path = default_storage.save('new_output.wav', ContentFile(voice_sample_binary))
        full_path = os.path.join(settings.MEDIA_ROOT, file_path)
        
        # Extract voiceprint from new sample
        script_path = os.path.join(settings.BASE_DIR, 'backend', 'extract_voiceprint.py')
        result = subprocess.run(['python', script_path, full_path], capture_output=True, text=True)
        
        if result.returncode != 0:
            logger.error(f"Error extracting voiceprint: {result.stderr}")
            return Response({'message': 'Failed to extract voiceprint'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        new_mfcc_base64 = result.stdout.strip()
        new_mfcc = np.frombuffer(base64.b64decode(new_mfcc_base64), dtype=np.float64)
        
        # Retrieve IPFS hash from blockchain
        provider_url = "https://api.calibration.node.glif.io/rpc/v1"
        contract_address = "0xba2db7b4d21c13aaf23e050faceb26d4e177f333"
        abi = [
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_user",
                        "type": "address"
                    }
                ],
                "name": "getVoiceprint",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            }
        ]
        
        web3 = Web3(Web3.HTTPProvider(provider_url))
        contract = web3.eth.contract(address=contract_address, abi=abi)
        
        stored_ipfs_hash = contract.functions.getVoiceprint(user_address).call()
        
        ipfs_url = f"https://ipfs.io/ipfs/{stored_ipfs_hash}"
        response = requests.get(ipfs_url)
        stored_voiceprint_binary = response.content
        stored_mfcc = np.frombuffer(base64.b64decode(stored_voiceprint_binary), dtype=np.float64)
        
        # Compare the voiceprints
        distance = np.linalg.norm(stored_mfcc - new_mfcc)
        threshold = 15  # Define a suitable threshold
        
        if distance < threshold:
            result_message = "Voice authentication successful."
        else:
            result_message = "Voice authentication failed."
        
        os.remove(full_path)
        return Response({'result': result_message, 'distance': distance})
