import React, { Component } from 'react';
import HeatMap from 'HeatMap';
import LiveText from 'LiveText';

const VIBRATE_ENABLED = !!window.navigator;

const IDENTITIES = [
  'Charles Zahn',
  'c + i',
];

const RATE = 0.15 * 1000;
const DELAY = 3 * 1000;
const RESIZE = 'resize';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getState = () => { return { height: window.innerHeight }; }
  updateHeight = () => { this.setState(this.getState()); }
  setResizeListener = () => { window.addEventListener(RESIZE, this.updateHeight); }
  clearResizeListener = () => { window.removeEventListener(RESIZE, this.updateHeight); }

  componentDidMount() {
    this.setResizeListener();
  }

  componentWillUnmount() {
    this.clearResizeListener();
  }

  render() {
    const { height } = this.state;
    return (
      <div>
        <HeatMap />
        <div className='absolute'>
          <div className='main-content' style={{ height }}>
            <h1 className='headline'>
              {'I am '}
              <LiveText texts={IDENTITIES} />
            </h1>
          </div>
        </div>
      </div>
    );
  }
}
