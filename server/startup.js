
Meteor.startup(function(){
    // fixtures for testing
    if (Resources.find({type: "text"}).count() === 0) {
        var text = {
            type: "text",
            name: "bar tattoo -33-.txt",
            contents: Assets.getText('data/scriv-export/Draft/bar tattoo -33-.txt'),
        }
        Resources.insert(text);
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
        var aud = Resources.findOne({type: "audio"}),
            text = Resources.findOne({type: "text"}),
            img = Resources.findOne({type: "image"}),
            chap = {
                name: 'Chapter the First',
                contents: [
                    {
                        resource_id: aud._id,
                        start: 0,
                        end: 0 + aud.length,
                        length: aud.length
                    },
                    {
                        resource_id: text._id,
                        start: 0.3,
                        length: (text.contents.split(/\s+/).length / 250),
                        end: 0.3 + (text.contents.split(/\s+/).length / 250)
                    }
                ]
            };
        Chapters.insert(chap);
        chap = {
            name: 'Chapter the Second',
            contents: [
                {
                    resource_id: aud._id,
                    start: 1.5,
                    end: 1.5 + aud.length,
                    length: aud.length
                },
                {
                    resource_id: text._id,
                    start: 0,
                    length: (text.contents.split(/\s+/).length / 250),
                    end: 0 + (text.contents.split(/\s+/).length / 250)
                }
            ]
        };
        Chapters.insert(chap);
        chap = {
            name: 'Chapter the Third',
            contents: [
                {
                    resource_id: img._id,
                    start: 3,
                    end: 3 + img.length,
                    length: img.length
                },
                {
                    resource_id: text._id,
                    start: 0,
                    length: (text.contents.split(/\s+/).length / 250),
                    end: 0 + (text.contents.split(/\s+/).length / 250)
                }
            ]
        };
        Chapters.insert(chap);

    }

    if (Sequences.find().count() == 0) {
        var seq = {
            name: 'Sequence the First',
            chapters: []
        };
        var chaps = Chapters.find();
        chaps.forEach(function(doc){
            seq.chapters.push({_id: doc._id});
        });
        Sequences.insert(seq);
        var seq = {
            name: 'Sequence the Second',
            chapters: []
        };
        chaps.forEach(function(doc){
            seq.chapters.push({_id: doc._id});
        });
        seq.chapters.reverse();
        Sequences.insert(seq);
    }

    if (Collections.find().count() == 0) {
        var coll = {
            name: 'Collection the First',
            chapters: []
        };
        var chaps = Chapters.find();
        chaps.forEach(function(doc){
            coll.chapters.push({_id: doc._id});
        });
        Collections.insert(coll);
    }
})
