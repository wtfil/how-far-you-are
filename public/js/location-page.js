/** @jsx React.DOM */
var React = require('react'),
    eio = require('engine.io-client'),
    geo = require('./geo');

var socket = eio.Socket('ws://' + location.host);

var lastId;
function joinRoom(id) {
    if (id === lastId) {
        return;
    } 
    socket.send(JSON.stringify({room: id}));
}

function formatDistance(d) {
    if (d < 1e3) {
        return d.toFixed(0) + 'm';
    } else if (d < 1e6) {
        return (d * 1e-3).toFixed(2) + 'km';
    } else {
        return d.toFixed(0) + 'km';
    }
}

module.exports =  React.createClass({

    getInitialState: function () {
        return {
            distance: 0
        };
    },

    componentWillMount: function () {
        var _this = this;

        joinRoom(this.props.id);
        geo.watch(function (p1) {
            socket.send(JSON.stringify({distance: p1}));
        });

        socket.on('message', function (data) {
            try {
                var p1 = JSON.parse(data).distance;
            } catch(e){};
            geo.get(function (p2) {
                var d = geo.toMetrs(p1.coords, p2.coords);
                _this.setState({distance: d});
            });
        })
    },

    componentWillUnmount: function () {
            
    },

    render: function () {
        return <div className="full-screen">
            <div className="distance">
                {formatDistance(this.state.distance)}
            </div>
        </div>
    }

});
