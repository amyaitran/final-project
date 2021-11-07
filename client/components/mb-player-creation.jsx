import React from 'react';
import socketIOClient from 'socket.io-client';

export default class PlayerCreation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: null,
      gameId: null,
      isCodeValid: null
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleJoin = this.handleJoin.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleJoin(event) {
    event.preventDefault();
    const req = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state)
    };
    fetch('/api/join-game', req)
      .then(response => response.json())
      .catch(error => {
        console.error('Error:', error);
      });
    this.initiateMobileSocket();
  }

  initiateMobileSocket() {
    const { name, gameId } = this.state;
    const socket = socketIOClient('/mobile', { query: `gameId=${gameId}` });
    socket.emit('create player', { name });
    socket.on('valid id', valid => {
      if (valid) {
        this.setState({ isCodeValid: true });
      } else {
        this.setState({ isCodeValid: false });
      }
    });
  }

  render() {
    return (
      (this.state.isCodeValid)
        ? <div className="center">
            <button className="height-5"><span className="fw-reg">everybody is in!<br/></span>START</button>
          </div>
        : <>
          <form onSubmit={this.handleJoin}>
            <div className="container">
              <div className="ml-15">
                <div className="col-full">
                  <label htmlFor="name" className="fs-med fw-semi-bold">name</label>
                </div>
              </div>
              <div className="mb-2">
                <div className="col-full center">
                  <input
                  onChange={this.handleChange}
                  type="text"
                  name="name"
                  className="shadow"
                  placeholder="enter your name"
                  maxLength="12"
                  required />
                </div>
              </div>
              <div className="ml-15">
                <div className="col-full">
                  <label htmlFor="gameId" className="fs-med fw-semi-bold">room code</label>
                </div>
              </div>
              <div className="mb-2">
                <div className="col-full center">
                  <input
                  onChange={this.handleChange}
                  type="text"
                  name="gameId"
                  className="shadow"
                  placeholder="enter 4-letter code"
                  maxLength="4"
                  required />
                </div>
                { (this.state.isCodeValid === false)
                  ? <p className="red bg-yellow center">invalid game code!</p>
                  : <p className="hidden">invalid game code!</p>}
              </div>
              <div className="center">
                <button className="col-six-tenths shadow">play!</button>
              </div>
            </div>
          </form>
       </>
    );
  }
}
