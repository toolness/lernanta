var createPostTextArea = function() {
    var counter = $('#create-post').find('div.post-char-count');
    $('#create-post').find('textarea').bind('keyup', function() {
        var max = 750;
        var count = max - $(this).val().length;
        counter.html(count);

        if (count < 0 || count >= max) {
            counter.addClass('danger');
            counter.removeClass('warning');
            $('#post-project-update').attr("disabled", "disabled");
            $('#post-update').attr("disabled", "disabled");
        } else if (count < 50) {
            counter.removeClass('danger');
            counter.addClass('warning');
            $('#post-project-update').removeAttr("disabled");
            $('#post-update').removeAttr("disabled");
        } else {
            counter.removeClass('danger');
            counter.removeClass('warning');
            $('#post-project-update').removeAttr("disabled");
            $('#post-update').removeAttr("disabled");
        }
    });

    $('#create-post').find('#fake-message-input').bind('focus', function() {
        $('#post-project-update').attr("disabled", "disabled");
        $('#post-update').attr("disabled", "disabled");
        counter.addClass('danger');
        counter.removeClass('warning');
        $('#create-post').addClass('expanded');
        $('#create-post').find('textarea').trigger('focus');
    });
};

var usernameHint = function() {
    var userurl = $('#username .hint b').html();
    $('#id_username').keyup(function() {
        $('#availability').removeClass('okay warning').html('');
        var val = (this.value) ? this.value : userurl;
        $(this).parent('.field').find('.hint b').html(val);
    }).keyup();
};

var usernameAvailability = function() {
    $('#id_username').bind('blur', function() {
        var $elem = $(this);
        if ($elem.val().length != 0) {
            $.ajax({
                url: '/ajax/check_username/',
                data: {
                    username: this.value
                },
                success: function() {
                    $('#availability').removeClass('okay')
                        .addClass('warning')
                        .html('not available');
                },
                error: function() {
                    $('#availability').removeClass('warning')
                        .addClass('okay')
                        .html('available');
                }
            });
        }
    });
};

var openidHandlers = function() {
    var oneClick = {
        'google': 'https://www.google.com/accounts/o8/id',
        'yahoo': 'https://yahoo.com',
        'myopenid': 'https://www.myopenid.com'
    };
    $.each(oneClick, function(key, value) {
        $('.openid_providers #' + key).bind('click', function(e) {
            e.preventDefault();
            $('#id_openid_identifier').val(value);
            $('#id_openid_identifier').parent().submit();
        });
    });
};

var loadMoreMessages = function() {
    $('a#inbox_more').bind('click', function(e) {
        e.preventDefault();
        var template = $('#message-template');
        var page = template.attr('page');
        var npages = template.attr('npages');
        var url = $(this).attr('href');
        $.getJSON(url, function(data) {
            $(data).each(function(i, value) {
                var msg = template.tmpl(value);
                msg.hide();
                $('#posts').append(msg);
                $('li.post-container:last').fadeIn(function() {
                    $('html').animate({
                        'scrollTop': $('a#inbox_more').offset().top
                    }, 200);
                });
            });
            nextPage = parseInt(page) + 1;
            template.attr('page', nextPage);
            if (nextPage > parseInt(npages)) {
                $('a#inbox_more').hide();
            }
            // update more link. very hacky :( 
            var href = $('a#inbox_more').attr('href');
            var newHref = href.substr(0, href.length - 2) + nextPage + '/';
            $('a#inbox_more').attr('href', newHref);
        });
    });
};

var attachFileUploadHandler = function($inputs) {
    var updatePicturePreview = function(path) {
        var $img = $('<img class="member-picture"></img>');
        $img.attr('src', path);
        $('p.picture-preview img').remove();
        $img.appendTo('p.picture-preview');
    };
    $(this).closest('form').removeAttr('enctype');
    $inputs.closest('fieldset').addClass('ajax-upload');
    $inputs.each(function() {
        $(this).ajaxSubmitInput({
            url: $(this).closest('form').attr('data-url'),
            beforeSubmit: function($input) {
                updatePicturePreview("/media/images/ajax-loader.gif");
                $options = {};
                $options.filename = $input.val().split(/[\/\\]/).pop();
                return $options;
            },
            onComplete: function($input, iframeContent, passJSON) {
                $input.closest('form')[0].reset();
                $input.trigger('clean');
                if (!iframeContent) {
                    return;
                }
                content = jQuery.parseJSON(iframeContent);
                updatePicturePreview("/media/" + content.filename);
            }
        });
    });
};

