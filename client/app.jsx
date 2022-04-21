import React from 'react';
import parseRoute from './lib/parse-route';
import RoomCreation from './pages/desktop/start';
import PlayerCreation from './pages/mobile/start';
import DesktopAnswer from './pages/desktop/answer';
import MobileAnswer from './pages/mobile/answer';
import MobileDisqualify from './pages/mobile/disqualify';
import DesktopVoting from './pages/desktop/voting';
import MobileVoting from './pages/mobile/voting';

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
    this.setState({ gameId: result });
  }

  updateNumberOfPlayers(result) {
    this.setState({ numberOfPlayers: result });
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
