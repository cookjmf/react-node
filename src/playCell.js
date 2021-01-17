import React from 'react';
import * as Util from './util';

class PlayCell extends React.Component {

  constructor(props) {
    
    super(props);
    console.log('PlayCell : constructor : enter');
    this.state = {};
  }

  componentDidMount() {
    console.log('PlayCell : componentDidMount : enter');
  }

  componentDidUpdate() {
    console.log('PlayCell : componentDidUpdate : enter');
  }
  
  renderNumber(id, cls, val) {
    console.log('PlayCell : renderNumber : id : '+id);
    return (
      <>
        <div id={id} className={cls} name={id} key={id} readOnly>
          {val}
        </div>
      </>
    );
  }

  renderNormalCell(id, cls, val, onClick) {
    console.log('PlayCell : renderInput : id : '+id);  
    return (
      <>
        <input id={id} className={cls} name={id} key={id} type='text' 
          minLength='1' maxLength='1' value={val}
          onClick={(ev) => onClick(ev.target.id)}
          readOnly>
        </input>
      </>   
    );
  }

  renderBlankCell(id) {
    console.log('PlayCell : renderBlankCell : id : '+id);

    return (
      <>
        <span id={id} className='cw-blank' name={id} key={id} >
        </span>
      </>   
    );
  }

  renderCell(boardArrayKey, pMaxAcross, pMaxDown, cellMap, onClick) {
    console.log('PlayCell : renderCell : enter : boardArrayKey : '+boardArrayKey);
    let y = Util.row(boardArrayKey);
    let x = Util.column(boardArrayKey);
    let id = 'na-'+Util.toCellId(y,x);
    let clsNum = 'cw-number-item';

    if (x===1 || x===pMaxAcross) {
      if (y ===1 || y === pMaxDown) {
        return this.renderNumber(id, clsNum, '');
      } else {
        return this.renderNumber(id, clsNum, ''+(y-1));
      }
    } else if (y===1 || y===pMaxDown) {
      if (x ===1 || x === pMaxAcross) {
        return this.renderNumber(id, clsNum, '');
      } else {
        return this.renderNumber(id, clsNum, ''+(x-1));
      }
    } else {
      let xVal = x-1;
      let yVal = y-1; 
      let cellKey = Util.cellKey(yVal,xVal);
      id = Util.toCellId(y, x);
      let val = '';
      let isBlank = true;

      if (cellMap.has(cellKey)) {
        isBlank = false;
        let cell = cellMap.get(cellKey);
        val = cell.value;
      }
      if (isBlank) {
        return this.renderBlankCell(id);
      } else {
        return this.renderNormalCell(id, val, onClick);
      } 
    }
  }
  
  render() {
    console.log('PlayCell : render : enter');

    // key is "special", even though its been passed in - it does not show in props !!

    let cword = this.props.cword;
    let cellMap = cword.cellMap;

    let boardArrayKey = this.props.boardArrayKey;
    if (boardArrayKey == null) {
      return <p>E101</p>
    } else {
      console.log('ParamCell : render : boardArrayKey : '+boardArrayKey);

      let pMaxAcross = this.props.numberedMaxAcross;
      let pMaxDown = this.props.numberedMaxDown;
      let onClick = this.props.onClick;

      return (
        <>
        {this.renderCell(boardArrayKey, pMaxAcross, pMaxDown, cellMap, onClick)}
        </>
      );
    }
    
  }
}

export default PlayCell;
