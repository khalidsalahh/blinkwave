function checkElement(element) {
  var result = [];

  if (typeof element === "string") {
    var els = document.querySelectorAll(element);

    if (els.length === 0) {
      console.error("Found no element");
    } else {
      result = new Array(...els);
    }
  } else if (element instanceof window.HTMLElement) {
    result.push(element);
  } else if (typeof element === "object") {
    result.push(element);
  }

  return result;
}

export default function Element(element) {
  if (Array.isArray(element)) {
    this.element.map((e) => {
      this.selector.push(checkElement(e));
    });
  } else {
    this.selector.push(checkElement(element));
  }
}