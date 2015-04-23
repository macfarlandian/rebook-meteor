var wordToPixel = 50;

var bookScale = d3.scale.linear()
    .domain([0, wordToPixel])
    .rangeRound([0,1]);

Template.bookStructure.helpers({
    contentHeight: bookScale,
});

Template.bookStructure.onRendered(function(){
    
    this.autorun(function(){
        var data = Template.currentData();
        if (data == null) return;

        var svg = d3.select('svg.scale'),
            totalwords = d3.sum(data, function(d){ return d.wordcount }),
            height = bookScale(totalwords);

        var axisScale = d3.scale.linear()
            .domain([0,totalwords])
            .range([0, height]);
        
        var axis = d3.svg.axis()
            .scale(axisScale)
            .orient('right')

        svg
            .attr('height', height)
            .append('g')
            .classed('axis', true)
            .call(axis);

        svg.selectAll('.tick')
            .append('line')
            .classed('grid', true)
            .attr('x', 6)
            .attr('x2', '100%')
            .attr('y2', 0);

        svg.selectAll('.tick text')
            .attr('dy', 10)
            .attr('x', 3);

        svg.select('.axis')
            .append('text')
            .text('words')
            // .attr('text-anchor', 'end')
            // .attr('transform', 'rotate(-90 0 0)')
            .attr('dy', -3)
            .attr('x', 3)
            .style('font-style', 'italic')

    });
    
});

Template.bookStructure.events({
    'click .bookStructure': function (e) {
        $('.scrubber').css('transform', 'translateY('+(e.pageY - $(e.currentTarget).offset().top)+'px)')
    },
    'click .content': function (e) {
        var add = true;
        if (_.includes(e.target.classList, 'active')) add = false;
        $('.column.content').removeClass('active');
        if (add) $(e.target).addClass('active');
    }
});
