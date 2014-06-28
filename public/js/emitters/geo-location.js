var EventEmiter = require('./event-emiter'),
    profile = require('./profile'),
    emiter = new EventEmiter(),
    R = 6378137,
    TO_RAD = Math.PI / 180;

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
        } catch(e) {} 
        response = response.response.GeoObjectCollection.featureMember[0].GeoObject.name;
        done(response);
    };

    xhr.onerror = function (e) {
        console.log(e);
    };
    xhr.open('get', url);
    xhr.send();
}


navigator.geolocation.watchPosition(function (p) {
    emiter.emit('location', p.coords);
}, onError, options);

emiter.on('location', function (p) {
    geocode(p, function (address) {
        last = {
            latitude: p.latitude,
            longitude: p.longitude,
            address: address,
            // bad-bad
            userName: profile.userName
        };
        emiter.emit('position', last);
    });
});

module.exports = emiter;
module.exports.toMetrs = toMetrs;
module.exports.geocode = geocode;
module.exports.get = function (done) {
    done(last);
};
