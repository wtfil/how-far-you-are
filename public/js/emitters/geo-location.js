var EventEmitter = require('events').EventEmitter,
    emitter = new EventEmitter(),
    profile = require('./profile'),
    R = 6378137,
    TO_RAD = Math.PI / 180,
    last = null;

var options = {
    enableHighAccuracy: false,
    timeout: 5000,
    maximumAge: 0
};

function onError(e) {
    console.error(e);
}

function toMetrs(coordsA, coordsB) {
    var dlat = (coordsA.latitude - coordsB.latitude) * TO_RAD,
        dlng = (coordsA.longitude - coordsB.longitude) * TO_RAD;

    return R * Math.sqrt(Math.pow(dlat, 2), Math.pow(dlng, 2));
}

function geocode(coords, done) {

    if (!coords) {
        return done('');
    }

    var url = 'http://geocode-maps.yandex.ru/1.x/?lang=ru&format=json',
        ll = coords.longitude + ',' + coords.latitude,
        xhr = new XMLHttpRequest();
    url += '&geocode=' + ll;

    xhr.onload = function (r) {
        if (xhr.readyState !== 4) {
            return;
        }

        var response = xhr.responseText;

        try {
            response = JSON.parse(response);
        	response = response.response.GeoObjectCollection.featureMember[0].GeoObject.name;
        } catch(e) {
        	response = null;
        } 
        done(response);
    };

    xhr.onerror = function (e) {
        console.log(e);
    };
    xhr.open('get', url);
    xhr.send();
}


navigator.geolocation.watchPosition(function (p) {

    var coords = p.coords;
    geocode(p.coords, function (address) {
    	last = {
        	latitude: coords.latitude,
        	longitude: coords.longitude,
        	address: address,
        	// bad-bad
        	userName: profile.userName
    	};
        emitter.emit('position', last);
        emitter.emit('change');
    });
}, onError, options);

// watchPosition do not triggered more then once on desktop
setInterval(function () {
	if (last) {
		emitter.emit('position', last);
    	emitter.emit('change');
	}
}, 1000);


module.exports = emitter;
module.exports.toMetrs = toMetrs;
module.exports.geocode = geocode;
module.exports.get = function (done) {
    done(last);
};
