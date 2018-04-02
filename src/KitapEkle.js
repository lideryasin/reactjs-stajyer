import React, { Component } from 'react';
import MessageBox from './components/MessageBox';
import Header from './components/Header';
import firebase from 'firebase';
import 'firebase/database';


class KitapEkle extends Component {
    render() {
        return (
            <div className="container">
                <Header title="" />
                <div className="column is-6">
                    <div className="container">
                        <MessageBox db={firebase} storageRef={firebase} />
                    </div>
                </div>
            </div>
        );
    }
}

export default KitapEkle;
