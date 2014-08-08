var start = Date.now(),
	join = [].join,
	S = 1000,
	M = S * 60; 

function formatTime(ms) {
	if (ms < S) {
		return ms + 'ms';
	}
	if (ms < M) {
		return ~~(ms / S) + 's';
	}
	return ~~(ms / M) + 'm';
}

module.exports = function () {
	var time = formatTime(Date.now() - start);
	var message = '[' + time + '] ' +
		join.call(arguments, ', ');

	console.log(message);
};
