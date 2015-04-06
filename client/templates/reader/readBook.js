Template.readBook.helpers({
	chapterQueue: function(){
		return Session.get('chapterQueue');
	},
	resource: function(){
        return Resources.findOne({"name": /bar tattoo/});
    },
    getContents: function(){
    	return Models[this.model].findOne(this._id);
    },
    getTemplate: function(){
    	return 'read' + this.model;
    }
});

Template.readBook.events({
	'click #startButton': function (event) {
		var book = this;
		var first = _.findWhere(book.contents, {_id: book.start})
		Session.set('chapterQueue', [{model: first.model, _id: first._id}]);

		$('#bookHome').dimmer('toggle');
	}
});