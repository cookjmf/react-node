import React from 'react';
import * as Util from './util';

class ParamCell extends React.Component {

  constructor(props) {
    
    super(props);
    console.log('ParamCell : constructor : enter');
    this.state = {};
  }

  componentDidMount() {
    console.log('ParamCell : componentDidMount : enter');
  }

  componentDidUpdate() {
    console.log('ParamCell : componentDidUpdate : enter');
  }
  
  renderNumber(id, cls, val) {
    console.log('ParamCell : renderNumber : id : '+id);
    return (
      <>
        <div id={id} className={cls} name={id} key={id} readOnly>
          {val}
        </div>
      </>
    );
  }

  renderInput(id, cls, val, onClick) {
    console.log('ParamCell : renderInput : id : '+id);  
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

  renderInputAsBlank(id, cls, onClick) {
    console.log('ParamCell : renderInputAsBlank : id : '+id);
  
    const style1 = {
      'backgroundColor': 'black'
    };

    return (
      <>
        <input id={id} className={cls} name={id} key={id} type='text' 
          minLength='0' maxLength='0' value=''
          style={style1}
          onClick={(ev) => onClick(ev.target.id)}
          readOnly>
        </input>
      </>   
    );
  }

  renderCell(boardArrayKey, pMaxAcross, pMaxDown, cellMap, onClick) {
    console.log('ParamCell : renderCell : enter : boardArrayKey : '+boardArrayKey);
    // let parts = boardArrayKey.split('.');
    // let partY = parts[0];
    // let partX = parts[1];
    let y = Util.row(boardArrayKey);
    let x = Util.column(boardArrayKey);
    let id = 'na-'+Util.cellKey(y,x);
    // let id = 'na-'+Util.toCellId(y, x);
    let clsNum = 'cw-number-item';
    let clsParam = 'cw-param-item';

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
      // id = Util.toCellId(yVal, xVal);  
      let cellKey = Util.cellKey(yVal,xVal);
      id = cellKey;
      let val = '';
      let isBlank = true;

      if (cellMap.has(cellKey)) {
        isBlank = false;
        let cell = cellMap.get(cellKey);
        val = cell.value;
      }
      if (isBlank) {
        return this.renderInputAsBlank(id, clsParam, onClick);
      } else {
        return this.renderInput(id, clsParam, val, onClick);
      } 
    }
  }
  
  render() {
    console.log('ParamCell : render : enter');
    // console.log('ParamCell : render : props : ...'+JSON.stringify(this.props)+'...');

    // key is "special", even though its been passed in - it does not show in props !!

    let cells = this.props.cells;
    let cellMap = Util.objectToMap(cells);

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

export default ParamCell;
