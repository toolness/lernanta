from django.forms import fields

from tinymce.widgets import TinyMCE

from richtext import clean_html, TINYMCE_ATTRS


class RichTextFormField(fields.Field):

    def __init__(self, config_name='default', *args, **kwargs):
        self.config_name = config_name
        kwargs.update({'widget': TinyMCE(mce_attrs=TINYMCE_ATTRS[self.config_name])})
        super(RichTextFormField, self).__init__(*args, **kwargs)

    def to_python(self, value):
        value = super(RichTextFormField, self).to_python(value)
        value = clean_html(self.config_name, value)
        if value and value.strip() in ('<br />', '<br>'):
            value = u''
        elif not value:
            value = u''
        return value
