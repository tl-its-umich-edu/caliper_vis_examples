var highlightData = function(problem) {
  $('.bar').css('opacity', '1')
  $('.bar').not("." + problem).css('opacity', '.2')
}

$('select').on('change', function() {
  makeGraph(this.value);
})

var makeGraph = function(student) {
  d3.selectAll("#chart > *").remove();
  $.getJSON(student || "json/a_s.json", function(initResult) {
    data = initResult;
    var margin = {
        top: 40,
        right: 20,
        bottom: 30,
        left: 40
      },
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;
    var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1);
    var y = d3.scale.linear()
      .range([height, 0]);
    var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");
    var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        var answer = '';
        if (d.answerCorrect !== null) {
          answer = '<p>Answer correct: ' + d.answerCorrect + '</p>';
        } else {
          answer = '<p>Answer: skipped</p>';
        }
        return '<div><strong>Time:</strong> <span style="color:red">' + moment.duration(d.time, moment.ISO_8601).asSeconds() + '</span><div>\
    <p>' + d.problem + '</p><p>Done: ' + moment(d.end).format("D/M h:mm:ss a") + '</p>' +
          answer + '<p>Total tries: ' + d.count + '</p>';
      })
    var svg = d3.select("#chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .attr("style", 'padding-bottom:400px')
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.call(tip);

    //d3.json("data.json", function(error, data) {
    var problems = _.uniq(_.pluck(data, 'problem'));
    var problemCount = [];
    _.each(problems, function(problem) {
      problemCount.push({
        'problem': problem,
        'count': 0
      });
    })
    _.each(data, function(item) {
      var corr = _.findWhere(problemCount, {
        problem: item.problem
      });
      corr.count = corr.count + 1
    });
    _.each(data, function(item) {
      var corr = _.findWhere(problemCount, {
        problem: item.problem
      });
      item.count = corr.count;
    });


    x.domain(data.map(function(d) {
      return moment(d.end).format("D/M h:mm:ss a");
    }));
    y.domain([0, d3.max(data, function(d) {
      return moment.duration(d.time, moment.ISO_8601).asSeconds();
    })]);
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end")
      .style("width", "500px")
      .style("text-anchor", "end")
      .attr("dx", ".71em")
      .style("text-anchor", "end");
    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 2)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Seconds");

    svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", function(d) {
        return 'bar ' + d.action + d.answerCorrect + ' ' + d.problem.replace(/ /gi, '_') + ' count' + d.count;
      })
      .attr("x", function(d) {
        return x(moment(d.end).format("D/M h:mm:ss a"));
      })
      .attr("width", x.rangeBand())
      .attr("y", function(d) {
        return y(moment.duration(d.time, moment.ISO_8601).asSeconds());
      })
      .attr("height", function(d) {
        return height - y(moment.duration(d.time, moment.ISO_8601).asSeconds());
      })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
      .on('click', function(d) {
        highlightData(d.problem.replace(/ /gi, '_'));
      });

    svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .selectAll(".textlabel")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "textlabel")
      .attr("x", function(d) {
        return x(moment(d.end).format("D/M h:mm:ss a")) - 28;
      })
      .attr("y", function(d) {
        return y(moment.duration(d.time, moment.ISO_8601).asSeconds()) - 50;
      })
      .text(function(d) {
        return d.count;
      });
  });
};
makeGraph();
