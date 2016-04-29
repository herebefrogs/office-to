var data_accel_x = [  ];
var data_accel_grav_x = [  ];
var data_accel_y = [  ];
var data_accel_grav_y = [  ];
var data_accel_z = [  ];
var data_accel_grav_z = [  ];
var data_rot_x = [  ];
var data_rot_y = [  ];
var data_rot_z = [  ];


var palette = new Rickshaw.Color.Palette();
var time = new Rickshaw.Fixtures.Time();
var seconds = time.unit('second');

var create_chart = function(id_label, data, legend_label, data2, legend_label2) {

  var chart_elt = document.createElement('div');
  chart_elt.id = '#chart_' + id_label;
  document.body.appendChild(chart_elt);
  var legend_elt = document.createElement('div');
  legend_elt.id = '#legend_' + id_label;
  document.body.appendChild(legend_elt);

  var series = [ {
    color: palette.color(),
    data: data,
    name: legend_label
  } ];

  if (data2 && legend_label2) {
    series.push({
      color: palette.color(),
      data: data2,
      name: legend_label2
    });
  }

  var graph = new Rickshaw.Graph( {
    element: chart_elt,
    width: 580,
    height: 200,
    renderer: 'line',
    series: series
  } );

  var legend = new Rickshaw.Graph.Legend({
      graph: graph,
      element: legend_elt
  });

  var axis_t = new Rickshaw.Graph.Axis.Time({
      graph: graph,
      timeUnit: seconds
  });

  var axis_v = new Rickshaw.Graph.Axis.Y({
      graph: graph,
      tickFormat: Rickshaw.Fixtures.Number.formatKMBT
  });

  graph.render();

  return graph;
};

var graph_accel_x = create_chart('accel_x', data_accel_x, 'X acceleration', data_accel_grav_x, 'X acceleration (including gravity)');
var graph_accel_y = create_chart('accel_y', data_accel_y, 'Y acceleration', data_accel_grav_y, 'Y acceleration (including gravity)');
var graph_accel_z = create_chart('accel_z', data_accel_z, 'Z acceleration', data_accel_grav_z, 'Z acceleration (including gravity)');

var graph_rot_x = create_chart('rot_x', data_rot_x, 'X rotation rate');
var graph_rot_y = create_chart('rot_y', data_rot_y, 'Y rotation rate');
var graph_rot_z = create_chart('rot_z', data_rot_z, 'Z rotation rate');

var start_time = Date.now();
var THROTTLE = 10;
var n = 0;

window.addEventListener('devicemotion', function(event) {
  var refresh = 0 === (n++ % THROTTLE);
  var t = (start_time - event.timeStamp) / 1000;

  var process_data = function(value, data) {
    if (value > 1) {
      data.push({ x: t, y: value });
    } else if (refresh) {
      data.push({ x: t, y: 0 });
    }
  };
  process_data(event.acceleration.x, data_accel_x);
  process_data(event.accelerationIncludingGravity.x, data_accel_grav_x);
  process_data(event.acceleration.y, data_accel_y);
  process_data(event.accelerationIncludingGravity.y, data_accel_grav_y);
  process_data(event.acceleration.z, data_accel_z);
  process_data(event.accelerationIncludingGravity.z, data_accel_grav_z);
  process_data(event.rotationRate.beta, data_rot_x);
  process_data(event.rotationRate.gamma, data_rot_y);
  process_data(event.rotationRate.alpha, data_rot_z);

  if (refresh) {
    graph_accel_x.render();
    graph_accel_y.render();
    graph_accel_z.render();
    graph_rot_x.render();
    graph_rot_y.render();
    graph_rot_z.render();
  }
});
