import React, { Component } from 'react';
import { HashRouter ,Route } from 'react-router-dom';
import firebase from 'firebase';
import 'firebase/database';
import KitapEkle from './KitapEkle';
import KitapListele from './KitapListele';
import Navbar from './components/Navbar';


class App extends Component {
  constructor(props) {
    super(props);
    var config = {
      apiKey: "AIzaSyAhhwCyKmMc3hCvxy4MPC2TL45S_jC4fMw",
      authDomain: "stajyer-dd28a.firebaseapp.com",
      databaseURL: "https://stajyer-dd28a.firebaseio.com",
      projectId: "stajyer-dd28a",
      storageBucket: "stajyer-dd28a.appspot.com",
      messagingSenderId: "65692107861"
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
