'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertToJSON = exports.convertToObject = exports.convertChildren = exports.convertChild = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var convertChild = exports.convertChild = function convertChild(child) {
  if (child == null) {
    return;
  }
  if (typeof child === 'string') {
    return child;
  }
  if (child.type) {
    return convertToObject(child);
  }
};

var convertChildren = exports.convertChildren = function convertChildren(children) {
  return Array.isArray(children) ? children.map(convertChild) : convertChild(children);
};

var convertToObject = function convertToObject(tree) {
  var _tree$props = tree.props,
      children = _tree$props.children,
      props = _objectWithoutProperties(_tree$props, ['children']);

  if (typeof tree.key === 'string') {
    props.key = tree.key;
  }

  if (typeof tree.type === 'string') {
    return {
      type: tree.type,
      props: _extends({}, props, {
        children: convertChildren(children)
      })
    };
  }
  if (_typeof(tree.type.prototype) === 'object' && tree.type.prototype && tree.type.prototype.isReactComponent) {
    var instance = new tree.type(tree.props);
    return {
      type: tree.type.displayName || tree.type.name,
      props: _extends({}, props, {
        children: convertChildren(instance.render())
      })
    };
  }
  if (typeof tree.type === 'function') {
    return {
      type: tree.type.displayName || tree.type.name || 'Unknown',
      props: _extends({}, props, {
        children: convertChildren(tree.type(tree.props))
      })
    };
  }
  return {
    type: 'Unsupported',
    props: {
      children: []
    }
  };
};

exports.convertToObject = convertToObject;
var convertToJSON = exports.convertToJSON = function convertToJSON(tree, space) {
  return JSON.stringify(convertToObject(tree), null, space);
};