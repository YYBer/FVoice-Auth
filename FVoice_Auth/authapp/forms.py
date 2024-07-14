from django import forms

class VoiceForm(forms.Form):
    record_seconds = forms.IntegerField(label='Record seconds', initial=5)
