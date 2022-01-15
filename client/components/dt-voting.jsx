import React from 'react';
import socketIOClient from 'socket.io-client';

export default class DesktopVoting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playersSubmitted: 0,
      originalAnswers: []
    };
  }

  componentDidMount() {
    this.socket = socketIOClient('/desktop', { query: `gameId=${this.props.gameId}` });
    this.socket.emit('start voting');
  }

  componentWillUnmount() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  render() {
    return (
      <div className="center">
        <h2>Judging Amy&#39;s answer...</h2>
        <div className="dt-container bg-yellow fs-med mt-1 padding-1 margin-0 width-400px">
          <h4 className="black margin-0">
            Things that take too long
          </h4>
          <h3 className="margin-0 purple handwritten">
            CSS flexbox
          </h3>
        </div>

        <div className="dt-container fs-med mt-1 padding-1 margin-0 width-400px">
          <h4 className="black margin-0">
            Voting...
          </h4>
          <div className="row center purple handwritten fs-14">
            <div className="col-one-fifth">
              <i className="red rotate fas fa-square-full"></i>
            </div>
            <div className="col-three-fifths fs-med text-align-left">
              player 1
            </div>
            <div className="col-one-fifth">
              <i className="green fs-med fas fa-check"></i>
            </div>
          </div>
          <div className="row center purple handwritten fs-14">
            <div className="col-one-fifth">
              <i className="red rotate fas fa-square-full"></i>
            </div>
            <div className="col-three-fifths fs-med text-align-left">
              player 2
            </div>
            <div className="col-one-fifth">
              <i className="red fs-med fas fa-times"></i>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
