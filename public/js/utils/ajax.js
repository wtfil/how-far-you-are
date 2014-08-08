var TIMEOUT = 1000;

function ajax (url, done) {
    var xhr = new XMLHttpRequest(),
        timerDone = false,

        timer = setTimeout(function () {
            timerDone = true;
            xhr.abort();
            done(new Error('Timeout'));
        });

    xhr.onload = function (r) {
        if (timerDone || xhr.readyState !== 4) {
            return;
        }

        clearTimeout(timer);
        done(null, xhr.responseText);
    };

    xhr.onerror = done;
    xhr.open('get', url);
    xhr.send();

}

module.exports = ajax;
