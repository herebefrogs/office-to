(function() {
  'use strict';

  var DEBUG = false;
  document.getElementById('debug').style.display = DEBUG ? 'block' : 'none';
  var clientRef;
  var data = {
    pressed: false,
    // TODO randomize
    pos: {
      x: 320,
      y: 240
    },
    vel: {
      x: 0,
      y: 0
    }
  };
  var elapsed_time = 0; // in seconds
  var FRAME_RATE = 0.15; // in seconds
  var MAX_DRIFT = 150; // in pixels
  var MAX_HEIGHT; // in pixels
  var MAX_RADIUS = 50; // in pixels
  var MIN_RADIUS = 5; // in pixels
  var MAX_WIDTH; // in pixels
  var previous_time = 0; // in milliseconds
  var strokesRef;
  var uid;
  var VELOCITY_DRAG = 1; // velocity reduction per frame rate

  // max excluded
  var random = function(min, max) {
    return Math.random() * (max - min) + min;
  };
  // max included
  var randomInt = function(min, max) {
    return Math.floor(random(min, max + 1));
  };

  // sign in anonymously
  var rootRef = new Firebase('https://office-to-logo.firebaseio.com/');
  rootRef.authAnonymously(function(error, authData) {
    if (error) {
      console.error('Firebase login failed!', error);
    } else {
      data.uid = authData.uid;

      // load screen size
      rootRef.child('width').once('value', function(snapshot) {
        MAX_WIDTH = snapshot.val();
      });
      rootRef.child('height').once('value', function(snapshot) {
        MAX_HEIGHT = snapshot.val();
      });

      // add client to client list
      clientRef = rootRef.child('users/' + data.uid);
      clientRef.set(data);

      strokesRef = rootRef.child('strokes');
    }
  }, { remember: 'sessionOnly' });

  // sign out when closing window
  window.addEventListener('beforeunload', function(event) {
    clientRef.set(null);
    rootRef.unauth();
  });

  // listen to acceleration events every second
  if (!window.DeviceMotionEvent) {
    // TODO change UI to indicate that
    console.log('you cannot participate');
    document.innerHtml = 'you cannot participate';
  }
  window.addEventListener('devicemotion', function(event) {
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
    if (data.pos.x < 0) data.pos.x = MAX_WIDTH;
    if (data.pos.y < 0) data.pos.y = MAX_HEIGHT;
    if (data.pos.x > MAX_WIDTH) data.pos.x = 0;
    if (data.pos.y > MAX_HEIGHT) data.pos.y = 0;

    if (elapsed_time > FRAME_RATE) {
      // apply drag (or circle never stops)
      data.vel.x = Math.max(0, data.vel.x - VELOCITY_DRAG);
      data.vel.y = Math.max(0, data.vel.y - VELOCITY_DRAG);

      elapsed_time = 0;
      // move client input
      clientRef.set(data);

      // add a new paint stroke
      if (data.vel.y > 1 || data.vel.x > 1) {
        strokesRef.push({
          color: '#f00',
          radius: randomInt(MIN_RADIUS, MAX_RADIUS),
          x: data.pos.x + randomInt(0, MAX_DRIFT),
          y: data.pos.y + randomInt(0, MAX_DRIFT),
        });
      }

      if (DEBUG) {
        document.getElementById('x').innerHTML = data.vel.x;
        document.getElementById('y').innerHTML = dat.vel.y;
      }
    }
  });

  // listen to tap down/up
  var pressCallback = function(e) {
    console.log('press', e);
    data.pressed = true;
    clientRef.set(data);
  };
  var releaseCallback = function(e) {
    console.log('release', e);
    data.pressed = false;
    clientRef.set(data);
  };
  document.addEventListener('mousedown', pressCallback);
  // TODO fix release
  document.addEventListener('click', releaseCallback);
})();
