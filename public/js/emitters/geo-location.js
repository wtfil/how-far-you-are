var {EventEmitter} = require('events');
var emitter = new EventEmitter();
var R = 6378137;
var TO_RAD = Math.PI / 180;
var last = {};
var debug = require('../utils/debug');

var options = {
    enableHighAccuracy: false,
    timeout: 2000,
    maximumAge: 60
};

function toMetrs(coordsA, coordsB) {
	if (!coordsA || !coordsB) {
		return null;
	}
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

    var url = 'https://geocode-maps.yandex.ru/1.x/?lang=ru&format=json',
        ll = coords.longitude + ',' + coords.latitude;

    url += '&geocode=' + ll;
    fetch(url)
		.then(res => res.json())
		.then(data => {
			var address;
			try {
				address = data.response.GeoObjectCollection.featureMember[0].GeoObject.name;
			} catch(err) {
				address = null;
			}
			done(address);
		})
		.catch(() => done());

}

function watch(handler) {
    navigator.geolocation.watchPosition(function (p) {
        handler(p.coords);
    }, function (e) {
		debug('Geolocation error: ' + e.message, 'retring');
    	setTimeout(function () {
    		watch(handler);
    	}, 100);
    }, options);
}


watch(function (coords) {
    last.latitude = coords.latitude;
    last.longitude = coords.longitude;

    emitter.emit('position', last);
    emitter.emit('change');

    geocode(coords, function (address) {
		last.address = address;
    	emitter.emit('position', last);
    	emitter.emit('change');
    });
});


emitter.toMetrs = toMetrs;
emitter.getPosition = function () {
    return last;
};

module.exports = emitter;
