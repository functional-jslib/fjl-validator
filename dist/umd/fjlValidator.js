(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./alnumValidator", "./digitValidator", "./lengthValidator", "./notEmptyValidator", "./regexValidator", "./stringLengthValidator", "./ValidationUtils"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./alnumValidator"), require("./digitValidator"), require("./lengthValidator"), require("./notEmptyValidator"), require("./regexValidator"), require("./stringLengthValidator"), require("./ValidationUtils"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.alnumValidator, global.digitValidator, global.lengthValidator, global.notEmptyValidator, global.regexValidator, global.stringLengthValidator, global.ValidationUtils);
    global.fjlValidator = mod.exports;
  }
})(this, function (_exports, _alnumValidator, _digitValidator, _lengthValidator, _notEmptyValidator, _regexValidator, _stringLengthValidator, _ValidationUtils) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.keys(_alnumValidator).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _alnumValidator[key];
      }
    });
  });
  Object.keys(_digitValidator).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _digitValidator[key];
      }
    });
  });
  Object.keys(_lengthValidator).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _lengthValidator[key];
      }
    });
  });
  Object.keys(_notEmptyValidator).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _notEmptyValidator[key];
      }
    });
  });
  Object.keys(_regexValidator).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _regexValidator[key];
      }
    });
  });
  Object.keys(_stringLengthValidator).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _stringLengthValidator[key];
      }
    });
  });
  Object.keys(_ValidationUtils).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _ValidationUtils[key];
      }
    });
  });
});