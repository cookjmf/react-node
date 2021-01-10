import React from 'react';
import ParamBoard from './paramBoard';
import ParamAcrossClues from './paramAcrossClues';
import ParamDownClues from './paramDownClues';
import * as Util from './util';

class Param extends React.Component {

  constructor(props) {
    
    super(props);
    console.log('Param : constructor : enter');
    this.state = {};
  }

  componentDidMount() {
    console.log('Param : componentDidMount : enter');
  }

  componentDidUpdate() {
    console.log('Param : componentDidUpdate : enter');
  }
  
  render() {
    console.log('Param : render : enter');

    // console.log('Param : render : props : ...'+JSON.stringify(this.props)+'...');

    // props: name, size

    let size = this.props.size;

    let na = Util.numberedMaxAcross(size);
    let nd = Util.numberedMaxDown(size);

    let suffix = na+'by'+nd;
    let boardClassName = 'cw-board-'+suffix;
    let cluesClassName = 'cw-clues-'+suffix;

    return (
      <div id="cw-params-cont" className="cw-cont">
        <div id="cw-params-board" className={boardClassName}>
          <ParamBoard
            size={ this.props.size}
            onClickParamCell={ this.props.onClickParamCell }
            cells={ this.props.cells }
          >
          </ParamBoard>
          <div id="cw-param-clues" className={cluesClassName}>
            <a className="cw-clues-info" href={Util.OCR_ONLINE_URL}
            target = "_blank" rel="noreferrer">
              Parse clues using OnlineOCR
            </a>
            <ParamAcrossClues
              size={this.props.size}
              horizClues={this.props.horizClues}   
              onKeyUp={ this.props.onKeyUpParamAcrossTextarea }
            >         
            </ParamAcrossClues>
            <ParamDownClues
              size={this.props.size}
              vertClues={this.props.vertClues}
              onKeyUp={ this.props.onKeyUpParamDownTextarea }
            >
            </ParamDownClues>
          </div>
        </div>
      </div>
    );
    
  }

}

export default Param;
