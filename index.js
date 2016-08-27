var _ = require('lodash');

module.exports = function(results, objects, strict) {
  strict = !!strict;

  if (!results)
    return (strict) ? undefined : {};

  if (!objects)
		return results;

  if (!_.isArray(objects))
    if (_.isString(objects))
      objects = [objects];
    else
      return results;

  var predicate = function(value, index, array) {
    return _.isEmpty(value) && _.isPlainObject(value);
  };

  if (_.isArray(results)) {
    var res = [];
    for (var i = 0; i < results.length; i++) {
      res.push(__buildObj(results[i],objects));
    }
    return res;
  } else if (_.isObject(results)) {
    return __buildObj(results, objects);
  } else {
    return (strict) ? undefined : {};
  }

  function __buildObj(results, objects) {
    var obj = {};

    objects.forEach(function(group) {
      obj[group] = {};
    });

    // Iterate over object properties
    var r = new RegExp('__(.+?)__(.+)');
    _.forOwn(results, function(value, key) {
      var matches = r.exec(key);
      if (matches !== null && _.has(obj, matches[1]) && matches.length == 3 && matches[1].length > 0 && matches[2].length > 0) {
        if ((!value && !strict) || value)
          obj[matches[1]][matches[2]] = value;
      } else {
        obj[key] = value;
      }
    });

    if (strict) {
      _.forOwn(obj, function(value, key) {
        if (!value && _.includes(objects, key))
          delete obj[key];
      });
    }

    return (strict) ? _(obj).omitBy(predicate).value() : obj;
  }
};
