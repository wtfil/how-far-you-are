/** @jsx React.DOM */
var React = require('react'),
    Address = require('./address'),
    Compas = require('./compas'),
    socket = require('../emitters/socket'),
    geo = require('../emitters/geo-location');

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
            className: 'message in-center'
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

        socket.joinRoom(this.props.id);
        this._onGeo = function (local) {
            _this.setState({
                local: local
            });

            socket.send({
                position: local
            });

        };

        this._onSocket = function (data) {
    		var remote = _this.state.remote;
    		console.log(data);

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

        };
        socket.on('message', this._onSocket);
        geo.on('position', this._onGeo);


    },

    componentWillUnmount: function () {
    	socket.leftRoom(this.props.id);
        socket.off('message', this._onSocket);
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
            <div className="position in-center">
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
