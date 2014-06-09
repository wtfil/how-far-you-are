/** @jsx React.DOM */
var React = require('react'),
    router = require('react-router-component'),
    Locations = router.Locations,
    Location = router.Location,
    MainPage = require('./main-page'),
    LocationPage = require('./location-page');

var App = React.createClass({
    render: function () {
        return <Locations>
            <Location path="/" handler={MainPage} />
            <Location path="/:id" handler={LocationPage} />
        </Locations>
    }
});

window.addEventListener('load', function () {
    React.renderComponent(App(), document.querySelector('.app'));
});
