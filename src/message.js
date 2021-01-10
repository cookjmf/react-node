import React from 'react';

class Message extends React.Component {

  constructor(props) {
    
    super(props);
    console.log('Message : enter : constructor');
    this.state = {
    };
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
            onClick={() => this.props.onClick()}
            >
            Close
          </a>
        </div>
      );
    }
  }
}

export default Message;
