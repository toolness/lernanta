from django.views.decorators.csrf import csrf_exempt

from tinymce.views import spell_check


# Disabling csrf check for spell_check
# https://github.com/aljosa/django-tinymce/issues/5
spell_check = csrf_exempt(spell_check)
