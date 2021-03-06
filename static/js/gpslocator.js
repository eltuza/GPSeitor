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

    
    

    var generate_markers = function(data, map, iw) {
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
            
            markers.push(m); 
            
            //temporary
            data[img]['marker'] = m;
            //data[img]['infowindow'] = iw;
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

    var add_listener = function(map, marker, iw, target) {
        return google.maps.event.addListener( marker, 'click', function() {
                iw.setContent(get_infowindow_content(marker));
                iw.open(map,  marker);
                console.log(marker.title);
                
                scroll_to_picture(marker.title, target, true);
        });        
    }
    
    var get_infowindow_content = function(marker) {
        var id = marker.title;
        var img = data[id];
        
        return ' <div id="content">' +
                    '<div id="bodyContent">'+ //add country gps information thru geolocation
                    '<img class="mapPhoto" src="./' + img.path + '"/>' + 
                    '</div>'+
                    '</div>'
    }

    var scroll_to_picture = function(id, target, highlight) {
        var obj = $("#" + id);
        target.stop().scrollTo(obj, 800, {axis: 'x'}); //TODO: add offset to center when scrolling gallery
        
        /*if(highlight) {
            obj.css('border', '1px solid #cfc');
        }*/
    };
    
    var scroll_position = function(direction, target, offset) {
        var increment = 174;
        var scroll = increment * offset;
        var action = '=' + scroll + 'px';
        
        if(direction === 'prev') {
            action = '-' + action;
        } else {
            action = '+' + action;
        }
        target.stop().scrollTo(action, 800, {axis: 'x'});        
    };

    
    $(document).ready(function() {
        var paneTarget = $("#thumbs")
        var map = initialize();

        var infowindow = new google.maps.InfoWindow({
            content: 'sarasa'
        });
        
        var markers = generate_markers(data, map, infowindow);
        
        var i;
        for (i = 0; i < markers.length; i++) {
            var marker = markers[i];
            add_listener(map, marker, infowindow, paneTarget);
        }
        
        
        //generate gallery
        var thumbs = $("#thumbsInner");
        var len = 0;
        var thumbs_tmp = $("<div></div>");
        for( img in data) {
            len += 174;
           
            var thumb = $('<img href="#' + img + '" id="' + img + '" class="thumb" src="' + data[img].thumb + '" />');
            thumbs_tmp.append(thumb);    
        }
        thumbs.append(thumbs_tmp.html());
        $("#thumbsInner").css({'width': len+'px'});
    
        
        
        
        
        $(".link").click(function() {
            var id = $(this).attr('data-link');
            console.log(id);
            console.log($(id));
            scroll_to_picture(id, paneTarget);
        })
        
        $(".navButton").click(function() {
            scroll_position(this.id, paneTarget, 1);
        });
        
        $(".navButton").dblclick(function() {
            scroll_position(this.id, paneTarget, 3);
        });
        
        $('.thumb').click(function() {
           
           var marker = data[this.id].marker;
           
           google.maps.event.trigger(marker, 'click');
           
        });
    });

    
})();