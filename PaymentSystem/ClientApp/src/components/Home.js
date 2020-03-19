import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { LoaderSpinner } from './ui/pageLoaderSpinner'

export class Home extends Component {
    static displayName = Home.name;

    constructor(props) {
        super(props)
        let loggedIn = true

        this.state = {
            isLoading: true,
            loggedIn,
            userId: null,
            user: [],
            userInfo: [],
            userAccounts: [],
            userApplications: []
        }

        const user = localStorage.getItem('access_token')
        if (user == null) {
            this.state.loggedIn = false 
        }
         
        this.fetchUserIdData = this.fetchUserIdData.bind(this)
        this.fetchUserInfoData = this.fetchUserInfoData.bind(this)
        this.fetchUserAccountsData = this.fetchUserAccountsData.bind(this)
        this.fetchUserApplicationsData = this.fetchUserApplicationsData.bind(this)
    }
    
    async fetchUserApplicationsData() {
        var rctObj = this
        await fetch('api/applications', {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=UTF-8'
            }
        })
        .then(res => {
            console.log(res.json())
        if (res.status === 200) { 
            return res.json()
        }
        })
        .then(data => { if (data) { rctObj.setState({ userApplications: data }) } })
    }
    async fetchUserIdData() {
        var rctObj = this
        await fetch('api/Auth/getId?token=' + localStorage.getItem('access_token'), {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=UTF-8',
                'api_token': localStorage.getItem('access_token')
            }
        })
            .then(res => {
                if (res.status === 200) {
                    return res.json()
                }
            })
            .then(data => { if (data) { rctObj.setState({ userId: data }) } })

        //console.log(this.state.userInfo)
    }

    async fetchUserInfoData() {
        var rctObj = this
        await fetch('api/clients/' + this.state.userId, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=UTF-8',
                'api_token': localStorage.getItem('access_token')
            }
        })
        .then(res => { if (res.status === 200) { return res.json() }
        })
        .then(data => { if (data) { rctObj.setState({ userInfo: data }) } })

        //console.log(this.state.userInfo)
    }

    async fetchUserAccountsData() {
        var rctObj = this
        await fetch('/accounts/my', {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=UTF-8',
                'api_token': localStorage.getItem('access_token')
            }
        })
        .then(res => { if (res.status === 200) { return res.json() } })
        .then(data => { if (data) { rctObj.setState({ userAccounts: data, isLoading: false }) } })

        //console.log(this.state.userAccounts)
    }



    componentDidMount() { 
        this.fetchUserIdData()
        .then(() => {
            this.fetchUserInfoData()
            this.fetchUserAccountsData()
            //this.fetchUserApplicationsData()
        })        
    }

    componentWillMount() {
        //alert(JSON.stringify(this.props))
        if (!this.state.loggedIn) { this.props.history.push('/sign-in') }
        this.setState({
            user: JSON.parse(localStorage.getItem("user"))
        }) 
    }

    render() {
        return this.state.isLoading ? <LoaderSpinner /> : (
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
                                    <h3 class="widget-user-username">{ this.state.user.fio }</h3>
                                    <h5 class="widget-user-desc">{ this.state.userInfo.verification ? 'Верифицирован' : 'Не верифицирован' }</h5>
                                  </div>
                                  <div class="widget-user-image">
                                    <img class="img-circle elevation-2" src="../dist/img/user1-128x128.webp" alt="User Avatar"/>
                                  </div>
                                  <div class="card-footer">
                                    <div class="row">
                                      <div class="col-sm-12 col-md-12 col-lg-12 border-right">
                                        <div class="description-block">
                                          <h5 class="description-header">Почта</h5>
                                          <span class="description-text">{ this.state.user.email }</span>
                                        </div> 
                                      </div> 
                                      <div class="col-sm-12 col-md-12 col-lg-12 border-right">
                                        <div class="description-block">
                                          <h5 class="description-header">Номер телефона</h5>
                                          <span class="description-text">{ this.state.userInfo.phone }</span>
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
                                    <h2>{ this.state.userAccounts.reduce((total, acc) => total + acc.balance_acc, 0) }<sup style={{fontSize: '20px'}}> руб.</sup></h2>

                                    <p>Общий баланс</p>
                                  </div>
                                  <div class="icon">
                                    <i class="fas fa-money-bill"></i>
                                  </div>
                                  <Link to="/bank-account" class="small-box-footer">
                                    Больше <i class="fas fa-arrow-circle-right"></i>
                                  </Link>
                                </div>
                                </div> 
                                <div class="col-lg-12 col-12"> 
                                    <div class="small-box bg-success">
                                  <div class="inner">
                                    <h3>{ this.state.userApplications.length > 0 ? '12' : '0' }<sup style={{fontSize: '20px'}}></sup></h3>

                                    <p>Заявок</p>
                                  </div>
                                  <div class="icon">
                                    <i class="fas fa-chart-line"></i>
                                  </div>
                                  <Link to="/applications" class="small-box-footer">
                                    Больше <i class="fas fa-arrow-circle-right"></i>
                                  </Link>
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
