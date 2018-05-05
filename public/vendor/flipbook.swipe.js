/* v 3.4.5
author http://codecanyon.net/user/creativeinteractivemedia/portfolio?ref=creativeinteractivemedia
*/

var FLIPBOOK = FLIPBOOK || {};

FLIPBOOK.BookSwipe = function(el, wrapper, model, options) {

    this.options = options
    //options.singlePageMode = true
    this.singlePage = options.singlePageMode
    this.pageWidth = this.options.pageWidth
    this.pageHeight = this.options.pageHeight
    this.slides = []
    this.pagesArr = []
    this.leftPage = 0
    this.rightPage = 0

    this.prevPageEnabled = false

    // this.currentPage = 1

    this.setRightIndex(0)
    this.currentSlide = 0
    this.flipping = false;

    // this.watch("rightIndex",function(){
    //     debugger
    // });

    this.wrapper = wrapper

    this.$wrapper = jQuery(wrapper)

    //debug

    // this.$wrapper.css('overflow', "visible")
    // this.$wrapper.parent().css('overflow', "visible")

    // debug end

    this.scroller = el
    this.$scroller = jQuery(this.scroller).removeClass('book').addClass('flipbook-carousel-scroller')

    this.iscroll = new IScroll(this.wrapper, {

        // momentum: true,
        snap: true,
        snapSpeed: 200 * this.options.pageFlipDuration,
        // snapSpeed: 500,
        // keyBindings: false,
        // hScrollbar: false
        // zoom: true,
        // mouseWheel: true,
        // wheelAction: 'zoom',

        scrollX: true,
        scrollY: false,
        preventDefault: false,
        // mouseWheel: true,
        // wheelAction: 'zoom',
        // scrollbars: true
    });



    for (var i = 0; i < 3; i++) {

        var $slide = jQuery('<div class="flipbook-carousel-slide"><div class="slide-inner"/></div>"').appendTo(this.$scroller)
        this.slides.push($slide)

    }

    this.slides[0].iscroll = new IScroll(this.slides[0][0], {
            zoom: true,
            keepInCenterV: true,
            keepInCenterH: true,
            scrollbars:false,
            preventDefault: true
        })

    // this.slides[0].iscroll.refresh()

    this.slides[2].iscroll = new IScroll(this.slides[2][0], {
            zoom: true,
            keepInCenterV: true,
            keepInCenterH: true,
            scrollbars:false,
            preventDefault: true
        })

    // this.slides[2].iscroll.refresh()


    this.slides[1].iscroll = new IScroll(this.slides[1][0], {
            scrollbars: true,
            zoom: true,
            scrollX: true,
            scrollY: true,
            freeScroll: true,
            keepInCenterV: true,
            keepInCenterH: true,
            scrollbars:false,
            preventDefault: false
        })

    this.slides[1].iscroll.refresh()



    this.slides[1].iscroll.on("zoomEnd", function() {
            
            // debugger

            // this.options.preventDefault = false

            // self.disableFlip()

            self.onZoom(self.options.zoomMin * this.scale / this.options.zoomMin)
        })


        this.slides[1].iscroll.on("zoomStart", function() {

            // debugger

            // this.options.preventDefault = true
            // this.refresh()

            self.disableFlip()
        })

    this.slides[0].iscroll.disable()
    // this.slides[1].iscroll.disable()
    this.slides[2].iscroll.disable()

    this.resizeInnerSlides()

    var page

    var pageOptions = {
        rightToLeft: options.rightToLeft,
        numPages: options.numPages,
        pdfMode: options.pdfMode
    }

    for (var i = 0; i < options.numPages; i++) {

        page = new FLIPBOOK.PageSwipe(options, i, options.pages[i].src, options.pages[i].htmlContent)

        this.pagesArr.push(page)

        if (options.loadAllPages)
            page.load()
    }

    var self = this

    this.iscroll.on("scrollStart", function() {
        
        self.disablePan()
    })

    this.iscroll.on("scrollEnd", function() {
        self.enablePan()

        var sliderPage = this.currentPage.pageX

        // console.log("")
        // console.log("scrollEnd")
        // console.log("sliderPage:", sliderPage)

        if (sliderPage == 1) {
            self.flipping = false;
            self.updateVisiblePages()
            return
        }

        if (self.singlePage) {

            if (sliderPage > self.currentSlide)

                self.setRightIndex(self.rightIndex + 1);

            else if (sliderPage < self.currentSlide)

                self.setRightIndex(self.rightIndex - 1);

        } else {

            if (sliderPage > self.currentSlide)

                self.setRightIndex(self.rightIndex + 2);

            else if (sliderPage < self.currentSlide)

                self.setRightIndex(self.rightIndex - 2);
        }

        self.currentSlide = sliderPage

        self.updateVisiblePages()

        self.flipping = false;

    })

    this.flipEnabled = true

    this.nextEnabled = true
    this.prevEnabled = true

}


