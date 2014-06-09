/**
 * Handle events
 */
function EventEmiter() {
    this._listeners = Object.create(null);
}

/**
 * Emiting event
 *
 * @param {String} name of event
 * @param {Mixed} data passed into handler
 */
EventEmiter.prototype.emit = function (name, data) {
    if (this._listeners[name]) {
        this._listeners[name].forEach(function (haldler) {
            haldler(data);
        });
    }
    return this;
};

/**
 * Add subscriber
 *
 * @param {String} name of event
 * @param {Function} haldler
 */
EventEmiter.prototype.on = function (name, haldler) {
    if (!this._listeners[name]) {
        this._listeners[name] = [];
    }
    this._listeners[name].push(haldler);
    return this;
};

/**
 * Remove subscriber(s)
 *
 * @param {String} [name] if not set all handlers will removed
 * @param {Function} [handler] if not set all handler for <name> event will removed
 * @return {EventEmiter} this
 */
EventEmiter.prototype.off = function (name, handler) {
    if (!arguments.legth) {
        this._listeners = Object.create(null);
    } else if (!handler) {
        this._listeners[name] = null;
    } else {
        this._listeners[name] = this._listeners[name].filter(function (fn) {
            return fn !== handler;
        });
    }
    return this;
};


module.exports = EventEmiter;
