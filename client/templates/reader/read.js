Template.read.helpers({
    resource: function(){
        return Resources.findOne({"name": /bar tattoo/});
    },
    chapter: function(){
        var _id = this.toString();
        return Chapters.findOne(_id);
    },
    paras: function(text){
        if (text){
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
        }
    },
});

Template.read.onRendered(function() {
    this.$('.rebook-chapter').animate({top: 0}, 1000);
});