Template.readSequences.helpers({
	getChapter: function () {
		return getChapter(this._id);
	}
});

Template.readSequences.onRendered(function() {
    var t = this;
    $('#bookHome').dimmer('show');
    
    var place = Placemarkers.findOne({userId: Session.get('userId'), book: Router.current().params.bookId});
    if (place.chapter == undefined) {
        // go to beginning of sequence
        $('html, body').animate({'scrollTop': $('.rebook-sequence').offset().top}, 0);
    }

    var data = this.data;

    this.$('.rebook-sequence').visibility({
    	onTopVisible: function(){
    		Session.set('container', {_id: data._id, model: 'Sequences'});
    	}
    });
    this.$('.rebook-sequence .chapters').visibility({
        once: false,
        onBottomPassed: function(){
            $(this).trigger('sequence:end');
        }
    })
});