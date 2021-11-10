import React from 'react';
import socketIOClient from 'socket.io-client';

export default class MobileVoting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  handleCheck() {
    console.log('something checked');
    // this.setState
  }

  render() {
    return (
      <div className="mb-container center">
        <h3>mark all duplicate answers</h3>
        <div className="note bg-yellow mt-1 padding-1">

          <h3 className="black mt-0 mb-1">original answers</h3>
          <div className="purple handwritten text-align-left">
            <label htmlFor="answerlol">
              <input
                type="checkbox"
                className="mr-6"
                onChange={this.handleCheck} />
              original answer 1
            </label>
          </div>

          <div className="purple handwritten text-align-left">
            <label htmlFor="answerlol">
              <input
                type="checkbox"
                className="mr-6"
                onChange={this.handleCheck} />
              original answer 2
            </label>
          </div>

        </div>

        <div className="note bg-light-yellow mt-1 padding-1">
          <h3 className="black mt-0 mb-1">duplicate answers</h3>
          <div className="purple handwritten text-align-left">
            <label htmlFor="someanswer">
              <input
                type="checkbox"
                className="mr-6"
                onChange={this.handleCheck} />
              duplicate answer
            </label>
          </div>
        </div>

        <button className="fs-reg mt-2 width-8 height-2">submit!</button>
      </div>
    );
  }
}
