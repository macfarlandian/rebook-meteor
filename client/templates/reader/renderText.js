Template.renderText.helpers({
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
        return _.includes(['text', 'markdown', 'text/markdown', 'text/plain'], this.type);
    },
    isImage: function(){
        return this.type == "image";
    },
    isAudio: function(){
        return this.type == "audio";
    },
});

Template.renderText.onRendered(function() {
    // console.log(this.data)
    // tag block level
    // TODO: less dumb selector
    this.$('.cfiWrap').addClass('resource'+this.data._id);
});

Template.renderText.events({
	'click .cfiWrap': function (e) {
		// CFI shit
		
		var target = $(e.currentTarget),
			index = target.index(),
			tag = e.currentTarget.tagName,
			id = _.find(e.currentTarget.classList, function(cls){
				return cls.indexOf('resource') == 0;
			});

		console.log("#cfi(" + [tag,id,index].join(',') + ")");
	}
});