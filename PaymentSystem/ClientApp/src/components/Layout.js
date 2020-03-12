import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { Aside } from './Aside';
import { NavMenu } from './NavMenu';

export class Layout extends Component {
  static displayName = Layout.name;

  render () {
    return (
      <div class="wrapper">
        <NavMenu />
        <Aside/> 
        {this.props.children}
       <footer class="main-footer">
        <strong>Платежная Система | 2020</strong>  Все права защищены.
        <div class="float-right d-none d-sm-inline-block">
          <b>Версия</b> 1.0
        </div>
      </footer>
      </div>
    );
  }
}
