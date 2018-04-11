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
    return x.message.turkishToLower().includes(term.turkishToLower()) || !term + x.yayinEvi.toLowerCase().includes(term.toLowerCase()) || !term + x.yazarAdi.toLowerCase().includes(term.toLowerCase()) || !term + x.kitapKimde.toLowerCase().includes(term.toLowerCase()) || !term;
  }
}

class MessageList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      term: '',
      messages: [],
      adsoyadkitapKimde: [],
    };
    this.searchHandler = this.searchHandler.bind(this);
  }

  yasinChange(event) {
    this.setState({ yasin: event.target.value });
  }

  componentDidMount() {
    let app = firebase.database().ref('messages');
    app.on('value', snapshot => {
      this.getData(snapshot.val());
    });
  }
  componentWillUnmount() {
    firebase.database().ref('messages').off('value');
  }

  searchHandler(event) {
    this.setState({ term: event.target.value })
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
    messages = messages.reverse().sort((a, b) => Intl.Collator("tr").compare(b.message, a.message));
    this.setState({
      messages: messages.reverse()
    });
  }

  adListGetData(values) {
    let messagesVal = values;
    let adsoyadkitapKimde = _(messagesVal)
      .keys()
      .map(messageKey => {
        let cloned = _.clone(messagesVal[messageKey]);
        cloned.key = messageKey;
        return cloned;
      })
      .value();
    adsoyadkitapKimde = adsoyadkitapKimde.reverse().sort((a, b) => Intl.Collator("tr").compare(b.message, a.message));
    this.setState({
      adsoyadkitapKimde: adsoyadkitapKimde.reverse()
    });
  }

  render() {
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
                      Kitap Adı: {message.message} <div style={{ float: 'right' }}>{message.saat}</div>
                    </a>
                  </AccordionItemTitle>
                  <AccordionItemBody className="panel-heading" data-trigger={message.message} >
                    <ul className="list-group">
                      <li key={message.key} className="list-group-item">Yazarın Adı: <Message message={message.yazarAdi} /></li>
                      <li className="list-group-item">Yayın Evi: <Message message={message.yayinEvi} /></li>
                      <li className="list-group-item">Kitap Kimde: <Message message={message.kitapKimde} /></li>
                      <li className="list-group-item">Ad Soyad: <Message message={message.adSoyad} /></li>
                    </ul>
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