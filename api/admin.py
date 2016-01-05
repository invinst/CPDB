from django.contrib import admin

# Register your models here.
from api.models import InterfaceText

admin.site.register(InterfaceText, admin.ModelAdmin)
