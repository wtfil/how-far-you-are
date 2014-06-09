var EventEmiter = require('./event-emiter'),
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

function getFromHash() {
    var hash = location.hash;
    if (hash.length < 2) {
        return;
    }
    hash = hash.substr(1).split(',');
    return {
        coords: {
            longitude: hash[0],
            latitude: hash[1]
        }
    };
}

function geocode(coords, done) {
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
        } catch(e) {}; 
        var r = response.response.GeoObjectCollection.featureMember[0].GeoObject.name;
        done(r);
    }
    xhr.onerror = function (e) {
        console.log(e);
    }
    xhr.open('get', url);
    xhr.send();
    console.log(url);
}


/*
navigator.geolocation.watchPosition(function (p) {
    if (onChangeHandler) {
        onChangeHandler(p);
    }
}, onError, options);
*/
var last = {coords: {latitude: 0, longitude: 0}};
setInterval(function () {
    var hash = getFromHash();
    if (hash) {
        return emiter.emit('position', hash);
    }
    navigator.geolocation.getCurrentPosition(function (p) {
        last = p;
        emiter.emit('position', p);
    })
}, 3000);

module.exports = emiter;
module.exports.toMetrs = toMetrs;
module.exports.geocode = geocode;
module.exports.get = function () {
    var hash = getFromHash();
    return hash || last;
}
