import React from 'react';

export default class PlayerCreation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: null,
      gameId: null
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleJoin = this.handleJoin.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleJoin(event) {
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
  }

  render() {
    return (
      <>
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
                required />
              </div>
            </div>
            <div className="center">
              <button className="col-six-tenths fw-semi-bold shadow">play!</button>
            </div>
          </div>
        </form>
      </>
    );
  }
}
