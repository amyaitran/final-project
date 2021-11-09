import React from 'react';
import Mobile from './pages/mb-home';
import DesktopPlay from './pages/dt-play';
import MobilePlay from './pages/mb-play';
import parseRoute from './lib/parse-route';
import RoomCreation from './components/dt-start';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      route: parseRoute(window.location.hash),
      gameId: null
    };
    this.createGame = this.createGame.bind(this);
  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      this.setState(
        { route: parseRoute(window.location.hash) }
      );
    });
  }

  createGame(result) {
    this.setState({ gameId: result }, () => console.log('app state:', this.state));
  }

  renderPage() {
    const { path } = this.state.route;
    if (path === '') {
      return <RoomCreation data={
        { gameId: this.state.gameId, createGame: this.createGame.bind(this) }
        } />;
    } else if (path === 'mobile') {
      return <Mobile />;
    } else if (path === 'game') {
      return <DesktopPlay />;
    } else if (path === 'play') {
      return <MobilePlay />;
    }
  }

  render() {
    return (
      this.renderPage()
    );
  }
}
