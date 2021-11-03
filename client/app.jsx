import React from 'react';
import Home from './pages/dt-home';
import Mobile from './pages/mb-home';
import parseRoute from './lib/parse-route';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      route: parseRoute(window.location.hash)
    };
  }

  renderPage() {
    const { path } = this.state.route;
    if (path === '') {
      return <Home />;
    }
    if (path === 'mobile') {
      return <Mobile />;
    }
  }

  render() {
    return this.renderPage();
  }
}
