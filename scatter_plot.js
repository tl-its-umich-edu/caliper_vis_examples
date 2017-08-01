$('.btn').on('click', function(e){
  $(".btn-group button").each(function() {
    $(this).attr('disabled',false).attr('class','btn-default btn');
  });
  $(this).attr('disabled',true).attr('class','btn-primary btn');
});

var mode = 1;

var raw = [];
var userCounts = [];
$.getJSON('raw.json', {})
  .done(function(data) {
    raw = data;
    $('#p1').trigger("click");
  });

$('#p1').on('click', function(e) {
  mode = 1;
  var userCounts = [{
    'key': 'x:t, y:i/t',
    'values': []
  }];
  $('#code').text('x: total tries, y: incorrect/total tries');
  _.each(raw, function(item) {
    var corr = _.findWhere(userCounts[0].values, {
      actor: item.actor
    });
    if (corr) {
      corr.x = corr.x + 1;
      if (item.answerCorrect === "true") {
        corr.y = corr.y + 1;
      }
    } else {
      userCounts[0].values.push({
        actor: item.actor,
        x: 1,
        y: item.answerCorrect ? 1 : 0
      });
    }
  });

  _.each(userCounts[0].values, function(item, i) {
    item.y = item.x - (item.x - (item.y / item.x));
    item.x = item.x;
  });

  update(userCounts);
});

$('#p2').on('click', function(e) {
  mode = 2;
  var userCounts = [{
    'key': 'x:t,y:i',
    'values': []
  }];
  $('#code').text('x: total tries, y: incorrects');
  _.each(raw, function(item) {
    var corr = _.findWhere(userCounts[0].values, {
      actor: item.actor
    });
    if (corr) {
      corr.x = corr.x + 1;
      if (item.answerCorrect === "false") {
        corr.y = corr.y + 1;
      }
    } else {
      userCounts[0].values.push({
        actor: item.actor,
        x: 1,
        y: item.answerCorrect ? 1 : 0
      });
    }
  });
  update(userCounts);
});


function update(userCounts) {
  var color;
  if(userCounts[0].key==='x:t, y:i/t'){
    color = ['#f4b632'];
  }
  else {
    color = ['#798ce4'];
  }

  var chart;
  nv.addGraph(function() {
    chart = nv.models.scatterChart()
      //.showDistX(true)
      //.showDistY(true)
      .useVoronoi(true)
      .pointShape('circle')
      .showLegend(false)
      .color(color)
      .pointRange([100, 100])
      .duration(300);
    chart.dispatch.on('renderEnd', function() {
      console.log('render complete');
    });


    chart.xAxis.tickFormat(function(d, i) {
      return Math.round(d);
    });

    if (mode ===1){
      chart.yAxis.tickFormat(d3.format('.02f'));
    } else {
      chart.yAxis.tickFormat(function(d, i) {
        return Math.round(d);
      });

    }

    d3.select('#chart svg')
      .datum(userCounts)
      .call(chart);

    nv.utils.windowResize(chart.update);

    return chart;
  });
}
