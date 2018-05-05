/* v 3.4.6
author http://codecanyon.net/user/creativeinteractivemedia/portfolio?ref=creativeinteractivemedia
*/

var FLIPBOOK = FLIPBOOK || {};

FLIPBOOK.PdfService = function(pdfDocument, model, options) {

    var self = this
    this.pdfDocument = pdfDocument
    this.pdfInfo = pdfDocument.pdfInfo
    this.numPages = this.pdfInfo.numPages
    this.webgl = options.viewMode == 'webgl'
    this.options = options
    this.main = options.main

    this.pages = []
    this.thumbs = []
    this.canvasBuffer = []
    this.viewports = []
    this.textContents = []

    this.pdfPages = []
    this.pdfPagesRendering = []
    this.pdfPagesRendered = []
    this.bookPagesRendered = []
    this.pdfAnnotations = []

    var canvasBufferSize = options.isMobile ? 40 : 200

    for (var i = 0; i < canvasBufferSize; i++) {
        var c = document.createElement('canvas')
        c.width = 10
        c.height = 10
        c._name = i
        c.available = true
        c.pageIndex = -100
        c.pdfPageIndex = -1
        this.canvasBuffer.push(c)
    }

    this.getCanvas = function() {

        var i, c

        for (i = 0; i < this.canvasBuffer.length; i++) {
            c = this.canvasBuffer[i]
            if (c.available) {
                c.available = false
                c.double = false
                // c.getContext('2d').clearRect(0, 0, c.width, c.height)
                // console.log('rendering : ',c.rendering)
                break;

            }

        }

        this.canvasBuffer.splice(i, 1);
        this.canvasBuffer.push(c)
        return c

    }

    this.setRightIndex = function(ri) {

        // console.log('setRightIndex: ', ri)

        var self = this
        var unloadedPages = []
        var d = this.options.isMobile ? 4 : 20

        this.canvasBuffer.forEach(function(c) {
            c.available = ((ri - c.pageIndex) > (3 + d)) || ((ri - c.pageIndex) < (-2 - d))
            if (c.available && c.pageIndex > -1) {
                self.pdfPagesRendered[c.pdfPageIndex][c.size] = false
                delete self.pages[c.pdfPageIndex].canvas[c.size]
                self.pages[c.pdfPageIndex].rendering = false

                // if(self.pages[c.pdfPageIndex]){
                self.pages[c.pdfPageIndex].cleanup()
                // delete self.pages[c.pdfPageIndex]      
                // }

                unloadedPages.push({ index: c.pageIndex, size: c.size })
                if (c.double)
                    unloadedPages.push({ index: c.pageIndex - 1, size: c.size })
                c.pageIndex = -100
                c.getContext('2d').clearRect(0, 0, c.width, c.height)
            }
        })

        if (unloadedPages.length > 0)
            this.options.pageUnloaded(unloadedPages)
    }

    window.s = function() {
        var outer = document.createElement('div')


        document.body.appendChild(outer)

        self.canvasBuffer.forEach(function(c) {
            var inner = document.createElement('span')
            inner.style.margin = '2px'
            inner.style.background = '#ccc'
            inner.style.display = 'inline-block'
            outer.appendChild(inner)
            var dataurl = c.toDataURL()
            var image = new Image()
            image.src = dataurl
            image.style.border = c.available ? '1px solid #0F0' : '1px solid #F00'
            inner.appendChild(image)
            image.height = 100

            var info = document.createElement('span')
            info.style.display = 'block'
            inner.appendChild(info)
            info.innerText = c.pageIndex + ';' + c.pdfPageIndex + ";" + c.size
        })
    }

    this.loadThumbs = function(convertToBlob, callback) {

        var self = this

        this.thumbLoading = this.thumbLoading || 0

        if (this.thumbLoading >= this.pdfInfo.numPages)

            callback.call(self)

        else

            this.loadThumb(this.thumbLoading, function(c) {
                self.options.thumbLoaded(c)
                self.thumbLoading++
                    self.loadThumbs(convertToBlob, callback)
            })

    }

    this.loadThumb = function(index, callback) {

        var self = this

        // console.log('loading thumb ',index)

        this.getViewport(index, function() {

            var page = self.pages[index]

            var scale = 100 / page.getViewport(1).height

            var viewport = page.getViewport(scale);

            var c = document.createElement('canvas')
            c.index = index
            var context = c.getContext('2d');
            c.height = viewport.height;
            c.width = viewport.width;

            var renderContext = {
                canvasContext: context,
                viewport: viewport
            };
            page.cleanupAfterRender = true
            page.render(renderContext).then(function() {

                // console.log('thumb ',index, ' loaded')
                page.cleanup()

                if (callback) callback.call(self, c)

            })

        })
    }

    this.getBookPage = function(index, size) {

    }

    this.init = function(callback, loadAllPages) {

        if (loadAllPages) {

            self.getTextAllPages(function() {
                
                if(self.numPages == 1)
                    self.double = false
                else{
                    var v1 = self.viewports[0]
                    var v2 = self.viewports[1]
                    var v3 = self.viewports[self.viewports.length-1]
                    self.r1 = v1.width / v1.height
                    self.r2 = v2.width / v2.height
                    self.r3 = v3.width / v3.height
                    self.double = self.r2 / self.r1 > 1.5
                    self.backCover = self.r3 / self.r1 < 1.5
                }
                callback.call(self)

            })



        } else {

            self.getViewport(0, function(viewport) {

                self.r1 = viewport.width / viewport.height

                if (self.pdfInfo.numPages == 1) {
                    self.double = false
                    callback.call(self)
                } else {
                    self.getViewport(1, function(viewport) {
                        self.r2 = viewport.width / viewport.height
                        self.double = self.r2 / self.r1 > 1.5

                        //last page index 

                        self.getViewport(self.pdfInfo.numPages - 1, function(viewport) {
                            self.r3 = viewport.width / viewport.height
                            self.backCover = self.r3 / self.r1 < 1.5
                            callback.call(self)
                        })

                        // self.backCover = true
                        // callback.call(self)

                    })

                }

            })

        }

    }

    this.getViewport = function(index, callback) {
        if (index >= pdfDocument.pdfInfo.numPages)
            return
        if (!self.pages[index]) {
            // console.log('getViewport ',index)
            pdfDocument.getPage(index + 1).then(function(page) {
                self.pages[page.pageIndex] = page
                // self.viewports[index] = page.getViewport(1);
                // callback.call(self, self.viewports[index]);

                self.getViewport(page.pageIndex, callback)
            })
        } else {
            self.viewports[index] = self.pages[index].getViewport(1);
            callback.call(self, self.viewports[index]);
        }
    }

    this.getAllViewports = function(callback) {

    }

    this.getText = function(index, callback) {
        var self = this
        this.getViewport(index, function(viewport) {
            var page = self.pages[index]

            getTextContent(page, function() {
                // console.log(page)
                callback.call(self, page)

            })

        })
    }

    this.getTextAllPages = function(callback) {

        var self = this

        this.loadingTextFromPage = this.loadingTextFromPage || 0

        this.getText(this.loadingTextFromPage, function() {

            if (self.loadingTextFromPage == (self.numPages - 1))
                callback.call(self)
            else {
                self.loadingTextFromPage++
                    self.getTextAllPages(callback)
            }

        })

    }

    this.findInPage = function(str, index, callback) {
        var self = this
        this.getText(index, function(page) {
            var arr = page.textContent.items
            var matches = 0
            for (var i = 0; i < arr.length; i++) {
                var s = arr[i].str
                if (s.includes(str))
                    matches++
                    if (s.toUpperCase().includes(str.toUpperCase()))
                        matches++
            }
            callback.call(self, matches, page.htmlContent)
        })
    }

    this.getThumb = function(index, size, callback) {

        this.getViewport(index, function(viewport) {
            var page = self.pages[index]
            if (page.thumb)
                callback.call(self, page.thumb)
            else {
                //render thumb first
                var scale = size / self.viewports[index].height
                var viewport = page.getViewport(scale);
                var c = document.createElement('canvas')
                page.thumb = c
                var context = c.getContext('2d');
                c.height = viewport.height;
                c.width = viewport.width;

                var renderContext = {
                    canvasContext: context,
                    viewport: viewport
                };
                page.cleanupAfterRender = true
                page.render(renderContext).then(function() {
                    page.cleanup()
                    callback.call(self, page.thumb)

                })

            }



        })
    }

    this.getPage = function(index, callback) {

        var self = this;
        var pdfPageIndex = self.double ? Math.round(index / 2) + 1 : index + 1
        if (pdfPageIndex > this.pdfInfo.numPages)
            return;
        // if (self.pages[pdfPageIndex])
        //     self.renderPage(self.pages[pdfPageIndex], callback)
        // else {
        pdfDocument.getPage(index).then(function(p) {
            // self.pages[index] = p
            self.renderPage(p, callback)
        });
        // }
    }

    this.renderPage = function(page, size, callback) {

        var self = this
        page.canvas = page.canvas || {}

        if (page.canvas[size]) {
            callback.call(self, page)
            return
        }

        if (page.rendering) {
            debugger
            setTimeout(function() {
                self.renderPage(page, size, callback)
                return
            }, 300)
        }
        page.rendering = true

        //page.htmlContent = document.createElement('p')

        getTextContent(page, function() {

            /*ar scale = 2048 / self.viewports[1].height,
                v = page.getViewport(1),
                d = Math.max(v.width, v.height),
                scale = 2048 / d,
                viewport = page.getViewport(scale),
                canvas = document.createElement('canvas');*/

            var v = page.getViewport(1)
            //var scale = self.options.pageTextureSize / v.height
            var portrait = v.width <= v.height
            var scale = portrait ? size / v.height : size / v.width
            var viewport = page.getViewport(scale)

            // var canvas = document.createElement('canvas');
            var canvas = self.getCanvas()
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            canvas.rendering = true

            if (self.webgl) {

                if (portrait) {
                    canvas.height = size;
                    canvas.width = viewport.width > size ? viewport.width : size;
                    canvas.scaleX = viewport.width / size
                    canvas.scaleY = 1
                } else {
                    canvas.width = size
                    canvas.height = viewport.height > size ? viewport.height : size
                    canvas.scaleY = viewport.height / size
                    canvas.scaleX = 1
                }
            }

            var ctx = canvas.getContext('2d');
            ctx.fillStyle = '#FFFFFF';
            ctx.fillStyle = '#000000';

            var renderContext = {
                canvasContext: ctx,
                viewport: viewport,
                //renderInteractiveForms: false
                //textLayer: textLayer
            };

            //page.canvas[size] = canvas
            page.scale = scale
            page.canvas[size] = canvas
            page.canvas[size].ratio = viewport.width / viewport.height

            page.cleanupAfterRender = true



            var renderTask = page.render(renderContext);
            renderTask.promise.then(function() {
                renderContext = null
                if (callback)
                    callback.call(self, page)
            });

        })
    }

    this.renderPageFromPdf = function(pageIndex, size, callback) {

        var self = this

        if (pageIndex >= this.pdfInfo.numPages)
            callback.call(self)

        if (!this.pages[pageIndex]) {
            this.getViewport(pageIndex, function(viewport) {
                self.renderPageFromPdf(pageIndex, size, callback)
            });
            return
        }

        var pi = pageIndex,
            page = this.pages[pageIndex],
            v = page.getViewport(1),
            d = Math.max(v.width, v.height),
            d = v.height,
            scale = size / d

        if (self.pdfPagesRendering[pi] && self.pdfPagesRendering[pi][size]){

            setTimeout(function(){
                self.renderPageFromPdf(pageIndex, size, callback)
                }, 100)
            return

        }
            

        if (self.pdfPagesRendered[pi] && self.pdfPagesRendered[pi][size]) {

            self.onPdfPageRendered(self.pages[pi], size, callback)

        } else {

            self.pdfPagesRendered[pi] = self.pdfPagesRendered[pi] || {}

            self.pdfPagesRendering[pi] = self.pdfPagesRendering[pi] || {}

            self.pdfPagesRendering[pi][size] = true

            this.renderPage(page, size, function(page) {

                self.pdfPagesRendering[pi][size] = false
                self.pdfPagesRendered[pi][size] = true
                self.onPdfPageRendered(page, size, callback)
            })

        }
    }

    this.onBookPageRendered = function(page, canvas, index, size) {

        this.bookPagesRendered.push({ index: index, pdfPageIndex: page.pageIndex, size: size })

        // console.log('onBookPageRendered ',index)

        options.pages[index].canvas = options.pages[index].canvas || {}

        // var lowQuality = canvas.toDataURL('image/jpeg', 0.1);
        // var medQuality = canvas.toDataURL('image/jpeg', 0.5);
        // var highQuality = canvas.toDataURL('image/jpeg', 1);

        options.pages[index].canvas[size] = canvas
        // options.pages[index].canvas[size] = {}
        // options.pages[index].canvas[size].dataUrl = medQuality

        /*var imgL = new Image()
        imgL.width = 1024
        imgL.height = 1024
        imgL.src = lowQuality
        document.body.appendChild(imgL)

        var imgM = new Image()
        imgM.width = 1024
        imgM.height = 1024
        imgM.src = medQuality
        document.body.appendChild(imgM)

        var imgH = new Image()
        imgH.width = 1024
        imgH.height = 1024
        imgH.src = highQuality
        document.body.appendChild(imgH)*/

        // jQuery(this).trigger("pageLoaded", [index, size]);

        options.pageLoaded(index, size)

        /* while (this.bookPagesRendered.length > 12) {
             var first = this.bookPagesRendered[0]
             var c = options.pages[first.index].canvas[first.size]
             var ctx = c.getContext('2d');
             ctx.clearRect(0, 0, c.width, c.height);
             // options.pages[first.index].canvas[first.size] = null
             delete options.pages[first.index].canvas[first.size]
             // this.pages[first.pdfPageIndex].canvas[first.size] = null
             delete this.pages[first.pdfPageIndex].canvas[first.size]
             this.pdfPagesRendering[first.pdfPageIndex][first.size] = false
             this.pdfPagesRendered[first.pdfPageIndex][first.size] = false
             this.bookPagesRendered.shift()
             first = null
         }*/

    }

    /*this.loadingPages = function(){
        
        var num = 0

        this.pdfPagesRendering.forEach(function(element) {

            element.forEach(function(val){
                if(val == true)
                    num++
            })
        })

        return num
        
    }*/

    this.onPdfPageRendered = function(page, size, callback) {

        var self = this

        if (!page.canvas) return;
        if (!page.canvas[size]) return;

        // console.log(page.canvas)

        var c = page.canvas[size],
            h = page.htmlContent,
            pdfPageIndex = page.pageIndex;

        c.pdfPageIndex = pdfPageIndex
        c.rendering = false

        if (typeof c == 'undefined') return;

        if (options.pageMode == 'doubleWithCover') {

            if (pdfPageIndex == 0) {

                initializeHtmlContent(h, pdfPageIndex)
                c.pageIndex = 0
                c.size = size
                self.onBookPageRendered(page, c, 0, size)
                //self.options.pages[0].htmlContent = h


            } else if (pdfPageIndex == options.pages.length / 2) {

                initializeHtmlContent(h, options.numPages - 1)
                c.pageIndex = options.numPages - 1
                c.size = size
                self.onBookPageRendered(page, c, options.numPages - 1, size)
                //self.options.pages[self.options.pages.length - 1].htmlContent = h

            } else {

                h.style.transformOrigin = '0 0'

                //  if( !options.pages[2 * pdfPageIndex].canvas || !options.pages[2 * pdfPageIndex].canvas[size]){ 

                //     options.pages[2 * pdfPageIndex].canvas = options.pages[2 * pdfPageIndex].canvas || {}


                if (self.webgl) {

                    c.double = true

                    c.scaleX = (c.width / 2) / size
                    c.scaleY = c.scaleY

                    var h2 = h.cloneNode(true);

                    initializeHtmlContent(h, 2 * pdfPageIndex - 1)

                    initializeHtmlContent(h2, 2 * pdfPageIndex)

                    self.onBookPageRendered(page, c, 2 * pdfPageIndex, size)

                    self.onBookPageRendered(page, c, 2 * pdfPageIndex - 1, size)
                    c.pageIndex = 2 * pdfPageIndex
                    c.size = size

                } else {

                    var rCanvas = self.getCanvas()
                    var rcontext = rCanvas.getContext('2d');
                    rCanvas.rendering = true

                    rCanvas.width = c.width / 2;
                    rCanvas.height = c.height;

                    rcontext.fillStyle = '#FFFFFF';

                    rcontext.drawImage(c, c.width / 2, 0, c.width / 2, c.height, 0, 0, c.width / 2, c.height);
                    rCanvas.rendering = false

                    var loadedIndexR = self.options.rightToLeft ? 2 * pdfPageIndex - 1 : 2 * pdfPageIndex

                    rCanvas.pageIndex = loadedIndexR
                    rCanvas.pdfPageIndex = pdfPageIndex
                    rCanvas.size = size


                    var lCanvas = self.getCanvas()
                    var lcontext = lCanvas.getContext('2d');


                    //set dimensions
                    lCanvas.width = c.width / 2;
                    lCanvas.height = c.height;
                    lCanvas.rendering = true

                    lcontext.fillStyle = '#FFFFFF';

                    lcontext.drawImage(c, 0, 0);
                    lCanvas.rendering = false

                    var loadedIndexL = self.options.rightToLeft ? 2 * pdfPageIndex : 2 * pdfPageIndex - 1

                    lCanvas.pageIndex = loadedIndexL
                    lCanvas.pdfPageIndex = pdfPageIndex
                    lCanvas.size = size

                    var h2 = h.cloneNode(true);

                    initializeHtmlContent(h, 2 * pdfPageIndex - 1)

                    initializeHtmlContent(h2, 2 * pdfPageIndex)

                    self.onBookPageRendered(page, rCanvas, loadedIndexR, size)
                    self.onBookPageRendered(page, lCanvas, loadedIndexL, size)

                    c.available = true

                    c.getContext('2d').clearRect(0, 0, c.width, c.height)

                    c.pageIndex = -100
                    c.size = size

                }



                // var index = self.canvasBuffer.indexOf(c)

                // self.canvasBuffer.splice(index,1)

                // self.canvasBuffer.unshift(c)



                //}


                /*if(!self.options.pages[2 * pdfPageIndex - 1].htmlContentInitialized){
                     if(self.options.pages[2 * pdfPageIndex - 1].htmlContent)
                        h.appendChild(self.options.pages[2 * pdfPageIndex - 1].htmlContent)
                     self.options.pages[2 * pdfPageIndex - 1].htmlContentInitialized = true
                     self.options.pages[2 * pdfPageIndex - 1].htmlContent = h       
                }*/



                /* jQuery(main).trigger("pageLoaded", [2 * pdfPageIndex - 1, size]);

                 setTimeout(function() {

                     jQuery(main).trigger("pageLoaded", [2 * pdfPageIndex, size]);

                 }, 10)*/

            }

        } else {

            initializeHtmlContent(h, pdfPageIndex)
            c.pageIndex = pdfPageIndex
            c.size = size
            self.onBookPageRendered(page, c, pdfPageIndex, size)
            //self.options.pages[pdfPageIndex].htmlContent = h;

        }

        function initializeHtmlContent(h, pi) {
            /* if (options.rightToLeft)
                 pi = options.pages.length - pi - 1*/
            var page = options.pages[pi]
            if (!page.htmlContentInitialized) {
                if (page.htmlContent)
                    jQuery(h).append(jQuery(page.htmlContent))
                page.htmlContentInitialized = true
                page.htmlContent = h
            }
        }

        if (callback)
            callback.call(self, { canvas: c, size: size, pdfPageIndex: pdfPageIndex });

    }

    function getTextContent(page, callback) {

        if (page.htmlContent)
            callback(page)
        else
            page.getTextContent().then(function(textContent) {
                page.textContent = textContent


                var htmlContentDiv = document.createElement('div');
                htmlContentDiv.classList.add('flipbook-page-htmlContent')

                var defaultPageHeight = 1000;

                //text layer

                if (self.options.textLayer) {

                    var textLayerDiv = document.createElement('div');
                    textLayerDiv.className = 'flipbook-textLayer';

                    var scale = 1000 / page.getViewport(1).height

                    textLayerDiv.style.width = String(1000 * page.getViewport(1).width / page.getViewport(1).height) + "px"
                    textLayerDiv.style.height = "1000px";

                    var textLayer = new TextLayerBuilder({
                        textLayerDiv: textLayerDiv,
                        pageIndex: page.pageIndex,
                        viewport: page.getViewport(scale)
                    });
                    //the page. It is set to page.number - 1.
                    textLayer.setTextContent(textContent);
                    textLayer.render(TEXT_LAYER_RENDER_DELAY);
                    htmlContentDiv.appendChild(textLayerDiv)

                }

                //annotations (links) layer

                var linkService = new PDFLinkService();
                linkService.setViewer(self.main)
                linkService.setDocument(pdfDocument)

                var annotationsDiv = document.createElement('div')
                var annotationLayerBuilder = new AnnotationLayerBuilder({
                    pageDiv: annotationsDiv,
                    pdfPage: page,
                    linkService: linkService
                });

                annotationLayerBuilder.render(page.getViewport(1 * defaultPageHeight / self.viewports[0].height), 'display');

                htmlContentDiv.appendChild(annotationsDiv)
                page.htmlContent = htmlContentDiv

                callback(page)
            })
    }


    //////////////////napravi sa drawimage
    /*function cloneCanvas(c) {
        var data = c.getContext("2d").getImageData(0, 0, c.width, c.height)
        var c2 = document.createElement('canvas');
        c2.width = c.width;
        c2.height = c.height;
        var ctx2 = c2.getContext('2d');
        ctx2.putImageData(data, 0, 0);
        c.duplicate = c2
        return c2
    }*/

    this.getCanvasByHeight = function(index, height, onComplete) {

    }

    // this.getThumb = function(index, complete) {

    // }

}



