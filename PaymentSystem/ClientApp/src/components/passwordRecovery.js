import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export class passwordRecovery extends Component {
    static displayName = passwordRecovery.name;

    render() {
        return (
            <div class="register-page" style={{ minHeight: '600px' }}>
                <div class="register-box">
                    <div class="register-logo">
                        <Link to="/"><b>Восстановление</b></Link>
                    </div>
                    <div class="card">
                        <div class="card-body register-card-body">
                            <p class="login-box-msg">Восстановите пароль</p>
                            <form method="post">
                                <div class="input-group mb-3">
                                    <input type="email" class="form-control" placeholder="Email" />
                                    <div class="input-group-append">
                                        <div class="input-group-text">
                                            <span class="fas fa-envelope"></span>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-12">
                                        <button type="submit" class="btn btn-primary btn-block">Восстановить</button>
                                    </div>
                                </div>
                            </form>
                            <div class="social-auth-links text-center">
                            </div> 
                            <Link to="/sign-in" class="text-center d-block">Войти в аккаунт</Link>
                            <Link to="/sign-up" class="text-center d-block">Зарегистрировать новый аккаунт</Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
