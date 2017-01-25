import React, { Component, PropTypes } from 'react';

const RATE = 0.15 * 1000;
const DELAY = 3 * 1000;

export default class LiveText extends Component {
  static propTypes = {
    texts: PropTypes.arrayOf(PropTypes.string).isRequired,
  }

  constructor(props) {
    super(props);
    this.state = this.getStateFromProps(props);
  }

  getStateFromProps = (props) => {
    return {
      identityIndex: 0,
      identityCharCount: props.texts[0].length,
      erasing: true,
    };
  }

  getFullIdentity = () => this.props.texts[this.state.identityIndex];
  getIdentity = () => this.getFullIdentity().slice(0, this.state.identityCharCount);
  isFull = () => this.state.identityCharCount === (this.getFullIdentity().length);
  isEmpty = () => this.state.identityCharCount === 0;

  updateIdentity = () => {
    const isEmpty = this.isEmpty();
    const isFull = this.isFull();
    const identityIndex = isEmpty ?
      (this.state.identityIndex + 1) % this.props.texts.length :
      this.state.identityIndex;

    const erasingShouldChange = (this.state.erasing && isEmpty) || (!this.state.erasing && isFull);
    const erasing = erasingShouldChange ? !this.state.erasing : this.state.erasing;
    const identityCharCount = this.state.identityCharCount + (erasing ? -1 : 1);

    this.setState({ identityIndex, identityCharCount, erasing });
  }

  setTimer = () => {
    this.timer = window.setTimeout(() => {
      this.updateIdentity();
      if (this.timer) { this.setTimer(); }
    }, this.isFull() ? DELAY : RATE);
  }

  clearTimer = () => {
    delete this.timer;
  }

  updateHeight = () => { this.setState({ height: window.innerHeight }); }

  componentDidMount() {
    this.setTimer();
  }

  componentWillUnmount() {
    this.clearTimer();
    this.clearResizeListener();
  }

  render() {
    return (<span>{this.getIdentity()}</span>);
  }
}

