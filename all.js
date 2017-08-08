$.getJSON('all_anon_compacted.json', {})
  .done(function(data) {

    $('.btn').on('click', function(e){
      $(".btn-group button").each(function() {
        $(this).attr('disabled',false).attr('class','btn-default btn');
      });
      $(this).attr('disabled',true).attr('class','btn-primary btn');
    });

    $('#actions').on('click', function(e) {

      bar_chart = [{
        values: []
      }];
      var actions = _.pluck(data, 'action');
      var actions_uniq = _.uniq(_.pluck(data, 'action'));
      var result = _.map(actions_uniq, function(action) {
        var length = _.reject(actions, function(el) {
          return (el.indexOf(action) < 0);
        }).length;
        return {
          id: action,
          count: length
        };
      });
      bar_chart[0].values = result;
      updateBarChart();
    });

    $('#assigItems').on('click', function(e) {
      d3.selectAll("svg > *").remove();
      var grouped_data = [];
      var actions_uniq = _.uniq(_.pluck(data, 'action'));
      _.each(actions_uniq, function(action,i){
        grouped_data.push({
          key:action,
          values:[]
        });
      });
      _.each(data, function(item,i) {
        console.log(item);
        // some events are not course related
        // i.e. class=null
        var theClass='';
        if(item.class !==null){
          theClass=item.class;
        } else {
          theClass='Not course related';
        }
        var theKey = _.findWhere(grouped_data, {key: item.action});
        var theItem = _.findWhere(theKey.values, {x: theClass});
        if(theItem) {
          theItem.y = theItem.y + 1;
        }
        else {
          theKey.values.push({
            x:theClass,
            y:0,
            series:item.action
          });
        }
      });
      updatedMultiBarChart(grouped_data);
    });

    $('#actions').trigger("click");

    // different visualizations

    function updatedMultiBarChart(grouped_data){
      d3.selectAll("svg > *").remove();
      nv.addGraph(function() {
          var chart = nv.models.multiBarChart()
            .reduceXTicks(false)
            .rotateLabels(-35)
            .showControls(false)
            .groupSpacing(0.1)
          ;
            chart.yAxis.tickFormat(function(d, i) {
              return Math.round(d);
            });
          d3.select('#chart svg')
              .datum(grouped_data)
              .call(chart);

          nv.utils.windowResize(chart.update);
          return chart;
      });
    }

    function updateBarChart() {
      d3.selectAll("svg > *").remove();
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
            "bottom": 150,
            "left":100
          })
          .showValues(false)
          .duration(250);
        chart.xAxis.rotateLabels(-45);
        chart.yAxis.tickFormat(function(d, i) {
          return Math.round(d);
        });


        d3.select('#chart svg')
          .datum(bar_chart)
          .call(chart);

        nv.utils.windowResize(chart.update);
        return chart;
      });
    }

  });
