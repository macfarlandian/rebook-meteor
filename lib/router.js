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
    var book = Books.findOne({_id: this.params.bookId});
    if (book == undefined) return;

    // is there a CFI hash?
    if ( isCfi() ){
        // resolve it to a place marker
        var cfiString = this.params.hash.substring(4, this.params.hash.length - 1),
            structure_markers = getCfiStructure(cfiString);
        
        
        var cfi = structure_markers[0],
            char_range = getCfiCharRange(cfi),
            para_pointer = getCfiParaPointer(cfi),
            resource_id = para_pointer[1],
            chapter = _.find(book.contents, function(chap){
                var ids = _.pluck(chap.contents, "_id");
                return _.contains(ids, resource_id);
            })
            ;
        
        markPlace({chapter: chapter._id, paragraph: para_pointer[2]})
    }

    this.render('readBook', {
    	data: function(){ return book }
    })
}, {
	name: "library.book"
});

// cfi helper functions

isCfi = function(){
    return Router.current().params.hash && Router.current().params.hash.indexOf('cfi(') == 0;
}

getCfiStructure = function(cfiString){
    return cfiString.split('|');
}

getCfiCharRange = function(cfi){
    var range = cfi.substring(cfi.indexOf("[") + 1, cfi.indexOf("]")).split(":");
    return _.map(range, function(item){
        return +item;
    });
}

getCfiParaPointer = function(cfi){
    var pointer = cfi.substring(0, cfi.indexOf("[")).split(',');
    pointer[2] = +pointer[2];
    return pointer;
}

// homepage redirect to project page 
// WebApp.connectHandlers.stack.splice(0, 0, {
//   route: '/',
//   handle: function(req, res, next) {
//     res.writeHead(302, {
//       'Location': 'http://groups.ischool.berkeley.edu/rebook/',
//     });
//     res.end();
//   },
// });