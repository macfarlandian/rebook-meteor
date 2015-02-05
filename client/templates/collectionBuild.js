Template.collectionBuild.helpers({
    collection: function(){
        return Collections.findOne({_id: Session.get('workData')});
    },
    getChapter: function(_id){
        return getChapter(_id);
    },
    tScale: function(length){
        return tScale(length)/2 + "px";
    }
});
