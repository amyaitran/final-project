import React from 'react';
import createGameId from '../lib/create-game-id';
import socketIOClient from 'socket.io-client';

export default class RoomCreation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isGameCreated: false,
      gameId: null
    };
    this.handleCreate = this.handleCreate.bind(this);
  }

  handleCreate(event) {
    this.setState({
      isGameCreated: true,
      gameId: createGameId()
    }, () => {
      this.createGameRoom();
    });
  }

  createGameRoom(event) {
    const { gameId } = this.state;
    const req = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ gameId })
    };
    fetch('/api/create-game', req)
      .then(response => response.json())
      .then(data => {
        this.socket = socketIOClient('/desktop', { query: `gameId=${gameId}` });
        this.socket.emit('create room', gameId);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  componentWillUnmount() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  render() {
    return (
      <div className="center">
        {
        (this.state.isGameCreated)
          ? <h2>
              <span className="purple font-size-med">room code:<br/></span>{this.state.gameId}
            </h2>
          : <a href="#create-game">
              <button onClick={this.handleCreate}>create a new game!</button>
            </a>
        }
      </div>
    );
  }
}
