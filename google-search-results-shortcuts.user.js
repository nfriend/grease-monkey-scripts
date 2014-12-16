// ==UserScript==
// @name        Google Search Results Shortcuts
// @namespace   http://nathanfriend.io
// @description Adds handy keyboard shortcuts to the Google search page.  Note that 
// @include     *google.*/search*
// @version     1
// @grant       none
// ==/UserScript==

var j = 74,
    k = 75,
    down = 40,
    up = 38,
    body = document.getElementsByTagName('body')[0];

// make "J" and "K" synonymous with the up and down arrows
body.addEventListener('keydown', function (e) {
  if ((e.keyCode === j || e.keyCode === k) && !e.ctrlKey) {
    e.preventDefault();
    e.stopPropagation();
    if (e.keyCode === j) {
      body.dispatchEvent(createKeyboardEvent(down));
    } else {
      body.dispatchEvent(createKeyboardEvent(up));
    }
  }
});

function createKeyboardEvent(keyCode) {
  return new KeyboardEvent('keydown', {
    'view': window,
    'bubbles': true,
    'cancelable': true,
    'keyCode': keyCode
  });
}
