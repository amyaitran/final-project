import React from 'react';
import socketIOClient from 'socket.io-client';
import generateRandomLetter from '../lib/generate-random-letter';

export default class DesktopGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      countdown: 3,
      timerComplete: false
    };
  }

  componentDidMount() {
    this.startCountdown();
  }

  //   componentWillUnmount() {
  //    clearInterval(this.startCountdown);
  // }

  startCountdown() {
    this.countdownID = setInterval(
      () => {
        if (this.state.countdown === 0) {
          clearInterval(this.countdownID);
        } else {
          this.setState({ countdown: this.state.countdown - 1 });
        }
      }, 1000);
  }

  // this.countdownID = setInterval(
  //   () => this.setState(
  //     { countdownSeconds: this.state.countdownSeconds - 1 }
  //   ), 1000);

  render() {
    return (
      (this.state.countdown === 0)
        ? <div className="center">
            <h1 className="mb-0">random letter:</h1>
            <h1 className="fs-big margin-0 yellow">{generateRandomLetter()}</h1>
            <h1>1:58</h1>
          </div>
        : <div className="center">
           <h1 className="fs-big">{this.state.countdown}</h1>
          </div>
    );
  }
}
