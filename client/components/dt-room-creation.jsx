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
      (this.state.isGameCreated)
        ? <>
            <div className="center">
              <h2>
                <span className="purple font-size-med">room code:<br/></span>{this.state.gameId}
              </h2>
            </div>
            <div className="center">
              <div className="dt-container">
                <h2 className="black fs-med margin-0">Waiting for players...</h2>
                <div className="row">
                  <div className="col-half text-align-left">
                    <ul className="purple line-height-3 handwritten fs-14">
                      <li><i className="red rotate fas fa-square-full"></i>
                        Amy
                      </li>
                      <li><i className="red rotate fas fa-square-full"></i>
                        charchar
                      </li>
                      <li><i className="red rotate fas fa-square-full"></i>
                        player xyz
                      </li>
                      <li><i className="tan rotate fas fa-square-full"></i>
                      </li>
                    </ul>
                  </div>
                  <div className="col-half text-align-left">
                    <ul className="purple line-height-2 handwritten fs-14">
                      <li><i className="tan rotate fas fa-square-full"></i>
                      </li>
                      <li><i className="tan rotate fas fa-square-full"></i>
                      </li>
                      <li><i className="tan rotate fas fa-square-full"></i>
                      </li>
                      <li><i className="tan rotate fas fa-square-full"></i>
                      </li>
                    </ul>
                  </div>
                </div>

              </div>
            </div>
          </>
        : <>
            <h1 className="text-align-center">
              Oft-Topic
            </h1>
            <div className="center">
              <a href="#create-game">
                <button onClick={this.handleCreate}>create a new game!</button>
              </a>
            </div>
          </>
    );
  }
}
