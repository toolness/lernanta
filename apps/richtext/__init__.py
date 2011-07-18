import bleach

from django.core.urlresolvers import reverse


TINYMCE_DEFAULT_CONFIG = {
    'theme': 'advanced',
    'theme_advanced_toolbar_location': 'top',
    'theme_advanced_toolbar_align': 'left',
    'theme_advanced_statusbar_location': 'bottom',
    'plugins': 'spellchecker,fullscreen,emotions,table',
    'theme_advanced_blockformats': 'p,h1,h2,h3,h4,h5,h6,blockquote,code',
}

TINYMCE_ATTRS = {
    'default': {
        'theme_advanced_source_editor_width': 420,
        'theme_advanced_source_editor_height': 110,
        'theme_advanced_buttons1': 'code,|,bold,italic,|,link,unlink,|,spellchecker',
        'theme_advanced_buttons2': '',
        'theme_advanced_buttons3': '',
    },
    'rich': {
        'theme_advanced_source_editor_width': 568,
        'theme_advanced_source_editor_height': 255,
        'theme_advanced_buttons1': 'code,|,bold,italic,underline,strikethrough,sub,sup,|,' \
            'justifyleft,justifycenter,justifyright,justifyfull,|,' \
            'numlist,bullist,hr,outdent,indent,blockquote,|,forecolor,backcolor,|,fullscreen',
        'theme_advanced_buttons2': 'link,unlink,anchor,image,emotions,charmap,table,|,' \
            'formatselect,fontselect,fontsizeselect,|,spellchecker',
        'theme_advanced_buttons3': '',
    },
}

# Constants for cleaning richtext html.

REDUCED_ALLOWED_TAGS = ('a', 'b', 'em', 'i', 'strong', 'p', 'u', 'strike',
    'sub', 'sup', 'br')

RICH_ALLOWED_TAGS = REDUCED_ALLOWED_TAGS + ('h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ol', 'ul', 'li', 'hr', 'blockquote',
        'span', 'pre', 'code', 'div', 'img',
        'table', 'thead', 'tr', 'th', 'caption', 'tbody', 'td', 'br')


REDUCED_ALLOWED_ATTRIBUTES = {
    'a': ['href', 'title', 'target', 'name'],
}

RICH_ALLOWED_ATTRIBUTES = REDUCED_ALLOWED_ATTRIBUTES.copy()

RICH_ALLOWED_ATTRIBUTES.update({
    'img': ['src', 'alt', 'style', 'title','width','height'],
    'p': ['style'],
    'table': ['align', 'border', 'cellpadding', 'cellspacing',
        'style', 'summary', 'id', 'class', 'lang', 'dir'],
    'th': ['scope'],
    'span': ['style'],
    'pre': ['class'],
    'code': ['class'],
})


RICH_ALLOWED_STYLES = ('text-align', 'margin-left', 'border-width',
    'border-style', 'margin', 'float', 'width', 'height',
    'font-family', 'font-size', 'color', 'background-color',
    'text-decoration','padding-left','vertical-align','margin-top',
    'margin-bottom', 'margin-right', 'background-image', 'border-color',
    )


BLEACH_CLEAN = {
    'default': {
        'tags': REDUCED_ALLOWED_TAGS,
        'attributes': REDUCED_ALLOWED_ATTRIBUTES,
        'styles': [],
        'strip': True,
    },
    'rich': {
        'tags': RICH_ALLOWED_TAGS,
        'attributes': RICH_ALLOWED_ATTRIBUTES,
        'styles': RICH_ALLOWED_STYLES,
        'strip': True,
    },
}


def clean_html(config_name, value):
    if value:
        return bleach.clean(value, **BLEACH_CLEAN[config_name])
    else:
        return value
