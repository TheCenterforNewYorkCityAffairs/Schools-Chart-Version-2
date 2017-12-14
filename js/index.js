var Chart = (function(window,d3) {

	var data, datanest, x, y, r, xAxis, yAxis, width, height, margin = {}, school, node, path, line;
	var colors = {
		'Black': '#00635D',
		'White': '#7B0828',
		'Hispanic': '#E3D26F',
		'Asian': '#36173A',
		'Other': '#BB6B00',
		'Default': '#F3F3F3'
	}

	d3.json('js/datatest.json', init); //load data, then initialize chart

	// Initialize the chart for the first time
	function init(json) {
		data = json['nodes'];
		datanest = d3.nest()
			.key(d => d.dbn)
			.key(d => d.medincome).sortKeys(d3.ascending)
			.entries(data);

		//initialize scales
		var xExtent = d3.extent(data, d => d.medincome);
		var yExtent = d3.extent(data, d => d.mathrating);
		x = d3.scaleLinear().domain(xExtent);
		y = d3.scaleLinear().domain(yExtent);
		r = d3.scaleLinear()
			.domain(d3.extent(data, d => d.n))
			.range(['0.4vw', '3.5vw']);

		//initialize axis
		xAxis = d3.axisBottom();
		yAxis = d3.axisLeft();

		line = d3.line()
			.x(d => x(d.values[0].medincome))
			.y(d => y(d.values[0].mathrating));

		// initialize svg
		svg = d3.select('#chart').append('svg');
		chartWrapper = svg.append('g');

		// initialize school groups
		school = chartWrapper.selectAll('.school')
				.data(datanest).enter()
			.append('g')
				.attr('class', 'school')

		// initialize demographic nodes
		node = chartWrapper.selectAll('.school').selectAll('.node')
				.data(d => d.values).enter()
			.append('circle')
				.attr('class', 'node');

		// define school paths
		path = chartWrapper.selectAll('.school')
			.append('path')
				.datum(d => d.values);

		chartWrapper.append('g').classed('x axis', true);
		chartWrapper.append('g').classed('y axis', true);

		//render the chart
		render();
	}

	// Determine the right dimensions for the chart
	// depending on current window size
	function updateDimensions(winWidth) {
		margin.top = 20;
		margin.right = 50;
		margin.left = 50;
		margin.bottom = 50;

		width = winWidth - margin.left - margin.right;
		height = width * 0.7 - margin.top - margin.bottom;
	}

	// Draw the chart and all the SVG elements
	// This can run again when the page is resized, e.g.
	function render() {
		//get dimensions based on window size
		updateDimensions(window.innerWidth);

		//update x and y scales to new dimensions
		x.range([0, width]);
		y.range([height, 0]);

		//update svg elements to new dimensions
		svg
			.attr('width', width + margin.right + margin.left)
			.attr('height', height + margin.top + margin.bottom);
		chartWrapper.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

		//update the axes
		xAxis.scale(x);
		yAxis.scale(y);

		svg.select('.x.axis')
			.attr('transform', 'translate(0,' + height + ')')
			.call(xAxis);

		svg.select('.y.axis')
			.call(yAxis);

		// Set path's path
		path
			.attr('d', d => line(d));

		// Set node positions, radii, and colors
		node
			.attr('r', d => r(d.values[0].n))
			.attr('cx', d => x(d.values[0].medincome))
			.attr('cy', d => y(d.values[0].mathrating))
			.style('fill', d => colors[d.values[0].eth]);

		d3.selection.prototype.moveToFront = function() {
				return this.each(function(){
					this.parentNode.appendChild(this);
				});
			}

		node.on('mouseover', function(d) {
			  var sel = d3.select(this);
				d3.select(this.parentNode).classed('hover', true);
			  d3.select(this.parentNode).moveToFront();
				var name = d.values[0].name;
				d3.select('#information').select('.name').html(name);
				d3.select('#information').style('display', 'block');
			}).on('mouseout', function() {
				d3.select(this.parentNode).classed('hover', false);
			});

		d3.selection.prototype.moveToBack = function() {
				this.each(function() {
					this.parentNode.firstChild
					&& this.parentNode.insertBefore(this, firstChild);
				});
			};

		d3.select('#show-gifted').on('click', function() {
			svg.selectAll('.school')
				.filter(d => {
					return d.values[0].values[0].gifted == 0;
				})
				.attr('opacity', 0).style('pointer-events', 'none');
		});

		d3.select('#show-duallang').on('click', function() {
			svg.selectAll('.school')
				.filter(d => {
					return d.values[0].values[0].duallang == 0;
				})
				.attr('opacity', 0).style('pointer-events', 'none');
		});

		d3.select('#show-all').on('click', function() {
			svg.selectAll('.school').attr('opacity', 1).style('pointer-events', 'all');
		});

	} // render

	return {
		render : render
	}

})(window,d3);

window.addEventListener('resize', Chart.render);