function carousel_itemLoadCallback(url, carousel, state) {

    if (carousel.has(carousel.first, carousel.last)) {
        return;
    }

    $.get(url, {first: carousel.first, last: carousel.last}, function(data) {
        carousel_itemAddCallback(carousel, carousel.first, carousel.last, data);
    });
};

function carousel_itemAddCallback(carousel, first, last, data) {
    carousel.size(data['total']);

    $.each(data['items'], function(index, item) {
        carousel.add(first + index, item);
    });
};

var batucada = {
    splash: {
        onload: function() {
        }
    },
    compose_message: {
        onload: function() {
            $('#id_recipient').autocomplete({
                source: '/ajax/following/',
                minLength: 2
            });
        }
    },
    create_profile: {
        onload: function() {
            usernameHint();
            usernameAvailability();
        }
    },
    signup: {
        onload: function(){
            usernameHint();
            usernameAvailability();
        }
    },
    signup_openid: {
        onload: function() {
            openidHandlers();
        }
    },
    signin_openid: {
        onload: function() {
            openidHandlers();
        }
    },
    dashboard: {
        onload: function() {
            createPostTextArea();
            $('#post-update').bind('click', function() {
                $('#post-status-update').submit();
            });
            $('a.activity-delete').bind('click', function(e) {
                $(e.target).parent().submit();
                return false;
            });
            $('.close_button').bind('click', function(e) {
                e.preventDefault();
                $('.welcome').animate({
                    opacity: 'hide',
                    height: 'hide',
                    paddingTop: 0,
                    paddingBottom: 0,
                    marginTop: 0,
                    marginBottom: 0
                }, 600, 'jswing', function() {
                    $.post('/broadcasts/hide_welcome/');
                });
            });
        }
    },
    project_landing: {
        onload: function() {
            createPostTextArea();
            $('#post-project-update').bind('click', function() {
                $('#post-project-status-update').submit();
            });
        }
    },
    challenge_landing: {
        onload: function() {
            createPostTextArea();
            $('#post-challenge').bind('click', function() {
                $('#post-challenge-summary').submit();
            });
        }
    },
    user_profile: {
        onload: function() {
            createPostTextArea();
            $('#post-user-update').bind('click', function() {
                $('#post-user-status-update').submit();
            });
        }
    },
    profile_edit: {
        onload: function() {
            var $inputs = $('input[type=file]');
            if ($inputs) {
                attachFileUploadHandler($inputs);
            }
            openidHandlers();
        }
    },
    project_edit: {
        onload: function() {
            var $inputs = $('input[type=file]');
            if ($inputs) {
                attachFileUploadHandler($inputs);
            }
        }
    },
    school_edit: {
        onload: function() {
            var $inputs = $('input[type=file]');
            if ($inputs) {
                attachFileUploadHandler($inputs);
            }
        }
    },
    signup: {
        onload: function() {
            var $inputs = $('input[type=file]');
            if ($inputs) {
                attachFileUploadHandler($inputs);
            }
        }
    },
    inbox: {
        onload: function() {
            loadMoreMessages();
        }
    },
};


