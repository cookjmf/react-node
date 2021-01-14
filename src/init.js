import React from 'react';
import Action from './action';
import NewName from './newname';
import Name from './name';
import Size from './size';
import * as Util from './util';

class Init extends React.Component {

  constructor(props) {
    
    super(props);
    console.log('Init : constructor : enter');
    this.state = {};
  }

  componentDidMount() {
    console.log('Init : componentDidMount : enter');
  }

  componentDidUpdate() {
    console.log('Init : componentDidUpdate : enter');
  }

  renderCreate() {
    console.log('Init : renderCreate : enter');

    return (
      <div id="cw-init-cont" className="cw-cont"> 
        <Action                
          selected= { this.props.selectedAction }  
          onChange={ this.props.onChangeAction }
        />
        <NewName       
          onChange={ this.props.onChangeNewName }
        />
        <Size    
          selected={ this.props.selectedSize }   
          onChange={ this.props.onChangeSize }
        />
      </div>
    )
  }

  renderDelete() {
    console.log('Init : renderDelete : enter');

    return (
      <div id="cw-init-cont" className="cw-cont"> 
        <Action   
          selected= { this.props.selectedAction }  
          existingNames={ this.props.existingNames}               
          onChange={ this.props.onChangeAction }
        />
        <Name    
          existingNames={ this.props.existingNames}   
          onChange={ this.props.onChangeName }
        />
      </div>
    );
  }

  renderInit() {
    console.log('Init : renderInit : enter');

    return (
      <div id="cw-init-cont" className="cw-cont"> 
        <Action       
          selected={ this.props.selectedAction}
          existingNames={ this.props.existingNames}
          onChange={ this.props.onChangeAction }
        />
      </div>
    );
  }

  render() {
    console.log('Init : render : enter');
    console.log('Init : render : props : '+JSON.stringify(this.props));

    let action = this.props.action;
    let name = '';
    if (this.props.name != null) {
      name = this.props.name;
    }
    
    if (action === Util.ACTION_CREATE) {
      return this.renderCreate();
    } else if (action === Util.ACTION_DELETE) {
      if (name === '') {
        return this.renderDelete();
      } else {
        return this.renderInit();
      }
    } else {
      return this.renderInit();
    }
    
    
  }
}

export default Init;
