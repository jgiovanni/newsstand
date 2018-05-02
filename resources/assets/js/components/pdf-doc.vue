<template>
	<div>
		<!--<pdf v-if="source" src="source"></pdf>-->
		<pdf v-if="src" v-for="i in numPages"
			:key="i"
			:src="src"
			:page="i"
			 @password="password"
			 @progress="loadedRatio = $event"
			 @error="error"
			 @num-pages="numPages = maxPage"
			 @link-clicked="page = $event"
		></pdf>
	</div>
</template>
<style></style>
<script type="text/javascript">
  import pdf from 'vue-pdf';

  export default {
    name: 'pdf-doc',
    components: { pdf },
    props: {
      source: { type: String, },
      maxPage: { type: Number, default: 3 },
      search: { type: String, },
    },
    data() {
      return {
        loadingTask: undefined,
        src: pdf.createLoadingTask(this.source),
        loadedRatio: 0,
        page: 1,
        numPages: 0,
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
      this.src.then(pdf => {
        this.numPages = pdf.numPages;
      });
    }
  }
</script>