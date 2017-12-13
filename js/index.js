	
	var diameter = '71vw';

	// var vertical = ["7vw","14vw","21vw","28vw","35vw","42vw","49vw","56vw","63vw"];

	

	var horizontal = ["hLine0","hLine1","hLine2"];

	var vertical = ["line0","line1","line2","line3","line4","line5","line6"];



	function importData(){

		// chart
		var svg = d3.select('svg'),
			width = +svg.attr("width"),
    		height = +svg.attr("height");

    	var link = svg.selectAll(".link"),
    		node = svg.selectAll(".node");



		d3.json("js/datatest.json", function(error, data){
			if (error) throw error;
			console.log("json conected");
			console.log(data.nodes);	

				
		


		

	// Chart vertical and horizontal lines
		svg.selectAll("line")
			.data(horizontal)
			.enter()
				.append("rect")
				.attr ("width",'70vw')
				.attr ("height", 0.25)
				.attr("y", function(d, i){return 8.75 + i * 8.75 + "vw"});
		
		
		svg.selectAll("line")
			.data(vertical)
			.enter()
				.append("rect")
				.attr ("height",35+"vw")
				.attr ("width", 0.25)
				.attr("fill", "gray")
				.attr("x", function(d, i){return 8.75 + i * 8.75 + "vw"});



      	link = link
		    .data(data.links)
		    .enter().append("line")
		    .attr("class", "link")
		    .attr("stroke", "gray")
      		.attr("stroke-width", 0.5);

		


	//Creating the circles	
		var circleScale = d3.scale.linear()
		.domain(d3.extent(data.nodes,function(d)
			{return d.n}))
		.range(["0.4vw","3.5vw"])


		node = node
	    	.data(data.nodes)
	    	.enter().append("circle")
	      	.attr("class", "node")
			.attr("r", function(d){	
				return circleScale(d.n)
			})

			.attr("cx", function(d){
				return d.medincome / 2457.14286 +("vw");
			})
			.attr("cy", function(d, i){
				return 43.75 - (d.mathrating * 8.75) +("vw");
			})


	     	.style("fill",function(d){
	        	  return ((d.eth == "Black")?"#00635D":
	        	  	(d.eth == "White")?"#7B0828":
	        	  	(d.eth == "Hispanic")?"#E3D26F":
	        	  	(d.eth == "Asian")?"#36173A":
	        	  	(d.eth == "Other")?"#BB6B00":"gray");

	      	})
			.style('fill-opacity', 0.6)
			.style("stroke", "gray")
			.style("stroke-width", 0.5)


			d3.selection.prototype.moveToFront = function() {
			  return this.each(function(){
			    this.parentNode.appendChild(this);
			  });
			}	

			node.on("mouseover",function(){
			  var sel = d3.select(this);
			  sel.moveToFront();
			})
			
			d3.selection.prototype.moveToBack = function() { 
			    this.each(function() { 
			        this.parentNode.firstChild
			          && this.parentNode.insertBefore(this, firstChild); 
			        }); 
			};





		// Here I was trying to link the circles, but
		// this didn't worked. 	

		// svg.selectAll("line")
		// 	.data(data.link)
		//  .data(data.node)
		// 	.enter()
		// 		.append("line")
		// 		.attr("x1", function(d, i){return d.source, d.medincome / 2457.14286 +("vw");})
		// 		.attr("x2", function(d, i){return d.target, d.medincome / 2457.14286 +("vw");})
		// 		.attr("y1", function(d, i){return d.source, 43.75 - (d.mathrating * 8.75) +("vw");})
		// 		.attr("y2", function(d, i){return d.target, 43.75 - (d.mathrating * 8.75) +("vw");})
		// 		.attr("stroke", "gray")
		// 		.attr("stroke-width", 0.5);


		//I don't think that simulation is the best way to go
		//around this, I just haven't find the right methode. 
		var simulation = d3.forceSimulation()
    	.force("link", d3.forceLink().id(function(d) { return d.id; }))
    	// .force("charge", d3.forceManyBody().strength(-10))
    	//.force("center", d3.forceCenter(width / 2, height / 2))
    	.on("tick", ticked);

		
		// svg.selectAll("text")
		// 	.data(data.nodes)
		// 	.enter()
		// 	.append("text")
		// 	.attr("fill", "gray")
		// 	.attr("class", "text-fill")
		// 	.attr("text-anchor", "middle")
		// 	.attr("y", function(d,i){
		// 		return 43.75 - (d.mathrating * 8.75) +("vw"); 
		// 	})
		// 	.attr("x", function(d,i){
		// 		return d.medincome / 2457.14286 +("vw");
		// 	})
		// 	.text(function(d){
		// 		return "students:" + d.n;
		// 	})

		// 		//THis is the on mouse over data.nodes
		// 	.on('mouseover',function(d){
		// 		d3.select(this).classed("selected",true)

		// 	})
		// 	.on('mouseout',function(d){
		// 		d3.select(this).classed("selected",false)
				
		// 	});




  		simulation.nodes(data.nodes);
  		simulation.force("link").links(data.links);	



	});

	function ticked() {
  		var x = (function(d){

  			d.x = d.medincome / 2457.14286 +("vw");
				// return d.medincome / 2457.14286 +("vw");
			});

  		var y = (function(d, i){
  			d.y = 43.75 - (d.mathrating * 8.75) +("vw");
				// return 43.75 - (d.mathrating * 8.75) +("vw");
			});


    	link
        	.attr("x1", function(_d) {
        		// console.log(_d); 
        		return  _d.source.medincome / 2457.14286 +("vw")
        	})

        	.attr("y1", function(_d) {
        		// console.log(_d); 
        		// debugger
				return  43.75 - (_d.source.mathrating * 8.75) +("vw"); })
        	.attr("x2", function(_d) { 
        		// return _d.target.x; 
        		return  _d.target.medincome / 2457.14286 +("vw");
        	})
        	.attr("y2", function(_d) { 
        		return  43.75 - (_d.target.mathrating * 8.75) +("vw"); })

    	// node
     //    	.attr("cx", x)
     //  		.attr("cy", y);

      	// .attr("cx", function(d) { return d.x; })
       //  .attr("cy", function(d) { return d.y; });

  	}
}


	
	importData();


