from django.conf import settings
from django.db import models

class PromptTemplate(models.Model):
    key = models.CharField(max_length=128, unique=True)
    template_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class AIRequestLog(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    prompt_key = models.CharField(max_length=128)
    input_payload = models.JSONField()
    output_payload = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    model_name = models.CharField(max_length=128, null=True, blank=True)
    tokens_used = models.IntegerField(null=True, blank=True)
    cost_estimate = models.DecimalField(max_digits=10, decimal_places=4, null=True, blank=True)
