import React from 'react';
import { Link } from 'react-router-dom';

class Navbar extends React.Component {
    render() {
        return (
            <div className="container">
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <a className="navbar-brand" href="/">Stajyer</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mr-auto">
                            <Link key="kitapEkle" to="/KitapEkle" className="nav-link">
                                <li className="nav-item active">
                                    Stajyer Ekle
                                </li>
                            </Link>
                            <Link key="kitapListele" to="/KitapListele" className="nav-link">
                                <li className="nav-item">
                                    Stajyer Listele
                                </li>
                            </Link>
                        </ul>
                    </div>
                </nav>
            </div>
        );
    }
}

export default Navbar;


