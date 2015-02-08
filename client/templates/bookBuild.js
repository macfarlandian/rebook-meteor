Template.bookBuild.helpers({
    book: function(){
        return Books.findOne(Session.get('workData'));
    }
});

Template.bookBuild.rendered = function(){
    var svg = d3.select('svg.bookBuilder'),
        width = 744,
        height = 600;
    svg.attr('width', width)
        .attr('height', height)
        ;
    // debugger;
    Tracker.autorun(function(){
        var book = Books.findOne(Session.get('workData')),
            graph = {nodes: [], links: []},
            force = d3.layout.force()
                .charge(-100)
                .linkDistance(200)
                .size([width,height])
                .friction(0.5)
                ;
        if (!book) return null;

        // nodes are the containers in a book
        graph.nodes = _.map(book.contents, function(cur){
            var obj = Models[cur.model].findOne(cur._id);
            return {name: obj.name, _id: obj._id, model: cur.model, length: obj.getLength()};
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
        })
        force.nodes(graph.nodes).links(graph.links).start();

        // create svg elements for nodes and links
        var link = svg.selectAll(".link")
            .data(graph.links)
            .enter().append("line")
                .attr("class", "link")
                .style("stroke-width", 1)
                .style("stroke", "#000")
                ;
        var node = svg.selectAll(".node")
            .data(graph.nodes)
            .enter().append("rect")
                .attr("class", "node")
                .attr("width", 50)
                .attr("height", function(d){
                    return tScale(d.length)/16;
                })
                .attr('transform', function(d){
                    var hCenter = tScale(d.length) / 32;
                    return 'translate(-25,-' + hCenter + ')';
                }) // center
                ;

        node.append("title")
            .text(function(d) { return d.name; });

        // assign positions in svg based on force layout
        force.on("tick", function() {
            link.attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            node.attr("x", function(d) { return d.x; })
                .attr("y", function(d) { return d.y; });
        });

    });
}
