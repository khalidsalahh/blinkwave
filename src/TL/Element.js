export default function checkElement(element) {
  if (typeof element === "string") {
    var els = document.querySelectorAll(element);
    if (els.length === 0) {
      console.error("Found no element");
    } else {
      this.selector = new Array(...els);
    }
  } else if (element instanceof window.HTMLElement) {
    this.selector.push(element);
  }
}
