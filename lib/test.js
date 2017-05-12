'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _index = require('./index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Empty = function Empty() {
  return null;
};
var View = function View(_ref) {
  var children = _ref.children;
  return children;
};
var Hello = function Hello(_ref2) {
  var name = _ref2.name;
  return 'Hello ' + name;
};
var Placeholder = 'Placeholder';

var ClassComponent = function (_React$Component) {
  _inherits(ClassComponent, _React$Component);

  function ClassComponent() {
    _classCallCheck(this, ClassComponent);

    return _possibleConstructorReturn(this, (ClassComponent.__proto__ || Object.getPrototypeOf(ClassComponent)).apply(this, arguments));
  }

  _createClass(ClassComponent, [{
    key: 'render',
    value: function render() {
      return this.props.children;
    }
  }]);

  return ClassComponent;
}(_react2.default.Component);

var tree = _react2.default.createElement(
  ClassComponent,
  null,
  _react2.default.createElement(
    View,
    { style: 'primary' },
    _react2.default.createElement(Empty, null),
    _react2.default.createElement(Hello, { name: 'Bob' }),
    _react2.default.createElement(
      View,
      null,
      _react2.default.createElement(Placeholder, null)
    )
  )
);

var JSONRes = (0, _index.renderToJSON)(tree);

var objectRes = JSON.parse(JSONRes);

var components = {
  ClassComponent: function ClassComponent(_ref3) {
    var children = _ref3.children;
    return children;
  },
  Empty: function Empty() {
    return null;
  },
  View: function View(_ref4) {
    var children = _ref4.children;
    return children;
  },
  Hello: function Hello(_ref5) {
    var name = _ref5.name;
    return 'Hello ' + name;
  },
  Placeholder: function Placeholder() {
    return 'Placeholder text';
  }
};

var res = (0, _index.renderFromObject)(objectRes, { components: components });

console.log('res', res);