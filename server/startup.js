Meteor.startup(function(){
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
            text.length = (text.contents.split(/\s+/).length); // word count
            Resources.insert(text);
        })
    }

    if (Resources.find({type: "audio"}).count() === 0) {
        var aud = {
            type: "audio",
            name: "subway sound",
            assetPath: "some audio file.mp3",
            length: timeToWords(0.4167)
        };
        Resources.insert(aud);
    }

    if (Resources.find({type: "image"}).count() === 0) {
        var img = {
            type: "image",
            name: "david bowie's grandma",
            assetPath: "image01.jpg",
            length: timeToWords(0.2)
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
            chap.contents[0].end = chap.contents[0].start + chap.contents[0].length ;
            chap.contents[0].track = 0;
        
            if (index == 0){
                // first chapter starts with an audio file
                var aud = Resources.findOne({type: "audio"});
                aud.start = 0;
                aud.end = aud.start + aud.length;
                aud.track = 1;
                chap.contents.push(aud);
                
                chap.contents[0].start += 75;
                chap.contents[0].end += 75;
            }
            if (index == 2){
                // third chapter has an image in it
                var img = Resources.findOne({type: "image"});
                img.start =  750;
                img.end = img.start + img.length;
                img.track = 1;
                chap.contents.push(img);
            }
            Chapters.insert(chap);
        })

    }

    if (Sequences.find().count() == 0) {
        var seq = {
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
        Sequences.insert(seq);

        seq = {
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
        Sequences.insert(seq);

        seq = {
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
        Sequences.insert(seq);
    }

    if (Collections.find().count() == 0) {
        var coll = {
            name: 'Second Leg',
            contents: []
        };
        var seqs = Sequences.find({name: /Second Leg/})
        seqs.forEach(function(doc){
            coll.contents.push(doc);
        });
        Collections.insert(coll);
    }

    if (Books.find().count() == 0){
        var book = {
            name: '12-9',
            contents: [Sequences.findOne({name: 'Sugar – First Leg'}), Collections.findOne({name: 'Second Leg'})],
        };
        Books.insert(book);
    }

})
