var React = require('react'),
    ReactEmitterMixin = require('../utils/react-emitter-mixin'),
    profile = require('../emitters/profile'),

    DEFAULT_USER_NAME = '<username>';

module.exports = React.createClass({

    mixins: [ReactEmitterMixin],
    emitters: [profile],

    getInitialState: function () {
        return {
            userName: profile.userName
        };
    },

    render: function () {
        return React.DOM.input({
            type: 'text',
            className: 'user-name',
            value: profile.getName(),
            placeholder: DEFAULT_USER_NAME,
            onChange: this._onChange
        });
    },

    _onChange: function (e) {
        var name = e.target.value;
        profile.setName(name);
    }

});
