import React from 'react';
import PlayCell from './playCell';
import * as Util from './util';

class PlayBoard extends React.Component {

  constructor(props) {
    
    super(props);
    console.log('PlayBoard : constructor : enter');
    this.state = {};
  }

  componentDidMount() {
    console.log('PlayBoard : componentDidMount : enter');
  }

  render() {
    console.log('PlayBoard : render : enter');

    let cword = this.props.cword;

    let size = cword.size;

    let numberedMaxAcross = Util.numberedMaxAcross(size);
    let numberedMaxDown = Util.numberedMaxDown(size);

    let boardArray = [];
    for (let y=1; y<=numberedMaxAcross; y++) {
      for (let x=1; x<=numberedMaxDown; x++) {
        boardArray.push(Util.cellKey(y,x));
      }
    }

    return (
      <>
      { boardArray.map( 
        (boardArrayKey, index) => { 
          console.log("create playCell for boardArrayKey : ..."+boardArrayKey+"... index : "+index);
          return(
            <PlayCell 
              key={boardArrayKey}
              boardArrayKey={boardArrayKey}
              numberedMaxAcross={numberedMaxAcross}
              numberedMaxDown={numberedMaxDown}
              cword={cword}
              onClick={ this.props.onClickPlayCell }
            />
          );
        } 
      ) }
      </>
    );
  }
}

export default PlayBoard;
