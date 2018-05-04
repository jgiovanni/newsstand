<template>
	<div>
		<b-progress v-if="loadedRatio < 1" :value="(loadedRatio * 100)" animated></b-progress>
		<div id="pdfContainer"></div>
		<!--<pdf v-if="source && !multi"
		     :src="source"
		     :page="page"
		     @password="password"
		     @progress="loadedRatio = $event"
		     @error="error"
		     @num-pages="numPages = $event"
		     @link-clicked="page = $event"></pdf>-->
		<!--<pdf v-else-if="src && multi" v-for="i in numPages"
			:key="i"
			:src="src"
			:page="i"
			 @password="password"
			 @progress="loadedRatio = $event"
			 @error="error"
			 @num-pages="numPages = maxPage"
			 @link-clicked="page = $event"></pdf>-->

		<b-pagination-nav class="pdf-nav" align="center" v-if="numPages" base-url="#" :number-of-pages="numPages" v-model="page" />
	</div>
</template>
<style>
	.pdf-nav {
		bottom: 20px;
	}
</style>
<script type="text/javascript">
  // import pdf from 'vue-pdf';
  import stickybits from 'stickybits';
  // import swipeBook from '../vendor/flipbook.min';
  const swipeBook = require('../vendor/flipbook.min');

  export default {
    name: 'pdf-doc',
    // components: { pdf },
    props: {
      source: { type: String, },
      multi: { type: Boolean, default: false },
      maxPage: { type: Number, default: 3 },
      search: { type: String, },
    },
    data() {
      return {
        loadingTask: undefined,
        src: undefined, //pdf.createLoadingTask(this.source),
        loadedRatio: 0,
        page: 1,
        numPages: undefined,
        rotate: 0,
      }
    },
    methods: {
      password: function(updatePassword, reason) {

        updatePassword(prompt('password is "test"'));
      },
      error: function(err) {

        console.log(err);
      }
    },
    created() {
      // this.src = pdf.createLoadingTask(this.source);

    },
    mounted() {
      /*this.src.then(pdf => {
        this.numPages = pdf.numPages;
      }).then(() => {
        stickybits('.pdf-nav');
        // let ctx = $('canvas')[0].getContext("2d");
        // ctx.scale(3, 3);
      });*/
      if (window.swipeBook)
      $.getScript('/vendor/flipbook.min.js').then(function () {

      })
      $('#pdfContainer')
        .swipeBook({
          pdfUrl: this.source,
          deeplinkingEnabled:true,
          deeplinkingPrefix:"page"

        })
    }
  }
</script>