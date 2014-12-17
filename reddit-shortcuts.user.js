// ==UserScript==
// @name        Reddit Shortcuts
// @namespace   http://nathanfriend.io
// @description Makes reddit more keyboard navigable.
// @include     *reddit.com/r/*
// @version     1
// @grant       none
// ==/UserScript==

if (!jQuery) {
    console.error('jQuery not found! Greasemonkey script "reddit-shortcuts.user.js" relies on jQuery.');
}

(function ($) {

    var j = 74,
        k = 75,
        enter = 13,
        focusedClass = 'greasemonkey-focused',
        $body = $('body'),
        $links = $('#siteTable>div.link'),
        currentLinkIndex = 0;

    $body.keydown(function (e) {
        // make "K" and "J" move focus from link to link
        if ((e.keyCode === j || e.keyCode === k) && !e.ctrlKey) {
            e.preventDefault();
            e.stopPropagation();

            if (e.keyCode === j) {
                // move down

                if (currentLinkIndex < $links.size() - 1) {
                    currentLinkIndex++;
                    focusAndScrollLink(currentLinkIndex, 'up');
                }
            } else {
                // move up

                if (currentLinkIndex > 0) {
                    currentLinkIndex--;
                    focusAndScrollLink(currentLinkIndex, 'down');
                }
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
