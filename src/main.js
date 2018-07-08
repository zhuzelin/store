// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from './router';
import '@/assets/css/style.css';
import MyAxios from './plugins/MyAxios';

Vue.config.productionTip = false;

// 注册插件
Vue.use(ElementUI);
// 注册MyAxios插件
Vue.use(MyAxios);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
