$.getJSON('all_anon_compacted.json', {})
  .done(function(data) {


    historicalBarChart = [{
      values: []
    }];


    raw = data;

    
    var actions = _.pluck(raw, 'action');
    var actions_uniq = _.uniq(_.pluck(raw, 'action'));
    var result = _.map(actions_uniq, function(action) {
      var length = _.reject(actions, function(el) {
        return (el.indexOf(action) < 0);
      }).length;
      return {
        id: action,
        count: length
      };
    });

    historicalBarChart[0].values = result;
    update();
    function update() {
      nv.addGraph(function() {
        var chart = nv.models.discreteBarChart()
          .x(function(d) {
            return d.id;
          })
          .y(function(d) {
            return d.count;
          })
          .margin({
            "top": 10,
            "bottom": 200
          })
          .showValues(false)
          .duration(250);
        chart.xAxis.rotateLabels(-45);
        chart.yAxis.tickFormat(function(d, i) {
          return Math.round(d);
        });


        d3.select('#chart svg')
          .datum(historicalBarChart)
          .call(chart);

        nv.utils.windowResize(chart.update);
        return chart;
      });
    }

  });
