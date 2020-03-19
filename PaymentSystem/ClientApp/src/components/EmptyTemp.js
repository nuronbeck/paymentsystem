import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { LoaderSpinner } from './ui/pageLoaderSpinner'

export class EmptyTemp extends Component {
    static displayName = EmptyTemp.name;

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
         
    }
    
	    



    componentDidMount() { 
        this.setState({ isLoading: false })       
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
                        
                    </div> 
                </section>
            </div> 
    );
  }
}
