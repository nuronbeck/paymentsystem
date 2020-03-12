import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export class Home extends Component {
    static displayName = Home.name;

    render() {
        return (
            <div class="content-wrapper" style={{ minHeight: '846.563px'}}> 
                <section class="content-header">
                    <div class="container-fluid">
                        <div class="row mb-2">
                            <div class="col-sm-6">
                                <h1>Кабинет</h1>
                            </div>
                            <div class="col-sm-6">
                                <ol class="breadcrumb float-sm-right">
                                    <li class="breadcrumb-item"><Link to="/">Главная</Link></li>
                                    <li class="breadcrumb-item active">Кабинет</li>
                                </ol>
                            </div>
                        </div>
                    </div> 
                </section> 
                <section class="content">
                    <div class="container-fluid">
                        <h5 class="mb-2 mt-2">Моя карточка</h5>
                        <div class="row">
                            <div class="col-md-4"> 
                                <div class="card card-widget widget-user"> 
                                  <div class="widget-user-header bg-info">
                                    <h3 class="widget-user-username">Иванов Иван</h3>
                                    <h5 class="widget-user-desc">Верифицирован</h5>
                                  </div>
                                  <div class="widget-user-image">
                                    <img class="img-circle elevation-2" src="../dist/img/user1-128x128.jpg" alt="User Avatar"/>
                                  </div>
                                  <div class="card-footer">
                                    <div class="row">
                                      <div class="col-sm-12 col-md-12 col-lg-12 border-right">
                                        <div class="description-block">
                                          <h5 class="description-header">Почта</h5>
                                          <span class="description-text">your@example.com</span>
                                        </div> 
                                      </div> 
                                      <div class="col-sm-12 col-md-12 col-lg-12 border-right">
                                        <div class="description-block">
                                          <h5 class="description-header">Номер телефона</h5>
                                          <span class="description-text">+79YY-XXX-XX-XX</span>
                                        </div> 
                                      </div> 
                                    </div> 
                                  </div>
                                </div> 
                            </div>
                            <div class="col-md-4">
                                <div class="col-lg-12 col-12"> 
                                    <div class="small-box bg-info">
                                  <div class="inner">
                                    <h3>150 <sup style={{fontSize: '20px'}}>руб.</sup></h3>

                                    <p>Затраты</p>
                                  </div>
                                  <div class="icon">
                                    <i class="fas fa-shopping-cart"></i>
                                  </div>
                                  <a href="#" class="small-box-footer">
                                    Больше <i class="fas fa-arrow-circle-right"></i>
                                  </a>
                                </div>
                                </div> 
                                <div class="col-lg-12 col-12"> 
                                    <div class="small-box bg-success">
                                  <div class="inner">
                                    <h3>53<sup style={{fontSize: '20px'}}>%</sup></h3>

                                    <p>Экономия</p>
                                  </div>
                                  <div class="icon">
                                    <i class="fas fa-chart-line"></i>
                                  </div>
                                  <a href="#" class="small-box-footer">
                                    Больше <i class="fas fa-arrow-circle-right"></i>
                                  </a>
                                </div>
                                </div>
                            </div>
                            <div class="col-md-4"> 
                                <div class="col-lg-12 col-12"> 
                                    <div class="small-box bg-warning">
                                  <div class="inner">
                                    <h3>44</h3>

                                    <p>Автоплатёж</p>
                                  </div>
                                  <div class="icon">
                                    <i class="fas fa-user-plus"></i>
                                  </div>
                                  <a href="#" class="small-box-footer">
                                    Больше <i class="fas fa-arrow-circle-right"></i>
                                  </a>
                                </div>
                                </div> 
                                <div class="col-lg-12 col-12"> 
                                    <div class="small-box bg-danger">
                                  <div class="inner">
                                    <h3>65</h3>

                                    <p>Статистика</p>
                                  </div>
                                  <div class="icon">
                                    <i class="fas fa-chart-pie"></i>
                                  </div>
                                  <a href="#" class="small-box-footer">
                                    Больше <i class="fas fa-arrow-circle-right"></i>
                                  </a>
                                </div>
                                </div>
                            </div>
                        </div> 
                    </div> 
                </section>
            </div> 
    );
  }
}
