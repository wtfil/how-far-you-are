var start = Date.now(),
	slice = [].slice,
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
	var args = slice.call(arguments);
	args.unshift('[' + time + ']');
	console.log.apply(console, args);
};
