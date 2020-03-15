import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export class signIn extends Component {
    static displayName = signIn.name;

    constructor(props) {
        super(props)
        let loggedIn = true

        this.state = {
            loggedIn,
            email: '',
            password: '',
            errors: {
                userOrPassFalse: false,
                userNotValidated: false
            }
        }

        const user = localStorage.getItem('access_token')
        if (user == null) {
            this.state.loggedIn = false
        }


        this.onChange = this.onChange.bind(this)
        this.signInSubmit = this.signInSubmit.bind(this)
    }

    componentDidMount() {
        this.setState({
            email: 'next_nurbek@mail.ru',
            password: 'Ab1234567890'
        })
        console.clear()

        if (this.state.loggedIn) {
            this.props.history.push('/')
        }
    }

    onChange(e) {
        this.setState({
            errors: {
                userOrPassFalse: false,
                userNotValidated: false
            },
            [e.target.name]: e.target.value
        })
    }

    async signInSubmit(e) {
        e.preventDefault() 
        const { email, password } = this.state
        var objContext = this

        if (/\S+@\S+\.\S+/.test(this.state.email) && this.state.password.length >= 6) {

            await fetch('/api/Auth/log/?email=' + this.state.email + '&&password=' + this.state.password + '', {
                method: 'get'
            })
            .then(res => {
                if (res.status === 200) {
                    return res.json()
                }
            })
            .then(data => {
                if (data) {
                    this.state.loggedIn = true
                    localStorage.setItem("access_token", data.access_token)
                    localStorage.setItem("user", JSON.stringify(data))
                    objContext.props.history.push('/')
                } else {
                    objContext.setState({
                        errors: {
                            userOrPassFalse: true
                        }
                    })
                    localStorage.removeItem("access_token")
                    localStorage.removeItem("user")
                }
            })

        }
        else { alert("Проверьте правильность заполнения полей!") }
    }

    render() {
        return (
            <div class="register-page" style={{ minHeight: '600px'}}>
                <div class="register-box">
                    <div class="register-logo">
                        <b>Авторизация</b>
                    </div> 
                    <div class="card">
                    <div class="card-body register-card-body">
                        <p class="login-box-msg">Войдите в аккаунт</p> 
                        <form action="/signIn" onSubmit={this.signInSubmit} method="post">
                            <div class="input-group mb-3">
                                <input type="email" class="form-control" placeholder="Email"
                                    name="email" onChange={this.onChange} value={this.state.email}
                                    className={
                                        /\S+@\S+\.\S+/.test(this.state.email) && this.state.email != "" && this.state.email.length >= 6 ? "form-control is-valid" : "form-control "
                                    }
                                />
                                <div class="input-group-append">
                                <div class="input-group-text">
                                    <span class="fas fa-envelope"></span>
                                </div>
                                </div>
                            </div>
                            <div class="input-group mb-3">
                                <input type="password" class="form-control" placeholder="Пароль"
                                    name="password" onChange={this.onChange} value={this.state.password}
                                    className={
                                        this.state.password != "" && this.state.password.length >= 6 ? "form-control is-valid" : "form-control"
                                    }
                                />
                                <div class="input-group-append">
                                <div class="input-group-text">
                                    <span class="fas fa-lock"></span>
                                </div>
                                </div>
                                <span className={this.state.password != "" && this.state.password.length >= 6 ? "d-none" : "error invalid-feedback d-block"} >
                                    * Пароль минимум 6 символов
                                </span>
                            </div>
                            <div class="input-group mb-3">
                                <span className={this.state.errors.userOrPassFalse ? "error invalid-feedback d-block text-center" : "d-none"} >
                                    Проверьте логин и пароль, данные не верны!
                                </span>
                                <span className={this.state.errors.userNotValidated ? "error invalid-feedback d-block text-center" : "d-none"} >
                                    Аккаунт не верифицирован! Проверьте почту!
                                </span>
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
                        <Link to="/password-recovery" class="text-center d-block">Я забыл пароль</Link>
                    </div> 
                    </div> 
                </div>
            </div>
        );
    }
}
