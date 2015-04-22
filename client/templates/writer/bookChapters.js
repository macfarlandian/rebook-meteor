Template.bookChapters.helpers({
	parentName: function(){
		
	}
});

Template.bookChapters.onRendered(function(){
	this.$('.ui.accordion').accordion();
});