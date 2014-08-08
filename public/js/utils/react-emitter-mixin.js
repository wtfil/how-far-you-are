module.exports = {
    componentWillMount: function () {
        [].concat(this.emitters).forEach(function (emitter) {
            emitter.on('change', this._update);
        }, this);
    },

    componentWillUnmount: function () {
        [].concat(this.emitters).forEach(function (emitter) {
            emitter.off('change', this._update);
        }, this);
    },

    _update: function () {
        this.forceUpdate();
    }
};
