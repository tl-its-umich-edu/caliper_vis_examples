var raw = [];

$.getJSON('raw.json', {})
  .done(function(data) {
    raw = data;

    var problem_sets = [];

    _.each(raw, function(item) {
      var corr = _.findWhere(problem_sets, {
        label: item.problem_set
      });
      if (corr) {
        corr.value = corr.value + 1;
      } else {
        problem_sets.push({
          label:item.problem_set,
          value: 1,
        });
      }
    });
    problem_sets_core = _.sortBy(problem_sets, 'label');
    problem_sets = _.sortBy(problem_sets, 'label');


    var updatePie = function(){
      var chart;
      //Donut chart example
      nv.addGraph(function() {
        chart = nv.models.pieChart()
            .x(function(d) { return d.label })
            .y(function(d) { return d.value })
            .showLabels(true)
            .labelThreshold(0.05)
            .labelType("percent")
            .donut(true)
            .donutRatio(0.35);

          d3.select("#chart svg")
              .datum(problem_sets)
              .transition().duration(350)
              .call(chart);


          nv.utils.windowResize(chart.update);
          return chart;
      });
    };


        updatePie();

        $('input[type=radio]').change(function() {
          if(this.value ==='tenmost'){
            problem_sets = _.first(_.sortBy(problem_sets_core, 'value').reverse(), 10);
          } else if (this.value ==='tenleast'){
            problem_sets = _.first(_.sortBy(problem_sets_core, 'value'), 10);
          } else {
            problem_sets = problem_sets_core;
          }
          updatePie();
        });




  });
