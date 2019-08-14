/*
 * lzwCompress.js
 *
 * Copyright (c) 2019 minh
 * Licensed under the MIT license.
 */

"use strict";

(function() {
  var root = this;

  var lzwCompress = (function(Array, JSON, undefined) {
    var _self = {},
      _lzwLoggingEnabled = false,
      _lzwLog = function(message) {
        try {
          console.log(
            "lzwCompress: " +
              new Date().toISOString() +
              " : " +
              (typeof message === "object" ? JSON.stringify(message) : message)
          );
        } catch (e) {}
      };

    //utf-8
    (function(self, String) {
      var encode = function(text) {
          var result = "";
          for (var n = 0; n < text.length; n++) {
            var c = text.charCodeAt(n);
            if (c < 128) {
              result += String.fromCharCode(c);
            } else if (c > 127 && c < 2048) {
              result += String.fromCharCode((c >> 6) | 192);
              result += String.fromCharCode((c & 63) | 128);
            } else {
              result += String.fromCharCode((c >> 12) | 224);
              result += String.fromCharCode(((c >> 6) & 63) | 128);
              result += String.fromCharCode((c & 63) | 128);
            }
          }
          return result;
        },
        decode = function(text) {
          var result = "";
          var i = 0;
          var c1 = 0;
          var c2 = 0;
          var c3 = 0;
          while (i < text.length) {
            c1 = text.charCodeAt(i);
            if (c1 < 128) {
              result += String.fromCharCode(c1);
              i++;
            } else if (c1 > 191 && c1 < 224) {
              c2 = text.charCodeAt(i + 1);
              result += String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
              i += 2;
            } else {
              c2 = text.charCodeAt(i + 1);
              c3 = text.charCodeAt(i + 2);
              result += String.fromCharCode(
                ((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63)
              );
              i += 3;
            }
          }
          return result;
        };

      self.utf8 = {
        pack: encode,
        unpack: decode
      };
    })(_self, String);

    // LZWCompress
    (function(self, Array, String) {
      var compress = function(str) {
          var rStr = "";
          rStr = self.utf8.pack(str);
          var i = 0;
          var size = 0;
          var xstr = "";
          var chars = 256;
          var dict = new Array();
          for (i = 0; i < chars; i++) {
            dict[String(i)] = i;
          }
          var splitted = new Array();
          splitted = rStr.split("");
          var buffer = new Array();
          size = splitted.length;
          var current = "";
          var result = new String("");
          for (i = 0; i <= size; i++) {
            current = new String(splitted[i]);
            xstr =
              buffer.length == 0
                ? String(current.charCodeAt(0))
                : buffer.join("-") + "-" + String(current.charCodeAt(0));
            if (dict[xstr] !== undefined) {
              buffer.push(current.charCodeAt(0));
            } else {
              result += String.fromCharCode(dict[buffer.join("-")]);
              dict[xstr] = chars;
              chars++;
              buffer = new Array();
              buffer.push(current.charCodeAt(0));
            }
          }
          return result;
        },
        decompress = function(str) {
          var i;
          var chars = 256;
          var dict = new Array();
          for (i = 0; i < chars; i++) {
            dict[i] = String.fromCharCode(i);
          }
          var original = new String(str);
          var splitted = original.split("");
          var size = splitted.length;
          var buffer = new String("");
          var chain = new String("");
          var result = new String("");
          for (i = 0; i < size; i++) {
            var code = original.charCodeAt(i);
            var current = dict[code];
            if (buffer == "") {
              buffer = current;
              result += current;
            } else {
              if (code <= 255) {
                result += current;
                chain = buffer + current;
                dict[chars] = chain;
                chars++;
                buffer = current;
              } else {
                chain = dict[code];
                if (chain == null) {
                  chain = buffer + buffer.slice(0, 1);
                }
                result += chain;
                dict[chars] = buffer + chain.slice(0, 1);
                chars++;
                buffer = chain;
              }
            }
          }
          result = self.utf8.unpack(result);
          return result;
        };

      self.LZWCompress = {
        pack: compress,
        unpack: decompress
      };
    })(_self, Array, String);

    var _compress = function(obj) {
        _lzwLoggingEnabled && _lzwLog("original (uncompressed) : " + obj);
        if (
          !obj ||
          obj === true ||
          obj instanceof Date ||
          typeof obj === "object"
        ) {
          return obj;
        }
        var result = obj;
        var packedObj = _self.LZWCompress.pack(result);
        _lzwLoggingEnabled && _lzwLog("packed   (compressed)   : " + packedObj);
        return packedObj;
      },
      _decompress = function(compressedObj) {
        _lzwLoggingEnabled &&
          _lzwLog("original (compressed)   : " + compressedObj);
        if (
          !compressedObj ||
          compressedObj === true ||
          compressedObj instanceof Date ||
          typeof obj === "object"
        ) {
          return compressedObj;
        }
        var probableJSON,
          result = _self.LZWCompress.unpack(compressedObj);
        try {
          probableJSON = JSON.parse(result);
        } catch (e) {
          _lzwLoggingEnabled && _lzwLog("unpacked (uncompressed) : " + result);
          return result;
        }
        _lzwLoggingEnabled && _lzwLog("unpacked (uncompressed) : " + result);
        return result;
      },
      _enableLogging = function(enable) {
        _lzwLoggingEnabled = enable;
      };

    return {
      pack: _compress,
      unpack: _decompress,
      enableLogging: _enableLogging
    };
  })(Array, JSON);

  if (typeof module !== "undefined" && module.exports) {
    module.exports = lzwCompress;
  } else {
    root.lzwCompress = lzwCompress;
  }
}.call(this));
