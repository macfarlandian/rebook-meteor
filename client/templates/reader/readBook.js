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
			place = Placemarkers.findOne({userId: Session.get('userId'), book: bookId});

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
	}
});