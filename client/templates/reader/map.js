Template.map.events({
	'click .chapLink': function (e) {
		var place = getPlace();
		place.chapter = e.target.id;
		place.paragraph = 0;
		Placemarkers.update({_id: place._id}, place);
	}
});

Template.map.onRendered(function(){
	var margin = {top: 20, right: 20, bottom: 30, left: 40},
	    // calculate the width dynamically based on available space
	    // width = $('.chapterMap').width() - margin.left - margin.right,
	    height = $(window).height() / 3 * 2;

	$('.chapterMap #map').height(height);

    var bounds = [
            [-153, 118],
            [153, -118]
    ]
        
    var map = L.map('map').setView([31.508, -52.30], 4).setMaxBounds(bounds);
    L.tileLayer('/_media/{z}/{x}/{y}.png', {
        minZoom: 1,
        maxZoom: 5,
        center: [31.508, -52.10],
        attribution: ''
        }).addTo(map);

    
 //    map.on('click', function(e) {
	//     console.log(e.latlng);
	// });

	// markers based on progress through the book

	var pathMarkers = new L.FeatureGroup();
	var placeMarker = new L.FeatureGroup();
	var pathLine = new L.Polyline([], {
        color: 'orange',
        weight: 3,
        opacity: 1,
        smoothFactor: 1
    });

	pathLine.addTo(map);
	pathMarkers.addTo(map);
	placeMarker.addTo(map);

	var pathicon = L.MakiMarkers.icon({icon: null, color: null, size: "m"});
	var placeicon = L.MakiMarkers.icon({icon: null, color: "#2979FF", size: "m"});

	var book = this.data;

	this.autorun(function(){
		var path = getPath();
		if (book && path){
			pathMarkers.clearLayers();
			_.each(path.path, function(_id){
				var c = Chapters.findOne({_id: _id});
				var mark = L.marker(c.coords, {icon: pathicon, title: c.name, riseOnHover: true}).bindPopup('<div class="ui large header">' + c.name + '</div><div class="ui medium header"><a class="chapLink" id='+_id+'>Go to chapter</a></div>');
				pathMarkers.addLayer(mark);
				pathLine.addLatLng(c.coords);
			});
		}
	});

	var lastChapter;
	this.autorun(function(){
		var place = getPlace();
		if (book && place && place.chapter) {
			if (place.chapter != lastChapter){
				lastChapter = place.chapter;
				placeMarker.clearLayers();
				var chaps = book.getChaptersFromContents();
				var currentChap = _.find(chaps, {_id: place.chapter})
				var coords = currentChap.coords;
				var currentMark = L.marker(coords, {icon: placeicon, title: currentChap.name, alt: currentChap.name}).bindPopup('<div class="ui large header">' + currentChap.name + '</div><div class="ui medium header">Current chapter</div>')
				placeMarker.addLayer(currentMark);
				pathLine.addLatLng(coords);
			}
		}
	});
});