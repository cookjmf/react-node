import React from 'react';

class ParamAcrossClues extends React.Component {

  constructor(props) {
    
    super(props);
    console.log('ParamAcrossClues : constructor : enter');
    this.state = {};
  }

  componentDidMount() {

  }
  
  render() {
    console.log('ParamAcrossClues : render : enter');

    let size = this.props.size;
    let suf = size+'by'+size;
    let taClass="cw-clues-param-text-"+suf;

    let horizClues = "";
    if (this.props.horizClues != null) {
      horizClues = ''+this.props.horizClues;
    }
    let ph = "Enter Across Clues";
    let text = "";
    if (horizClues.length > 0) {
      text = ''+horizClues;
      ph = "";
    } 

    return (
      <>
      <div id="cw-clues-list-across" className="cw-clues-list-across">
        <div id="cw-clues-list-across-title" className="cw-clues-list-title">
          Across
        </div>
        <div >
          <textarea id="cw-clues-param-across-text" className={taClass}
          placeholder={ph}
          onKeyUp={(ev) => this.props.onKeyUp(ev.target.value)}
          onChange={(ev) => this.props.onKeyUp(ev.target.value)}
          value={text}
          >
          </textarea>
        </div>
      </div>
      </>
    );
  }

}

export default ParamAcrossClues;
