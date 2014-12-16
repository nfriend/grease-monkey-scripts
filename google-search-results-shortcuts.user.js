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
    one = 49,
    nine = 57,
    enter = 13,
    body = document.getElementsByTagName('body')[0],
    linksToOpen = [];

body.addEventListener('keydown', function (e) {
  
  // make "J" and "K" synonymous with the up and down arrows
  if ((e.keyCode === j || e.keyCode === k) && !e.ctrlKey) {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.keyCode === j) {
      body.dispatchEvent(createKeyboardEvent(down));
    } else {
      body.dispatchEvent(createKeyboardEvent(up));
    }
  }
  
  // make 1 - 9 open up the respective search result in a new tab, after pressing Enter
  if (e.keyCode >= one && e.keyCode <= nine) {
    e.preventDefault();
    e.stopPropagation();
  
    var targetLink = document.getElementsByClassName('g')[e.keyCode - 49].getElementsByClassName('r')[0].getElementsByTagName('a')[0];
    if (linksToOpen.indexOf(targetLink.href) === -1) {
      linksToOpen.push(targetLink.href);
    }
  }
  
  if (e.keyCode === enter && linksToOpen.length > 0) {
    for (var i = 0; i < linksToOpen.length; i++) {
      window.open(linksToOpen[i], '_blank');
    }
    linksToOpen = [];
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
