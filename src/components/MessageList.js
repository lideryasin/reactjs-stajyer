import React, { Component } from 'react';
import _ from 'lodash';
import firebase from 'firebase';
import {
  Accordion,
  AccordionItem,
  AccordionItemTitle,
  AccordionItemBody,
} from 'react-accessible-accordion';
import 'react-accessible-accordion/dist/fancy-example.css';
import Message from './Message';
import './search.css';
import trim from 'trim';
import './MessageBox.css';

function searchingFor(term) {
  String.prototype.turkishToLower = function () {
    var string = this;
    var letters = { "İ": "i", "I": "ı", "Ş": "ş", "Ğ": "ğ", "Ü": "ü", "Ö": "ö", "Ç": "ç" };
    string = string.replace(/(([İIŞĞÜÇÖ]))/g, function (letter) { return letters[letter]; })
    return string.toLowerCase();
  }
  return function (x) {
    return x.adSoyad.turkishToLower().includes(term.turkishToLower()) || !term;
  }
}

class MessageList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      term: '',
      list: [],
      adsoyadkitapKimde: [],
      editing: false,
      adSoyad: '',
      message: '',
      yazarAdi: '',
      kitapKimde: '',
      yayinEvi: ''
    };
    this.searchHandler = this.searchHandler.bind(this);
    this.sil = this.sil.bind(this);
    this.edit = this.edit.bind(this);
    this.save = this.save.bind(this);
    this.messageonChange = this.messageonChange.bind(this);
    this.kitapKimdeonChange = this.kitapKimdeonChange.bind(this);
    this.yazarAdionChange = this.yazarAdionChange.bind(this);
    this.adSoyadonChange = this.adSoyadonChange.bind(this);
    this.yayinEvionChange = this.yayinEvionChange.bind(this)

  }

  getInitialState() {
    return { editing: false }
  }

  componentDidMount() {
    let app = firebase.database().ref('Stajyer');
    app.on('value', snapshot => {
      this.getData(snapshot.val());
    });

  }
  componentWillUnmount() {
    firebase.database().ref('Stajyer').off('value');
  }

  searchHandler(event) {
    this.setState({ term: event.target.value })
  }

  getData(values) {
    let messagesVal = values;
    let list = _(messagesVal)
      .keys()
      .map(messageKey => {
        let cloned = _.clone(messagesVal[messageKey]);
        cloned.key = messageKey;
        return cloned;
      })
      .value();
    list = list.reverse().sort((a, b) => Intl.Collator("tr").compare(b.adSoyad, a.adSoyad));
    this.setState({
      list: list.reverse()
    });
  }


  sil(a) {
    firebase.database().ref("Stajyer").child(a).remove();
  }

  edit() {
    this.setState({ editing: true })
  }
  save(a) {
    this.setState({ editing: false })

    firebase.database().ref("messages").child(a).update({
      adSoyad: trim(this.state.adSoyad),
      message: trim(this.state.message),
      yazarAdi: trim(this.state.yazarAdi),
      kitapKimde: trim(this.state.kitapKimde),
      yayinEvi: trim(this.state.yayinEvi),
    })
  }

  messageonChange(e) {
    this.setState({
      message: e.target.value
    });
  }
  yazarAdionChange(e) {
    this.setState({
      yazarAdi: e.target.value
    });
  }
  adSoyadonChange(e) {
    this.setState({
      adSoyad: e.target.value
    });
  }
  yayinEvionChange(e) {
    this.setState({
      yayinEvi: e.target.value
    });
  }
  kitapKimdeonChange(e) {
    this.setState({
      kitapKimde: e.target.value
    });
  }

  renderEdit() {
    const { term, messages } = this.state;
    let messageNodes = messages.filter(searchingFor(term)).map((message) => {
      return (
        <AccordionItem key={message.key} expanded={this.state.activeBookKey === message.key}>
          <div className="card">
            <div className="card-content">
              <div className="panel-group">
                <div className="panel panel-default">
                  <AccordionItemTitle>
                    <a onClick={() => this.setState({ activeBookKey: message.key })} >
                      <img src={message.image} style={{ width: "50px", height: "50px" }} /> <br />
                      {message.message} <div style={{ float: 'right' }}>{message.saat}</div>
                    </a>

                  </AccordionItemTitle>
                  <AccordionItemBody className="panel-heading" data-trigger={message.message} >
                    <ul className="list-group">
                      <input type="text" placeholder={message.message}
                        onChange={this.messageonChange}
                      />
                      <input type="text" placeholder={message.yazarAdi}
                        onChange={this.yazarAdionChange}
                      />
                      <input type="text" placeholder={message.yayinEvi}
                        onChange={this.yayinEvionChange}
                      />
                      <input type="text" placeholder={message.kitapKimde}
                        onChange={this.kitapKimdeonChange}
                      />
                      <input type="text" placeholder={message.adSoyad}
                        onChange={this.adSoyadonChange}
                      />


                    </ul>
                    <button key={message.key} className="btn btn-outline-success" onClick={() => this.save(message.key)}>Save</button>
                  </AccordionItemBody>
                </div>
              </div>
            </div>
          </div>
        </AccordionItem>
      )
    });
    return (
      <div>
        <div>
          <form>
            <input type="text" className="form-control mr-sm-2 search" placeholder="Search" aria-label="Search" onChange={this.searchHandler} />
          </form>
          <Accordion accordion>
            {messageNodes}
          </Accordion>
          <ul>
            {
              this.state.messages.map(message => <li key={message.key}>{message.text}</li>)
            }
          </ul>
        </div>
      </div>
    );
  }


  renderNormal() {
    const { term, list } = this.state;
    let messageNodes = list.filter(searchingFor(term)).map((message) => {
      return (
        <AccordionItem key={message.key} expanded={this.state.activeBookKey === message.key}>
          <div className="card">
            <div className="card-content">
              <div className="panel-group">
                <div className="panel panel-default">
                  <AccordionItemTitle>
                    <a onClick={() => this.setState({ activeBookKey: message.key })} >
                      <img src={message.image} style={{ width: "250px", height: "250px" }} /> <br />
                      <div style={{ fontWeight: Blob, fontSize: 24, color: 'green' }}>{message.adSoyad}</div>  <div style={{ float: 'right' }}>{message.saat}</div>
                    </a>

                    <button key={message.key} type="button" className="close" aria-label="Close"
                      onClick={() => this.sil(message.key)}
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>

                  </AccordionItemTitle>
                  <AccordionItemBody className="panel-heading" data-trigger={message.adSoyad} >
                    <ul className="list-group">
                      <li key={message.key} className="list-group-item">Okul : <Message message={message.okul} /></li>
                      <li className="list-group-item">Mail : <Message message={message.mail} /></li>
                      <li className="list-group-item">Telefon : <Message message={message.telefon} /></li>
                      <li className="list-group-item">Adres : <Message message={message.adres} /></li>
                      <li className="list-group-item">Bildiği Programlama Dilleri : <Message message={message.bildigi} /></li>
                      <li className="list-group-item">Kulandığı Programlama Araçları : <Message message={message.program} /></li>
                      <li className="list-group-item">Staj Yeri : <Message message={message.staj} /></li>
                      <li className="list-group-item">Staj Başlangıç Tarihi : <Message message={message.stajStart} /></li>
                      <li className="list-group-item">Staj Bitiş Tarihi : <Message message={message.stajStop} /></li>
                      <li className="list-group-item">Hedef : <Message message={message.hedef} /></li>
                    </ul>
                    { /*<button key={message.key} className="btn btn-outline-success" onClick={() => this.edit(message.key)}>Edit</button>*/}
                  </AccordionItemBody>
                </div>
              </div>
            </div>
          </div>
        </AccordionItem>
      )
    });
    return (
      <div>
        <div>
          <form>
            <input type="text" className="form-control mr-sm-2 search" placeholder="Search" aria-label="Search" onChange={this.searchHandler} />
          </form>
          <Accordion accordion>
            {messageNodes}
          </Accordion>
          <ul>
            {
              this.state.list.map(message => <li key={message.key}>{message.text}</li>)
            }
          </ul>
        </div>
      </div>
    );
  }

  render() {
    if (this.state.editing) {
      return this.renderEdit();
    }
    else {
      return this.renderNormal();
    }
  }

  cek() {
    return (
      <div>
        <input type="text"
          className="form-control mr-sm-2 search" aria-label="Search"
          placeholder="Ad Soyad"
          list="datalist1"
        />
        <div>
          <datalist id="datalist1">
            {this.state.messages.map(fbb =>
              <option key={fbb.key} value={fbb.adSoyad}>{fbb.adSoyad}</option>
            )};
          </datalist>
        </div>
      </div>
    )
  }
}
export default MessageList;