import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { LoaderSpinner } from './ui/pageLoaderSpinner'

export class Applications extends Component {
    static displayName = Applications.name;

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

        this.fetchUserApplicationsData = this.fetchUserApplicationsData.bind(this)
        this.fetchUserIdData = this.fetchUserIdData.bind(this)
         
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
        .then(res => { if (res.status === 200) { return res.json() } })
        .then(data => { if (data) { rctObj.setState({ userId: data }) } })

        //console.log(this.state.userInfo)
    } 

    async fetchUserApplicationsData() {
        var rctObj = this
        await fetch('/applications', { // ВСЕ БЕРУ ТАК КАК НЕТУ ОТДЕЛЬНОЙ И ЗА ЭТО ДОЛГО ГРУЗИТ
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=UTF-8',
                'api_token': localStorage.getItem('access_token')
            }
        })
        .then(res => {  return res.json() })
        .then(data => {
            //console.log(data)
            if (data) {
                rctObj.setState({
                    isLoading: false,
                    userApplications: data.filter((appl) => { return appl.client_id == rctObj.state.userId})
                })
            } 
        }) 
    }


    componentDidMount() { 
        var rct = this
        rct.fetchUserIdData().then(() => {  rct.fetchUserApplicationsData() }) 
    }

    componentWillMount() {
        //alert(JSON.stringify(this.props))
        if (!this.state.loggedIn) { this.props.history.push('/sign-in') }
        this.setState({
            user: JSON.parse(localStorage.getItem("user"))
        }) 
    }

    render() {
        const { userApplications } = this.state

        return this.state.isLoading ? <LoaderSpinner /> : (
            <div class="content-wrapper" style={{ minHeight: '846.563px'}}> 
                <section class="content-header">
                    <div class="container-fluid">
                        <div class="row mb-2">
                            <div class="col-sm-6">
                                <h1>Заявки</h1>
                            </div>
                            <div class="col-sm-6">
                                <ol class="breadcrumb float-sm-right">
                                    <li class="breadcrumb-item"><Link to="/">Главная</Link></li>
                                    <li class="breadcrumb-item active">Заявки</li>
                                </ol>
                            </div>
                        </div>
                    </div>  
                    <div class="container-fluid">
                        <div class="row"><div class="col-12 text-center"><button type="button" class="float-right col-5 col-sm-4 col-lg-2 col-md-3 btn btn-block btn-success btn-sm" onClick={() => this.props.history.push('/new-application')}>Подать новую</button></div></div>
                    </div>
                </section>
                <section class="content">
                    <div class="container-fluid">
                        <div class="row">
                            <div class="col-12">
                                <div class="card">
                                  <div class="card-header">
                                    <h3 class="card-title">Мои заявки</h3>

                                    <div class="card-tools">
                                      <div class="input-group input-group-sm" style={{ width: '150px'}}>
                                        <input type="text" name="table_search" class="form-control float-right" placeholder="Поиск"/>

                                        <div class="input-group-append">
                                          <button type="submit" class="btn btn-default"><i class="fas fa-search"></i></button>
                                        </div>
                                      </div>
                                    </div>
                            </div> 
                            <div class="card-body table-responsive p-0" style={{ height: '400px'}}>
                            <table class="table table-head-fixed text-nowrap">
                                <thead>
                                <tr>
                                    <th>Номер</th>
                                    <th>Клиент</th>
                                    <th>Доход</th>
                                    <th>Место работы</th>
                                    <th>Статус заявки</th>
                                    <th>Тип счёта</th>
                                </tr>
                                </thead>
                                <tbody>
                            {userApplications.map(userApp => 
                                <tr>
                                    <td>{userApp.id_request}</td>
                                    <td>{userApp.client_.fio}</td>
                                    <td>{userApp.income}</td>
                                    <td>{userApp.place_job}</td>
                                    <td><span class="tag tag-success">{userApp.status_request_.name}</span></td>
                                    <td>{userApp.type_acc_.name}</td>
                                </tr>
                            )}
                                </tbody>
                            </table>
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
