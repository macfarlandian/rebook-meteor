Router.route('/', function(){
    this.render('home')
});

Router.route('/create', function(){
	this.layout('write');
    this.render('allBooks');
}, {name: 'create'});

Router.route('/create/new', function(){
    this.layout('write');
    this.render('newBook')
}, {name: 'create.new'});

Router.route('/create/:bookId', function(){
	this.layout('write');
	this.render('createBook', {data: function(){return Books.findOne({_id: this.params.bookId});}});
}, {name: 'create.book'});

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

// homepage redirect to project page 
WebApp.connectHandlers.stack.splice(0, 0, {
  route: '/',
  handle: function(req, res, next) {
    res.writeHead(302, {
      'Location': 'http://groups.ischool.berkeley.edu/rebook/',
    });
    res.end();
  },
});