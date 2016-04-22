(function() {
  'use strict';

  var nb_users = 0;

  // resize canvas to fit screen
  var canvas = document.getElementById('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // setup CreateJS objects
  var stage = new createjs.Stage('canvas');
  var renderContainer = new createjs.Container();
  stage.addChild(renderContainer);

  var rootRef = new Firebase('https://oanda-office-to-logo.firebaseio.com/');
  rootRef.set({
    width: window.innerWidth,
    height: window.innerHeight
  });

  var strokesRef = rootRef.child('strokes');

  // new paint stroke
  strokesRef.on('child_added', function(snapshot) {
    var stroke = snapshot.val();

    var shape = new createjs.Shape();
    shape.x = stroke.x;
    shape.y = stroke.y;
    shape.graphics.beginFill(stroke.color)
                  .drawCircle(0, 0, stroke.radius);
    renderContainer.addChild(shape);

    stage.update();

    console.log('new stroke', stroke);
  });

  // listen for user events (connect, move, disconnect)
  var usersRef = rootRef.child('users');

  usersRef.on('child_added', function(snapshot) {
    var user = snapshot.val();
    document.getElementById('users').innerHTML = ++nb_users;

    console.log('connected', user);
  });

  usersRef.on('child_removed', function(snapshot) {
    var user = snapshot.val();
    document.getElementById('users').innerHTML = --nb_users;

    console.log('disconnected', user);
  });

})();
