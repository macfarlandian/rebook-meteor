Meteor.startup(function(){
    // these session variables determine what template & data
    // is rendered in the two panes of the main grid for writing app
    Session.set('workArea', 'sequenceBuild');
    Session.set('workData', "sNeQAtid4hJxoPrRH");
    Session.set('previewArea', 'resourceList');
    Session.set('previewData', {
        pageTitle: 'Sequences',
        collection: 'Sequences'
    });


    // for now, a test user ID for placemarking
    Session.set('userId', 'test123');
});
