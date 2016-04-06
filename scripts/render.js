(function() {
  'use strict';

  var nb_users = 0;
  var inputs = {};

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


  var rootRef = new Firebase('https://office-to-logo.firebaseio.com/');
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

    console.log('new stroke', stroke);
  });

  // listen for user events (connect, move, disconnect)
  var usersRef = rootRef.child('users');

  usersRef.on('child_added', function(snapshot) {
    var user = snapshot.val();
    document.getElementById('users').innerHTML = ++nb_users;

    var shape = new createjs.Shape();
    shape.x = user.pos.x;
    shape.y = user.pos.y;
    shape.graphics.setStrokeStyle(2)
                  .beginStroke('#000')
                  .drawCircle(0, 0, 30);
    inputContainer.addChild(shape);
    inputs[user.uid] = shape;

    console.log('connected', user);
  });

  usersRef.on('child_changed', function(snapshot) {
    var user = snapshot.val();
    var shape = inputs[user.uid];
    shape.x = user.pos.x;
    shape.y = user.pos.y;

    console.log('moved', user);
  });

  usersRef.on('child_removed', function(snapshot) {
    var user = snapshot.val();
    document.getElementById('users').innerHTML = --nb_users;

    inputContainer.removeChild(inputs[user.uid]);
    delete inputs[user.uid];

    console.log('disconnected', user);
  });

})();
