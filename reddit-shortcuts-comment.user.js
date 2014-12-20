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

                // find all of the selectable elements on the page, and select the next one, as long as there is a next one
                var $comments = $('.comment, .morechildren, .morerecursion').not(':hidden');
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

                // find all of the selectable elements on the page, and select the previous one, as long as there is a previous one
                var $comments = $('.comment, .morechildren, .morerecursion').not(':hidden');
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
                    // if we're at a regular collapsed node, just expand it

                    $currentComment.find('.entry').first().find('.tagline a.expand').click();
                } else if ($currentComment.is('.morechildren')) {
                    // if we're at a "load more comments..." link, trigger the load

                    var $loadMoreLink = $currentComment.find('.entry').first().find('.morecomments a');
                    var $parentSiteTable = $currentComment.closest('.sitetable');
                    var $previousSibling = $currentComment.prev();

                    // wait for the "load more comments..." link to be destroyed
                    $loadMoreLink.on('destroyed', function () {

                        // and then schedule a focus after all the rest of the new DOM stuff has been inserted
                        setTimeout(function () {

                            if ($previousSibling.size() === 0) {
                                // the new comment to focus will be the first child of the parent .sitetable element
                                $currentComment = $parentSiteTable.children('.comment, .morechildren, .morerecursion').first();
                                focusAndScrollLink($currentComment, 'down');
                            } else {
                                // the new comment will not be the first child of the parent .sitetable element
                                $currentComment = $previousSibling.nextAll('.comment, .morechildren, .morerecursion').first();
                                focusAndScrollLink($currentComment, 'down');
                            }

                        }, 0);
                    });
                    $loadMoreLink.click();
                } else if ($currentComment.is('.morerecursion')) {
                    // if we're at a "continue this thread" link, open it up in a new tab

                    window.open($currentComment.find('.entry .deepthread a').attr('href'), '_blank');
                }
            } else if (e.keyCode === h || e.keyCode === left) {
                // collapse the link

                if ($currentComment.is('.noncollapsed') && !($currentComment.is('.morerecursion, .morechildren'))) {
                    // if we're at a regular noncollapsed node, just collapse it

                    $currentComment.find('.entry').first().find('.tagline a.expand').click();
                } else {
                    // if we're at a node that's already collapsed, focus and collapse its parent

                    if ($currentComment.is('.morerecursion, .morechildren')) {
                        $currentComment = $currentComment.parent('.sitetable').closest('.sitetable').closest('.comment');
                    } else {
                        $currentComment = $currentComment.parent('.sitetable').closest('.comment');
                    }

                    if ($currentComment.size() === 0) {
                        // if we're already at a root node, close the page

                        window.close();
                    } else {
                        $currentComment.find('.entry').first().find('.tagline a.expand').click();
                        focusAndScrollLink($currentComment, 'up');
                    }
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

    // create a custom "destroyed" event to detect when an element has been removed from the page
    $.event.special.destroyed = {
        remove: function (o) {
            if (o.handler) {
                o.handler()
            }
        }
    }

    // if a comment is clicked, focus the comment
    $('body').on('click', function (e) {
        $target = $(e.target);
        var $newComment = $target.closest('.comment, .morechildren, .morerecursion')
        if ($newComment.size() !== 0) {
            $currentComment = $newComment;
            focusAndScrollLink($currentComment);
        }
    });

})(jQuery)
