(function() {
  'use strict';

  var nb_users = 0;
  var DEMO_STROKES_INTERVAL = 30000; // in seconds
  var MAX_NEW_STROKES = 10; // being added at every interval in "demo" mode
  var MAX_STROKES = 1000; // in total on screen

  // setup CreateJS objects
  var stage = new createjs.Stage('canvas');
  var renderContainer = new createjs.Container();
  stage.addChild(renderContainer);

  // resize canvas to fit screen
  var canvas = document.getElementById('canvas');
  var resize = function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    renderContainer.children.forEach(function(shape) {
      shape.x = Math.round(shape.px * canvas.width / 100);
      shape.y = Math.round(shape.py * canvas.height / 100);
    });
    stage.update();
  }
  resize();
  window.addEventListener('resize', resize);

  var rootRef = new Firebase('https://oanda-office-to-logo.firebaseio.com/');
  var strokesRef = rootRef.child('strokes');

  // new paint stroke
  strokesRef.on('child_added', function(snapshot) {
    var stroke = snapshot.val();

    var shape = new createjs.Shape();
    shape.x = Math.round(stroke.x * canvas.width / 100);
    shape.y = Math.round(stroke.y * canvas.height / 100);
    shape.graphics.beginFill(stroke.color)
                  .drawCircle(0, 0, stroke.radius);
    renderContainer.addChild(shape);

    stage.update();

    // keep track of key for removal later
    shape.key = snapshot.key();
    // keep track of original x/y percentages in case of window resize
    shape.px = stroke.x;
    shape.py = stroke.y;

    //console.log('new stroke #', shape.key, stroke, shape.x, shape.y);
  });

  strokesRef.on('child_removed', function(snapshot) {
    var key = snapshot.key();

    for (var i = 0; i < renderContainer.children.length; i++) {
      if (renderContainer.getChildAt(i).key === key) {
        //console.log('removing #', key, 'at position', i, 'from canvas');
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
      var x = randomInt(0 + MAX_DRIFT, 100 - MAX_DRIFT);
      var y = randomInt(0 + MAX_DRIFT, 100 - MAX_DRIFT);

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
