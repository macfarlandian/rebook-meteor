Template.allBooks.helpers({
	myBooks: function () {
		return Books.find({}, {sort: [['lastEdited', 'desc']]});
	},
	editTime: function(){
		return moment(this.lastEdited).fromNow();
	},
	bookId: function(){
		return {bookId: this._id};
	}
});

Template.allBooks.events({
	'click a.edit': function () {
		Books.update({_id: this._id}, {$set: {lastEdited: Date.now()}});
	},

	'click a.delete': function(){
		var result = window.confirm("Are you sure you want to delete " + this.name + "?");

		if(result) Books.remove({_id: this._id});
	}
});