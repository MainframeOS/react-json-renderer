'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderToJSON = exports.convertToObject = exports.convertChildren = exports.convertChild = undefined;

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
  return Array.isArray(children) ? children.map(convertChild) : [convertChild(children)];
};

var convertToObject = function convertToObject(tree) {
  var type = void 0;
  if (typeof tree.type === 'string') {
    type = tree.type;
  } else if (tree.type.displayName) {
    type = tree.type.displayName;
  } else if (tree.type.name) {
    type = tree.type.name;
  }

  var _tree$props = tree.props,
      children = _tree$props.children,
      props = _objectWithoutProperties(_tree$props, ['children']);

  return {
    type: type,
    props: _extends({}, props, {
      children: convertChildren(children)
    })
  };
};

exports.convertToObject = convertToObject;
var renderToJSON = exports.renderToJSON = function renderToJSON(tree, space) {
  return JSON.stringify(convertToObject(tree), null, space);
};