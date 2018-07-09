import Vue from 'vue';
import Router from 'vue-router';
// 导入Login 组件
import Login from '@/views/Login';
// 导入home组件
import Home from '@/views/Home';

Vue.use(Router);

export default new Router({
  routes: [
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'home',
      path: '/',
      component: Home
    }
  ]
});
