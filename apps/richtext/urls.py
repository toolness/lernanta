from django.conf.urls.defaults import patterns, url, include

urlpatterns = patterns('richtext.views',
    url(r'^spellchecker/$', 'spell_check'),
    (r'', include('tinymce.urls')),
)
