import * as Util from './util';

/*
  Cell : a square in the crossword grid
  y : row , from top to bottom, starts with 1
  x : column , from left to right , starts with 1
  label : number in top left corner of cell
  value : the value 
  acrossClue : the across clue that this cell is part of
  acrossPos : the position in the across clue 
  acrossLabel : the label of the across clue
  downClue : the down clue that this cell is part of
  downPos : the position in the down clue
  downLabel : the label of the down clue
*/

class Cell {
  constructor(y, x) {
    this.y = y;
    this.x = x;   
    this.label = 0;
    this.value = '';

    this.acrossClue = null;
    this.acrossPos = 0;
    this.acrossLabel = 0;

    this.downClue = null;
    this.downPos = 0;
    this.downLabel = 0;
  }

  toId() {
    return Util.toCellId(this.y, this.x);
  }
}

export default Cell;