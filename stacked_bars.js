stackedBarChart = [];

var raw = [];

var grouped_data = [{
  key: 'tries',
  values: []
}, {
  key: 'correct',
  values: []
}];

$.getJSON('raw.json', {})
  .done(function(data) {
    raw = data;

    _.each(raw, function(item, i) {
      var corCorrel = _.findWhere(grouped_data[1].values, {
        x: item.actor
      });
      if (!corCorrel) {
        grouped_data[1].values.push({
          series:1,
          key:'correct',
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
          series:1,
          key:'tries',
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

    nv.addGraph({
      generate: function() {
        var width = nv.utils.windowSize().width,
          height = nv.utils.windowSize().height;

        var chart = nv.models.multiBarChart()
          .duration(1000)
          .groupSpacing(0.3)
          .width(width)
          .height(height)
          .stacked(true)
          .staggerLabels(true)
          .reduceXTicks(false);
          chart.yAxis.tickFormat(function(d, i) {
            return Math.round(d);
          });
        var svg = d3.select('#chart svg').datum(grouped_data);

        svg.transition().duration(0).call(chart);

        return chart;
      },
      callback: function(graph) {
        nv.utils.windowResize(function() {
          var width = nv.utils.windowSize().width;
          var height = nv.utils.windowSize().height;
          graph.width(width).height(height  );

          d3.select('#chart svg')
            .attr('width', width)
            .attr('height', height)
            .transition().duration(0)
            .call(graph);

        });
      }
    });


  });



//
