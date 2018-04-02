import React, { Component } from 'react';
import KitapEkle from './KitapEkle';
import 'firebase/database';


class Home extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
           <KitapEkle />
            </div>
        );
    }
}

export default Home;
