import React, { Component } from 'react';
import trim from 'trim';
import firebase from 'firebase';
import 'firebase/database';
import 'firebase/storage';
import FileUpload from './FileUpload';
import './MessageBox.css';
import _ from 'lodash';

class MessageBox extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onChange2 = this.onChange2.bind(this);
    this.onChange3 = this.onChange3.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
    this.onChange4 = this.onChange4.bind(this);
    this.yasinChange = this.yasinChange.bind(this);
    this.yasinChange2 = this.yasinChange2.bind(this);

    this.state = {
      saat: '',
      adSoyad: '',
      message: '',
      yazarAdi: '',
      kitapKimde: '',
      yayinEvi: 'Abaküs',
      yayineviEkle: '',
      text: '',
      file: '',
      imagePreviewUrl: '',
      pictures: [],
      messages: [],
      yayinEvleri: [],
      yasin: 'Okumadı',
      yasin2: '',
      AdSoyadList: [],
      kitapKimdeList: [],

    };
  }
  onChange(e) {
    this.setState({
      message: e.target.value
    });
  }
  onChange2(e) {
    this.setState({
      yazarAdi: e.target.value
    });
  }
  onChange3(e) {
    this.setState({
      adSoyad: e.target.value
    });
  }
  onChange4(e) {
    this.setState({
      yayineviEkle: e.target.value
    });
  }
  handleChange2(event) {
    this.setState({ kitapKimde: event.target.value });
  }
  handleChange(event) {
    this.setState({ yayinEvi: event.target.value });
  }
  yasinChange(event) {
    this.setState({ yasin: event.target.value });
  }
  yasinChange2(event) {
    this.setState({ yasin2: event.target.value });
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
    console.log('handle uploading-', this.state.file);

    const storageRef = firebase.storage().ref(`${this.state.file.name}`);
    const task = storageRef.put(this.state.file);

    task.on('state_changed', snapshot => {
      let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      this.setState({
        uploadValue: percentage
      })
    }, error => {
      console.error(error.message);
    }, () => {
      const dbRef = this.props.db.database().ref('/messages');
      const timestamp = Date.now();
      dbRef.push({
        saat: trim("" + new Intl.DateTimeFormat('tr-TR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(timestamp)),
        adSoyad: trim(this.state.adSoyad),
        message: trim(this.state.message),
        yazarAdi: trim(this.state.yazarAdi),
        kitapKimde: trim(this.state.kitapKimde),
        yayinEvi: trim(this.state.yayinEvi),
        image: task.snapshot.downloadURL
      });
    });

    this.refs.someName.value = '';
    this.refs.someName2.value = '';
    this.refs.someName3.value = '';
    this.refs.someName4.value = '';
    this.refs.file.value = '';
    this.setState({ imagePreviewUrl: null })

    const dbRef = firebase.database().ref('/AdSoyadList');
    dbRef.child(this.state.adSoyad).set({
      AdSoyadList: trim(this.state.adSoyad)
    });

    const dbRef2 = firebase.database().ref('/kitapKimdeList');
    dbRef2.child(this.state.kitapKimde).set({
      AdSoyadList: trim(this.state.kitapKimde)
    });

    const dbRef3 = firebase.database().ref('/adsoyad-kitapKimde');
    dbRef3.child(this.state.adSoyad).push({
      kitapAdi: trim(this.state.message)
    });

  }

  componentDidMount() {
    let app = firebase.database().ref('messages');
    app.on('value', snapshot => {
      this.getData(snapshot.val());
    });

    let app2 = firebase.database().ref('yayinEvleri');
    app2.on('value', snapshot => {
      this.getData2(snapshot.val());
    });

    let app3 = firebase.database().ref('AdSoyadList');
    app3.on('value', snapshot => {
      this.getData3(snapshot.val());
    });

    let app4 = firebase.database().ref('kitapKimdeList');
    app4.on('value', snapshot => {
      this.getData4(snapshot.val());
    });
  }
  componentWillUnmount() {
    firebase.database().ref('messages').off('value');
  }
  getData(values) {
    let messagesVal = values;
    let messages = _(messagesVal)
      .keys()
      .map(messageKey => {
        let cloned = _.clone(messagesVal[messageKey]);
        cloned.key = messageKey;
        return cloned;
      })
      .value();
    this.setState({
      messages
    });
  }
  getData2(values) {
    let messagesVal = values;
    let yayinEvleri = _(messagesVal)
      .keys()
      .map(yayineviEkleKey => {
        let cloned = _.clone(messagesVal[yayineviEkleKey]);
        cloned.key = yayineviEkleKey;
        return cloned;
      })
      .value();
    this.setState({
      yayinEvleri
    });
  }
  getData3(values) {
    let messagesVal = values;
    let AdSoyadList = _(messagesVal)
      .keys()
      .map(yayineviEkleKey => {
        let cloned = _.clone(messagesVal[yayineviEkleKey]);
        cloned.key = yayineviEkleKey;
        return cloned;
      })
      .value();
    this.setState({
      AdSoyadList
    });
  }

  getData4(values) {
    let messagesVal = values;
    let kitapKimdeList = _(messagesVal)
      .keys()
      .map(yayineviEkleKey => {
        let cloned = _.clone(messagesVal[yayineviEkleKey]);
        cloned.key = yayineviEkleKey;
        return cloned;
      })
      .value();
    this.setState({
      kitapKimdeList
    });
  }

  cek() {
    return (
      <div>
        <input type="text"
          className="form-control mr-sm-2 search" aria-label="Search"
          placeholder="Ad Soyad"
          onChange={this.onChange3}
          ref="someName"
          list="datalist1"
        />
        <div>
          <datalist id="datalist1">
            {this.state.AdSoyadList.map(fbb =>
              <option key={fbb.key} value={fbb.AdSoyadList}>{fbb.AdSoyadList}</option>
            )}
          </datalist>
        </div>
      </div>
    )
  }

  cekKitaKimde() {
    return (
      <div>
        <input type="text"
          className="form-control mr-sm-2 search" aria-label="Search"
          placeholder="Kitap Kimde"
          onChange={this.handleChange2}
          ref="someName4"
          list="datalist1"
        />
        <div>
          <datalist id="datalist1">
            {this.state.kitapKimdeList.map(fbb =>
              <option key={fbb.key} value={fbb.kitapKimde}>{fbb.kitapKimde}</option>
            )}
          </datalist>
        </div>
      </div>
    )
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
              {this.cek()}
              <input type="text"
                className="form-control mr-sm-2 search" aria-label="Search"
                placeholder="Kitap Adı"
                onChange={this.onChange}
                onKeyUp={this.onKeyup}
                ref="someName2"
              />

              <input type="text"
                className="form-control mr-sm-2 search" aria-label="Search"
                placeholder="Yazar Adı"
                onChange={this.onChange2}
                onKeyUp={this.onKeyup}
                ref="someName3"
              />

              {this.cekKitaKimde()}

              <label>
                Yayın evleri :
            <select className="custom-select" value={this.state.yayinEvi} onChange={this.handleChange}>
                  {this.state.yayinEvleri.map(fbb =>
                    <option key={fbb.key} value={fbb.yayineviEkle}>{fbb.yayineviEkle}</option>
                  )};
          </select>
              </label>
              <hr />
              <div className="previewComponent">
                <form onSubmit={(e) => this._handleSubmit(e)}>
                  <input className="fileInput"
                    type="file"
                    onChange={(e) => this._handleImageChange(e)} ref="file" />
                </form>
                <button className="btn btn-outline-success"
                  type="submit"
                  onClick={(e) => this._handleSubmit(e)}>Kaydet</button>
              </div>
            </div>
            <div className="sag">
              <div className="imgPreview">
                {$imagePreview}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default MessageBox
