Template.library.helpers({
	books: function () {
		return Books.find();
	},
	linkParams: function(){
		return {bookId: this._id}
	}
});

Template.library.onRendered(function(){
	$('body').removeClass();
});