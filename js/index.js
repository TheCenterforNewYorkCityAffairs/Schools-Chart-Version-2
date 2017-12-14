var Chart = (function(window,d3) {

	var data, datanest, x, y, r, xAxis, yAxis, width, height, margin = {}, node;
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
			.key(d => d.eth).sortKeys(d => d.medincome)
			.entries(data);

		console.log(datanest);

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

		//initialize svg
		svg = d3.select('#chart').append('svg');
		chartWrapper = svg.append('g');
		node = chartWrapper.selectAll('.node')
				.data(data).enter()
			.append('circle')
				.attr('class', 'node');

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

		// Set node positions, radii, and colors
		node
			.attr('r', d => r(d.n))
			.attr('cx', d => x(d.medincome))
			.attr('cy', d => y(d.mathrating))
			.style('fill', d => colors[d.eth]);

		d3.selection.prototype.moveToFront = function() {
				return this.each(function(){
					this.parentNode.appendChild(this);
				});
			}

		node.on("mouseover",function(){
			  var sel = d3.select(this);
			  sel.moveToFront();
			});

		d3.selection.prototype.moveToBack = function() {
				this.each(function() {
					this.parentNode.firstChild
					&& this.parentNode.insertBefore(this, firstChild);
				});
			};

		//I don't think that simulation is the best way to go
		// var simulation = d3.forceSimulation()
		// 	.force("link", d3.forceLink().id(function(d) { return d.id; }))
		// 	// .force("charge", d3.forceManyBody().strength(-10))
		// 	//.force("center", d3.forceCenter(width / 2, height / 2))
		// 	.on("tick", ticked);
    //
		// simulation.nodes(data.nodes);
		// simulation.force("link").links(data.links);

		// function ticked() {
		// 	var x = (function(d){
		// 		d.x = d.medincome / 2457.14286 +("vw");
		// 		// return d.medincome / 2457.14286 +("vw");
		// 	});
    //
		// 	var y = (function(d, i){
		// 		d.y = 43.75 - (d.mathrating * 8.75) +("vw");
		// 		// return 43.75 - (d.mathrating * 8.75) +("vw");
		// 	});
    //
		// 	link.attr("x1", function(_d) {
		// 		return  _d.source.medincome / 2457.14286 +("vw")
		// 	})
		// 	.attr("y1", function(_d) {
		// 		return  43.75 - (_d.source.mathrating * 8.75) +("vw");
		// 	})
		// 	.attr("x2", function(_d) {
		// 		return  _d.target.medincome / 2457.14286 +("vw");
		// 	})
		// 	.attr("y2", function(_d) {
		// 		return  43.75 - (_d.target.mathrating * 8.75) +("vw");
		// 	});
		//
		// } // ticked

	} // render

	return {
		render : render
	}

})(window,d3);

window.addEventListener('resize', Chart.render);
