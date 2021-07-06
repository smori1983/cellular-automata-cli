'use strict';

var socket = io.connect('http://localhost');
var cellularAutomation = angular.module('cellularAutomation', []);
var CellularAutomaton = function(rule, w, h, ctx) {

  var columns = w / 5;
  var rows = h / 5;
  var matrix = [];

  var neighbors = function(a, b, c) {
    if (a === 1 && b === 1 && c === 1) { return rule[0]; } // 1001
    if (a === 1 && b === 1 && c === 0) { return rule[1]; } // 1110
    if (a === 1 && b === 0 && c === 1) { return rule[2]; } // 0000
    if (a === 1 && b === 0 && c === 0) { return rule[3]; } // 0100
    if (a === 0 && b === 1 && c === 1) { return rule[4]; } // 1110
    if (a === 0 && b === 1 && c === 0) { return rule[5]; } // 0101
    if (a === 0 && b === 0 && c === 1) { return rule[6]; } // 0100
    if (a === 0 && b === 0 && c === 0) { return rule[7]; } // 1010
    return 0;
  };

  // Just memo.
  // Sort if statements as 'The Embodied Mind' order.
  var neighbors_ = function(a, b, c) {
    if (a === 0 && b === 1 && c === 0) { return rule[5]; } // 0101
    if (a === 0 && b === 1 && c === 1) { return rule[4]; } // 1110
    if (a === 1 && b === 1 && c === 0) { return rule[1]; } // 1110
    if (a === 1 && b === 1 && c === 1) { return rule[0]; } // 1001
    if (a === 0 && b === 0 && c === 0) { return rule[7]; } // 1010
    if (a === 0 && b === 0 && c === 1) { return rule[6]; } // 0100
    if (a === 1 && b === 0 && c === 0) { return rule[3]; } // 0100
    if (a === 1 && b === 0 && c === 1) { return rule[2]; } // 0000
    return 0;
  };

  //create a matrix for current columns
  for (var i = 0; i < columns; i++) {
    matrix[i] = [];
    for (var j = 0; j < rows; j++) {
      // matrix[i][j] = 0;
      matrix[i][j] = Math.random() > 0.5 ? 1 : 0;
    }
  }

  matrix[0][columns / 2] = 1;

  //update the matrix with the correct cells
  for (var g = 0; g < 29; g++) { // 30 rows
    for (var i = 0; i < columns; i++) {
      var left = matrix[g][(i + columns - 1) % columns];
      var me = matrix[g][i];
      var right = matrix[g][(i + 1) % columns];
      matrix[g + 1][i] = neighbors(left, me, right);
    }
  }

  //render the cells into the canvas
  for (var i = 0; i < columns; i++) {
    for (var j = 0; j < rows; j++) {
      if (matrix[i][j] === 1) {
        ctx.fillRect(j * 5, i * 5, 5, 5);
      }
    }
  }

};

var sendAnimation = function(id, rule){
  $(id).click(function() {
    socket.emit('click', {
      rule: rule
    });
  });
};

var parseRule = function(rule){
  return rule.split('').map(function(i) {
    return parseInt(i);
  });
};

/**
 * Accept rule as 'The Embodied Mind' format (in app.js), then convert to original.
 *
 * @param {number[]} original
 * @return {number[]}
 */
var convertRule = function(original) {
  var result = [];

  result[5] = original[0];
  result[4] = original[1];
  result[1] = original[2];
  result[0] = original[3];
  result[7] = original[4];
  result[6] = original[5];
  result[3] = original[6];
  result[2] = original[7];

  return result;
};

var init = function() {
  // loop over 0-255 and paint a canvas
  // of a cellular automation for that byte array
  for (var i = 0; i < 256; i++) {
    var canvas = $('#rule-' + i);
    // var rule = parseRule(canvas.attr('rule'));
    var rule = convertRule(parseRule(canvas.attr('rule')));

    sendAnimation('#ruleContainer-' + i, rule);

    var ctx = canvas[0].getContext('2d');

    CellularAutomaton(rule, 300, 300, ctx);
  }
};

cellularAutomation.controller('rulesListCtrl', ['$scope', '$http', function($scope, $http) {

  $http.get('/rules').success(function(data) {
    $scope.rules = data;
    angular.element(document).ready(function() {
      init();
    });
  });

}]);

$(document).keyup(function(e) {
  if (e.keyCode === 27) {
    socket.emit('kill');
  }
});
