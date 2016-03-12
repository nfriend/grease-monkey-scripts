// ==UserScript==
// @name        Hacker News Comment Keyboard Shortcuts
// @namespace   http://nathanfriend.io
// @description Adds vim-style keybaord shortcuts for collapsing/expanding comments.  Requires the hn-comment-collapser.user.js script also be installed.
// @include     *news.ycombinator.com/item*
// @require     https://code.jquery.com/jquery-2.2.1.min.js
// @version     1
// @grant       none
// ==/UserScript==

(function ($) {
    'use strict';

    // overwrite $.fn.height(), as per https://victorjcheng.wordpress.com/2012/08/30/jquery-1-8-dropping-quirks-mode-support-causes-issue/
    $.fn.oldHeightFunction = $.fn.height;

    $.fn.height = function () {
        if(this.is($(window))) {
            return (this.oldHeightFunction() < this[0].innerHeight) ? this.oldHeightFunction() : this[0].innerHeight;
        } else {
            return this.oldHeightFunction();
        }
    };

    var j = 74,
        k = 75,
        h = 72,
        l = 76,
        up = 38,
        down = 40,
        left = 37,
        right = 39,
        enter = 13,
        focusedClass = 'greasemonkey-focused',
        $body = $('body'),
        $focusedAThing = null;

    $body.keydown(function (e) {
        // make "K" and "J" move focus from link to link
        if ((e.keyCode === j || e.keyCode === k || e.keyCode === h || e.keyCode === l || 
             e.keyCode === up || e.keyCode === down || e.keyCode === left || e.keyCode === right) && !e.ctrlKey) {
            e.preventDefault();
            e.stopPropagation();

            var $comments = $('.athing').slice(1);               

            if (e.keyCode === j || e.keyCode == down) {
                // move down

                var $nextComment = $focusedAThing.nextAll('.athing:visible').first();
                if ($nextComment.length > 0) {
                    focusAndScrollToComment($nextComment, 'down');
                }

            } else if (e.keyCode === k || e.keyCode == up) {
                // move up

                var $firstAThing = $('.athing').first();
                var $prevComment = $focusedAThing.prevAll('.athing:visible').not($firstAThing).first();
                if ($prevComment.length > 0) {
                    focusAndScrollToComment($prevComment,  'up');
                }

            } else if (e.keyCode === l || e.keyCode === right) {
                // expand the link

                if ($focusedAThing.find('.collapse-link').is('.collapsed')) {
                    $focusedAThing.find('.collapse-link').click();
                }

            } else if (e.keyCode === h || e.keyCode === left) {
                // collapse the link
                
                if (!$focusedAThing.find('.collapse-link').is('.collapsed')) {
                    $focusedAThing.find('.collapse-link').click();
                } else {
                    
                    // if nodd is already collapsed, and it's a root node, close the current tab
                    if (parseInt($focusedAThing.find('.ind>img').attr('width'), 10) === 0) {
                        window.close();
                    }
                }
            }


        }
    });

    function focusAndScrollToComment($aThing, direction) {
        $focusedAThing = $aThing;

        $('.athing').removeClass(focusedClass);
        $aThing.addClass(focusedClass);

        // scroll to the element, if necessary
        if (direction && !isScrolledIntoView($aThing)) {
            $('html, body').animate({
                scrollTop: (direction === 'down' ? '+=' : '-=') + $(window).height() / 1.3
            }, 150);
        }
    }

    function injectStyles(cssString) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = cssString;
        head.appendChild(style);
    }

    // from http://stackoverflow.com/a/488073/1063392
    function isScrolledIntoView(elem) {
        var docViewTop = $(window).scrollTop();
        var docViewBottom = docViewTop + $(window).height();

        var elemTop = $(elem).offset().top;
        var elemBottom = elemTop + $(elem).height();

        return ((docViewTop < elemTop) && (docViewBottom > elemBottom));
    }

    // auto-focus the first link
    var $firstComment = $('.athing').slice(1).first();
    focusAndScrollToComment($firstComment);

    //$('.ind>img').each(function(ind) {
    //    $(this).attr('width', parseInt($(this).attr('width'), 10) + 15 + 'px');
    //});

    // inject our custom focused style
    injectStyles('.' + focusedClass + ' { background: rgba(0, 0, 0, .07) !important; }');

    // if a comment is clicked, focus the comment
    $('body').on('click', function (e) {
        var $target = $(e.target);
        var $newComment = $target.closest('.athing');
        if ($newComment.length > 0) {
            focusAndScrollToComment($newComment);
        }
    });

})(jQuery);