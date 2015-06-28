Template.readChapters.helpers({
    mainTrack: function(){
        return _.where(this.contents, {track: 0})
    },
    isText: function(){
        return _.includes(['text', 'markdown', 'text/markdown', 'text/plain'], this.type);
    },
    isImage: function(){
        return this.type == "image";
    },
    isAudio: function(){
        return this.type == "audio";
    },
});

Template.readChapters.events({
    'visibility:bottomvisible .rebook-chapter': function (event) {
        event.stopPropagation();
        var path = getPath();
        if (!_.includes(path.path, this._id)) {
            path.path.push(this._id);
            ReadingPaths.update(path._id, {$set: {path: path.path}});
        }
    },
    'visibility:toppassed p': function(event, template, passing, pIndex){
        // pause to make sure the user isn't just skimming past
        var p = this,
            place = getPlace();
        Meteor.setTimeout(function(){
            if (passing) {
                newMark = {
                    sequence: place.sequence,
                    collection: place.collection,
                    chapter: template.data._id,
                    paragraph: pIndex
                };
                markPlace(newMark);
            }
        }, 250); //timer length should be the same as initial scroll time to prevent triggering here
    }
});

Template.readChapters.onRendered(function(){
    var t = this; // to access the meteor template object in deeper scopes
    // detect end of chapter
    this.$('.rebook-chapter').visibility({
        once: false,
        throttle: 250,
        onBottomVisible: function(){
            $(this).trigger('visibility:bottomvisible');
        }
    });

    // calculate the number of mile markers based on screen height 
    // optimal = 1 / 2 or 3 screens 
    // minimum: one at the halfway point
    var screenHeight = $(window).height(),
        chapterElement = $('#' + t.data._id + ' article'),
        chapterHeight = chapterElement.height()
        markerCount = Math.floor(chapterHeight / screenHeight / 2),
        markerSpacing = Math.floor(chapterHeight / markerCount),
        i = 1;
    
    while (i < markerCount) {
        var markContainer = $('<div>')
            .addClass('milemark')
            .css('top', markerSpacing * i)
            // .text(Math.floor(markerSpacing * i / chapterHeight * 100) + "%")
            ;
        markContainer.appendTo(chapterElement);

        // add a donut chart to the markContainer
        var width = markContainer.width(),
            radius = width / 2,
            arc = d3.svg.arc()
                .outerRadius(radius - 1)
                .innerRadius(radius - 10),
            pie = d3.layout.pie()
                .sort(null)
                .value(function(d) { return d })
            svg = d3.select(markContainer[0]).append("svg")
                .attr("width", width)
                .attr("height", width)
                .append("g")
                    .attr("transform", "translate(" + width / 2 + "," + width / 2 + ")"),
            progress = markerSpacing * i / chapterHeight,
            data = [progress, 1 - progress],
            g = svg.selectAll(".arc")
                .data(pie(data))
                .enter().append("g")
                    .attr("class", "arc")
            ;

            g.append("path")
                .attr("d", arc)
                .style("fill", function(d,i) { return ['#848484', '#c9c9c9'][i] });
        i++;
    }

    // retrieve place marker
    var place = getPlace();

    // scroll to the most recent paragraph, if marked, if it's in this chapter
    if (place.chapter == this.data._id) {
        // if a chapter is marked
        if (place.paragraph != undefined) {
            // if a paragraph is marked, go to it

            // first check for CFI
            if ( isCfi() ){
                // get the cfi and highlight it and scroll to it
                var cfiString = Router.current().params.hash.substring(4, Router.current().params.hash.length - 1),
                    structure_markers = getCfiStructure(cfiString);
                
                if (structure_markers.length == 1){
                    // intra-p
                    var cfi = structure_markers[0],
                        char_range = getCfiCharRange(cfi),
                        para_pointer = getCfiParaPointer(cfi),
                        resource_id = para_pointer[1],
                        targetEl = $(para_pointer[0] + ".resource" + para_pointer[1]).eq(para_pointer[2]).get(0)
                        ;
                    
                    makeHighlight(targetEl, char_range);

                    var scrolltarget = $('#'+place.chapter + ' article > p')
                        .eq(place.paragraph)
                        .find(".highlight")
                        .offset().top;

                } else {
                    // spanning ps
                    var scrolltarget = $('#'+place.chapter + ' article > p').eq(place.paragraph).offset().top;
                }
                
            } else {
                var scrolltarget = $('#'+place.chapter + ' article > p').eq(place.paragraph).offset().top;
            }
            
            $('html, body').scrollTop(scrolltarget);
        } else {
            // go to start of chapter
            $('html, body').animate({scrollTop: $('#'+place.chapter).offset().top}, 0)    
        }    
    }
    
    // watch for reader progressing to a new paragraph
    var paras = this.$('article > p');
    paras.visibility({
        throttle: 200,
        once: false,
        onTopPassed: function(calc){
            $(this).trigger('visibility:toppassed', [calc.passing, paras.index(this)]);
        }
    });

    // audio configurations
    var audios = this.$('audio');
    audios.visibility({
        onTopVisible: function(calc){
            var el = $(this);
            if (el.hasClass('autoplay')) {
                // debounce to make sure we're not rapidly scrolling past it
                Meteor.setTimeout(function(){
                    if (calc.visible) el.trigger('play');    
                }, 200)  
            }
        }

    });  
});


