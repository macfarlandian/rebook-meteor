Template.bookChapters.helpers({
	parentName: function(){
		var parent = Containers.findOne({'contents._id': this._id});
		if (parent) return parent.name;
	},
	firstOfGroup: function(){
		var parent = Containers.findOne({'contents._id': this._id});
		if (_.findIndex(parent.contents, {_id: this._id}) == 0) return true;
		return false;
	}
});

Template.bookChapters.onRendered(function(){
	this.$('.ui.accordion').accordion();
});