Template.readChapters.helpers({
    mainTrack: function(){
        return _.where(this.contents, {track: 0})
    },

    resource: function(){
        return Resources.findOne({_id: this.resource_id});
    },

    isText: function(){
        return this.type == "text";
    },

    paras: function(text){
        if (text){
            var paras = text.split(/(?:\s*\r\n|\s*\n|\s*\r){2,}/gm);
            paras = _.map(paras, function(p){
                return {
                    text: p,
                    length: p.split(/\s+/).length
                }
            });
            _.reduce(paras, function(sum,cur){
                    var cumsum = sum + cur.length;
                    cur.end = cumsum;
                    return cumsum;
                },0)
                ;
            return paras;
        }
    }
});

Template.readChapters.onRendered(function(){
    var t = this; // to access the meteor template object in other scopes

    // watch for reader starting a new chapter
    $(t.firstNode).visibility({
        onTopPassed: function(calc){
            // pause to make sure the user isn't just skimming past
            Meteor.setTimeout(function(){
                if (calc.passing) {
                    markPlace(Session.get('container')._id, Session.get('container').model, t.data._id);
                }
            }, 750); //timer length should be the same as initial scroll time to prevent triggering here
        },
        onUpdate: function(calc){
            t.$('.fader').css({opacity: 1 - calc.percentagePassed});
        }
    });

    // watch for reader progressing to a new paragraph
    var paras = t.$('article > p');
    paras.visibility({
        once: false,
        onTopPassed: function(calc){
            // pause to make sure the user isn't just skimming past
            var p = this;
            Meteor.setTimeout(function(){
                if (calc.passing) {
                    // debugger;
                    markPlace(Session.get('container')._id, Session.get('container').model, t.data._id, paras.index(p));
                }
            }, 750); //timer length should be the same as initial scroll time to prevent triggering here
        }
    });

    // scroll to the most recent paragraph, if marked, if it's in this chapter
    var place = Placemarkers.findOne({userId: Session.get('userId'), book: Router.current().params.bookId});
    if (place.chapter == t.data._id) {
        // if a chapter is marked
        if (place.para != undefined) {
            // if a paragraph is marked, go to it
            var scrolltarget = $('#'+place.chapter + ' article > p').eq(place.para).offset().top;
            $('html, body').scrollTop(scrolltarget);
        } else {
            // go to start of chapter
            $('html, body').animate({scrollTop: $('#'+place.chapter).offset().top}, 0)    
        }    
    }
    
        
});