/** @jsx React.DOM */
var React = require('react'),
    geo = require('./geo');

module.exports =  React.createClass({
    render: function () {
        var style = {
            color: this.props.color,
            'border-color': this.props.color
        }

        return <div className="user-icon" style={style}>
            adas
        </div>
    }
});
