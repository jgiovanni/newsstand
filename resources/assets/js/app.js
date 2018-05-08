/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');
window.Vue = require('vue');
// window.stickybits = require('stickybits');
/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

// Vue.component('example-component', require('./components/ExampleComponent.vue'));
Vue.use(require('bootstrap-vue'));
Vue.use(require('vue-social-sharing'));
Vue.component('pdf', require('vue-pdf'));
Vue.component('pdf-doc', require('./components/pdf-doc'));
import datepicker from 'vuejs-datepicker';
import moment from 'moment';
// Vue.component('datepicker', require('vuejs-datepicker'));
const app = new Vue({
  el: '#app',
  components: {
    datepicker
  },
  data() {
    return {
      pastPapers: {
        date: new Date(2018, 3, 25),
        highlighted: {
          dates: [ // Highlight an array of dates
            new Date(2018, 3, 20)
          ]
        },
        pdf: '/pdfs/20180425TD.pdf',
      },
    }
  },
  methods: {
    loadPdf(date) {
      let m = moment(date);
      window.location.href = `/past/${m.format('YYYYMMDD')}`;
      // this.pastPapers.pdf = `/pdfs/${m.format('YYYYMMDD')}TD.pdf`;
    }
  },
  mounted() {
    console.log('App Started');
    // this.pdfViewer = new PdfViewer(pdfConfig).embed(document.getElementById('DocContainer'));
    if (!!this.$el.dataset.callcta) {
      //$('#subscribeCTA').modal({ keyboard: false, backdrop: 'static'});
    }
  }
});
