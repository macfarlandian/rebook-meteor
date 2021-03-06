Template.contentPreview.helpers({
    isSequence: function(){
        return this.type == 'sequence'
    },
    isChapter: function(){
        return this.model == 'Chapters'
    },
    resource: function(){
        return Resources.findOne(Session.get('previewData'));
    },
    paras: function(text){
        var paras = text.split(/(?:\s*\r\n|\s*\n|\s*\r){2,}/gm);
        // paras = _.map(paras, function(p){
        //     var words = p.split(/\s+/);
        //     return words;
        // })
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
        return paras
    },
    markOverlaps: function(){
        if (this == undefined) return this;
        // does anything overlap with this paragraph?
        var test = _.some(Session.get('overlaps'), function(cur){
            return (cur.start < this.end && cur.start > this.end-this.length)
            || (cur.end < this.end && cur.end > this.end-this.length)
        }, this);
        if (test) {
            var start = [], end = [];
            _.each(Session.get('overlaps'), function(cur){
                if (cur.start < this.end && cur.start > this.end-this.length){
                    start.push(cur.name);
                }
                if (cur.end < this.end && cur.end > this.end-this.length){
                    end.push(cur.name);
                }
            }, this);
            return {start: start, end: end}
        } else {
            return test;
        }

    }
});

Template.contentPreview.onRendered(function(){
    var prevArea = this.$('.previewArea'),
        height = $(window).height() - prevArea.offset().top; 
    prevArea.height(height);

    // make scrolling update scrubber position
    prevArea.scroll(function(e){
        var scrollPct = prevArea.scrollTop() / prevArea.get(0).scrollHeight;
        Session.set('previewScrollPct', scrollPct);
    })

    Tracker.autorun(function () {
        var previewScrollPct = Session.get('previewScrollPct');
        if (previewScrollPct) {
            prevArea.scrollTop(prevArea.get(0).scrollHeight * previewScrollPct);
        }
    });
});
