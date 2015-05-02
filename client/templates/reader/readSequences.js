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
        once: false,
        throttle: 250,
        onBottomVisible: function(){
            $(this).trigger('visibility:bottomvisible');
        }
    });
});

Template.readSequences.events({
    'visibility:bottomvisible .rebook-sequence': function (event) {
        event.stopPropagation();
        var path = getPath();
        if (path) {
            if (!_.includes(path.containers, this._id)) {
                path.containers.push(this._id);
                ReadingPaths.update(path._id, {$set: {containers: path.containers}});
            }   
        }
    }
});