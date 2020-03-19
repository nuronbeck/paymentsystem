import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from '../ui/pageLoaderSpinner.css'

export class LoaderSpinner extends Component {
    static displayName = LoaderSpinner.name;

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div class="content-wrapper bg-light d-flex justify-content-center align-items-center">
                <div class="lds-ring" > <div class="border-primary"></div> <div></div> <div></div> <div></div> </div>
            </div>
       	);
    }
}