$(document).ready(function() {
    // dispatch per-page onload handlers 
    var ns = window.batucada;
    var bodyId = document.body.id;
    if (ns && ns[bodyId] && (typeof ns[bodyId].onload == 'function')) {
        ns[bodyId].onload();
    }
    // attach handlers for elements that appear on most pages
     $('#main-nav').find('li.menu').bind('mouseover mouseout', function(event) {
        $(this).toggleClass('open');
    });

    $('#user-nav').find('li.menu').bind('mouseover mouseout', function(event) {
        $(this).toggleClass('open');
    });

    // modals using jQueryUI dialog
    $('.button.openmodal').live('click', function(){
        var url = this.href;
        var selector = '.modal';
        var urlFragment =  url + ' ' + selector;
        var dialog = $('<div></div>').appendTo('body');
        // load remote content
        dialog.load(
            urlFragment,
            function (responseText, textStatus, XMLHttpRequest) {
                dialog.dialog({
                    draggable: true
                });
            }
        );
        // prevent the browser to follow the link
        return false;
    });

    
    $('li.contribute-nav').click(function(){
    	var number = $(this).index();
    	$('li.contribute-item').hide().eq(number).fadeIn('slow');
    	$(this).toggleClass('active inactive');
    	$('li.contribute-nav').not(this).removeClass('active').addClass('inactive');
    });
    if ($('li.contribute-item').length) {
    	$('li.contribute-item').not(':first').hide();
    }

    if ($('#id_start_date').length) {
        $('#id_start_date').datepicker();
        $('#id_end_date').datepicker();
    }

    if ($('.project-kind-challenge #task_list_wall #progressbar').length) {
        var progressbar_value = $(".project-kind-challenge #task_list_wall #progressbar").attr('value');
        $(".project-kind-challenge #task_list_wall #progressbar").progressbar({'value': parseInt(progressbar_value)});
    }

    if ( $('#other-badges').length ) {
        var $carousel_list = $(this).find('.carousel');
        var carousel_callback_url = $(this).find('.carousel-callback').attr('href');
        function other_badges_carousel_itemLoadCallback (carousel, state) {
            carousel_itemLoadCallback(carousel_callback_url, carousel, state);
        };
        $carousel_list.jcarousel({
            // Uncomment the following option if you want items
            // which are outside the visible range to be removed
            // from the DOM.
            // Useful for carousels with MANY items.

            // itemVisibleOutCallback: {onAfterAnimation: function(carousel, item, i, state, evt) { carousel.remove(i); }},
            itemLoadCallback: other_badges_carousel_itemLoadCallback
        });
    }

    if ($('#headers_colorpicker').length) {
        $.farbtastic('#headers_colorpicker', { callback: '#id_headers_color', width: 100, heigth: 100 });
        $.farbtastic('#headers_light_colorpicker', { callback: '#id_headers_color_light', width: 100, heigth: 100 });
        $.farbtastic('#background_colorpicker', { callback: '#id_background_color', width: 100, heigth: 100 });
        $.farbtastic('#menu_colorpicker', { callback: '#id_menu_color', width: 100, heigth: 100 });
        $.farbtastic('#menu_light_colorpicker', { callback: '#id_menu_color_light', width: 100, heigth: 100 });
    }

    prettyPrint();
    $('.richtext_section').each(function(index, value) {
       AMprocessNode(value);
    });

    // disable submit button on form submit
    $('form').submit(function(){
        $(this).find('input[type=submit]').attr('disabled', 'disabled');
        $(this).find('button[type=submit]').attr('disabled', 'disabled');
        $(this).find('#previewButton').removeAttr('disabled');
    });

    if ($('#task_list_wall_toogle').length) {
        $( "#task_list_wall_toogle" ).buttonset();
    }
});

// Recaptcha
var RecaptchaOptions = { theme : 'custom' };

$('#recaptcha_different').click(function(e) {
    e.preventDefault();
    Recaptcha.reload();
});

$('#recaptcha_audio').click(function(e) {
    e.preventDefault();
    Recaptcha.switch_type('audio');
});

$('#recaptcha_help').click(function(e) {
    e.preventDefault();
    Recaptcha.showhelp();
});

$('.messages li.error, .messages li.success, .messages li.info').click(function () {
    $(this).fadeOut("fast");
});

$(".project-kind-challenge #task_list_wall #task_list_wall_toogle #radio1").click(function(){
    $('.project-kind-challenge #task_list_wall #project_wall_section').hide();
    $('.project-kind-challenge #task_list_wall #task_list_section').show();
    $('.project-kind-challenge #task_list_wall #progress').show();
});

