from django.db import models

from richtext.forms import RichTextFormField
from richtext import clean_html


class RichTextField(models.TextField):

    def __init__(self, config_name='default', *args, **kwargs):
        self.config_name = config_name
        super(RichTextField, self).__init__(*args, **kwargs)

    def formfield(self, **kwargs):
        return super(RichTextField, self).formfield(
            form_class=RichTextFormField, **kwargs)

    def pre_save(self, model_instance, add):
        value = super(RichTextField, self).pre_save(model_instance, add)
        setattr(model_instance, self.attname, clean_html(self.config_name,
            value))
        return value
