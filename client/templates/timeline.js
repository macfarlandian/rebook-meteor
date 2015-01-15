Template.timeline.rendered = function(){
    var svg = d3.select('svg#chap');
    Tracker.autorun(function(){
        var dataset = Chapters.find().fetch();

        // set up d3 scales
        var xScale = d3.scale.linear()
            // 1 minute == 50px
            .domain([0,1])
            .range([0,50])
            ;

        //select elements that correspond to documents
        var bars = svg.selectAll("rect")
            .data(dataset); //bind dataset to objects using key function

        //handle new documents via enter()
        bars.enter()
            .append("rect")
            .attr('width', function(d){ return xScale(d.readtime) })
            .attr("x", 0)
            .attr("y", 0)
            .attr('height', 20)
            ;

        bars
            .transition()
            .attr('width', function(d){ return xScale(d.readtime)})
            ;

        bars.exit()
            .remove()
            ;

    });
}
