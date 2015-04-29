Template.newBook.helpers({
	makeChapter: function(){
		return {chapter: true, book: Session.get('newBook')}
	},
	textUploads: function(){
		return Session.get('textUploads');
	}
});

Template.newBook.onRendered(function(){
	// reset Session vars that are only relevant while this is in progress
	Session.set('textUploads', [])
	Session.set('newBook', undefined);
})

Template.newBook.events({
	'submit #nameBook': function (e) {
		e.preventDefault();

		// create a new book with this name
		Books.insert({name: e.target[0].value, contents: [], availableChapters: [], availableAssets: []}, function(err,_id){
			if (!err) Session.set('newBook', _id);
		})

		$('.steps .step:first-child').removeClass('active');
		$('.steps .step:first-child').addClass('disabled');
		$('.steps .step:last-child').addClass('active')
		$('.segment.stepOne').hide();
		$('.segment.stepTwo').show();
		$('.ui.green.button').removeClass('disabled');
	},

	'change input#txtFiles': function(e){

		var newBook = Books.findOne(Session.get('newBook'));

		FS.Utility.eachFile(e, function(file){
			var reader = new FileReader();
			reader.onload = function(event) {
				var contents = event.target.result;

				// add text to resources
				var resource = {
					name: file.name,
					type: file.type,
					contents: contents,
					wordcount: contents.split(/\s+/).length
				}
				Resources.insert(resource, function(err, res_id){
					if (err) return console.log(err); 
					var res = Resources.findOne(res_id);
					// make a new chapter with this as the only resource, and the same name
					
					// trim .md or .txt from end of file
					if (res.type == "text/markdown") {
						var name = res.name.substr(0,res.name.length - 3);
					} else {
						var name = res.name.substr(0,res.name.length - 4);
					}
					console.log(name)
					var chap = {
						name: name,
						contents: [res]
					};
					chap.contents[0].start = 0;
		            chap.contents[0].end = chap.contents[0].start + chap.contents[0].wordcount ;
		            chap.contents[0].track = 0;
		            chap.wordcount = _.reduce(chap.contents, function(memo, current){
		                return memo + current.wordcount;
		            }, 0);

		            Chapters.insert(chap, function(err, chap_id){
		            	if (err) return console.log(err);
		            	var chap = Chapters.findOne(chap_id);
		            	newBook.availableChapters.push(chap);
		            	
		            	// update the book with new chapters
						Books.update({_id: newBook._id}, newBook);
		            });
				})

				// display uploaded files to user
				var textUploads = Session.get('textUploads');
				if (textUploads == undefined) textUploads = [];
				textUploads.push({name: file.name});
				Session.set('textUploads', textUploads);
			};
			reader.onerror = function(event) {
				console.error("File could not be read! Code " + event.target.error.code);
			};
			reader.readAsText(file);

		});

	    e.target.value = ""; // Reset the upload form


		// 	Uploads.insert(file, function(err, obj){
		// 		console.log(obj.isUploaded())
		// 		// Tracker.autorun(function () {
		// 		// 	console.log(obj.uploadProgress())
		// 		// 	if (obj.isUploaded()){
		// 		// 		console.log('uploaded')
		// 		// 	}
		// 		// });
		// 	});
		// })
	}
});