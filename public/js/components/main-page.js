import React from 'react'
import {Navigation} from 'react-router';

module.exports =  React.createClass({
    mixins: [Navigation],
    render: function () {
        return <div className="full-screen">
            <button onClick={this.onClick} className="btn btn-primary share in-center">Share your location</button>
        </div>;
    },
    onClick: function () {
        fetch('/rooms')
        .then(res => res.json())
        .then(data => this.transitionTo('/' + data.id));
    }
});
