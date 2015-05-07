Template.readBook.helpers({
	readingNow: function(){
		return Placemarkers.findOne({userId: Session.get('userId'), book: Router.current().params.bookId});
	},
	getContents: function(){
		if (this.collection != undefined) return Containers.findOne(this.collection);
		if (this.sequence != undefined) return Containers.findOne(this.sequence);
		if (this.sequence == undefined && this.collection == undefined && this.chapter != undefined) {
			return Chapters.findOne(this.chapter);
		}
	},
	getChapterName: function(){
		if (this.chapter != undefined) return Chapters.findOne(this.chapter);
		if (this.collection != undefined) return Containers.findOne(this.collection);
		if (this.sequence != undefined) return Containers.findOne(this.sequence);
	},
	getTemplate: function(){
    	// Collections can contain Sequences, but not vice versa.
    	// So if a Collection is present it dominates.
    	var template;
    	if (this.sequence != undefined) {
    		template = 'readSequences';
    	}
    	if (this.collection != undefined) {
    		template = 'readCollections';
    	}
    	if (this.sequence == undefined && this.collection == undefined && this.chapter != undefined) {
    		template = 'readChapters';
    	}
    	return template;
    },
});

Template.readBook.events({
	'click #startButton': function (event) {
		var book = this;
		var first = book.contents[0];
		
		if (first.type == 'sequence') markPlace({sequence: first._id});
		if (first.type == 'collection') markPlace({collection: first._id});
		if (first.model == 'Chapters') markPlace({chapter: first._id});

		// create a history entry for this book if not exists
		var bookQuery = {
			userId: Session.get('userId'),
			book: Router.current().params.bookId
		};

		if (ReadingPaths.findOne(bookQuery) == undefined) {
			bookQuery.path = [];
			bookQuery.containers = [];
			ReadingPaths.insert(bookQuery);
		}
	},
	'click .progressButton': function (event) {
		$('.ui.sidebar.chapterChart').sidebar('toggle');
		$(event.target).toggleClass('active');
	}, 
	'visibility:bottomvisible .rebook-page': function(event, template){
		// add completed container to history, if not already there
        var path = getPath(),
            place = getPlace();
        
        // if it's a container
        if (place.sequence != undefined || place.collection != undefined) {
        	containerId = place.collection;
        	if (!containerId) containerId = place.sequence;
        	if (!_.includes(path.containers, containerId)) {
        		path.containers.push(containerId);
        		ReadingPaths.update(this._id, {$set: {containers: path.containers}});
        	}	
        }
        
        // advance page
		var bookId = Router.current().params.bookId,
		book = Books.findOne({_id: bookId});

		if (place.collection == undefined) {
			// this was a top level sequence or chapter and we need to see what comes next in the book
			var seq = place.sequence;
			if (!seq) seq = place.chapter;
			// for now let's skip gates ... maybe they are an optional extension
			// assume the array is ordered
			var next = _.findIndex(book.contents, {_id: seq}) + 1;
			if (next < book.contents.length) {
				next = book.contents[next];
				if (next.type == 'sequence') {
					markPlace({sequence: next._id, collection: undefined, chapter: undefined, paragraph: undefined});
				} else if (next.type == 'collection') {
					markPlace({collection: next._id, sequence: undefined, chapter: undefined, paragraph: undefined});
				} else if (next.model == 'Chapters') {
					markPlace({chapter: next._id, collection: undefined, sequence: undefined, paragraph: undefined})
				}
			} else {
				// end of book
				console.log('end of book')
			}
		} else {
			var coll = this._id;
			// check that the collection is finished before continuing
			path = getPath();
			if (path){
				var ids = _.pluck(this.contents, '_id');
				var allRead = _.reduce(ids, function(memo, val){
					return memo && (_.contains(path.path, val) || _.contains(path.containers, val))
				}, true)
			}

			if (allRead == true) {
				var next = _.findIndex(book.contents, {_id: coll}) + 1;
				if (next < book.contents.length) {
					next = book.contents[next];
					if (next.type == 'sequence') {
						markPlace({sequence: next._id, collection: undefined, chapter: undefined, paragraph: undefined});
					} else if (next.type == 'collection') {
						markPlace({collection: next._id, sequence: undefined, chapter: undefined, paragraph: undefined});
					} else if (next.model == 'Chapters') {
						markPlace({chapter: next._id, collection: undefined, sequence: undefined, paragraph: undefined})
					}
				} else {
					// end of book
					console.log('end of book')
				}
			}
		}
		$(window).scrollTop(0)
	}
});

