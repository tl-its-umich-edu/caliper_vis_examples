var raw = [];

$.getJSON('raw.json', {})
  .done(function(data) {
    raw = data;
    var days = _.uniq(_.map(raw, function(item){ return  moment(item.end).format('dddd M/D'); }));
    var daysSorted = _.sortBy(days, function(day) {
      return day;
    });
    var daysObject = _.map(daysSorted, function(day, i){ return  {'label':day, 'value':0}; });

    _.each(raw, function(item) {
      var thisDay = moment(item.end).format('dddd M/D');
      var thisDayIndex = _.indexOf(days, thisDay);
      if(thisDayIndex !==-1){
        daysObject[thisDayIndex].value= daysObject[thisDayIndex].value + 1;
      }
    });

    var daysObjectNVD3 = [{
      key:'Some key',
      values: daysObject
    }];

    nv.addGraph(function() {
      var chart = nv.models.discreteBarChart()
        .x(function(d) {
          return d.label;
        })
        .y(function(d) {
          return d.value;
        })
        .showValues(false)
        .duration(250);
      chart.xAxis.rotateLabels(-45);
      chart.yAxis.tickFormat(function(d, i) {
        return Math.round(d);
      });


      d3.select('#chart svg')
        .datum(daysObjectNVD3)
        .call(chart);

      nv.utils.windowResize(chart.update);
      return chart;
    });
  });
