import React from 'react';
import Init from './init';
import Message from './message';
import Param from './param';

import Cell from './cell';
import Cword from './cword';
import MsgMgr from './msgMgr';

import * as Util from './util';
// import Msg from './msg';

// version 210115_0821

class Game extends React.Component {
  constructor(props) {   
    super(props);
    console.log('Game : constructor : enter');

    // enables a child to call onChangeXXXX with the selected value

    // init
    this.onChangeAction = this.onChangeAction.bind(this);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeNewName = this.onChangeNewName.bind(this);
    this.onChangeSize = this.onChangeSize.bind(this);
    // message
    this.onClickMessageClose = this.onClickMessageClose.bind(this);
    this.onClickMessageConfirm = this.onClickMessageConfirm.bind(this);
    // param
    this.onClickParamCell = this.onClickParamCell.bind(this);
    this.onKeyUpParamAcrossTextarea = this.onKeyUpParamAcrossTextarea.bind(this);
    this.onKeyUpParamDownTextarea = this.onKeyUpParamDownTextarea.bind(this);
    // play

    // message manager
    this.msgMgr = new MsgMgr();

    // state
    this.state = {
      updateTimestamp: '',
      existingNames: null,
      action: '',
      msg: null,
      cword: null,
    };
  }

  componentDidMount() {
    console.log('Game : componentDidMount : enter');
    this.storeGetNames();
  }

  componentDidUpdate() {
    console.log('Game : componentDidUpdate : enter');
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log('Game : shouldComponentUpdate : enter');
    let res = false;
    console.log('Game : shouldComponentUpdate : this.state.updateTimestamp : ...'+this.state.updateTimestamp+'...');
    console.log('Game : shouldComponentUpdate : nextState.updateTimestamp : ....'+nextState.updateTimestamp+'...');
    if (this.state.updateTimestamp !== nextState.updateTimestamp) {
      res = true;
      console.log('Game : shouldComponentUpdate : new value for state.updateTimestamp so will render');
    } else {
      console.log('Game : shouldComponentUpdate : SAME value for state.updateTimestamp so will NOT render');
    }
    return res;
  }

  // on methods
  // CAN CHANGE STATE

  onChangeAction(newAction) {

    console.log('Game : START : -------------------------------------------->');
    console.log('Game : START : onChangeAction ----> '+newAction+' --------->');
    console.log('Game : START : -------------------------------------------->');

    // set state and updateTimestamp since render needed
    this.setState({ action: newAction, updateTimestamp: Util.newDate() });    
  }
  
  onChangeName(newName) {

    console.log('Game : START : -------------------------------------------->');
    console.log('Game : START : onChangeName ----> '+newName+' --------->');
    console.log('Game : START : -------------------------------------------->');

    console.log('Game : onChangeName : enter : newName : ...'+newName+'...');
    //   
    let action = this.state.action;
    if (action === Util.ACTION_DELETE) {
      let cword = new Cword();
      cword.name = newName;

      this.storeDelete(cword);

    } else {
      // other actions here

    }

  }

  onChangeNewName(newName) {

    console.log('Game : START : -------------------------------------------->');
    console.log('Game : START : onChangeNewName ----> '+newName+' --------->');
    console.log('Game : START : -------------------------------------------->');

    let action = this.state.action;
    if (action === Util.ACTION_CREATE) {
      let cword = new Cword();
      cword.name = newName;
      this.setState({ cword: cword }); 
      if (Util.isExample(newName)) {
        this.setupNew(cword);
      } 
    } else {
      console.log("logic error : in onChangeNewName but action is not CREATE");
    }
  }

  onChangeSize(newSize) {

    console.log('Game : START : -------------------------------------------->');
    console.log('Game : START : onChangeSize ----> '+newSize+' --------->');
    console.log('Game : START : -------------------------------------------->');  

    let cword = this.state.cword;
    cword.init(newSize);

    let action = this.state.action;
    if (action === Util.ACTION_CREATE) {

      this.setupNew(cword);

    } else {
      console.log("logic error : in onChangeSize but action is not CREATE");
    }
  }

