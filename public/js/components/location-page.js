var React = require('react'),
    ReactEmitterMixin = require('../utils/react-emitter-mixin'),
    Address = require('./address'),
    Compas = require('./compas'),
    geo = require('../emitters/geo-location'),
    profile = require('../emitters/profile'),
    room = require('../emitters/room');

function formatDistance(d) {
	return null;
	if (!d) {
		return null;
	} else if (d < 1e3) {
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

module.exports = React.createClass({

    mixins: [ReactEmitterMixin],
    emitters: [room, geo, profile],

    getInitialState: function () {
        return {
            local: null,
            remote: {}
        };
    },

    componentDidMount: function () {
        room.join(this.props.params.id);
    },

    componentDidUnmount: function () {
        room.leave(this.props.params.id);
    },

    render: function () {
        var remotes = room.getMembers();
        var localPosition = geo.getPosition();

        if (this.errors) {
        	return <Message error text={this.errors[0].message} />;
        }
        if (!remotes.length) {
            return <Message/>;
        }
        var distances = remotes.map(item => geo.toMetrs(localPosition, item.position));
        var minDistance = formatDistance(Math.min.apply(null, distances));

        return <div className="full-screen">
            <div className="full-screen__top">
            {remotes.map((remote, index) => {
                return <Address color={colorOrder[index]} address={remote.address} userName={remote.userName}/>;
            })}
            </div>
            {localPosition && localPosition.address &&
            	<div className="full-screen__bottom">
                	<Address color="#3399FF" address={localPosition.address} userName={profile.getName()}/>
            	</div>
            }
            <div className="position in-center">
                <div>
                    {remotes.map((remote, index) => {
                        return <Compas local={localPosition} remote={remote.position} color={colorOrder[index]} />;
                    })}
                </div>
                <div className="distance">{minDistance || 'Wait'}</div>
            </div>
        </div>;
    }

});
