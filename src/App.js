import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import firebase from 'firebase';
import 'firebase/database';
import KitapEkle from './KitapEkle';
import KitapListele from './KitapListele';
import Jumbotron from './components/Jumbotron';
import Navbar from './components/Navbar';

import {HashRouter} from 'react-router-dom';



class App extends Component {
  constructor(props) {
    super(props);
    var config = {
      apiKey: "AIzaSyCgYcHwfwhQbrx_Ux_AvCqIkSn3mzog_Mo",
      authDomain: "react1-697c3.firebaseapp.com",
      databaseURL: "https://react1-697c3.firebaseio.com",
      projectId: "react1-697c3",
      storageBucket: "react1-697c3.appspot.com",
      messagingSenderId: "190614813192"
    };
    firebase.initializeApp(config);
  }
  render() {
    return (
      <div>
        <HashRouter>
          <div>
            <Navbar />
              <Route path="/KitapEkle" component={KitapEkle} />
              <Route path="/KitapListele" component={KitapListele} />
              <Route exact path="/" component={KitapEkle} />
          </div>
          </HashRouter>
      </div>
    );
  }
}

export default App;
