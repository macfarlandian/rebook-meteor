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
    paras: function(text){
        return text.split(/(\r\n|\n|\r)/gm)
    },
    length: function(){
        // for now, testing with one text file
        var d = Resources.findOne({"type": "text"});
            if (d == undefined) return d;
        // use rough word count (tokenized by whitespace)
        // divided by 250 words per minute (english avg)
        return d.contents.split(/\s+/).length / 250;
    },
    chapter: getChapter,
    title: function(){
        // for now, testing with one text file
        var d = Resources.findOne({"type": "text"});
            if (d == undefined) return d;
        return d.name.split(/-\d+-\.txt/)[0];
    }
});

Template.schemtest.rendered = function(){
    // do d3 stuff
    var timeline = d3.select('#timeline');
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
        var bars = timeline.selectAll(".bar")
            .data(c.contents);

        //handle new documents via enter()
        bars.enter()
            .append("div")
            .classed("bar column", true)
            .style("height", function(d){ return xScale(d.length) + "px" })
            .style("top", function(d){ return xScale(d.start) + "px" })
            // .style("left", function(d,i) { return i * 25 + "px" })
            // .style("width", "20px")
            ;

        bars
            .transition()
            .style("height", function(d){ return xScale(d.length) + "px"})
            ;

        bars.exit()
            .remove()
            ;

    });

    // semantic UI
    $('.ui.sticky')
        .sticky({
            context: '#main'
        });
;
};
