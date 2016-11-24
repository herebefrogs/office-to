(function() {
  'use strict';

  var DEBUG = false;
  document.getElementById('debug').style.display = DEBUG ? 'block' : 'none';

  var clientRef;
  var data = {
    color: COLORS[randomInt(0, COLORS.length - 1)],
    pos: {
      x: randomInt(0, 100),
      y: randomInt(0, 100)
    },
    vel: {
      x: 0,
      y: 0
    }
  };
  var elapsed_time = 0; // in seconds
  var FRAME_RATE = 0.15; // in seconds
  var previous_time = 0; // in milliseconds
  var strokesRef;
  var uid;
  var VELOCITY_DRAG = 1; // velocity reduction per frame rate

  var processDeviceMotion = function(event) {
    var delta_time = (event.timeStamp - previous_time) / 1000 / FRAME_RATE;
    elapsed_time += delta_time;
    previous_time = event.timeStamp;

    // velocity from acceleration
    // NOTE: when holding the phone straight, right is negative x and up is negative y
    // so apply a negative sign to x to reverse that
    // however CreateJS y axis points downward so keep the y acceleration value as is
    data.vel.x += -event.acceleration.x * delta_time;
    data.vel.y += event.acceleration.y * delta_time;
/*
    // position from velocity
    // NOTE: actual formula, terrible results
    data.pos.x += data.vel.x * delta_time + -event.acceleration.x * delta_time * delta_time;
    data.pos.y += data.vel.y * delta_time + event.acceleration.y * delta_time * delta_time;
*/
    data.pos.x += data.vel.x;
    data.pos.y += data.vel.y;

    // wrap the input around the physical screen (in case we can keep it in)
    while (data.pos.x < 0) { data.pos.x += 100; }
    while (data.pos.y < 0) { data.pos.y += 100; }
    while (data.pos.x > 100) { data.pos.x -= 100; }
    while (data.pos.y > 100) { data.pos.y -= 100; }

    if (elapsed_time > FRAME_RATE) {
      // apply drag (or circle never stops)
      data.vel.x = Math.max(0, data.vel.x - VELOCITY_DRAG);
      data.vel.y = Math.max(0, data.vel.y - VELOCITY_DRAG);

      elapsed_time = 0;

      // add a new paint stroke
      if (data.vel.y > 1 || data.vel.x > 1) {
        addStroke(strokesRef, data.color, data.pos.x, data.pos.y);
      }

      if (DEBUG) {
        document.getElementById('x').innerHTML = data.vel.x;
        document.getElementById('y').innerHTML = dat.vel.y;
      }
    }
  };

  if (!window.DeviceMotionEvent) {
    document.innerHtml = 'Sorry, your device does not provide gyro/accelerometer data';
  } else {
    // sign in anonymously
    var rootRef = new Firebase('https://oanda-office-to-logo.firebaseio.com/');
    rootRef.authAnonymously(function(error, authData) {
      if (error) {
        console.error('Firebase login failed!', error);
      } else {
        data.uid = authData.uid;

        // add client to client list
        clientRef = rootRef.child('users/' + data.uid);
        clientRef.set(data);

        strokesRef = rootRef.child('strokes');

        // show your current paint color
        document.body.style.backgroundColor = data.color;

        // listen to acceleration events every second
        window.addEventListener('devicemotion', processDeviceMotion);
      }
    }, { remember: 'sessionOnly' });

    // sign out when closing window
    window.addEventListener('beforeunload', function(event) {
      clientRef.set(null);
      rootRef.unauth();
    });
  }
})();
