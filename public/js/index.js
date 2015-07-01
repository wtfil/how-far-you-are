import React from 'react'
import { Router, Route, Link } from 'react-router';
import { history } from 'react-router/lib/BrowserHistory';
import UserName from './components/user-name';
import MainPage from './components/main-page';
import LocationPage from './components/location-page';

var App = React.createClass({
    render() {
        return <div>
            <div className="header">
                <div className="header__left">
                    <a href="/">Home</a>
                </div>
                <div className="header__right">
                    <UserName/>
                </div>
            </div>
            <div className="content">
            	{this.props.children}
            </div>
        </div>;
    }
});

window.addEventListener('DOMContentLoaded', function () {
	React.render((
		<Router history={history}>
			<Route path="" component={App}>
				<Route path="/:id" component={LocationPage} />
				<Route path="/" component={MainPage}/>
			</Route>
		</Router>
	), document.body);
});
