/** @jsx React.DOM */
var React = require('react');

module.exports =  React.createClass({

    render: function () {

    	if (!this.props.address) {
    		return <div></div>;
    	}

        var style = {
            color: this.props.color,
            'border-color': this.props.color
        };
        var _this = this,
            userName = this.props.userName || '<username>';

        return <div className="address" style={style}>
            {userName}: {this.props.address}
        </div>;
    }
});
