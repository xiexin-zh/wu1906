import React, { Component } from 'react';
import styels from './index.scss';
import UserAvatar from '../../UserAvatar';

class SendMessage extends Component {
  openSend = (event) => {};

  render() {
    const { id, msg_text } = this.props;
    return (
      <div className={styels.sendmge}>
        <div className={styels.message_img}>
          <UserAvatar size={42} userId={id} />
        </div>
        <span onClick={this.openSend} className={styels.text}>
          {msg_text}
        </span>
      </div>
    );
  }
}

export default SendMessage;
