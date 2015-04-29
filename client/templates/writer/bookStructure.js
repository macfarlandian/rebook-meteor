var wordToPixel = 50;

var bookScale = d3.scale.linear()
    .domain([0, wordToPixel])
    .rangeRound([0,1]);

var flags = {
    dragTimeline: false,
};

Template.bookStructure.helpers({
    contentHeight: bookScale,
    collectionWidth: function(){
        // 16 is the default number of columns in semantic ui grid
        return numToWords(d3.min([this.contents.length, 16]))
    },
});

Template.bookStructure.onRendered(function(){
    // initial marking based on scrubber start pos
    markOverlaps();
    updatePreview();
    
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
            .attr('dy', -3)
            .attr('x', 3)
            .style('font-style', 'italic');

        var drag = d3.behavior.drag()
        drag.on("drag", function(){
            // prevent from dragging beyond event bounds
            var ypos = d3.min([d3.event.y - $(this).position().top, $(this).height()]);
            ypos = d3.max([ypos, 0]);
            $('.scrubber').css('transform', 'translateY('+ypos+'px)')
        });
        drag.on('dragend', function(){
            markOverlaps();
            // use info of whatever content is marked "active"
            updatePreview();
        })

        d3.select('.bookStructure').call(drag);

    });
    
});

Template.bookStructure.events({
    'click .bookStructure': function (e) {
        $('.scrubber').css('transform', 'translateY('+(e.pageY - $(e.currentTarget).offset().top)+'px)')
        markOverlaps();
        updatePreview();
    },
    'click .content': function (e) {
        var add = true;
        if (_.includes(e.target.classList, 'active')) add = false;
        $('.column.content').removeClass('active');
        if (add) $(e.target).addClass('active');
        updatePreview();
    }
});

function updatePreview(){
    var active = $('.bookStructure .content').filter('.active');
    if (active.length != 0) {
        var previewContent = {_id: active.attr('id')};
        if (active.hasClass('sequence')) { 
            previewContent.type = 'sequence'
        } else { 
            previewContent.type = 'chapter' 
        } 
        Session.set('previewContent', previewContent);

        var scrollPct = ($('.scrubber').offset().top - active.offset().top) / active.outerHeight();
        Session.set('previewScrollPct', scrollPct);
    }
}

function markOverlaps(){
    var contents = $('.bookStructure .content');
    var overlaps = contents.filter(function(){
        return _.inRange($('.scrubber').offset().top, $(this).offset().top, $(this).offset().top + $(this).outerHeight());
    });
    current = overlaps.first();
    
    if (overlaps.filter('.active').length == 0) {
        // no active content in this collection
        contents.removeClass('active');
        current.addClass('active');
    } 
}
