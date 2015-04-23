Template.resourceList.helpers({
    retrieve: function(coll){
        return Containers.find();
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
        switch(Session.get('previewData').collection) {
            case "Resources":
                Session.set('previewArea', 'contentpreview');
                Session.set('previewData', this._id);
                break;
            case "Chapters":
                Session.set('workArea', 'chapterTimeline');
                Session.set('workData', this._id);
                break;
            case "Sequences":
                Session.set('workArea', 'sequenceBuild');
                Session.set('workData', this._id);
                break;
            case "Collections":
                Session.set('workArea', 'collectionBuild');
                Session.set('workData', this._id);
                break;
        }
    }
});
