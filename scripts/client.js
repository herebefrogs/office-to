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
  var VELOCITY_DRAG = 5; // velocity reduction per frame rate
  var previous_time = 0; // in milliseconds
  var uid;

  // sign in anonymously
  var rootRef = new Firebase('https://office-to-logo.firebaseio.com/');
  rootRef.authAnonymously(function(error, authData) {
    if (error) {
      console.error('Firebase login failed!', error);
    } else {
      data.uid = authData.uid;

      clientRef = rootRef.child('users/' + data.uid);
      clientRef.set(data);
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
    data.pos.x += data.vel.x * delta_time + -event.acceleration.x * delta_time * delta_time;
    data.pos.y += data.vel.y * delta_time + event.acceleration.y * delta_time * delta_time;
*/
    data.pos.x += data.vel.x;
    data.pos.y += data.vel.y;

    if (elapsed_time > FRAME_RATE) {
      // apply drag (or circle never stops)
      data.vel.x = Math.max(0, data.vel.x - VELOCITY_DRAG);
      data.vel.y = Math.max(0, data.vel.y - VELOCITY_DRAG);

      elapsed_time = 0;
      clientRef.set(data);

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
