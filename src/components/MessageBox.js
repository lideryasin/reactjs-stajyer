import React, { Component } from 'react';
import trim from 'trim';
import firebase from 'firebase';
import 'firebase/database';
import 'firebase/storage';
import './MessageBox.css';
import Calendar2 from 'rc-calendar';
import Tur from 'rc-calendar/lib/locale/tr_TR'


class MessageBox extends Component {
  constructor(props) {
    super(props);
    this.adSoyadOnChange = this.adSoyadOnChange.bind(this);
    this.okulOnChange = this.okulOnChange.bind(this);
    this.adresOnChange = this.adresOnChange.bind(this);
    this.telefonOnChange = this.telefonOnChange.bind(this);
    this.mailOnChange = this.mailOnChange.bind(this);
    this.bildigiOnChange = this.bildigiOnChange.bind(this);
    this.programOnChange = this.programOnChange.bind(this);
    this.stajOnChange = this.stajOnChange.bind(this);



    this.state = {
      saat: '',
      adSoyad: '',
      okul: '',
      adres: '',
      telefon: '',
      mail: '',
      bildigi: '',
      program: '',
      file: '',
      imagePreviewUrl: '',
      pictures: [],
      list: [],
      staj: '',
      stajStart: '',
      stajStop: '',
      hedef: ''
    };
  }

  adSoyadOnChange(e) {
    this.setState({ adSoyad: e.target.value });
  }
  okulOnChange(e) {
    this.setState({ okul: e.target.value });
  }
  adresOnChange(e) {
    this.setState({ adres: e.target.value });
  }
  telefonOnChange(e) {
    this.setState({ telefon: e.target.value });
  }
  mailOnChange(e) {
    this.setState({ mail: e.target.value });
  }
  bildigiOnChange(e) {
    this.setState({ bildigi: e.target.value });
  }
  programOnChange(e) {
    this.setState({ program: e.target.value })
  }
  stajOnChange(e) {
    this.setState({ staj: e.target.value })
  }
  hedefOnChange = (e) => {
    this.setState({ hedef: e.target.value })
  }

  _handleImageChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result
      });
    }
    reader.readAsDataURL(file)
  }

  _handleSubmit(e) {

    e.preventDefault();
    const storageRef = firebase.storage().ref(`${this.state.file.name}`);
    const task = storageRef.put(this.state.file);

    task.on('state_changed', snapshot => {
      let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      this.setState({
        uploadValue: percentage
      })
    }, error => {
      // console.error(error.message);
    }, () => {
      const dbRef = this.props.db.database().ref('/Stajyer');
      const timestamp = Date.now();
      dbRef.push({
        saat: trim("" + new Intl.DateTimeFormat('tr-TR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(timestamp)),
        adSoyad: trim(this.state.adSoyad),
        okul: trim(this.state.okul),
        adres: trim(this.state.adres),
        telefon: trim(this.state.telefon),
        mail: trim(this.state.mail),
        bildigi: trim(this.state.bildigi),
        program: trim(this.state.program),
        staj: trim(this.state.staj),
        stajStart: trim("" + new Intl.DateTimeFormat('tr-TR', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(this.state.stajStart)),
        stajStop: trim("" + new Intl.DateTimeFormat('tr-TR', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(this.state.stajStop)),
        hedef: trim(this.state.hedef),
        image: task.snapshot.downloadURL
      });
    });

    this.refs.adSoyad.value = '';
    this.refs.okul.value = '';
    this.refs.adres.value = '';
    this.refs.mail.value = '';
    this.refs.telefon.value = '';
    this.refs.bildigi.value = '';
    this.refs.program.value = '';
    this.refs.staj.value = '';
    this.refs.file.value = '';
    this.refs.hedef.value = '';
    this.setState({ imagePreviewUrl: null })
  }

  componentWillUnmount() {
    firebase.database().ref('Stajyer').off('value');
  }

  render() {
    let { imagePreviewUrl } = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (<img src={imagePreviewUrl} />);
    } else {
      $imagePreview = (<div className="previewText">Lütfen Resim Seçiniz</div>);
    }
    return (
      <div>
        <div className="hepsi">
          <div className="container">
            <div className="sol">

              <input type="text"
                className="form-control mr-sm-2 search" aria-label="Search"
                placeholder="Ad Soyad"
                onChange={this.adSoyadOnChange}
                ref="adSoyad"
              />

              <textarea
                rows="3"
                className="form-control mr-sm-2 search" aria-label="Search"
                placeholder="Okul"
                onChange={this.okulOnChange}
                ref="okul"
              />

              <input type="text"
                className="form-control mr-sm-2 search" aria-label="Search"
                placeholder="Mail Adresiniz"
                onChange={this.mailOnChange}
                ref="mail"
              />

              <input type="text"
                className="form-control mr-sm-2 search" aria-label="Search"
                placeholder="Telefon"
                onChange={this.telefonOnChange}
                ref="telefon"
              />

              <textarea
                rows="3"
                className="form-control mr-sm-2 search" aria-label="Search"
                placeholder="Adres"
                onChange={this.adresOnChange}
                ref="adres"
              />

              <textarea
                rows="3"
                className="form-control mr-sm-2 search" aria-label="Search"
                placeholder="Bildiğiniz Programlama Dilleri"
                onChange={this.bildigiOnChange}
                ref="bildigi"
              />

              <textarea
                rows="2"
                className="form-control mr-sm-2 search" aria-label="Search"
                placeholder="Kulandığınız Araçlar "
                onChange={this.programOnChange}
                ref="program"
              />

              <div className="previewComponent">
                <form onSubmit={(e) => this._handleSubmit(e)}>
                  <input className="fileInput"
                    type="file"
                    onChange={(e) => this._handleImageChange(e)} ref="file" />
                </form>
              </div>


              <input type="text"
                className="form-control mr-sm-2 search" aria-label="Search"
                placeholder="Staj Yeriniz (Yoksa Doldurma)"
                onChange={this.stajOnChange}
                ref="staj"
              />

              Staj Başlangıç Tarihi :
              <Calendar2
                locale={Tur}
                format="DD/MM/YYYY"
                onChange={stajStart => this.setState({ stajStart })}
              ></Calendar2>

              <textarea
                 className="form-control mr-sm-2 search" aria-label="Search"
                 rows="5"
                placeholder="Varmak İstediğiniz Yer Ve Ne Yapmak İstiyorsunuz ?"
                onChange={this.hedefOnChange}
                ref="hedef"
              />

              <hr />
              <div className="previewComponent">
                <button className="btn btn-outline-success"
                  type="submit"
                  onClick={(e) => this._handleSubmit(e)}>Kaydet</button>
              </div>

            </div>
            <div className="sag">
              <div className="imgPreview">
                {$imagePreview}
              </div>
              <div className="calenderstajstop">
                Staj Bitiş Tarihi :
              <Calendar2
                  locale={Tur}
                  format="DD/MM/YYYY"
                  onChange={stajStop => this.setState({ stajStop })}
                ></Calendar2>
              </div>

            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default MessageBox
