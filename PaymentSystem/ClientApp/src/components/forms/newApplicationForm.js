import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { LoaderSpinner } from '../ui/pageLoaderSpinner'

export class newApplicationForm extends Component {
    static displayName = newApplicationForm.name;

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
            userApplications: [],
            accountTypes: [],
            type_id: null,
            work_addess: '',
            work_salary: ''
        }

        const user = localStorage.getItem('access_token')
        if (user == null) {
            this.state.loggedIn = false 
        }

        this.onChange = this.onChange.bind(this)
        this.fetchAccountTypesData = this.fetchAccountTypesData.bind(this)
        this.saveNewAccountType = this.saveNewAccountType.bind(this)
    }
    
    async fetchAccountTypesData() {
        var rctObj = this
        await fetch('api/type_acc', {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=UTF-8'
                //'api_token': localStorage.getItem('access_token')
            }
        })
        .then(res => { if (res.status === 200) { return res.json() }
        })
        .then(data => {
            console.log(data)
            if (data) {
                rctObj.setState({ isLoading: false, accountTypes: data })
            }
        }) 
    }

    async saveNewAccountType(e) {
        e.preventDefault() 
        var rct = this

        if (this.state.type_id != null && this.state.work_addess !== '' && this.state.work_salary != 0) {
            //alert("ОК")
            //console.log(this.state)

            await fetch('applications/add', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json; charset=UTF-8',
                    'api_token': localStorage.getItem('access_token')
                },
                body: JSON.stringify({ 
                    "type_account_id": this.state.type_id,
                    "income": this.state.work_salary,
                    "place_job": this.state.work_addess
                })
            })
            .then(function (response) {  return response.json() })
            .then(data => { if (data) { rct.props.history.push('/my-applications') }  })
            .catch((error) => { console.log(error) })
        }
        else { alert("Заполните все поля корректно! Где то что то неправильно заполнена или даже не заполнена!"); }
    }

    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    componentDidMount() { 
        //this.setState({ isLoading: false })
        this.fetchAccountTypesData()
    }

    componentWillMount() {
        //alert(JSON.stringify(this.props))
        if (!this.state.loggedIn) { this.props.history.push('/sign-in') }
        this.setState({
            user: JSON.parse(localStorage.getItem("user"))
        }) 
    }

    render() {
        const { accountTypes } = this.state
        return this.state.isLoading ? <LoaderSpinner /> : (
            <div class="content-wrapper" style={{ minHeight: '846.563px'}}> 
                <section class="content-header">
                    <div class="container-fluid">
                        <div class="row mb-2">
                            <div class="col-sm-6">
                                <h1>Новая заявка</h1>
                            </div>
                            <div class="col-sm-6">
                                <ol class="breadcrumb float-sm-right">
                                    <li class="breadcrumb-item"><Link to="/">Главная</Link></li>
                                    <li class="breadcrumb-item active">Новая заявка</li>
                                </ol>
                            </div>
                        </div>
                    </div> 
                </section> 
                <section class="content">
                    <div class="container-fluid">
                        <div class="row">
                            <div class="col-12">
                                <div class="card card-info card-default">
                                  <div class="card-header">
                                    <h3 class="card-title">Заполните данные</h3>
                                  </div>
                                  <div class="card-body"> 

                                    <h5 class="mt-2 mb-2">Типа счёта</h5> 
                                    <div class="row">
                                        <div class="col-md-6" data-select2-id="29">
                                            <div class="form-group"> 
                                                    <select class="form-control select2 select2-hidden-accessible" style={{ width: '100%' }} data-select2-id="1" tabindex="-1" aria-hidden="true"
                                                        onChange={this.onChange}
                                                        name="type_id" value={this.state.type_id}
                                                    >
                                                    {accountTypes.map((accType, i) =>
                                                        <option selected={ i == 0 ? 'selected' : '' } value={accType.id_type_acc} key={i} data-select2-id="3">{accType.name }</option>
                                                    )}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <h5 class="mt-2 mb-2">Место работы</h5> 
                                    <div class="input-group mb-3">
                                      <div class="input-group-prepend">
                                        <span class="input-group-text"><i class="fas fa-briefcase"></i></span>
                                      </div>
                                      <input type="text" class="form-control" placeholder="Адрес организации"
                                        onChange={this.onChange}
                                        name="work_addess" value={this.state.work_addess}
                                      />
                                    </div>

                                    <h5 class="mt-3 mb-2">Доход</h5> 
                                    <div class="input-group mb-3">
                                      <div class="input-group-prepend">
                                        <span class="input-group-text"><i class="fas fa-ruble-sign"></i></span>
                                      </div>
                                      <input type="number" class="form-control" placeholder="Число"
                                        onChange={this.onChange}
                                        name="work_salary" value={this.state.work_salary}
                                      />
                                    </div> 

                                    <div class="row">
                                        <div class="col-12 text-center">
                                            <button onClick={ this.saveNewAccountType } type="button" class="float-right col-5 col-sm-4 col-lg-2 col-md-3 btn btn-block btn-info btn-md">Подать заявку</button>
                                        </div>
                                    </div>

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
