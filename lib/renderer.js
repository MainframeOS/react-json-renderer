'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Renderer = exports.renderFromObject = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var Fallback = function Fallback() {
  return null;
};

var renderFromObject = function renderFromObject(tree, params) {
  var components = params && params.components || {};
  var fallback = params && params.fallback || Fallback;

  var createChild = function createChild(c) {
    if (c == null) {
      return null;
    }
    if (typeof c === 'string') {
      return c;
    }
    if (c.type) {
      return createComponent(c);
    }
    return null;
  };

  var createComponent = function createComponent(converted) {
    var component = components[converted.type] || fallback;

    var _converted$props = converted.props,
        children = _converted$props.children,
        props = _objectWithoutProperties(_converted$props, ['children']);

    if (children) {
      props.children = Array.isArray(children) // eslint-disable-line react/prop-types
      ? children.map(createChild) : createChild(children);
    }
    return (0, _react.createElement)(component, props);
  };

  return createComponent(tree);
};

exports.renderFromObject = renderFromObject;

var Renderer = exports.Renderer = function (_Component) {
  _inherits(Renderer, _Component);

  function Renderer() {
    _classCallCheck(this, Renderer);

    return _possibleConstructorReturn(this, (Renderer.__proto__ || Object.getPrototypeOf(Renderer)).apply(this, arguments));
  }

  _createClass(Renderer, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          json = _props.json,
          tree = _props.tree,
          params = _objectWithoutProperties(_props, ['json', 'tree']);

      var obj = void 0;
      if (tree) obj = tree;else if (json) obj = JSON.parse(json);

      return obj ? renderFromObject(obj, params) : null;
    }
  }]);

  return Renderer;
}(_react.Component);