import React from 'react';
import parseRoute from './lib/parse-route';
import RoomCreation from './components/dt-start';
import DesktopGame from './components/dt-play-answer';
import MobileGame from './components/mb-play-answer';
import PlayerCreation from './components/mb-start';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      route: parseRoute(window.location.hash),
      gameId: null
    };
    this.updateGameId = this.updateGameId.bind(this);
  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      this.setState(
        { route: parseRoute(window.location.hash) }
      );
    });
  }

  updateGameId(result) {
    this.setState({ gameId: result });
    console.log('app state has changed:');
  }

  renderPage() {
    const { route, gameId } = this.state;
    if (route.path === '') {
      return <RoomCreation
        data={ { gameId: gameId, updateGameId: this.updateGameId.bind(this) } } />;
    } else if (route.path === 'mobile') {
      return <PlayerCreation
        data={ { gameId: gameId, updateGameId: this.updateGameId.bind(this) } }/>;
    } else if (route.path === 'game') {
      return <DesktopGame data={ { gameId } }/>;
    } else if (route.path === 'play') {
      return <MobileGame data={ { gameId } }/>;
    }
  }

  render() {
    return (
      this.renderPage()
    );
  }
}
