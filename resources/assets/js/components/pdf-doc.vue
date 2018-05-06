<template>
	<div id="pdf-container">
		<div v-if="hasError" class="alert alert-warning alert-dismissible fade show" role="alert">
			There was an error loading the newspaper. Please try again later.
			<button type="button" class="close" data-dismiss="alert" aria-label="Close">
				<span aria-hidden="true">&times;</span>
			</button>
		</div>

		<b-progress v-if="loadedRatio < 1" :value="(loadedRatio * 100)" animated></b-progress>
		<pdf v-if="source"
		     :src="source"
		     :page="page"
		     @password="password"
		     @progress="loadedRatio = $event"
		     @error="error"
		     @num-pages="numPages = $event"
		     @link-clicked="page = $event"></pdf>

		<share-buttons></share-buttons>

		<b-pagination-nav class="pdf-nav" align="center" v-if="pagination && numPages" base-url="#" :number-of-pages="numPages" v-model="page" />
	</div>
</template>
<style>
	.pdf-nav {
		bottom: 20px;
	}
</style>
<script type="text/javascript">
  import pdf from 'vue-pdf';
  import stickybits from 'stickybits';
  window.stickybits = stickybits;
  import shareButtons from './share-buttons';

  export default {
    name: 'pdf-doc',
    components: { pdf, shareButtons },
    props: {
      source: { type: String, },
      fullAccess: { type: Boolean, default: false },
      pagination: { type: Boolean, default: true },
      maxPage: { type: Number, default: 3 },
      search: { type: String, },
    },
    data() {
      return {
        loadingTask: undefined,
        src: pdf.createLoadingTask(this.source),
        loadedRatio: 0,
        page: 1,
        numPages: undefined,
        rotate: 0,
        pdfReady: false,
        hasError: false,
      }
    },
    watch: {
      source(val, oldVal) {
        this.hasError = false;
        this.pdfReady = false;
        // this.src = pdf.createLoadingTask(this.source);
        this.$nextTick(() => {
          this.pdfReady = true;
        })
      },
      page(val, oldVal) {
        if (val > 3 && !this.fullAccess) {
          this.page = oldVal;
          this.$nextTick(() => {
            this.page = oldVal;
            let canvas = $('canvas')[0];
            let ctx = canvas.getContext("2d");
            // ctx.filter = 'blur(10px)';
            ctx.fillStyle = 'rgba(200, 200, 200, .95)';

            ctx.fillRect(5, 5, canvas.width-5, canvas.height-5);
            $('#subscribeCTA').modal({ keyboard: false, backdrop: 'static'})
          });
        }
      }
    },
    methods: {
      password: function(updatePassword, reason) {

        updatePassword(prompt('password is "test"'));
      },
      error: function(err) {
		this.hasError = true;
        console.log(err);
      }
    },
    created() {
      // this.src = pdf.createLoadingTask(this.source);
    },
    mounted() {
      this.src.then(pdf => {
        this.numPages = pdf.numPages;
        this.pdfReady = true;
        console.log('PDF Ready');
      }).then(() => {
        // stickybits({ scrollEl: '#pdf-container', useStickyClasses: true });
        stickybits('.pdf-nav', { scrollEl: '#pdf-container', useStickyClasses: true });
        // stickybits('.pdf-share', { scrollEl: '#pdf-container', useStickyClasses: true });
		// let ctx = $('canvas')[0].getContext("2d");
      });
    }
  }
</script>