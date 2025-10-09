module.exports = {
  ifEquals: function(arg1, arg2, options) {
    return arg1 === arg2 ? options.fn(this) : options.inverse(this);
  },
  gte: function(a, b) {
    return a >= b; // return boolean, no options needed
  },
  eq: (a, b) => a === b,
  or: (a, b) => a || b,
};
