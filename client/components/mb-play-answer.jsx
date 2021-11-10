import React from 'react';
import socketIOClient from 'socket.io-client';

export default class MobileGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      prompts: [],
      randomLetter: null
    };
  }

  componentDidMount() {
    this.socket = socketIOClient('/mobile', { query: `gameId=${this.props.gameId}` });
    this.socket.on('random letter', letter => this.setState({ randomLetter: letter }));
    this.socket.on('random prompts', data => this.setState({ prompts: data }));
  }

  componentWillUnmount() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  renderCards() {
    return (
      this.state.prompts.map(prompt => {
        return (
      <div key={prompt.promptId} className="note mt-1 padding-1">
        <h3 className="black margin-0">{prompt.question}</h3>
        <ul className="purple text-align-left padding-left-15">
          <li>
            <input
            name="firstAnswer"
            key={prompt.promptId}
            type="text"
            className="answer"
            placeholder="Answer"/>
          </li>
          <li>
            <input
            name="secondAnswer"
            key={prompt.promptId}
            type="text"
            className="answer"
            placeholder="Secondary Answer"/>
          </li>
        </ul>
      </div>
        );
      })
    );
  }

  render() {
    return (
      <div className="mb-container center">
        <h3>answers must start with<br/><span className="yellow fs-med">{this.state.randomLetter}</span></h3>
        { this.renderCards() }
      </div>
    );
  }
}
