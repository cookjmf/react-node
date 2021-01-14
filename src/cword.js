import * as Util from './util';
import Cell from './cell';

class Cword {
  constructor() {
    this.name = '';
    this.size = '';
    this.horizClues = '';
    this.vertClues = '';
    this.cellMap = {};

    // OLD
    // this.maxAcross = 0;
    // this.maxDown = 0;
    // this.blanks = '';
    // this.cellValues = {};
  }

  getStorageObject() {
    let cwObj = {};
    cwObj.name = this.name;
    cwObj.maxAcross = this.getMaxAcross();
    cwObj.maxDown = this.getMaxDown();
    cwObj.blanks = this.getBlanks();
    cwObj.cellValues = this.getCellValues();
    return cwObj;
  }

  getMaxAcross() {
    return Util.maxAcross(this.size);
  }

  getMaxDown() {
    return Util.maxDown(this.size);
  }

  getBlanks() {
    let maxAcross = this.getMaxAcross();
    let maxDown = this.getMaxDown();
    let lines = '';
    for (let y=1; y<=maxDown; y++) {
      let line = '';
      for (let x=1; x<=maxAcross; x++) {
        let cellKey = Util.cellKey(y, x);
        if (!this.cellMap.has(cellKey)) {
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
    return lines;
  }

  getCellValues() {
    let cellValues = {};
    let maxAcross = this.getMaxAcross();
    let maxDown = this.getMaxDown();
    for (let y=1; y<=maxDown; y++) {
      for (let x=1; x<=maxAcross; x++) {
        var cellKey = Util.cellKey(y,x);
        console.log('cell->toObject .... cellKey : ['+cellKey+']');
        var cell = this.cellMap.get(cellKey);
        if (cell != null) {
          let val = cell.value;
          if (val != null && val.length > 0) {
            this.cellValues[cellKey] = val;
            console.log('............ cell->toObject : ['+cellKey+'] : ['+val+']');
          }        
        }
      }
    }
    return cellValues;
  }

  setupCwordFromStorageObject(cwObj) {
    this.name = cwObj.name;
    this.size = Util.size(cwObj.maxAcross, cwObj.maxDown);
    this.horizClues = cwObj.horizClues;
    this.vertClues = cwObj.vertClues;
    this.cellMap = this.setupCellMap(cwObj.maxAcross, cwObj.maxDown, cwObj.blanks, cwObj.cellValues);
  }

  getCellMap(maxAcross, maxDown, blanks, cellValues) {
    
    let cellMap = new Map();
  
    // The Blank Cells 
    let blankMap = this.getBlankMap(maxAcross, maxDown, blanks);
  
    // The values in cells
    let valueMap = this.getValueMap(maxAcross, maxDown, cellValues); 
  
    // setup cells
    for (let y=1; y<=maxDown; y++) {
      for (let x=1; x<=maxAcross; x++) {
        let cellKey = x+'.'+y;
        if (!blankMap.has(cellKey)) {  
          let cell = new Cell(x,y);
          cellMap.set(cellKey, cell);
          if (valueMap.has(cellKey)) {
            cell.value = valueMap.get(cellKey);
          }
          console.log('Setup cell at '+cellKey);
        }
      }
    }
    console.log('Setup '+cellMap.size+' cells');
  }
  
  getBlankMap(maxAcross, maxDown, blanks) {
  
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
        // this.msgMgr.addWarning('Bad # parts, need 2, but have : '+lineParts.length);
      }
      let yVal = lineParts[0];
      if (yVal < 1) {
        console.log('getBlankMap : y is < 1 : '+yVal);
        // this.msgMgr.addWarning('getBlankMap : y is < 1 : '+yVal);
      }
      if (yVal > maxDown) {
        console.log('getBlankMap : y is > maxDown : '+yVal);
        // this.msgMgr.addWarning('getBlankMap : y is > maxDown : '+yVal);
      }
      let xVals = lineParts[1];
      let xParts = xVals.split(',');
      for (let j = 0; j < xParts.length; j++) {
        let xVal = xParts[j];
        if (xVal < 1) {
          console.log('getBlankMap : x is < 1 : '+xVal);
          // this.msgMgr.addWarning('getBlankMap : x is < 1 : '+xVal);
        }
        if (xVal > maxAcross) {
          console.log('getBlankMap : x is > maxAcross : '+xVal);
          // this.msgMgr.addWarning('getBlankMap : x is > maxAcross : '+xVal);
        }
        // OLD let key = xVal+'.'+yVal;
        // NEW 
        let key = Util.toCellId(yVal, xVal);
        blankMap.set(key, key);
        console.log('Setup blank at '+key);
      }
      return blankMap;
    }
  }
  
  getValueMap(maxAcross, maxDown, cellValues) {
  
    let valueMap = new Map();
    for (let y=1; y<=maxDown; y++) {
      for (let x=1; x<=maxAcross; x++) {
        let key = Util.toCellId(y, x);
        console.log('cell->toMap .... cellKey : ['+key+']');
        let val = cellValues[key];
        if (val != null && val.length > 0) {
          if (!valueMap.has(key)) {
            valueMap.set(key, val);
            console.log('............ cell->toMap : ['+key+'] : ['+val+']');
          } else {
            console.log('Dup value from CELL_VALUES for : ['+key+']');
          }
        }
        
      }
    }
    return valueMap;
  }

}

export default Cword;