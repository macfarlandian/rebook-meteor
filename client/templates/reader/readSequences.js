Template.readSequences.helpers({
	getChapter: function () {
		return getChapter(this._id);
	}
});

Template.readSequences.onRendered(function() {
    $('#bookHome').dimmer('show');
    $('.rebook-sequence').animate({top: 0}, 1000);
});