FLIPBOOK.BookSwipe.prototype.constructor = FLIPBOOK.BookSwipe;

FLIPBOOK.BookSwipe.prototype = {

    goToPage: function(value, instant) {

        if (!this.enabled)
            return

        if (!this.flipEnabled) return
        //go to page 1,2,... first page is 1
        // if (this.flipping) 
        //     return;

        // this.flipping = true;

        //instant = true

        if (isNaN(value) || value < 1)
            value = 1
        if (value > this.pagesArr.length)
            value = this.pagesArr.length

        if (this.singlePage) {
            value--;
        } else {
            if (value % 2 != 0)
                value--;
        }

        this.resetZoom()

        if (instant) {
            this.setRightIndex(value)
            this.updateVisiblePages()
            return
        }


        var slide
        if (this.singlePage) {

            if (this.options.rightToLeft && this.options.oddPages && value < 1)
                value = 1


            if (value > this.rightIndex) {
                this.setSlidePages(this.currentSlide + 1, [value])
                this.setRightIndex(value - 1)
                this.nextPage(instant);
            } else if (value < this.rightIndex) {
                this.setSlidePages(this.currentSlide - 1, [value])
                this.setRightIndex(value + 1)
                this.prevPage(instant);
            }

        } else {

            if (this.options.rightToLeft && this.options.oddPages && value < 2)
                value = 2

            if (value > this.rightIndex) {
                if (value >= this.pagesArr.length) {
                    this.setSlidePages(2, [value - 1, value])
                    this.setRightIndex(value - 2)
                    this.goToSlide(2, instant)
                } else {
                    this.setSlidePages(this.currentSlide + 1, [value - 1, value])
                    this.setRightIndex(value - 2)
                    this.nextPage(instant);
                }




            } else if (value < this.rightIndex) {
                if (value == 0) {
                    this.setRightIndex(value + 2)
                    this.setSlidePages(0, [value])
                    this.goToSlide(0, instant)
                } else {
                    this.setRightIndex(value + 2)
                    this.setSlidePages(this.currentSlide - 1, [value - 1, value])
                    this.prevPage(instant);
                }

            }
        }

    },

    setRightIndex: function(value) {

        this.rightIndex = value

    },

    nextPage: function(instant) {

        if (!this.flipEnabled) return

        /*if (this.flipping) 
            return;*/

        if (this.currentSlide == 2)
            return

        this.flipping = true;

        this.goToSlide(this.currentSlide + 1, instant)

        /*if(this.mode == 1)
            this.rightIndex++;*/

    },

    prevPage: function(instant) {

        if (!this.flipEnabled) return

        /*if (this.flipping) 
            return;*/

        if (this.currentSlide == 0)
            return;

        this.flipping = true;

        this.goToSlide(this.currentSlide - 1, instant)

        /*if(this.mode == 1)
            this.rightIndex--;*/

    },

    enablePrev: function(val) {

        this.prevEnabled = val

    },

    enableNext: function(val) {

        this.nextEnabled = val

    },

    // onPageUnloaded:function(index,size){

    //     var pageIndex = index

    //     if (this.options.rightToLeft)
    //         pageIndex = this.options.pages.length - index - 1

    //     this.pagesArr[pageIndex].unload()

    // },

    resetZoom: function() {

        return
        /* for (var i = 0; i < this.slides.length; i++) {
             if (this.slides[i].iscroll.scale !== 1)
                 this.slides[i].iscroll.zoom(1, 0, 0, 0)
             this.slides[i].iscroll.refresh()
             // this.slides[i].iscroll.refresh()
         }*/

        if (this.slides[1].iscroll.scale !== 1)
            this.slides[1].iscroll.zoom(1, 0, 0, 0)
        this.slides[1].iscroll.refresh()
        // this.slides[i].iscroll.refresh()


        this.iscroll.enable()
    },

    setSlidePages: function(slide, pages) {

        if (this.slides[slide].pages) {

            if (pages.join("") === this.slides[slide].pages.join(""))
                return

        }

        /*if(this.slides[slide].pages && (this.slides[slide].pages.join("") == pages.join(""))) 
            return;*/

        this.clearSlidePages(slide)

        var slideInner = this.slides[slide].find('.slide-inner')

        // slideInner.width(2 * this.options.pageTextureSize * this.options.pageWidth / this.options.pageHeight)

        for (var i = 0; i < pages.length; i++) {

            var pageIndex = pages[i]

            if (this.pagesArr[pageIndex]) {

                slideInner.append(this.pagesArr[pageIndex].$wrapper)
                this.slides[slide].pages.push(pageIndex)


            }

        }


        this.resizeInnerSlides()
        
        this.slides[slide].iscroll.refresh()

        // this.zoomTo(.25)
        // this.slides[slide].iscroll.refresh()

        // this.slides[slide].iscroll.zoom(.1, 0, 0, 0);




        // this.slides[slide].show()

    },

    clearSlidePages: function(slide) {

        this.slides[slide].find('.slide-inner').empty()
        this.slides[slide].pages = []

        // var test = jQuery("<p>SLIDE</p>")

        // this.slides[slide].find('.slide-inner').append(test)
        // this.slides[slide].hide()

    },

    setZoomPages: function(pages) {

        if (this.$zoomScroller.pages && (this.$zoomScroller.pages.join("") == pages.join("")))
            return;

        this.$zoomScroller.empty()
        this.$zoomScroller.pages = []

        for (var i = 0; i < pages.length; i++) {

            var pageIndex = pages[i]

            if (this.pagesArr[pageIndex]) {

                this.$zoomScroller.append(this.pagesArr[pageIndex].$wrapper)
                this.$zoomScroller.pages.push(pageIndex)

            }

        }
    },

    resizeZoomPages: function(pages, scale) {

        var h = this.$wrapper.height() * scale
        var pdfSize = parseInt(h / 500) * 500 + 500
        if (pdfSize < 500) pdfSize = 500
        if (pdfSize > 2000) pdfSize = 2000

        // this.options.pageTextureSize = pdfSize

        for (var i = 0; i < pages.length; i++) {

            var pageIndex = pages[i]

            if (this.pagesArr[pageIndex]) {
                /*this.pagesArr[pageIndex].$wrapper.height(this.zoomScroll.scrollerHeight)
                this.pagesArr[pageIndex].$wrapper.width(this.zoomScroll.scrollerWidth/2)*/
                //this.pagesArr[pageIndex].pageTextureSize = pdfSize
                this.pagesArr[pageIndex].load()

            }

        }
    },

    getCurrentSlidePages: function() {

        if (this.singlePage)

            return [this.rightIndex];

        else
            return [this.rightIndex - 1, this.rightIndex];


    },

    clearSlide: function(slide) {

        this.slides[slide].empty()

    },

    hasPage: function(slide, page) {


    },

    updateVisiblePages: function() {

        var self = this
        var toLoad

        if (this.singlePage) {

            if (this.rightIndex == 0) {

                this.setSlidePages(1, [0])
                this.setSlidePages(2, [1])
                this.clearSlidePages(0)
                this.iscroll.prevDisabled = true
                this.iscroll.nextDisabled = false

            } else if (this.options.rightToLeft && this.rightIndex == 1 && this.options.oddPages) {

                this.setSlidePages(1, [1])
                this.setSlidePages(2, [2])
                this.clearSlidePages(0)
                this.iscroll.prevDisabled = false
                this.iscroll.nextDisabled = true

            } else if (this.options.rightToLeft && this.rightIndex == (this.options.numPages - 1) && this.options.oddPages) {

                this.setSlidePages(1, [this.rightIndex])
                this.setSlidePages(0, [this.rightIndex - 1])
                this.setSlidePages(2, [this.rightIndex + 1])

                this.iscroll.prevDisabled = false
                this.iscroll.nextDisabled = false

            } else if (this.rightIndex == (this.options.numPages - 1)) {

                this.setSlidePages(1, [this.rightIndex])
                this.setSlidePages(0, [this.rightIndex - 1])
                this.clearSlidePages(2)

                this.iscroll.prevDisabled = false
                this.iscroll.nextDisabled = true

            } else {

                this.setSlidePages(1, [this.rightIndex])
                this.setSlidePages(0, [this.rightIndex - 1])
                this.setSlidePages(2, [this.rightIndex + 1])

                this.iscroll.prevDisabled = false
                this.iscroll.nextDisabled = false

            }

        } else {

            if (this.rightIndex == 0) {

                this.setSlidePages(1, [0])
                this.setSlidePages(2, [1, 2])
                this.clearSlidePages(0)
                this.iscroll.prevDisabled = true
                this.iscroll.nextDisabled = false

            } else if (this.options.rightToLeft && this.rightIndex == 2 && this.options.oddPages) {

                this.setSlidePages(1, [1, 2])
                this.setSlidePages(2, [3, 4])
                this.clearSlidePages(0)
                this.iscroll.prevDisabled = true
                this.iscroll.nextDisabled = false

            } else if (this.options.rightToLeft && this.rightIndex == (this.options.numPages - 1) && this.options.oddPages) {

                this.setSlidePages(1, [this.rightIndex - 1, this.rightIndex])
                this.setSlidePages(0, [this.rightIndex - 3, this.rightIndex - 2])
                this.setSlidePages(2, [this.rightIndex + 1, this.rightIndex + 2])
                this.iscroll.prevDisabled = false
                this.iscroll.nextDisabled = false


            } else if (this.rightIndex >= (this.options.numPages - 1)) {

                this.setSlidePages(1, [this.rightIndex - 1, this.rightIndex])
                this.setSlidePages(0, [this.rightIndex - 3, this.rightIndex - 2])
                this.clearSlidePages(2)
                this.iscroll.prevDisabled = false
                this.iscroll.nextDisabled = true

            } else {

                this.setSlidePages(1, [this.rightIndex - 1, this.rightIndex])
                this.setSlidePages(0, [this.rightIndex - 3, this.rightIndex - 2])
                this.setSlidePages(2, [this.rightIndex + 1, this.rightIndex + 2])
                this.iscroll.prevDisabled = false
                this.iscroll.nextDisabled = false


            }

        }


        this.loadVisiblePages()

        // this.iscroll.refresh()

        this.goToSlide(1, true)

        this.options.main.turnPageComplete()

    },

    loadPage: function(index) {

        if (this.pagesArr[index])
            this.pagesArr[index].load()

    },

    loadVisiblePages: function() {

        var main = this.options.main

        if (this.singlePage) {

            var current = this.pagesArr[this.rightIndex]
            var next = this.pagesArr[this.rightIndex + 1]
            var prev = this.pagesArr[this.rightIndex - 1]

            if (current) {
                current.load(function() {
                    main.setLoadingProgress(1)
                    if (next) next.load()
                    if (prev) prev.load()
                })
            }

        } else {

            var right = this.pagesArr[this.rightIndex]
            var left = this.pagesArr[this.rightIndex - 1]
            var next = this.pagesArr[this.rightIndex + 1]
            var afterNext = this.pagesArr[this.rightIndex + 2]
            var prev = this.pagesArr[this.rightIndex - 2]
            var beforePrev = this.pagesArr[this.rightIndex - 3]

            if (left) {
                left.load(function() {

                    if (right) {
                        right.load(function() {
                            main.setLoadingProgress(1)
                            if (prev) prev.load()
                            if (beforePrev) beforePrev.load()
                            if (next) next.load()
                            if (afterNext) afterNext.load()
                        })
                    } else {
                        main.setLoadingProgress(1)
                        if (prev) prev.load()

                        if (beforePrev) beforePrev.load()
                    }

                })
            } else {
                if (right) {
                    right.load(function() {
                        main.setLoadingProgress(1)
                        if (next) next.load()
                        if (afterNext) afterNext.load()
                    })
                }

            }

        }

    },

    hidePage: function(index) {

    },

    showPage: function(index) {

    },

    disable: function() {
        this.enabled = false
    },

    enable: function() {

        this.enabled = true
        this.onResize()

    },

    resize: function() {

    },

    onResize: function() {

        var w = this.$wrapper.width()
        var h = this.$wrapper.height()

        if(w == 0 || h == 0) return;
        
        var pw = this.options.pageWidth
        var ph = this.options.pageHeight
        var scale
        if(h/w > ph/pw){
            //fit to width
            scale = (ph/pw) * w / this.options.pageTextureSize
        }else{
            scale = h / this.options.pageTextureSize
        }

        for (var i = 0; i < this.slides.length; i++) {

            this.slides[i].width(w).height(h)
            this.slides[i].iscroll.options.zoomMin = this.options.zoomMin * scale
            this.slides[i].iscroll.options.zoomMax = this.options.zoomMax * scale
            this.slides[1].iscroll.refresh()

        }

        this.$scroller.width(this.$scroller.children().length * w)
        this.iscroll.refresh()

        // var portrait = 2 * this.pageWidth / this.pageHeight > w / h && w < this.options.responsiveViewTreshold && this.options.responsiveView
        var portrait = 2 * this.options.zoomMin * this.pageWidth / this.pageHeight >  w / h 
        var pw, ph

        if (this.pageWidth / this.pageHeight > w / h) {
            pw = w
            ph = parseInt(w * this.pageHeight / this.pageWidth)
        } else {
            ph = h
            pw = parseInt(h * this.pageWidth / this.pageHeight)
        }

        if (portrait && !this.singlePage) {

            if (this.rightIndex % 2 == 0 && this.rightIndex > 0)
                this.setRightIndex(this.rightIndex - 1);

            this.singlePage = true

            this.resizeInnerSlides()

        } else if (!portrait && this.singlePage) {


            if (this.rightIndex % 2 != 0)
                this.setRightIndex(this.rightIndex + 1);

            this.singlePage = false

            this.resizeInnerSlides()

        }

        this.updateVisiblePages()


    },

    resizeInnerSlides: function() {
        var pw = this.options.pageTextureSize * this.options.pageWidth / this.options.pageHeight
        var sw = this.singlePage ? pw : 2 * pw

        // debugger
        for (var i = 0; i < 3; i++) {
            sw = this.slides[i].pages && this.slides[i].pages.length == 1 ? pw : 2 * pw
            this.slides[i].find(".slide-inner").width(sw)
        }
    },

    resizeInnerSlide: function(slide) {

         var pw = this.options.pageTextureSize * this.options.pageWidth / this.options.pageHeight

        if(this.slides[slide].pages.length == 1)
            this.slides[slide].find(".slide-inner").width(pw)
        else
            this.slides[slide].find(".slide-inner").width(pw)

    },


    goToSlide: function(slide, instant) {

        var time = instant ? 0 : 300 * this.options.pageFlipDuration
        // var time = instant ? 0 : 500 * this.options.pageFlipDuration
        // time = 10

        if (this.iscroll.pages.length > 0)
            this.iscroll.goToPage(slide, 0, time)

        if (instant)
            this.currentSlide = slide

        this.zoomTo(this.options.zoomMin)

    },

    getCurrentSlide: function() {

        return this.currentSlide

    },

    zoomIn: function(value, time, e) {

        if (e && e.type === 'mousewheel')
            return
        this.zoomTo(value)

    },

    zoomTo: function(zoom, time, x, y) {

        if (!this.enabled)
            return

        var x = x || 0
        var y = y || 0
        var time = time || 0

        if (zoom > 1) {
            this.iscroll.disable()
        }



         var w = this.$wrapper.width()
        var h = this.$wrapper.height()

        if(w == 0 || h == 0) return;
        
        var pw = this.options.pageWidth
        var ph = this.options.pageHeight
        var scale
        if(h/w > ph/pw){
            //fit to width
            scale = (ph/pw) * zoom * w / this.options.pageTextureSize
        }else{
            scale = zoom * h / this.options.pageTextureSize
        }





        //var scale = zoom * this.$wrapper.height() / this.options.pageTextureSize

        // console.log(zoom)

        for (var i = 0; i < 3; i++) {

            this.slides[i].iscroll.zoom(scale, x, y, time);

        }

        this.onZoom(zoom)

        // if (this.slides[this.currentSlide].iscroll)
        //     this.slides[this.currentSlide].iscroll.zoom(zoom, x, y, time);


    },

    zoomOut: function(value) {

        this.zoomTo(value)

    },

    onZoom: function(zoom) {
        // debugger
        // console.log("on zoom : ",zoom)
        if (zoom > 1) {
            this.disableFlip()
            this.enablePan()
        } else {
            this.enableFlip()
            // this.disablePan()
        }

        this.options.main.onZoom(zoom)

    },

    enableAutoplay: function(val) {

        // this.main.enableAutoplay(val)

    },

    updateCurrentPage: function(val) {


    },

    enable: function() {
        this.enabled = true
    },

    disable: function() {
        this.enabled = false
    },

    onSwipe: function(event, phase, direction, distance, duration, fingerCount, fingerData) {
        //console.log(event, phase, direction, distance, duration, fingerCount, fingerData)
        /*if(e.type == 'touchend' && !direction)
            this.main.toggleMenu()*/
    },

    onPageLoaded: function(i, size) {

        var index = this.options.rightToLeft ? this.options.numPages - i - 1 : i;

        this.pagesArr[index].onPageLoaded(size, this.options.pages[i].canvas[size], this.options.pages[i].htmlContent)
    },

    onPageUnloaded: function(i, size) {

        var index = this.options.rightToLeft ? this.options.numPages - i - 1 : i;

        // this.pagesArr[index].onPageUnloaded(size)
        this.pagesArr[index].unload()
    },

    disableFlip: function() {
        // this.flipEnabled = false
        this.iscroll.disable()
    },

    enableFlip: function() {
        // this.flipEnabled = true
        this.iscroll.enable()
        // this.slides[1].iscroll.options.preventDefault = false
        // this.slides[1].iscroll.refresh()
    },

    enablePan: function() {
        // this.slides[1].iscroll.options.preventDefault = true
        this.slides[1].iscroll.enable()
    },

    disablePan: function() {
        // this.slides[1].iscroll.options.preventDefault = false
        this.slides[1].iscroll.disable()
    }

}

