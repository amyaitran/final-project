import React from 'react';
import createGameId from '../lib/create-game-id';

export default class RoomCreation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gameId: '',
      created: false
    };
    this.handleCreate = this.handleCreate.bind(this);
  }

  handleCreate(event) {
    this.setState({ created: true });
  }

  render() {
    return (
      <>
        <div className="center">
          {
          (!this.state.created)
            ? <button onClick={this.handleCreate}>create a new game!</button>
            : <h2>
                <span className="purple font-size-med">room code:<br/></span>{createGameId()}
              </h2>
          }
        </div>
      </>
    );
  }
}
