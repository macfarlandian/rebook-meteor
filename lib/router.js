Router.route('/', function(){
    this.render('home')
});

Router.route('/write', function(){
    this.render('write')
});

Router.route('/read', function(){
    this.render('library')
}, {
	name: "library"
});

Router.route('/read/:bookId', function(){
    this.render('readBook', {
    	data: function(){ return Books.findOne({_id: this.params.bookId}); }
    })
}, {
	name: "library.book"
});
