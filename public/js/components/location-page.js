/** @jsx React.DOM */
var React = require('react'),
    Address = require('./address'),
    Compas = require('./compas'),
    eio = require('engine.io-client'),
    geo = require('../emitters/geo-location');

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

var colorOrder = [
    '#FE941E',
    '#009933',
    '#996600'
];

var Message = React.createClass({
    render: function () {
        return React.DOM.div({
            className: 'message'
        }, 
            'Waiting for connections...',
            React.DOM.br(),
            'Share this url with your friends',
            React.DOM.input({
                type: 'text',
                ref: 'input',
                value: window.location.href,
                className: 'message__url',
                onClick: this._onSelectUrl,
            })
        );
    },

    _onSelectUrl: function () {
        this.refs.input.getDOMNode().select();
    }
});

module.exports =  React.createClass({

    getInitialState: function () {
        return {
            local: null,
            remote: {}
        };
    },

    componentWillMount: function () {
        var _this = this;

        joinRoom(this.props.id);
        this._onGeo = function (local) {
            _this.setState({
                local: local
            });

            socket.send(JSON.stringify({
                position: local
            }));

        };
        geo.on('position', this._onGeo);

        socket.on('message', function (data) {
            var remote = _this.state.remote;

            try {
                data = JSON.parse(data);
            } catch(e){}

            if (data.position) {
                remote[data.socketId] = data.position;
            } else if (data.disconnected) {
                delete remote[data.socketId];
            }

            _this.setState({
                remote: remote
            });


        });

    },

    componentWillUnmount: function () {
        geo.off('distance', this._onGeo);
    },

    render: function () {
        var s = this.state,
            remote = s.remote[Object.keys(s.remote)[0]];

        //TODO make better
        if (!s.local || !remote) {
            return <Message/>;
        }

        var distance = geo.toMetrs(s.local, remote),
            ids = Object.keys(s.remote);
        distance = formatDistance(distance);

        return <div className="full-screen">
            <div className="full-screen__top">
                {ids.map(function (id, index) {
                    var remote = s.remote[id];                              
                    return <Address color={colorOrder[index]} address={remote.address} userName={remote.userName}/>;
                })}
            </div>
            <div className="full-screen__bottom">
                <Address color="#3399FF" address={s.local.address} userName={s.local.userName}/>
            </div>
            <div className="position">
                <div>
                    {ids.map(function (id, index) {
                        return <Compas local={s.local} remote={s.remote[id]} color={colorOrder[index]} />;
                    })}
                </div>
                <div className="distance">{distance}</div>
            </div>
        </div>;
    }

});
