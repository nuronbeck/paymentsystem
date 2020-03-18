import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export class Logout extends Component {
    static displayName = Logout.name;

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        localStorage.removeItem("access_token")
        localStorage.removeItem("user")
        window.location.href = "/sign-in"
    }

    render() {
        return (
            <div class="register-page" style={{ minHeight: '600px' }}>
                <div class="register-box">
                    <div class="register-logo">
                        <a><b>Завершение сеанса</b></a>
                    </div>
                </div>
            </div>
        );
    }
}
