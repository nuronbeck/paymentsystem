import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export class signUp extends Component {
    static displayName = signUp.name;

    render() {
        return (
            <div class="register-page" style={{ minHeight: '800px'}}>
                <div class="register-box">
                    <div class="register-logo">
                        <Link to="/"><b>Регистрация</b></Link>
                    </div> 
                    <div class="card">
                    <div class="card-body register-card-body">
                        <p class="login-box-msg">Зарегистрируйте новый аккаунт</p> 
                        <form method="post">
                            <div class="input-group mb-3">
                                <input type="text" class="form-control" placeholder="ФИО"/>
                                <div class="input-group-append">
                                <div class="input-group-text">
                                    <span class="fas fa-user"></span>
                                </div>
                                </div>
                            </div>
                            <div class="input-group mb-3">
                                <input type="email" class="form-control" placeholder="Email"/>
                                <div class="input-group-append">
                                <div class="input-group-text">
                                    <span class="fas fa-envelope"></span>
                                </div>
                                </div>
                            </div>
                            <div class="input-group mb-3">
                                <input type="email" class="form-control" placeholder="Номер телефона"/>
                                <div class="input-group-append">
                                <div class="input-group-text">
                                    <span class="fas fa-phone"></span>
                                </div>
                                </div>
                            </div>
                            <div class="input-group mb-3">
                                <input type="email" class="form-control" placeholder="Серия паспорта"/>
                                <div class="input-group-append">
                                <div class="input-group-text">
                                     
                                </div>
                                </div>
                            </div>
                            <div class="input-group mb-3">
                                <input type="email" class="form-control" placeholder="Номер паспорта"/>
                                <div class="input-group-append">
                                <div class="input-group-text">
                                     
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
                            <div class="input-group mb-3">
                                <input type="password" class="form-control" placeholder="Повторите пароль"/>
                                <div class="input-group-append">
                                <div class="input-group-text">
                                    <span class="fas fa-lock"></span>
                                </div>
                                </div>
                            </div>
                            <div class="row">
                            <div class="col-12">
                            <div class="icheck-primary">
                                <input type="checkbox" id="agreeTerms" name="terms" value="agree"/>
                                <label for="agreeTerms">
                                 Согласен с условиями <a href="#">соглашения</a>
                                </label>
                            </div>
                            </div> 
                            <div class="col-12">
                            <button type="submit" class="btn btn-primary btn-block">Зарегистрироваться</button>
                            </div> 
                        </div>
                        </form> 
                        <div class="social-auth-links text-center"> 
                        </div> 
                        <Link to="/sign-in" class="text-center">У меня уже есть аккаунт</Link>
                    </div> 
                    </div> 
                </div>
            </div>
        );
    }
}
