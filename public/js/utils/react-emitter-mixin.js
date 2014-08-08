var debug = require('./debug');

module.exports = {
    componentWillMount: function () {
        [].concat(this.emitters).forEach(function (emitter) {
            emitter.on('change', this._update);
            emitter.on('error', this._error);
        }, this);
    },

    componentWillUnmount: function () {
        [].concat(this.emitters).forEach(function (emitter) {
            emitter.off('change', this._update);
            emitter.off('error', this._error);
        }, this);
    },

    _update: function () {
        this.forceUpdate();
    },

    _error: function (e) {
    	if (this.onError) {
    		return this.onError(e);
    	}
    	debug('error', e.message);
    	this.errors = [e];
    	this.forceUpdate();
    }
};
