import React from 'react';
import socketIOClient from 'socket.io-client';

export default class MobileGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      prompts: [],
      randomLetter: null
    };
    this.handleChange1 = this.handleChange1.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
  }

  componentDidMount() {
    this.socket = socketIOClient('/mobile', { query: `gameId=${this.props.gameId}` });
    this.socket.on('random letter', letter => this.setState({ randomLetter: letter }));
    this.socket.on('random prompts', data => this.setState({ prompts: data }));
    this.socket.on('timer end', () => {
      console.log('timer has ended');
      this.submitAnswers();
      window.location.hash = '#play-vote';
    });
  }

  handleChange1(event) {
    this.setState(prevState => ({
      prompts: prevState.prompts.map(prompt => {
        return (
          (prompt.promptId === parseInt(event.target.id))
            ? { ...prompt, answer1: event.target.value }
            : prompt
        );
      })
    }));
  }

  handleChange2(event) {
    this.setState(prevState => ({
      prompts: prevState.prompts.map(prompt => {
        return (
          (prompt.promptId === parseInt(event.target.id))
            ? { ...prompt, answer2: event.target.value }
            : prompt
        );
      })
    }));
  }

  submitAnswers() {
    console.log('submitting answers');
  }

  toggleSecondAnswer(promptId) {
    const targetPrompt = this.state.prompts.find(prompt => prompt.promptId === parseInt(promptId));
    return (
      targetPrompt.answer1
        ? <li>
            <input
            name="answer2"
            onChange={this.handleChange2}
            id={prompt.promptId}
            type="text"
            className="answer"
            placeholder="Secondary Answer"/>
          </li>
        : '');
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
          <div key={prompt.promptId} className="note bg-light-yellow mt-1 padding-1">
            <h3 className="black margin-0">{prompt.question}</h3>
            <ul className="purple text-align-left padding-left-15">
              <li>
                <input
                name="answer1"
                onChange={this.handleChange1}
                id={prompt.promptId}
                type="text"
                className="answer"
                placeholder="Answer"/>
              </li>
              {this.toggleSecondAnswer(prompt.promptId)}
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
