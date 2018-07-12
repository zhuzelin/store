import Vue from 'vue';
import Router from 'vue-router';
// 导入Login 组件
import Login from '@/views/Login';
// 导入home组件
import Home from '@/views/Home';
// 导入Users组件
import Users from '@/views/users/Users';
// 导入Rights组件
import Rights from '@/views/roles/Rights';

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
      component: Home,
      // home里面的子路由
      children: [
        {
          name: 'users',
          path: '/users',
          component: Users
        },
        {
          name: 'rights',
          path: '/rights',
          component: Rights
        }
      ]
    }
  ]
});
