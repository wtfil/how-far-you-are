var TIMEOUT = 1000;

function ajax (url, done) {
    var xhr = new XMLHttpRequest(),
        timerDone = false,

        timer = setTimeout(function () {
            timerDone = true;
            xhr.abort();
            done(new Error('Timeout'));
        }, TIMEOUT);

    xhr.onload = function (r) {
        if (timerDone || xhr.readyState !== 4) {
            return;
        }

        clearTimeout(timer);
        try {
        	done(null, JSON.parse(xhr.responseText));
        } catch(err) {
            done(err);
        }
    };

    xhr.onerror = done;
    xhr.open('get', url);
    xhr.send();

}

module.exports = ajax;