var TEXT_LAYER_RENDER_DELAY = 200; // ms

var MAX_TEXT_DIVS_TO_RENDER = 100000;

var NonWhitespaceRegexp = /\S/;

function isAllWhitespace(str) {
    return !NonWhitespaceRegexp.test(str);
}


/**
 * @typedef {Object} TextLayerBuilderOptions
 * @property {HTMLDivElement} textLayerDiv - The text layer container.
 * @property {number} pageIndex - The page index.
 * @property {PageViewport} viewport - The viewport of the text layer.
 * @property {PDFFindController} findController
 */

/**
 * TextLayerBuilder provides text-selection functionality for the PDF.
 * It does this by creating overlay divs over the PDF text. These divs
 * contain text that matches the PDF text they are overlaying. This object
 * also provides a way to highlight text that is being searched for.
 * @class
 */
var TextLayerBuilder = (function TextLayerBuilderClosure() {
    function TextLayerBuilder(options) {
        this.textLayerDiv = options.textLayerDiv;
        this.renderingDone = false;
        this.divContentDone = false;
        this.pageIdx = options.pageIndex;
        this.pageNumber = this.pageIdx + 1;
        this.matches = [];
        this.viewport = options.viewport;
        this.textDivs = [];
        this.findController = options.findController || null;
        this.textLayerRenderTask = null;
        this._bindMouse();
    }

    TextLayerBuilder.prototype = {
        _finishRendering: function TextLayerBuilder_finishRendering() {
            this.renderingDone = true;

            var endOfContent = document.createElement('div');
            endOfContent.className = 'endOfContent';
            this.textLayerDiv.appendChild(endOfContent);

            var event = document.createEvent('CustomEvent');
            event.initCustomEvent('textlayerrendered', true, true, {
                pageNumber: this.pageNumber
            });
            this.textLayerDiv.dispatchEvent(event);
        },

        /**
         * Renders the text layer.
         * @param {number} timeout (optional) if specified, the rendering waits
         *   for specified amount of ms.
         */
        render: function TextLayerBuilder_render(timeout) {
            if (!this.divContentDone || this.renderingDone) {
                return;
            }

            if (this.textLayerRenderTask) {
                this.textLayerRenderTask.cancel();
                this.textLayerRenderTask = null;
            }

            this.textDivs = [];
            var textLayerFrag = document.createDocumentFragment();
            this.textLayerRenderTask = PDFJS.renderTextLayer({
                textContent: this.textContent,
                container: textLayerFrag,
                viewport: this.viewport,
                textDivs: this.textDivs,
                timeout: timeout
            });
            this.textLayerRenderTask.promise.then(function() {
                this.textLayerDiv.appendChild(textLayerFrag);
                this._finishRendering();
                this.updateMatches();
            }.bind(this), function(reason) {
                // canceled or failed to render text layer -- skipping errors
            });
        },

        setTextContent: function TextLayerBuilder_setTextContent(textContent) {
            if (this.textLayerRenderTask) {
                this.textLayerRenderTask.cancel();
                this.textLayerRenderTask = null;
            }
            this.textContent = textContent;
            this.divContentDone = true;
        },

        convertMatches: function TextLayerBuilder_convertMatches(matches) {
            var i = 0;
            var iIndex = 0;
            var bidiTexts = this.textContent.items;
            var end = bidiTexts.length - 1;
            var queryLen = (this.findController === null ?
                0 : this.findController.state.query.length);
            var ret = [];

            for (var m = 0, len = matches.length; m < len; m++) {
                // Calculate the start position.
                var matchIdx = matches[m];

                // Loop over the divIdxs.
                while (i !== end && matchIdx >= (iIndex + bidiTexts[i].str.length)) {
                    iIndex += bidiTexts[i].str.length;
                    i++;
                }

                if (i === bidiTexts.length) {
                    console.error('Could not find a matching mapping');
                }

                var match = {
                    begin: {
                        divIdx: i,
                        offset: matchIdx - iIndex
                    }
                };

                // Calculate the end position.
                matchIdx += queryLen;

                // Somewhat the same array as above, but use > instead of >= to get
                // the end position right.
                while (i !== end && matchIdx > (iIndex + bidiTexts[i].str.length)) {
                    iIndex += bidiTexts[i].str.length;
                    i++;
                }

                match.end = {
                    divIdx: i,
                    offset: matchIdx - iIndex
                };
                ret.push(match);
            }

            return ret;
        },

        renderMatches: function TextLayerBuilder_renderMatches(matches) {
            // Early exit if there is nothing to render.
            if (matches.length === 0) {
                return;
            }

            var bidiTexts = this.textContent.items;
            var textDivs = this.textDivs;
            var prevEnd = null;
            var pageIdx = this.pageIdx;
            var isSelectedPage = (this.findController === null ?
                false : (pageIdx === this.findController.selected.pageIdx));
            var selectedMatchIdx = (this.findController === null ?
                -1 : this.findController.selected.matchIdx);
            var highlightAll = (this.findController === null ?
                false : this.findController.state.highlightAll);
            var infinity = {
                divIdx: -1,
                offset: undefined
            };

            function beginText(begin, className) {
                var divIdx = begin.divIdx;
                textDivs[divIdx].textContent = '';
                appendTextToDiv(divIdx, 0, begin.offset, className);
            }

            function appendTextToDiv(divIdx, fromOffset, toOffset, className) {
                var div = textDivs[divIdx];
                var content = bidiTexts[divIdx].str.substring(fromOffset, toOffset);
                var node = document.createTextNode(content);
                if (className) {
                    var span = document.createElement('span');
                    span.className = className;
                    span.appendChild(node);
                    div.appendChild(span);
                    return;
                }
                div.appendChild(node);
            }

            var i0 = selectedMatchIdx,
                i1 = i0 + 1;
            if (highlightAll) {
                i0 = 0;
                i1 = matches.length;
            } else if (!isSelectedPage) {
                // Not highlighting all and this isn't the selected page, so do nothing.
                return;
            }

            for (var i = i0; i < i1; i++) {
                var match = matches[i];
                var begin = match.begin;
                var end = match.end;
                var isSelected = (isSelectedPage && i === selectedMatchIdx);
                var highlightSuffix = (isSelected ? ' selected' : '');

                if (this.findController) {
                    this.findController.updateMatchPosition(pageIdx, i, textDivs,
                        begin.divIdx, end.divIdx);
                }

                // Match inside new div.
                if (!prevEnd || begin.divIdx !== prevEnd.divIdx) {
                    // If there was a previous div, then add the text at the end.
                    if (prevEnd !== null) {
                        appendTextToDiv(prevEnd.divIdx, prevEnd.offset, infinity.offset);
                    }
                    // Clear the divs and set the content until the starting point.
                    beginText(begin);
                } else {
                    appendTextToDiv(prevEnd.divIdx, prevEnd.offset, begin.offset);
                }

                if (begin.divIdx === end.divIdx) {
                    appendTextToDiv(begin.divIdx, begin.offset, end.offset,
                        'highlight' + highlightSuffix);
                } else {
                    appendTextToDiv(begin.divIdx, begin.offset, infinity.offset,
                        'highlight begin' + highlightSuffix);
                    for (var n0 = begin.divIdx + 1, n1 = end.divIdx; n0 < n1; n0++) {
                        textDivs[n0].className = 'highlight middle' + highlightSuffix;
                    }
                    beginText(end, 'highlight end' + highlightSuffix);
                }
                prevEnd = end;
            }

            if (prevEnd) {
                appendTextToDiv(prevEnd.divIdx, prevEnd.offset, infinity.offset);
            }
        },

        updateMatches: function TextLayerBuilder_updateMatches() {
            // Only show matches when all rendering is done.
            if (!this.renderingDone) {
                return;
            }

            // Clear all matches.
            var matches = this.matches;
            var textDivs = this.textDivs;
            var bidiTexts = this.textContent.items;
            var clearedUntilDivIdx = -1;

            // Clear all current matches.
            for (var i = 0, len = matches.length; i < len; i++) {
                var match = matches[i];
                var begin = Math.max(clearedUntilDivIdx, match.begin.divIdx);
                for (var n = begin, end = match.end.divIdx; n <= end; n++) {
                    var div = textDivs[n];
                    div.textContent = bidiTexts[n].str;
                    div.className = '';
                }
                clearedUntilDivIdx = match.end.divIdx + 1;
            }

            if (this.findController === null || !this.findController.active) {
                return;
            }

            // Convert the matches on the page controller into the match format
            // used for the textLayer.
            this.matches = this.convertMatches(this.findController === null ? [] : (this.findController.pageMatches[this.pageIdx] || []));
            this.renderMatches(this.matches);
        },

        /**
         * Fixes text selection: adds additional div where mouse was clicked.
         * This reduces flickering of the content if mouse slowly dragged down/up.
         * @private
         */
        _bindMouse: function TextLayerBuilder_bindMouse() {
            var div = this.textLayerDiv;
            div.addEventListener('mousedown', function(e) {
                var end = div.querySelector('.endOfContent');
                if (!end) {
                    return;
                }
                // On non-Firefox browsers, the selection will feel better if the height
                // of the endOfContent div will be adjusted to start at mouse click
                // location -- this will avoid flickering when selections moves up.
                // However it does not work when selection started on empty space.
                var adjustTop = e.target !== div;
                adjustTop = adjustTop && window.getComputedStyle(end).
                getPropertyValue('-moz-user-select') !== 'none';
                if (adjustTop) {
                    var divBounds = div.getBoundingClientRect();
                    var r = Math.max(0, (e.pageY - divBounds.top) / divBounds.height);
                    end.style.top = (r * 100).toFixed(2) + '%';
                }
                end.classList.add('active');
            });
            div.addEventListener('mouseup', function(e) {
                var end = div.querySelector('.endOfContent');
                if (!end) {
                    return;
                }
                end.style.top = '';
                end.classList.remove('active');
            });
        },
    };
    return TextLayerBuilder;
})();



