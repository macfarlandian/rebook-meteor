Template.collectionBuild.helpers({
    collection: function(){
        return Collections.findOne({_id: Session.get('workData')});
    },
    getContents: function(){
        if (this.model == "Chapters") return getChapter(this._id);
        return Models[this.model].findOne(this._id);
    },
    length: function(){
        return this.getLength();
    },
    tScale: function(length){
        return tScale(length)/4 + "px";
    }
});
