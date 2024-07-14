from django.urls import path
from .views import RecordVoiceView, ExtractVoiceprintView, CompareVoiceprintView

urlpatterns = [
    path('record/', RecordVoiceView.as_view(), name='record_voice'),
    path('extract/', ExtractVoiceprintView.as_view(), name='extract_voiceprint'),
    path('compare/', CompareVoiceprintView.as_view(), name='compare_voiceprint'),
]
