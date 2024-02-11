import sub from '../methods/observer';
import { bounds, iSet, cssSet } from '../methods/methods';
import { round, clamp, lerp } from '../../Math/math';

import trigger from './trigger';
import events from './events';

const isYDir = (dom, value, isY) => {
  if (isY) cssSet.form(dom, 'px', 0, value);
  else cssSet.form(dom, 'px', value, 0);
};
const inRange = (start, end, bs, kid, isY, l) => {
  if (start <= bs.z && end >= bs.a) {
    isYDir(kid, -l, isY);
    bs.out = false;
  } else {
    if (!bs.out) {
      isYDir(kid, -l, isY);
      bs.out = true;
    }
  }
};

/**
 * Creating virtual scrolling
 */
class Scroll {
  /**
   * @param {HTMLElement|Window} attacher - the parent
   * @param {Object} o - properties
   */
  constructor(attacher, o) {
    history.scrollRestoration = 'manual';
    this.target = o.target;

    this.ease = o.ease || 0.09;
    this.dir = o.dir ? o.dir : 'y';
    this.isY = this.dir == 'y';
    this.infinite = o.infinite;
    this.sub = sub.obs(o.obs || Symbol('foo'));

    this.iresize = sub.add('resize', this.resize.bind(this));
    this.iraf = sub.add('raf', this.raf.bind(this));
    this.resize();

    o.dir = this.dir;
    o.rafCb = this.loop.bind(this);
    this._$E = new events(attacher, o);
  }

  /**
   * Run on scolling
   */
  loop() {
    if (!this.iraf.item.on) this.iraf = sub.add('raf', this.raf.bind(this));
  }

  add(target, o) {
    o.obsname = this.sub.name;
    const tri = new trigger(target, o, this.dir);
    this.loop();
    return tri;
  }

  raf() {
    if (!this.kids) this._$E.scroll = clamp(0, this.dim, this._$E.scroll);
    const l = lerp(this._$E.virtual.value, this._$E.scroll, this.ease);

    this._$E.roll.virtual = lerp(
      this._$E.roll.virtual,
      this._$E.roll.value,
      this.ease
    );
    this._$E.virtual.value = l;

    if (this.kids) {
      if (l > this.dim) {
        this._$E.scroll = this._$E.scroll - this.dim;
        this._$E.virtual.value = l - this.dim;
      } else if (l < 0) {
        this._$E.scroll = this.dim + this._$E.scroll;
        this._$E.virtual.value = this.dim + l;
      }

      this.kids.map(([kid, bs]) => {
        const start = l;
        const end = start + this.s;

        if (l > this.dim - this.s) {
          const offsetS = l - (this.dim - this.s) - this.s;
          const offsetE = offsetS + this.s;

          if (offsetS <= bs.z && offsetE >= bs.a) {
            isYDir(kid, this.s - offsetE, this.isY);
          } else {
            inRange(start, end, bs, kid, this.isY, l);
          }
        } else {
          inRange(start, end, bs, kid, this.isY, l);
        }
      });
    } else {
      isYDir(this.target, -l, this.isY);
    }

    if (this.sub) this.sub.cb(this._$E.virtual.value);
    if (round(l, 2) == this._$E.scroll) this.iraf.r();
  }

  resize() {
    this.bs = bounds(this.target);

    if (this.infinite) {
      const childs = [...this.target.children];
      this.kids = childs.map(kid => {
        const a = this.isY ? kid.offsetTop : kid.offsetLeft;
        const z = this.isY ? kid.offsetHeight : kid.offsetWidth;
        return [kid, { a, z: a + z }];
      });
    }

    const d = this.isY ? 'h' : 'w';
    this.s = iSet.size[d];

    this.dim = this.bs[d] - (this.kids ? 0 : this.s);
    this.loop();
  }

  /**
   * Remove events
   */
  destroy() {
    this.iraf.r();
    this.sub.r();
    this.iresize.r();

    this._$E._destroy();
  }
}

export default Scroll;
