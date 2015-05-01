// a helper helper ... DRY chapter fetching
getChapter = function(_id) {
    var c = Chapters.findOne({_id: _id});
    if (c == undefined) return c;

    //  sort contents by start
    c.contents = _.sortBy(c.contents, function(r){
        return r.start;
    });

    // calculate chapter length on the fly
    c.length = _.max(c.contents, function(r){return r.end}).end;

    // join references with resource records
    _.each(c.contents, function(e,i,l){
        var r = Resources.findOne(e.resource_id);
        l[i] = _.extend(l[i], r)
    });

    return c;
}

getPath = function(){
    var bookQuery = {
        userId: Session.get('userId'),
        book: Router.current().params.bookId
    };
    return ReadingPaths.findOne(bookQuery);
}

// set up d3 scales
minute = 80;
tScale = d3.scale.linear()
    .domain([0,1])
    .range([0,minute])
    ;
// 1 word = .004 minutes (1/250)
timeToWords = d3.scale.linear()
    .domain([0,.004])
    .range([0,1]);


numToWords = function(num){
    var words = [
        'zero',
        'one',
        'two',
        'three',
        'four',
        'five',
        'six',
        'seven',
        'eight',
        'nine',
        'ten',
        'eleven',
        'twelve',
        'thirteen',
        'fourteen',
        'fifteen',
        'sixteen'
    ];
    return words[num];
}



updateWordcount = function(container){
    return _.reduce(container.contents, function(memo, cur){
        return memo + cur.wordcount;
    }, 0);
}