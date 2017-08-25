visApp.controller('c1', ['$scope', '$log', 'Fetch', function($scope, $log, Fetch) {
  $scope.data = [];
  $scope.courseFilterEnabled = true;

  Fetch.getData('raw.json').then(function(result) {
    $scope.raw = result.data;
    $scope.courses = _.uniq(
      _.map(
        $scope.raw,
        function(item) {
          return item.class;
        }
      )
    );
    $scope.courses.unshift('All Courses');
    $scope.courses_filter = $scope.courses[0];
    $scope.lastUsed = 'userCorrect';
    $scope.data = transFormUserCounts(result.data, $scope.courses_filter);
  });


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

  $scope.updateCourseFilter = function() {
    $log.warn($scope.lastUsed + ' ' + $scope.courses_filter);
    switch ($scope.lastUsed) {
      case 'userCorrect':
        $scope.userCorrect();
        break;
      case 'userCounts':
        $scope.userCounts();
        break;
      case 'setUse':
        $scope.setUse();
        break;
      case 'timeSpent':
        $scope.timeSpent();
        break;
      case 'incorrectPerSet':
        $scope.incorrectPerSet();
        break;
      case 'correctPerSet':
        $scope.correctPerSet();
        break;
      case 'courseTotals':
        $scope.courseTotals();
        break;
      case 'correctByQuestion':
        $scope.correctByQuestion();
        break;

    }
  };

  $scope.userCorrect = function() {
    $scope.courseFilterEnabled = true;
    $scope.lastUsed = 'userCorrect';
    $scope.options.chart.yAxis.axisLabel = '% correct';
    $scope.options.chart.xAxis.axisLabel = 'Students';
    $scope.options.title = {
      enable: true,
      text: 'Percent correct by student'
    };
    $scope.options.subtitle = {
      enable: true,
      html: '<code>x: students, y: % correct answers</code>'
    };
    $scope.options.chart.yAxis.tickFormat = function(d) {
      return d + ' %';
    };
    $scope.data = transFormPercentCorrect($scope.raw, $scope.courses_filter);
  };


$scope.correctByQuestion = function() {

  $scope.courseFilterEnabled = true;
  $scope.lastUsed = 'correctByQuestion';
  $scope.options.chart.yAxis.axisLabel = '% correct';
  $scope.options.chart.xAxis.axisLabel = 'Problems';
  $scope.options.chart.xAxis.rotateLabels = -45;
  $scope.options.title = {
    enable: true,
    text: '% of correct answers to problems'
  };
  $scope.options.subtitle = {
    enable: true,
    html: '<code>x: problems, y: %correct answers</code>'
  };
  $scope.options.chart.yAxis.tickFormat = function(d) {
    return d;
  };
  $scope.data = transFormcorrectByQuestion($scope.raw, $scope.courses_filter);
};




  $scope.userCounts = function() {
    $scope.courseFilterEnabled = true;
    $scope.lastUsed = 'userCounts';
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
    $scope.data = transFormUserCounts($scope.raw, $scope.courses_filter);
  };




  $scope.timeSpent = function() {
    $scope.courseFilterEnabled = true;
    $scope.lastUsed = 'timeSpent';
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
    $scope.data = transFormTimeSpent($scope.raw, $scope.courses_filter);
  };

  $scope.setUse = function() {
    $scope.courseFilterEnabled = true;
    $scope.lastUsed = 'setUse';
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
    $scope.data = transFormSetUse($scope.raw, $scope.courses_filter);
  };

  $scope.incorrectPerSet = function() {
    $scope.courseFilterEnabled = true;
    $scope.lastUsed = 'incorrectPerSet';
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
    $scope.data = transFormIncorrectPerSet($scope.raw, $scope.courses_filter);
  };


  $scope.correctPerSet = function() {
    $scope.courseFilterEnabled = true;
    $scope.lastUsed = 'correctPerSet';
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
    $scope.data = transFormCorrectPerSet($scope.raw, $scope.courses_filter);
  };

  $scope.courseTotals = function() {
    $scope.courseFilterEnabled = false;
    $scope.lastUsed = 'correctPerSet';
    $scope.courses_filter = $scope.courses[0];
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
    $scope.data = transFormCourseTotals($scope.raw, $scope.courses_filter);
  };
}]);

