from django import forms

from richtext import clean_html


class RichTextWidget(forms.Textarea):

    def __init__(self, config_name='default', *args, **kwargs):
        super(RichTextWidget, self).__init__(*args, **kwargs)
        self.config_name = config_name

    def render(self, *args, **kwargs):
        return super(RichTextWidget, self).render(*args, **kwargs)


class RichTextFormField(forms.fields.Field):
    def __init__(self, config_name='default', *args, **kwargs):
        self.config_name = config_name
        kwargs.update({'widget': RichTextWidget(config_name=config_name)})
        super(RichTextFormField, self).__init__(*args, **kwargs)

    def to_python(self, value):
        value = super(RichTextFormField, self).to_python(value)
        value = clean_html(self.config_name, value)
        if value.strip() == "<br />":
            value = u''
        return value
