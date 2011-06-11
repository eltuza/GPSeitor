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