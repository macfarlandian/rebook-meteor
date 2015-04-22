Resources = new Mongo.Collection("resources", {
    transform: function(doc){
        doc.model = 'Resources';
        return doc;
    }
});

Chapters = new Mongo.Collection("chapters", {
    transform: function(doc){
        doc.model = 'Chapters';
        return doc;
    }
});

Sequences = new Mongo.Collection("sequences", {
    transform: function(doc){
        doc.model = 'Sequences';
        return doc;
    }
});

Collections = new Mongo.Collection("collections", {
    transform: function(doc){
        doc.model = 'Collections';
        return doc;
    }
    });

Books = new Mongo.Collection('books', {
    transform: function(doc){
        doc.allChapters = function(){
            var chapters = getChaptersFromContents(this.contents);
            if (this.availableChapters == undefined) this.availableChapters = [];
            return _.extend(chapters, this.availableChapters)
        };
        doc.getChaptersFromContents = function(){
            return getChaptersFromContents(this.contents);
        }
        doc.model = 'Books';
        return doc;
    }
});
// recursive function to drill down to the Chapters contained in any Book
var getChaptersFromContents = function(contents){
    var chaps = _.map(contents, function(current){
        if (current.model == 'Chapters') {
            return current;
        } else {
            return getChaptersFromContents(current.contents)
        }
    });
    return _.flattenDeep(chaps);
}


// store them in an object to access them programmatically in templates
Models = {
    'Chapters': Chapters,
    'Resources': Resources,
    'Sequences': Sequences,
    'Collections': Collections,
    'Books': Books
}

// this will be used to store information about current reading state
Placemarkers = new Mongo.Collection('placemarkers');

// this stores your unique reading path through a book
ReadingPaths = new Mongo.Collection('readingpaths');

