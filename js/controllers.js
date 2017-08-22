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
        tickFormat: function(d){
          return d;
        }
      }
    }
  };
  $scope.data = [];

  Fetch.getData('raw.json').then(function(result) {
    $scope.raw = result.data;
    $scope.data = transFormUserCounts(result.data);
  });

  $scope.userCorrect = function() {
    $scope.options.chart.yAxis.axisLabel = '% correct';
    $scope.options.chart.yAxis.tickFormat= function(d){
        return d +  ' %' ;
    };
    $scope.data = transFormPercentCorrect($scope.raw);
  };
  $scope.userCounts = function() {
    $scope.options.chart.yAxis.axisLabel = 'Questions Answered';
    $scope.options.chart.yAxis.tickFormat= function(d){
        return d;
    };
    $scope.data = transFormUserCounts($scope.raw);
  };
  $scope.timeSpent = function(){
    $scope.options.chart.yAxis.axisLabel = 'Average Time Spent';
    $scope.options.chart.yAxis.tickFormat= function(d){
        return d +  ' s' ;
    };
    $scope.data = transFormTimeSpent($scope.raw);
  }
}]);


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
      //console.log(corr.value);
    } else {
      returnData[0].values.push({
        label: item.actor,
        value: thisTime,
        total:1
      });
    }
  });

  _.each(returnData[0].values, function(item, i) {
      returnData[0].values[i].value = Math.round(item.value / item.total);
      delete returnData[0].values[i].total;
  });

  return returnData;
};
