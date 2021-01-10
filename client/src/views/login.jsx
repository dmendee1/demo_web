import axios from 'axios';
import React, { Component } from 'react';
import config from '../config/config.json';

class Login extends Component {

    constructor() {
        super();
        this.state = {
            username: '',
            password: '',
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
        const user = {
            username: this.state.username,
            password: this.state.password
        }
        console.log("username is: " + user.username + " password is: " + user.password);

        axios.post(config.host + '/worker/login', user)
            .then(res => {
                console.log(res);
                this.props.history.push("/homepage");
            })
            .catch(err => {
                this.setState({
                    username: '',
                    password: '',
                    errors: err.response.data
                })
                console.log(this.state.errors);
            })


    }

    render() {
        const {errors} = this.state;
        return(
            <form onSubmit={ this.handleSubmit }>
                <h3>Log in</h3>
                {errors.message && (<div className="alert alert-danger">{errors.message}</div>)}
                <div className="form-group">
                    <label>Username</label>
                    <input type="text" 
                    className="form-control" 
                    onChange={this.handleInputChange} 
                    name="username" 
                    value={this.state.username} 
                    required
                    placeholder="Enter username" />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" 
                    className="form-control" 
                    onChange={this.handleInputChange} 
                    name="password" 
                    value={this.state.password} 
                    required
                    placeholder="Enter password" />
                </div>
                <div className="form-group">
                    <div className="custom-control custom-checkbox">
                        <input type="checkbox" className="custom-control-input" id="customCheck1" />
                        <label className="custom-control-label" htmlFor="customCheck1">Remember me</label>
                    </div>
                </div>
                <button type="submit" className="btn btn-dark btn-lg btn-block">Sign in</button>
            </form>
        );
    }
}

export default Login;