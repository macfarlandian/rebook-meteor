Template.library.helpers({
	books: function () {
		return Books.find({}, {sort: [["lastOpened", "desc"]]});
	},
	linkParams: function(){
		return {bookId: this._id}
	},
	spineWidth: function(){
		var width = spineWidth(this.wordcount);
		width =  d3.max([width, 50]); // min width is 50
		return "min-height: " + width + "px;";
	},
	formatWordcount: function(){
		return d3.format(',.0f')(this.wordcount)
	},
	readTime: function(){
		return moment.duration(this.wordcount / 250, 'minutes').humanize();
	},
	progressHeight: function(){
		var total = this.wordcount,
			chapters = this.chapterLengths(),
			path = ReadingPaths.findOne({userId: Session.get('userId'), book: this._id}),
			read = _.reduce(chapters, function(memo, current){
				if (path && _.includes(path.path, current._id)) {
					return memo + current.wordcount;
				} else {
					return memo;
				}
			}, 0)
			;
		return "height: " + read / total * 100 + "%;";
	}
});

Template.library.events({
	'click a.book': function (event) {
		Books.update({_id: this._id}, {$set: {lastOpened: Date.now()}});
	}
});

Template.library.onRendered(function(){
	$('body').removeClass();
});

var spineWidth = d3.scale.linear()
	.domain([0,375])
	.range([0,1])
	;