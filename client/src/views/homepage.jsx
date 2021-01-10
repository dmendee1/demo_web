import React, { Component } from 'react';

class HomePage extends Component {

    constructor() {
        super();
        this.state = {
            accessToken: '',
            counter: 0
        }
        this.handlePlus = this.handlePlus.bind(this);
        this.handleSubs = this.handleSubs.bind(this);
    }

    handlePlus(e) {
        this.setState({
            counter: this.state.counter + 1
        })
    }

    handleSubs(e) {
        if(this.state.counter > 0) {    
            this.setState({
                counter: this.state.counter - 1
            })
        }
    }

    handleSubmit(e) {

    }

    render() {
        return(
            <div>
                <h3>Welcome to homepage {this.props.name}</h3>
                <h5>Couter is: {this.state.counter}</h5>
                <button onClick={this.handlePlus}>+</button><button onClick={this.handleSubs}>-</button>
                <button onClick={this.handlePlus}>Submit</button>
            </div>
        );
    }
}

export default HomePage;