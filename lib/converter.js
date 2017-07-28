'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertToJSON = exports.convertToObject = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var defaultProcessProps = function defaultProcessProps(props) {
  return props;
};

var convertToObject = exports.convertToObject = function convertToObject(tree) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var replacers = params.replacers || {};
  var processProps = params.processProps || defaultProcessProps;

  var convertChild = function convertChild(child) {
    if (child == null) {
      return;
    }
    if (typeof child === 'number' || typeof child === 'string') {
      return child;
    }
    if (child.type) {
      return convertComponent(child);
    }
  };

  var convertChildren = function convertChildren(children) {
    return Array.isArray(children) ? children.map(convertChild) : convertChild(children);
  };

  var convertComponent = function convertComponent(tree, key) {
    if (typeof tree.key === 'string') {
      key = tree.key;
    }

    var name = void 0,
        type = void 0;
    if (typeof tree.type === 'string') {
      name = tree.type;
      type = 'string';
    } else if (_typeof(tree.type.prototype) === 'object' && tree.type.prototype && tree.type.prototype.isReactComponent) {
      name = tree.type.displayName || tree.type.name || 'Unknown';
      type = 'class';
    } else if (typeof tree.type === 'function') {
      name = tree.type.displayName || tree.type.name || 'Unknown';
      type = 'function';
    } else {
      return {
        type: 'Unsupported',
        props: {
          children: []
        }
      };
    }

    var props = processProps(tree.props);

    var replacer = replacers[name];
    if (replacer) {
      return convertComponent(replacer(props), key);
    }

    var children = void 0;
    if (type === 'string') {
      children = convertChildren(props.children);
    } else if (type === 'function') {
      children = convertChildren(tree.type(props));
    } else if (type === 'class') {
      var instance = new tree.type(props);
      children = convertChildren(instance.render());
    }

    return {
      type: name,
      props: _extends({}, props, { children: children, key: key })
    };
  };

  return convertComponent(tree);
};

var convertToJSON = function convertToJSON(tree) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var space = params.space,
      convertParams = _objectWithoutProperties(params, ['space']);

  return JSON.stringify(convertToObject(tree, convertParams), null, space);
};
exports.convertToJSON = convertToJSON;