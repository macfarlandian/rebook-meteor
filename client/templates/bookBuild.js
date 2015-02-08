Template.bookBuild.helpers({
    book: function(){
        return Books.findOne(Session.get('workData'));
    }
});

Template.bookBuild.rendered = function(){
    var container = d3.select('#bookContainer'),
        width = 744,
        height = 500,
        svg = d3.select("#bookLinks");

    Tracker.autorun(function(){
        var book = Books.findOne(Session.get('workData')),
            graph = {nodes: [], links: []},
            force = d3.layout.force()
                .charge(-350)
                .linkDistance(200)
                // .linkStrength(.5)
                // .gravity(0.1)
                .size([width,height])
                .friction(0.5)
                ;
        if (!book) return null;

        // nodes are the containers in a book
        graph.nodes = _.map(book.contents, function(cur){
            var obj = Models[cur.model].findOne(cur._id);
            return {
                name: obj.name,
                _id: obj._id,
                model: cur.model,
                length: obj.getLength(),
                x: 90,
                y: 25
            };
        });
        graph.nodes.push({
            name: "start",
            length: 10,
            fixed: true,
            x: 90,
            y: 25
        });

        // links are the unlock relationships between them
        _.each(book.contents, function(cur,i){
            _.each(cur.unlocks, function(unlock){
                var link = {source: i};
                var target = _.findIndex(graph.nodes, function(node){
                    return node._id == unlock.target;
                })
                link.target = target;
                link.type = unlock.type;
                graph.links.push(link)
            });
        });

        graph.links.push({source: 2, target: 0})
        force.nodes(graph.nodes).links(graph.links).start();

        // create svg elements for nodes and links
        var node = container.selectAll(".node")
            .data(graph.nodes)
            .enter().append("div")
                .attr("class", "ui card")
                .style("height", function(d){
                    return tScale(d.length)/16 + "px";
                })
                .style({width: "150px"})
                ;

        node.append("div")
            .attr('class', 'content')
            .text(function(d){ return d.name; })
            ;

        var link = svg.selectAll(".link")
            .data(graph.links)
            .enter().append("line")
                .attr("class", "link")
                .style("stroke-width", 2)
                .style("stroke", "#000")
                ;

        // assign positions in svg based on force layout
        force.on("tick", function() {
            // collision detection
            var q = d3.geom.quadtree(graph.nodes);
            _.each(graph.nodes, function(n){
                q.visit(collide(n));
            });

            link.attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            node.style("left", function(d) { return (d.x - 75) + "px"; })
                .style("top", function(d) { return (d.y - tScale(d.length)/32) + "px"; });
        });

    });
}

// collision detection function
function collide(node) {
    var w = 150/2,
        h = tScale(node.length)/16/2;

    var r = Math.sqrt(w*w + h*h), // faux radius
      nx1 = node.x - r,
      nx2 = node.x + r,
      ny1 = node.y - r,
      ny2 = node.y + r;
    return function(quad, x1, y1, x2, y2) {
    if (quad.point && (quad.point !== node)) {
      var x = node.x - quad.point.x,
          y = node.y - quad.point.y,
          l = Math.sqrt(x * x + y * y),
          qr = Math.sqrt((150/2)*(150/2) + (tScale(quad.point.length)/16/2)*(tScale(quad.point.length)/16/2)),
          r = r + qr;
      if (l < r) {
        l = (l - r) / l * .5;
        node.x -= x *= l;
        node.y -= y *= l;
        quad.point.x += x;
        quad.point.y += y;
      }
    }
    return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
    };
}
