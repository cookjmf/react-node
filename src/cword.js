import * as Util from './util';
import Cell from './cell';
import MsgMgr from './msgMgr';
import Clue from './clue';

class Cword {

  constructor() {
    this.name = '';
    this.size = '';
    this.horizClues = '';
    this.vertClues = '';
    this.cellMap = null;

    // message manager
    this.msgMgr = new MsgMgr();

    // clueMap (setup in buildGrid)
    this.clueMap = null;

    // selected cell
    this.selectedCell = null;

    // selected clue
    this.selectedClue = null;

  }

  init(size) {
    this.size = size;
    if (this.cellMap == null) {
      this.cellMap = new Map();
      let maxAcross = this.getMaxAcross();
      let maxDown = this.getMaxDown();
      for (let y=1; y<=maxDown; y++) {
        for (let x=1; x<=maxAcross; x++) {
          let cellKey = Util.cellKey(y, x);
          let cell = new Cell(y,x);
          this.cellMap.set(cellKey, cell);
        }
      }
    }
  }

  getStorageObject() {
    let cwObj = {};
    cwObj.name = this.name;
    cwObj.maxAcross = this.getMaxAcross();
    cwObj.maxDown = this.getMaxDown();
    cwObj.blanks = this.getBlanks();
    cwObj.horizClues = this.horizClues;
    cwObj.vertClues = this.vertClues;
    cwObj.cellValues = this.getCellValues();
    return cwObj;
  }

  getMaxAcross() {
    return Util.maxAcross(this.size);
  }

  getMaxDown() {
    return Util.maxDown(this.size);
  }

  getNumberedMaxAcross() {
    return Util.numberedMaxAcross(this.size);
  }

