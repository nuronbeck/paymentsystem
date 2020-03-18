import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';


export class Aside extends Component {
    static displayName = Aside.name;

    constructor(props) {
        super(props)
        let loggedIn = true

        this.state = {
            loggedIn,
            user: []
        }

        const user = localStorage.getItem('access_token')
        if (user == null) {
            this.state.loggedIn = false
        }
    }

    componentWillMount() {
        this.setState({
            user: JSON.parse(localStorage.getItem("user"))
        })
    }

    render() {
        return (
            <aside class="main-sidebar sidebar-light-primary elevation-4">
                <Link to="/" class="brand-link">
                    <img src="isit.jpg" alt="AdminLTE Logo" class="brand-image img-circle elevation-3"
                        style={{ opacity: '0.8' }} />
                    <span class="brand-text font-weight-light">Платежка ИСиТ</span>
                </Link>
                <div class="sidebar">
                    <div class="user-panel mt-3 pb-3 mb-3 d-flex">
                        <div class="image">
                            <img src="dist/img/user1-128x128.webp" class="img-circle elevation-2" alt="User Image" />
                        </div>
                        <div class="info">
                            <Link to="/" class="d-block">{this.state.user.fio}</Link>
                        </div>
                    </div>

                    <nav class="mt-2">
                        <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                            <li className={this.state.loggedIn ? "d-none" : "nav-header"}>Авторизация в системе</li>
                            <li className={this.state.loggedIn ? "d-none" : "nav-item"}>
                                <NavLink to="/sign-in" className="nav-link" activeClassName="active">
                                    <i class="nav-icon fas fa-sign-in-alt"></i>
                                    <p>Войти</p>
                                </NavLink>
                            </li>
                            <li className={this.state.loggedIn ? "d-none" : "nav-item"}>
                                <NavLink to="/sign-up" className="nav-link" activeClassName="active">
                                    <i class="nav-icon fas fa-user-plus"></i>
                                    <p>Регистрация</p>
                                </NavLink>
                            </li> 
                            <li className={this.state.loggedIn ? "d-none" : "nav-item"}>
                                <NavLink to="/password-recovery" className="nav-link" activeClassName="active">
                                    <i class="nav-icon fas fa-unlock"></i>
                                    <p>Восстановить пароль</p>
                                </NavLink>
                            </li>
                            <li className={this.state.loggedIn ? "nav-header" : "d-none"}>Разделы</li>
                            <li className={this.state.loggedIn ? "nav-item" : "d-none"}>
                                <NavLink to="/bank-account" className="nav-link" activeClassName="active">
                                    <i class="nav-icon fas fa-credit-card"></i>
                                    <p>Мои счёта</p>
                                </NavLink>
                            </li>
                            <li className={this.state.loggedIn ? "nav-item" : "d-none"}>
                                <NavLink to="/my-applications" className="nav-link" activeClassName="active">
                                    <i class="nav-icon fas fa-book"></i>
                                    <p>Заявки</p>
                                </NavLink>
                            </li>
                            <li className={this.state.loggedIn ? "nav-item" : "d-none"}>
                                <NavLink to="/payments" className="nav-link" activeClassName="active">
                                    <i class="nav-icon fas fa-donate"></i>
                                    <p>Платёжи</p>
                                </NavLink>
                            </li>
                            <li className={this.state.loggedIn ? "nav-item" : "d-none"}>
                                <NavLink to="/autopayments" className="nav-link" activeClassName="active">
                                    <i class="nav-icon fas fa-hand-holding-usd"></i>
                                    <p>Автоплатёжи</p>
                                </NavLink>
                            </li>
                            <li className={this.state.loggedIn ? "nav-item" : "d-none"}>
                                <NavLink to="/history" className="nav-link" activeClassName="active">
                                    <i class="nav-icon fas fa-landmark"></i>
                                    <p>Истории</p>
                                </NavLink>
                            </li>
                            <li className={this.state.loggedIn ? "nav-header" : "d-none"}>Сеанс</li>
                            <li className={this.state.loggedIn ? "nav-item" : "d-none"}>
                                <Link to="/logout" class="nav-link bg-danger">
                                    <i class="nav-icon fas fa-book"></i>
                                    <p>Выйти из аккаунта</p>
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </aside>
        )
    }
}
