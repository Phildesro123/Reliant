export default class Container {
  constructor(type, id, selectionText, top, startX) {
    this.className = type + '-container';
    this.id = id;
    this.selectionText = selectionText;
    this.selectionTop = top;
    this.top = top;
    this.bottom = 0;
    this.shift = 0;
    this.buttonText = type == 'comment' ? 'Comment' : 'Save';
    this.startX = startX;
    this.comments = [];
  }
}
