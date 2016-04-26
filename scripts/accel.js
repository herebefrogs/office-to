var x_data = [  ];
var y_data = [  ];
var z_data = [  ];

var palette = new Rickshaw.Color.Palette();
var graph = new Rickshaw.Graph( {
        element: document.querySelector("#chart"),
        width: 580,
        height: 250,
        renderer: 'line',
        series: [ {
                color: palette.color(),
                data: x_data,
                name: 'X acceleration'
              }, {
                color: palette.color(),
                data: z_data,
                name: 'Y acceleration'
              }, {
                color: palette.color(),
                data: z_data,
                name: 'Z acceleration'
        } ]
} );

var legend = new Rickshaw.Graph.Legend({
    graph: graph,
    element: document.querySelector('#legend')
});

var time = new Rickshaw.Fixtures.Time();
var seconds = time.unit('second');

var xAxis = new Rickshaw.Graph.Axis.Time({
    graph: graph,
    timeUnit: seconds
});

var yAxis = new Rickshaw.Graph.Axis.Y({
    graph: graph,
    tickFormat: Rickshaw.Fixtures.Number.formatKMBT
});

graph.render();

var start_time = Date.now();

var THROTTLE = 10;
var n = 0;

window.addEventListener('devicemotion', function(event) {
  var refresh = 0 === (n++ % THROTTLE);
  var t = (start_time - event.timeStamp) / 1000;
  var x = event.acceleration.x;
  var y = event.acceleration.y;
  var z = event.acceleration.z;

  if (x > 1) {
    x_data.push({ x: t, y: x });
  } else if (refresh) {
    x_data.push({ x: t, y: 0 });
  }
  if (y > 1) {
    y_data.push({ x: t, y: y });
  } else if (refresh) {
    y_data.push({ x: t, y: 0 });
  }
  if (z > 1) {
    z_data.push({ x: t, y: z });
  } else if (refresh) {
    z_data.push({ x: t, y: 0 });
  }

  if (refresh) {
    graph.render();
  }
});
