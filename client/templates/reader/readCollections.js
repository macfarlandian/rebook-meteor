Template.readCollections.helpers({
	choice: function(){
		var choice = {},
			place = getPlace();
		if (place.sequence != undefined) {
			choice.template = "readSequences";
			choice.data = Containers.findOne(place.sequence);
		} else if (place.chapter != undefined) {
			choice.template = "readChapters";
			choice.data = Chapters.findOne(place.chapter);
		}
		return choice
	},

	isChapter: function(){
		return this.model == 'Chapters'
	},
	
	getChapter: getChapter,
	
	isRead: function () {
		var path = getPath();
		if (path) return _.contains(path.path, this._id) || _.contains(path.containers, this._id);
	},

	sequenceName: function(){
		var seq = Containers.findOne(this._id);
		if (seq) return seq.name;
	}, 

	allRead: function(){
		var path = getPath();
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
		place.paragraph = undefined;
		
		if (context.type == 'sequence') place.sequence = context._id;
		if (context.model == 'Chapters') place.chapter = context._id;

		markPlace(place);
		$(window).scrollTop(0)
	}
});