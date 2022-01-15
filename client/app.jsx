import React from 'react';
import parseRoute from './lib/parse-route';
import RoomCreation from './components/dt-start';
import PlayerCreation from './components/mb-start';
import DesktopAnswer from './components/dt-answer';
import MobileAnswer from './components/mb-answer';
import MobileDisqualify from './components/mb-disqualify';
import DesktopVoting from './components/dt-voting';
import MobileVoting from './components/mb-voting';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      route: parseRoute(window.location.hash),
      gameId: null,
      playerName: null,
      numberOfPlayers: 0,
      prompts: [],
      answers: [],
      roundNumber: 0
    };
    this.updateGameId = this.updateGameId.bind(this);
    this.updateNumberOfPlayers = this.updateNumberOfPlayers.bind(this);
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

  updateNumberOfPlayers(result) {
    this.setState({ numberOfPlayers: result }, () => console.log('app state for numberOfPlayers:', this.state.numberOfPlayers));
  }

  updatePrompts(result) {
    this.setState({ prompts: this.state.prompts.concat(result) }, () => console.log('app state for prompts:', this.state.prompts));
  }

  updatePlayerName(result) {
    this.setState({ playerName: result }, () => console.log('app state for playerName:', this.state.playerName));
  }

  updateAnswers(result) {
    this.setState({ answers: this.state.answers.concat(result) }, () => console.log('app state for answers:', this.state.answers));
  }

  updateRoundNumber(result) {
    this.setState({ roundNumber: this.state.roundNumber + 1 }, () => console.log('app state for roundNumber:', this.state.roundNumber));
  }

  renderPage() {
    const { route, gameId, numberOfPlayers, playerName, roundNumber, answers } = this.state;
    if (route.path === '') {
      return <RoomCreation
              updateGameId={this.updateGameId.bind(this)}
              updateNumberOfPlayers={this.updateNumberOfPlayers.bind(this)} />;
    } else if (route.path === 'mobile') {
      return <PlayerCreation
              gameId={gameId}
              updateGameId={this.updateGameId.bind(this)}
              updatePlayerName={this.updatePlayerName.bind(this)} />;
    } else if (route.path === 'game') {
      return <DesktopAnswer
              gameId={gameId}
              roundNumber={roundNumber}
              numberOfPlayers={numberOfPlayers}
              updateRoundNumber={this.updateRoundNumber.bind(this)}
              updatePrompts={this.updatePrompts.bind(this)} />;
    } else if (route.path === 'play') {
      return <MobileAnswer
              gameId={gameId}
              playerName={playerName}
              updateRoundNumber={this.updateRoundNumber.bind(this)}
              updateAnswers={this.updateAnswers.bind(this)} />;
    } else if (route.path === 'game-vote') {
      return <DesktopVoting
              gameId={gameId}/>;
    } else if (route.path === 'play-disqualify') {
      return <MobileDisqualify
              gameId={gameId}
              answers={answers}
              roundNumber={roundNumber} />;
    } else if (route.path === 'play-vote') {
      return <MobileVoting
              gameId={gameId} />;
    }
  }

  render() {
    return this.renderPage();
  }
}
