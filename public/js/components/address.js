/** @jsx React.DOM */
var React = require('react');

module.exports =  React.createClass({

    render: function () {
        var style = {
            color: this.props.color,
            'border-color': this.props.color
        };
        var _this = this,
            userName = this.props.userName || '<username>';

        return <div className="user-icon" style={style}>
            {userName}: {this.props.address}
        </div>;
    }
});
