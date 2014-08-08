
var assert = require('assert'),
    abba = require('../index'),
    tests;

abba.config({hexIds: false})

tests = {
  'in single range': function () {
    abba.populate([
      { name: 'foo',
        percent: 10,
        startPoint: 1
      }
    ]);

    var user = {
      id: 7
    };
    abba.treat(user);
    var isIn = user.inExperiment('foo');
    assert.ok(isIn);
  },

  'higher than single range': function () {
    abba.populate([
      { name: 'foo',
        percent: 10,
        startPoint: 1
      }
    ]);

    var user = {
      id: 11
    };
    abba.treat(user);
    var isIn = user.inExperiment('foo');
    assert.ok(!isIn);
  },

  'in split range': function () {
    abba.populate([
      { name: 'foo',
        percent: 10,
        startPoint: 98
      }
    ]);

    var user = {
      id: 7
    };
    abba.treat(user);
    var isIn = user.inExperiment('foo');
    assert.ok(isIn);
  },

  'outside split range': function () {
    abba.populate([
      { name: 'foo',
        percent: 10,
        startPoint: 98
      }
    ]);

    var user = {
      id: 8
    };
    abba.treat(user);
    var isIn = user.inExperiment('foo');
    assert.ok(!isIn);
  },

  'outside before single range': function () {
    abba.populate([
      { name: 'foo',
        percent: 10,
        startPoint: 36
      }
    ]);

    var user = {
      id: 35
    };
    abba.treat(user);
    var isIn = user.inExperiment('foo');
    assert.ok(!isIn);
  },

  'inside left single range': function () {
    abba.populate([
      { name: 'foo',
        percent: 10,
        startPoint: 36
      }
    ]);

    var user = {
      id: 36
    };
    abba.treat(user);
    var isIn = user.inExperiment('foo');
    assert.ok(isIn);
  },

  'inside right single range': function () {
    abba.populate([
      { name: 'foo',
        percent: 10,
        startPoint: 36
      }
    ]);

    var user = {
      id: 45
    };
    abba.treat(user);
    var isIn = user.inExperiment('foo');
    assert.ok(isIn);
  },

  'outside after single range': function () {
    abba.populate([
      { name: 'foo',
        percent: 10,
        startPoint: 36
      }
    ]);

    var user = {
      id: 46
    };
    abba.treat(user);
    var isIn = user.inExperiment('foo');
    assert.ok(!isIn);
  },

};

module.exports = tests;
