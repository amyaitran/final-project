import React from 'react';
import createGameId from '../lib/create-game-id';
import socketIOClient from 'socket.io-client';

export default class RoomCreation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      endpoint: 'http://localhost:3001',
      created: false,
      gameId: null
    };
    this.handleCreate = this.handleCreate.bind(this);
  }

  // componentDidMount(event) {
  //   const desktopSocket = socketIOClient(`${this.state.endpoint}/desktop`);
  //   desktopSocket.on('new player', data => console.log('data received from mobile to desktop:', data));
  // }

  handleCreate(event) {
    this.setState({
      created: true,
      gameId: createGameId()
    }, () => {
      this.insertCodeToDB();
      this.initiateDesktopSocket();
    });
  }

  insertCodeToDB(event) {
    const req = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ gameId: this.state.gameId })
    };
    fetch('/api/create-game', req)
      .then(response => response.json())
      .catch(error => {
        console.error('Error:', error);
      });
  }

  initiateDesktopSocket() {
    const desktopSocket = socketIOClient(`${this.state.endpoint}/desktop`);
    desktopSocket.emit('create room', this.state.gameId);
  }

  render() {
    return (
      <div className="center">
        {
        (!this.state.created)
          ? <a href="#create-game">
              <button onClick={this.handleCreate}>create a new game!</button>
            </a>
          : <h2>
              <span className="purple font-size-med">room code:<br/></span>{this.state.gameId}
            </h2>
        }
      </div>
    );
  }
}
