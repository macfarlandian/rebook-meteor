
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

    if (Chapters.find().count() === 0) {
        var aud = Resources.findOne({type: "audio"}),
            text = Resources.findOne({type: "text"}),
            chap = {
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
    }
})
