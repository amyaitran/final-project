import React from 'react';
import socketIOClient from 'socket.io-client';

export default class MobileDisqualify extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submitted: false,
      playerAnswers: [],
      duplicateAnswers: [],
      originalAnswers: []
    };
    this.renderAnswers = this.renderAnswers.bind(this);
    this.renderDuplicates = this.renderDuplicates.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.submitUniqueAnswers = this.submitUniqueAnswers.bind(this);
  }

  componentDidMount() {
    this.socket = socketIOClient('/mobile', { query: `gameId=${this.props.gameId}` });
    const arrayOfPromptIds = this.props.answers.map(answer => answer.promptId);
    const currentRoundPromptId = arrayOfPromptIds.sort()[this.props.roundNumber];
    fetch(`/api/get-answers/${this.props.gameId}/${currentRoundPromptId}`)
      .then(response => response.json())
      .then(data => {
        this.setState({
          playerAnswers: data.map(datum => {
            const { promptId, answer1, answer2, name } = datum;
            return (
              (datum.answer1)
                ? (datum.answer2)
                    ? this.state.playerAnswers.concat(
                      { promptId: promptId, answer1: answer1, name: name, id: `${promptId}-${name}-answer1` },
                      { promptId: promptId, answer2: answer2, name: name, id: `${promptId}-${name}-answer2` })
                    : this.state.playerAnswers.concat(
                      { promptId: promptId, answer1: answer1, name: name, id: `${promptId}-${name}-answer1` })
                : this.state.playerAnswers
            );
          }).flat()
        });
      });
    this.socket.on('start voting', () => {
      window.location.hash = '#play-vote';
    });
  }

  handleCheck(event) {
    const checkedAnswerInput = this.state.playerAnswers.find(answer => answer.id === event.target.id);
    const checkedDuplicateInput = this.state.duplicateAnswers.find(answer => answer.id === event.target.id);
    const uncheckedAnswerInputs = this.state.playerAnswers.filter(answer => answer.id !== event.target.id);
    const uncheckedDuplicateInputs = this.state.duplicateAnswers.filter(answer => answer.id !== event.target.id);
    if (this.state.playerAnswers.includes(checkedAnswerInput)) {
      this.setState({ playerAnswers: uncheckedAnswerInputs });
      this.setState({ duplicateAnswers: this.state.duplicateAnswers.concat(checkedAnswerInput).flat() });
    } else {
      this.setState({ duplicateAnswers: uncheckedDuplicateInputs });
      this.setState({ playerAnswers: this.state.playerAnswers.concat(checkedDuplicateInput).flat() });
    }
  }

  renderAnswers() {
    return (
      this.state.playerAnswers.map(answer => {
        const answerNumber = answer.answer1 ? 'answer1' : 'answer2';
        return (
        <div className="purple handwritten text-align-left"
             key={`${answer.promptId}-${answer.name}-${answerNumber}`}>
          <label htmlFor={`${answer.promptId}-${answer.name}-${answerNumber}`}>
            <input
              type="checkbox"
              className="mr-6"
              id={`${answer.promptId}-${answer.name}-${answerNumber}`}
              onChange={this.handleCheck} />
            {answer[answerNumber]}
          </label>
        </div>
        );
      })
    );
  }

  renderDuplicates() {
    return (
      this.state.duplicateAnswers.map(answer => {
        const answerNumber = answer.answer1 ? 'answer1' : 'answer2';
        return (
        <div className="purple handwritten text-align-left"
             key={`${answer.promptId}-${answer.name}-${answerNumber}`}>
          <label htmlFor={`${answer.promptId}-${answer.name}-${answerNumber}`}>
            <input
              type="checkbox"
              checked="checked"
              className="mr-6"
              id={`${answer.promptId}-${answer.name}-${answerNumber}`}
              onChange={this.handleCheck} />
            {answer[answerNumber]}
          </label>
        </div>
        );
      })
    );
  }

  submitUniqueAnswers() {
    this.socket.emit('unique answers', this.state.playerAnswers);
    this.setState({ submitted: true });
  }

  componentWillUnmount() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  render() {
    return (
      this.state.submitted === true
        ? <h3 className="center purple fs-med">submitted!</h3>
        : <div className="mb-container center">
            <h3>mark all duplicate answers</h3>
            <div className="note bg-yellow mt-1 padding-1">
              <h3 className="black mt-0 mb-3">original answers</h3>
              { this.renderAnswers() }
            </div>

            <div className="note bg-light-yellow mt-1 padding-1">
              <h3 className="black mt-0 mb-3">duplicate answers</h3>
              { this.renderDuplicates() }
            </div>

            <button onClick={this.submitUniqueAnswers} className="fs-reg mt-2 width-8 height-2">submit!</button>
          </div>
    );
  }
}
