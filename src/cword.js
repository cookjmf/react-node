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
            let cellId = Util.toCellId(y, x);
            this.cellValues[cellId] = val;
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
          console.log('Setup cell at '+cellKey);
        }
      }
    }
    console.log('Setup '+cellMap.size+' cells');
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
      console.log('BlankLine#'+(i+1)+' ['+line+']');
      let lineParts = line.split(' ');
      if (lineParts.length !== 2) {
        console.log("Bad # parts, need 2, but have : "+lineParts.length);
      }
      let yVal = 1 * lineParts[0];
      if (yVal < 1) {
        console.log('getBlankMap : y is < 1 : '+yVal);
      }
      if (yVal > maxDown) {
        console.log('getBlankMap : y is > maxDown : '+yVal);
      }
      let xVals = lineParts[1];
      let xParts = xVals.split(',');
      for (let j = 0; j < xParts.length; j++) {
        let xVal = 1 * xParts[j];
        if (xVal < 1) {
          console.log('getBlankMap : x is < 1 : '+xVal);
        }
        if (xVal > maxAcross) {
          console.log('getBlankMap : x is > maxAcross : '+xVal);
        }
 
        // let key = Util.toCellId(yVal, xVal);
        let key = Util.cellKey(yVal, xVal);
        blankMap.set(key, key);
        console.log('Setup blank at : '+key);
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
        console.log('cell->toMap .... cellId : ['+cellId+']');

        let val = cellValues[cellId];
        if (val != null && val.length > 0) {
          let cellKey = Util.cellKey(y,x);
          if (!valueMap.has(cellKey)) {
            valueMap.set(cellKey, val);
            console.log('............ cell->toMap : ['+cellKey+'] : ['+val+']');
          } else {
            console.log('Dup value from CELL_VALUES for : ['+cellKey+']');
          }
        }      
      }
    }
    return valueMap;
  }

  toggleParamCell(id) {
    console.log('Cword : toggleParamCell : enter : id : '+id);

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

  // new stuff
  validate() {

    // build the grid
    this.buildGrid();
  
    // // print grid 
    // printGrid();

    let msg = this.msgMgr.firstMsg();
    if (msg != null) {

      msg.prefix = 'Failed Validation.';
    //   showMessages();
  
    } else {

      this.msgMgr.addInfo('Passed Validation.');
    //   showInfoMessage('Passed Validation');
      msg = this.msgMgr.msg();
      
    }

    return msg;
  
  }

  buildGrid() {
    // this.initCellMap();
    this.initAcrossClues();
    this.initDownClues();
    var clueLines = this.setupClueLinesInputFormat();
    this.validateClueLinesInputFormat(clueLines);
    this.setupLabels();
  }

  getClueRegExp() {
    var separators = [ '\\.' ,'?', '!' ];
    var sepRe = new RegExp('([' + separators.join('') + '])+');
    return sepRe;
  }

  initAcrossClues() {

    // The across clues
    let acrossClueMap = new Map();
  
    var sepRe = this.getClueRegExp();
  
    // setup across clues
    const acrossLines = this.getLines(this.getMaxAcross(), this.horizClues, 'across');
    console.log('Setup '+acrossLines.length+' acrossLines');
  
    this.validateClueLines('across', acrossLines, this.getMaxDown());
  
    for (var i=0; i<acrossLines.length; i++) {
      var line = acrossLines[i];
      line = line.trim();
      console.log('clue across line : '+(i+1)+' ...['+line+']');
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
            console.log('across clue: '+cid+' ...['+ct+'] ['+delim+']');
            var clue = new Clue(i+1, 0, true, cid, '', ct+''+delim, num);
            var list = acrossClueMap.get(m);
            if (list == null) {
              list = [];
              acrossClueMap.set(m, list);
            }
            list.push(clue);
            console.log('-------> '+this.name+' --> For row ['+m+'] added across clue#'+list.length+' ['+clue.text+']');
          }
        }
      } else {
        this.msgMgr.addError('Invalid across clue', 
        'Bad across clue line number at clue line # '+(i+1)+'.\nFound ( '+first+' ), but expected ( '+m+' )');
      }
    }
  
    // join the across clues to the cells
    for (var y=1; y<=this.getMaxAcross(); y++) {
      var cList = acrossClueMap.get(''+y);
      if (cList == null) {
        console.log('No clues when y='+y);
        continue;
      }
      console.log('For y='+y+' ... #clues='+cList.length);
      var currentClue = null;
      var disp = -1;
  
      var cluesMatched = 0;
  
      for (var x=1; x<=this.getMaxDown(); x++) {
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
          console.log('Across Clue : at '+cellKey+ ' : ['+currentClue.text+']');
          currentClue.answerLen++;
  
          cell.acrossValue = 'X';
          cell.acrossPos = currentClue.answerLen-1;
          cell.acrossClue = currentClue;
          cluesMatched++;
  
        } else {
  
          // cell is blank 
          if (currentClue != null) {
            console.log('Len of Across clue : '+currentClue.answerLen);
          }
          currentClue = null;
        }
      }
  
      // end of row
      if (currentClue != null) {
        console.log('Len of Across clue : '+currentClue.answerLen);
      }
  
      if (cluesMatched === cList.length) {
        console.log('all clues matched ('+cluesMatched+')');
      } else if (cluesMatched < cList.length) {
        console.log('NOT all clues matched. There are ('+cList.length+') but only '+cluesMatched+' fit in grid'); 
        this.msgMgr.addError('Invalid across clues for grid.',          
              'Unused clues on row '+y+'.\n'+
              'There are '+cList.length+' clues on row '+y+' but only '+cluesMatched+' fit in grid\n'
              );     
      } else {
        console.log('Too many clues matched. There are ('+cList.length+') however '+cluesMatched+' fit in grid'); 
        this.msgMgr.addError('Invalid across clues for grid.',          
              'Too many clues used on row '+y+'\n'
              ); 
      }
  
    }
  
  }

  initDownClues() {

    // The down clues
    let downClueMap = new Map();
  
    // setup down clues
    const downLines = this.getLines(this.getMaxAcross(), this.vertClues, 'down');
  
    console.log('Setup '+downLines.length+' downLines');
  
    this.validateClueLines('down', downLines, this.getMaxAcross());
  
    var sepRe = this.getClueRegExp();
  
    for (var i=0; i<downLines.length; i++) {
      var line = downLines[i];
      line = line.trim();
      console.log('clue down line : '+(i+1)+' ...['+line+']');
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
            console.log('down clue: '+cid+' ...['+ct+'] ['+delim+']');
            var clue = new Clue(i+1, 0, false, cid, '', ct+''+delim, num);
            var list = downClueMap.get(m);
            if (list == null) {
              list = [];
              downClueMap.set(m, list);
            }
            list.push(clue);
            console.log('-------> '+this.name+' --> For column ['+m+'] added down clue#'+list.length+' ['+clue.text+']');
          }
        }
      } else {
        this.msgMgr.addError('Invalid down clue', 
        'Bad down clue line number at clue line # '+(i+1)+'.\nFound ( '+first+' ), but expected ( '+m+' )');
      }
    }
  
    // join the down clues to the cells
    for (var x=1; x<=this.getMaxAcross(); x++) {
      var cList = downClueMap.get(''+x);
      if (cList == null) {
        console.log('No clues when x='+x);
        continue;
      }
      console.log('For x='+x+' ... #clues='+cList.length);
  
      var currentClue = null;
      var disp = -1;
  
      var cluesMatched = 0;
  
      for (var y=1; y<=this.getMaxDown(); y++) {
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
          console.log('Down Clue : at '+cellKey+ ' : ['+currentClue.text+']');
          currentClue.answerLen++;
                      
          cell.downValue = 'X';
          cell.downPos = currentClue.answerLen-1;
                      
          cell.downClue = currentClue;
          cluesMatched++;
  
  
        } else {
          // cell is blank 
          if (currentClue != null) {
            console.log('Len of Down clue : '+currentClue.answerLen);
          }
          currentClue = null;
        }
      }
  
      // end of row
      if (currentClue != null) {
        console.log('Len of Down clue : '+currentClue.answerLen);
      }
  
      if (cluesMatched === cList.length) {
        console.log('all clues matched ('+cluesMatched+')');
      } else if (cluesMatched < cList.length) {
        console.log('NOT all clues matched. There are ('+cList.length+') but only '+cluesMatched+' fit in grid'); 
        this.msgMgr.addError('Invalid down clues for grid.',          
              'Unused clues on column '+x+'.\n'+
              'There are '+cList.length+' clues on column '+x+' but only '+cluesMatched+' fit in grid\n'
              );     
      } else {
        console.log('Too many clues matched. There are ('+cList.length+') however '+cluesMatched+' fit in grid');  
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
        console.log('On the line after last legal line');
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
      console.log('C=['+c+'] A=['+n+']');
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
              console.log('Added Across Clue#'+numAcrossClues+'  : '+aClue.toInputFormat());
            }
          }
          var dClue = cell.downClue;
          if (dClue != null) {
            firstCellKey = dClue.getFirstCellKey();
            if (firstCellKey === cellKey) {
              clues += dClue.toInputFormat()+'\n';
              numDownClues++;
              console.log('Added Down Clue#'+numDownClues+'  : '+dClue.toInputFormat());
            }
          }
        }
      }
    }
          
    console.log('# across clues = '+numAcrossClues);
  
    if (numAcrossClues === 0) {
      this.msgMgr.addWarn('validateClues : No across clues');
    }
    console.log('# down clues = '+numDownClues);
    if (numDownClues === 0) {
      this.msgMgr.addWarn('validateClues : No down clues');
    }
    console.log('# total clues = '+(numAcrossClues+numDownClues));
          
    console.log('InputFormat=' + clues);
  
    clues = clues.trim();
    var clueLines = clues.split('\n');
          
    console.log(clueLines.length+ ' clues');
    return clueLines;
    
  }

  validateClueLinesInputFormat(clueLines) {
          
    var n = 0;
  
    // Validate clues
    // (Y,X,A/D,ClueId,Answer,Clue)
         
    let clueMap = new Map();

    for (var i=0;i<clueLines.length; i++) {
      n = i+1;
      var cl = clueLines[i];
  
      console.log('#'+n+' : '+cl);
      var p = cl.split('|');
      console.log('#'+n+' : #parts='+p.length);
      if (p.length === 6) {
                  
        var y = p[0].trim();
        var yInt = 1 * y;
        if (yInt < 1) {
          console.log('Clue#'+n+' : invalid Y value. <1');
          this.msgMgr.addWarn('validateClues : Clue#'+n+' : invalid Y value. <1 : '+cl);
          continue;
        }
        if (yInt > this.getMaxDown()) {
          this.msgMgr.addWarn('validateClues : Clue#'+n+' : invalid Y value : '+yInt+'. >max : '+cl);
          continue;
        }
        console.log('y='+yInt);
                  
        var x = p[1].trim();
        var xInt = 1 * x;
        if (xInt < 1) {
          console.log('Clue#'+n+' : invalid X value. <1');
          this.msgMgr.addWarn('validateClues : Clue#'+n+' : invalid X value. <1 : '+cl);
          continue;
        }
        if (xInt > this.getMaxAcross()) {
          console.log('Clue#'+n+' : invalid X value. >max');
          this.msgMgr.addWarn( 'validateClues : Clue#'+n+' : invalid X value : '+xInt+'. >max : '+cl);
          continue;
        }
        console.log('x='+xInt);
                
        var d = p[2].trim();
        d = d.toUpperCase();
        var isAcross = true;
        if (d !== 'A' && d !== 'D') {
          console.log('Clue#'+n+' : invalid Direction value : '+d);
          this.msgMgr.addWarn('validateClues : Clue#'+n+' : invalid Direction value : '+d+' : '+cl);
          continue;
        }
        if (d === 'D') {
          isAcross = false;
        }
        console.log('isAcross='+isAcross);
                  
        let clueId = p[3].trim();
        console.log('clueId (info only)='+clueId);
  
        var answer = p[4].trim();
        answer = answer.toUpperCase();
        var answerLen = answer.length;
  
        if (answerLen < 0) {
          console.log('Clue#'+n+' : answer length is zero');
          this.msgMgr.addWarn('validateClues : Clue#'+n+' : answer length is zero : '+cl);
          continue;
        }
        if (isAcross) {
          if (answerLen > this.getMaxAcross()) {
            console.log('Clue#'+n+' : across answer length too long : '+answerLen);
            this.msgMgr.addWarn('validateClues : Clue#'+n+' : across answer length too long : '+answerLen+ ' : '+cl);
            continue;
          } 
        } else {
          if (answerLen > this.getMaxDown()) {
            console.log('Clue#'+n+' : down answer length too long : '+answerLen);
            this.msgMgr.addWarn('validateClues : Clue#'+n+' : down answer length too long : '+answerLen+ ' : '+cl);
            continue;
          } 
        }
                  
        console.log('answer='+answer);
                  
        var text = p[5].trim();
        console.log('text=['+text+']');
                                
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
          console.log('Clue#'+n+' : no firstcell for clue : '+clue.toInputFormat());
          this.msgMgr.addWarn('validateClues : Clue#'+n+' : no firstcell for clue : '+clue.toInputFormat()+' : '+cl);
          continue;
        }
  
        clue.firstCell = firstCell;
  
        var uniqLoc = clue.uniqLocation();
  
        if (clueMap.has(uniqLoc)) {
          console.log('Clue#'+n+' uses unique location ('+uniqLoc+') already in use. ');
          this.msgMgr.addWarn('validateClues : Clue#'+n+' uses unique location ('+uniqLoc+') already in use. : '+cl);
          continue;
        } else {
          clueMap.set(uniqLoc, clue);
          console.log('#'+n+' success');
        }
          
      } else {
        console.log("Invalid clue line : ["+cl+"]");
        this.msgMgr.addWarn("validateClues : Invalid clue line : ["+cl+"]. Format : Y|X|A/D|ClueId|Answer|Clue");
      }
    }
  }

  setupLabels() {

    // setup labels
    var latestLabelNum = 0;
    var n = 0;
    for (var y=1; y<=this.getMaxDown(); y++) {
      for (var x=1; x<=this.getMaxAcross(); x++) {
        n++;
        // var cellKey = x+'.'+y;
        var cellKey = Util.cellKey(y,x); // x+'.'+y;
        console.log('Cell#'+n+' : ... ====> .... row = '+y+' .... col = '+x);
        var c = this.cellMap.get(cellKey);
        if (c == null) {
          continue;
        } 
                  
        var acrossClue = c.acrossClue;
        if (acrossClue != null) {
          console.log('.... AcrossClue : '+acrossClue.toInputFormat());
          var acrossPos = c.acrossPos;
          if (acrossPos === 0) {
            latestLabelNum++;
            c.label = latestLabelNum;
            console.log('............. Label via ACROSS clue ===> '+c.label);
            acrossClue.firstCell = c;
                          
            // new for fr
            c.acrossLabel = acrossClue.n;
            console.log('.... cell acrossLabel = '+c.acrossLabel);
  
            console.log('.... clue firstCell = '+acrossClue.firstCell.toId());
          }
        } 
  
        var downClue = c.downClue;
        if (downClue != null) {
          console.log('.... DownClue : '+downClue.toInputFormat());
                      
          var downPos = c.downPos;
          if (downPos === 0) {
            // only assign a new label if there is no label on the cell already
            if (c.label === 0) {
              latestLabelNum++;
              c.label = latestLabelNum;
              console.log('............. Label via DOWN clue ===> '+c.label);
            } else {
              c.label = latestLabelNum;
              console.log('............. Label via DOWN (re-use ACROSS) clue ===> '+c.label);
            }
                        
            downClue.firstCell = c;
                        
            // new for fr
            c.downLabel = downClue.n;
            console.log('.... cell downLabel = '+c.downLabel);
  
            console.log('.... clue firstCell = '+downClue.firstCell.toId());
                        
          }
        }
      }
    }
  }

}

export default Cword;