$(".project-kind-challenge #task_list_wall #task_list_wall_toogle #radio2").click(function(){
    $('.project-kind-challenge #task_list_wall #task_list_section').hide();
    $('.project-kind-challenge #task_list_wall #progress').hide();
    $('.project-kind-challenge #task_list_wall #project_wall_section').show();
});

$(".project-kind-challenge #task_list_section .taskCheckbox").click(function(){
    var $task_completion_checkbox = $(this);
    var $task_completion_form = $task_completion_checkbox.parent();
    $task_completion_form.parent().toggleClass("taskSelected");
    var url = $task_completion_form.attr('action');
    $task_completion_checkbox.attr('disabled', 'disabled');
    $.post(url, $task_completion_form.serialize(), function(data) {
        var total_count = data['total_count'];
        var completed_count = data['completed_count'];
        var progressbar_value = data['progressbar_value'];
        $(".project-kind-challenge #task_list_wall #total_count").html(total_count);
        $(".project-kind-challenge #task_list_wall #completed_count").html(completed_count);
        var $tasks_progressbar = $(".project-kind-challenge #task_list_wall #progressbar");
        $tasks_progressbar.progressbar("option", "value", progressbar_value);
        $task_completion_checkbox.removeAttr('disabled');
        var $tasks_completed_msg = $('.project-kind-challenge .tasks-completed-msg');
        if( progressbar_value == "100" ) {
            $tasks_completed_msg.fadeIn('fast');
            window.scrollTop();
        } else {
            $tasks_completed_msg.fadeOut('fast');
        }
    });
});

$('.project-kind-challenge #task-footer-uncompleted form').submit(function() {
    var $task_completion_form = $(this);
    var url = $task_completion_form.attr('action');
    $.post(url, $task_completion_form.serialize(), function(data) {
        var total_count = data['total_count'];
        var completed_count = data['completed_count'];
        var progressbar_value = data['progressbar_value'];
        var upon_completion_redirect = data['upon_completion_redirect'];
        if( progressbar_value == "100" ) {
            window.location.href = upon_completion_redirect;
        } else {
            $('.project-kind-challenge #task-footer-uncompleted').hide();
            $('.project-kind-challenge #task-footer-completed').fadeIn('fast');
        }
    });
    return false;
});

$('.project-kind-challenge a#leave_direct_signup_button').bind('click', function() {
    $(this).parent().submit();
});

$('.project-kind-challenge a.give_badge_action').each(function() {

    var $dialog_div = $(this).parent().find('div.give_badge_dialog');
    var $dialog = $dialog_div.dialog({
        modal: true,
        autoOpen: false
    });

    $(this).click(function() {
        $dialog.dialog('open');
        return false;
    });

});

$('.project-kind-challenge #task_list_section li').hover(function() {
      $(this).find('.taskView').show();
}, function() {
      $(this).find('.taskView').hide();
});

$('.project-kind-challenge span.first-post').hover(function() {
      $(this).find('.report').show();
}, function() {
      $(this).find('.report').hide();
});

$('.project-kind-challenge span.post-replies').hover(function() {
      $(this).find('.report').show();
}, function() {
      $(this).find('.report').hide();
});

$(".right-aligned-rating").hover(
    function () {
        $("div.rating-key").hide();
        $(this).find("div.rating-key").show();
});

// Don't let users embed external task links in comments.
$(".task-discussion button.external-task").remove();

$("button.external-task").click(function() {
  var url = $(this).attr("data-url");
  var opened = window.open(url);
  
  function onMessage(event) {
    event = event.originalEvent;
    // TODO: Ensure that event.origin is what we expect it to be, i.e.
    // the same origin as 'url'.
    if (event.source == opened && event.data == "task-complete") {
      $(window).unbind('message', onMessage);
      $("form.task-done-button").submit();
    }
  }
  
  $(window).bind('message', onMessage);
});
