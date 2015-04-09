Template.readBook.helpers({
	chapterQueue: function(){
		return Session.get('chapterQueue');
	},
	resource: function(){
        return Resources.findOne({"name": /bar tattoo/});
    },
    readingNow: function(){
    	return Placemarkers.findOne({userId: Session.get('userId'), book: Router.current().params.bookId});
    },
    getContents: function(){
    	return Models[this.model].findOne(this.container);
    },
    getTemplate: function(){
    	return 'read' + this.model;
    }
});

Template.readBook.events({
	'click #startButton': function (event) {
		var book = this;
		var first = _.findWhere(book.contents, {_id: book.start})

		$('#bookHome').dimmer('toggle');

		markPlace(first._id, first.model);
	}, 
	'sequence:end': function(event){
		console.log('sequence:end')
		// TODO: load the next gate target
		var bookId = Router.current().params.bookId;
		var book = Books.findOne({_id: bookId});
		var place = Placemarkers.findOne({userId: Session.get('userId'), book: bookId});
		var seq = this._id;
		// for now let's skip gates ... maybe they are an optional extension
		// assume the array is ordered
		var next = _.findIndex(book.contents, {_id: seq}) + 1;
		if (next < book.contents.length) {
			next = book.contents[next];
			markPlace(next._id, next.model)
		} else {
			// end of book
		}
	}
});