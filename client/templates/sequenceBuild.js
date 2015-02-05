
Template.sequenceBuild.helpers({
    sequence: function(){
        return Sequences.findOne({_id: Session.get('workData')});
    },
    getContents: function(){
        if (this.model == 'Chapters') return getChapter(this._id);
        // TODO: do this with a pub/sub callback automatically
        return Models[this.model].findOne(this._id);
    },
    length: function(){
        return this.getLength();
    },
    tScale: function(length){
        return tScale(length)/4 + "px";
    }
});
