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

    // t.$('.ui.sticky')
    //   .sticky({
    //     context: 'article.column'
    // });

    // t.$('.progress-container .fader').height($(window).height());

    $(t.firstNode).visibility({
        options: {
            once: false,
        },

        onPassing: function(calculations) {
            markPlace(Session.get('container')._id, Session.get('container').model, t.data._id);
        },
        onUpdate: function(calc){

        }
    })

    // //** onscroll animations
    // var scroll_pos = 0;

    // // debounce: scroll events fire too often, performance suffers (esp on mobile)
    // $(document).scroll($.debounce(250, function() {
    //     // refresh on the fly because we never know when meteor is going to
    //     // update the DOM

    //     debugger;
    //     var offsets = {
    //         'animation_begin_pos': t.find('article.column').offsetTop,
    //         'animation_end_pos': t.find('article.column').offsetTop + t.find('article.column').offsetHeight - $(window).height()
    //     }

    //     scroll_pos = $(this).scrollTop();

    //     var percentScrolled = (scroll_pos - offsets.animation_begin_pos) / ( offsets.animation_end_pos - offsets.animation_begin_pos );

    //     if (0 <= percentScrolled && 1 >= percentScrolled) {
    //         $('.fader').css({opacity: 1 - percentScrolled});
    //     } else if (0 > percentScrolled) {
    //         $('.fader').css({opacity: 1});
    //     } else {
    //         $('.fader').css({opacity: 0});
    //     }
    // }));
});