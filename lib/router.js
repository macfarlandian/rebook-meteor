Router.route('/', function(){
    this.render('home')
});

Router.route('/write', function(){
    this.render('write')
});

Router.route('/read', function(){
    this.render('read')
});
