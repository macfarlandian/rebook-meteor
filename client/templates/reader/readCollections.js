Template.readCollections.helpers({
	choice: function(){
		var choice = {},
			place = getPlace();
		if (place.sequence != undefined) {
			choice.template = "readSequences";
			choice.data = Sequences.findOne(place.sequence);
		}
		return choice
	},

	isChapter: function(){
		return this.model == 'Chapters'
	},
	
	getChapter: getChapter,
	
	isRead: function () {
		var bookQuery = {
			userId: Session.get('userId'),
			book: Router.current().params.bookId
		};
		var path = ReadingPaths.findOne(bookQuery);
		if (path) return _.contains(path.path, this._id) || _.contains(path.containers, this._id);
	},

	sequenceName: function(){
		var seq = Sequences.findOne(this._id);
		if (seq) return seq.name;
	}
});

Template.readCollections.events({
	'click nav.next a.item': function (event) {
		var context = this;

		var place = getPlace();
		
		if (context.model == 'Sequences') place.sequence = context._id;
		if (context.model == 'Chapters') place.chapter = context._id;

		markPlace(place);

	}
});