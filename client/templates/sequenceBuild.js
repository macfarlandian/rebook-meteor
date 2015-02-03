
Template.sequenceBuild.helpers({
    sequence: function(){
        return Sequences.findOne({_id: Session.get('workData')});
    },
    getChapter: function(_id){
        return getChapter(_id);
    },
    tScale: function(length){
        return tScale(length)/2 + "px";
    }
});

Template.sequenceBuild.rendered = function(){
    var seq = d3.select('.grid.sequence');
    Tracker.autorun(function(){
        seq.selectAll('.row.chapter')
            .data(function(){
                console.log(arguments, this)
                var chap = Chapters.find({_id: null});
                return []
            })
    });

}
