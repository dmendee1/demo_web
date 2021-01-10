import React, { Component } from 'react';
import config from '../config/config.json';
import axios from 'axios';

class Signup extends Component {

    constructor() {
        super();
        this.state = {
            username: '',
            password: '',
            firstname: '',
            lastname: '',
            errors: {}
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit(e) {
        e.preventDefault();
        let user = {
            username: this.state.username,
            password: this.state.password,
            firstname: this.state.firstname,
            lastname: this.state.lastname,
        }
        
        axios.post(config.host + '/worker/register', user)
            .then(res => {
                console.log(res);
                this.props.history.push(res.data.api);
            })
            .catch(err => {
                console.log(err);
            })
        

    }

    render() {
        return(
            <form onSubmit={ this.handleSubmit }>
                <h3>Register</h3>
                <div className="form-group">
                    <label>First name</label>
                    <input type="text" 
                    className="form-control" 
                    onChange={this.handleInputChange}
                    name = "firstname"
                    value = {this.state.firstname}
                    required
                    placeholder="First name" />
                </div>
                <div className="form-group">
                    <label>Last name</label>
                    <input type="text" 
                    className="form-control" 
                    onChange={this.handleInputChange}
                    name = "lastname"
                    value = {this.state.lastname}
                    required
                    placeholder="Last name" />
                </div>
                <div className="form-group">
                    <label>Username</label>
                    <input type="text" 
                    className="form-control" 
                    onChange={this.handleInputChange}
                    name = "username"
                    value = {this.state.username}
                    required
                    placeholder="Enter username" />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" 
                    className="form-control" 
                    onChange={this.handleInputChange}
                    name = "password"
                    value = {this.state.password}
                    required
                    placeholder="Enter password" />
                </div>
                <button type="submit" className="btn btn-dark btn-lg btn-block">Register</button>
            </form>
        );
    }
}

export default Signup;