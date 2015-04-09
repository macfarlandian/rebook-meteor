markPlace = function(container, model, chapter, para){
	var route = Router.current(),
		book = route.params.bookId,
		mark = Placemarkers.findOne({userId: Session.get('userId'), book: book})
		;
	
	var newMark = {
		userId: Session.get('userId'),
		book: book,
		container: container,
		model: model,
		chapter: chapter,
		para: para
	}

	if (mark != undefined) {
		Placemarkers.update({_id: mark._id}, newMark);	
	} else {
		Placemarkers.insert(newMark);
	}
	
}