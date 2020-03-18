import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { Aside } from './Aside';
import { NavMenu } from './NavMenu';

export class LayoutUnauthorized extends Component {
  static displayName = LayoutUnauthorized.name;

  render () {
    return (
      <div class="wrapper">
        {this.props.children}
      <footer class="main-footer" style={{margin: '0px'}}>
        <strong>Платежная Система | 2020</strong>  Все права защищены.
        <div class="float-right d-none d-sm-inline-block">
          <b>Версия</b> 1.0
        </div>
      </footer>
      </div>
    );
  }
}
