﻿// ==UserScript==
// @name        Reddit Shortcuts for Link Page
// @namespace   http://nathanfriend.io
// @description Makes reddit more keyboard navigable. This script is only applied on a link page (not a comments page).
// @include     *reddit.com*
// @exclude     *reddit.com*/comments/*
// @version     1
// @grant       none
// ==/UserScript==

if (!jQuery) {
    console.error('jQuery not found! Greasemonkey script "reddit-shortcuts-main.user.js" relies on jQuery.');
}

(function ($) {

    var j = 74,
        k = 75,
        l = 76,
        c = 67,
        up = 38,
        down = 40,
        left = 37,
        right = 39,
        enter = 13,
        focusedClass = 'greasemonkey-focused',
        $body = $('body'),
        $links = $('#siteTable>div.link'),
        currentLinkIndex = 0;

    $body.keydown(function (e) {
        // make "K" and "J" move focus from link to link
        if ((e.keyCode === j || e.keyCode == down || e.keyCode === k || e.keyCode == up || e.keyCode === c || e.keyCode == l || e.keyCode == right) && !e.ctrlKey) {
            e.preventDefault();
            e.stopPropagation();

            if (e.keyCode === j || e.keyCode === down) {
                // move down

                if (currentLinkIndex < $links.size() - 1) {
                    currentLinkIndex++;
                    focusAndScrollLink(currentLinkIndex, 'up');
                }
            } else if (e.keyCode === k || e.keyCode === up) {
                // move up

                if (currentLinkIndex > 0) {
                    currentLinkIndex--;
                    focusAndScrollLink(currentLinkIndex, 'down');
                }
            } else if (e.keyCode === c || e.keyCode === l || e.keyCode == right) {
                // open up the comments of the current link in a new tab

                var $targetLink = $links.filter(':eq(' + currentLinkIndex + ')');
                window.open($targetLink.find('a.comments')[0].href, '_blank');
            }
        }
    });

    function focusAndScrollLink(index, direction) {
        var $linkToFocus = $links.filter(':eq(' + index + ')');
        $links.not($linkToFocus).removeClass(focusedClass);
        $linkToFocus.addClass(focusedClass).find('.entry a.title').focus();

        // scroll to the element, if necessary
        if (direction && !isScrolledIntoView($linkToFocus)) {
            $('html, body').animate({
                scrollTop: (direction === 'up' ? '+=' : '-=') + $(window).height() / 1.3
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

    // initialize the focus
    focusAndScrollLink(0);

    // inject our custom focused style
    injectStyles('.' + focusedClass + ' { background: rgba(0,0,0,.07) !important; }');

})(jQuery)
