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
	}, 

	allRead: function(){
		var bookQuery = {
			userId: Session.get('userId'),
			book: Router.current().params.bookId
		};
		var path = ReadingPaths.findOne(bookQuery);
		if (path){
			var ids = _.pluck(this.contents, '_id');
			return _.reduce(ids, function(memo, val){
				return memo && (_.contains(path.path, val) || _.contains(path.containers, val))
			}, true)
		}
	}
});

Template.readCollections.events({
	'click nav.next a.item': function (event) {
		var context = this;

		var place = getPlace();
		place.chapter = undefined;
		place.sequence = undefined;
		
		if (context.model == 'Sequences') place.sequence = context._id;
		if (context.model == 'Chapters') place.chapter = context._id;

		markPlace(place);

	}
});

Template.readCollections.onRendered(function(){
	this.$('nav.next').visibility({
		throttle: 500,
		onBottomPassed: function(){
			// add completed container to history, if not already there
            var path = getPath();
            if (!_.includes(path.containers, this.data._id)) {
                path.containers.push(this.data._id);
                ReadingPaths.update(path._id, {$set: {containers: path.containers}});
            }

			// signal to the book that we've reached the end of this collection
			$(this).trigger('collection:end');
		}
	});
});