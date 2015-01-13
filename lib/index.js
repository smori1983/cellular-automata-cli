'use strict';

var chalk = require('chalk');
var exports = module.exports = {};

var CellularAutomaton = function(r, w) {

  this.rule = r;
  this.columns = w;
  this.row = [];

  for (var i = 0; i < this.columns; i++) {
    this.row[i] = 0;
  }

  this.row[this.columns / 2] = 1;

};

CellularAutomaton.prototype.render = function() {
  var ctx = '';
  for (var i = 0; i < this.row.length; i++) {
    if (this.row[i] === 1) {
      ctx = ctx + chalk.bgGreen(' ');
    } else {
      ctx = ctx + ' ';
    }
  }
  console.log(ctx);
};

CellularAutomaton.prototype.bump = function() {
  var newRow = [];
  for (var i = 0; i < this.columns; i++) {
    var left = this.row[(i + this.columns - 1) % this.columns];
    var me = this.row[i];
    var right = this.row[(i + 1) % this.columns];
    newRow.push(this.neighbor(left, me, right));
  }
  this.row = newRow;
};

CellularAutomaton.prototype.neighbor = function(a, b, c) {
  if (a === 1 && b === 1 && c === 1) {
    return this.rule[0];
  } else if (a === 1 && b === 1 && c === 0) {
    return this.rule[1];
  } else if (a === 1 && b === 0 && c === 1) {
    return this.rule[2];
  } else if (a === 1 && b === 0 && c === 0) {
    return this.rule[3];
  } else if (a === 0 && b === 1 && c === 1) {
    return this.rule[4];
  } else if (a === 0 && b === 1 && c === 0) {
    return this.rule[5];
  } else if (a === 0 && b === 0 && c === 1) {
    return this.rule[6];
  } else if (a === 0 && b === 0 && c === 0) {
    return this.rule[7];
  }
  return 0;
};

exports.Automation = CellularAutomaton;
