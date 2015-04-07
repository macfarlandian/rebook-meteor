Template.readSequences.helpers({
	getChapter: function () {
		return getChapter(this._id);
	}
});

Template.readSequences.onRendered(function() {
    $('#bookHome').dimmer('show');
    $(window).scrollTop($('.rebook-sequence')[0].offsetTop);

    var data = this.data;

    this.$('.rebook-sequence').visibility({
    	onPassing: function(){
    		Session.set('container', {_id: data._id, model: 'Sequences'});
    	}
    });
});