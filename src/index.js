import React, { Component } from 'react';
import { render } from 'react-dom';

const HelloWorldComponent = () => {
  return (
    <h1>Hello World</h1>
  );
}

render(<HelloWorldComponent />, document.getElementById('root'));
