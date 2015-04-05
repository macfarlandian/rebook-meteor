Template.library.helpers({
	books: function () {
		return Books.find();
	},
	linkParams: function(){
		return {_id: this._id}
	}
});