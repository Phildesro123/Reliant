export default class Container {
  constructor(type, id, range, selectionText, top, startX, content = []) {
    this.className = type + '-container';
    this.id = id;
    this.selectionText = selectionText;
    this.selectionTop = top;
    this.top = top;
    this.bottom = 0;
    this.shift = 0;
    this.buttonText = type == 'comment' ? 'Comment' : 'Save';
    this.startX = startX;
    /**
     * Content is an array of objects
     * {
     * userId: String,
     * displayName: String,
     * content: String
     * time: time
     * }
     */
    this.content = content;
    this.range = range;
  }

  get getSelectionTop() {
    //TODO: get top of selection dynamically
  }
}