  onClickMessageClose() {
    console.log('Game : START : -------------------------------------------->');
    console.log('Game : START : onClickMessageClose ------------------------>');
    console.log('Game : START : -------------------------------------------->');  

    this.msgMgr.clear(); 

    let cword = this.state.cword;
    let name = cword.name;
    let action = this.state.action;
    let existingNames = this.state.existingNames;

    if (action === Util.ACTION_CREATE) {
      if (!Util.isValidName(name) || Util.isDuplicateName(existingNames, name)) {
        // force user to choose "Size" again
        this.setState( { 
          selectedAction: Util.ACTION_TITLE, 
          selectedSize: Util.SIZE_TITLE, 
          msg: null, 
          updateTimestamp: Util.newDate() } 
          );  
      } else {
        
        this.setState( { 
          msg: null, 
          updateTimestamp: Util.newDate() 
        });

      }
    } else if (action === Util.ACTION_DELETE) {

      this.storeGetNames();

    } else {

    }
  }

  onClickMessageConfirm(value) {
    console.log('Game : START : -------------------------------------------->');
    console.log('Game : START : onClickMessageConfirm -----> '+value+'------------------->');
    console.log('Game : START : -------------------------------------------->');  

  }

  onClickParamCell(id) {

    console.log('Game : START : -------------------------------------------->');
    console.log('Game : START : onClickParamCell ----> '+id+'------------->');
    console.log('Game : START : -------------------------------------------->');  

    let cwObj = this.state.cword;
    let cellMap = this.toggleParamCell(cwObj, id);
    cwObj.cellMap = cellMap;

    this.storeSave(cwObj);
  }

  onKeyUpParamAcrossTextarea(value) {
    console.log('Game : START : -------------------------------------------->');
    console.log('Game : START : onKeyUpParamAcrossTextarea ---->'+value+'------------->');
    console.log('Game : START : -------------------------------------------->');  

    let atext = Util.convertCluesRomanDash(value);
    atext = Util.convertCluesDash(atext);

    let cwObj = this.state.cword;
    cwObj.horizClues = atext;
    this.storeSave(cwObj);

  }

  onKeyUpParamDownTextarea(value) {
    console.log('Game : START : -------------------------------------------->');
    console.log('Game : START : onKeyUpParamDownTextarea ---->'+value+'------------->');
    console.log('Game : START : -------------------------------------------->');  

    let dtext = Util.convertCluesRomanDash(value);
    dtext = Util.convertCluesDash(dtext);

    let cwObj = this.state.cword;
    cwObj.horizClues = dtext;
    this.storeSave(cwObj);

  }

  // store methods
  // DO NOT CHANGE STATE HERE

  storeGet(name) {
    console.log('Game : storeGet : enter : name : '+name);
  
    fetch('/cwords/name/'+name)
    .then(
      response => {
        return response.json();
      }
    )
    .then(
      data => {
        console.log('Game : storeGet : fetch : data : ...'+JSON.stringify(data)+'...');
        let cwObj = JSON.parse(data.contents)
        this.resultGet(cwObj, true, name);
      }
    )
    .catch(
      err => {
        console.log('Game : storeGet : catch : err : ...'+JSON.stringify(err)+'...');
        this.resultGet(null, false, name);
      }
    ) 
  }
  
  storeDelete(cword) {
    let name = cword.name;
    console.log('Game : storeDelete : enter : name : '+name);
  
    fetch('/cwords/name/'+name, {
      method: 'DELETE',
    })
    .then(
      response => {
        return response.json();
      }
    )
    .then(
      data => {
        console.log('Game : storeDelete : fetch : data = ...'+JSON.stringify(data)+'...');
        this.resultDelete(true, cword);
      }
    )
    .catch(
      err => {
        console.log('Game : storeDelete : catch : err = ...'+JSON.stringify(err)+'...');
        this.resultDelete(false, cword);
      }
    ) 
  }

  storeSave(cwObj) {
    console.log('Game : storeSave : enter');
  
    // for play and update - assume the cword exists
    // for other cases, (new, new-example, import) check first

    let action = this.state.action;

    if (action === Util.ACTION_PLAY || action === Util.ACTION_UPDATE) {
      this.storeUpdate(cwObj);
    } else {
  
      fetch('/cwords')
      .then(
        response => {
          return response.json();
        }
      )
      .then(
        data => {
          console.log('Game : storeSave : fetch : data : ...'+JSON.stringify(data)+'...');
          let names = [];
          for (let i=0; i<data.length; i++) {
            let row = data[i];
            let name = row.name;
            names.push(name);
          }
          console.log('Game : storeSave : fetch : names = ...'+JSON.stringify(names)+'...');
          if (names.includes(cwObj.name)) {
            this.storeUpdate(cwObj);
          } else {
            this.storeInsert(cwObj);
          }
        }
      )
      .catch(
        err => {
          console.log('Game : storeSave : catch : err : ...'+JSON.stringify(err)+'...');
          this.resultSave(false);
        }
      ) 
    }  
  }

