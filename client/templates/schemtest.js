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
    text: function(){
        // for now, testing with one text file
        var d = Resources.findOne({"type": "text"});
            if (d == undefined) return d;
        // break text into paragraphs
        return d.contents.split(/(\r\n|\n|\r)/gm)
    },
    length: function(){
        // for now, testing with one text file
        var d = Resources.findOne({"type": "text"});
            if (d == undefined) return d;
        // use rough word count (tokenized by whitespace)
        // divided by 250 words per minute (english avg)
        if (d) return d.contents.split(/\s+/).length / 250;
    },
    chapter: getChapter,
});

Template.schemtest.rendered = function(){
    // do d3 stuff
    var svg = d3.select('svg#timeline');
    Tracker.autorun(function(){
        var c = getChapter();
        if (!c) return null;
        // set up d3 scales
        var xScale = d3.scale.linear()
            // 1 minute == 50px
            .domain([0,1])
            .range([0,50])
            ;

        //select elements that correspond to documents
        var bars = svg.selectAll("rect")
            .data(c.contents);

        //handle new documents via enter()
        bars.enter()
            .append("rect")
            .attr('height', function(d){ return xScale(d.length) })
            .attr("y", function(d){ return xScale(d.start) })
            .attr("x", function(d,i) { return i * 25 })
            .attr('width', 20)
            ;

        bars
            .transition()
            .attr('height', function(d){ return xScale(d.length)})
            ;

        bars.exit()
            .remove()
            ;

    });
};
