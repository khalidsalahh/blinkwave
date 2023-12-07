/**
 * Observer
 */
class Observer {
  constructor() {
    this.observers = {};
  }

  /**
   * @param {String} name - observer name
   */
  obs(name) {
    this.observers[name] = { items: [] };
    function callItem() {
      let target = this[name];
      let args = Array.prototype.slice.call(arguments);

      for (let i = 0; i < target.items.length; i++) {
        target.items[i].cb(...args);
      }
    }

    let r = (name) => {
      this.observers[name].items = [];
    };

    return {
      cb: callItem.bind(this.observers),
      name,
      r: r.bind(this, name),
    };
  }

  /**
   * @param {String} name - observer name
   * @param {Function} cb - callback function
   */
  add(name, cb) {
    if (!this.observers[name]) console.error(name);

    let items = this.observers[name].items;
    let obj = { cb, id: items.length + 1, on: true };

    items.push(obj);

    let r = (o) => {
      for (let i = 0; i < items.length; i++) {
        if (items[i].id == o) {
          items[i].on = false;
          items.splice(i, 1);
        }
      }
    };

    return {
      item: obj,
      r: r.bind({}, obj.id),
    };
  }

  /**
   * @param {String} name - observer name
   */
  check(name) {
    return this.observers[name] ? true : false;
  }
}

export default new Observer();