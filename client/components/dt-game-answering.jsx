import React from 'react';
import socketIOClient from 'socket.io-client';

export default class DesktopGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
    // this.handleCreate = this.handleCreate.bind(this);
  }

  render() {
    return (
      <div className="center">
        <h1 className="mb-0">random letter:</h1>
        <h1 className="fs-big margin-0 yellow">P</h1>
        <h1>1:58</h1>
      </div>
    );
  }
}
