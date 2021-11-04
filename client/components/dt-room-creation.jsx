import React from 'react';
import createGameId from '../lib/create-game-id';
import socketIOClient from 'socket.io-client';

// const SERVER = 'http://127.0.0.1:8080';
// const socket = socketClient(SERVER);
// socket.on('connection', () => {
//   console.log('I\'m connected with the back-end');
// });

export default class RoomCreation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      created: false,
      gameId: null,
      endpoint: 'http://localhost:3001',
      response: null
    };
    this.handleCreate = this.handleCreate.bind(this);
  }

  componentDidMount() {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    // ^connects us to the server and opens up a socket connection.
    socket.on('connection', () => {
      console.log('I\'m connected with the back-end');
    });
    // Listen for data on the "outgoing data" namespace and supply a callback for what to do when we get one. In this case, we set a state variable
    // socket.on('outgoing data', data => this.setState({ response: data.num }));
  }

  handleCreate(event) {
    this.setState({
      created: true,
      gameId: createGameId()
    }, () => {
      this.transmitCode();
    });
  }

  transmitCode(event) {
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

  render() {
    return (
      <>
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
      </>
    );
  }
}
