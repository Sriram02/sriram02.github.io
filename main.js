$(document).ready(function() {
	var state_transition = {}

	d3.csv("indian-movie-theatres.csv", function(err, data){
		data.forEach(function(theaters, index) {
			if (!state_transition[theaters.city]) state_transition[theaters.city] = {}
			//if (!state_transition[theaters.city]['Avg Ticket Price']) state_transition[theaters.city]['Avg Ticket Price'] = {}
			if (!state_transition[theaters.city]['Multiplex']) state_transition[theaters.city]['Multiplex'] = {}
			if (!state_transition[theaters.city]['Single Screen']) state_transition[theaters.city]['Single Screen'] = {}
			if (!state_transition[theaters.city]['Screens']) state_transition[theaters.city]['Screens'] = {}

			//state_transition[theaters.city]['Avg Ticket Price'][theaters.theatre_name] = theaters.average_ticket_price;
			state_transition[theaters.city]['Multiplex'][theaters.theatre_name] = (theaters.type == 'Multiplex') ? 1 : 0;
			state_transition[theaters.city]['Single Screen'][theaters.theatre_name] = (theaters.type == 'Single Screen') ? 1 : 0;
			state_transition[theaters.city]['Screens'][theaters.theatre_name] = theaters.no_screens;
		})

		var selectStateOption = "<option value=''>All Cities</option>"
		Object.keys(state_transition).forEach(function(region) {
			selectStateOption += "<option value='"+region+"'>"+region+"</option>"
		})

		$('#state_select').html(selectStateOption)

		data = {
				labels: Object.keys(state_transition),
				series: loadSeries(state_transition)
			}
		barChart(data);
		var state = 'All Cities';
	  $("#state_select option").slice(0,1).text(state)
	  mapify(state);
	  $("#map_text").html("<strong> All Cities </strong>" + " - Theater Wise Analytics on Screens");
	})

	function loadSeries(data) {
		var series = []
		var groupedData = []
		Object.keys(data).map(function(region, index) {
			for(var key in state_transition[region]) {
				if(!groupedData[key]) groupedData[key] = []
				groupedData[key].push(Object.values(state_transition[region][key]).reduce((a, b) => Number(a) + Number(b), 0))
				//console.log(key, Object.values(state_transition[region][key]).reduce((a, b) => Number(a) + Number(b), 0))
			}
		})

		for(var label in groupedData) {
			series.push({
				label: label,
				values: groupedData[label]
			})
		}

		return series
	}

	$('#state_select').change(function() {
		var region = $(this).val();
		var data = {}

		if(region == '') {
			data = {
				labels: Object.keys(state_transition),
				series: loadSeries(state_transition)
			}
			$("#map_text").html("<strong> All Cities </strong>" + " - Theater Wise Analytics on Screens");
		} else {
			data = {
				labels: Object.keys(state_transition[region]['Multiplex']),
				series: Object.keys(state_transition[region]).map(function(label) {
					return { "label": label, "values": Object.values(state_transition[region][label])}
				})
			}
			$("#map_text").html("<strong>" + region + "</strong>" + " - Theater Wise Analytics on Screens");
		}
		//Slicing first 10 data points
		data["labels"] = data["labels"].slice(0,9)
		for(var key in data["series"]) {
			data["series"][key]["values"] = data["series"][key]["values"].slice(0,9)
		}
		barChart(data);
		mapify(region);
	})
})


  function barChart(data){
  	var chartWidth       = 300,
    barHeight        = 20,
    groupHeight      = barHeight * data.series.length,
    gapBetweenGroups = 10,
    spaceForLabels   = 150,
    spaceForLegend   = 150;

		// Zip the series data together (first values, second values, etc.)
		var zippedData = [];
		for (var i=0; i<data.labels.length; i++) {
		  for (var j=0; j<data.series.length; j++) {
		    zippedData.push(data.series[j].values[i]);
		  }
		}

		// Color scale
		var color = d3.scale.category20();
		var chartHeight = barHeight * zippedData.length + gapBetweenGroups * data.labels.length;

		var x = d3.scale.linear()
		    .domain([0, d3.max(zippedData)])
		    .range([0, chartWidth]);

		var y = d3.scale.linear()
		    .range([chartHeight + gapBetweenGroups, 0]);

		var yAxis = d3.svg.axis()
		    .scale(y)
		    .tickFormat('')
		    .tickSize(0)
		    .orient("left");

		// Specify the chart area and dimensions
		$(".chart").empty("");
		var chart = d3.select(".chart")
		    .attr("width", spaceForLabels + chartWidth + spaceForLegend)
		    .attr("height", chartHeight);

		// Create bars
		var bar = chart.selectAll("g")
		    .data(zippedData)
		    .enter().append("g")
		    .attr("transform", function(d, i) {
		      return "translate(" + spaceForLabels + "," + (i * barHeight + gapBetweenGroups * (0.5 + Math.floor(i/data.series.length))) + ")";
		    });

		// Create rectangles of the correct width
		bar.append("rect")
		    .attr("fill", function(d,i) { return color(i % data.series.length); })
		    .attr("class", "bar")
		    .attr("width", x)
		    .attr("height", barHeight - 1);

		// Add text label in bar
		bar.append("text")
		    .attr("x", function(d) { return x(d) - 3; })
		    .attr("y", barHeight / 2)
		    .attr("fill", "red")
		    .attr("dy", ".35em")
		    .text(function(d) { return d; });

		// Draw labels
		bar.append("text")
		    .attr("class", "label")
		    .attr("x", function(d) { return - 10; })
		    .attr("y", groupHeight / 2)
		    .attr("dy", ".35em")
		    .text(function(d,i) {
		      if (i % data.series.length === 0)
		        return data.labels[Math.floor(i/data.series.length)].length > 15 ? data.labels[Math.floor(i/data.series.length)].slice(0,15) + '...' : data.labels[Math.floor(i/data.series.length)];
		      else
		        return ""});

		 bar.append("svg:title").text(function(d, i) { 
		 		if (i % data.series.length === 0)
		        return data.labels[Math.floor(i/data.series.length)];
		      else
		        return ""});

		chart.append("g")
		      .attr("class", "y axis")
		      .attr("transform", "translate(" + spaceForLabels + ", " + -gapBetweenGroups/2 + ")")
		      .call(yAxis);

		// Draw legend
		var legendRectSize = 18,
		    legendSpacing  = 4;

		var legend = chart.selectAll('.legend')
		    .data(data.series)
		    .enter()
		    .append('g')
		    .attr('transform', function (d, i) {
		        var height = legendRectSize + legendSpacing;
		        var offset = -gapBetweenGroups/2;
		        var horz = spaceForLabels + chartWidth + 40 - legendRectSize;
		        var vert = i * height - offset;
		        return 'translate(' + horz + ',' + vert + ')';
		    });

		legend.append('rect')
		    .attr('width', legendRectSize)
		    .attr('height', legendRectSize)
		    .style('fill', function (d, i) { return color(i); })
		    .style('stroke', function (d, i) { return color(i); });

		legend.append('text')
		    .attr('class', 'legend')
		    .attr('x', legendRectSize + legendSpacing)
		    .attr('y', legendRectSize - legendSpacing)
		    .text(function (d) { return d.label; });
	}