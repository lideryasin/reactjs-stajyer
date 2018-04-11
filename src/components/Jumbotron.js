import React, { Component } from 'react';
import './Jumbotron.css';

class Jumbotron extends Component {
  render() {
    return (
      <div className="jumbotron ">
        <div className="container">
          <p className="yazi">{this.props.subtitle}</p>
        </div>
      </div>
    );
  }
}

export default Jumbotron;