var React = require('react'),
    Enviroment = require('react-router-component').environment.pathnameEnvironment,
    ajax = require('../utils/ajax');

module.exports =  React.createClass({
    render: function () {
        return <div className="full-screen">
            <button onClick={this._onClick} className="btn btn-primary share in-center">Share your location</button>
        </div>;
    },
    _onClick: function () {
    	ajax('/rooms', function (e, response) {
        	Enviroment.setPath('/' + response.id, {});
    	});
    }
});
