// ==UserScript==
// @name        Reddit Shortcuts for Comments Page
// @namespace   http://nathanfriend.io
// @description Makes reddit more keyboard navigable. This script is only applied on a comments page.
// @include     *reddit.com/r/*/comments/*
// @version     1
// @grant       none
// ==/UserScript==

if (!jQuery) {
    console.error('jQuery not found! Greasemonkey script "reddit-shortcuts-comment.user.js" relies on jQuery.');
}

(function ($) {

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
        $allComments = null,
        $currentComment = null;

    $body.keydown(function (e) {
        // make "K" and "J" move focus from link to link
        if ((e.keyCode === j || e.keyCode === k || e.keyCode === h || e.keyCode === l
            || e.keyCode === up || e.keyCode === down || e.keyCode === left || e.keyCode === right) && !e.ctrlKey) {
            e.preventDefault();
            e.stopPropagation();

            if (e.keyCode === j || e.keyCode == down) {
                // move down

                var $comments = $('.comment').not(':hidden');
                var currentCommentIndex = $comments.index($currentComment);
                if (currentCommentIndex < $comments.size() - 1) {
                    var $nextComment = $comments.eq(currentCommentIndex + 1);
                    if ($nextComment) {
                        $currentComment = $nextComment;
                        focusAndScrollLink($currentComment, 'down');
                    }
                }

            } else if (e.keyCode === k || e.keyCode == up) {
                // move up

                var $comments = $('.comment').not(':hidden');
                var currentCommentIndex = $comments.index($currentComment);
                if (currentCommentIndex > 0) {
                    var $nextComment = $comments.eq($comments.index($currentComment) - 1);
                    if ($nextComment) {
                        $currentComment = $nextComment;
                        focusAndScrollLink($currentComment, 'up');
                    }
                }
            } else if (e.keyCode === l || e.keyCode === right) {
                // expand the link
                if ($currentComment.is('.collapsed')) {
                    $currentComment.find('.entry').first().find('.tagline a.expand').click();
                }
            } else if (e.keyCode === h || e.keyCode === left) {
                // collapse the link
                if ($currentComment.is('.noncollapsed')) {
                    $currentComment.find('.entry').first().find('.tagline a.expand').click();
                }
            }
        }
    });

    function focusAndScrollLink($comment, direction) {
        var $entry = $comment.find('.entry').first();
        $('.entry').not($entry).removeClass(focusedClass);
        $entry.addClass(focusedClass);

        // scroll to the element, if necessary
        if (direction && !isScrolledIntoView($entry)) {
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
    $currentComment = $('.commentarea .comment:eq(0)');
    focusAndScrollLink($currentComment);

    // inject our custom focused style
    injectStyles('.' + focusedClass + ' { background: rgba(0,0,0,.07) !important; }');

})(jQuery)
