import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export class signIn extends Component {
    static displayName = signIn.name;

    render() {
        return (
            <div class="register-page" style={{ minHeight: '600px'}}>
                <div class="register-box">
                    <div class="register-logo">
                        <Link to="/"><b>Авторизация</b></Link>
                    </div> 
                    <div class="card">
                    <div class="card-body register-card-body">
                        <p class="login-box-msg">Войдите в аккаунт</p> 
                        <form method="post">
                            <div class="input-group mb-3">
                                <input type="email" class="form-control" placeholder="Email"/>
                                <div class="input-group-append">
                                <div class="input-group-text">
                                    <span class="fas fa-envelope"></span>
                                </div>
                                </div>
                            </div>
                            <div class="input-group mb-3">
                                <input type="password" class="form-control" placeholder="Пароль"/>
                                <div class="input-group-append">
                                <div class="input-group-text">
                                    <span class="fas fa-lock"></span>
                                </div>
                                </div>
                            </div>
                            <div class="row">
                            <div class="col-12">
                                <button type="submit" class="btn btn-primary btn-block">Войти</button>
                            </div> 
                        </div>
                        </form> 
                        <div class="social-auth-links text-center"> 
                        </div> 
                        <Link to="/sign-up" class="text-center d-block">Зарегистрировать новый аккаунт</Link>
                        <Link to="/" class="text-center d-block">Я забыл пароль</Link>
                    </div> 
                    </div> 
                </div>
            </div>
        );
    }
}
