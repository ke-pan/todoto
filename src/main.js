import Vue from 'vue';
import App from './App';
import VueTouch from 'vue-touch';

Vue.use(VueTouch);

/* eslint-disable no-new */
new Vue({
  el: 'body',
  components: { App },
});
