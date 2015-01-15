Template.contentpreview.helpers({
    paras: function(text){
        return text.split(/(\r\n|\n|\r)/gm)
    },
    length: function(){
        // for now, testing with one text file
        var d = Resources.findOne({"type": "text"});
        if (d == undefined) return d;
        // use rough word count (tokenized by whitespace)
        // divided by 250 words per minute (english avg)
        return d.contents.split(/\s+/).length / 250;
    },
    title: function(){
        if (this == undefined) return this;
        return this.name.split(/-\d+-\.txt/)[0];
    }
});