FLIPBOOK.PageSwipe = function(options, index, texture, html) {

    this.index = index
    this.options = options
    this.texture = texture
    this.html = html
    this.index = index
    this.$wrapper = jQuery('<div>').addClass('flipbook-carousel-page')
    this.wrapper = this.$wrapper[0]



    this.$inner = jQuery('<div>').appendTo(this.$wrapper).addClass('flipbook-carousel-page-inner')
    this.$img = jQuery('<img>')

    this.$preloader = jQuery('<img src="'+options.assets.spinner+'" class="flipbook-page-preloader">').appendTo(this.$inner)

    var ph = options.pageTextureSize
    var pw = ph * options.pageWidth / options.pageHeight

    this.setSize(pw, ph)

    // jQuery('<div class="cssload-container"><div class="cssload-speeding-wheel"></div></div>').appendTo(this.$wrapper)

}

FLIPBOOK.PageSwipe.prototype = {

    load: function(callback) {

        if (this.loaded){
            if (callback) callback.call(this)
            return
        }
            
        this.loaded = true

        var index = this.options.rightToLeft ? this.options.numPages - this.index - 1 : this.index

        if (this.options.pdfMode) {

            if (this.pageSize != this.options.pageTextureSize) {

                this.options.main.loadPage(index, this.options.pageTextureSize, callback)

            } else {

                if (callback) callback.call(this)

            }

        } else {

            var self = this

            this.options.main.loadPage(index, this.options.pageTextureSize, function(page) {

                var img = document.createElement('img')
                img.src = page.image.src

                self.$img = jQuery(img)

                var imgW = page.image.naturalHeight
                var imgH = page.image.naturalHeight
                var pw = self.options.pageWidth
                var ph = self.options.pageHeight
                var scaleY = ph / imgH
                var translateX = 0

                self.$img.appendTo(self.$inner)


                if (self.options.doublePage && self.index > 0 && self.index % 2 == 0) {

                    self.$img.css('left', '-100%')

                }

                if (self.options.doublePage) {

                    if (self.index == 0 || (self.index == (self.options.pages.length - 1) && !self.options.oddPages))
                        self.$img.css('width', '100%')
                    else
                        self.$img.css('width', '200%')

                } else
                    self.$img.css('width', '100%')



                if (page.htmlContent) {

                    self.htmlContent = page.htmlContent[0]
                    page.htmlContent.appendTo(self.$inner)

                    self.updateHtmlContentSize()

                }

                self.$wrapper.css('background', 'none')

                if (callback) callback.call(self)

            })


        }
    },

    unload: function() {
        this.loaded = false
        this.pageSize = 0

        this.$preloader.appendTo(this.$inner)


        // console.log("page ",this.index," unloaded")
    },

    onPageLoaded: function(size, canvas, htmlContent) {

        if (this.pageSize != size) {

            //console.log('---> update page '+i+' size : '+size)

            this.pageSize = size
            this.$inner.empty();
            jQuery(canvas).appendTo(this.$inner)
            jQuery(htmlContent).appendTo(this.$inner)
            this.htmlContent = htmlContent
            this.updateHtmlContentSize()

        }

    },

    dispose: function() {

        if (this.pageSize) {

            this.pageSize = null
            this.$inner.empty();

            // console.log('disposing page ' + this.index)

        }

    },

    setSize: function(w, h) {

        this.width = w;
        this.height = h;
        this.$wrapper.width(w).height(h)
        this.updateHtmlContentSize()

    },

    updateHtmlContentSize: function() {

        var scale = this.height / 1000

        // console.log(this.height)

        // console.log('updateHtmlContentSize()')
        // console.log(this.htmlContent.style)

        if (this.htmlContent && this.htmlContent.style){
            this.htmlContent.style.transform = 'scale(' + scale + ') translateZ(0)'


            if (this.options.doublePage) {

                    // if (this.index == 0 || (this.index == (this.options.pages.length - 1) && !this.options.oddPages))
                    //     this.htmlContent.style.left = '0'
                    // else
                    //     this.htmlContent.style.left = '-100%'

                    if(this.index % 2 == 0 && this.index > 0)
                        this.htmlContent.style.left = '-100%'
                    else
                        this.htmlContent.style.left = '0'


        }



        }


        

    }

}


FLIPBOOK.SlideSwipe = function() {



}

FLIPBOOK.SlideSwipe.constructor = FLIPBOOK.SlideSwipe;


FLIPBOOK.SlideSwipe.prototype = {

    clear: function() {

    }

}