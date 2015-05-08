(function(){Meteor.startup(function(){
    // data fixtures for testing
    var textfiles = [
        "bar tattoo -33-.txt",
        "waiting for the G -61-.txt",
        "AIDS Parade -65-.txt",
        "bad news -226-.txt",
        "manhole -227-.txt",
        "keys -185-.txt",
        "police investigation -196-.txt",
        "garbage train -205-.txt",
        "rondo -287-.txt"
    ];

    if (Resources.find({type: "markdown"}).count() === 0) {
        _.each(textfiles, function(name){
            var text = {
                type: "markdown",
                name: name,
                contents: Assets.getText('data/scriv-export/Draft/'+name),
            };
            text.wordcount = (text.contents.split(/\s+/).length);
            Resources.insert(text);
        })
    }

    if (Resources.find({type: "audio"}).count() === 0) {
        var aud = {
            type: "audio",
            name: "subway sound",
            assetPath: "some audio file.mp3",
            wordcount: timeToWords(0.4167),
        };
        Resources.insert(aud);
    }

    if (Resources.find({type: "image"}).count() === 0) {
        var img = {
            type: "image",
            name: "david bowie's grandma",
            assetPath: "image01.jpg",
            wordcount: timeToWords(0.2)
        };
        Resources.insert(img);
    }

    if (Chapters.find().count() === 0) {
        _.each(textfiles, function(name, index){
            var text = Resources.findOne({name: name}),
                chap = {
                    name: name.split(/-\d+-\.txt/)[0],
                    contents: [text]
                };
            
            chap.contents[0].start = 0;
            chap.contents[0].end = chap.contents[0].start + chap.contents[0].wordcount ;
            chap.contents[0].track = 0;
        
            if (index == 0){
                // first chapter starts with an audio file
                var aud = Resources.findOne({type: "audio"});
                aud.start = 0;
                aud.end = aud.start + aud.wordcount;
                aud.track = 1;
                chap.contents.push(aud);
                
                chap.contents[0].start += 75;
                chap.contents[0].end += 75;
            }
            if (index == 2){
                // third chapter has an image in it
                var img = Resources.findOne({type: "image"});
                img.start =  750;
                img.end = img.start + img.wordcount;
                img.track = 1;
                chap.contents.push(img);
            }
            chap.wordcount = _.reduce(chap.contents, function(memo, current){
                return memo + current.wordcount;
            }, 0);
        
            Chapters.insert(chap);
        })

    }

    if (Containers.find({type: 'sequence'}).count() == 0) {
        var seq = {
            type: 'sequence',
            name: 'Sugar – First Leg',
            contents: []
        };
        var slice = _.map(_.slice(textfiles, 0, 3), function(name){
            return name.split(/-\d+-\.txt/)[0];
        });
        var chaps = Chapters.find({name: {$in: slice}});
        chaps.forEach(function(doc){
            seq.contents.push(doc);
        });
        seq.wordcount = _.reduce(seq.contents, function(memo, current){
            return memo + current.wordcount;
        }, 0);
        
        Containers.insert(seq);

        seq = {
            type: 'sequence',
            name: 'Sugar – Second Leg',
            contents: []
        };
        slice = _.map(_.slice(textfiles, 3, 6), function(name){
            return name.split(/-\d+-\.txt/)[0];
        });
        chaps = Chapters.find({name: {$in: slice}});
        chaps.forEach(function(doc){
            seq.contents.push(doc);
        });
        seq.wordcount = _.reduce(seq.contents, function(memo, current){
            return memo + current.wordcount;
        }, 0);
        Containers.insert(seq);

        seq = {
            type: 'sequence',
            name: 'Xu Kong – Second Leg',
            contents: []
        };
        slice = _.map(_.slice(textfiles, 6), function(name){
            return name.split(/-\d+-\.txt/)[0];
        });
        chaps = Chapters.find({name: {$in: slice}});
        chaps.forEach(function(doc){
            seq.contents.push(doc);
        });
        seq.wordcount = _.reduce(seq.contents, function(memo, current){
            return memo + current.wordcount;
        }, 0);
        Containers.insert(seq);
    }

    if (Containers.find({type: 'collection'}).count() == 0) {
        var coll = {
            type: 'collection',
            name: 'Second Leg',
            contents: []
        };
        var seqs = Containers.find({type: 'sequence', name: /Second Leg/})
        seqs.forEach(function(doc){
            coll.contents.push(doc);
        });
        coll.wordcount = _.reduce(coll.contents, function(memo, current){
            return memo + current.wordcount;
        }, 0);
        Containers.insert(coll);
    }

    if (Books.find().count() == 0){
        var book = {
            name: '12-9',
            author: "Ian MacFarland",
            contents: [Containers.findOne({type: 'sequence', name: 'Sugar – First Leg'}), Containers.findOne({type: 'collection', name: 'Second Leg'})],
        };
        book.wordcount = _.reduce(book.contents, function(memo, current){
            return memo + current.wordcount;
        }, 0);
        
        Books.insert(book);

        // add some dummy books for the library view
        var dummybooks = [
            {name: "Slaughterhouse-Five", wordcount: 47192, author: "Kurt Vonnegut Jr.", contents: []},
            {name: "Brave New World", wordcount: 64531, author: "Aldous Huxley", contents: []},
            {name: "Ulysses", wordcount: 265222, author: "James Joyce", contents: []},
            {name: "Animal Farm", wordcount: 29966, author: "George Orwell", contents: []},
            {name: "One Hundred Years of Solitude", wordcount: 144523, author: "Gabriel Garcia Marquez", contents: []},
            {name: "The Fault in Our Stars", wordcount: 67203, author: "John Green", contents: []},
            {name: "Infinite Jest", wordcount: 483994, author: "David Foster Wallace", contents: []},
            {name: "The Joy Luck Club", wordcount: 91419, author: "Amy Tan", contents: []}, 
            {name: "Hamlet", wordcount: 30066, author: "William Shakespeare", contents: []},
            {name: "White Teeth", wordcount: 169389, author: "Zadie Smith", contents: []},
            {name: "Pride and Prejudice", wordcount: 122685, author: "Jane Austen", contents: []}
        ]

        _.each(dummybooks, function(book){
            Books.insert(book);
        })
    }

    // LOTR fixture
    if (Books.find({name: "The Fellowship of the Ring"}).count() == 0) {
        var chapters = [
            "A Long-expected Party.txt",
            "The Shadow of the Past.txt",
            "Three is Company.txt",
            "A Short Cut to Mushrooms.txt"
        ];

        // create resources
        _.each(chapters, function(name){
            var text = {
                name: name,
                type: 'text/plain',
                contents: Assets.getText('data/lotr/'+name),
            };
            text.wordcount = (text.contents.split(/\s+/).length);
            Resources.insert(text);
        });

        // create chapters
        // include map coordinates
        var coords = [
            {lat: 36.80928470205937, lng: -62.22656249999999},
            {lat: 36.77409249464195, lng: -61.65527343749999},
            {lat: 34.052659421375964, lng: -58.22753906250001},
            {lat: 33.87041555094183, lng: -51.67968749999999}
        ];

        _.each(chapters, function(name, index){
            var text = Resources.findOne({name: name}),
                chap = {
                    name: name.split(/\.txt/)[0],
                    contents: [text]
                };
            
            chap.contents[0].start = 0;
            chap.contents[0].end = chap.contents[0].start + chap.contents[0].wordcount ;
            chap.contents[0].track = 0;
            chap.coords = coords[index];

            chap.wordcount = _.reduce(chap.contents, function(memo, current){
                return memo + current.wordcount;
            }, 0);
        
            Chapters.insert(chap);
        });

        // make the book
        var book = {
            name: "The Fellowship of the Ring",
            author: "J.R.R. Tolkein",
            mapEnabled: true,
            contents: []
        };
        _.each(chapters, function(file){
            var name = file.split(/\.txt/)[0];
            book.contents.push(Chapters.findOne({name: name}));
        });
        book.wordcount = _.reduce(book.contents, function(memo, current){
            return memo + current.wordcount;
        }, 0);
        
        Books.insert(book);
    }

})

})();
