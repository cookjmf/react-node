class Msg {
  constructor(sev, text) {
    this.text = text;
    this.sev = sev;
    if (sev === 'E') {
      this.cls = 'cw-message-error';
    } else if (sev === 'W') {
      this.cls = 'cw-message-warn';
    } else if (sev === 'I') {
      this.cls = 'cw-message-info';
    }
  }
}

export default Msg;