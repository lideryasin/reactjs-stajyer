import React from 'react';
import { Link } from 'react-router-dom';
import firebase from 'firebase';
import trim from 'trim';

class Navbar extends React.Component {
    constructor(props) {
        super(props);
        
        this.state ={
            yayineviEkle: '',
            yayinEvleri: []
        }
    }
    onChange4(e) {
        this.setState({
            yayineviEkle: e.target.value
        });
    }
    yayinEviKaydet() {
        const dbRef = firebase.database().ref('/yayinEvleri');
        dbRef.child(this.state.yayineviEkle).set({
            yayineviEkle: trim(this.state.yayineviEkle)
        });

        this.refs.someName2.value = '';
    }
    render() {
        return (
            <div className="container">
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <a className="navbar-brand" href="/">Kitap</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mr-auto">
                            <Link key="kitapEkle" to="/KitapEkle" className="nav-link">
                                <li className="nav-item active">
                                    Kitap Ekle
                                </li>
                            </Link>
                            <Link key="kitapListele" to="/KitapListele" className="nav-link">
                                <li className="nav-item">
                                    Kitap Listele
                                </li>
                            </Link>

                            <li className="nav-item">
                                <form className="form-inline my-2 my-lg-0">
                                    <input ref="someName2" className="form-control mr-sm-2" onChange={this.onChange4.bind(this)} type="search" placeholder="Yayın Evi" aria-label="Search" />
                                </form>
                            </li>
                            <li className="nav-item">
                                <input type="button"
                                    className="btn btn-outline-success"
                                    value="Yayın Evini Kaydet"
                                    onClick={this.yayinEviKaydet.bind(this)} />
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
        );
    }
}

export default Navbar;


