import React from 'react';
import PlayBoard from './playBoard';
import PlayAcrossClues from './playAcrossClues';
import PlayDownClues from './playDownClues';
import * as Util from './util';

class Play extends React.Component {

  constructor(props) {
    
    super(props);
    console.log('Play : constructor : enter');
    this.state = {};
  }

  componentDidMount() {
    console.log('Play : componentDidMount : enter');
  }

  componentDidUpdate() {
    console.log('Play : componentDidUpdate : enter');
  }
  
  render() {
    console.log('Play : render : enter');

    let cword = this.props.cword;
    
    let size = cword.size;

    let na = Util.numberedMaxAcross(size);
    let nd = Util.numberedMaxDown(size);

    let suffix = na+'by'+nd;
    let boardClassName = 'cw-board-'+suffix;
    let cluesClassName = 'cw-clues-'+suffix;

    const style1 = {
      'display': 'none'
    };

    return (
      <div id="cw-cont" className="cw-cont">

        <div id="cw-selclue" className="cw-clues-current"
        style={style1} >
        </div>

        <div id="cw-board" className={boardClassName}>
          <PlayBoard
            cword={ cword}
            onClickPlayCell={ this.props.onClickPlayCell }
          >
          </PlayBoard>
          <div id="cw-clues" className={cluesClassName}>
            <PlayAcrossClues
              cword={ cword} 
              onClick={ this.props.onClickPlayAcrossClues }
            >         
            </PlayAcrossClues>
            <hr>
            </hr>
            <PlayDownClues
              cword={ cword} 
              onClick={ this.props.onClickPlayDownClues }
            >
            </PlayDownClues>
          </div>
        </div>
      </div>
    );

  }

}

export default Play;
