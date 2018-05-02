/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var PdfViewer = function(opts) {
  this.pdfUrl = opts.pdfUrl || ''
  this.onerror = opts.onerror || null
  this.staticHost = opts.staticHost || ''
  this.download = opts.download || ''
}

PdfViewer.prototype.embed = function(container) {
  this.container = container

  var iframe = document.createElement('iframe')
  iframe.height = '100%'
  iframe.width = '100%'
  iframe.frameBorder = 'none'
  iframe.src = this.staticHost + '?file=' + encodeURIComponent(this.pdfUrl) + '&width=' + container.clientWidth + '&download=' + this.download

  container.innerHTML = ''
  container.appendChild(iframe)

  var self =  this, receiveMessage

  if (typeof self.onerror !== 'function') { return }

  this.receiveMessage = receiveMessage = function (event) {
    var origin = event.origin
    var error  = event.data
    if(self.staticHost.indexOf(origin) == -1) { return }
    self.onerror(error)
    window.removeEventListener('message', receiveMessage, false)
  }

  window.addEventListener('message', receiveMessage, false)

  return this

}

PdfViewer.prototype.destroy = function() {
  if (this.container) {
    this.container.innerHTML = ''
  }
  if (this.receiveMessage) {
    window.removeEventListener('message', this.receiveMessage, false)
  }
}

module.exports = PdfViewer


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(2);


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var PdfViewer = __webpack_require__(0);

var pdfConfig = {
  pdfUrl: '/pdfs/20180425TD.pdf',
  download: false,
  staticHost: window.location.origin,
  onerror: handlePdfError
};

var handlePdfError = function handlePdfError(a) {
  console.error(a);
};

// new PdfViewer(pdfConfig).embed(document.getElementById('DocContainer'));

// PdfViewer

/***/ })
/******/ ]);