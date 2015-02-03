Meteor.startup(function(){
    // these session variables determine what template & data
    // is rendered in the two panes of the main grid
    Session.set('workArea', 'chapterTimeline');
    Session.set('previewArea', 'resourceList');
    Session.set('workData', "LPwCqv84PMs2znhbe");
    Session.set('previewData', {
        pageTitle: 'Resources',
        collection: 'Resources'
    });
});
