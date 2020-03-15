import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export class signUp extends Component {
    static displayName = signUp.name;

    constructor(props) {
        super(props)
        let loggedIn = true

        this.state =
        {
            loggedIn,
            fio: '',
            email: '',
            password: '',
            repassword: '',
            phone: '',
            passport_s: '',
            passport_n: '',
            registerAgree: false,
            readyToSubmitForm: false,
            userRegisteredInServer: false,
            userIssetInServerDB: false
        }

        const user = localStorage.getItem('access_token')
        if (user == null) {
            this.state.loggedIn = false
        }

        this.onChange = this.onChange.bind(this)
        this.agreementClick = this.agreementClick.bind(this)
        this.checkAvailableSubmitForm = this.checkAvailableSubmitForm.bind(this)
        this.createNewUser = this.createNewUser.bind(this)
    }

    componentDidMount() {
        if (this.state.loggedIn) {
            this.props.history.push('/')
        }
    }

    checkAvailableSubmitForm() {
        const { fio, email, password, repassword, phone, passport_s, passport_n } = this.state

        if (
            this.state.fio != ""
            && this.state.email != ""
            && this.state.password.length >= 6
            && this.state.password != ""
            && this.state.password == this.state.repassword
            && this.state.phone != ""
            && this.state.phone.length >= 11
            && this.state.passport_s != ""
            && this.state.passport_n != ""
            && this.state.registerAgree
        ) {
            this.setState({ readyToSubmitForm: true })
            return true
        }
        else { this.setState({ readyToSubmitForm: false }); return false }
    }

    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    agreementClick(e) {
        if (this.state.registerAgree) { this.setState({ registerAgree: false }) }
        else { this.setState({ registerAgree: true }) }
    }

    async createNewUser(e) {
        e.preventDefault()

        var rct = this

        if (this.checkAvailableSubmitForm()) {
            //alert("ОК")

            await fetch('/api/Auth/reg/', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "fio": this.state.fio,
                    "email": this.state.email,
                    "password": this.state.password,
                    "phone": this.state.phone,
                    "passport_s": this.state.passport_s,
                    "passport_n": this.state.passport_n
                })
            })
            .then(function (response){
                return response.json()
            })
            .then(await function (data) {
                if (data.hasOwnProperty("id_client")) {
                    // Был зарегистрирован в БД
                    rct.setState({
                        userRegisteredInServer: true,
                        userIssetInServerDB: false
                    })  
                }
                else {
                    rct.setState({ userRegisteredInServer: false, userIssetInServerDB: true }) 
                }
            })
            .catch((error) => {
                console.log(error)
            })
        }
        else { alert("Заполните все поля корректно! Где то что то неправильно заполнена или даже не заполнена!"); }
    }

    render() {
        return (
            <div class="register-page" style={{ minHeight: '800px'}}>
                <div class="register-box">
                    <div class="register-logo">
                        <b>Регистрация</b>
                    </div> 
                    <div class="card">
                    <div class="card-body register-card-body">
                        <p class="login-box-msg">Зарегистрируйте новый аккаунт</p> 
                        <form method="post" onSubmit={this.createNewUser}>
                                <div class="input-group mb-3">
                                    <input type="text" placeholder="ФИО" name="fio"
                                        value={this.state.fio} onChange={this.onChange}
                                        className={
                                            this.state.fio != "" ? "form-control is-valid" : "form-control is-invalid"
                                        }
                                    />
                                    <div class="input-group-append">
                                    <div class="input-group-text">
                                        <span class="fas fa-user"></span>
                                    </div>
                                    </div>
                                    <span className={this.state.fio != "" ? "d-none" : "error invalid-feedback d-block"} >
                                        * ФИО обязятельно для заполнения
                                    </span>
                                </div>
                                <div class="input-group mb-3">
                                    <input type="email" placeholder="Email" name="email"
                                        value={this.state.email} onChange={this.onChange}
                                        className={
                                            this.state.email != "" ? "form-control is-valid" : "form-control is-invalid"
                                        }
                                    />
                                    <div class="input-group-append">
                                    <div class="input-group-text">
                                        <span class="fas fa-envelope"></span>
                                    </div>
                                    </div>
                                    <span className={this.state.email != "" ? "d-none" : "error invalid-feedback d-block"} >
                                        * Email обязятельно для заполнения
                                    </span>
                                </div>
                                <div class="input-group mb-3">
                                    <input type="number" class="form-control" placeholder="Номер телефона" name="phone"
                                        value={this.state.phone} onChange={this.onChange}
                                        className={
                                            this.state.phone != "" && this.state.phone.length >= 11 ? "form-control is-valid" : "form-control is-invalid"
                                        }
                                    />
                                    <div class="input-group-append">
                                    <div class="input-group-text">
                                        <span class="fas fa-phone"></span>
                                    </div>
                                    </div>
                                    <span className={this.state.phone != "" ? "d-none" : "error invalid-feedback d-block"} >
                                        * Телефон (формат: 7XXXZZZZZZZ)
                                    </span>
                                </div>
                                <div class="input-group mb-3">
                                    <input type="text" class="form-control" placeholder="Серия паспорта" name="passport_s"
                                        value={this.state.passport_s} onChange={this.onChange} 
                                    />
                                    <div class="input-group-append">
                                        <div class="input-group-text"> 
                                        </div>
                                    </div>
                                    <span className={this.state.passport_s != "" ? "d-none" : "error invalid-feedback d-block"} >
                                        * Серия паспорта обязятельно для заполнения
                                    </span>
                                </div>
                                <div class="input-group mb-3">
                                    <input type="text" class="form-control" placeholder="Номер паспорта" name="passport_n"
                                        value={this.state.passport_n} onChange={this.onChange}
                                    />
                                    <div class="input-group-append">
                                        <div class="input-group-text"> 
                                        </div>
                                    </div>
                                    <span className={this.state.passport_n != "" ? "d-none" : "error invalid-feedback d-block"} >
                                        * Номер паспорта обязятельно для заполнения
                                    </span>
                                </div>
                                <div class="input-group mb-3">
                                    <input type="password" class="form-control" placeholder="Пароль" name="password"
                                        value={this.state.password} onChange={this.onChange}
                                        className={
                                            this.state.password != "" && this.state.password.length >= 6 ? "form-control is-valid" : "form-control is-invalid"
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
                                    <input type="password" placeholder="Повторите пароль" name="repassword"
                                        value={this.state.repassword} onChange={this.onChange}
                                        className={
                                            this.state.repassword != "" && this.state.password == this.state.repassword ? "form-control is-valid" : "form-control is-invalid"
                                        }
                                    />
                                    <div class="input-group-append">
                                    <div class="input-group-text">
                                        <span class="fas fa-lock"></span>
                                    </div>
                                    </div>
                                    <span className={this.state.repassword != "" && this.state.password == this.state.repassword ? "d-none" : "error invalid-feedback d-block"} >
                                        Пароли не совпадают или пустой!
                                    </span>
                                </div>
                                <div class="row">
                                    <div class="col-12">
                                    <div class="icheck-primary">
                                        <input type="checkbox" name="registerAgree" checked={this.state.registerAgree} onChange={this.agreementClick}/>
                                        <label for="agreeTerms">
                                         Согласен с условиями <a href="#">соглашения</a>
                                        </label>
                                    </div>
                                    </div> 
                                    <div class="input-group mb-3">
                                        <span className={this.state.userIssetInServerDB ? 'd-block text-center error invalid-feedback' : 'd-none'}>
                                            Пользователь с таким email уже существует!
                                        </span>
                                    </div>
                                    <div class="col-12">
                                        <button type="submit" disabled={!this.state.registerAgree} class="btn btn-primary btn-block">Зарегистрироваться</button>
                                    </div> 
                                </div>
                        </form> 
                        <div class="social-auth-links text-center"> 
                        </div> 
                        <Link to="/sign-in" class="text-center d-block">У меня уже есть аккаунт</Link>
                        <div className={ this.state.userRegisteredInServer ? 'd-flex text-center flex-column align-middle justify-content-center bg-dark' : 'd-none' } style={{height: '100%', width: '100%', position: "absolute", top: 0, left: 0, borderRadius: '5px'}}>
                            <div class="mb-2">Регистрация прошла успешна!</div>
                            <div>
                                <Link to="/sign-in" class="text-center">
                                    <button class="btn btn-primary">Войдите </button>
                                </Link> в аккаунт
                            </div>
                        </div>
                    </div> 
                    </div> 
                </div>
            </div>
        );
    }
}
