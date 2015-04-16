Template.readBook.helpers({
	readingNow: function(){
    	return Placemarkers.findOne({userId: Session.get('userId'), book: Router.current().params.bookId});
    },
    getContents: function(){
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
    }
});

Template.readBook.events({
	'click #startButton': function (event) {
		var book = this;
		var first = _.findWhere(book.contents, {_id: book.start})

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
	$(window).scroll(function(e){
		var newscroll = this.scrollY;
		if (newscroll < lastScroll) {
			$('.ui.sidebar:not(.visible)').sidebar('show');
		} else if (newscroll > lastScroll) {
			$('.ui.sidebar.visible').sidebar('hide');
		}
		lastScroll = newscroll;
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

    var svg = d3.select(".ui.sidebar.progress svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
	    .append("g")
	        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.csv("/wordcount.tsv", type, function(error, data) {
      console.log(data)
      x.domain(data.map(function(d) { return d.chapter; }));
      y.domain([0, d3.max(data, function(d) { return d.wordcount; })]);

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
          .attr("x", function(d) { return x(d.chapter); })
          .attr("width", x.rangeBand())
          .attr("y", function(d) { return y(d.wordcount); })
          .attr("height", function(d) { return height - y(d.wordcount); });

    });

    function type(d) {
      d.wordcount = +d.wordcount;
      return d;
    }
});