from django.contrib import admin

# Register your models here.

from .models import Observation

admin.site.register(Observation)