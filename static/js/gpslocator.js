(function() {
    
    /*var data = {
        'testdir/1.jpg' : {
            'lng': -43.1895777778,
            'lat': -22.9805194444
        },
        'testdir/2.jpg' : {
            'lng': -43.2348,
            'lat': -22.8636944444
        },
        'testdir/usa.jpg': {
            'lng': -81.5778305556,
            'lat': 28.4186111111
        }
    };*/
    var bounds = new google.maps.LatLngBounds();
    
    var initialize = function() {
        //var latlng = new google.maps.LatLng(get_center(boundaries).lat, get_center(boundaries).lng);
        var myOptions = {
            zoom: 4,
            center: new google.maps.LatLng(0, 0),
            mapTypeId: google.maps.MapTypeId.HYBRID
        };
        var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
        
        return map;
    };

    
    /*var get_boundaries = function(data) {
        var max_lng, max_lat, min_lng, min_lat;
        
        for(img in data) {
            //initialize
            if(max_lng === undefined) {
                max_lng = data[img].lng;
                min_lng = data[img].lng;
                max_lat = data[img].lat;
                min_lat = data[img].lat;
            }
            
            if (max_lng < data[img].lng) {
                max_lng = data[img].lng;
            }
            if (min_lng > data[img].lng) {
                min_lng = data[img].lng;
            }
            
            if (max_lat < data[img].lat) {
                max_lat = data[img].lat;
            }
            if (min_lat > data[img].lat) {
                min_lat = data[img].lat;
            }
        }
        return { 'max_lat': max_lat, 'min_lat': min_lat, 'max_lng': max_lng, 'min_lng': min_lng };
    };*/
    
    /*var get_zoom = function(boundaries) {
        var lat, lng;
        
        lat = boundaries.max_lat - boundaries.min_lat;
        lng = boundaries.max_lng - boundaries.min_lng;
        
        console.log('get_zoom - calculate')
        console.log({'dlat': lat, 'dlng': lng});
        return {'dlat': lat, 'dlng': lng};
    }
    
    var get_center = function(boundaries) {
        var lat = (boundaries.max_lat + boundaries.min_lat) / 2;
        var lng = (boundaries.max_lng + boundaries.min_lng) / 2;
        return {'lat': lat, 'lng': lng};
    }*/

    var generate_markers = function(data, map) {
        var markers = [], m;
        for (img in data) {
            //do not create markers for pictures without GPS tag data
            if (data[img].lat !== 0 && data[img].lng !== 0) {
                m = new google.maps.Marker({
                    position: new google.maps.LatLng(data[img].lat, data[img].lng),
                    map: map,
                    title: img
                });
            }
            //extends boundaries to include marker
            bounds.extend(m.position);
            
            iw = generate_infowindow(img);
            markers.push({'marker': m, 'infowindow': iw}); 
        }
        
        //fit bounds - centers the map and aplpies adecuate zoom
        map.fitBounds(bounds);
        return markers;
    }

    var generate_infowindow = function(path) {
        return new google.maps.InfoWindow({
            content: ' <div id="content">' +
                    '<div id="siteNotice">'+
                    '</div>'+
                    '<h1 id="firstHeading" class="firstHeading">' + path + '</h1>'+
                    '<div id="bodyContent">'+
                    '<p><b>Sarasa!</b>:' + //add country gps information thru geolocation
                    '<img class="mapPhoto" src="./' + path + '"/>' + 
                    '<br/>' +
                    '</div>'+
                    '</div>'
            });
    }

    var add_listener = function(map, marker, iw) {
        return google.maps.event.addListener( marker, 'click', function() {
                iw.open(map,  marker);
        });        
    }


    window.onload = function() {
        //var b = get_boundaries(data);
        
        //get_zoom(b);
        var map = initialize();

        var markers = generate_markers(data, map);
        console.log(markers);
        marker = markers[2];
        console.log(marker);
    
        var marker, iw;
        var i;
        for (i = 0; i < markers.length; i++) {
            var obj = markers[i];
            console.log(i);
            marker = obj.marker;
            iw = obj.infowindow;
            
            add_listener(map, marker, iw);
        }
    };

})();