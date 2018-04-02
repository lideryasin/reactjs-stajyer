import React, { Component } from 'react';
import trim from 'trim';
import firebase from 'firebase';
import 'firebase/database';
import 'firebase/storage';
import FileUpload from './FileUpload';
import './MessageBox.css';
import _ from 'lodash';

var config = {
  apiKey: "AIzaSyCgYcHwfwhQbrx_Ux_AvCqIkSn3mzog_Mo",
  authDomain: "react1-697c3.firebaseapp.com",
  databaseURL: "https://react1-697c3.firebaseio.com",
  projectId: "react1-697c3",
  storageBucket: "react1-697c3.appspot.com",
  messagingSenderId: "190614813192"
};

class MessageBox extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onKeyup = this.onKeyup.bind(this);
    this.on2 = this.on2.bind(this);
    this.onChange2 = this.onChange2.bind(this);
    this.onChange3 = this.onChange3.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
    this.onImageChange = this.onImageChange.bind(this);
    this.handleFileSelect = this.handleFileSelect.bind(this);
    this.handleFileUpload = this.handleFileUpload.bind(this);
    this.text = this.text.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.onChange4 = this.onChange4.bind(this);
    this.yayinEviKaydet = this.yayinEviKaydet.bind(this);

    this.state = {
      adSoyad: '',
      message: '',
      yazarAdi: '',
      kitapKimde: 'Şeref Keser CIO',
      yayinEvi: 'Abaküs',
      text: '',
      file: '',
      yayineviEkle: '',
      imagePreviewUrl: '',
      pictures: [],
      messages: [],
      yayinEvleri: []
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
  onKeyup(e) {
    if (e.keyCode === 13 && trim(e.target.value) !== '') {
      e.preventDefault();
      let dbCon = this.props.db.database().ref('/messages');
      dbCon.push({
        message: trim(e.target.value)
      });
      this.setState({
        message: ''
      });
    }
  }
  on2(e) {
    e.preventDefault();
    var dbCon = this.props.db.database().ref('/messages');
    dbCon.push({
      message: trim(this.state.message),
      yazarAdi: trim(this.state.yazarAdi),
      kitapKimde: trim(this.state.kitapKimde),
      yayinEvi: trim(this.state.yayinEvi),
    });
    this.setState({
      message: '',
      yazarAdi: '',
      kitapKimde: 'Şeref Keser CIO',
      yayinEvi: 'Abaküs',

    });
  }
  onImageChange(event) {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (e) => {
        this.setState({ file: e.target.result });
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }
  handleFileSelect(e) {
    this.setState({ file: e.target.files[0] })
  }
  handleFileUpload() {
    const storageRef = firebase.storage().ref();
    this.setState({ uploading: true })
    storageRef.child(this.state.text)
      .put(this.state.file)
      .then(snap => {
        this.setState({ uploading: false })
      })
      .catch(err => this.setState({ error: err.message }))
  }
  text(e) {
    this.setState({
      text: e.target.value
    })
  }
  //ilk foto upload
  handleUpload(event) {
    const file = event.target.files[0];
    const storageRef = firebase.storage().ref(`fotos/${file.name}`);
    const task = storageRef.put(file);

    task.on('state_changed', snapshot => {
      let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      this.setState({
        uploadValue: percentage
      })
    }, error => {
      console.error(error.message);
    }, () => {
      const record = {
        image: task.snapshot.downloadURL
      }
      const dbRef = this.props.db.database().ref('/messages');
     /* const newPicture = */dbRef.push({
        message: trim(this.state.message),
        yazarAdi: trim(this.state.yazarAdi),
        kitapKimde: trim(this.state.kitapKimde),
        yayinEvi: trim(this.state.yayinEvi),
        image: task.snapshot.downloadURL
      });
      //      newPicture.set(record);
    });
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

    if (this.state.message === "") {
      alert("Lütfen Kitap Adını Giriniz!");

    }
    else if (this.state.file === "") {
      alert("Lütfen resim Giriniz!");
    }
    else {

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
        /*const record = {
           image: task.snapshot.downloadURL
         }*/
        const dbRef = this.props.db.database().ref('/messages');
     /* const newPicture = */dbRef.push({
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
      this.refs.file.value = '';

    }
  }

  yayinEviKaydet() {
    const dbRef = firebase.database().ref('/yayinEvleri');
    dbRef.push({
      yayineviEkle: trim(this.state.yayineviEkle)
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
  }


  componentWillUnmount() {
    firebase.database().ref('messages').off('value');
  }
  componentWillUnmount() {
    firebase.database().ref('yayinEvleri').off('value');
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
            {this.state.messages.map(fbb =>
              <option key={fbb.key} value={fbb.adSoyad}>{fbb.adSoyad}</option>
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

              <label>
                Kitap Kimde :
            <select className="custom-select" value={this.state.kitapKimde} onChange={this.handleChange2}>
                  <option value="Şeref Keser CIO">Şeref Keser CIO</option>
                  <option value="Çağatay Çiftçi Üniversite 3.Sınıf">Çağatay Çiftçi İ.Ü 3.Sınıf </option>
                  <option value="Muhammed B. Aydemir Üniversite 3.Sınıf">Muhammed B. Aydemir İ.Ü 3.Sınıf</option>
                  <option value="Yasin Elüstü Lise Son Sınıf">Yasin Elüstü  BTML Lise Son Sınıf</option>
                  <option value="Binnur Övecek Lise Son Sınıf">Binnur Övecek Lise Son Sınıf</option>
                  <option value="Abdülkerim Yapıcı">Abdülkerim Yapıcı</option>
                  <option value="Oskay Karagülmez">Oskay Karagülmez</option>
                  <option value="Kübra Köse Üniversite Son Sınıf">Kübra Köse Üniversite Son Sınıf</option>
                  <option value="Emircan Kavas İ.Ü Bilgisayar Mühendisi">Emircan Kavas İ.Ü Bilgisayar Mühendisi</option>
                  <option value="Burakcan Çiftçi Lise Son Sınıf">Burakcan Çiftçi Lise Son Sınıf</option>
                  <option value="Göktem Sağlamoğlu bulurum.com ITI Manager">Göktem Sağlamoğlu bulurum.com ITI Manager</option>
                  <option value="Emre Saykal Üniversite Bilgisayar Mevzunu">Emre Saykal Üniversite Bilgisayar Mevzunu</option>
                  <option value="İbrahim Cevher Kadadayı Endüstri 3. Sınıf">İbrahim Cevher Kadadayı Endüstri 3. Sınıf</option>
                  <option value="Mustafa Akgöl Bilgisayar Mühendisi Mevzunu">Mustafa Akgöl Bilgisayar Mühendisi Mevzunu</option>
                  <option value="Beyhur Kaya Bilgisyar Mühendisi Mevzunu">Beyhur Kaya Bilgisyar Mühendisi Mevzunu</option>
                  <option value="Nurican Özcan">Nurican Özcan</option>
                  <option value="Fonex ERP">Fonex ERP</option>
                </select>
              </label>

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
                  <button className="btn btn-outline-success"
                    type="submit"
                    onClick={(e) => this._handleSubmit(e)}>Kaydet</button>
                </form>
              </div>

            </div>
            <div className="sag">
              <div className="imgPreview">
                {$imagePreview}
              </div>
            </div>
          </div>








          {/*
        <hr />

        <input type="text"
          className="form-control mr-sm-2 search" aria-label="Search"
          placeholder="Yayın Evi Ekleniz"
          onChange={this.onChange4.bind(this)}
        />
        <br />
        <input type="button" className="btn btn-outline-success" value="Yayın Evini Kaydet" onClick={this.yayinEviKaydet} />
        <hr />
        <br />
 */ }

          {/*
       <button className="btn btn-outline-success" onClick={this.on2}>Kaydet</button>
          <FileUpload onUpload={this.handleUpload} />*/

          }

        </div>
      </div>
    )
  }
}

export default MessageBox
