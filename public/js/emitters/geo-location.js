var EventEmitter = require('events').EventEmitter,
    emitter = new EventEmitter(),
    R = 6378137,
    TO_RAD = Math.PI / 180,
    last = null;

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
        emitter.emit('error', new Error('Seems that geolocation does not work'));
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