  getNumberedMaxDown() {
    return Util.numberedMaxDown(this.size);
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
        // console.log('cell->toObject .... cellKey : ['+cellKey+']');
        var cell = this.cellMap.get(cellKey);
        if (cell != null) {
          let val = cell.value;
          if (val != null && val.length > 0) {
            let cellId = Util.toCellId(y, x);
            this.cellValues[cellId] = val;
            // console.log('............ cell->toObject : ['+cellKey+'] : ['+val+']');
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
    this.setupCellMap(cwObj.maxAcross, cwObj.maxDown, cwObj.blanks, cwObj.cellValues);
  }

  setupCellMap(maxAcross, maxDown, blanks, cellValues) {
    
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
          // console.log('Setup cell at '+cellKey);
        }
      }
    }
    // console.log('Setup '+cellMap.size+' cells');
    this.cellMap = cellMap;
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
      // console.log('BlankLine#'+(i+1)+' ['+line+']');
      let lineParts = line.split(' ');
      if (lineParts.length !== 2) {
        // console.log("Bad # parts, need 2, but have : "+lineParts.length);
      }
      let yVal = 1 * lineParts[0];
      if (yVal < 1) {
        // console.log('getBlankMap : y is < 1 : '+yVal);
      }
      if (yVal > maxDown) {
        // console.log('getBlankMap : y is > maxDown : '+yVal);
      }
      let xVals = lineParts[1];
      let xParts = xVals.split(',');
      for (let j = 0; j < xParts.length; j++) {
        let xVal = 1 * xParts[j];
        if (xVal < 1) {
          // console.log('getBlankMap : x is < 1 : '+xVal);
        }
        if (xVal > maxAcross) {
          // console.log('getBlankMap : x is > maxAcross : '+xVal);
        }
 
        // let key = Util.toCellId(yVal, xVal);
        let key = Util.cellKey(yVal, xVal);
        blankMap.set(key, key);
        // console.log('Setup blank at : '+key);
      }   
    }
    return blankMap;
  }
  
  getValueMap(maxAcross, maxDown, cellValues) {
  
    let valueMap = new Map();
    if (cellValues == null) {
      cellValues = {};
    }
    for (let y=1; y<=maxDown; y++) {
      for (let x=1; x<=maxAcross; x++) {
        // key in cellValues is aa format aka cellid
        let cellId = Util.toCellId(y,x);
        // console.log('cell->toMap .... cellId : ['+cellId+']');

        let val = cellValues[cellId];
        if (val != null && val.length > 0) {
          let cellKey = Util.cellKey(y,x);
          if (!valueMap.has(cellKey)) {
            valueMap.set(cellKey, val);
            // console.log('............ cell->toMap : ['+cellKey+'] : ['+val+']');
          } else {
            // console.log('Dup value from CELL_VALUES for : ['+cellKey+']');
          }
        }      
      }
    }
    return valueMap;
  }

  toggleParamCell(id) {
    // console.log('Cword : toggleParamCell : enter : id : '+id);

    // get the current state of cells
    let cellMap = this.cellMap;

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
  }

  validate() {

    this.msgMgr.clear();

    // build the grid
    this.buildGrid();
  
    // print grid 
    // this.printGrid();

    let msg = this.msgMgr.firstMsg();
    if (msg != null) {

      msg.prefix = 'Failed Validation.';
  
    } else {

      this.msgMgr.addInfo('Passed Validation.');
      msg = this.msgMgr.msg();
      
    }

    return msg;
  
  }

  buildForPlay() {

    this.msgMgr.clear();

    // build the grid
    this.buildGrid();
  
    // print grid 
    // this.printGrid();

    let msg = this.msgMgr.firstMsg();
    if (msg != null) {

      msg.prefix = 'Failed Validation.';
  
    } 

    return msg;
  
  }

  buildGrid() {
    // this.initCellMap();
    this.initAcrossClues();
    this.initDownClues();
    
    this.setupClueMap();

    this.setupLabels();

    // data attributes for cells and clues
    this.setupData();
  }

  getClueRegExp() {
    var separators = [ '\\.' ,'?', '!' ];
    var sepRe = new RegExp('([' + separators.join('') + '])+');
    return sepRe;
  }

  initAcrossClues() {

    let maxAcross = this.getMaxAcross();
    let maxDown = this.getMaxDown();

    // The across clues
    let acrossClueMap = new Map();
  
    var sepRe = this.getClueRegExp();
  
    // setup across clues
    const acrossLines = this.getLines(maxAcross, this.horizClues, 'across');
    // console.log('Setup '+acrossLines.length+' acrossLines');
  
    this.validateClueLines('across', acrossLines, maxDown);
  
    for (var i=0; i<acrossLines.length; i++) {
      var line = acrossLines[i];
      line = line.trim();
      // console.log('clue across line : '+(i+1)+' ...['+line+']');
      var lineParts = line.split(sepRe);
      var first = lineParts[0];
      var m = ''+(i+1);
      if (m === first) {
        var num = 0;
        for (var j=2; j<lineParts.length; j=j+2) {
          var ct = lineParts[j];
          if (ct.length > 0) {
            ct = ct.trim();
            var delim = '.';
            if (j < (lineParts.length-1)) {
              delim = lineParts[j+1];
            }
            num++;
  
            this.validateClueText('Across clue line ( '+i+1+' ) \n - clue ( '+num+' )\n - delim ( '+delim+' )' , ct);
  
            var cid = m+'.'+num;
            // console.log('across clue: '+cid+' ...['+ct+'] ['+delim+']');
            var clue = new Clue(i+1, 0, true, cid, '', ct+''+delim, num);
            var list = acrossClueMap.get(m);
            if (list == null) {
              list = [];
              acrossClueMap.set(m, list);
            }
            list.push(clue);
            // console.log('-------> '+this.name+' --> For row ['+m+'] added across clue#'+list.length+' ['+clue.text+']');
          }
        }
      } else {
        this.msgMgr.addError('Invalid across clue', 
        'Bad across clue line number at clue line # '+(i+1)+'.\nFound ( '+first+' ), but expected ( '+m+' )');
      }
    }
  
    // join the across clues to the cells
    for (var y=1; y<=maxAcross; y++) {
      var cList = acrossClueMap.get(''+y);
      if (cList == null) {
        // console.log('No clues when y='+y);
        continue;
      }
      // console.log('For y='+y+' ... #clues='+cList.length);
      var currentClue = null;
      var disp = -1;
  
      var cluesMatched = 0;
  
      for (var x=1; x<=maxDown; x++) {
        var cellKey = Util.cellKey(y,x); // x+'.'+y;
  
        // work out start position and length of each clue
        var cell = this.cellMap.get(cellKey);
        if (cell != null) {
          if (currentClue != null) {
            currentClue.answerLen++;
            cell.acrossValue = 'X';
            cell.acrossPos = currentClue.answerLen-1;
            cell.acrossClue = currentClue;
            continue;
          }
  
          // skip if only 1 letter long
          // var cellKey2 = (x+1)+'.'+y;
          var cellKey2 = Util.cellKey(y, x+1); 
          var cell2 = this.cellMap.get(cellKey2);
          if (cell2 == null) {
            continue;
          }
  
          // inc the disp
          disp++;
                      
          currentClue = cList[disp];
          if (currentClue == null) {
            this.msgMgr.addError('Invalid across clues for grid.', 
              'No across clue for Cell ( row = '+y+', column = '+x+').\n'+
              'Missing clue#'+(disp+1)+' on row '+y+'\n'
              );
  
            continue;
          }
  
          currentClue.firstCell = cell;
          currentClue.x = x;
          // console.log('Across Clue : at '+cellKey+ ' : ['+currentClue.text+']');
          currentClue.answerLen++;
  
          cell.acrossValue = 'X';
          cell.acrossPos = currentClue.answerLen-1;
          cell.acrossClue = currentClue;
          cluesMatched++;
  
        } else {
  
          // cell is blank 
          if (currentClue != null) {
            // console.log('Len of Across clue : '+currentClue.answerLen);
          }
          currentClue = null;
        }
      }
  
      // end of row
      if (currentClue != null) {
        // console.log('Len of Across clue : '+currentClue.answerLen);
      }
  
      if (cluesMatched === cList.length) {
        // console.log('all clues matched ('+cluesMatched+')');
      } else if (cluesMatched < cList.length) {
        // console.log('NOT all clues matched. There are ('+cList.length+') but only '+cluesMatched+' fit in grid'); 
        this.msgMgr.addError('Invalid across clues for grid.',          
              'Unused clues on row '+y+'.\n'+
              'There are '+cList.length+' clues on row '+y+' but only '+cluesMatched+' fit in grid\n'
              );     
      } else {
        // console.log('Too many clues matched. There are ('+cList.length+') however '+cluesMatched+' fit in grid'); 
        this.msgMgr.addError('Invalid across clues for grid.',          
              'Too many clues used on row '+y+'\n'
              ); 
      }
  
    }
  
  }

  initDownClues() {

    let maxAcross = this.getMaxAcross();
    let maxDown = this.getMaxDown();

    // The down clues
    let downClueMap = new Map();
  
    // setup down clues
    const downLines = this.getLines(maxAcross, this.vertClues, 'down');
  
    // console.log('Setup '+downLines.length+' downLines');
  
    this.validateClueLines('down', downLines, maxAcross);
  
    var sepRe = this.getClueRegExp();
  
    for (var i=0; i<downLines.length; i++) {
      var line = downLines[i];
      line = line.trim();
      // console.log('clue down line : '+(i+1)+' ...['+line+']');
      var lineParts = line.split(sepRe);
      var first = lineParts[0];
      var m = ''+(i+1);
      if (m === first) {
        var num = 0;
        for (var j=2; j<lineParts.length; j=j+2) {
          var ct = lineParts[j];
          if (ct.length > 0) {
            ct = ct.trim();
  
            var delim = '.';
            if (j < (lineParts.length-1)) {
              delim = lineParts[j+1];
            }
            num++;
  
            this.validateClueText('Down clue line ( '+i+1+' ) clue ( '+num+' ) delim ('+delim+' )' , ct);
  
            var cid = m+'.'+num;
            // console.log('down clue: '+cid+' ...['+ct+'] ['+delim+']');
            var clue = new Clue(0, i+1, false, cid, '', ct+''+delim, num);
            var list = downClueMap.get(m);
            if (list == null) {
              list = [];
              downClueMap.set(m, list);
            }
            list.push(clue);
            // console.log('-------> '+this.name+' --> For column ['+m+'] added down clue#'+list.length+' ['+clue.text+']');
          }
        }
      } else {
        this.msgMgr.addError('Invalid down clue', 
        'Bad down clue line number at clue line # '+(i+1)+'.\nFound ( '+first+' ), but expected ( '+m+' )');
      }
    }
  
    // join the down clues to the cells
    for (var x=1; x<=maxAcross; x++) {
      var cList = downClueMap.get(''+x);
      if (cList == null) {
        // console.log('No clues when x='+x);
        continue;
      }
      // console.log('For x='+x+' ... #clues='+cList.length);
  
      var currentClue = null;
      var disp = -1;
  
      var cluesMatched = 0;
  
      for (var y=1; y<=maxDown; y++) {
        // var cellKey = x+'.'+y;
        var cellKey = Util.cellKey(y,x); 
                  
        // work out start position and length of each clue
   
        var cell = this.cellMap.get(cellKey);
        if (cell != null) {
  
          if (currentClue != null) {
            currentClue.answerLen++;
                          
            cell.downValue = 'X';
            cell.downPos = currentClue.answerLen-1;
                          
            cell.downClue = currentClue;
            continue;
          }
  
          // skip if only 1 letter long
          // var cellKey2 = x+'.'+(y+1);
          var cellKey2 = Util.cellKey(y+1,x); 
          var cell2 = this.cellMap.get(cellKey2);
          if (cell2 == null) {
            continue;
          }
          // inc the disp
          disp++;
  
          currentClue = cList[disp];
  
          if (currentClue == null) {
            this.msgMgr.addError('Invalid down clues for grid', 
              'No down clue for Cell ( row = '+y+', column = '+x+').\n'+
              'Missing clue#'+(disp+1)+' on column '+x+'\n'
              );
  
            continue;
          }                                
          currentClue.firstCell = cell;
          currentClue.y = y;
          // console.log('Down Clue : at '+cellKey+ ' : ['+currentClue.text+']');
          currentClue.answerLen++;
                      
          cell.downValue = 'X';
          cell.downPos = currentClue.answerLen-1;
                      
          cell.downClue = currentClue;
          cluesMatched++;
  
  
        } else {
          // cell is blank 
          if (currentClue != null) {
            // console.log('Len of Down clue : '+currentClue.answerLen);
          }
          currentClue = null;
        }
      }
  
      // end of row
      if (currentClue != null) {
        // console.log('Len of Down clue : '+currentClue.answerLen);
      }
  
      if (cluesMatched === cList.length) {
        // console.log('all clues matched ('+cluesMatched+')');
      } else if (cluesMatched < cList.length) {
        // console.log('NOT all clues matched. There are ('+cList.length+') but only '+cluesMatched+' fit in grid'); 
        this.msgMgr.addError('Invalid down clues for grid.',          
              'Unused clues on column '+x+'.\n'+
              'There are '+cList.length+' clues on column '+x+' but only '+cluesMatched+' fit in grid\n'
              );     
      } else {
        // console.log('Too many clues matched. There are ('+cList.length+') however '+cluesMatched+' fit in grid');  
        this.msgMgr.addError('Invalid down clues for grid.',          
              'Too many clues used on column '+x+'\n'
              ); 
      }
  
    }
  }
  
  validateClueLines(dir, arr, max) {
    var v = '';
    if (dir === 'across') {
      v = 'row';
    } else if (dir === 'down') {
      v = 'column';
    }
    var extra = ''+
      'Each clue line must be in this format : ( N. LineText ) where :\n'+
      ' - N is a number matching the '+v+ ' number\n '+
      ' - LineText is the text of the 1 or many clues\n'+
      'Each clue line is separated by a space/newline.\n'+
      'Each clue must be in this format : ( ClueText(E) ) where :\n'+
      ' - ClueText is the text of one clue\n'+
      ' - E is a period (.)/exclamation (!)/question mark (?). \n'+
      'Each clue is separated by a space.\n'+
      'Examples:\n'+
      Util.EXAMPLE_CLUES;
  
    if (arr.length < max) {
      this.msgMgr.addError('Invalid '+dir+' clues.', 
      'Not enough valid '+dir+' clue lines.\n'+
      'Found '+arr.length+' '+dir+' clue lines but expected between 1 and '+max+'.\n'+
      extra);
    } else if (arr.length > max) {
      this.msgMgr.addError('Invalid '+dir+' clues.', 
      'Too many valid '+dir+' clue lines.\n'+
      'Found '+arr.length+' '+dir+' clue lines but expected between 1 and '+max+'.\n'+
      extra);
    } 
  }

  getLines(num, clues, dir) {    
    // var errMsgs = [];
    var lines = [];
    var p1 = 0;
    var p2 = -1;
    // go 1 pass the max to find errors
    for (let i=1; i<=num+1; i++) {
      if (i === (num+1)) {
        // console.log('On the line after last legal line');
      }
      var s1 = i+'. ';
      var s2 = (i+1)+'. ';
      p1 = clues.indexOf(s1, p2);
      if (p1 >=0) {
        p2 = clues.indexOf(s2, p1+3);
        var line = '';
        if (p2 > p1) {
          line = clues.substring(p1, p2);
          line = line.trim();
        } else {
          // this is only valid for last clue line, in all cases keep the line so as to allow the user to remove it
          line = clues.substring(p1);
          line = line.trim();
          if (i > num) {
            this.msgMgr.addError('Too many '+dir+' clue lines. Found '+i+' but expected '+num+'.');
          } else if (i < num) {
            this.msgMgr.addError('Cannot find '+dir+' clue line starting ['+s2+'] after '+dir+' clue line starting ['+s1+'].');
          }
        }
        if (line.endsWith('.') || line.endsWith('!') || line.endsWith('?')) {
          if (i > num) {
            this.msgMgr.addError('Too many '+dir+' clue lines. Found '+i+' but expected '+num+'.');
          }
        } else {
          this.msgMgr.addError('Invalid '+dir+' clue line ['+line+']. Must end with either period (.) or exclamation mark (!) or question mark (?).');
        }
        // keep the line so as to allow the user to remove it
        lines.push(line);
      } else {
        if (i <= num) {
          this.msgMgr.addError('Cannot find '+dir+' clue line starting ['+s1+'].');
        }
      }
    }
 
    return lines;
  }

  validateClueText(info, s) {
    for (var i=0; i<s.length; i++) {
      // charCodeAt : returns an integer between 0 and 65535 representing the UTF-16 code unit at the given index.
      var n = s.charCodeAt(i);
      var c = s[i];
      // console.log('C=['+c+'] A=['+n+']');
      if (n >=32 && n <= 127) {
        // normal ascii set (not control chars)
      } else if (n >=128 && n <= 800) {
        // range of extended chars eg accents
      } else {
        this.msgMgr.addError( 'Invalid character in clue', info+'\n'
        +' - text = '+s+ '\n'
        +' - char#='+(i+1)+'\n'
        +' - char=['+c+']\n'
        +' - ascii='+n );
      }
    }
  }

  setupClueLinesInputFormat() {

    // target format:
    // (Y,X,A/D,ClueId,Answer,Clue)
          
    var clues = '';
    var numAcrossClues = 0;
    var numDownClues = 0;
    var firstCellKey = '';
    for (var y=1; y<=this.getMaxDown(); y++) {
      for (var x=1; x<=this.getMaxAcross(); x++) {
        // var cellKey = x+'.'+y;
        var cellKey = Util.cellKey(y,x); // x+'.'+y;
        var cell = this.cellMap.get(cellKey);
        if (cell != null) {
          var aClue = cell.acrossClue;
          if (aClue != null) {
            firstCellKey = aClue.getFirstCellKey();
            if (firstCellKey === cellKey) {
              clues += aClue.toInputFormat()+'\n';
              numAcrossClues++;
              // console.log('Added Across Clue#'+numAcrossClues+'  : '+aClue.toInputFormat());
            }
          }
          var dClue = cell.downClue;
          if (dClue != null) {
            firstCellKey = dClue.getFirstCellKey();
            if (firstCellKey === cellKey) {
              clues += dClue.toInputFormat()+'\n';
              numDownClues++;
              // console.log('Added Down Clue#'+numDownClues+'  : '+dClue.toInputFormat());
            }
          }
        }
      }
    }
          
    // console.log('# across clues = '+numAcrossClues);
  
    if (numAcrossClues === 0) {
      this.msgMgr.addWarn('validateClues : No across clues');
    }
    // console.log('# down clues = '+numDownClues);
    if (numDownClues === 0) {
      this.msgMgr.addWarn('validateClues : No down clues');
    }
    // console.log('# total clues = '+(numAcrossClues+numDownClues));
          
    // console.log('InputFormat=' + clues);
  
    clues = clues.trim();
    var clueLines = clues.split('\n');
          
    // console.log(clueLines.length+ ' clues');
    return clueLines;
    
  }

  setupClueMap() {
          
    var clueLines = this.setupClueLinesInputFormat();

    var n = 0;
  
    // Validate clues
    // (Y,X,A/D,ClueId,Answer,Clue)
         
    let clueMap = new Map();

    for (var i=0;i<clueLines.length; i++) {
      n = i+1;
      var cl = clueLines[i];
  
      // console.log('#'+n+' : '+cl);
      var p = cl.split('|');
      // console.log('#'+n+' : #parts='+p.length);
      if (p.length === 6) {
                  
        var y = p[0].trim();
        var yInt = 1 * y;
        if (yInt < 1) {
          // console.log('Clue#'+n+' : invalid Y value. <1');
          this.msgMgr.addWarn('validateClues : Clue#'+n+' : invalid Y value. <1 : '+cl);
          continue;
        }
        if (yInt > this.getMaxDown()) {
          this.msgMgr.addWarn('validateClues : Clue#'+n+' : invalid Y value : '+yInt+'. >max : '+cl);
          continue;
        }
        // console.log('y='+yInt);
                  
        var x = p[1].trim();
        var xInt = 1 * x;
        if (xInt < 1) {
          // console.log('Clue#'+n+' : invalid X value. <1');
          this.msgMgr.addWarn('validateClues : Clue#'+n+' : invalid X value. <1 : '+cl);
          continue;
        }
        if (xInt > this.getMaxAcross()) {
          // console.log('Clue#'+n+' : invalid X value. >max');
          this.msgMgr.addWarn( 'validateClues : Clue#'+n+' : invalid X value : '+xInt+'. >max : '+cl);
          continue;
        }
        // console.log('x='+xInt);
                
        var d = p[2].trim();
        d = d.toUpperCase();
        var isAcross = true;
        if (d !== 'A' && d !== 'D') {
          // console.log('Clue#'+n+' : invalid Direction value : '+d);
          this.msgMgr.addWarn('validateClues : Clue#'+n+' : invalid Direction value : '+d+' : '+cl);
          continue;
        }
        if (d === 'D') {
          isAcross = false;
        }
        // console.log('isAcross='+isAcross);
                  
        let clueId = p[3].trim();
        // console.log('clueId (info only)='+clueId);
  
        var answer = p[4].trim();
        answer = answer.toUpperCase();
        var answerLen = answer.length;
  
        if (answerLen < 0) {
          // console.log('Clue#'+n+' : answer length is zero');
          this.msgMgr.addWarn('validateClues : Clue#'+n+' : answer length is zero : '+cl);
          continue;
        }
        if (isAcross) {
          if (answerLen > this.getMaxAcross()) {
            // console.log('Clue#'+n+' : across answer length too long : '+answerLen);
            this.msgMgr.addWarn('validateClues : Clue#'+n+' : across answer length too long : '+answerLen+ ' : '+cl);
            continue;
          } 
        } else {
          if (answerLen > this.getMaxDown()) {
            // console.log('Clue#'+n+' : down answer length too long : '+answerLen);
            this.msgMgr.addWarn('validateClues : Clue#'+n+' : down answer length too long : '+answerLen+ ' : '+cl);
            continue;
          } 
        }
                  
        // console.log('answer='+answer);
                  
        var text = p[5].trim();
        // console.log('text=['+text+']');
                                
        var clueIdParts = clueId.split('.');
        var clueNum = 0;
        if (clueIdParts.length >= 2) {
           clueNum = 1 * clueIdParts[1];
        }
        var clue = new Clue(xInt, yInt, isAcross, clueId, answer, text, clueNum);
                  
        // var key = xInt+'.'+yInt;
        var key = Util.cellKey(yInt, xInt); // xInt+'.'+yInt;
        var firstCell = this.cellMap.get(key);
        if (firstCell == null) {
          // console.log('Clue#'+n+' : no firstcell for clue : '+clue.toInputFormat());
          this.msgMgr.addWarn('validateClues : Clue#'+n+' : no firstcell for clue : '+clue.toInputFormat()+' : '+cl);
          continue;
        }
  
        clue.firstCell = firstCell;
  
        var uniqLoc = clue.uniqLocation();
  
        if (clueMap.has(uniqLoc)) {
          // console.log('Clue#'+n+' uses unique location ('+uniqLoc+') already in use. ');
          this.msgMgr.addWarn('validateClues : Clue#'+n+' uses unique location ('+uniqLoc+') already in use. : '+cl);
          continue;
        } else {
          clueMap.set(uniqLoc, clue);
          // console.log('#'+n+' success');
        }
          
      } else {
        // console.log("Invalid clue line : ["+cl+"]");
        this.msgMgr.addWarn("validateClues : Invalid clue line : ["+cl+"]. Format : Y|X|A/D|ClueId|Answer|Clue");
      }
    }

    this.clueMap = clueMap;
  }

  setupLabels() {

    // setup labels
    var latestLabelNum = 0;
    // var n = 0;
    for (var y=1; y<=this.getMaxDown(); y++) {
      for (var x=1; x<=this.getMaxAcross(); x++) {
        // n++;
        // var cellKey = x+'.'+y;
        var cellKey = Util.cellKey(y,x); // x+'.'+y;
        // console.log('Cell#'+n+' : ... ====> .... row = '+y+' .... col = '+x);
        var c = this.cellMap.get(cellKey);
        if (c == null) {
          continue;
        } 
                  
        var acrossClue = c.acrossClue;
        if (acrossClue != null) {
          // console.log('.... AcrossClue : '+acrossClue.toInputFormat());
          var acrossPos = c.acrossPos;
          if (acrossPos === 0) {
            latestLabelNum++;
            c.label = latestLabelNum;
            // console.log('............. Label via ACROSS clue ===> '+c.label);
            acrossClue.firstCell = c;
                          
            // new for fr
            c.acrossLabel = acrossClue.n;
            // console.log('.... cell acrossLabel = '+c.acrossLabel);
  
            // console.log('.... clue firstCell = '+acrossClue.firstCell.toId());
          }
        } 
  
        var downClue = c.downClue;
        if (downClue != null) {
          // console.log('.... DownClue : '+downClue.toInputFormat());
                      
          var downPos = c.downPos;
          if (downPos === 0) {
            // only assign a new label if there is no label on the cell already
            if (c.label === 0) {
              latestLabelNum++;
              c.label = latestLabelNum;
              // console.log('............. Label via DOWN clue ===> '+c.label);
            } else {
              c.label = latestLabelNum;
              // console.log('............. Label via DOWN (re-use ACROSS) clue ===> '+c.label);
            }
                        
            downClue.firstCell = c;
                        
            // new for fr
            c.downLabel = downClue.n;
            // console.log('.... cell downLabel = '+c.downLabel);
  
            // console.log('.... clue firstCell = '+downClue.firstCell.toId());
                        
          }
        }
      }
    }
  }

  setupData() {
    for (var y=1; y<=this.getMaxDown(); y++) {
      for (var x=1; x<=this.getMaxAcross(); x++) {
        var cellKey = Util.cellKey(y,x); 
        var cell = this.cellMap.get(cellKey);
        if (cell == null) {
          continue;
        }
        this.setupDataForCell(cell);
      }
    }
  }

  setupDataForCell(cell) {
    var upId = '';
    var downId = '';
    var leftId = '';
    var rightId = '';
    var downCell = this.getActiveCellDown(cell, 1);
    if (downCell != null) {
      downId = downCell.toId();
    } 
    var upCell = this.getActiveCellDown(cell, -1);
    if (upCell != null) {
      upId = upCell.toId();
    } 
    var rightCell = this.getActiveCellAcross(cell, 1);
    if (rightCell != null) {
      rightId = rightCell.toId();
    } 
    var leftCell = this.getActiveCellAcross(cell, -1);
    if (leftCell != null) {
      leftId = leftCell.toId();
    } 

    var acrossClue = cell.acrossClue;
    var acrossLabel = '0';
    var nextAcrossLabel = '0';
    var prevAcrossLabel = '0';
    if (acrossClue != null) {
      acrossLabel = acrossClue.getLabel();
      var nextAcrossClue = this.getNextAcrossClue(acrossClue);
      if (nextAcrossClue != null) {
        nextAcrossLabel = nextAcrossClue.getLabel();
      }
      var prevAcrossClue = this.getPrevAcrossClue(acrossClue);
      if (prevAcrossClue != null) {
        prevAcrossLabel = prevAcrossClue.getLabel();
      }
    }

    var downClue = cell.downClue;
    var downLabel = '0';
    var nextDownLabel = '0';
    var prevDownLabel = '0';
    if (downClue != null) {
      downLabel = downClue.getLabel();
      var nextDownClue = this.getNextDownClue(downClue);
      if (nextDownClue != null) {
        nextDownLabel = nextDownClue.getLabel();
      }
      var prevDownClue = this.getPrevDownClue(downClue);
      if (prevDownClue != null) {
        prevDownLabel = prevDownClue.getLabel();
      }
    }

    this.dataCac = acrossLabel;
    this.dataNac = nextAcrossLabel;
    this.dataPac = prevAcrossLabel;
    this.dataCdo = downLabel;
    this.dataNdo = nextDownLabel;
    this.dataPdo = prevDownLabel;
    this.dataIup = upId;
    this.dataIdo = downId;
    this.dataIle = leftId;
    this.dataIri = rightId; 
  }

  getActiveCellDown(cell, n) {
    var maxDown = this.getMaxDown();
    var cell2 = null;
    var x = cell.x;
    var y = cell.y;
          
    var numTries = 0;
    while (true) {
      numTries++;
      if (numTries >= maxDown) {
        break;
      }
      var newY = y + n;
      if (newY < 1) {
        newY = maxDown;
      }
      if (newY > maxDown) {
        newY = 1;
      }
  
      var newKey = x+'.'+newY;
              
      cell2 = this.cellMap.get(newKey);
      if (cell2 != null) {
        break;
      }
              
      y = newY;
              
    }
    return cell2;       
  }

  getActiveCellAcross(cell, n) {
    var maxAcross = this.getMaxAcross();
    var cell2 = null;
    var x = cell.x;
    var y = cell.y;
          
    var numTries = 0;
    while (true) {
      numTries++;
      if (numTries >= maxAcross) {
        break;
      }
      var newX = x + n;
      if (newX < 1) {
        newX = maxAcross;
      }
      if (newX > maxAcross) {
        newX = 1;
      }
      var newKey = newX+'.'+y;
              
      cell2 = this.cellMap.get(newKey);
      if (cell2 != null) {
        break;
      }
              
      x = newX;
              
    }
    return cell2;       
  }

  getNextAcrossClue(clue) {
    var acrossClues = this.getAcrossClues();
    for (var i=0; i<acrossClues.length; i++) {
      var clue2 = acrossClues[i];
      var label2 = clue2.getLabel();
      if (label2 === clue.getLabel()) {
        var nextDisp = i + 1;
        if (nextDisp >= acrossClues.length) {
          nextDisp = 0;
        }
        return acrossClues[nextDisp];               
      }
    }
    return null;
  }

  getNextDownClue(clue) {
    var downClues = this.getDownClues();
    for (var i=0; i<downClues.length; i++) {
      var clue2 = downClues[i];
      var label2 = clue2.getLabel();
      if (label2 === clue.getLabel()) {
        var nextDisp = i + 1;
        if (nextDisp >= downClues.length) {
          nextDisp = 0;
        }
        return downClues[nextDisp];               
      }
    }
    return null;
  }
  
  getPrevAcrossClue(clue) {
    var acrossClues = this.getAcrossClues();
    for (var i=0; i<acrossClues.length; i++) {
      var clue2 = acrossClues[i];
      var label2 = clue2.getLabel();
      if (label2 === clue.getLabel()) {
        var nextDisp = i - 1;
        if (nextDisp < 0) {
          nextDisp = acrossClues.length-1;
        }
        return acrossClues[nextDisp];               
      }
    }
    return null;
  }

  getPrevDownClue(clue) {
    var downClues = this.getDownClues();
    for (var i=0; i<downClues.length; i++) {
      var clue2 = downClues[i];
      var label2 = clue2.getLabel();
      if (label2 === clue.getLabel()) {
        var nextDisp = i - 1;
        if (nextDisp < 0) {
          nextDisp = downClues.length-1;
        }
        return downClues[nextDisp];               
      }
    }
    return null;
  }

  getAcrossClues() {
    var list = [];
    for (let [key, clue] of this.clueMap) {
      if (clue.isAcross) {
        list.push(clue);    
      }
    }

    // let mapIter = this.clueMap.values();
    // let result = mapIter.next();
    // while (!result.done) {
    //   let clue = result.value;
    //   if (clue.isAcross) {
    //     list.push(clue);    
    //   }
    // }
    var blist = list.sort(this.sortCluesByLabel);
    return blist;
  }
  
  getDownClues() {
    var list = [];
    for (let [key, clue] of this.clueMap) {
      // console.log(key);
      if (!clue.isAcross) {
        list.push(clue);    
      }
    }
    // let mapIter = this.clueMap.values();
    // let result = mapIter.next();
    // while (!result.done) {
    //   let clue = result.value;
    //   if (!clue.isAcross) {
    //     list.push(clue);    
    //   }
    // }
    var blist = list.sort(this.sortCluesByLabel);
    return blist;
  }

  sortCluesByLabel(ca, cb) {
    if (ca.getLabel() > cb.getLabel()) {
      return 1;
    } else {
      return -1;
    }
  }

  // printGrid() {
  //   this.printCells();
  //   this.printLabels();
  //   this.printAcrossLabels();
  //   this.printDownLabels();
  //   this.printAcrossClues();
  //   this.printDownClues();
  // }



  // printCells() {

  //   let maxAcross = this.getMaxAcross();
  //   let maxDown = this.getMaxDown();

  //   var hdr = Util.header(maxAcross);
  //   // console.log('Text:');
  //   // console.log(hdr);  
  //   var acrossClue = '';
  //   var downClue = '';
  //   for (var y=1; y<=maxDown; y++) {
  //     var row = '  '+Util.formatNum(y)+ ' | ';
  //     for (var x=1; x<=maxAcross; x++) {
  //       var cellKey = Util.cellKey(y,x); // x+"."+y;
  //       var c = this.cellMap.get(cellKey);
  //       if (c == null) {
  //         row += '   .';
  //       } else {
  
  //         // check based on adjacent cell being available
  //         if (this.hasCellAdjacentAcross(c, 1) || this.hasCellAdjacentAcross(c, -1)) {
  //           acrossClue = c.acrossClue;
  //           if (acrossClue == null) {
  //             // console.log('Cell at '+cellKey+ ' has no across clue and should have one');
  //             this.msgMgr.addWarn('printCells : Cell at ( row : '+y+' ; column : '+x+' ) no across clue and should have one');
  //           }
  //         }
  //         if (this.hasCellAdjacentDown(c, 1) || this.hasCellAdjacentDown(c, -1)) {
  //           downClue = c.downClue;
  //           if (downClue == null) {
  //             // console.log('Cell at '+cellKey+ ' has no down clue and should have one');
  //             this.msgMgr.addWarn('printCells : Cell at ( row : '+y+' ; column : '+x+' ) no down clue and should have one');
  //           }
  //         }
  
  //         // simpler check - make sure each cell has at least one across / down clue
  //         acrossClue = c.acrossClue;
  //         if (acrossClue != null) {
  //           var acrossValue = c.acrossValue;
  //           row += '   '+Util.formatNum(acrossValue);
  //         } else {
  //           downClue = c.downClue;
  //           if (downClue != null) {
  //             var downValue = c.downValue;
  //             row += '   '+Util.formatNum(downValue);
  //           } else {
  //             // console.log('Cell at '+cellKey+ ' has no across/down clue');
  //             this.msgMgr.addWarn('printCells : Cell at ( row : '+y+' ; column : '+x+' ) has no across or down clue');
  //           }
  //         }
  //       }
  //     }
  //     // console.log(row);
  //   }
  // }

  // printLabels() {

  //   let maxAcross = this.getMaxAcross();
  //   let maxDown = this.getMaxDown();

  //   var hdr = Util.header(maxAcross);

  //   // console.log('Labels:');
  //   // console.log(hdr);
  
  //   for (var y=1; y<=maxDown; y++) {
  //     var row = '  '+Util.formatNum(y)+ ' | ';
  //     for (var x=1; x<=maxAcross; x++) {
  //       var cellKey = Util.cellKey(y,x); // x+"."+y;
  //       var c = this.cellMap.get(cellKey);
  //       if (c == null) {
  //         row += '   .';
  //       } else {
  //         var label = c.label;
  //         if (label > 0) {
  //           row += ' '+Util.formatNum(label);
  //         } else {
  //           row += '   x';
  //         }
  //       }
  //     }
  //     // console.log(row);
  //   }
  // }
  
  // printAcrossLabels() {

  //   let maxAcross = this.getMaxAcross();
  //   let maxDown = this.getMaxDown();

  //   var hdr = Util.header(maxAcross);

  //   // console.log('AcrossLabels:');
  //   // console.log(hdr);
  
  //   for (var y=1; y<=maxDown; y++) {
  //     var row = '  '+Util.formatNum(y)+ ' | ';
  //     for (var x=1; x<=maxAcross; x++) {
  //       var cellKey = Util.cellKey(y,x); // x+"."+y;
  //       var c = this.cellMap.get(cellKey);
  //       if (c == null) {
  //         row += '   .';
  //       } else {
  //         var acrossClue = c.acrossClue;
  //         if (acrossClue != null) {
  //           var aLabel = c.acrossLabel;
  //           row += ' '+Util.formatNum(aLabel);
  //         } else {
  //           row += '   x';
  //         }
  //       }
  //     }
  //     // console.log(row);
  //   }
  // }
  
  // printDownLabels() {

  //   let maxAcross = this.getMaxAcross();
  //   let maxDown = this.getMaxDown();

  //   var hdr = Util.header(maxAcross);

  //   // console.log('DownLabels:');
  //   // console.log(hdr);
  
  //   for (var y=1; y<=maxDown; y++) {
  //     var row = '  '+Util.formatNum(y)+ ' | ';
  //     for (var x=1; x<=maxAcross; x++) {
  //       var cellKey = Util.cellKey(y,x); // x+"."+y;
  //       var c = this.cellMap.get(cellKey);
  //       if (c == null) {
  //         row += '   .';
  //       } else {
  //         var downClue = c.downClue;
  //         if (downClue != null) {
  //           var aLabel = c.downLabel;
  //           row += ' '+Util.formatNum(aLabel);
  //         } else {
  //           row += '   x';
  //         }
  //       }
  //     }
  //     // console.log(row);
  //   }
  // }
  
  // printAcrossClues() {
  //   // console.log('AcrossClues:');
  //   var list1 = this.getAcrossClues();
  //   for (var i=0; i<list1.length; i++) {
  //     var clue = list1[i];
  //     var firstCell = clue.firstCell;
  //     if (firstCell == null) {
  //       // console.log('Across clue has no first cell : '+clue.toInputFormat());
  //       this.msgMgr.addWarn('printAcrossClues : Across clue has no first cell : '+clue.toInputFormat());
  //       continue;
  //     }
  //     var lab = firstCell.label;
  //     var extra = '';
  //     var alab = firstCell.acrossLabel;
  //     if (alab !== 0) {
  //       extra = ' ('+alab+') ';
  //     }
  //     // console.log(lab+'. '+extra+clue.text);
  //     // console.log('............ Ans = ['+clue.answer+']');
  //     var lastPos = firstCell.x+(clue.answer.length-1);
  //     // console.log('............ Row = '+firstCell.y +' ... Col : '+firstCell.x + ' - '+lastPos);
  //   }
  // }
  
  // printDownClues() {
  //   // console.log('DownClues:');
  //   var list1 = this.getDownClues();
  //   for (var i=0; i<list1.length; i++) {
  //     var clue = list1[i];
  //     var firstCell = clue.firstCell;
  //     if (firstCell == null) {
  //       // console.log('Down clue has no first cell : '+clue.toInputFormat());
  //       this.msgMgr.addWarn('printDownClues : Down clue has no first cell : '+clue.toInputFormat());
  //       continue;
  //     }
  //     var lab = firstCell.label;
  //     var extra = '';
  //     var alab = firstCell.downLabel;
  //     if (alab !== 0) {
  //       extra = ' ('+alab+') ';
  //     }
  //     // console.log(lab+'. '+extra+clue.text);
  //     // console.log('............ Ans = ['+clue.answer+']');
  //     var lastPos = firstCell.x+(clue.answer.length-1);
  //     // console.log('............ Row = '+firstCell.y +' ... Col : '+firstCell.x + ' - '+lastPos);
  //   }
  // }

  hasCellAdjacentAcross(cell, n) {
    var x = cell.x;
    var y = cell.y;
    var newX = x + n;
    var newKey = Util.cellKey(y, newX); // newX+'.'+y;            
    var cell2 = this.cellMap.get(newKey);
    if (cell2 != null) {
      return true;
    }
    return false;
  }

  hasCellAdjacentDown(cell, n) {
    var x = cell.x;
    var y = cell.y;
    var newY = y + n;
    var newKey = Util.cellKey(newY, x); // x+'.'+newY;         
    var cell2 = this.cellMap.get(newKey);
    if (cell2 != null) {
      return true;
    }
    return false;
  }

  getLabelCells() {
    let maxAcross = this.getMaxAcross();
    let maxDown = this.getMaxDown();
    var list = [];
    for (var y=1; y<=maxDown; y++) {
      for (var x=1; x<=maxAcross; x++) {
        var cellKey = Util.cellKey(y,x); // x+'.'+y;
        var cell = this.cellMap.get(cellKey);
        if (cell != null) {
          if (cell.label > 0) {
            list.push(cell);
          }
        }
      }
    }
    return list;
  }

  cellSelected(id) {
    // let cellKey = Util.cellKeyFromCellId(id);
    // let cell = this.cellMap(cellKey);
    // let acrossClue = cell.acrossClue
    // let asel = this.isClueSelected(acrossClue);

  }

}

export default Cword;