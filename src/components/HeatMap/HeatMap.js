import React, { PureComponent, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import simpleheat from 'simpleheat';

const RESIZE = 'resize';
const DIMENSIONS = 3;
const DELTA = 1 / 10000;
const POINT_RADIUS = 20;
const BLUR_RADIUS = 60;
const GRADIENT = { 0: 'white', 1: '#bb0a1e' };
const NUM_RUNS = 5;

export default class HeatMap extends PureComponent {
  static propTypes = {
    numPaths: PropTypes.number,
    frameRate: PropTypes.number,
    stepSize: PropTypes.number,
    memory: PropTypes.number, // Integer propType validation?
  };

  static defaultProps = {
    numPaths: 3,
    frameRate: 0.02 * 1000,
    stepSize: Number.MIN_VALUE,
    memory: 1000,
  };

  constructor(props) {
    super(props);
  }

  outOfBounds = (point) => {
    return undefined !== point.find(((val) => val >= 0 && val <= 1));
  }

  getNextPoint = (path) => {
    const lastPoint = path[path.length - 1];
    const pointBeforeLast = path[path.length - 2];
    let lastDelta;
    if (!!pointBeforeLast) {
      lastDelta = pointBeforeLast.map((val, i) => lastPoint[i] - val);
    } else {
      lastDelta = [0, 0, 0];
    }
    const z = 2 * Math.random() - 1;
    const theta = 2 * Math.PI * Math.random();
    const sqrt = Math.sqrt(1 - z * z);
    const x = sqrt * Math.cos(theta);
    const y = sqrt * Math.sin(theta);
    const delta = [x, y, z].map((val, i) => val + lastDelta[i]).map(val => val * this.props.stepSize);
    const nextPoint = lastPoint.map((val, idx) => val + delta[idx]);
    if (this.outOfBounds(nextPoint)) { return this.randomPoint(); } // new path generation
    return nextPoint;
  }

  updatePaths = () => {
    this.paths.forEach(path => {
      path.push(this.getNextPoint(path));
      if (path.length > this.props.memory) { path.shift(); }
    });
  }

  transformedPoint = (point) => {
    const x = point[0], y = point[1], z = point[2];
    return [
      x * this.width,
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
    for (let i = 0; i < props.numPaths; i += 1) {
      points.push(this.randomPoint());
    }
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

    this.height = window.innerHeight;
    this.width = window.innerWidth;
    const { height, width } = this;
    canvas.setAttribute('height', height);
    canvas.setAttribute('width', width);
  }

  onResize = () => {
    // We don't call this.heatMap.resize because we call this.heatMap.data on every interval update
    // since we want there to be a limited memory on the the heat map thus resize would be a waste
    // of processing. If this had an infinite memory this.heatMap.resize may offer a performance
    // improvement.
    this.setDimensions();
    this.heatMap.resize();
    const scale = this.width * this.height / (1440 * 803);
    const adjustedScale = scale * (1 - scale);
    this.heatMap.radius(POINT_RADIUS * scale, BLUR_RADIUS * scale);
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
      for (let i = 0; i < NUM_RUNS; i += 1) { this.updatePaths(); }
      this.heatMap.data(this.transformedPaths()).draw(); // necessary for limited memory functionality
    }, this.props.frameRate)
  }

  clearInterval = () => {
    window.clearInterval(this.interval);
    delete this.interval;
  }

  setHeatMap = () => {
    this.heatMap = simpleheat(this.getCanvasNode());
    const scale = this.width / 1440;
    this.heatMap.radius(POINT_RADIUS * scale, BLUR_RADIUS * scale);
    this.heatMap.gradient(GRADIENT);
  }

  clearHeatMap = () => {
    this.heatMap.clear();
    delete this.heatMap;
  }

  componentWillMount() {
  }

  componentDidMount() {
    this.setDimensions();
    this.setInterval();
    this.setHeatMap();
    this.setPaths();
    this.setResizeListener();
  }

  componentWillUnmount() {
    this.clearDimensions();
    this.clearInterval();
    this.clearHeatMap();
    this.clearPath();
    this.clearResizeListener();
  }

  calculateData = () => {
    this.updateData()
  }

  render() {
    const { height, width } = this;
    return <canvas className='canvas' ref='canvas' height={height} width={width} />;
  }
}
