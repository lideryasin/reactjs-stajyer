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
import ZoomableImage from 'react-zoomable-image';

import Message from './Message';
import './search.css';

function searchingFor(term) {
  return function (x) {
    return x.message.toLowerCase().includes(term.toLowerCase()) || !term + x.yayinEvi.toLowerCase().includes(term.toLowerCase()) || !term + x.yazarAdi.toLowerCase().includes(term.toLowerCase()) || !term + x.kitapKimde.toLowerCase().includes(term.toLowerCase()) || !term;
  }
}

class MessageList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      term: '',
      messages: []
    };
    this.searchHandler = this.searchHandler.bind(this);
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
    this.setState({
      messages
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
                    <a onClick={() => this.setState({ activeBookKey: message.key })}>
                      <img src={message.image} style={{ width: "50px", height: "50px" }} /> <br />
                      {/* <ZoomableImage
                        baseImage={{
                          alt: 'An image',
                          src: message.image,
                          width: 100,
                          height: 100
                        }}
                        largeImage={{
                          alt: 'A large image',
                          src: message.image,
                          width: 350,
                          height: 350
                        }}
                        thumbnailImage={{
                          alt: 'A small image',
                          src: message.image
                        }}
                      /> */}
                      {message.message}
                    </a>
                  </AccordionItemTitle>
                  <AccordionItemBody className="panel-heading" data-trigger={message.message} >
                    <ul className="list-group">
                      <li className="list-group-item"><Message message={message.yayinEvi} /></li>
                      <li className="list-group-item"><Message message={message.yazarAdi} /></li>
                      <li className="list-group-item"><Message message={message.kitapKimde} /></li>
                      <li className="list-group-item"><Message message={message.adSoyad} /></li>
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
        <form>
          <input type="text" className="form-control mr-sm-2 search" placeholder="Search" aria-label="Search" onChange={this.searchHandler} />
        </form>
        <Accordion accordion>
          {messageNodes}
        </Accordion>

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


//<img  width="30px" height="30px" src={message.image}/> 