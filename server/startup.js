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

    if (Resources.find({type: "text"}).count() === 0) {
        _.each(textfiles, function(name){
            var text = {
                type: "text",
                name: name,
                contents: Assets.getText('data/scriv-export/Draft/'+name),
            };
            text.length = (text.contents.split(/\s+/).length / 250);
            Resources.insert(text);
        })
    }

    if (Resources.find({type: "audio"}).count() === 0) {
        var aud = {
            type: "audio",
            name: "subway sound",
            assetPath: "some audio file.ext",
            length: 0.4167
        };
        Resources.insert(aud);
    }

    if (Resources.find({type: "image"}).count() === 0) {
        var img = {
            type: "image",
            name: "david bowie's grandma",
            assetPath: "image01.jpg",
            length: 0.2
        };
        Resources.insert(img);
    }

    if (Chapters.find().count() === 0) {
        _.each(textfiles, function(name, index){
            var text = Resources.findOne({name: name}),
                chap = {
                    name: name.split(/-\d+-\.txt/)[0],
                    contents: [
                        {
                            resource_id: text._id,
                            start: 0,
                            length: text.length,
                            end: 0 + text.length
                        }
                    ]
                };
            if (index == 0){
                var aud = Resources.findOne({type: "audio"});
                chap.contents.push({
                    resource_id: aud._id,
                    start: 0,
                    end: 0 + aud.length,
                    length: aud.length
                });
                chap.contents[0].start += 0.3;
                chap.contents[0].end += 0.3;
            }
            if (index == 2){
                var img = Resources.findOne({type: "image"});
                chap.contents.push({
                    resource_id: img._id,
                    start: 3,
                    end: 3 + img.length,
                    length: img.length
                });
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
            seq.contents.push({_id: doc._id, model: 'Chapters'});
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
            seq.contents.push({_id: doc._id, model: 'Chapters'});
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
            seq.contents.push({_id: doc._id, model: 'Chapters'});
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
            coll.contents.push({_id: doc._id, model: 'Sequences'});
        });
        Collections.insert(coll);
    }
})