var transFormCourseTotals = function(data) {
  returnData = [{
    key: "Cumulative Return",
    values: []
  }];

  var coursesSorted = _.sortBy(_.uniq(_.pluck(data, 'class')), function(course) {
    return course;
  });

  _.each(coursesSorted, function(course) {
    returnData[0].values.push({
      label: course,
      value: 0
    });
  });

  _.each(data, function(item) {
    var corr = _.findWhere(returnData[0].values, {
      label: item.class
    });
    corr.value = corr.value + 1;
  });
  return returnData;

};
var transFormcorrectByQuestion = function(data, courseFilter) {
    data = filterData(data, courseFilter);
    returnData = [{
      key: "Cumulative Return",
      values: []
    }];

    var problems = _.uniq(_.pluck(data, 'problem'));

    _.each(problems, function(set_item) {
      returnData[0].values.push({
        label: set_item,
        value: 0,
        num:0
      });
    });

    _.each(data, function(item) {
      var corr = _.findWhere(returnData[0].values, {
        label: item.problem
      });
      if (corr) {
        if (item.answerCorrect === 'true') {
          corr.value = corr.value + 1;
        }
        corr.num = corr.num + 1;
      } else {
        returnData[0].values.push({
          label: item.problem,
          value: item.answerCorrect === 'true' ? 1 : 0,
          num: 1
        });
      }
    });
    _.each(returnData[0].values, function(item) {
      item.value = Math.round(item.value/item.num * 100);
    });
    return returnData;
};

var transFormCorrectPerSet = function(data, courseFilter) {
  data = filterData(data, courseFilter);
  returnData = [{
    key: "Cumulative Return",
    values: []
  }];

  var sets = _.uniq(_.pluck(data, 'problem_set'));

  _.each(sets, function(set_item) {
    returnData[0].values.push({
      label: set_item,
      value: 0
    });
  });

  _.each(data, function(item) {
    var corr = _.findWhere(returnData[0].values, {
      label: item.problem_set
    });
    if (corr) {
      if (item.answerCorrect === 'true') {
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


var transFormIncorrectPerSet = function(data, courseFilter) {
  data = filterData(data, courseFilter);
  returnData = [{
    key: "Cumulative Return",
    values: []
  }];

  var sets = _.uniq(_.pluck(data, 'problem_set'));

  var set_objects = [];

  _.each(sets, function(set_item) {
    returnData[0].values.push({
      label: set_item,
      value: 0
    });
  });

  _.each(data, function(item) {
    var corr = _.findWhere(returnData[0].values, {
      label: item.problem_set
    });
    if (corr) {
      if (item.answerCorrect !== 'true') {
        corr.value = corr.value + 1;
      }
    } else {
      returnData[0].values.push({
        label: item.problem_set,
        value: item.answerCorrect !== 'true' ? 1 : 0
      });
    }
  });
  return returnData;
};

var transFormSetUse = function(data, courseFilter) {
  data = filterData(data, courseFilter);
  returnData = [{
    key: "Cumulative Return",
    values: []
  }];
  _.each(data, function(item) {
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


var transFormPercentCorrect = function(data, courseFilter) {
  data = filterData(data, courseFilter);

  var returnData = [{
    key: "Cumulative Return",
    values: []
  }];
  _.each(data, function(item) {
      var corr = _.findWhere(returnData[0].values, {
        label: item.actor
      });
      if (corr) {
        if (item.answerCorrect === 'true') {
          corr.value = corr.value + 1;
        }
        corr.total = corr.total + 1;
      } else {
        returnData[0].values.push({
          label: item.actor,
          value: item.answerCorrect === 'true'?1:0,
          total:1
        });
      }

  });
  _.each(returnData[0].values, function(item){
    item.value = item.value/item.total * 100;
  });

  return returnData;
};

var filterData = function(data, courseFilter) {
  if (courseFilter !== 'All Courses') {
    data = _.where(data, {
      class: courseFilter
    });
  } else {
    data = data;
  }
  return data;
}


var transFormUserCounts = function(data, courseFilter) {
  data = filterData(data, courseFilter);
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

var transFormTimeSpent = function(data, courseFilter) {
  data = filterData(data, courseFilter);
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
      corr.num = corr.num + 1;
    } else {
      returnData[0].values.push({
        label: item.actor,
        value: thisTime,
        num: 1
      });
    }
  });
  _.each(returnData[0].values, function(item, i) {
    returnData[0].values[i].value = Math.round(item.value / item.num);
  });
  return returnData;
};