  storeInsert(cwObj) {
    console.log('Game : storeInsert : enter');
    let objectForStore = cwObj.getStorageObject();
    fetch('/cwords', {
      method: 'POST', 
      headers: {
       'Content-type': 'application/json; charset=UTF-8' 
      },
      body: JSON.stringify(objectForStore)  
     })
    .then(
      response => {
        return response.json();
      }
    )
    .then(
      data => {
        console.log('Game : storeInsert : fetch : data : ...'+JSON.stringify(data)+'...');
        this.resultInsert(cwObj, true);
      }
    )
    .catch(
      err => {
        console.log('Game : storeInsert : catch : err : ...'+JSON.stringify(err)+'...');
        this.resultInsert(cwObj, false);
      }
    )  
  }
  
  storeUpdate(cwObj) {
    console.log('Game : storeUpdate : enter');

    let objectForStore = cwObj.getStorageObject();
    fetch('/cwords/name/'+cwObj.name, {
      method: 'PUT', 
      headers: {
       'Content-type': 'application/json; charset=UTF-8' 
      },
      body: JSON.stringify(objectForStore)  
     })
    .then(
      response => {
        return response.json();
      }
    )
    .then(
      data => {
        console.log('Game : storeUpdate : fetch : data : ...'+JSON.stringify(data)+'...');
        this.resultUpdate(cwObj, true);
      }
    )
    .catch(
      err => {
        console.log('Game : storeUpdate : catch : err = ...'+JSON.stringify(err)+'...');
        this.resultUpdate(cwObj, false);
      }
    )  
  }
  
  storeGetNames() {
    console.log('Game : storeGetNames : enter');
    fetch('/cwords')
      .then(
        response => {
          return response.json();
        }
      )
      .then(
        data => {
          console.log('Game : storeGetNames : fetch : data : ...'+JSON.stringify(data)+'...');
  
          let names = [];
          for (let i=0; i<data.length; i++) {
            let row = data[i];
            let name = row.name;
            names.push(name);
          }
          this.resultGetNames(true, names);
          
        }
      )
      .catch(
        err => {
          console.log('Game : storeGetNames : catch : err : ...'+JSON.stringify(err)+'...');
          this.msgMgr.addError('Get crossword names failed');

          this.resultGetNames(false, []);

        }
      )
  }

  // result methods, called:
  // - after store methods 
  // - ??? after build grid/clues methods ???
  // - set the updateTimestamp here, which forces re-render
  // CAN CHANGE STATE  

  resultGetNames(ok, names) {
    console.log('Game : resultGetNames : enter');
    if (!ok) {
      this.msgMgr.addError('Failed to get names.');
    } 

    let msg = this.msgMgr.getMsg();
    this.setState( { existingNames: names, 
      cword: null, action: '', 
      msg: msg , updateTimestamp: Util.newDate()} );

  }

  resultSave(ok) {
    console.log('Game : resultSave : enter');
    let action = this.state.action;
    if (action === Util.ACTION_IMPORT) {
      // resultSaveImport(ok);
    } else if (action === Util.ACTION_PLAY) {
      // resultSavePlay(ok);
    } else if (action === Util.ACTION_CREATE) {
      this.resultCreateSave(ok);
    } else if (action === Util.ACTION_UPDATE) {
      // resultSaveUpdate(ok);
    }
  }

  resultUpdate(cwObj, ok) {
    console.log('Game : resultUpdate : enter');
    let action = this.state.action;
    if (action === Util.ACTION_IMPORT) {
      // resultSaveImport(ok);
    } else if (action === Util.ACTION_PLAY) {
      // resultSavePlay(ok);
    } else if (action === Util.ACTION_CREATE) {
      this.resultCreateUpdate(cwObj, ok);
    } else if (action === Util.ACTION_UPDATE) {
      // resultSaveUpdate(ok);
    }
  }

