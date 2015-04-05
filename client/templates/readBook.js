Template.readBook.helpers({
	chapterQueue: function(){
		return Session.get('chapterQueue');
	},
	resource: function(){
        return Resources.findOne({"name": /bar tattoo/});
    },
});

Template.readBook.events({
	'click #startButton': function (event) {
		Session.set('chapterQueue', [this.start]);
	}
});