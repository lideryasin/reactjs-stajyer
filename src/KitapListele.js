import React, { Component } from 'react';
import MessageList from './components/MessageList';
import Jumbotron from './components/Jumbotron';

class Home extends Component {
    render() {
        return (
            <div>
                <Jumbotron subtitle="" />
                <div className="container">
                    <MessageList />
                </div>
            </div>
        );
    }
}

export default Home;
