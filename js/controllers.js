visApp.controller('c1', ['$scope', 'Fetch', function($scope, Fetch) {
  $scope.options = {
    chart: {
      type: 'discreteBarChart',
      height: 450,
      margin: {
        top: 20,
        right: 20,
        bottom: 50,
        left: 55
      },
      x: function(d) {
        return d.label;
      },
      y: function(d) {
        return d.value;
      },
      showValues: false,
      duration: 500,
      xAxis: {
        axisLabel: 'Students'
      },
      yAxis: {
        axisLabel: 'Questions Answered',
        axisLabelDistance: -10,
        tickFormat: function(d) {
          return d;
        }
      }
    },
    title: {
      enable: true,
      text: 'Answers by students'
    },
    subtitle: {
      enable: true,
      html: '<code>x: students, y: total answers</code>'
    }
  };
  $scope.data = [];

  Fetch.getData('raw.json').then(function(result) {
    $scope.raw = result.data;
    $scope.data = transFormUserCounts(result.data);
  });

  $scope.userCorrect = function() {
    $scope.options.chart.yAxis.axisLabel = '% correct';
    $scope.options.chart.xAxis.axisLabel = 'Students';
    $scope.options.title = {
      enable: true,
      text: 'Percent correct by student'
    };
    $scope.options.subtitle = {
      enable: true,
      html: '<code>x: students, y: total correct answers</code>'
    };
    $scope.options.chart.yAxis.tickFormat = function(d) {
      return d + ' %';
    };
    $scope.data = transFormPercentCorrect($scope.raw);
  };

  $scope.userCounts = function() {
    $scope.options.chart.yAxis.axisLabel = 'Questions Answered';
    $scope.options.chart.xAxis.axisLabel = 'Students';
    $scope.options.chart.yAxis.tickFormat = function(d) {
      return d;
    };
    $scope.options.title = {
      enable: true,
      text: 'Answers by student'
    };
    $scope.options.subtitle = {
      enable: true,
      html: '<code>x: students, y: total answers</code>'
    };
    $scope.data = transFormUserCounts($scope.raw);
  };

  $scope.timeSpent = function() {
    $scope.options.chart.yAxis.axisLabel = 'Average Time Spent';
    $scope.options.chart.xAxis.axisLabel = 'Students';
    $scope.options.chart.yAxis.tickFormat = function(d) {
      return d + ' s';
    };
    $scope.options.title = {
      enable: true,
      text: 'Average time spent on answers by  student'
    };
    $scope.options.subtitle = {
      enable: true,
      html: '<code>x: students, y: average time spent on question</code>'
    };
    $scope.data = transFormTimeSpent($scope.raw);
  };

  $scope.setUse = function() {
    $scope.options.chart.yAxis.axisLabel = 'Questions answered';
    $scope.options.chart.xAxis.axisLabel = 'Sets';
    $scope.options.chart.xAxis.rotateLabels = -45;
    $scope.options.chart.yAxis.tickFormat = function(d) {
      return d;
    };
    $scope.options.title = {
      enable: true,
      text: 'Number of questions answered by set'
    };
    $scope.options.subtitle = {
      enable: true,
      html: '<code>x: sets, y: number of questions completed</code>'
    };
    $scope.data = transFormSetUse($scope.raw);
  };

  $scope.incorrectPerSet = function(){
    $scope.options.chart.yAxis.axisLabel = 'Incorrect answers';
    $scope.options.chart.xAxis.axisLabel = 'Sets';
    $scope.options.chart.xAxis.rotateLabels = -45;
    $scope.options.chart.yAxis.tickFormat = function(d) {
      return d;
    };
    $scope.options.title = {
      enable: true,
      text: 'Number of incorrect questions answered by set'
    };
    $scope.options.subtitle = {
      enable: true,
      html: '<code>x: sets, y: number of questions completed: incorrect answers</code>'
    };
    $scope.data = transFormIncorrectPerSet($scope.raw);
  };


    $scope.correctPerSet = function(){
      $scope.options.chart.yAxis.axisLabel = 'Correct answers';
      $scope.options.chart.xAxis.axisLabel = 'Sets';
      $scope.options.chart.xAxis.rotateLabels = -45;
      $scope.options.chart.yAxis.tickFormat = function(d) {
        return d;
      };
      $scope.options.title = {
        enable: true,
        text: 'Number of correct questions answered by set'
      };
      $scope.options.subtitle = {
        enable: true,
        html: '<code>x: sets, y: number of questions completed: correct answers</code>'
      };
      $scope.data = transFormCorrectPerSet($scope.raw);
    };

    $scope.courseTotals = function(){
      $scope.options.chart.yAxis.axisLabel = 'Answers attempted';
      $scope.options.chart.xAxis.axisLabel = 'Courses';
      $scope.options.chart.xAxis.rotateLabels = -45;
      $scope.options.chart.yAxis.tickFormat = function(d) {
        return d;
      };
      $scope.options.title = {
        enable: true,
        text: 'Number of questions answered by course'
      };
      $scope.options.subtitle = {
        enable: true,
        html: '<code>x: courses, y: number of questions completed</code>'
      };
      $scope.data = transFormCourseTotals($scope.raw);
    };
}]);

