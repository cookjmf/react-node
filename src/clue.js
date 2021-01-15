/*
  Clue : a crossword clue
  y : row in grid of first letter
  x : column in grid of first letter

  isAcross : true if across , false if down
  clueNumber : number of clue
  answer : the solution for clue
  text : the text of clue
  n : ordinal of clue on row / column 
  firstCell : the Cell of first letter
  answerLen : length of answer
*/
class Clue {
  constructor(y, x, isAcross, clueNumber, answer, text, n) {
    this.y = y;
    this.x = x;
    this.isAcross = isAcross;
    this.clueNumber = clueNumber;
    this.answer = answer;
    this.text = text;
    this.n = n;
    this.firstCell = null;
  }

  getAnswerLen() {
    let len = 0;
    if (this.answer != null) {
      len = this.answer.length;
    }
    return len;
  }
}

export default Clue;