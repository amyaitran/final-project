import React from 'react';
import socketIOClient from 'socket.io-client';

export default class MobileGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstAnswer: null,
      secondAnswer: null
    };
    // this.handleCreate = this.handleCreate.bind(this);
  }

  render() {
    return (
      <div className="mb-container center">
        <h3>answers must start with<br/><span className="yellow fs-med">P</span></h3>
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
