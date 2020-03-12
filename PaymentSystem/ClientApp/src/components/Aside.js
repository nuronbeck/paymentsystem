import React, { Component } from 'react';
import { Link } from 'react-router-dom';


export class Aside extends Component {
    static displayName = Aside.name;

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <aside class="main-sidebar sidebar-dark-primary elevation-4">
                <Link to="/" class="brand-link">
                    <img src="isit.jpg" alt="AdminLTE Logo" class="brand-image img-circle elevation-3"
                        style={{ opacity: '0.8' }} />
                    <span class="brand-text font-weight-light">Платежка ИСиТ</span>
                </Link>
                <div class="sidebar">
                    <div class="user-panel mt-3 pb-3 mb-3 d-flex">
                        <div class="image">
                            <img src="dist/img/user2-160x160.jpg" class="img-circle elevation-2" alt="User Image" />
                        </div>
                        <div class="info">
                            <Link to="/" class="d-block">Иванов Иван</Link>
                        </div>
                    </div>

                    <nav class="mt-2">
                        <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                            <li class="nav-item">
                                <Link to="/" class="nav-link">
                                    <i class="nav-icon fas fa-home"></i>
                                    <p>Главная</p>
                                </Link>
                            </li>
                            <li class="nav-header">Авторизация в системе</li>
                            <li class="nav-item">
                                <Link to="/sign-up" class="nav-link">
                                    <i class="nav-icon fas fa-user-plus"></i>
                                    <p>Регистрация</p>
                                </Link>
                            </li>
                            <li class="nav-item">
                                <Link to="/sign-in" class="nav-link">
                                    <i class="nav-icon fas fa-sign-in-alt"></i>
                                    <p>Войти</p>
                                </Link>
                            </li>
                            <li class="nav-header">Разделы</li>
                            <li class="nav-item">
                                <Link to="/" class="nav-link">
                                    <i class="nav-icon fas fa-book"></i>
                                    <p>Заявки</p>
                                </Link>
                            </li>
                            <li class="nav-item">
                                <Link to="/" class="nav-link">
                                    <i class="nav-icon fas fa-donate"></i>
                                    <p>Платёжи</p>
                                </Link>
                            </li>
                            <li class="nav-item">
                                <Link to="/" class="nav-link">
                                    <i class="nav-icon fas fa-hand-holding-usd"></i>
                                    <p>Автоплатёжи</p>
                                </Link>
                            </li>
                            <li class="nav-item">
                                <Link to="/" class="nav-link">
                                    <i class="nav-icon fas fa-landmark"></i>
                                    <p>Истории</p>
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </aside>
        )
    }
}
