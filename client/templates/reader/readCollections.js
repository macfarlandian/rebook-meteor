Template.readCollections.helpers({
	choose: function(){
		var place = Placemarkers.findOne({userId: Session.get('userId'), book: Router.current().params.bookId});
		return place.chapter == "choose"
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
		return _.contains(path.path, this._id) || _.contains(path.containers, this._id);
	},

	sequenceName: function(){
		return Sequences.findOne(this._id).name;
	}
});

Template.readCollections.onCreated(function(){
	var place = Placemarkers.findOne({userId: Session.get('userId'), book: Router.current().params.bookId});
	if (place.chapter == undefined) markPlace(this.data._id, 'Collections', 'choose');
})

Template.readCollections.events({
	'click nav.next a.item': function (event) {
		console.log(this)
	}
});