import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { LoaderSpinner } from './ui/pageLoaderSpinner'

export class Payments extends Component {
    static displayName = Payments.name;

    constructor(props) {
        super(props)
        let loggedIn = true

        this.state = {
            isLoading: true,
            loggedIn,
            userId: null,
            user: [],
            userInfo: [],
            userPayments: [],
            clients: [],
            receiverSelected: false,
            receiverClientId: null,
            receiverClientChat: [],
            sendingSumm: null,
            sendingComment: ''
        }

        const user = localStorage.getItem('access_token')
        if (user == null) {
            this.state.loggedIn = false 
        }

        this.onChange = this.onChange.bind(this)

        this.fetchUserIdData = this.fetchUserIdData.bind(this)
        this.fetchUserPaymentsData = this.fetchUserPaymentsData.bind(this)
        this.fetchClientsData = this.fetchClientsData.bind(this)
        this.selectedReceiver = this.selectedReceiver.bind(this)
        this.getUserChat = this.getUserChat.bind(this)
        this.sendMoney = this.sendMoney.bind(this)
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
        .then(data => { 
            if (data) { 
                rctObj.setState({ userId: data })
                rctObj.fetchUserPaymentsData()
            }
        })

        //console.log(this.state.userId)
    }

    async fetchUserPaymentsData() {
        var rctObj = this
        await fetch('payment', {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=UTF-8',
                'api_token': localStorage.getItem('access_token')
            }
        })
        .then(res => { return res.json() })
        .then(data => {
            if (data) {
                console.log(data)
                rctObj.setState({ userPayments: data })
                rctObj.fetchClientsData()
            } 
        })
    }

    async fetchClientsData() {
        var rctObj = this
        fetch('api/clients', {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=UTF-8',
                'api_token': localStorage.getItem('access_token')
            }
        }).then(res => { return res.json() }).then(data => { console.log(data); rctObj.setState({ isLoading: false, clients: data }) })
    }


    async selectedReceiver(selected_client_id) {
        await this.setState({
            receiverClientId: selected_client_id,
            isLoading: true,
            receiverSelected: true
        })
        this.getUserChat(selected_client_id)
    }

    async getUserChat(clientId) {
        var rctObj = this
        await rctObj.setState({
            receiverClientChat: rctObj.state.userPayments.filter((payment) => payment.recipient_id == clientId && payment.sender_id == rctObj.userId), 
            isLoading: false
        })

        console.log(this.state.receiverClientChat)
    }

    sendMoney(e) {
        e.preventDefault()
        alert("Пока на реализации")
        //if (this.state.sendingSumm > 0 && this.state.sendingSumm && this.state.sendingComment != '') {
        //    await fetch('payment/add', {
        //        method: 'post',
        //        headers: {
        //            'Accept': 'application/json',
        //            'Content-Type': 'application/json; charset=UTF-8',
        //            'api_token': localStorage.getItem('access_token')
        //        },
        //        body: JSON.stringify({ 
        //            "sender_id": this.state.type_id,
        //            "income": this.state.work_salary,
        //            "place_job": this.state.work_addess
        //        })
        //    })
        //    .then(function (response) {  return response.json() })
        //    .then(data => { if (data) { rct.props.history.push('/my-applications') }  })
        //    .catch((error) => { console.log(error) })
        //} else {

        //}
    }

    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    componentDidMount() { 
        var reactObj = this
        reactObj.fetchUserIdData()     
    }

    componentWillMount() {
        //alert(JSON.stringify(this.props))
        if (!this.state.loggedIn) { this.props.history.push('/sign-in') }
        this.setState({
            user: JSON.parse(localStorage.getItem("user"))
        }) 
    }

    render() {

        const { user, clients, userId, receiverSelected, receiverClientChat } = this.state

        return this.state.isLoading ? <LoaderSpinner /> : (
            <div class="content-wrapper" style={{ minHeight: '846.563px'}}> 
                <section class="content-header">
                    <div class="container-fluid">
                        <div class="row mb-2">
                            <div class="col-sm-6">
                                <h1>Платёжи</h1>
                            </div>
                            <div class="col-sm-6">
                                <ol class="breadcrumb float-sm-right">
                                    <li class="breadcrumb-item"><Link to="/">Главная</Link></li>
                                    <li class="breadcrumb-item active">Платёжи</li>
                                </ol>
                            </div>
                        </div>
                    </div> 
                </section> 
                <section class="content">
                    <div class="container-fluid">
                        <div class="row">
                            <div class="col-12 col-md-6 col-sm-12 col-lg-6">
                                <div class="card">
                                  <div class="card-header">
                                    <h3 class="card-title">Выберите получателя</h3>

                                    <div class="card-tools">
                                      <button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus"></i>
                                      </button>
                                    </div>
                                  </div>
                                  <div class="card-body p-0" >
                                    <ul class="users-list clearfix">
                                    {clients.map(client => { 
                                        if(client.id_client != userId && client.verification) {
                                            return (
                                                <li onClick={() => this.selectedReceiver(client.id_client)}>
                                                <img src="dist/img/user1-128x128.webp" alt="User Image"/>
                                                    <span class="users-list-name" >{client.fio}</span>
                                                <span class="users-list-date">{client.phone}</span>
                                                </li>
                                            )
                                        }else{ return ('') }
                                    })}
                                    </ul>
                                  </div>
                                </div>
                            </div>
                            <div className={ receiverSelected ? 'col-md-6 d-block' : 'd-none'  }>
                                <div class="card card-prirary cardutline direct-chat direct-chat-primary">
                                  <div class="card-header">
                                    <h3 class="card-title">История платёжей</h3>

                                    <div class="card-tools">
                                      <button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus"></i>
                                      </button>
                                    </div>
                                  </div>
                                  <div class="card-body">
                                    <div class="direct-chat-messages">
                                   {receiverClientChat.map(message => 
                                      <div class="direct-chat-msg right">
                                        <div class="direct-chat-infos clearfix">
                                          <span class="direct-chat-name float-right">{user.fio}</span>
                                          <span class="direct-chat-timestamp float-left"> </span>
                                        </div>
                                        <img class="direct-chat-img" src="../dist/img/user1-128x128.webp" alt="Message User Image"/>
                                        <div class="direct-chat-text">
                                           <span class="text-warning ">Отправлено: {message.sum} рублей</span>
                                          <br/>
                                          {message.comm}
                                        </div>
                                      </div>
                                    )}
                                    </div>
                                  </div>
                                  <div class="card-footer">
                                    <form onSubmit={this.sendMoney}>
                                      <div class="input-group mb-2">
                                        <div class="input-group-prepend">
                                        <span class="input-group-text"><i class="fas fa-ruble-sign"></i></span>
                                        </div>
                                        <input type="number" name="sendingSumm" onChange={this.onChange} value={this.state.sendingSumm} class="form-control" placeholder="Введите сумму"/>
                                      </div>
                                      <div class="input-group">
                                        <input type="text" name="sendingComment" onChange={this.onChange} value={this.state.sendingComment} placeholder="Комментарии ..." class="form-control"/>
                                        <span class="input-group-append">
                                          <button type="submit" class="btn btn-primary">Отправить платёж</button>
                                        </span>
                                      </div>
                                    </form>
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
