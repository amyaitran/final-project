import React from 'react';
import socketIOClient from 'socket.io-client';

export default class MobileGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      prompts: [],
      randomLetter: null,
      playerAnswers: []
    };
    this.handleChange1 = this.handleChange1.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
  }

  componentDidMount() {
    this.socket = socketIOClient('/mobile', { query: `gameId=${this.props.gameId}` });
    this.socket.on('random letter', letter => this.setState({ randomLetter: letter }));
    this.socket.on('random prompts', data => {
      this.setState({ prompts: data });
      data.map(datum => {
        const placeholderAnswer =
        {
          promptId: datum.promptId,
          name: this.props.playerName,
          answer1: null,
          answer2: null
        };
        return this.setState({ playerAnswers: this.state.playerAnswers.concat(placeholderAnswer) });
      });
    });
    this.socket.on('round number', number => this.props.updateRoundNumber());
    this.socket.on('timer end', () => {
      this.props.updateAnswers(this.state.playerAnswers);
      this.state.playerAnswers.map(answer => this.handleSubmitAnswers(answer));
      window.location.hash = '#play-vote';
    });
  }

  handleSubmitAnswers(answer) {
    const req = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...answer, gameId: this.props.gameId })
    };
    fetch('/api/submit-answers', req)
      .then(response => response.json())
      .catch(error => {
        console.error('Error:', error);
      });
  }

  handleChange1(event) {
    this.setState(prevState => ({
      playerAnswers: prevState.playerAnswers.map(answer => {
        return (
          answer.promptId === parseInt(event.target.id)
            ? { ...answer, answer1: event.target.value }
            : answer
        );
      })
    }));
  }

  handleChange2(event) {
    this.setState(prevState => ({
      playerAnswers: prevState.playerAnswers.map(answer => {
        return (
          answer.promptId === parseInt(event.target.id)
            ? { ...answer, answer2: event.target.value }
            : answer
        );
      })
    }));
  }

  toggleSecondAnswer(promptId) {
    const targetAnswer = this.state.playerAnswers.find(playerAnswer => playerAnswer.promptId === promptId);
    return (
      (targetAnswer && targetAnswer.answer1)
        ? <li>
            <input
            name="answer2"
            onChange={this.handleChange2}
            id={targetAnswer.promptId}
            type="text"
            className="answer"
            placeholder="Secondary Answer"/>
          </li>
        : '');
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

  componentWillUnmount() {
    if (this.socket) {
      this.socket.disconnect();
    }
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
