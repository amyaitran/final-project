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
      gameId: null,
      prompts: []
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
  }

  updatePrompts(result) {
    this.setState({ prompts: result });
  }

  renderPage() {
    const { route, gameId, prompts } = this.state;
    if (route.path === '') {
      return <RoomCreation gameId={gameId} updateGameId={this.updateGameId.bind(this)} />;
    } else if (route.path === 'mobile') {
      return <PlayerCreation gameId={gameId} updateGameId={this.updateGameId.bind(this)} />;
    } else if (route.path === 'game') {
      return <DesktopGame gameId={gameId} updatePrompts={this.updatePrompts.bind(this)} />;
    } else if (route.path === 'play') {
      return <MobileGame gameId={gameId} prompts={prompts} />;
    }
  }
  // renderPage() {
  //   const { route, gameId, prompts } = this.state;
  //   if (route.path === '') {
  //     return <RoomCreation
  //       data={ { gameId: gameId, updateGameId: this.updateGameId.bind(this) } } />;
  //   } else if (route.path === 'mobile') {
  //     return <PlayerCreation
  //       data={ { gameId: gameId, updateGameId: this.updateGameId.bind(this) } }/>;
  //   } else if (route.path === 'game') {
  //     return <DesktopGame data={ { gameId, updatePrompts: this.updatePrompts.bind(this) } }/>;
  //   } else if (route.path === 'play') {
  //     return <MobileGame data={ { gameId, prompts } }/>;
  //   }
  // }

  render() {
    return this.renderPage();
  }
}
