/** @jsx React.DOM */
var React = require('react'),
    router = require('react-router-component'),
    Locations = router.Locations,
    Location = router.Location,
    profile = require('./profile'),
    MainPage = require('./main-page'),
    LocationPage = require('./location-page');

var Header = React.createClass({
    getInitialState: function () {
        return {
            userName: profile.userName
        }
    },
    componentWillMount: function () {
        this._onChangeName = function (userName) {
            this.setState({userName: userName});
        }.bind(this);
        profile.on('name', this._onChangeName);
    },

    componentWillUnmount: function () {
        profile.off('name', this._onChangeName);
    },

    render: function () {
        return <div className="header">
            <div className="header__right">
                <input type="text" value={this.state.userName} defaultValue="<username>" onChange={this._onChange}/>
            </div>
        </div>
    },

    _onChange: function (e) {
        var name = e.target.value;
        profile.changeName(name);
    }
});

var App = React.createClass({
    render: function () {

        return <div>
            <Header/>
            <Locations>
                <Location path="/" handler={MainPage} />
                <Location path="/:id" handler={LocationPage} />
            </Locations>
        </div>
    }
});

window.addEventListener('load', function () {
    React.renderComponent(App(), document.querySelector('.app'));
});
