import React from 'react';
import parseRoute from './lib/parse-route';
import RoomCreation from './components/dt-start';
import PlayerCreation from './components/mb-start';
import DesktopGame from './components/dt-play-answer';
import MobileGame from './components/mb-play-answer';
import MobileVoting from './components/mb-play-voting';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      route: parseRoute(window.location.hash),
      gameId: null,
      playerName: null,
      prompts: [],
      answers: []
    };
    this.updateGameId = this.updateGameId.bind(this);
    this.updatePlayerName = this.updatePlayerName.bind(this);
    this.updatePrompts = this.updatePrompts.bind(this);
    this.updateAnswers = this.updateAnswers.bind(this);
  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      this.setState(
        { route: parseRoute(window.location.hash) }
      );
    });
  }

  updateGameId(result) {
    this.setState({ gameId: result }, () => console.log('app state for gameId:', this.state.gameId));
  }

  updatePrompts(result) {
    this.setState({ prompts: this.state.prompts.concat([result]) }, () => console.log('app state for prompts:', this.state.prompts));
    // this.setState({ prompts: this.state.prompts.concat(result) });
  }

  updatePlayerName(result) {
    this.setState({ playerName: result }, () => console.log('app state for playerName:', this.state.playerName));
  }

  updateAnswers(result) {
    this.setState({ answers: this.state.answers.concat([result]) }, () => console.log('app state for answers:', this.state.answers));
    // this.setState({ answers: this.state.answers.concat([result]) });
    // this.setState({ answers: result });
  }

  renderPage() {
    const { route, gameId, prompts, playerName } = this.state;
    if (route.path === '') {
      return <RoomCreation
              gameId={gameId}
              updateGameId={this.updateGameId.bind(this)} />;
    } else if (route.path === 'mobile') {
      return <PlayerCreation
              gameId={gameId}
              updateGameId={this.updateGameId.bind(this)}
              updatePlayerName={this.updatePlayerName.bind(this)} />;
    } else if (route.path === 'game') {
      return <DesktopGame
              gameId={gameId}
              updatePrompts={this.updatePrompts.bind(this)} />;
    } else if (route.path === 'play') {
      return <MobileGame
              gameId={gameId}
              playerName={playerName}
              updateAnswers={this.updateAnswers.bind(this)} />;
      // updatePrompts={this.updatePrompts.bind(this)} />;
    } else if (route.path === 'play-vote') {
      return <MobileVoting
              gameId={gameId}
              prompts={prompts} />;
    }
  }

  render() {
    return this.renderPage();
  }
}
