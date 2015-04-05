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

Router.route('/read/:_id', function(){
    this.render('readBook', {
    	data: function(){ return Books.findOne({_id: this.params._id}); }
    })
}, {
	name: "library.book"
});