/**
 * @typedef {Object} AnnotationLayerBuilderOptions
 * @property {HTMLDivElement} pageDiv
 * @property {PDFPage} pdfPage
 * @property {IPDFLinkService} linkService
 */

/**
 * @class
 */
var AnnotationLayerBuilder = (function AnnotationLayerBuilderClosure() {
    /**
     * @param {AnnotationLayerBuilderOptions} options
     * @constructs AnnotationLayerBuilder
     */
    function AnnotationLayerBuilder(options) {
        this.pageDiv = options.pageDiv;
        this.pdfPage = options.pdfPage;
        this.linkService = options.linkService;

        this.div = null;
    }

    AnnotationLayerBuilder.prototype =
        /** @lends AnnotationLayerBuilder.prototype */
        {

            /**
             * @param {PageViewport} viewport
             * @param {string} intent (default value is 'display')
             */
            render: function AnnotationLayerBuilder_render(viewport, intent) {
                var self = this;
                var parameters = {
                    intent: (intent === undefined ? 'display' : intent),
                };

                this.pdfPage.getAnnotations(parameters).then(function(annotations) {
                    viewport = viewport.clone({
                        dontFlip: true
                    });
                    parameters = {
                        viewport: viewport,
                        div: self.div,
                        annotations: annotations,
                        page: self.pdfPage,
                        linkService: self.linkService
                    };

                    if (self.div) {
                        // If an annotationLayer already exists, refresh its children's
                        // transformation matrices.
                        PDFJS.AnnotationLayer.update(parameters);
                    } else {
                        // Create an annotation layer div and render the annotations
                        // if there is at least one annotation.
                        if (annotations.length === 0) {
                            return;
                        }

                        self.div = document.createElement('div');
                        self.div.className = 'flipbook-annotationLayer';
                        self.pageDiv.appendChild(self.div);
                        parameters.div = self.div;

                        PDFJS.AnnotationLayer.render(parameters);
                        if (typeof mozL10n !== 'undefined') {
                            mozL10n.translate(self.div);
                        }
                    }
                });
            },

            hide: function AnnotationLayerBuilder_hide() {
                if (!this.div) {
                    return;
                }
                this.div.setAttribute('hidden', 'true');
            }
        };

    return AnnotationLayerBuilder;
})();



