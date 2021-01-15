import React from 'react';

class Message extends React.Component {

  constructor(props) {
    
    super(props);
    console.log('Message : enter : constructor');
    this.state = {
    };
  }

  renderWithConfirm(msgText, msgCls, confirmText) {
    
    const style1 = {
      'textDecoration': 'underline'
    };

    return (
      <div id="cw-message-cont" className="cw-cont"> 
        <span className={msgCls} id='cw-message-text'>
          {msgText}
        </span>
        <span className={msgCls} id='cw-message-text'>
          |
        </span>
        <a className={msgCls} id='cw-message-confirm' 
          style={style1} href='#confirmmessage'
          onClick={() => this.props.onClickMessageConfirm( {confirmText} )}
          >
          {confirmText}
        </a>
        <span className={msgCls} id='cw-message-text'>
          |
        </span>
        <a className={msgCls} id='cw-message-close' 
          style={style1} href='#closemessage'
          onClick={() => this.props.onClickMessageClose()}
          >
          Close
        </a>
      </div>
    );

  }

  renderSimple(msgText, msgCls) {
    
    const style1 = {
      'textDecoration': 'underline'
    };

    return (
      <div id="cw-message-cont" className="cw-cont"> 
        <span className={msgCls} id='cw-message-text'>
          {msgText}
        </span>
        <span className={msgCls} id='cw-message-text'>
          |
        </span>
        <a className={msgCls} id='cw-message-close' 
          style={style1} href='#closemessage'
          onClick={() => this.props.onClickMessageClose()}
          >
          Close
        </a>
      </div>
    );
  }

  render() {
    console.log('Message : enter : render');
    console.log('Message : render : props : '+JSON.stringify(this.props));

    let msg = this.props.msg;

    if (msg == null) {
      return (
        <div id="cw-message-cont" className="cw-cont"> 
        </div>
      );
    } else {

      let msgText = this.props.msg.text;
      let msgCls = this.props.msg.cls;

      if (msg.confirmText != null && msg.confirmText.length > 0) {
        let confirmText = this.props.msg.confirmText;
        
        return this.renderWithConfirm(msgText, msgCls, confirmText);
        
      } else {
        return this.renderSimple(msgText, msgCls);
      }
    }
  }
}

export default Message;
