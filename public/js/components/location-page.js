/** @jsx React.DOM */
var React = require('react'),
    ReactEmitterMixin = require('../utils/react-emitter-mixin'),
    Address = require('./address'),
    Compas = require('./compas'),
    geo = require('../emitters/geo-location'),
    room = require('../emitters/room');

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
    	var content = this.props.text || [
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
    	];

    	var className = 'message in-center';

    	if (this.props.error) {
    		className += ' error';
    	}

        return React.DOM.div({className: className}, content);
    },

    _onSelectUrl: function () {
        this.refs.input.getDOMNode().select();
    }
});

module.exports =  React.createClass({

    mixins: [ReactEmitterMixin],
    emitters: [room],

    getInitialState: function () {
        return {
            local: null,
            remote: {}
        };
    },

    componentDidMount: function () {
        room.join(this.props.id);
    },

    componentDidUnmount: function () {
        room.left(this.props.id);
    },

    render: function () {
        var s = room.getMembers(),
            remote = s.remote[Object.keys(s.remote)[0]];

        if (this.errors) {
        	return <Message error text={this.errors[0].message} />;
        }
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
