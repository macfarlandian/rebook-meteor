Template.map.onRendered(function(){
	drawMap();
});

var drawMap = function() {
// ease scrolling
            $('a[href*=#]:not([href=#])').click(function() {
                if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
                        var target = $(this.hash);
                        target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
                if (target.length) {
                    $('html,body').animate({
                        scrollTop: target.offset().top
                        }, 1000);
                    return false;
                    }
                }
            });
    
    // Creates popup
    // #modal-launcher is the button with map icon
    $("#modal-launcher, #modal-background, #modal-close").click(function() {
        $("#modal-content, #modal-background").toggleClass("active");
    });

    var bounds = [
            [-153, 118],
            [153, -118]
    ]
        
    var map = L.map('map').setView([0, 0], 1).setMaxBounds(bounds);
    L.tileLayer('/_media/{z}/{x}/{y}.png', {
        minZoom: 1,
        maxZoom: 5,
        center: [31.508, -52.10],
        attribution: ''
        }).addTo(map);

    // Creating points    
    var pointA = new L.LatLng(31.508, -52.10);
    var pointB = new L.LatLng(29.508, -49.10);
    var pointC = new L.LatLng(29.508, -45.10);
    var pointList = [pointA, pointB];
    
    // Drawing lines
    var polyline = new L.Polyline(pointList, {
        color: 'orange',
        weight: 3,
        opacity: 1,
        smoothFactor: 1
        });
    
    // Creating markers
    var marker1 = L.marker([31.508, -52.30], {riseOnHover: true}).bindPopup('<h4 class="popup">Chapter 1:   </h4>A Long Expected Party<br/> <a href="lotr_map.html#chap1">Go to chapter</a>').addTo(map),
        marker2 = L.marker([31.508, -52.10]),
        marker3 = L.marker([29.508, -49.10]),
        marker4 = L.marker([29.508, -45.10]);
    
        // Finding map limits
       /* var marker5 = L.marker([0, 0]).addTo(map);
        var marker6 = L.marker([0, 103]).addTo(map);
        var marker7 = L.marker([0, -103]).addTo(map);
        var marker8 = L.marker([58, 0]).addTo(map);
        var marker9 = L.marker([-58, 0]).addTo(map);
        */
    

    // Functions that draw new markers for each chapters
        function m2() {
            marker2.bindPopup('<h4 class="popup">Chapter 2:</h4>The Shadow of the Past <br/> <a href="lotr_map.html#chap2">Go to chapter</a>').addTo(map);
        }
        
        function m3() {
            marker3.bindPopup('<h4 class="popup">Chapter 3:</h4>Three is Company <br/> <a href="lotr_map.html#chap3">Go to chapter</a>').addTo(map);
            polyline.addTo(map);
        }
        
        function m4() {
            marker4.bindPopup('<h4 class="popup">Chapter 4:</h4>A Short Cut to Mushrooms <br/> <a href="lotr_map.html#chap4">Go to chapter</a>').addTo(map);
            pointList.push(pointC);
            polyline.setLatLngs(pointList); //updates the points for the polyline
        }
    
    // Calling functions to draw markers and lines
        m2(), m3(), m4();
}