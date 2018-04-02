import React, { Component } from 'react';
import MessageList from './components/MessageList';


class Home extends Component {
    render() {
        return (
            <div className="container">
                <MessageList />
            </div>
        );
    }
}

export default Home;
