Template.read.helpers({
    resource: function(){
        return Resources.findOne({"name": /bar tattoo/});
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
});
