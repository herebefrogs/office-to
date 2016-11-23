(function() {
  'use strict';

  var nb_users = 0;
  var DEMO_STROKES_INTERVAL = 30000; // in seconds
  var MAX_NEW_STROKES = 5; // being added at every interval in "demo" mode
  var MAX_STROKES = 250; // in total on screen

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

    // keep track of key for removal later
    shape.key = snapshot.key();

    //console.log('new stroke #', shape.key, stroke);
  });

  strokesRef.on('child_removed', function(snapshot) {
    var key = snapshot.key();

    for (var i = 0; i < renderContainer.children.length; i++) {
      if (renderContainer.getChildAt(i).key === key) {
        console.log('removing #', key, 'at position', i, 'from canvas');
        renderContainer.removeChildAt(i);
        break;
      }
    }

    stage.update();
  });

  // listen for user events (connect, move, disconnect)
  var usersRef = rootRef.child('users');

  usersRef.on('child_added', function(snapshot) {
    var user = snapshot.val();
    document.getElementById('users').innerHTML = ++nb_users;

    //console.log('connected', user);
  });

  usersRef.on('child_removed', function(snapshot) {
    var user = snapshot.val();
    document.getElementById('users').innerHTML = --nb_users;

    //console.log('disconnected', user);
  });


  setInterval(function() {
    if (nb_users < 1) {
      var color = COLORS[randomInt(0, COLORS.length - 1)];
      var x = randomInt(0, window.innerWidth);
      var y = randomInt(0, window.innerHeight);

      for (var n = randomInt(1, MAX_NEW_STROKES); n > 0; n--) {
        addStroke(strokesRef, color,   x, y);
      }
    }

    // clear older strokes when more than a 100 ones?
    var extraStrokes = renderContainer.children.length - MAX_STROKES;
    while (extraStrokes > 0) {
      var shape = renderContainer.getChildAt(0);
      // console.log('removing #', shape.key, 'from db');
      strokesRef.child(shape.key).remove();
      extraStrokes--;
    }

  }, DEMO_STROKES_INTERVAL);

})();