var transFormCourseTotals = function(data){
  returnData = [{
    key: "Cumulative Return",
    values: []
  }];

  var coursesSorted = _.sortBy(_.uniq(_.pluck(data,'class')), function(course) {
    return course;
  });

  _.each(coursesSorted, function(course){
    returnData[0].values.push({label:course, value:0});
  });

  _.each(data, function(item) {
    var corr = _.findWhere(returnData[0].values, {
      label: item.class
    });
    corr.value = corr.value + 1;
  });
  return returnData;

};

var transFormCorrectPerSet = function(data){
  returnData = [{
    key: "Cumulative Return",
    values: []
  }];

  var sets = _.uniq(_.pluck(data,'problem_set'));

  _.each(sets, function(set_item){
    returnData[0].values.push({label:set_item, value:0});
  });

  _.each(data, function(item) {
    var corr = _.findWhere(returnData[0].values, {
      label: item.problem_set
    });
    if (corr) {
      if (item.answerCorrect ==='true'){
        corr.value = corr.value + 1;
      }
    } else {
      returnData[0].values.push({
        label: item.problem_set,
        value: item.answerCorrect === 'true' ? 1 : 0
      });
    }
  });
  return returnData;
};


var transFormIncorrectPerSet = function(data){
  returnData = [{
    key: "Cumulative Return",
    values: []
  }];

  var sets = _.uniq(_.pluck(data,'problem_set'));

  var set_objects = [];

  _.each(sets, function(set_item){
    returnData[0].values.push({label:set_item, value:0});
  });

  _.each(data, function(item) {
    var corr = _.findWhere(returnData[0].values, {
      label: item.problem_set
    });
    if (corr) {
      if (item.answerCorrect !=='true'){
        corr.value = corr.value + 1;
      }
    } else {
      returnData[0].values.push({
        label: item.problem_set,
        value: item.answerCorrect!=='true'?1:0
      });
    }
  });
  return returnData;
};

var transFormSetUse = function(data) {
  returnData = [{
    key: "Cumulative Return",
    values: []
  }];
  _.each(raw, function(item) {
    var corr = _.findWhere(returnData[0].values, {
      label: item.problem_set
    });
    if (corr) {
      corr.value = corr.value + 1;
    } else {
      returnData[0].values.push({
        label: item.problem_set,
        value: 1
      });
    }
  });

  return returnData;

};


var transFormPercentCorrect = function(data) {
  var returnData = [{
    key: "Cumulative Return",
    values: []
  }];
  _.each(data, function(item) {
    if (item.answerCorrect === 'true') {
      var corr = _.findWhere(returnData[0].values, {
        label: item.actor
      });
      if (corr) {
        corr.value = corr.value + 1;
      } else {
        returnData[0].values.push({
          label: item.actor,
          value: 1
        });
      }
    }
  });
  return returnData;
};


var transFormUserCounts = function(data) {
  returnData = [{
    key: "Cumulative Return",
    values: []
  }];
  _.each(data, function(item) {
    var corr = _.findWhere(returnData[0].values, {
      label: item.actor
    });
    if (corr) {
      corr.value = corr.value + 1;
    } else {
      returnData[0].values.push({
        label: item.actor,
        value: 1
      });
    }
  });
  return returnData;
};

var transFormTimeSpent = function(data) {
  var returnData = [{
    key: "Cumulative Return",
    values: []
  }];


  _.each(data, function(item, i) {
    var duration = data[i].time;
    var thisTime = moment.duration(duration, moment.ISO_8601).asSeconds();
    var corr = _.findWhere(returnData[0].values, {
      label: item.actor
    });

    if (corr) {
      corr.value = corr.value + thisTime;
      corr.total = corr.total + 1;
    } else {
      returnData[0].values.push({
        label: item.actor,
        value: thisTime,
        total: 1
      });
    }
  });

  _.each(returnData[0].values, function(item, i) {
    returnData[0].values[i].value = Math.round(item.value / item.total);
    delete returnData[0].values[i].total;
  });

  return returnData;
};