Template.readBook.helpers({
	readingNow: function(){
    	return Placemarkers.findOne({userId: Session.get('userId'), book: Router.current().params.bookId});
    },
    getContents: function(){
    	if (this.collection != undefined) return Collections.findOne(this.collection);
    	if (this.sequence != undefined) return Sequences.findOne(this.sequence);
    },
    getChapterName: function(){
    	if (this.chapter != undefined) return Chapters.findOne(this.chapter);
    	if (this.collection != undefined) return Collections.findOne(this.collection);
    	if (this.sequence != undefined) return Sequences.findOne(this.sequence);
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
    	return template;
    },
});

Template.readBook.events({
	'click #startButton': function (event) {
		var book = this;
		var first = book.contents[0];

		$('#bookHome').dimmer('toggle');
		
		if (first.model == 'Sequences') markPlace({sequence: first._id});
		if (first.model == 'Collections') markPlace({collection: first._id});

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
	}, 
	'sequence:end': function(event){
		var bookId = Router.current().params.bookId,
			book = Books.findOne({_id: bookId}),
			place = getPlace();

		if (place.collection != undefined) {
			// collections can contain sequences, so return to the collection home
		} else {
			// this was a top level sequence and we need to see what comes next in the book
			var seq = this._id;
			// for now let's skip gates ... maybe they are an optional extension
			// assume the array is ordered
			var next = _.findIndex(book.contents, {_id: seq}) + 1;
			if (next < book.contents.length) {
				next = book.contents[next];
				if (next.model == 'Sequences') markPlace({sequence: next._id})
				if (next.model == 'Collections') markPlace({collection: next._id})
			} else {
				// end of book
			}
		}
	},
	'collection:end': function(event){
		var bookId = Router.current().params.bookId,
			book = Books.findOne({_id: bookId}),
			place = getPlace();
		var coll = this._id;
		var next = _.findIndex(book.contents, {_id: coll}) + 1;
		if (next < book.contents.length) {
			next = book.contents[next];
			if (next.model == 'Sequences') markPlace({sequence: next._id})
			if (next.model == 'Collections') markPlace({collection: next._id})
		} else {
			// end of book
			$('.the-end').dimmer('show');
		}
	}
});

Template.readBook.onRendered(function(){
	var lastScroll = 0,
		t = this;
	t.$('.ui.sidebar')
	    .sidebar({
	    	transition: 'overlay',
	    	dimPage: false
	    })
	    ;
	$(window).scroll($.debounce(250, function(e){
		var newscroll = this.scrollY;
		if (newscroll < lastScroll) {
			$('.ui.sidebar.menuBar:not(.visible), .ui.sidebar.bookControls:not(.visible)').sidebar('show');
		} else if (newscroll > lastScroll) {
			$('.ui.sidebar.visible').sidebar('hide');
		}
		lastScroll = newscroll;
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
	    	var margin = {top: 20, right: 20, bottom: 30, left: 40},
			    // calculate the width dynamically based on available space
			    width = $('.chapterChart').width() - margin.left - margin.right,
			    height = 300 - margin.top - margin.bottom;

		    var x = d3.scale.ordinal()
		        .rangeRoundBands([0, width], .1);

		    var y = d3.scale.linear()
		        .range([height, 0]);

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
		    y.domain([0, d3.max(chaps, function(d) { return d.length; })]);

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
		          	.text("Length");

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
          		.attr("y", function(d) { return y(d.length); })
          		.attr("height", function(d) { return height - y(d.length); });
          	
          	bars.append('text')
          		.attr("transform", function(d) { 
          			var coords = {
          				x:  x(d.name) + (x.rangeBand() / 2),
          				y: y(d.length) - 5
          			};
          			return 'rotate(-90 '+ coords.x + ' ' + coords.y +') translate(' + coords.x + ' ' + coords.y + ')';
          		})
          		.text(function(d){ return d.name })
          		.attr('dy', 5)
          	
      		// add a partial progress bar to whichever bar is current
      		// bars.filter(function(d){ return d._id == place.chapter})
      		// 	.append('rect')
      		// 	.attr('class', 'partial')
      		// 	.attr("x", function(d) { return x(d.name); })
        //   		.attr("width", x.rangeBand())
        //   		.attr("y", function(d) { return y(d.length) + (height - y(d.length))/2; })
        //   		.attr("height", function(d) { 
        //   			// TODO: this is kind of a dumb solution just based on the height
        //   			// of the chapter element
        //   			var chapterElement = $('#' + d._id + ' article');
        //   			console.log(chapterElement.height(), chapterElement.offset().top, $(window).scrollTop())
        //   			return (height - y(d.length)) / 2; });
	    }

	    function type(d) {
	      d.wordcount = +d.wordcount;
	      return d;
	    }
	});
});