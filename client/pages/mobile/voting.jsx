import React from 'react';

export default class MobileVoting extends React.Component {
  render() {
    return (
      <div className="mb-container center">
        <h3 className="fs-med">is this answer <span className="yellow">valid?</span></h3>
        <div className="row vote-btn bg-green center">
          <div className="col-half black fs-med fw-semi-bold">
            yes
          </div>
          <div className="col-half">
            <i className="green fs-med fas fa-check"></i>
          </div>
        </div>
        <div className="row vote-btn bg-red center">
          <div className="col-half black fs-med fw-semi-bold">
            no
          </div>
          <div className="col-half">
            <i className="red fs-med fas fa-times"></i>
          </div>
        </div>
      </div>
    );
  }
}
