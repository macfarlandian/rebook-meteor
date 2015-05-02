markPlace = function(container, model, chapter, para){
	var route = Router.current(),
		book = route.params.bookId,
		mark = Placemarkers.findOne({userId: Session.get('userId'), book: book})
		;
	
	if (_.isPlainObject(arguments[0])) {
		// can pass an object with all settings instead of all these params
		var newMark = arguments[0];
	} else {
		var newMark = {
			container: container,
			model: model,
			chapter: chapter,
			paragraph: para
		}
	}
	newMark.userId = Session.get('userId');
	newMark.book = book;
		

	if (mark != undefined) {
		Placemarkers.update({_id: mark._id}, newMark);	
	} else {
		Placemarkers.insert(newMark);
	}
	
}

getPlace = function(){
	return Placemarkers.findOne({userId: Session.get('userId'), book: Router.current().params.bookId});
}