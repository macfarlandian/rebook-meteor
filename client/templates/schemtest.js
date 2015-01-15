// a helper helper ... DRY chapter fetching
function getChapter() {
    var c = Chapters.findOne();
        if (c == undefined) return c;

    //  sort contents by start
    c.contents = _.sortBy(c.contents, function(r){
        return r.start;
    });

    // calculate chapter length on the fly
    c.length = _.max(c.contents, function(r){return r.end}).end;

    // join references with resource records
    _.each(c.contents, function(e,i,l){
        var r = Resources.findOne(e.resource_id);
        l[i] = _.extend(l[i], r)
    });

    return c;
}

Template.schemtest.helpers({
    chapter: getChapter,
});

// global vars for displaying preview on click
previewContent = undefined;

Template.schemtest.rendered = function(){
    // do d3 stuff
    var timeline = d3.select('#timeline');
    Tracker.autorun(function(){
        var c = getChapter();
        if (!c) return null;
        // set up d3 scales
        var minute = 80;
        var tScale = d3.scale.linear()
            .domain([0,1])
            .range([0,minute])
            ;
        // 1 word = .004 minutes (1/250)
        var wordScale = d3.scale.linear()
            .domain([0,.004])
            .range([0,1]);

        //select elements that correspond to documents
        var bars = timeline.selectAll(".bar")
            .data(c.contents);

        //handle new documents via enter()
        bars.enter()
            .append("div")
            .classed("bar column", true)
            .style("height", function(d){ return tScale(d.length) + "px" })
            .style("top", function(d){ return tScale(d.start) + "px" })
            .on('click', function(d){
                // display preview template with content
                if (previewContent) Blaze.remove(previewContent);
                var previewNode = d3.select('#preview')[0][0];
                previewContent = Blaze
                    .renderWithData(Template.contentpreview, d, previewNode);

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
                .append("small")
                .text(function(d){ return d.name })
            // .style("left", function(d,i) { return i * 25 + "px" })
            // .style("width", "20px")
            ;

        bars
            .transition()
            .style("height", function(d){ return tScale(d.length) + "px"})
            ;

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

    // semantic UI
    $('.ui.sticky')
        .sticky({
            context: '#preview'
        });
;
};
