
Template.sequenceBuild.helpers({
    sequence: function(){
        return Sequences.findOne({_id: Session.get('workData')});
    },
    getContents: function(){
        if (this.model == 'Chapters') return getChapter(this._id);
        // TODO: do this with a pub/sub callback automatically
        return Models[this.model].findOne(this._id);
    },
    length: function(){
        return this.getLength();
    },
    tScale: function(length){
        return tScale(length)/4 + "px";
    }
});

Template.sequenceBuild.rendered = function(){
    // do d3 stuff
    Tracker.autorun(function(){

        d3.select('#timeline').remove();

        var timeline = d3.select('.tlcontainer')
            .append('div')
            .attr('id', 'timeline')
            .attr('class', 'ui padded eight column grid')
            ;

        var s = Sequences.findOne({_id: Session.get('workData')});
        if (!s) return null;

        for (var i = 0; i < s.contents.length; i++) {

        var c = getChapter(s.contents[i]._id);

        var chap = timeline.append('div')
            .attr('class', 'row chapter')
            .style({height: tScale(c.length)+1+'px'})
            ;

        //select elements that correspond to documents
        var bars = chap.selectAll(".bar")
            .data(c.contents, function(d){ return d._id })
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
    }
    // timeline axis display
    var axisScale = d3.scale.linear()
    .domain([0, s.getLength()])
    .range([0, minute * s.getLength()])
    ;
    var tAxis = d3.svg.axis()
    .scale(axisScale)
    .orient('right')
    .ticks(Math.floor(s.getLength()))
    ;

    d3.select('#tAxis')
    .attr('height', axisScale(s.getLength()) + 20)
    .append('g')
    .attr('transform', 'translate(0,10)')
    .call(tAxis)
    ;
    d3.select('#gridlines')
    .attr('height', axisScale(s.getLength()) + 20)
    .append('g')
    .attr('transform', 'translate(0,10)')
    .call(d3.svg.axis()
    .scale(axisScale)
    .orient('right')
    .ticks(Math.floor(s.getLength()) * 2)
    .tickSize(9999,0)
    .tickFormat("")
    )
    ;
});

}
