import { lerp } from '../../math/math';

/**
 * @param {object} endValue
 * @param {elementContextType}
 * @return {Function}
 */
const opacity = (endValue, { computed }) => {
  const start = +computed.opacity;
  return (t) => `${lerp(start, endValue, t)}`;
};

export default {
  name: 'opacity',
  callback: opacity,
};