import createTween from "./tools/createTween";

class TL {
  constructor() {
    this.items = [];
    this.reverseItems = [];
    this.selector = [];
    this.id = -1;
    this.del = 0;

    this.played = false;
  }

  to(element, o, time = 0) {
    if (!element || !o) {
      var err = !element
        ? "You need to pass Element"
        : "You need to pass Object";

      console.error(err);
      return;
    }

    createTween.call(this, element, o, time);
    return this;
  }

  pause() {
    this.items.map((tw) => {
      tw.tween.pause();
    });
  }

  resume() {
    this.items.map((tw) => {
      tw.tween.resume();
    });
  }

  reverse() {
    this.id = -1;
    this.del = 0;

    this.items.map((tw, i, arr) => {
      if (tw.tween.tw.running) {
        tw.tween.reverse(0);
      } else {
        let previous = arr[arr.length - 1 - i].tween.tw;

        if (previous.running) tw.tween.reverse(previous.del);
        else tw.tween.reverse(tw.tween.tw.del);
      }
    });

    this.items = [];
  }
}

export default TL;