  resultInsert(cwObj, ok) {
    console.log('Game : resultInsert : enter');
    let action = this.state.action;
    if (action === Util.ACTION_IMPORT) {
      // resultSaveImport(ok);
    } else if (action === Util.ACTION_PLAY) {
      // resultSavePlay(ok);
    } else if (action === Util.ACTION_CREATE) {
      this.resultCreateInsert(cwObj, ok);
    } else if (action === Util.ACTION_UPDATE) {
      // resultSaveUpdate(ok);
    }
  }

  resultCreateUpdate(cwObj, ok) {
    console.log('Game : resultCreateUpdate : enter');
    let name = cwObj.name;
    if (!ok) {
      this.msgMgr.addError('Failed to save.');
    } else {
      this.msgMgr.addConfirmInfo( 'Updated : '+name+' at '+Util.date1(), "Validate" );
    }
    let msg = this.msgMgr.getMsg();
    this.setState( {
      msg: msg , cword: cwObj, updateTimestamp: Util.newDate()
    } );
  }

  resultCreateInsert(cwObj, ok) {
    console.log('Game : resultCreateInsert : enter');
    let name = cwObj.name;
    if (!ok) {
      this.msgMgr.addError('Failed to save.');
    } else {
      if (Util.isExample(this.state.name)) {
        this.msgMgr.addInfo('Created example : '+name+'.');
      } else {
        this.msgMgr.addInfo('Created : '+name+', now set blanks and clues');       
      } 
    }
    let msg = this.msgMgr.getMsg();
    this.setState( {
      msg: msg , cword: cwObj, updateTimestamp: Util.newDate()
    } );
  }

  resultCreateSave(cwObj, ok) {
    console.log('Game : resultCreateSave : enter');
    if (!ok) {
      this.msgMgr.addError('Failed to save.');
    } else {
      // should not happen
    }
    let msg = this.msgMgr.getMsg();
    this.setState( {
      msg: msg , cword: cwObj, updateTimestamp: Util.newDate()
    } );
  }

  // note: not used yet
  resultGet(cwObj, ok, name) {
    console.log('Game : resultGet : enter');
    if (!ok) {
      this.msgMgr.addError('Failed to get crossword : '+name);
      let msg = this.msgMgr.getMsg();
      this.setState( {
        msg: msg , updateTimestamp: Util.newDate()
      } );

    } else {
      let cword = new Cword();

      cword.setupCwordFromStorageObject(cwObj);
      // // let maxAcross = 1 * cwObj.maxAcross;
      // // console.log('maxAcross : ['+maxAcross+']');
      // // let maxDown = 1 * cwObj.maxDown;
      // // console.log('maxDown : ['+maxDown+']');

      // let size = Util.size(cwObj.maxAcross, cwObj.maxDown);

      // let blanks = cwObj.blanks;
      // console.log('blanks : ['+blanks+']');
      // let horizClues = cwObj.horizClues;
      // horizClues = Util.removeNewLines(horizClues); 
      // console.log('horizClues : ['+horizClues+']');
      // let vertClues = cwObj.vertClues;
      // vertClues = Util.removeNewLines(vertClues); 
      // console.log('vertClues : ['+vertClues+']');  
      // let cellValues = cwObj.cellValues;
      // console.log('cellValues : ['+cellValues+']'); 
      // this.setState( { name: name, maxAcross: maxAcross, maxDown: maxDown, blanks: blanks,
      // horizClues: horizClues, vertClues: vertClues, cellValues: cellValues} );

      this.setState( { 
        // name: name, size: size, blanks: blanks,
        // horizClues: horizClues, vertClues: vertClues, cellValues: cellValues,
        cword: cword,
        updateTimestamp: Util.newDate()} );
  
    }
  }

  resultDelete(deletedOK, cword) {
    console.log('Game : resultDelete : enter');
    let name = cword.name;
    if (!deletedOK) {
      this.msgMgr.addError('Failed to delete crossword : '+name);
    } else {
      this.msgMgr.addInfo('Deleted crossword : '+name);
    }
    let msg = this.msgMgr.getMsg();
    // set state since new render needed
    this.setState( {msg : msg, cword: cword, updateTimestamp: Util.newDate()} );
  }

