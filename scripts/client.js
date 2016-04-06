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
    }
  };
  var elapsed_time = 0;
  var FRAME_RATE = 250;
  var previous_accel_x = 0;
  var previous_accel_y = 0;
  var previous_time = 0;
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
    elapsed_time += event.timeStamp - previous_time;
    previous_time = event.timeStamp;
    if (elapsed_time > FRAME_RATE) {
      elapsed_time = 0;

      // this is terrible and doesn't do anything that make sense
      // TODO actually generate acceleration vectors...
      data.pos.x += event.acceleration.x - previous_accel_x;
      data.pos.y += event.acceleration.y - previous_accel_y;
      clientRef.set(data);

      previous_accel_x = event.acceleration.x;
      previous_accel_y = event.acceleration.y;

      if (DEBUG) {
        document.getElementById('x').innerHTML = event.acceleration.x;
        document.getElementById('y').innerHTML = event.acceleration.y;
        document.getElementById('z').innerHTML = event.acceleration.z;
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
