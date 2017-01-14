import React, { PureComponent, PropTypes } from 'react';
import { Route, IndexRoute } from 'react-router';

import { Home, NotFound } from './pages';

class Main extends PureComponent {
  static propTypes = {
    children: PropTypes.any,
  }

  render() {
    return <main>{this.props.children}</main>;
  }
}

export const routes = (
  <Route path='/' component={Main}>
    <IndexRoute title='App' component={Home} />
    <Route path='*' title='404: Not Found' component={NotFound} />
  </Route>
);

export default routes;
