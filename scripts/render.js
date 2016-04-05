(function() {
  'use strict';

  createjs.Ticker.setFPS(30);

  // resize canvas to fit screen
  var canvas = document.getElementById('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // setup CreateJS objects
  var stage = new createjs.Stage('canvas');
  var renderContainer = new createjs.Container();
  var logoContainer = new createjs.Container();
  var inputContainer = new createjs.Container();
  stage.addChild(renderContainer, logoContainer, inputContainer);

  // main rendering loop
  var update = function(event) {
    stage.update();
  };

  createjs.Ticker.addEventListener('tick', update);



  var myDataRef = new Firebase('https://office-to-logo.firebaseio.com/');
  myDataRef.on('child_added', function(snapshot) {
    var stroke = snapshot.val();
    console.log(stroke.user, stroke.msg);
  });

})();
