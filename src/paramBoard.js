import React from 'react';
import ParamCell from './paramCell';
import * as Util from './util';

class ParamBoard extends React.Component {

  constructor(props) {
    
    super(props);
    console.log('ParamBoard : constructor : enter');
    this.state = {};
  }

  componentDidMount() {
    console.log('ParamBoard : componentDidMount : enter');
  }

  render() {
    console.log('ParamBoard : render : enter');

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
          console.log("create paramCell for boardArrayKey : ..."+boardArrayKey+"... index : "+index);
          return(
            <ParamCell 
              key={boardArrayKey}
              boardArrayKey={boardArrayKey}
              numberedMaxAcross={numberedMaxAcross}
              numberedMaxDown={numberedMaxDown}
              cword={cword}
              onClick={ this.props.onClickParamCell }
            />
          );
        } 
      ) }
      </>
    );
  }
}

export default ParamBoard;
