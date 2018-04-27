import React, { Component } from 'react';
import MessageBox from './components/MessageBox';
import firebase from 'firebase';
import 'firebase/database';
import Jumbotron from './components/Jumbotron';


class KitapEkle extends Component {
    render() {
        return (
            <div>
                <Jumbotron  subtitle="" />
                <div className="container">
                    <div className="column is-6">
                        <div className="container">
                            <MessageBox db={firebase} storageRef={firebase} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default KitapEkle;
