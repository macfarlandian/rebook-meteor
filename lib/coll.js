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
        return doc;
    }
});

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
