import React, { Component } from 'react';

class Message extends Component {

  render() {
    return (
      <div>
        {this.props.adSoyad}
        {this.props.message}
        {this.props.yazarAdi}
        {this.props.kitapKimde}
        {this.props.yayineviEkle}
        {this.props.yayinEvi}
        {this.props.image}
      </div>
    )
  }
}
export default Message;
