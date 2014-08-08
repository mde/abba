
var utils = require('utilities'),
    config,
    experiments = {},
    Experiment;

config = {
  idField: '_id'
};

Experiment = function (name, percent, startPoint, options) {
  var opts = options || {};
  this.name = name;
  this.percent = percent;
  this.startPoint = startPoint; // Number betweeen 0 and 99
  this.includeIds = opts.includeIds || [];
  this.excludeIds = opts.excludeIds || [];
};

module.exports = new (function () {

  this.Experiement = Experiment;

  this.config = function (opts) {
    utils.mixin(config, opts);
  };

  this.populate = function (data) {
    data.forEach(function (d) {
      var ex = new Experiment(d.name, d.percent, d.startPoint, d);
      experiments[d.name] = ex;
    });
  };

})();
