/** @jsx React.DOM */
var React = require('react'),
    compas = require('../emitters/compas');

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

    return a * 180 / Math.PI + alpha;
}

function addAlphaOffset(a1, a2) {

    if (a1 < a2) {
        while (a2 - a1 > 270) {
            a1 += 360;
        }
        return a1;
    } else {
        while (a1 - a2 > 270) {
            a1 -= 360;
        }
        return a1;
    }
}


module.exports = React.createClass({

    getInitialState: function () {
        this._lastAlpha = 0;
        return {alpha: 0};
    },

    componentWillMount: function () {
        var _this = this;

        this._onCompas = function (alpha) {
            _this.setState({alpha: alpha});
        };

        compas.on('alpha', this._onCompas);
    },

    componentWillUnmount: function () {
        compas.off('alpha', this._onCompas);
    },

    render: function () {
        var alpha = formatAlpha(this.props.local, this.props.remote, this.state.alpha);
        alpha = addAlphaOffset(alpha, this._lastAlpha);
        this._lastAlpha = alpha;

        return <div className="compas" style={{'-webkit-transform': 'rotate(' + alpha + 'deg)'}}>
            <div className="compas__arrow" style={{'border-bottom-color': this.props.color}}></div>
        </div>;
    }
});
