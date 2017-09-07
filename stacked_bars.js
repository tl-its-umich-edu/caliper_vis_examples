stackedBarChart = [];

var raw = [];

var grouped_data = [{
  key: 'tries',
  values: []
}, {
  key: 'correct',
  values: []
}];


$.getJSON('completed.json', {})
  .done(function(data) {
    raw = data;


    var calculate = function(order) {
      // var grouped_data = [{
      //   key: 'tries',
      //   values: []
      // }, {
      //   key: 'correct',
      //   values: []
      // }];

      grouped_data[0].values = [];
      grouped_data[1].values = [];

      _.each(raw, function(item, i) {
        var corCorrel = _.findWhere(grouped_data[1].values, {
          x: item.actor
        });
        if (!corCorrel) {
          grouped_data[1].values.push({
            series: 1,
            key: 'correct',
            x: item.actor,
            y: 0,
          });
        }
      });

      _.each(raw, function(item, i) {
        //counts
        var tryCorrel = _.findWhere(grouped_data[0].values, {
          x: item.actor
        });

        if (tryCorrel) {
          tryCorrel.y = tryCorrel.y + 1;
        } else {
          grouped_data[0].values.push({
            x: item.actor,
            series: 1,
            key: 'tries',
            y: 1,
          });
        }

        if (item.answerCorrect === 'true') {
          var corCorrel = _.findWhere(grouped_data[1].values, {
            x: item.actor
          });
          if (corCorrel) {
            corCorrel.y = corCorrel.y + 1;
          }
        }
      });
      if (order === 'tries') {
        var new1 = [];
        grouped_data[0].values = _.sortBy(grouped_data[0].values, 'y');
        _.each(grouped_data[0].values, function(item, i) {
          var tryCorrel = _.findWhere(grouped_data[1].values, {
            x: item.x
          });
          if (tryCorrel) {
            new1.push(tryCorrel);
          }
        });
        grouped_data[1].values = new1;
        //update();
      } else {
        grouped_data[0].values = _.sortBy(grouped_data[0].values, 'x');
        grouped_data[1].values = _.sortBy(grouped_data[1].values, 'x');
      }
    };
    calculate('student');
    $('input[type=radio]').change(function() {
      calculate(this.value);
      update();
    });



    var update = function() {
      nv.addGraph({
        generate: function() {
          var width = nv.utils.windowSize().width,
            height = nv.utils.windowSize().height;

          var chart = nv.models.multiBarChart()
            .duration(1000)
            .groupSpacing(0.3)
            .width(width)
            .height(height - 30)
            .stacked(true)
            .staggerLabels(true)
            .reduceXTicks(false);
          chart.yAxis.tickFormat(function(d, i) {
            return Math.round(d);
          });
          var svg = d3.select('#chart svg').datum(grouped_data);

          svg.transition().duration(0).call(chart);

          //chart.dispatch.on('stateChange', function(e) { nv.log('New State:', JSON.stringify(e)); });
          return chart;
        },
        callback: function(graph) {
          nv.utils.windowResize(function() {
            console.log('call');
            var width = nv.utils.windowSize().width;
            var height = nv.utils.windowSize().height - 30;
            graph.width(width).height(height);

            d3.select('#chart svg')
              .attr('width', width)
              .attr('height', height)
              .transition().duration(0)
              .call(graph);

          });
        }
      });
    };
    update();
  });



//
