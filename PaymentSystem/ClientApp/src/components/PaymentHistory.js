import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { LoaderSpinner } from './ui/pageLoaderSpinner'

export class PaymentHistory extends Component {
    static displayName = PaymentHistory.name;

    constructor(props) {
        super(props)
        let loggedIn = true

        this.state = {
            isLoading: true,
            loggedIn,
            userId: null,
            user: [],
            userPayments: [],
            userPaymentHistory: [],
            paymentStatuses: [],
            clients: []
        }

        const user = localStorage.getItem('access_token')
        if (user == null) {
            this.state.loggedIn = false 
        }

        this.fetchUserHistoryPaymentsData = this.fetchUserHistoryPaymentsData.bind(this)
        this.fetchUserPaymentsData = this.fetchUserPaymentsData.bind(this) 
        this.fetchHistoryPaymentsStatusData = this.fetchHistoryPaymentsStatusData.bind(this)
        this.fetchClientsData = this.fetchClientsData.bind(this)

        this.returnSenderName = this.returnSenderName.bind(this)
        this.returnReceiverName = this.returnReceiverName.bind(this)
        this.returnSummPayment = this.returnSummPayment.bind(this)
        this.returnCommentPayment = this.returnCommentPayment.bind(this)

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

    async fetchHistoryPaymentsStatusData() {
        var rctObj = this
        await fetch('api/status_payment', {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=UTF-8',
                'api_token': localStorage.getItem('access_token')
            }
        }).then(res => { return res.json() }) .then(data => { //console.log(data)
            if (data) { rctObj.setState({ paymentStatuses: data }) }
            rctObj.fetchClientsData() 
        })
    }

    returnPaymentStatusName(stat_id) {
        var statusRecord = this.state.paymentStatuses.filter((payStat) => { return payStat.id_status_payment == stat_id }) 
        return statusRecord[0].name
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

        //console.log(this.state.userId)
    }

    async fetchUserHistoryPaymentsData() {
        var rctObj = this
        await fetch('api/payment_history', {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=UTF-8',
                'api_token': localStorage.getItem('access_token')
            }
        })
        .then(res => { return res.json() })
        .then(data => {
            console.log(data)
            if (data) {
                rctObj.setState({ 
                    userPaymentHistory: data //.filter((appl) => { return appl.client_id == rctObj.state.userId })
                })
            }
            rctObj.fetchHistoryPaymentsStatusData() 
        })
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
            }
            rctObj.fetchUserHistoryPaymentsData()
            rctObj.fetchUserIdData()
        })
    }

    returnSenderId(payment_id) {
        var transaction = this.state.userPayments.filter((payment) => { return payment.id_payment == payment_id })
        return transaction[0].sender_id
    }
    returnSenderName(payment_id) {
        var transaction = this.state.userPayments.filter((payment) => { return payment.id_payment == payment_id }) 
        return transaction[0].sender_id
    }
    returnReceiverName(payment_id) {
        var transaction = this.state.userPayments.filter((payment) => { return payment.id_payment == payment_id }) 
        var receiver = this.state.clients.filter((client) => { return client.id_client == transaction[0].recipient_id })

        return receiver.length > 0 ? receiver[0].fio : ''
    }
    returnSummPayment(payment_id) {
        var transaction = this.state.userPayments.filter((payment) => { return payment.id_payment == payment_id })
        return transaction[0].sum
    }
    returnCommentPayment(payment_id) {
        var transaction = this.state.userPayments.filter((payment) => { return payment.id_payment == payment_id })
        return transaction[0].comm
    }

    componentDidMount() {
        var rct = this 
        rct.fetchUserPaymentsData() 
        //rct.setState({ isLoading: false })       
    }

    componentWillMount() {
        //alert(JSON.stringify(this.props))
        if (!this.state.loggedIn) { this.props.history.push('/sign-in') }
        this.setState({
            user: JSON.parse(localStorage.getItem("user"))
        }) 
    }

    render() {

        const { userPaymentHistory, userPayments, paymentStatuses, userId } = this.state

        return this.state.isLoading ? <LoaderSpinner /> : (
            <div class="content-wrapper" style={{ minHeight: '846.563px'}}> 
                <section class="content-header">
                    <div class="container-fluid">
                        <div class="row mb-2">
                            <div class="col-sm-6">
                                <h1>Истории платёжей</h1>
                            </div>
                            <div class="col-sm-6">
                                <ol class="breadcrumb float-sm-right">
                                    <li class="breadcrumb-item"><Link to="/">Главная</Link></li>
                                    <li class="breadcrumb-item active">Истории</li>
                                </ol>
                            </div>
                        </div>
                    </div> 
                </section> 
                <section class="content">
                    <div class="container-fluid">
                        <div class="row">
                            <div class="col-12">
                                <div class="card">
                                    <div class="card-header">
                                        <h3 class="card-title">Истории транзакции</h3>

                                        <div class="card-tools">
                                            <div class="input-group input-group-sm" style={{ width: '150px' }}>
                                                <input type="text" name="table_search" class="form-control float-right" placeholder="Поиск" />

                                                <div class="input-group-append">
                                                    <button type="submit" class="btn btn-default"><i class="fas fa-search"></i></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card-body table-responsive p-0" style={{ height: '400px' }}>
                                        <table class="table table-head-fixed text-nowrap">
                                            <thead>
                                                <tr>
                                                    <th>Номер платёжа</th>
                                                    <th>Получатель</th>
                                                    <th>Дата</th>
                                                    <th>Сумма</th>
                                                    <th>Комментарии</th>
                                                    <th>Статус</th>
                                                    <th>Причина</th> 
                                                </tr>
                                            </thead>
                                            <tbody>
                                            {userPaymentHistory.map((userPayment) => {
                                                if (this.returnSenderName(userPayment.payment_id) == userId) {
                                                    return (
                                                    <tr>
                                                        <td>{userPayment.payment_id}</td>
                                                        <th>{this.returnReceiverName(userPayment.payment_id)}</th>
                                                        <td>{new Intl.DateTimeFormat('en-GB', { year: "2-digit", month: "2-digit", day: "2-digit" }).format(new Date(userPayment.date_check)).replace(/\//g, '.')}</td>
                                                        <th>{this.returnSummPayment(userPayment.payment_id)}</th>
                                                        <th>{this.returnCommentPayment(userPayment.payment_id)}</th>
                                                        <td><span class="tag tag-success">{this.returnPaymentStatusName(userPayment.status_payment_id)}</span></td>
                                                        <td>{userPayment.rejection}</td>
                                                    </tr>
                                                    )
                                                } else { return ''}
                                            })}
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
