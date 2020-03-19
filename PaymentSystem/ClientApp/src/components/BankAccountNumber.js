import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { LoaderSpinner } from './ui/pageLoaderSpinner'

export class BankAccountNumber extends Component {
    static displayName = BankAccountNumber.name;

    constructor(props) {
        super(props)
        let loggedIn = true

        this.state = {
            isLoading: true,
            loggedIn,
            user: [],
            userBankAccounts: [],
            showCardInside: false,
            showCardData: []
        }

        const user = localStorage.getItem('access_token')
        if (user == null) {
            this.state.loggedIn = false 
        }

        this.fetchData = this.fetchData.bind(this)
        this.showCardInsideClick = this.showCardInsideClick.bind(this)
    }


    componentWillMount() {
        //alert(JSON.stringify(this.props))
        if (!this.state.loggedIn) { this.props.history.push('/sign-in') }
        this.setState({
            user: JSON.parse(localStorage.getItem("user"))
        }) 
    }

    componentDidMount() {
        this.fetchData()
    }

    async fetchData() {
        var rctObj = this
        await fetch('/accounts/my', {
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
        .then(data => {
            //console.log(data)
            if (data) {
                rctObj.setState({
                    isLoading: false,
                    userBankAccounts: data
                })
            } 
        })

        console.log(this.state.userBankAccounts)
    }

    async showCardInsideClick(id_acc) {
        var interval = 500
        if (this.state.showCardInside) { interval = 0 }

        this.setState({
            showCardData: this.state.showCardInside ? [] :this.state.userBankAccounts.filter(account => { return account.id_acc == id_acc && account.credit_rate_ != null })
        }) 
        
        setTimeout(() =>  this.setState({ showCardInside: !this.state.showCardInside  }) , interval)
    }

    render() {
        const { userBankAccounts, showCardData } = this.state

        return this.state.isLoading ? <LoaderSpinner/>  : (
            <div class="content-wrapper"> 
                <section class="content-header">
                    <div class="container-fluid">
                        <div class="row mb-2">
                            <div class="col-sm-6">
                                <h1>Мои счёта</h1>
                            </div>
                            <div class="col-sm-6">
                                <ol class="breadcrumb float-sm-right">
                                    <li class="breadcrumb-item"><Link to="/">Главная</Link></li>
                                    <li class="breadcrumb-item active">Мои счёта</li>
                                </ol>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12 text-center">
                                <button type="button" class="float-right col-5 col-sm-4 col-lg-2 col-md-3 btn btn-block btn-success btn-sm" onClick={() => this.props.history.push('/new-application') }>Создать новую</button>
                            </div> 
                        </div>
                    </div> 
                </section>
                <section class="content">
                </section>
                <section class="content">
                    <div class="row">
                    {userBankAccounts.map(bankAccs =>
                      <div class="col-sm-6 col-md-4 col-lg-4">
                        <div class="card card-primary" style={{ transition: 'all 0.15s ease 0s', height: 'inherit', width: 'inherit' }}>
                          <div className={ bankAccs.type_acc_.id_type_acc == 3 ? "card-header pt-4 bg-teal" : "card-header pt-4 bg-warning" }>
                            <h3 class="card-title">{bankAccs.type_acc_.name} карта</h3>

                            <div class="card-tools">
                              <button type="button" class="btn btn-tool" data-card-widget="maximize" onClick={() => this.showCardInsideClick(bankAccs.id_acc)} ><i class="fas fa-expand"></i></button>
                              <button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus"></i></button> 
                            </div>
                          </div> 
                          <div class="card-body" style={{ display: 'block' }}> 
                            <div class="row">
                                <div class="col-12" style={{maxWidth: '350px'}}>
                                    <div class="position-relative p-3 bg-info rounded" style={{height: '180px'}}>
                                        <div class="ribbon-wrapper ribbon-lg">
                                            <div class="ribbon bg-secondary">
                                                { bankAccs.status_acc_.name}
                                            </div>
                                        </div>
                                        <p><i class="fas fa-landmark text-light"></i> Счёт # {bankAccs.id_acc} </p>
                                        <p><i class="fas fa-ruble-sign text-light"></i> Баланс: {bankAccs.balance_acc} руб.</p>
                                        <p class="text-center"><small>VALID THRU: <b>{new Intl.DateTimeFormat('en-GB', { year: "2-digit", month: "2-digit" }).format(new Date(bankAccs.date_close_acc)).replace(/\//g, '/')}</b></small></p>
                                        <h2 class="mb-0 mt-2 pb-0 text-right"> <i class="fab fa-cc-visa text-light"></i> </h2>   
                                    </div>
                                </div>

                                <div className={ this.state.showCardInside ? 'col-12 mt-4' : 'd-none'}>
                                <div class="invoice p-3 mb-3">
                                    <div class="row mb-3">
                                    <div class="col-12">
                                        <h4>
                                        <i class="fas fa-globe"></i> Информация по счёту
                                        <small class="float-right">Истекает: {new Intl.DateTimeFormat('en-GB', { year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(bankAccs.date_close_acc)).replace(/\//g, '/')}</small>
                                        </h4>
                                    </div>
                                    </div>
                                    <div class="row invoice-info"> 
                                    <div class="col-sm-4 invoice-col">
                                        <strong>Клиент</strong>
                                        <address>
                                        ФИО: { bankAccs.client_.fio}<br/>
                                        Email: { bankAccs.client_.email}<br/>
                                        Тел.:{ bankAccs.client_.phone}<br/>
                                        Паспорт серия: { bankAccs.client_.passport_s}<br/>
                                        Паспорт номер: { bankAccs.client_.passport_n}
                                        </address>
                                    </div>
                                    <div class="col-sm-4 invoice-col">
                                        <b>Статус счёта: </b>{ bankAccs.status_acc_.name}<br/>
                                        <br/>
                                        <b>Дата создания:</b> {new Intl.DateTimeFormat('en-GB', { year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(bankAccs.date_open_acc)).replace(/\//g, '/')}<br />
                                        <b>Дата истечения:</b> {new Intl.DateTimeFormat('en-GB', { year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(bankAccs.date_close_acc)).replace(/\//g, '/')}<br />
                                        <b></b> -<br/>
                                        <b></b> -
                                    </div>
                                    <div class="col-sm-4 invoice-col">
                                        <strong>Условия кредитования:</strong> {showCardData.length == 0 ? 'нет' : ''}
                                    {showCardData.map(cardInfoData => 
                                        <address>
                                        <strong>{cardInfoData.credit_rate_.name}</strong><br/>
                                        {cardInfoData.credit_rate_.condition}<br/>
                                        <strong>Процент: </strong>{cardInfoData.credit_rate_.procent}% годовых<br/>
                                        <strong>Кредитный лимит: </strong><br/>
                                        { cardInfoData.credit_rate_.credit_limit } рублей
                                        </address>
                                    )}
                                    </div>
                                    </div>
                                </div>
                                </div>
                            

                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    </div>
                </section>
            </div> 
        );
  }
}
