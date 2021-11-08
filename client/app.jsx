import React from 'react';
import Home from './pages/dt-home';
import Mobile from './pages/mb-home';
import DesktopPlay from './pages/dt-play';
import MobilePlay from './pages/mb-play';
import parseRoute from './lib/parse-route';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      route: parseRoute(window.location.hash)
    };
  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      this.setState(
        { route: parseRoute(window.location.hash) }
      );
    });
  }

  renderPage() {
    const { path } = this.state.route;
    if (path === '') {
      return <Home />;
    } else if (path === 'mobile') {
      return <Mobile />;
    } else if (path === 'game') {
      return <DesktopPlay />;
    } else if (path === 'play') {
      return <MobilePlay />;
    }
  }

  render() {
    return this.renderPage();
  }
}
