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
	'click p': function(e){
		var targetEl = $('p').has('.highlight');
		// clear any highlights
		targetEl.text(targetEl.text());
		// clear the CFI hash
		window.location.hash = "cfi";
	},
	'mouseup': function(e){
		var sel = window.getSelection();
		if (sel.type == "Range") {
			// identify beginning/end paragraphs
				// (anchor / focus)

			var start = sel.anchorNode,
				startP = findP(start),
				end = sel.focusNode,
				endP = findP(end),
				cfiString = '';	
			
			if (startP == endP) {
				var tag = startP.tagName,
					target = $(startP),
					id = _.find(startP.classList, function(cls){
						return cls.indexOf('resource') == 0;
					}).substring('resource'.length),
					index = target.index(tag + '.resource' + id)
					;

				var pString = [tag,id,index].join(",");

				// get character range
				// set start as smaller value regardless of the selection direction
				var startOffset = getCharOffsetRelativeTo(startP, start, _.min([sel.anchorOffset,sel.focusOffset])),
					endOffset = getCharOffsetRelativeTo(startP, end, _.max([sel.anchorOffset,sel.focusOffset]));
				
				// test that node-to-element offset is correct
				// console.log(sel, target.text().substring(startOffset, endOffset));
				var cString = "[" + startOffset + ":" + endOffset + "]";
				cfiString = pString + cString;
				makeHighlight(startP, [startOffset, endOffset]);

			} else {
				// get p anchor strings
				var tag = startP.tagName,
					target = $(startP),
					id = _.find(startP.classList, function(cls){
						return cls.indexOf('resource') == 0;
					}).substring('resource'.length),
					index = target.index(tag + '.resource' + id)
					;

				var pString = {"start": [tag,id,index].join(",")};

				tag = endP.tagName,
				target = $(endP),
				id = _.find(endP.classList, function(cls){
					return cls.indexOf('resource') == 0;
				}),
				index = target.index(tag + '.resource' + id)
				;

				pString.end = [tag,id,index].join(",");

				// get start and end character offsets
				var startOffset = getCharOffsetRelativeTo(startP, start, sel.anchorOffset),
					endOffset = getCharOffsetRelativeTo(endP, end, sel.focusOffset)
					;
				pString.start += "[" + startOffset + ":]";
				pString.end += "[:" + endOffset + "]";

				cfiString = pString.start + "|" + pString.end
			}

			var cfi = 'cfi(' + cfiString + ')'
			// construct the CFI string accordingly
			// do something useful with it
			window.location.hash = cfi;
		}
	}
});

function findP(node){
	// go up the dom tree until you find a p to anchor the CFI to
	if (node.nodeType == node.ELEMENT_NODE) {
		var el = node;
	} else {
		var el = node.parentElement;
	}

	if (el.tagName != "P") {
		el = $(el).parents('p.cfiWrap').get(0);
	}

	return el;

}

function getCharOffsetRelativeTo(container, node, offset) {
    var range = document.createRange();
    range.selectNodeContents(container);
    range.setEnd(node, offset);
    return range.toString().length;
}