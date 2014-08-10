
var utils = require('utilities'),
    config,
    experiments = {},
    Experiment;

config = {
  idField: '_id',
  hexIds: true
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

  this.treat = function (user) {
    var self = this;
    user.inExperiment = user.inExperiment || function (name) {
      var id = user[config.idField];
      if (typeof id == 'undefined') {
        id = user.id;
      }
      return self.inExperiment(id, name);
    };
  };

  this.inExperiment = function (userId, name) {
    var ex = this.getExperiment(name),
    // Get a 0-256 int out of the hex UUID
        id,
        mod;

    if (!ex) {
      throw new Error('Experiment "' + name + '" does not exist');
    }

    // Exclusion-overrides take precedence
    if (ex.excludeIds) {
      if (ex.excludeIds.indexOf(userId) > -1) {
        return false;
      }
    }
    // Next look for inclusion overrides
    if (ex.includeIds) {
      if (ex.includeIds.indexOf(userId) > -1) {
        return true;
      }
    }

    // No overrides, just do the experiment
    if (config.hexIds) {
      id = parseInt(userId.toString().substr(-2), 16);
    }
    else {
      id = parseInt(userId.toString().substr(-2), 10);
    }

    mod = id % 100;
    if (mod === 0) {
      mod = 100;
    }
    var endPoint = ex.startPoint + ex.percent - 1;
    if (endPoint > 100) {
      return ((mod >= ex.startPoint && mod <= 100)) ||
          (mod >= 1 && mod <= (0 + (endPoint - 100)));
    }
    else {
      return mod >= ex.startPoint && mod <= endPoint;
    }
  };

  this.generateStartPoint = function () {
   return parseInt(Math.random() * (100 - 1) + 1, 10);
  };

  this.getExperiment = function (name) {
    return experiments[name];
  };

})();
