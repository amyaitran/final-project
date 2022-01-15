import React from 'react';
import socketIOClient from 'socket.io-client';
import generateRandomLetter from '../lib/generate-random-letter';
import convertTime from '../lib/convert-time';

export default class DesktopAnswer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      randomLetter: null,
      countdown: 3,
      timer: 20,
      playersSubmitted: 0,
      originalAnswers: []
    };
  }

  componentDidMount() {
    this.setState({ randomLetter: generateRandomLetter() });
    this.startCountdown();
    this.fetchRandomPrompts();
    this.props.updateRoundNumber();
    this.socket.emit('round number', this.props.roundNumber);
    this.receiveUniqueAnswers();
  }

  startCountdown() {
    this.socket = socketIOClient('/desktop', { query: `gameId=${this.props.gameId}` });
    this.countdownID = setInterval(
      () => {
        if (this.state.countdown === 0) {
          clearInterval(this.countdownID);
          this.socket.emit('random letter', this.state.randomLetter);
          this.startTimer();
        } else {
          this.setState({ countdown: this.state.countdown - 1 });
        }
      }, 1000);
  }

  startTimer() {
    this.timerID = setInterval(
      () => {
        if (this.state.timer === 0) {
          clearInterval(this.timerID);
          this.socket.emit('timer end');
        } else {
          this.setState({ timer: this.state.timer - 1 });
        }
      }, 1000);
  }

  fetchRandomPrompts() {
    fetch('/api/prompts')
      .then(response => response.json())
      .then(data => {
        this.props.updatePrompts(data);
        this.socket.emit('random prompts', data);
      });
  }

  receiveUniqueAnswers() {
    const submittedAnswers = [];

    this.socket.on('unique answers', answers => {
      submittedAnswers.push(answers);
      this.setState({ playersSubmitted: this.state.playersSubmitted + 1 });
      if (this.state.playersSubmitted === this.props.numberOfPlayers) {
        const originalAnswers = submittedAnswers.flat().map(answer => {
          if (submittedAnswers.flat().reduce((count, ans) => (ans === answer ? count + 1 : count), 0) > (this.props.numberOfPlayers / 2)) {
            return answer;
          } else return null;
        });
        this.props.updateAnswers(originalAnswers);
        window.location.hash = 'game-vote';
      }
    });

  }

  componentWillUnmount() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  render() {
    return (
      (this.state.countdown === 0)
        ? (this.state.timer === 0)
            ? <div className="center mt-6">
              <h1>only <span className="yellow">unique</span> answers <br/>are allowed</h1>
              <h2>please identify duplicate answers</h2>
            </div>
            : <div className="center">
              <h1 className="mb-0">random letter:</h1>
              <h1 className="fs-big margin-0 yellow">{this.state.randomLetter}</h1>
              <h1>{convertTime(this.state.timer)}</h1>
            </div>
        : <div className="center">
            <h1 className="fs-big">{this.state.countdown}</h1>
          </div>
    );
  }
}
