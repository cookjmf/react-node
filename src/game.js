import React from 'react';
import Init from './init';
import Message from './message';
import Param from './param';

import Cell from './cell';
import MsgMgr from './msgMgr';

import * as Util from './util';

// version 210110_1743

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
    // param
    this.onClickParamCell = this.onClickParamCell.bind(this);
    this.onKeyUpParamAcrossTextarea = this.onKeyUpParamAcrossTextarea.bind(this);
    this.onKeyUpParamDownTextarea = this.onKeyUpParamDownTextarea.bind(this);
    // play

    // message manager
    this.msgMgr = new MsgMgr();

    this.state = {
      updateTimestamp: '',
      existingNames: null,
      action: '',
      msg: null,
      name: '',
      size: '',

      // key : y.x   value : Cell
      cellMap: null,

      horizClues: '',  
      vertClues: '',

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
      this.setState({ name: newName });   
      this.storeDelete(newName);

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
      this.setState({ name: newName }); 
      if (Util.isExample(newName)) {
        this.setupNew(0);
      } 
    } else {
      console.log("logic error : in onChangeNewName but action is not CREATE");
    }
  }

  onChangeSize(newSize) {

    console.log('Game : START : -------------------------------------------->');
    console.log('Game : START : onChangeSize ----> '+newSize+' --------->');
    console.log('Game : START : -------------------------------------------->');  

    let action = this.state.action;
    if (action === Util.ACTION_CREATE) {

      this.setupNew(newSize);

    } else {
      console.log("logic error : in onChangeSize but action is not CREATE");
    }
  }

  onClickMessageClose() {
    console.log('Game : START : -------------------------------------------->');
    console.log('Game : START : onClickMessageClose ------------------------>');
    console.log('Game : START : -------------------------------------------->');  

    this.msgMgr.clear(); 

    let name = this.state.name;
    let action = this.state.action;
    let existingNames = this.state.existingNames;

    if (action === Util.ACTION_CREATE) {
      if (!Util.isValidName(name) || Util.isDuplicateName(existingNames, name)) {
        // force user to choose "Size" again
        this.setState( { selectedAction: Util.ACTION_TITLE, 
          selectedSize: Util.SIZE_TITLE, msg: null} );  
      } else {
        
        this.setState( { msg: null});

      }
    } else if (action === Util.ACTION_DELETE) {
      this.storeGetNames();

    } else {

    }
  }

  onClickParamCell(id) {

    console.log('Game : START : -------------------------------------------->');
    console.log('Game : START : onClickParamCell ----> '+id+'------------->');
    console.log('Game : START : -------------------------------------------->');  

    let cellMap = this.toggleParamCell(id);

    this.setState({ cellMap: cellMap});

    this.saveInUpdate();

  }

  onKeyUpParamAcrossTextarea(value) {
    console.log('Game : START : -------------------------------------------->');
    console.log('Game : START : onKeyUpParamAcrossTextarea ---->'+value+'------------->');
    console.log('Game : START : -------------------------------------------->');  

    let atext = Util.convertCluesRomanDash(value);
    atext = Util.convertCluesDash(atext);

    this.setState({ horizClues: atext });

    this.saveInUpdate();

  }

  onKeyUpParamDownTextarea(value) {
    console.log('Game : START : -------------------------------------------->');
    console.log('Game : START : onKeyUpParamDownTextarea ---->'+value+'------------->');
    console.log('Game : START : -------------------------------------------->');  

    let dtext = Util.convertCluesRomanDash(value);
    dtext = Util.convertCluesDash(dtext);

    this.setState({ vertClues: dtext });

    this.saveInUpdate();

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
  
  storeDelete(name) {
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
        this.resultDelete(true, name);
      }
    )
    .catch(
      err => {
        console.log('Game : storeDelete : catch : err = ...'+JSON.stringify(err)+'...');
        this.resultDelete(false, name);
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
  
    fetch('/cwords', {
      method: 'POST', 
      headers: {
       'Content-type': 'application/json; charset=UTF-8' 
      },
      body: JSON.stringify(cwObj)  
     })
    .then(
      response => {
        return response.json();
      }
    )
    .then(
      data => {
        console.log('Game : storeInsert : fetch : data : ...'+JSON.stringify(data)+'...');
        this.resultInsert(true);
      }
    )
    .catch(
      err => {
        console.log('Game : storeInsert : catch : err : ...'+JSON.stringify(err)+'...');
        this.resultInsert(false);
      }
    )  
  }
  
  storeUpdate(cwObj) {
    console.log('Game : storeUpdate : enter');
  
    fetch('/cwords/name/'+cwObj.name, {
      method: 'PUT', 
      headers: {
       'Content-type': 'application/json; charset=UTF-8' 
      },
      body: JSON.stringify(cwObj)  
     })
    .then(
      response => {
        return response.json();
      }
    )
    .then(
      data => {
        console.log('Game : storeUpdate : fetch : data : ...'+JSON.stringify(data)+'...');
        this.resultUpdate(true);
      }
    )
    .catch(
      err => {
        console.log('Game : storeUpdate : catch : err = ...'+JSON.stringify(err)+'...');
        this.resultUpdate(false);
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
  // - after build grid/clues methods
  // - set the updateTimestamp here, which forces re-render
  // CAN CHANGE STATE  

  resultGetNames(ok, names) {
    console.log('Game : resultGetNames : enter');
    if (!ok) {
      this.msgMgr.addError('Failed to get names.');
    } 

    let msg = this.msgMgr.getMsg();
    this.setState( { existingNames: names, 
      name: '', action: '', size: '',
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

  resultUpdate(ok) {
    console.log('Game : resultUpdate : enter');
    let action = this.state.action;
    if (action === Util.ACTION_IMPORT) {
      // resultSaveImport(ok);
    } else if (action === Util.ACTION_PLAY) {
      // resultSavePlay(ok);
    } else if (action === Util.ACTION_CREATE) {
      this.resultCreateUpdate(ok);
    } else if (action === Util.ACTION_UPDATE) {
      // resultSaveUpdate(ok);
    }
  }

  resultInsert(ok) {
    console.log('Game : resultInsert : enter');
    let action = this.state.action;
    if (action === Util.ACTION_IMPORT) {
      // resultSaveImport(ok);
    } else if (action === Util.ACTION_PLAY) {
      // resultSavePlay(ok);
    } else if (action === Util.ACTION_CREATE) {
      this.resultCreateInsert(ok);
    } else if (action === Util.ACTION_UPDATE) {
      // resultSaveUpdate(ok);
    }
  }

  resultCreateUpdate(ok) {
    console.log('Game : resultCreateUpdate : enter');
    if (!ok) {
      this.msgMgr.addError('Failed to save.');
    } else {
      this.msgMgr.addInfo('Updated : '+this.state.name+' at '+Util.date1() );
    }
    let msg = this.msgMgr.getMsg();
    this.setState( {
      msg: msg , updateTimestamp: Util.newDate()
    } );
  }

  resultCreateInsert(ok) {
    console.log('Game : resultCreateInsert : enter');
    if (!ok) {
      this.msgMgr.addError('Failed to save.');
    } else {
      if (Util.isExample(this.state.name)) {
        this.msgMgr.addInfo('Created example : '+this.state.name+'.');
      } else {
        this.msgMgr.addInfo('Created : '+this.state.name+', now set blanks and clues');       
      } 
    }
    let msg = this.msgMgr.getMsg();
    this.setState( {
      msg: msg , updateTimestamp: Util.newDate()
    } );
  }

  resultCreateSave(ok) {
    console.log('Game : resultCreateSave : enter');
    if (!ok) {
      this.msgMgr.addError('Failed to save.');
    } else {
      // should not happen
    }
    let msg = this.msgMgr.getMsg();
    this.setState( {
      msg: msg , updateTimestamp: Util.newDate()
    } );
  }

  // note: not used yet
  resultGet(cwObj, ok, name) {
    console.log('Game : resultGet : enter');
    if (!ok) {
      this.msgMgr.addError('Failed to get crossword : '+name);

    } else {

      // let maxAcross = 1 * cwObj.maxAcross;
      // console.log('maxAcross : ['+maxAcross+']');
      // let maxDown = 1 * cwObj.maxDown;
      // console.log('maxDown : ['+maxDown+']');

      let size = Util.size(cwObj.maxAcross, cwObj.maxDown);

      let blanks = cwObj.blanks;
      console.log('blanks : ['+blanks+']');
      let horizClues = cwObj.horizClues;
      horizClues = Util.removeNewLines(horizClues); 
      console.log('horizClues : ['+horizClues+']');
      let vertClues = cwObj.vertClues;
      vertClues = Util.removeNewLines(vertClues); 
      console.log('vertClues : ['+vertClues+']');  
      let cellValues = cwObj.cellValues;
      console.log('cellValues : ['+cellValues+']'); 
      // this.setState( { name: name, maxAcross: maxAcross, maxDown: maxDown, blanks: blanks,
      // horizClues: horizClues, vertClues: vertClues, cellValues: cellValues} );

      this.setState( { name: name, size: size, blanks: blanks,
        horizClues: horizClues, vertClues: vertClues, cellValues: cellValues,
        updateTimestamp: Util.newDate()} );
  
    }
  
  }

  resultDelete(deletedOK, name) {
    console.log('Game : resultDelete : enter');
    if (!deletedOK) {
      this.msgMgr.addError('Failed to delete crossword : '+name);
    } else {
      this.msgMgr.addInfo('Deleted crossword : '+name);
    }
    let msg = this.msgMgr.getMsg();
    // set state since new render needed
    this.setState( {msg : msg, updateTimestamp: Util.newDate()} );
  }

  resultInitCellMap() {
    console.log('Game : resultInitCellMap : enter');

    let msg = this.msgMgr.getMsg();
    if (msg!= null) {
        this.setState( {msg : msg, updateTimestamp: Util.newDate()} );
    }

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
          name={ this.state.name}
          selectedName={Util.NAME_TITLE}
          size={ this.state.size}
          selectedSize={ Util.SIZE_TITLE }
          onChangeAction={ this.onChangeAction }
          onChangeName={ this.onChangeName }
          onChangeNewName={ this.onChangeNewName }
          onChangeSize={ this.onChangeSize }
        /> 
        <Message         
          msg={ this.state.msg }
          onClick={ this.onClickMessageClose }
        />       
      </div>
    );
  }

  renderCreateWithName() {
    // chose create, entered name, get size
    console.log('Game : renderCreateWithName : enter');
    console.log('Game : renderCreateWithName : state : '+JSON.stringify(this.state));
    return (
      <div className="game">   
        <Init 
          action={ this.state.action}
          selectedAction={Util.ACTION_CREATE}
          name={ this.state.name}
          selectedName={this.state.name}
          size={ this.state.size}
          selectedSize={ Util.SIZE_TITLE }
          onChangeAction={ this.onChangeAction }
          onChangeName={ this.onChangeName }
          onChangeNewName={ this.onChangeNewName }
          onChangeSize={ this.onChangeSize }
        /> 
        <Message         
          msg={ this.state.msg }
          onClick={ this.onClickMessageClose }
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
          onClick={ this.onClickMessageClose }
        />
      </div>
    );
  }

  renderSetupNew() {
    // chose create, entered name, chose size
    console.log('Game : renderSetupNew : enter');
    console.log('Game : renderSetupNew : state : '+JSON.stringify(this.state));

    let cells = {};
    let cellMap = this.state.cellMap;
    if (cellMap != null && cellMap.size > 0) {
      cells = Util.mapToObject(cellMap);
    }

    console.log('Game : renderSetupNew : cells : '+JSON.stringify(cells));

    return (
      <div className="game"> 
        <Init 
          action=''
          selectedAction={ Util.ACTION_TITLE }
          selectedSize={ this.state.selectedSize }
          existingNames={ this.state.existingNames }
          onChangeAction={ this.onChangeAction }
        />
        <Message         
          msg={ this.state.msg }
          onClick={ this.onClickMessageClose }
        /> 
        <Param
          name={ this.state.name}
          size={ this.state.size}
          cells={ cells }
          horizClues={ this.state.horizClues }
          vertClues={ this.state.vertClues }
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
          onClick={ this.onClickMessageClose }
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
          name={ this.state.name}
          existingNames={ this.state.existingNames }
          onChangeName={ this.onChangeName }
        /> 
        <Message         
          msg={ this.state.msg }
          onClick={ this.onClickMessageClose }
        />   
      </div>
    );
  }

  renderDeleteMessage() {
    // chose delete
    console.log('Game : renderDeleteMessage : enter');
    console.log('Game : renderDeleteMessage : state : '+JSON.stringify(this.state));
    return (
      <div className="game"> 
        <Init 
          action={ this.state.action}
          selectedAction={Util.ACTION_TITLE}
          name={ this.state.name}
          existingNames={ this.state.existingNames }
          onChangeName={ this.onChangeName }
        /> 
        <Message         
          msg={ this.state.msg }
          onClick={ this.onClickMessageClose }
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
    let name = this.state.name;
    let size = this.state.size;

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

  toggleParamCell(id) {
    console.log('Game : toggleParamCell : enter : id : '+id);

    // get the current state of cells
    let cellMap = this.state.cellMap;

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

  setupNew(size) {
    console.log('Game : setupNew : enter : size : '+size);
    let name = this.state.name;

    let existingNames = this.state.existingNames;

    if (!Util.isValidName(name)) {
      this.msgMgr.addError('Invalid name');
      this.setState({ 
        msg : this.msgMgr.getMsg() 
      });

    } else if (Util.isDuplicateName(existingNames, name)) {
      this.msgMgr.addError('Duplicate name');
      this.setState({ 
        msg : this.msgMgr.getMsg() 
      });
    } else {

      this.setState({ size: size });

      let cwObj = Util.EXAMPLE_MAP.get(name);
      if (cwObj != null) {    
        console.log('Game : setupNew : example case');

        this.saveCwordObject(cwObj);
      } else {
        console.log('Game : setupNew : non example case');

        let cword = {};
        cword.name = this.state.name;
        cword.maxAcross = Util.maxAcross(size);
        cword.maxDown = Util.maxDown(size);

        // all empty on creation
        cword.blanks = '';
        cword.horizClues = '';
        cword.vertClues = '';
        cword.cellValues = '';

        this.saveCwordObject(cword);
      }
    }
  }

  makeCwObject() {
    let cword = {};
    let size = this.state.size;

    cword.name = this.state.name;
    cword.maxAcross = Util.maxAcross(size);
    cword.maxDown = Util.maxDown(size);

    cword.blanks = this.getBlanks();
    cword.horizClues = this.horizClues;
    cword.vertClues = this.vertClues;
    cword.cellValues = this.getCellValues();

    return cword;
  }

  getBlanks() {
    let size = this.state.size;
    let maxAcross = Util.maxAcross(size);
    let maxDown = Util.maxAcross(size);
    let cellMap = this.state.cellMap;
    let blanks = '';
    let lines = '';
    for (let y=1; y<=maxDown; y++) {
      let line = '';
      for (let x=1; x<=maxAcross; x++) {
        let cellKey = Util.cellKey(y, x);
        if (!cellMap.has(cellKey)) {
          if (line === '') {
            line = ''+x;
          } else {
            line += ','+x;
          }
        }
      }
      if (line.length > 0) {
        line = y+' '+line;
        lines += line+';';
      }
    }
    lines = lines.trim();
    blanks = lines;
    return blanks;
  }

  getCellValues() {
    let size = this.state.size;
    let maxAcross = Util.maxAcross(size);
    let maxDown = Util.maxAcross(size);
    let cellMap = this.state.cellMap;

    let cellValues = {};
    for (let y=1; y<=maxDown; y++) {
      for (let x=1; x<=maxAcross; x++) {
        var cellKey = Util.cellKey(y,x);
        console.log('cell->toObject .... cellKey : ['+cellKey+']');
        var cell = cellMap.get(cellKey);
        if (cell != null) {
          let val = cell.value;
          if (val != null && val.length > 0) {
            cellValues[cellKey] = val;
            console.log('............ cell->toObject : ['+cellKey+'] : ['+val+']');
          }        
        }
      }
    }
    return cellValues;
  }

  saveInUpdate() {
    console.log('Game : saveInUpdate : enter');

    // save the crossword
    let cwObj = this.makeCwObject();
  
    this.saveCwordObject(cwObj);

  }

  saveCwordObject(cwObj) {
    console.log('Game : saveCwordObject : enter');

    let maxAcross = cwObj.maxAcross;
    let maxDown = cwObj.maxDown;
    let size = Util.size(maxAcross, maxDown);

    let blanks = cwObj.blanks;
    let cellValues = cwObj.cellValues;
    let cellMap = this.setupCellMap(maxAcross, maxDown, blanks, cellValues);

    let horizClues = cwObj.horizClues;
    let vertClues = cwObj.vertClues;

    this.setState(
      { size: size, cellMap: cellMap, horizClues: horizClues, vertClues: vertClues}
    );
  
    this.storeSave(cwObj);

  }

  setupCellMap(maxAcross, maxDown, blanks, cellValues) {
    console.log('Game : setupCellMap : enter');
    let cellMap = new Map();

    // blank cells 
    let blankMap = this.setupBlankMap(maxAcross, maxDown, blanks);

    // values
    let valueMap = this.setupValueMap(maxAcross, maxDown, cellValues);

    // setup cells
    for (let y=1; y<=maxDown; y++) {
      for (let x=1; x<=maxAcross; x++) {
        let cellKey = Util.cellKey(y,x);
        if (!blankMap.has(cellKey)) {  
          let cell = new Cell(y,x);
          cellMap.set(cellKey, cell);
          console.log('Setup cell at '+cellKey);
          if (valueMap.has(cellKey)) {
            let val = valueMap.get(cellKey);
            cell.value = val;
            console.log('........ cell value to '+val+' at '+cellKey);
          }
        }
      }
    }

    console.log("cells : "+JSON.stringify(Util.mapToObject(cellMap)));

    return cellMap;
  }

  setupValueMap(maxAcross, maxDown,cellValues) {
    let valueMap = new Map();
    for (let y=1; y<=maxDown; y++) {
      for (let x=1; x<=maxAcross; x++) {
        var cellKey = y+'.'+x;
        var val = cellValues[cellKey];
        if (val != null && val.length > 0) {
          if (!valueMap.has(cellKey)) {
            valueMap.set(cellKey, val);
            console.log('............ cell->toMap : ['+cellKey+'] : ['+val+']');
          } 
        }
      }
    }

    console.log("values : "+JSON.stringify(Util.mapToObject(valueMap)));
    return valueMap;
  }

  setupBlankMap(maxAcross, maxDown,blanks) {
    let blankMap = new Map();
  
    // setup blanks
    let blankLines = blanks.split(';');
    for (let i = 0; i < blankLines.length; i++) {
      let line = blankLines[i]; 
      line = line.trim();
      if (line.length === 0) {
        continue;
      }
      console.log('BlankLine#'+(i+1)+' ['+line+']');
      let lineParts = line.split(' ');
      if (lineParts.length !== 2) {
        console.log("Bad # parts, need 2, but have : "+lineParts.length);
        this.msgMgr.addWarning('Bad # parts, need 2, but have : '+lineParts.length);
      }
      let yVal = lineParts[0];
      if (yVal < 1) {
        this.msgMgr.addWarning('getBlankMap : y is < 1 : '+yVal);
      }
      if (yVal > maxDown) {
        this.msgMgr.addWarning('getBlankMap : y is > maxDown : '+yVal);
      }
      let xVals = lineParts[1];
      let xParts = xVals.split(',');
      for (let j = 0; j < xParts.length; j++) {
        let xVal = xParts[j];
        if (xVal < 1) {
          this.msgMgr.addWarning('getBlankMap : x is < 1 : '+xVal);
        }
        if (xVal > maxAcross) {
          this.msgMgr.addWarning('getBlankMap : x is > maxAcross : '+xVal);
        }
        let key = Util.cellKey(yVal,xVal);

        blankMap.set(key, key);
        console.log('Setup blank at '+key);
      }
    }

    console.log("blanks : "+JSON.stringify(Util.mapToObject(blankMap)));

    return blankMap;
  }

//   // initialize cell map
//   initCellMap() {

//     let name = this.state.name;
//     let size = this.state.size;
//     let maxAcross = Util.maxAcross(size);
//     let maxDown = Util.maxDown(size);

//     if (!Util.isValidName(name)) {
//       this.msgMgr.addError('Invalid crossword name.|Crossword name must have 3-80 characters and not start with --.');
//     }
  
//     if (!Util.isAllowedAcross(maxAcross)) {
//       this.msgMgr.addWarn('Invalid maxAcross : '+maxAcross);
//     }
  
//     if (!Util.isAllowedDown(maxDown)) {
//       this.msgMgr.addWarn('Invalid maxDown : '+maxDown);
//     }
    
//     let cellMap = new Map();
  
//     // let clueMap = new Map();
  
//     // The Blank Cells 
//     let blankMap = this.getBlankMap();
  
//     // setup cells
//     for (let y=1; y<=maxDown; y++) {
//       for (let x=1; x<=maxAcross; x++) {
//         let cellKey = x+'.'+y;
//         if (!blankMap.has(cellKey)) {  
//           let cell = new Cell(x,y);
//           cellMap.set(cellKey, cell);
//           console.log('Setup cell at '+cellKey);
//         }
//       }
//     }
//     console.log('Setup '+cellMap.size+' cells');
  
//     if (cellMap.size === 0) {
//       this.msgMgr.addWarn('No valid cells');
//     }
  
//     let avail = maxAcross * maxDown;
//     let used = blankMap.size + cellMap.size;
//     if (avail === used) {
//       console.log('All used : avail='+avail+ ', used='+used);
//     } else {
//       // console.log('ERROR : All NOT used : avail='+avail+ ', used='+used);
//       this.msgMgr.addWarn('Not all cells used in initCellMap. Available='+avail+ ', used='+used);
//     }

//     this.resultInitCellMap();

//     return cellMap;
//     // this.setState( { cellMap: cellMap });
  
//   }
  
//   // get blankMap from state.blanks
//   getBlankMap() {
//     console.log('Game : getBlankMap : enter');
//     let blanks = this.state.blanks;
//     let size = this.state.size;
//     let maxAcross = Util.maxAcross(size);
//     let maxDown = Util.maxDown(size);

//     // let msg = null;

//     // OLD : The Blank Cells : key = x.y  val = x.y 
//     // NEW : The Blank Cells : key = aa  val = aa 
//     let blankMap = new Map();
  
//     // this makes no sense on first call
//     // if (blanks.length === 0) {
//     //   this.msgMgr.addError('No blanks defined.|At least one blank must be defined.');
//     // }
  
//     // setup blanks
//     let blankLines = blanks.split(';');
//     for (let i = 0; i < blankLines.length; i++) {
//       let line = blankLines[i]; 
//       line = line.trim();
//       if (line.length === 0) {
//         continue;
//       }
//       console.log('BlankLine#'+(i+1)+' ['+line+']');
//       let lineParts = line.split(' ');
//       if (lineParts.length !== 2) {
//         console.log("Bad # parts, need 2, but have : "+lineParts.length);
//         this.msgMgr.addWarning('Bad # parts, need 2, but have : '+lineParts.length);
//       }
//       let yVal = lineParts[0];
//       if (yVal < 1) {
//         this.msgMgr.addWarning('getBlankMap : y is < 1 : '+yVal);
//       }
//       if (yVal > maxDown) {
//         this.msgMgr.addWarning('getBlankMap : y is > maxDown : '+yVal);
//       }
//       let xVals = lineParts[1];
//       let xParts = xVals.split(',');
//       for (let j = 0; j < xParts.length; j++) {
//         let xVal = xParts[j];
//         if (xVal < 1) {
//           this.msgMgr.addWarning('getBlankMap : x is < 1 : '+xVal);
//         }
//         if (xVal > maxAcross) {
//           this.msgMgr.addWarning('getBlankMap : x is > maxAcross : '+xVal);
//         }
//         // OLD let key = xVal+'.'+yVal;
//         // NEW 
//         let key = Util.toCellId(yVal, xVal);

//         blankMap.set(key, key);
//         console.log('Setup blank at '+key);
//       }
//     }
  
//     console.log('Setup '+blankMap.size+' blanks');
  
//     // this makes no sense on first call
//     // if (blankMap.size === 0) {
//     //   this.msgMgr.addError('No blanks parsed.|Failed to make any blanks from BLANKS string.');
//     // }
  
//     return blankMap;
//   }

//   // get valueMap from cellValues
//   cellValuesToMap() {

//     let cellMap = this.state.cellMap;
//     let cellValues = this.state.cellValues;

//     let size = this.state.size;
//     let maxAcross = Util.maxAcross(size);
//     let maxDown = Util.maxDown(size);

//     let valueMap = new Map();
//     for (let y=1; y<=maxDown; y++) {
//       for (let x=1; x<=maxAcross; x++) {
//         let cellKey = x+'.'+y;
//         console.log('cell->toMap .... cellKey : ['+cellKey+']');
//         let cell = cellMap.get(cellKey);
//         if (cell != null) {
//           let cellId = cell.toId();
//           let val = cellValues[cellId];
//           if (val != null && val.length > 0) {
//             if (!valueMap.has(cellId)) {
//               valueMap.set(cellId, val);
//               console.log('............ cell->toMap : ['+cellId+'] : ['+val+']');
//             } else {
//               console.log('Dup value from CELL_VALUES for : ['+cellId+']');
//             }
//           }
//         }
//       }
//     }
//     return valueMap;
//   }
// }

}

export default Game;
