import React, { Component } from 'react';
import MessageList from './components/MessageList';
import Jumbotron from './components/Jumbotron';

class Home extends Component {
    render() {
        return (
            <div>
                <Jumbotron subtitle="“Bir kitap okuyan her şeyi bildiğini zanneder. İkinci kitabı okuyan kuşkuya düşer. Üçüncü kitabı okuyan hiçbir şey bilmediğini anlar.” Frederick Pollock" />
                <div className="container">
                    <MessageList />
                </div>
            </div>
        );
    }
}

export default Home;
