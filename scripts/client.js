(function() {
  'use strict';

  var myDataRef = new Firebase('https://office-to-logo.firebaseio.com/');
  myDataRef.push({ user: navigator.userAgent, msg: 'Hello World!' });
})();
