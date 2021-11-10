import React from 'react';
import socketIOClient from 'socket.io-client';
import generateRandomLetter from '../lib/generate-random-letter';
import convertTime from '../lib/convert-time';

export default class DesktopGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      randomLetter: null,
      countdown: 3,
      timer: 2
    };
  }

  componentDidMount() {
    this.setState({ randomLetter: generateRandomLetter() });
    this.startCountdown();
  }

  startCountdown() {
    this.countdownID = setInterval(
      () => {
        if (this.state.countdown === 0) {
          clearInterval(this.countdownID);
          this.startTimer();
        } else {
          this.setState({ countdown: this.state.countdown - 1 });
        }
      }, 1000);
  }

  startTimer() {
    this.socket = socketIOClient('/desktop', { query: `gameId=${this.props.data.gameId}` });
    this.timerID = setInterval(
      () => {
        if (this.state.timer === 0) {
          clearInterval(this.timerID);
          this.socket.emit('random letter', this.state.randomLetter);
        } else {
          this.setState({ timer: this.state.timer - 1 });
        }
      }, 1000);
  }

  componentWillUnmount() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  render() {
    return (
      (this.state.countdown === 0)
        ? <div className="center">
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