  // render methods
  // NEVER CHANGE STATE HERE
 
  renderCreate() {
    // chose create, show name, size
    console.log('Game : renderCreate : enter');
    console.log('Game : renderCreate : state : '+JSON.stringify(this.state));
    return (
      <div className="game">   
        <Init 
          action={ this.state.action}
          selectedAction={Util.ACTION_CREATE}         
          selectedName={Util.NAME_TITLE}       
          selectedSize={ Util.SIZE_TITLE }
          onChangeAction={ this.onChangeAction }
          onChangeName={ this.onChangeName }
          onChangeNewName={ this.onChangeNewName }
          onChangeSize={ this.onChangeSize }
        /> 
        <Message         
          msg={ this.state.msg }
          onClickMessageClose={ this.onClickMessageClose }
        />       
      </div>
    );
  }

  renderCreateWithName() {
    // chose create, entered name, get size
    console.log('Game : renderCreateWithName : enter');
    console.log('Game : renderCreateWithName : state : '+JSON.stringify(this.state));

    let cword = this.state.cword;

    return (
      <div className="game">   
        <Init 
          action={ this.state.action}
          selectedAction={Util.ACTION_CREATE}
          name={ cword.name}
          selectedName={this.state.name}
          size={ cword.size}
          selectedSize={ Util.SIZE_TITLE }
          onChangeAction={ this.onChangeAction }
          onChangeName={ this.onChangeName }
          onChangeNewName={ this.onChangeNewName }
          onChangeSize={ this.onChangeSize }
        /> 
        <Message         
          msg={ this.state.msg }
          onClickMessageClose={ this.onClickMessageClose }
        />       
      </div>
    );
  }

  renderMessage() {
    console.log('Game : renderMessage : enter');
    console.log('Game : renderMessage : state : '+JSON.stringify(this.state));
    return (
      <div className="game"> 
        <Message         
          msg={ this.state.msg }
          onClickMessageClose={ this.onClickMessageClose }
        />
      </div>
    );
  }

  renderSetupNew() {
    // chose create, entered name, chose size
    console.log('Game : renderSetupNew : enter');
    console.log('Game : renderSetupNew : state : '+JSON.stringify(this.state));

    let cword = this.state.cword;
    let cells = {};
    let cellMap = cword.cellMap;
    if (cellMap != null && cellMap.size > 0) {
      cells = Util.mapToObject(cellMap);
    }

    console.log('Game : renderSetupNew : cells : '+JSON.stringify(cells));

    return (
      <div className="game"> 
        <Init 
          action=''
          selectedAction={ Util.ACTION_TITLE }
          selectedSize={ cword.size }
          existingNames={ this.state.existingNames }
          onChangeAction={ this.onChangeAction }
        />
        <Message         
          msg={ this.state.msg }
          onClickMessageClose={ this.onClickMessageClose }
          onClickMessageConfirm={ this.onClickMessageConfirm }
        /> 
        <Param
          name={ cword.name}
          size={ cword.size}
          cells={ cells }
          horizClues={ cword.horizClues }
          vertClues={ cword.vertClues }
          onClickParamCell={ this.onClickParamCell }
          onKeyUpParamAcrossTextarea={ this.onKeyUpParamAcrossTextarea }
          onKeyUpParamDownTextarea={ this.onKeyUpParamDownTextarea }
        />
      </div>
    );
  }

  renderSetupNewExample() {
    // chose create, entered example name, chose size
    console.log('Game : renderSetupNewExample : enter');
    console.log('Game : renderSetupNewExample : state : '+JSON.stringify(this.state));

    return (
      <div className="game">   
        <Init 
          action=''
          selectedAction={ Util.ACTION_TITLE }
          existingNames={ this.state.existingNames }
          onChangeAction={ this.onChangeAction }
        />   
        <Message         
          msg={ this.state.msg }
          onClickMessageClose={ this.onClickMessageClose }
        />    
      </div>
    );
  }

  renderDelete() {
    // chose delete
    console.log('Game : renderDelete : enter');
    console.log('Game : renderDelete : state : '+JSON.stringify(this.state));

    return (
      <div className="game"> 
        <Init 
          action={ this.state.action}
          selectedAction={Util.ACTION_DELETE}
          existingNames={ this.state.existingNames }
          onChangeName={ this.onChangeName }
        /> 
        <Message         
          msg={ this.state.msg }
          onClickMessageClose={ this.onClickMessageClose }
        />   
      </div>
    );
  }

