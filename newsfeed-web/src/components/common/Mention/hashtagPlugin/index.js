'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});

var _extends =
  Object.assign ||
  function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Hashtag = require('./Hashtag');

var _Hashtag2 = _interopRequireDefault(_Hashtag);

var _hashtagStrategy = require('./hashtagStrategy');

var _hashtagStrategy2 = _interopRequireDefault(_hashtagStrategy);

var _styles = {
  hashtag: 'draftJsHashtagPlugin__hashtag__1wMVC',
};

var _styles2 = _interopRequireDefault(_styles);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var defaultTheme = {
  hashtag: _styles2.default.hashtag,
};

exports.default = function() {
  var config =
    arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  // Styles are overwritten instead of merged as merging causes a lot of confusion.
  //
  // Why? Because when merging a developer needs to know all of the underlying
  // styles which needs a deep dive into the code. Merging also makes it prone to
  // errors when upgrading as basically every styling change would become a major
  // breaking change. 1px of an increased padding can break a whole layout.
  var theme = config.theme ? config.theme : defaultTheme;
  var DecoratedHashtag = function DecoratedHashtag(props) {
    return _react2.default.createElement(
      _Hashtag2.default,
      _extends({}, props, { theme: theme })
    );
  };
  return {
    decorators: [
      {
        strategy: _hashtagStrategy2.default,
        component: DecoratedHashtag,
      },
    ],
  };
};
