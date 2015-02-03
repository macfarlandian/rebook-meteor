Template.resourceList.helpers({
    retrieve: function(coll){
        if (coll == 'Resources') {
            return Resources.find();
        } else if (coll == 'Chapters') {
            return Chapters.find();
        }

    },
    displayName: function(){
        if (this == undefined) return this;
        if (this.type == 'text') {
            return this.name.split(/-\d+-\.txt/)[0];
        } else {
            return this.name;
        }
    }
});

Template.resourceList.events({
    "click .item": function(event, template){
        if (Session.get('previewData').collection == "Resources") {
            Session.set('previewArea', 'contentpreview');
            Session.set('previewData', this);
        } else if (Session.get('previewData').collection == "Chapters") {
            Session.set('workArea', 'chapterTimeline');
            Session.set('workData', this._id);
        }
    }
});
