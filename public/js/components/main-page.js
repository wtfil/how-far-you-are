/** @jsx React.DOM */
var React = require('react'),
    Enviroment = require('react-router-component').environment.pathnameEnvironment;

module.exports =  React.createClass({
    render: function () {
        return <div className="full-screen">
            <button onClick={this._onClick} className="btn btn-primary share in-center">Share your location</button>
        </div>;
    },
    _onClick: function () {
        var id = Date.now() + Math.random();
        Enviroment.setPath('/' + id, {});
    }
});
