/** @jsx React.DOM */
var React = require('react'),
    router = require('react-router-component'),
    Locations = router.Locations,
    Location = router.Location,
    UserName = require('./user-name'),
    MainPage = require('./main-page'),
    LocationPage = require('./location-page');

var App = React.createClass({
    render: function () {
        return <div>
            <div className="header">
                <div className="header__right">
                    <UserName/>
                </div>
            </div>
            <div className="content">
                <Locations>
                    <Location path="/" handler={MainPage} />
                    <Location path="/:id" handler={LocationPage} />
                </Locations>
            </div>
        </div>
    }
});

window.addEventListener('load', function () {
    React.renderComponent(App(), document.querySelector('.app'));
});
