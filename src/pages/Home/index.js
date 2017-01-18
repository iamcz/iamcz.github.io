import React, { Component } from 'react';
import CSSTransitionGroup from 'react-addons-css-transition-group';

const IDENTITIES = [
  'Charles Zahn',
  'c + i',
];

const RATE = 0.15 * 1000;
const DELAY = 3 * 1000;

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      identityIndex: 0,
      identityCharCount: IDENTITIES[0].length,
      erasing: true,
    };
  }

  getFullIdentity = () => IDENTITIES[this.state.identityIndex];
  getIdentity = () => this.getFullIdentity().slice(0, this.state.identityCharCount);
  isFull = () => this.state.identityCharCount === (this.getFullIdentity().length);
  isEmpty = () => this.state.identityCharCount === 0;

  updateIdentity = () => {
    const isEmpty = this.isEmpty();
    const isFull = this.isFull();
    const identityIndex = isEmpty ?
      (this.state.identityIndex + 1) % IDENTITIES.length :
      this.state.identityIndex;

    const erasingShouldChange = (this.state.erasing && isEmpty) || (!this.state.erasing && isFull);
    const erasing = erasingShouldChange ? !this.state.erasing : this.state.erasing;
    const identityCharCount = this.state.identityCharCount + (erasing ? -1 : 1);

    this.setState({ identityIndex, identityCharCount, erasing });
  }

  setTimer = () => {
    setTimeout(() => {
      this.updateIdentity()
      this.setTimer()
    }, this.isFull() ? DELAY : RATE);
  }

  componentDidMount() {
    this.setTimer()
  }

  render() {
    return (
      <div className='main-content'>
        <h1 className='headline'>{`I am ${this.getIdentity()}`}</h1>
      </div>
    );
  }
}
