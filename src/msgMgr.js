import Msg from './msg';

class MsgMgr {
  constructor() {
    this.clear();
  }

  addError(text) {
    console.log("added ERROR : "+text);
    this.errors.push(new Msg('E', text));
  }

  addWarn(text) {
    console.log("added WARN : "+text);
    this.warnings.push(new Msg('W', text));
  }

  addInfo(text) {
    console.log("added INFO : "+text);
    this.infos.push(new Msg('I', text));
  }

  empty() {
    let num = this.errors.length + this.warnings.length + this.infos.length;
    if (num === 0) {
      return true;
    }
    return false;
  }

  getMsg() {
    // find the most important msg
    if (this.errors.length > 0) {
      return this.errors[this.errors.length-1];
    } else if (this.warnings.length > 0) {
      return this.warnings[this.warnings.length-1];
    } else if (this.infos.length > 0) {
      return this.infos[this.infos.length-1];
    }
    return null;
  }

  clear() {
    this.errors = [];
    this.warnings = [];
    this.infos = [];
  }
}

export default MsgMgr;