export class DomElement {
  constructor(element) {
    this.element = element;
    this.onClickcb = undefined;
    this._data = null;
  }

  set data(data) {
    this._data = data;
  }

  get data() {
    return this._data;
  }

  static fromId(elementId) {
    return new DomElement(document.getElementById(elementId));
  }

  onClick(cb = undefined) {
    $(this.element).on("click", (e) => {
      e.preventDefault();
      if (cb) {
        this.onClickcb = cb;
        return cb(this._data);
      } else if (this.onClickcb) {
        return this.onClickcb(this._data);
      }
    });
  }

  triggerClick() {
    $(this.element).trigger("click");
  }
}
