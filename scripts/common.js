(function() {
  'use strict';

  // max excluded
  window.random = function(min, max) {
    return Math.random() * (max - min) + min;
  };
  // max included
  window.randomInt = function(min, max) {
    return Math.floor(random(min, max + 1));
  };

  window.COLORS = [
    // Material Design 100 level
    '#FFCDD2',
    '#F8BBD0',
    '#E1BEE7',
    '#D1C4E9',
    '#C5CAE9',
    '#BBDEFB',
    '#B3E5FC',
    '#B2EBF2',
    '#B2DFDB',
    '#C8E6C9',
    '#DCEDC8',
    '#F0F4C3',
    '#FFF9C4',
    '#FFECB3',
    '#FFE0B2',
    '#FFCCBC',
    '#D7CCC8',
    '#CFD8DC',
    // Material Design 500 level
    '#F44336',
    '#E91E63',
    '#9C27B0',
    '#673AB7',
    '#3F51B5',
    '#2196F3',
    '#03A9F4',
    '#00BCD4',
    '#009688',
    '#4CAF50',
    '#8BC34A',
    '#CDDC39',
    '#FFEB3B',
    '#FFC107',
    '#FF9800',
    '#FF5722',
    '#795548',
    '#9E9E9E',
    '#607D8B',
    // Material Design 900 level
    '#B71C1C',
    '#880E4F',
    '#4A148C',
    '#311B92',
    '#1A237E',
    '#0D47A1',
    '#01579B',
    '#006064',
    '#004D40',
    '#1B5E20',
    '#33691E',
    '#827717',
    '#F57F17',
    '#FF6F00',
    '#E65100',
    '#BF360C',
    '#3E2723',
    '#212121',
    '#263238'
  ];

  window.MAX_DRIFT = 15; // in % of screen size
  window.MAX_RADIUS = 50; // in pixels
  window.MIN_RADIUS = 5; // in pixels

  window.addStroke = function(strokesRef, color, x, y) {
    strokesRef.push({
      color: color,
      radius: randomInt(MIN_RADIUS, MAX_RADIUS),
      x: x + randomInt(-MAX_DRIFT, MAX_DRIFT),
      y: y + randomInt(-MAX_DRIFT, MAX_DRIFT),
    });
  };
})();
