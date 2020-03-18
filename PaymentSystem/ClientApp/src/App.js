import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { LayoutUnauthorized } from './components/LayoutUnauthorized';
import { Home } from './components/Home';
import { signUp } from './components/signUp';
import { signIn } from './components/signIn';
import { Logout } from './components/Logout';
import { passwordRecovery } from './components/passwordRecovery';
import './custom.css'
import { BankAccountNumber } from './components/BankAccountNumber';
import { Applications } from './components/Applications';
import { newApplicationForm } from './components/forms/newApplicationForm';

export default class App extends Component {
    static displayName = App.name;

    constructor(props) {
        super(props)
    }

    componentDidUpdate() {
        //����� �������� ���������� ������ ������ ����
        //�� API ���� �� ������������ ���
    }
    
    render () {
        if (localStorage.getItem('access_token') != null)
        {
            return (
                <Layout>
                    <Route exact path='/' component={Home} />
                    <Route path='/sign-up' component={signUp} />
                    <Route path='/sign-in' component={signIn} />
                    <Route path='/password-recovery' component={passwordRecovery} />
                    <Route path='/logout' component={Logout} />
                    <Route path='/bank-account' component={BankAccountNumber} />
                    <Route path='/my-applications' component={Applications} />
                    <Route path='/new-application' component={newApplicationForm} />
                </Layout>
            )
        }

        return (
            <LayoutUnauthorized>
                <Route exact path='/' component={Home} />
                <Route path='/sign-in' component={signIn} />
                <Route path='/sign-up' component={signUp} />
                <Route path='/password-recovery' component={passwordRecovery} />
            </LayoutUnauthorized>
        );
    }
}