Template.readBook.onRendered(function(){
	// d3 setup for the progress chart
	var margin = {top: 20, right: 20, bottom: 30, left: 40},
	    // calculate the width dynamically based on available space
	    width = $('.chapterChart').width() - margin.left - margin.right,
	    height = 300 - margin.top - margin.bottom,
	    activeStrokeWidth = 4;

	    var x = d3.scale.ordinal()
	    .rangeRoundBands([0, width], .1);

	    var y = d3.scale.linear()
	    .range([height, 0])
	    .clamp(true);

    // detect scrolling up
    var lastScroll = 0,
    t = this;
    t.$('.ui.sidebar')
    .sidebar({
    	transition: 'overlay',
	    	// dimPage: false
	    })
    ;

    Tracker.autorun(function () {
    	var place = getPlace();
    	if (!place) return;
		// detect end of page
		if (place.collection != undefined) var data = Containers.findOne(place.collection);
		if (place.sequence != undefined) var data = Containers.findOne(place.sequence);
		if (place.sequence == undefined && place.collection == undefined && place.chapter != undefined) {
			var data = Chapters.findOne(place.chapter);
		}
		havePlace = getPlace() != undefined;
		// if (havePlace && place.paragraph == undefined) $(window).scrollTop(0);
		this.$('.rebook-page').visibility({
			once: false,
			throttle: 500,
			onBottomVisible: function(){
            	$(this).trigger('visibility:bottomvisible');
        	}    
	    })
	});

$(window).scroll($.debounce(100, function(e){
	var newscroll = this.scrollY;
	if (newscroll < lastScroll) {
		$('.ui.sidebar.menuBar:not(.visible), .ui.sidebar.chapterChart:not(.visible)').sidebar('show');
	} else if (newscroll > lastScroll) {
		$('.ui.sidebar.visible').sidebar('hide');
	}
	lastScroll = newscroll;

	// update partial progress bar on whichever bar is current
	var bars = d3.selectAll(".ui.sidebar.chapterChart .card .bar"),
	place = getPlace();
	if (place == undefined) return;

	// TODO: this is kind of a dumb solution just based on the height
	// of the chapter element
	var chapterElement = $('#' + place.chapter + ' article');
	// short circuit on loading a new chapter
	if (chapterElement.length == 0) return;
	var chapterSize = chapterElement.height(),
		chapterProgress = ($(window).scrollTop() - chapterElement.offset().top) / chapterSize;
		
	bars.filter(function(d){ return d._id == place.chapter})
		.select('.partial')
		.transition()
		.attr("y", function(d) { 
				// debugger;
				return y(d.wordcount * chapterProgress) + activeStrokeWidth / 2

			})
	.attr("height", function(d) { 
		return height - y(d.wordcount * chapterProgress) - activeStrokeWidth; 
	});
}));

	// progress bar stuff
	Tracker.autorun(function () {
		
		var book = Books.findOne({_id: Router.current().params.bookId}),
		path = getPath(),
		place = getPlace();

		if (book) {
	    	// initialize path if it's empty
	    	if (path == undefined) path = {path: []};

	    	var chaps = book.allChapters();

	    	var xAxis = d3.svg.axis()
	    	.scale(x)
	    	.orient("bottom")
	    	.tickFormat("")
	    	.innerTickSize(0);

	    	var yAxis = d3.svg.axis()
	    	.scale(y)
	    	.orient("left")
	    	.ticks(10);

		    // clear any existing SVG, if exists
		    d3.select(".ui.sidebar.chapterChart svg").remove();

		    var svg = d3.select(".ui.sidebar.chapterChart .card")
		    .append('svg')
		    .attr("width", width + margin.left + margin.right)
		    .attr("height", height + margin.top + margin.bottom)
		    .append("g")
		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		    x.domain(chaps.map(function(d) { return d.name; }));
		    y.domain([0, d3.max(chaps, function(d) { return d.wordcount; })]);

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
		    .text("Words");

		    var bars = svg.selectAll(".bar")
		    .data(chaps)
		    .enter().append("g")
		    .attr("class", "bar")
		    .classed("read", function(d){
		    	if (_.includes(path.path, d._id)) return true;
		    	return false;
		    })
		    .classed("current", function(d){
		    	if (place && d._id == place.chapter) return true;
		    	return false;
		    });

		    bars.append('rect')
		    .attr("x", function(d) { return x(d.name); })
		    .attr("width", x.rangeBand())
		    .attr("y", function(d) { return y(d.wordcount); })
		    .attr("height", function(d) { return height - y(d.wordcount); })
		    .attr("stroke-width", function(d){
		    	if (place && d._id == place.chapter) return activeStrokeWidth
		    });

		    bars.append('rect')
		    .classed('partial', true)
		    .attr("x", function(d) { return x(d.name) + activeStrokeWidth / 2; })
		    .attr("width", x.rangeBand() - activeStrokeWidth)
		    .attr("y", function(d) { return y(d.wordcount); })
		    .attr("height", 0);

		    bars.append('text')
		    .attr("transform", function(d) { 
		    	var coords = {
		    		x:  x(d.name) + (x.rangeBand() / 2),
		    		y: y(d.wordcount) - 5
		    	};
		    	return 'rotate(-90 '+ coords.x + ' ' + coords.y +') translate(' + coords.x + ' ' + coords.y + ')';
		    })
		    .text(function(d){ return d.name })
		    .attr('dy', 5)
		}

		function type(d) {
			d.wordcount = +d.wordcount;
			return d;
		}
	});
});