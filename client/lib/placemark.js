markPlace = function(container, model, chapter){
	var route = Router.current(),
		book = route.params.bookId,
		mark = Placemarkers.findOne({userId: Session.get('userId'), book: book})
		;
	
	var newMark = {
		userId: Session.get('userId'),
		book: book,
		container: container,
		model: model,
		position: 0
		// TODO: how to mark position? 
	}

	if (chapter) newMark.chapter = chapter;

	if (mark) {
		Placemarkers.update({_id: mark._id}, newMark);	
	} else {
		Placemarkers.insert(newMark);
	}
	
}