import React from 'react';
import socketIOClient from 'socket.io-client';

export default class MobileGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstAnswer: null,
      secondAnswer: null,
      randomLetter: null
    };
  }

  receiveRandomLetter() {
    this.socket = socketIOClient('/mobile');
    // this.socket = socketIOClient('/mobile', { query: `gameId=${gameId}` });
    socket.on('random letter', letter => {
      console.log('receiving letter from server', letter);
      this.setState({ randomLetter: letter });
    });
  }

  render() {
    return (
      <div className="mb-container center">
        <h3>answers must start with<br/><span className="yellow fs-med">{this.state.randomLetter}</span></h3>
        <div className="note mt-1 padding-1">
          <h3 className="black margin-0">1. a presidents name</h3>
          <ul className="purple text-align-left padding-left-15">
            <li><input type="text" className="answer" placeholder="Answer"/></li>
            <li><input type="text" className="answer" placeholder="Secondary Answer"/></li>
          </ul>
        </div>
      </div>
    );
  }
}
