// ==UserScript==
// @name        Hacker News Main Page Keyboard Shortcuts
// @namespace   http://nathanfriend.io
// @description Adds vim-style keyboard shortcust to the Hacker News main page.
// @include     *news.ycombinator.com*
// @exclude     *news.ycombinator.com/item*
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
        l = 76,
        c = 67,
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
        if ((e.keyCode === j || e.keyCode == down || e.keyCode === k || e.keyCode == up || e.keyCode === c || e.keyCode == l || e.keyCode == right) && !e.ctrlKey) {
            e.preventDefault();
            e.stopPropagation();

            if (e.keyCode === j || e.keyCode === down) {
                // move down
                
                var $nextAThing = $focusedAThing.nextAll('.athing').first();
                if ($nextAThing.length > 0) {
                    focusAndScrollToComment($nextAThing, 'down');
                }
                
            } else if (e.keyCode === k || e.keyCode === up) {
                // move up
                
                var $prevAThing = $focusedAThing.prevAll('.athing').first();
                if ($prevAThing.length > 0) {
                    focusAndScrollToComment($prevAThing, 'up');
                }
                
            } else if (e.keyCode === c || e.keyCode === l || e.keyCode == right) {
                // open up the comments of the current link in a new tab

                var $targetLink = $focusedAThing.next().find('.subtext>a').last();
                window.open($targetLink[0].href, '_blank');
            }
        }
    });

    function focusAndScrollToComment($aThing, direction) {
        $focusedAThing = $aThing;

        $('.itemlist tr').removeClass(focusedClass);
        $aThing.find('.title>a').focus();
        $aThing.add($aThing.next()).addClass(focusedClass);

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
    
    focusAndScrollToComment($('.athing').first());

    // inject our custom focused style
    injectStyles('.' + focusedClass + ' { background: rgba(0,0,0,.07) !important; }');
    injectStyles('.' + focusedClass + ' a { outline: none; }');

})(jQuery)