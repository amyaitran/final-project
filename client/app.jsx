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
      answers: [],
      roundNumber: 0
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
    this.setState({ gameId: result });
  }

  updatePrompts(result) {
    this.setState({ prompts: this.state.prompts.concat(result) });
  }

  updatePlayerName(result) {
    this.setState({ playerName: result });
  }

  updateAnswers(result) {
    this.setState({ answers: this.state.answers.concat(result) });
  }

  updateRoundNumber(result) {
    this.setState({ roundNumber: this.state.roundNumber + 1 });
  }

  renderPage() {
    const { route, gameId, playerName, roundNumber, answers } = this.state;
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
              roundNumber={roundNumber}
              updateRoundNumber={this.updateRoundNumber.bind(this)}
              updatePrompts={this.updatePrompts.bind(this)} />;
    } else if (route.path === 'play') {
      return <MobileGame
              gameId={gameId}
              playerName={playerName}
              updateRoundNumber={this.updateRoundNumber.bind(this)}
              updateAnswers={this.updateAnswers.bind(this)} />;
    } else if (route.path === 'play-vote') {
      return <MobileVoting
              gameId={gameId}
              answers={answers}
              roundNumber={roundNumber} />;
    }
  }

  render() {
    return this.renderPage();
  }
}
