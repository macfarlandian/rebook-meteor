Template.readChapters.helpers({
    mainTrack: function(){
        return _.where(this.contents, {track: 0})
    },

    resource: function(){
        return Resources.findOne({_id: this.resource_id});
    },

    isText: function(){
        return this.type == "text";
    },

    paras: function(text){
        if (text){
            var paras = text.split(/(?:\s*\r\n|\s*\n|\s*\r){2,}/gm);
            paras = _.map(paras, function(p){
                return {
                    text: p,
                    length: p.split(/\s+/).length
                }
            });
            _.reduce(paras, function(sum,cur){
                    var cumsum = sum + cur.length;
                    cur.end = cumsum;
                    return cumsum;
                },0)
                ;
            return paras;
        }
    }
});

Template.readChapters.onRendered(function(){
    var t = this; // to access the meteor template object in deeper scopes

    // watch for reader starting a new chapter
    $(t.firstNode).visibility({
        once: false,
        onUpdate: function(calc){
            // fade the color rails
            t.$('.fader').css({opacity: 1 - calc.percentagePassed});
        },
        onBottomPassed: function(calc){
            var path = getPath();
            if (!_.includes(path.path, t.data._id)){
                // on completion of a new chapter, add it to the path
                path.path.push(t.data._id);
                ReadingPaths.update(path._id, {$set: {path: path.path}});
            }
        }
    });

    // retrieve place marker
    var place = getPlace();

    // scroll to the most recent paragraph, if marked, if it's in this chapter
    if (place.chapter == t.data._id) {
        // if a chapter is marked
        if (place.paragraph != undefined) {
            // if a paragraph is marked, go to it
            var scrolltarget = $('#'+place.chapter + ' article > p').eq(place.paragraph).offset().top;
            $('html, body').scrollTop(scrolltarget);
        } else {
            // go to start of chapter
            $('html, body').animate({scrollTop: $('#'+place.chapter).offset().top}, 0)    
        }    
    }
    
    // watch for reader progressing to a new paragraph
    var paras = t.$('article > p');
    paras.visibility({
        once: false,
        onTopPassed: function(calc){
            // pause to make sure the user isn't just skimming past
            var p = this,
                place = getPlace();

            Meteor.setTimeout(function(){
                if (calc.passing) {
                    newMark = {
                        sequence: place.sequence,
                        collection: place.collection,
                        chapter: t.data._id,
                        paragraph: paras.index(p)
                    };
                    markPlace(newMark);
                }
            }, 750); //timer length should be the same as initial scroll time to prevent triggering here
        }
    });


    // progress bar stuff
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(10, "%");

    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.tsv("data.tsv", type, function(error, data) {
      x.domain(data.map(function(d) { return d.letter; }));
      y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Frequency");

      svg.selectAll(".bar")
          .data(data)
        .enter().append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return x(d.letter); })
          .attr("width", x.rangeBand())
          .attr("y", function(d) { return y(d.frequency); })
          .attr("height", function(d) { return height - y(d.frequency); });

    });

    function type(d) {
      d.frequency = +d.frequency;
      return d;
    }
        
});