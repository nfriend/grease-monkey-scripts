// ==UserScript==
// @name        Hacker News Collapsing Comments
// @namespace   http://nathanfriend.io
// @description Adds reddit-style comment collapsing to Hacker News comment threads
// @include     *news.ycombinator.com/item*
// @require     https://code.jquery.com/jquery-2.2.1.min.js
// @version     1
// @grant       none
// ==/UserScript==

'use strict';

(function ($) {

    var collapseLink = $('<div class="collapse-link">[−]</div>');
    collapseLink.click(function(e) {
        var $this = $(this);
        if ($this.is('.collapsed')) {
            $this.html('[−]').removeClass('collapsed');
            showOrHideAThing($this, true);
        } else {
            $this.html('[+]').addClass('collapsed');
            showOrHideAThing($this, false);
        }
    });
    $('.votelinks').slice(1).prepend(collapseLink);

    function showOrHideAThing($collapseLink, show) {

        var display = show ? '' : 'none',
            fontStyle = show ? '' : 'italic',
            indentSize = parseInt($collapseLink.parent().siblings('.ind').find('img').first().attr('width'), 10),
            done = false,
            childCount = 0;

        var $default = $collapseLink.parent().siblings('.default');
        $default.find('.comment').css('display', display);
        $default.find('.comhead').css('font-style', fontStyle);

        $collapseLink.closest('.athing').nextAll('.athing').each(function(index) {
            if (!done) {
                var $innerThis = $(this);
                if (parseInt($innerThis.find('.ind>img').attr('width'), 10) > indentSize) {
                    childCount++;
                    $innerThis.css('display', display);
                } else {
                    done = true;
                }
            }
        });

        if (show) {
            $default.find('.child-count').remove();
        } else {
            var childText = childCount + (childCount === 1 ? ' child' : ' children');
            $default.find('.comhead').append('<span class="child-count">(' + childText + ')</span>')
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

    injectStyles('.collapse-link:hover { text-decoration: underline; }');
    
    var letterSpacing = /firefox/i.test(navigator.userAgent) ? 1.1 : 3;
    injectStyles('.collapse-link { cursor: pointer; margin-left: -20px; position: absolute; letter-spacing: -' + letterSpacing + 'px; }');

})(jQuery)
