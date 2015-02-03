Template.menu.events({
    "click .resources": function(event, template){
        Session.set('previewArea', 'resourceList');
        Session.set('previewData', {
            pageTitle: 'Resources',
            collection: 'Resources'
        });
    },
    "click .chapters": function(event, template){
        Session.set('previewArea', 'resourceList');
        Session.set('previewData', {
            pageTitle: 'Chapters',
            collection: 'Chapters'
        });
    },
    "click .sequences": function(event, template){
        Session.set('previewArea', 'resourceList');
        Session.set('previewData', {
            pageTitle: 'Sequences',
            collection: 'Sequences'
        });
    }
});
