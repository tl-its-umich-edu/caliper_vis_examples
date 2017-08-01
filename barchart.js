historicalBarChart = [{
  values: []
}];
var raw = [];
var mode = 'num';

$.getJSON('raw.json', {})
  .done(function(data) {
    raw = data;
    $('#user_counts').trigger("click");
  });

var userCounts = [];
var timeCalc = false;

$('.btn').on('click', function(e){
  $(".btn-group button").each(function() {
    $(this).attr('disabled',false).attr('class','btn-default btn');
  });
  $(this).attr('disabled',true).attr('class','btn-primary btn');
});


$('#user_time_spent').on('click', function(e) {
  mode = 'time';
  $('#headLine').text('Average time spent on item by student');
  $('#code').text('x: students, y: average time per question');
  historicalBarChart[0].values = [];

  _.each(raw, function(item, i) {
    if (!timeCalc) {
      var duration = raw[i].time;
      raw[i].time = moment.duration(duration, moment.ISO_8601).asSeconds();
    }
    var corr = _.findWhere(historicalBarChart[0].values, {
      label: item.actor
    });

    if (corr) {
      corr.value = corr.value + item.time;
    } else {
      historicalBarChart[0].values.push({
        label: item.actor,
        value: item.time
      });
    }
  });

  _.each(historicalBarChart[0].values, function(item, i) {
    timeCalc = true;
    var corr = _.findWhere(userCounts, {
      label: item.label
    });
    if (corr) {
      historicalBarChart[0].values[i].value = Math.round(item.value / corr.value);
    }
  });


  update();
});




$('#user_correct').on('click', function(e) {
  mode = 'percent';
  $('#headLine').text('Percent correct answers by student');
  $('#code').text('x: students, y: % correct');
  historicalBarChart[0].values = [];
  _.each(raw, function(item) {
    if (item.answerCorrect === 'true') {
      var corr = _.findWhere(historicalBarChart[0].values, {
        label: item.actor
      });
      if (corr) {
        corr.value = corr.value + 1;
      } else {
        historicalBarChart[0].values.push({
          label: item.actor,
          value: 1
        });
      }
    }
  });

  _.each(historicalBarChart[0].values, function(item) {

    var corr = _.findWhere(userCounts, {
      label: item.label
    });
    if (corr) {
      item.value = item.value / corr.value * 100;
    }
  });
  update();
});

$('#user_counts').on('click', function(e) {
  mode = 'num';
  historicalBarChart[0].values = [];
  userCounts = [];
  $('#headLine').text('Questions answered by student');
  $('#code').text('x: students, y: questions answered');
  _.each(raw, function(item) {
    var corr = _.findWhere(historicalBarChart[0].values, {
      label: item.actor
    });
    var corrCountIndx = _.findIndex(userCounts, {
      label: item.actor
    });
    if (corr) {
      corr.value = corr.value + 1;
    } else {
      historicalBarChart[0].values.push({
        label: item.actor,
        value: 1
      });
    }

    if (corrCountIndx !== -1) {
      userCounts[corrCountIndx].value = userCounts[corrCountIndx].value + 1;
    } else {
      userCounts.push({
        label: item.actor,
        value: 1
      });
    }
  });
  update();
});


$('#pop_sets').on('click', function(e) {
  mode = 'num';
  historicalBarChart[0].values = [];
  //userCounts = [];
  $('#headLine').text('Popular sets');
  $('#code').text('x: problem sets, y:questions answered');
  _.each(raw, function(item) {
    var corr = _.findWhere(historicalBarChart[0].values, {
      label: item.problem_set
    });
    if (corr) {
      corr.value = corr.value + 1;
    } else {
      historicalBarChart[0].values.push({
        label: item.problem_set,
        value: 1
      });
    }
  });
  update();
});


$('#inc_sets').on('click', function(e) {
  mode = 'percent';
  historicalBarChart[0].values = [];
  $('#headLine').text('Incorrect per set');
  $('#code').text('x: problem sets, y: % questions answered incorrectly');

  var sets = _.uniq(_.pluck(raw,'problem_set'));

  var set_objects = [];

  _.each(sets, function(set_item){
    set_objects.push({set:set_item,count:0});
  });


  _.each(raw, function(item) {
    var corr_count = _.findWhere(set_objects, {
      set: item.problem_set
    });
    corr_count.count=corr_count.count +1;
    var corr = _.findWhere(historicalBarChart[0].values, {
      label: item.problem_set
    });
    if (corr) {
      if (item.answerCorrect !=='true'){
        corr.value = corr.value + 1;
      }
    } else {
      historicalBarChart[0].values.push({
        label: item.problem_set,
        value: item.answerCorrect!=='true'?1:0
      });
    }
  });

  _.each(historicalBarChart[0].values, function(item){
    var corr_count = _.findWhere(set_objects, {
      set: item.label
    });
    item.value = item.value/corr_count.count * 100;
  });

  update();
});

$('#totals_course').on('click', function(e) {
  mode = 'num';
  historicalBarChart[0].values = [];
  $('#headLine').text('Course total answers');
  $('#code').text('x: courses, y: questions answered');
  var courses = _.uniq(_.map(raw, function(item){ return  item.class; }));
  var coursesSorted = _.sortBy(courses, function(course) {
    return course;
  });
  var coursesObject = _.map(coursesSorted, function(course, i){ return  {'label':course, 'value':0}; });

  _.each(raw, function(item) {
    var thisCourseIndex = _.indexOf(coursesSorted, item.class);
    if(thisCourseIndex !==-1){
      coursesObject[thisCourseIndex].value= coursesObject[thisCourseIndex].value + 1;
    }
  });
  historicalBarChart[0].values = coursesObject;
  update();
});


$('#corr_sets').on('click', function(e) {
  mode = 'percent';
  historicalBarChart[0].values = [];
  //userCounts = [];
  $('#headLine').text('Incorrect per set');
  $('#code').text('x: problem sets, y: % questions answered correctly');
  var sets = _.uniq(_.pluck(raw,'problem_set'));

  var set_objects = [];

  _.each(sets, function(set_item){
    set_objects.push({set:set_item,count:0});
  });


  _.each(raw, function(item) {
    var corr_count = _.findWhere(set_objects, {
      set: item.problem_set
    });
    corr_count.count=corr_count.count +1;
    var corr = _.findWhere(historicalBarChart[0].values, {
      label: item.problem_set
    });
    if (corr) {
      if (item.answerCorrect ==='true'){
        corr.value = corr.value + 1;
      }
    } else {
      historicalBarChart[0].values.push({
        label: item.problem_set,
        value: item.answerCorrect==='true'?1:0
      });
    }
  });

  _.each(historicalBarChart[0].values, function(item){
    var corr_count = _.findWhere(set_objects, {
      set: item.label
    });
    item.value = item.value/corr_count.count * 100;
  });

  update();
});



function update() {
  historicalBarChart[0].values = _.sortBy(historicalBarChart[0].values, 'label');
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

    chart.xAxis.tickFormat(function(d, i) {
      return d;
    });

    chart.yAxis.tickFormat(function(d, i) {
      if(mode ==='num'){
        return Math.round(d);
      }
      if (mode ==='percent') {
        return d + ' %'
      }
      if (mode ==='time') {
        return d + ' s'
      }

    });
    d3.select('#chart1 svg')
      .datum(historicalBarChart)
      .call(chart);

    nv.utils.windowResize(chart.update);
    return chart;
  });


}
