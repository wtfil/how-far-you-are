var EventEmitter = require('events').EventEmitter,
    emitter = new EventEmitter(),
    ajax = require('../utils/ajax'),
    R = 6378137,
    TO_RAD = Math.PI / 180,
    last = null;

var options = {
    enableHighAccuracy: false,
    timeout: 2000,
    maximumAge: 60
};

function toMetrs(coordsA, coordsB) {
    var dlat = (coordsA.latitude - coordsB.latitude) * TO_RAD,
        dlng = (coordsA.longitude - coordsB.longitude) * TO_RAD;

    if (dlat === 0 && dlng === 0) {
    	return 0;
    }

    return R * Math.sqrt(Math.pow(dlat, 2), Math.pow(dlng, 2));
}

function geocode(coords, done) {

    if (!coords) {
        return done(null);
    }

    var url = 'http://geocode-maps.yandex.ru/1.x/?lang=ru&format=json',
        ll = coords.longitude + ',' + coords.latitude;

    url += '&geocode=' + ll;
    ajax(url, function (e, response) {
    	var address;
    	if (e) {
    		return done(null);
    	}
        try {
            address = JSON.parse(response);
        	address = response.response.GeoObjectCollection.featureMember[0].GeoObject.name;
        } catch(err) {
        	address = null;
        }
        done(address);
    });

}

function watch(handler) {
	navigator.geolocation.watchPosition(function (p) {
    	handler(p.coords);
	}, function () {
		// falback
		var coords = {
			latitude: 30 + Math.random(),
			longitude: 50 + Math.random()
		};
		setInterval(handler.bind(null, coords), 1000);
	}, options);
}


watch(function (coords) {
    geocode(coords, function (address) {
    	last = {
        	latitude: coords.latitude,
        	longitude: coords.longitude,
        	address: address
    	};
        emitter.emit('position', last);
        emitter.emit('change');
    });
});


emitter.toMetrs = toMetrs;
emitter.getPosition = function () {
	return last;
};

module.exports = emitter;