/**
 * Performs navigation functions inside PDF, such as opening specified page,
 * or destination.
 * @class
 * @implements {IPDFLinkService}
 */
var PDFLinkService = (function() {
    /**
     * @constructs PDFLinkService
     */
    function PDFLinkService() {
        this.baseUrl = null;
        this.pdfDocument = null;
        this.pdfViewer = null;
        this.pdfHistory = null;

        this._pagesRefCache = null;
    }

    PDFLinkService.prototype = {
        setDocument: function PDFLinkService_setDocument(pdfDocument, baseUrl) {
            this.baseUrl = baseUrl;
            this.pdfDocument = pdfDocument;
            this._pagesRefCache = Object.create(null);
        },

        setViewer: function PDFLinkService_setViewer(pdfViewer) {
            this.pdfViewer = pdfViewer;
        },

        setHistory: function PDFLinkService_setHistory(pdfHistory) {
            this.pdfHistory = pdfHistory;
        },

        /**
         * @returns {number}
         */
        get pagesCount() {
            return this.pdfDocument.numPages;
        },

        /**
         * @returns {number}
         */
        get page() {
            return this.pdfViewer.currentPageNumber;
        },

        /**
         * @param {number} value
         */
        set page(value) {
            this.pdfViewer.currentPageNumber = value;
        },

        /**
         * @param dest - The PDF destination object.
         */
        navigateTo: function PDFLinkService_navigateTo(dest) {
            var destString = '';
            var self = this;

            var goToDestination = function(destRef) {
                // dest array looks like that: <page-ref> </XYZ|FitXXX> <args..>
                var pageNumber = destRef instanceof Object ?
                    self._pagesRefCache[destRef.num + ' ' + destRef.gen + ' R'] :
                    (destRef + 1);
                if (pageNumber) {
                    if (pageNumber > self.pagesCount) {
                        pageNumber = self.pagesCount;
                    }
                    self.pdfViewer.scrollPageIntoView(pageNumber, dest);

                    if (self.pdfHistory) {
                        // Update the browsing history.
                        self.pdfHistory.push({
                            dest: dest,
                            hash: destString,
                            page: pageNumber
                        });
                    }
                } else {
                    self.pdfDocument.getPageIndex(destRef).then(function(pageIndex) {
                        var pageNum = pageIndex + 1;
                        var cacheKey = destRef.num + ' ' + destRef.gen + ' R';
                        self._pagesRefCache[cacheKey] = pageNum;
                        goToDestination(destRef);
                    });
                }
            };

            var destinationPromise;
            if (typeof dest === 'string') {
                destString = dest;
                destinationPromise = this.pdfDocument.getDestination(dest);
            } else {
                destinationPromise = Promise.resolve(dest);
            }
            destinationPromise.then(function(destination) {
                dest = destination;
                if (!(destination instanceof Array)) {
                    return; // invalid destination
                }
                goToDestination(destination[0]);
            });
        },

        /**
         * @param dest - The PDF destination object.
         * @returns {string} The hyperlink to the PDF object.
         */
        getDestinationHash: function PDFLinkService_getDestinationHash(dest) {
            if (typeof dest === 'string') {
                return this.getAnchorUrl('#' + escape(dest));
            }
            if (dest instanceof Array) {
                var destRef = dest[0]; // see navigateTo method for dest format
                var pageNumber = destRef instanceof Object ?
                    this._pagesRefCache[destRef.num + ' ' + destRef.gen + ' R'] :
                    (destRef + 1);
                if (pageNumber) {
                    var pdfOpenParams = this.getAnchorUrl('#page=' + pageNumber);
                    var destKind = dest[1];
                    if (typeof destKind === 'object' && 'name' in destKind &&
                        destKind.name === 'XYZ') {
                        var scale = (dest[4] || this.pdfViewer.currentScaleValue);
                        var scaleNumber = parseFloat(scale);
                        if (scaleNumber) {
                            scale = scaleNumber * 100;
                        }
                        pdfOpenParams += '&zoom=' + scale;
                        if (dest[2] || dest[3]) {
                            pdfOpenParams += ',' + (dest[2] || 0) + ',' + (dest[3] || 0);
                        }
                    }
                    return pdfOpenParams;
                }
            }
            return this.getAnchorUrl('');
        },

        /**
         * Prefix the full url on anchor links to make sure that links are resolved
         * relative to the current URL instead of the one defined in <base href>.
         * @param {String} anchor The anchor hash, including the #.
         * @returns {string} The hyperlink to the PDF object.
         */
        getAnchorUrl: function PDFLinkService_getAnchorUrl(anchor) {
            return (this.baseUrl || '') + anchor;
        },

        /**
         * @param {string} hash
         */
        setHash: function PDFLinkService_setHash(hash) {
            if (hash.indexOf('=') >= 0) {
                var params = parseQueryString(hash);
                // borrowing syntax from "Parameters for Opening PDF Files"
                if ('nameddest' in params) {
                    if (this.pdfHistory) {
                        this.pdfHistory.updateNextHashParam(params.nameddest);
                    }
                    this.navigateTo(params.nameddest);
                    return;
                }
                var pageNumber, dest;
                if ('page' in params) {
                    pageNumber = (params.page | 0) || 1;
                }
                if ('zoom' in params) {
                    // Build the destination array.
                    var zoomArgs = params.zoom.split(','); // scale,left,top
                    var zoomArg = zoomArgs[0];
                    var zoomArgNumber = parseFloat(zoomArg);

                    if (zoomArg.indexOf('Fit') === -1) {
                        // If the zoomArg is a number, it has to get divided by 100. If it's
                        // a string, it should stay as it is.
                        dest = [null, {
                                name: 'XYZ'
                            },
                            zoomArgs.length > 1 ? (zoomArgs[1] | 0) : null,
                            zoomArgs.length > 2 ? (zoomArgs[2] | 0) : null, (zoomArgNumber ? zoomArgNumber / 100 : zoomArg)
                        ];
                    } else {
                        if (zoomArg === 'Fit' || zoomArg === 'FitB') {
                            dest = [null, {
                                name: zoomArg
                            }];
                        } else if ((zoomArg === 'FitH' || zoomArg === 'FitBH') ||
                            (zoomArg === 'FitV' || zoomArg === 'FitBV')) {
                            dest = [null, {
                                    name: zoomArg
                                },
                                zoomArgs.length > 1 ? (zoomArgs[1] | 0) : null
                            ];
                        } else if (zoomArg === 'FitR') {
                            if (zoomArgs.length !== 5) {
                                console.error('PDFLinkService_setHash: ' +
                                    'Not enough parameters for \'FitR\'.');
                            } else {
                                dest = [null, {
                                    name: zoomArg
                                }, (zoomArgs[1] | 0), (zoomArgs[2] | 0), (zoomArgs[3] | 0), (zoomArgs[4] | 0)];
                            }
                        } else {
                            console.error('PDFLinkService_setHash: \'' + zoomArg +
                                '\' is not a valid zoom value.');
                        }
                    }
                }
                if (dest) {
                    this.pdfViewer.scrollPageIntoView(pageNumber || this.page, dest);
                } else if (pageNumber) {
                    this.page = pageNumber; // simple page
                }
                if ('pagemode' in params) {
                    var event = document.createEvent('CustomEvent');
                    event.initCustomEvent('pagemode', true, true, {
                        mode: params.pagemode,
                    });
                    this.pdfViewer.container.dispatchEvent(event);
                }
            } else if (/^\d+$/.test(hash)) { // page number
                this.page = hash;
            } else { // named destination
                if (this.pdfHistory) {
                    this.pdfHistory.updateNextHashParam(unescape(hash));
                }
                this.navigateTo(unescape(hash));
            }
        },

        /**
         * @param {string} action
         */
        executeNamedAction: function PDFLinkService_executeNamedAction(action) {
            // See PDF reference, table 8.45 - Named action
            switch (action) {
                case 'GoBack':
                    if (this.pdfHistory) {
                        this.pdfHistory.back();
                    }
                    break;

                case 'GoForward':
                    if (this.pdfHistory) {
                        this.pdfHistory.forward();
                    }
                    break;

                case 'NextPage':
                    this.page++;
                    break;

                case 'PrevPage':
                    this.page--;
                    break;

                case 'LastPage':
                    this.page = this.pagesCount;
                    break;

                case 'FirstPage':
                    this.page = 1;
                    break;

                default:
                    break; // No action according to spec
            }

            var event = document.createEvent('CustomEvent');
            event.initCustomEvent('namedaction', true, true, {
                action: action
            });
            this.pdfViewer.container.dispatchEvent(event);
        },

        /**
         * @param {number} pageNum - page number.
         * @param {Object} pageRef - reference to the page.
         */
        cachePageRef: function PDFLinkService_cachePageRef(pageNum, pageRef) {
            var refStr = pageRef.num + ' ' + pageRef.gen + ' R';
            this._pagesRefCache[refStr] = pageNum;
        }
    };

    return PDFLinkService;
})();