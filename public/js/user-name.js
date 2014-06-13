var React = require('react'),
    profile = require('./profile'),
    DEFAULT_USER_NAME = '<username>';

module.exports = React.createClass({

    getInitialState: function () {
        return {
            userName: profile.userName
        };
    },

    componentWillMount: function () {

        this._onChangeName = function (userName) {
            this.setState({userName: userName});
        }.bind(this);

        profile.on('name', this._onChangeName);
    },

    componentWillUnmount: function () {
        profile.off('name', this._onChangeName);
    },

    render: function () {
        return React.DOM.input({
            type: 'text',
            className: 'user-name',
            value: this.state.userName,
            placeholder: DEFAULT_USER_NAME,
            onChange: this._onChange
        });
    },

    _onChange: function (e) {
        var name = e.target.value;
        profile.changeName(name);
    }
});

