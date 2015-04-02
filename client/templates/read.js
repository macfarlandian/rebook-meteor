Template.read.helpers({
    resource: function(){
        return Resources.findOne({"name": /bar tattoo/});
    },
});
