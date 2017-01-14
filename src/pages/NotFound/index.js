import React, { PureComponent } from 'react';
import { IndexLink } from 'react-router';

export default class NotFound extends PureComponent {
  render() {
    return (
      <div>
        <h1>Not Found</h1>
        <IndexLink to='/' activeClassName={'active'}>Back to Home Page</IndexLink>
      </div>
    );
  }
}
