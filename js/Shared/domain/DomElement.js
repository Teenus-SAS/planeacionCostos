export class DomElement {
  constructor(element) {
    this.element = element;
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

  onClick(cb = undefined, aftercb = undefined) {
    const callback = cb || this.onClickcb;
    $(this.element).on("click", (e) => {
      e.preventDefault();
    });
    if (callback) {
      $(this.element).on("click", async (e) => {
        e.preventDefault();
        await callback(this._data);
        if (aftercb) {
          aftercb();
        }
      });
    }
  }

  triggerClick() {
    $(this.element).trigger("click");
  }
}
