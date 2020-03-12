import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { signUp } from './components/signUp';
import { signIn } from './components/signIn';

import './custom.css'

export default class App extends Component {
  static displayName = App.name;

  render () {
    return (
      <Layout>
        <Route exact path='/' component={Home} />
        <Route path='/sign-up' component={signUp} />
        <Route path='/sign-in' component={signIn} />
      </Layout>
    );
  }
}
