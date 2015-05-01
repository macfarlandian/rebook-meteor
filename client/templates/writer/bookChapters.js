Template.bookChapters.helpers({
	parentName: function(){
		var parent = Containers.findOne({'contents._id': this._id});
		if (parent) return parent.name;
	},
	firstOfGroup: function(){
		var parent = Containers.findOne({'contents._id': this._id});
		if (_.findIndex(parent.contents, {_id: this._id}) == 0) return true;
		return false;
	}
});

Template.bookChapters.onRendered(function(){
	this.$('.ui.accordion').accordion();
});

Template.bookChapters.events({
	'mouseover .chapterList .item': function (event, template) {
		// make chapter draggable
		$(event.currentTarget).draggable({
			opacity: 0.4,
			revert: "invalid",
			revertDuration: 250,
			start: function(e,ui){
				// dropping laterally creates or adds to a collection
			    $('.bookStructure .row').droppable({
			        tolerance: 'pointer',
			        greedy: true,
			        hoverClass: 'collectionDrop',
			        drop: function(e,ui){
			        	var target = $(e.target);
			        	if (target.children('.collection').length != 0) {
			        		// collection already exists, just add to it
			        		var coll = Containers.findOne({_id: target.children('.collection').attr('id')}),
			        			newChap = Chapters.findOne({_id: ui.draggable.get(0).dataset.id}),
			        			book = Books.findOne({_id: Router.current().params.bookId}),
			        			contentIndex = _.findIndex(book.contents, {_id: coll._id})
			        			contents1 = _.slice(book.contents, 0, contentIndex),
			        			contents2 = _.slice(book.contents, contentIndex +1)
			        			;

			        		coll.contents.push(newChap);
			        		_.remove(book.availableChapters, {_id: newChap._id})

			        		coll.wordcount = updateWordcount(coll);
			        		Containers.update({_id: coll._id}, coll);
			        		book.contents =  contents1.concat(coll, contents2);
			        		Books.update({_id: book._id}, book);


			        	} else {
			        		// create collection, add existing and new chapters to it
			        		var newChap = Chapters.findOne({_id: ui.draggable.get(0).dataset.id}),
			        			oldChap = Chapters.findOne({_id: target.children('.chapter').attr('id')}),
			        			newColl_id = Containers.insert({
			        				name: 'New Choice Group',
			        				type: 'collection',
			        				contents: [oldChap, newChap]
			        			}),
			        			newColl = Containers.findOne({_id: newColl_id}),
			        			book = Books.findOne({_id: Router.current().params.bookId}),
			        			contentIndex = _.findIndex(book.contents, {_id: oldChap._id})
			        			contents1 = _.slice(book.contents, 0, contentIndex),
			        			contents2 = _.slice(book.contents, contentIndex +1)
			        			;
			        		
			        		newColl.wordcount = updateWordcount(newColl);

			        		book.contents =  contents1.concat(newColl, contents2);
			        		_.remove(book.availableChapters, {_id: newChap._id})
			        		Books.update({_id: book._id}, book);

			        	}
			        } 
			    });
			}
		});
	}
});

function updateWordcount(container){
	return _.reduce(container.contents, function(memo, cur){
		return memo + cur.wordcount;
	}, 0);
}