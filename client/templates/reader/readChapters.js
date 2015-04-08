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

    $(t.firstNode).visibility({
        once: true,
        onPassing: function(calc) {
            // pause to make sure the user isn't just skimming past
            Meteor.setTimeout(function(){
                if (calc.passing) {
                    markPlace(Session.get('container')._id, Session.get('container').model, t.data._id);
                }
            }, 750); //timer length should be the same as initial scroll time to prevent triggering here
            
        },
        onUpdate: function(calc){
            t.$('.fader').css({opacity: 1 - calc.percentagePassed})
        }
    })
});