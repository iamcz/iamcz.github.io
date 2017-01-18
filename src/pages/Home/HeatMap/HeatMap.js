import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import simpleheat from 'simpleheat';

export default class HeatMap extends Component {
  constructor(props) {
    super(props);
  }

  setHeights = () => {
    const canvas = ReactDOM.findDOMNode(this.refs.canvas);

    this.height = canvas.clientHeight;
    this.width = canvas.clientWidth;
  }

  render() {
    return <canvas className='canvas' ref='canvas' />;
  }
}
