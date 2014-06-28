/** @jsx React.DOM */
var React = require('react'),
    Enviroment = require('react-router-component').environment.pathnameEnvironment;

module.exports =  React.createClass({
    render: function () {
        return <div className="full-screen share">
            <button onClick={this._onClick} className="btn btn-primary">Share your location</button>
        </div>
    },
    _onClick: function () {
        var id = Date.now() + Math.random();
        Enviroment.setPath('/' + id, {});
    }
});
