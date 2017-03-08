$(document).ready(function() {
  var lastMove = 0;
  //socket connection and events
  var socket = io('http://esp.ananas.life/');
  socket.on('connect', function() {
    console.log("CONNECTED");
  });
  socket.on('started', function() {
    console.log('started');
  });
  socket.on('stopped', function() {
    console.log('stopped');
  })
  socket.on('disconnect', function() {
    console.log("disconnected");
  });

  $("a.forward").click(function() {
    move(600, 600);
  });
  $("a.back").click(function() {
    move(600, -600);
  });
  $("a.left").click(function() {
    move(-600, 600);
  });
  $("a.right").click(function() {
    move(-600, -600);
  });


  $("a.start").click(function() {
    socket.emit("start");
  });
  $("a.stop").click(function() {
    socket.emit("stop");
  });

  //Check for if it's a mobile device or not
  if (window.DeviceMotionEvent) {
    window.addEventListener('devicemotion', deviceMotionHandler, false);
  } else {
    document.getElementById("dmEvent").innerHTML = "Accelerometer not supported."
  }

  document.onkeydown = function detectKey(event) {
    var e = event.keyCode;
    if (e == 87) { //W
      move(1000, 1000);
    }
    if (e == 83) { //S
      move(1000, -1000);
    }
    if (e == 65) { //A
      move(-1000, 1000);
    }
    if (e == 68) { //D
      move(-1000, -1000);
    }
  }

  function move(left, right) {
    var now = Date.now();
    if (lastMove + 200 < now) {
      lastMove = now;
      left=Math.round(left);
      right=Math.round(right);
      var obj = {
        left,
        right
      };
      socket.emit('engines', obj);
    }
  }


  function deviceMotionHandler(eventData) {
    acceleration = eventData.accelerationIncludingGravity;
    var left = 0;
    var right = 0;
    if (Math.abs(acceleration.y) > 1) { // back-/forward
      if (acceleration.y > 0) { // add 300 to decrease dead zone
        left = Math.min(1023, speed + acceleration.x * 40 + 300);
        right = Math.min(1023, speed - acceleration.x * 40 + 300);

      } else {
        left = Math.max(-1023, speed + acceleration.x * 40 - 300);
        right = Math.max(-1023, speed - acceleration.x * 40 - 300);

      }
    } else if (Math.abs(acceleration.x) > 1) { // circle only
      var speed = Math.min(1023, Math.abs(acceleration.x) * 100);
      if (acceleration.x > 0) {
        left = Math.min(1023, speed + 300);
        right = Math.max(-1023, -speed - 300);
      } else {
        left = Math.max(-1023, -speed - 300);
        right = Math.min(1023, speed + 300);
      }
    }
    if (Math.abs(left) > 200 || Math.abs(right) > 200) {
      move(left, right);
    }
    var acc_x = Math.round(acceleration.x);
    var acc_y = Math.round(acceleration.y);
    var acc_z = Math.round(acceleration.z);
    var leftD = Math.round(-left);
    var rightD = Math.round(-right);

    direction = "[" + acc_x + "," + acc_y + "," + acc_z + "]<BR/>" + leftD + ", " + rightD + "<BR/>version: " + version;
    document.getElementById("vector").innerHTML = direction;
  }
});