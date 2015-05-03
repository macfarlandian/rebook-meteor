Template.previewChapter.helpers({
	mainTrack: function(){
        return _.where(this.contents, {track: 0})
    },
    trackOverlap: function(contents){
        var para = this;
        var otherTracks = _.filter(contents, function(item){
            return item.track > 0;
        });
        return _.filter(otherTracks, function(item){
            return (item.start >= para.end - para.length) && (item.start <= para.end);
        });
    },
    isText: function(){
        return _.includes(['text', 'markdown', 'text/markdown'], this.type);
    },
    isImage: function(){
        return this.type == "image";
    },
    isAudio: function(){
        return this.type == "audio";
    },
    paras: function(text){
        if (text){
            var paras = text.split(/(?:\s*\r\n|\s*\n|\s*\r){2,}/gm);
            paras = _.map(paras, function(p){
                return {
                    text: p,
                    length: p.split(/\s+/).length
                }
            });
            _.reduce(paras, function(sum,cur){
                    var cumsum = sum + cur.length;
                    cur.end = cumsum;
                    return cumsum;
                },0)
                ;
            return paras;
        }
    }
});

Template.previewChapter.onRendered(function(){
    Meteor.setTimeout(function(){
        var previewScrollPct = Session.get('previewScrollPct'),
            prevArea = $('.previewArea');
        
        if (previewScrollPct) {
            prevArea.scrollTop(prevArea.get(0).scrollHeight * previewScrollPct);
        }  
    }, 100)
});