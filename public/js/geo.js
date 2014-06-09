var R = 6378137,
    TO_RAD = Math.PI / 180;

var options = {
    enableHighAccuracy: false,
    timeout: 5000,
    maximumAge: 0
};

var onChangeHandler;

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


/*
navigator.geolocation.watchPosition(function (p) {
    if (onChangeHandler) {
        onChangeHandler(p);
    }
}, onError, options);
*/
var last;
setInterval(function () {
    navigator.geolocation.getCurrentPosition(function (p) {
        last = p;
        if (onChangeHandler) {
            onChangeHandler(p);
        }
    })
}, 1000);

module.exports = {
    watch: function (fn) {
        onChangeHandler = fn;
    },
    get: function (done) {
        var hash = getFromHash();
        if (hash) {
            return done(hash);
        }
        if (!last) {
            return setTimeout(function () {
                done(last);
            }, 1100);
        } 
        done(last);
    },
    toMetrs: toMetrs
}
