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

  if (_.isPlainObject(results)) {
    return __buildObj(results, objects);
  } else if (_.isArray(results)) {
    var res = [];
    for (var i = 0; i < results.length; i++) {
      res.push(__buildObj(results[i],objects));
    }
    return res;
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

    return (strict) ? _(obj).omitBy(_.isEmpty).omitBy(_.isUndefined).omitBy(_.isNull).value() : obj;
  }
};
