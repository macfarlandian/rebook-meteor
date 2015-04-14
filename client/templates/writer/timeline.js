Template.chapterTimeline.helpers({
    chapter: function(_id){
        // debugger;
        return getChapter(_id);
    }
});

Template.chapterTimeline.rendered = function(){
    // do d3 stuff
    var timeline = d3.select('#timeline');
    Tracker.autorun(function(){
        var c = getChapter(Session.get('workData'));
        if (!c) return null;

        //select elements that correspond to documents
        var bars = timeline.selectAll(".bar")
        .data(c.contents)
        ;

        //handle new documents via enter()
        bars.enter()
        .append("div")
        .classed("bar column", true)
        ;

        // apply to enter + update
        bars
            .on('click', function(d){
                // display preview template with content
                Session.set('previewArea', 'contentpreview');
                Session.set('previewData', d._id);

                // check for overlaps and store in session
                var others = _.without(c.contents, d),
                overlaps = [];
                _.each(others, function(r){
                    var overlap = {};
                    // overlapping starts
                    if (r.start > d.start && r.start < d.end) {

                        overlap.start = wordScale(r.start);
                    }
                    // overlapping ends
                    if (r.end > d.start && r.end < d.end) {
                        overlap.end = wordScale(r.end);
                    }
                    // if not empty, push
                    if (overlap) {
                        overlap.name = r.name;
                        overlaps.push(overlap)
                    }
                })
                Session.set('overlaps', overlaps);
            })
            .transition()
            .style("height", function(d){ return tScale(d.length) + "px" })
            .style("top", function(d){ return tScale(d.start) + "px" })
            ;

        // append labels
        var labels = bars
            .selectAll('small')
            .data(function(d){
                return [d];
            });

        labels.enter()
            .append("small");

        labels.text(function(d){ return d.name });


        bars.exit()
            .remove()
            ;

        // timeline axis display
        var axisScale = d3.scale.linear()
        .domain([0, c.length])
        .range([0, minute * c.length])
        ;
        var tAxis = d3.svg.axis()
        .scale(axisScale)
        .orient('right')
        .ticks(Math.floor(c.length))
        ;

        d3.select('#tAxis')
        .attr('height', axisScale(c.length) + 20)
        .append('g')
        .attr('transform', 'translate(0,10)')
        .call(tAxis)
        ;
        d3.select('#gridlines')
        .attr('height', axisScale(c.length) + 20)
        .append('g')
        .attr('transform', 'translate(0,10)')
        .call(d3.svg.axis()
        .scale(axisScale)
        .orient('right')
        .ticks(Math.floor(c.length) * 2)
        .tickSize(9999,0)
        .tickFormat("")
    )
    ;
});
}
