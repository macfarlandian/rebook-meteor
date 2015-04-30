Template.createBook.helpers({
    getBookChapters: function(){
        return Books.findOne(this._id).allChapters();
    },
    getPreviewContent: function(){
        var previewContent = Session.get('previewContent');
        if (previewContent && previewContent.type == 'sequence') return Containers.findOne(previewContent._id);
        return Chapters.findOne(previewContent._id);

    }
});

// global vars for displaying preview on click
previewContent = undefined;

// a helper helper ... DRY chapter fetching
function getChapter() {
    var c = Chapters.findOne();
        if (c == undefined) return c;

    //  sort contents by start
    c.contents = _.sortBy(c.contents, function(r){
        return r.start;
    });

    // calculate chapter length on the fly
    c.length = _.max(c.contents, function(r){return r.end}).end;

    // join references with resource records
    _.each(c.contents, function(e,i,l){
        var r = Resources.findOne(e.resource_id);
        l[i] = _.extend(l[i], r)
    });

    return c;
}

Template.createBook.onRendered(function(){
    // reset temporary vars for content previews
    Session.set('previewScrollPct', undefined);
    Session.set('previewContent', undefined);

});