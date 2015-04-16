Resources = new Mongo.Collection("resources", {
    transform: function(doc){
        doc.getLength = function(){
            return this.length;
        }
        return doc;
    }
});

Chapters = new Mongo.Collection("chapters", {
    transform: function(doc){
        doc.getLength = function(){
            // sum length of all Resources
            return _.reduce(this.contents, function(memo, cur){
                // TODO: this value doesn't need to be stored twice
                // Resources.findOne(cur._id).getLength();
                return memo + cur.length;
            }, 0);
        }
        return doc;
    }
});

Sequences = new Mongo.Collection("sequences", {
    transform: function(doc){
        doc.getLength = function(){
            return _.reduce(this.contents, function(memo, current){
                // TODO: can other models be nested inside a sequence?
                // var obj = Chapters.findOne(current._id);
                var obj = Models[current.model].findOne(current._id);
                return memo + obj.getLength();
            }, 0);
        }
        return doc;
    }
});

Collections = new Mongo.Collection("collections", {
    transform: function(doc){
        doc.getLength = function(){
            return _.reduce(this.contents, function(memo, current){
                var obj = Models[current.model].findOne(current._id);
                return memo + obj.getLength();
            }, 0);
        }
        return doc;
    }
    });

Books = new Mongo.Collection('books', {
    transform: function(doc){
        doc.getLength = function(){
            return _.reduce(this.contents, function(memo, current){
                var obj = Models[current.model].findOne(current._id);
                return memo + obj.getLength();
            }, 0);
        }
        doc.allChapters = function(){
            var chaps = _.flattenDeep(chapterLengths(this.contents))
            return chaps;
        }

        return doc;
    }
});
// recursive function to drill down to the Chapters contained in any Book
var chapterLengths = function(contents){
    var chaps = _.map(contents, function(current){
        if (current.model == 'Chapters') {
            var obj = Chapters.findOne(current._id);
            return {name: obj.name, length: obj.getLength(), _id: obj._id};
        } else {
            return chapterLengths(Models[current.model].findOne(current._id).contents)
        }
    });
    return chaps;
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

