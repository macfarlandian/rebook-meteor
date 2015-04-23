Template.readSequences.helpers({
	getChapter: function () {
		return getChapter(this._id);
	}
});

Template.readSequences.onRendered(function() {
    var t = this;
    
    var place = getPlace();
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
        throttle: 500,
        onBottomVisible: function(){
            // add completed container to history, if not already there
            var path = getPath();
            if (!_.includes(path.containers, data._id)) {
                path.containers.push(data._id);
                ReadingPaths.update(path._id, {$set: {containers: path.containers}});
            }

            // signal up the scope that we've reached the end of this sequence
            $(this).trigger('sequence:end');
        }
    })
});