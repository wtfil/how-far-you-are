/** @jsx React.DOM */
var React = require('react'),
    User = require('./user-icon'),
    eio = require('engine.io-client'),
    geo = require('./geo'),
    compas = require('./compas');

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

function formatAlpha(c1, c2, alpha) {

    if (!c1 || !c2) {
        return 0;
    }

    var dlat = c2.latitude - c1.latitude,
        dlon = c2.longitude - c1.longitude,
        a = Math.atan(dlon / dlat);

    if (a < 0) {
        a += Math.PI;
    }
    if (dlat < 0) {
        a += Math.PI;
    }

    /*return alpha;*/
    /*return a * 180 / Math.PI;*/
    return a * 180 / Math.PI + alpha;
}

var colorOrder = [
    '#FE941E'
];

module.exports =  React.createClass({

    getInitialState: function () {
        return {
            alpha: 0,
            distance: 0,
            trackers: [1,2]
        };
    },

    componentWillMount: function () {
        var _this = this;

        joinRoom(this.props.id);
        this._onGeo = function (p) {
            geo.geocode(p.coords, function (address) {
                _this.setState({myAddress: address});
            });
            socket.send(JSON.stringify({distance: p}));
        }
        geo.on('position', this._onGeo);

        socket.on('message', function (data) {
            try {
                var p1 = JSON.parse(data).distance;
            } catch(e){};

            var p2 = geo.get();

            if (!p2) {
                return;
            }

            var d = geo.toMetrs(p1.coords, p2.coords);
            
            geo.geocode(p1.coords, function (address) {
                _this.setState({
                    hisAddress: address
                });
            });
            _this.setState({
                distance: d,
                me: p2.coords,
                he: p1.coords
            });
        });

        this._onCompas = function (alpha) {
            _this.setState({alpha: alpha});
        }

        compas.on('alpha', this._onCompas);
    },

    componentWillUnmount: function () {
        compas.off('alpha', this._onCompas);
        geo.off('distance', this._onGeo);
    },

    render: function () {
        var s = this.state,
            alpha = formatAlpha(s.me, s.he, s.alpha);

        return <div className="full-screen">
            <div className="full-screen__top">
                <User color="#FE941E" address={s.hisAddress}/>
            </div>
            <div className="full-screen__bottom">
                <User color="#3399FF" address={s.myAddress}/>
            </div>
            <div className="position">
                <div className="distance">
                    {formatDistance(this.state.distance)}
                </div>
                <div className="compas" style={{'-webkit-transform': 'rotate(' + alpha + 'deg)'}}>
                    <div className="compas__arrow"></div>
                </div>
            </div>
        </div>
    }

});