  renderDeleteMessage() {
    // chose delete
    console.log('Game : renderDeleteMessage : enter');
    console.log('Game : renderDeleteMessage : state : '+JSON.stringify(this.state));

    let name = '';
    if (this.state.cword != null) {
      name = this.state.cword.name;
    }

    return (
      <div className="game"> 
        <Init 
          action={ this.state.action}
          selectedAction={Util.ACTION_TITLE}
          name={ name}
          existingNames={ this.state.existingNames }
          onChangeName={ this.onChangeName }
          onChangeAction={ this.onChangeAction }
        /> 
        <Message         
          msg={ this.state.msg }
          onClickMessageClose={ this.onClickMessageClose }
        />   
      </div>
    );
  }

  renderInit() {
    console.log('Game : renderInit : enter');
    console.log('Game : renderInit : state : '+JSON.stringify(this.state));
    return (
      <div className="game">   
        <Init 
          existingNames={ this.state.existingNames }
          onChangeAction={ this.onChangeAction }
        />         
      </div>
    );
  }

  render() {
    
    console.log('Game : render : enter');
    console.log('Game : render : state : '+JSON.stringify(this.state));
    let action = this.state.action;

    let name = '';
    let size = '';
    let cword = this.state.cword;
    if (cword != null) {
      name = cword.name;
      size = cword.size;
    }

    if (action === Util.ACTION_CREATE) {
      if (name === '') {
        // name + size to be chosen
        return this.renderCreate();
      } else {
        if (Util.isExample(name)) {
          // example name has been chosen, cword saved, show message
          return this.renderSetupNewExample();
        } else {
          if (size === '') {
            // name has been chosen, size to be chosen
            return this.renderCreateWithName();
          } else {
            // name, size has been chosen, cword saved, show message and params
            return this.renderSetupNew();
          }
        }
      }
    // } else if (this.state.action === Util.ACTION_PLAY) {

    // } else if (this.state.action === Util.ACTION_UPDATE) {

    // } else if (this.state.action === Util.ACTION_EXPORT) {

    // } else if (this.state.action === Util.ACTION_IMPORT) {

    } else if (action === Util.ACTION_DELETE) {
      if (name === '') {
        return this.renderDelete();
      } else {
        return this.renderDeleteMessage() 
      }
    } else if (this.state.action === Util.ACTION_CLEAR) {
      return this.renderInit();   
    } else {
      return this.renderInit();        
    }   
    
  }

  // util methods
  // NEVER CHANGE STATE HERE
  // only read state then either:
  //  - return values
  //  - call other methods

  toggleParamCell(cword, id) {
    console.log('Game : toggleParamCell : enter : id : '+id);

    // get the current state of cells
    let cellMap = cword.cellMap;

    // toggle the cell in cellMap : key is y.x

    if (!cellMap.has(id)) {
      // its a blank so make not a blank
      let y = Util.row(id);
      let x = Util.column(id);
      let cell = new Cell(y, x);
      cellMap.set(id, cell);
    } else {
      // its not a blank so make a blank 
      cellMap.delete(id);
    }

    return cellMap;
  }

  setupNew(cword) {
    console.log('Game : setupNew : enter');
    let name = cword.name;

    let existingNames = this.state.existingNames;
    
    if (!Util.isValidName(name)) {
      this.msgMgr.addError('Invalid name');
      this.setState({ 
        msg : this.msgMgr.getMsg() , updateTimestamp: Util.newDate()
      });

    } else if (Util.isDuplicateName(existingNames, name)) {
      this.msgMgr.addError('Duplicate name');
      this.setState({ 
        msg : this.msgMgr.getMsg() , updateTimestamp: Util.newDate()
      });
    } else {

      let cwObj = Util.EXAMPLE_MAP.get(name);
      if (cwObj != null) {    
        console.log('Game : setupNew : example case');

        // this is in storage format so convert back to cword format
        let cword = new Cword();
        cword.setupCwordFromStorageObject(cwObj);

        this.storeSave(cword);
      } else {
        console.log('Game : setupNew : non example case');

        // all empty on creation

        this.storeSave(cword);
      }
    }
  }
}

export default Game;
