// get the data
d3.csv("force.csv", function(error, links) {

// contain data for nodes
var nodes = {};

// Compute the distinct nodes from the links.
links.forEach(function(link) {
    link.source = nodes[link.source] || 
        (nodes[link.source] = {name: link.source});
    // if link.source does not equal any of the nodes values, then
    // create a new element in the nodes object with the name of the link.source
    // value being considered
    link.target = nodes[link.target] || 
        (nodes[link.target] = {name: link.target});
    link.value = +link.value;
});

// set svg area
var width = 960,
    height = 500;

// use d3 force function
var force = d3.layout.force()
    .nodes(d3.values(nodes))    // sets layout to array of nodes
    .links(links)               // sets links
    .size([width, height])      // sets using svg area vars
    .linkDistance(60)           // sets target distance between nodes
    .charge(-300)               // sets the force between nodes
    .on("tick", tick)           // runs the animation of the force layour
    .start();                   // starts the simulation

// set up the svg container
var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

// build the arrow.
svg.append("svg:defs").selectAll("marker")
    .data(["end"])      // Different link/path types can be defined here
  .enter().append("svg:marker")    // This section adds in the arrows
    .attr("id", String)
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 15)
    .attr("refY", -1.5)
    .attr("markerWidth", 6)         // set bounding box for the marker
    .attr("markerHeight", 6)
    .attr("orient", "auto")
  .append("svg:path")
    .attr("d", "M0,-5L10,0L0,5");

// add the links and the arrows
var path = svg.append("svg:g").selectAll("path")
    .data(force.links())
  .enter().append("svg:path")
//    .attr("class", function(d) { return "link " + d.type; })
    .attr("class", "link")
    .attr("marker-end", "url(#end)");

// define the nodes
var node = svg.selectAll(".node")
    .data(force.nodes())
  .enter().append("g")
    .attr("class", "node")
    .on("click", click)             // call click function
    .on("dblclick", dblclick)       // call dblclick function
    .call(force.drag);

// declare colo(u)r range
color = d3.scale.category20c();

// add the nodes
node.append("circle")
    .attr("r", 5)
    .style("fill", function(d) { return color(d.name); });

// add the text 
node.append("text")
    .attr("x", 12)
    .attr("dy", ".35em")
    .text(function(d) { return d.name; });

// add the curvy lines
function tick() {
    path.attr("d", function(d) {
        var dx = d.target.x - d.source.x,
            dy = d.target.y - d.source.y,
            dr = Math.sqrt(dx * dx + dy * dy);
        return "M" + 
            d.source.x + "," + 
            d.source.y + "A" + 
            dr + "," + dr + " 0 0,1 " + 
            d.target.x + "," + 
            d.target.y;
    });

    node
        .attr("transform", function(d) { 
  	    return "translate(" + d.x + "," + d.y + ")"; });
}

    function click() {
        d3.select(this).select("text").transition()
            .duration(750)
            .attr("x", 22)
            .style("stroke", "lightsteelblue")
            .style("stroke-width", ".5px")
            .style("font", "20px sans-serif");
        d3.select(this).select("circle").transition()
            .duration(750)
            .attr("r", 16)
    }

    function dblclick() {
        d3.select(this).select("circle").transition()
            .duration(750)
            .attr("r", 6)
        d3.select(this).select("text").transition()
            .style("stroke", "none")
            .style("stroke", "none")
            .style("font", "10px sans-serif");
    }

});
