import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import simpleheat from 'simpleheat';

const RESIZE = 'resize';
const DIMENSIONS = 3;
const DELTA = 1 / 10000;
const POINT_RADIUS = 10;
const BLUR_RADIUS = 15;
const GRADIENT = { 0: 'white', 1: '#bb0a1e' };

export default class HeatMap extends Component {
  static propTypes = {
    numPaths: PropTypes.number,
    frameRate: PropTypes.number,
    stepSize: PropTypes.number,
    memory: PropTypes.number, // Integer propType validation?
  };

  static defaultProps = {
    numPaths: 3,
    frameRate: 0.1 * 1000,
    stepSize: 1 / 1000,
    memory: 100,
  };

  outOfBounds = (point) => {
    return undefined !== point.find(((val) => val >= 0 && val <= 1));
  }

  getNextPoint = (lastPoint) => {
    const z = 2 * Math.random() - 1;
    const theta = 2 * Math.PI * Math.random();
    const sqrt = Math.sqrt(1 - z * z);
    const x = sqrt * Math.cos(theta);
    const y = sqrt * Math.sin(theta);
    const delta = [x, y, z].map(val => val * this.props.stepSize);
    const nextPoint = lastPoint.map((val, idx) => val + delta[idx]);
    if (this.outOfBounds(nextPoint)) { return this.randomPoint(); } // new path generation
    return nextPoint;
  }

  updatePaths = () => {
    this.paths.forEach(path => {
      const lastPoint = path[path.length - 1];
      path.push(this.getNextPoint(lastPoint));
      if (path.length > this.props.memory) { path.shift(); }
    });
  }

  transformedPoint = (point) => {
    const x = point[0], y = point[1], z = point[2];
    return [
      x * this.height,
      y * this.height,
      z,
      // 1 / ((1 + DELTA) - z),
    ]
  }

  transformedPaths = () => {
    return this.paths.map((path) => {
      return path.map(this.transformedPoint)
    }).reduce(((a, b) => a.concat(b)));
  }

  randomPoint = () => {
    const point = [];
    for (let i = 0; i < DIMENSIONS; i += 1) { point.push(Math.random()); }
    return point;
  }

  // rerun this on numPaths prop is updated
  setPaths = () => {
    const { props } = this;
    const points = [];
    for (let i = 0; i < props.numPaths; i += 1) { points.push(this.randomPoint()); }
    this.paths = points.map(point => [point]);
  }

  clearPaths = () => {
    delete this.paths;
  }


  getCanvasNode = () => {
    return findDOMNode(this.refs.canvas);
  }

  clearDimensions = () => {
    delete this.height;
    delete this.width;
  }

  setDimensions = () => {
    const canvas = this.getCanvasNode();

    this.height = canvas.clientHeight;
    this.width = canvas.clientWidth;
  }

  onResize = () => {
    // We don't call this.heatMap.resize because we call this.heatMap.data on every interval update
    // since we want there to be a limited memory on the the heat map thus resize would be a waste
    // of processing. If this had an infinite memory this.heatMap.resize may offer a performance
    // improvement.
    this.setDimensions();
  }

  setResizeListener = () => {
    window.addEventListener(RESIZE, this.onResize)
  }

  clearResizeListener = () => {
    window.removeEventListener(RESIZE, this.onResize)
  }

  // clearInterval & setInterval will have to be rerun every time frameRate prop is updated
  setInterval = () => {
    this.interval = window.setInterval(() => {
      this.updatePaths();
      // const wants = this.transformedPaths();
      // debugger;
      this.heatMap.data(this.transformedPaths()).draw(); // necessary for limited memory functionality
    }, this.props.frameRate)
  }

  clearInterval = () => {
    window.clearInterval(this.interval);
    delete this.interval;
  }

  setHeatMap = () => {
    this.heatMap = simpleheat(this.getCanvasNode());
    this.heatMap.radius(POINT_RADIUS, BLUR_RADIUS);
    this.heatMap.gradient(GRADIENT);
  }

  clearHeatMap = () => {
    this.heatMap.clear();
    delete this.heatMap;
  }

  componentDidMount() {
    this.setDimensions();
    this.setInterval();
    this.setHeatMap();
    this.setPaths();
  }

  componentWillUnmount() {
    this.clearDimensions();
    this.clearInterval();
    this.clearHeatMap();
    this.clearPath();
  }

  calculateData = () => {
    this.updateData()
  }

  render() {
    return <canvas className='canvas' ref='canvas' />;
  }
}
