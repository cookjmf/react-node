import React from 'react';
import * as Util from './util';

class NewName extends React.Component {

  constructor(props) {
    
    super(props);
    console.log('NewName : constructor : enter');
    this.state = {};
  }

  componentDidMount() {
    console.log('NewName : componentDidMount : enter');
  }

  componentDidUpdate() {
    console.log('NewName : componentDidUpdate : enter');
  }
  
  render() {
    console.log('NewName : render : enter');

    return (
      <input
      name="cwnewname" 
      id="cwnewname" 
      className="cw-init-input" 
      placeholder={Util.NAME_PLACEHOLDER}
      onChange={(ev) => this.props.onChange(ev.target.value)}
      >
      </input>
    );
    
  }

}

export default NewName;
