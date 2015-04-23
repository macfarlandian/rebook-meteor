Template.bookChapters.helpers({
	parentName: function(){
		var parent = Containers.findOne({'contents._id': this._id});
		if (parent) return parent.name;
	}
});

Template.bookChapters.onRendered(function(){
	this.$('.ui.accordion').accordion();
});