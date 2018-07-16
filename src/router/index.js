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
// 导入Roles组件
import Roles from '@/views/roles/Roles';
import { Message } from 'element-ui';
// 导入category组件
import Category from '@/goods/Category';
// import VueRouter from 'vue-router';

Vue.use(Router);

const router = new Router({
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
        },
        {
          name: 'roles',
          path: '/roles',
          component: Roles
        },
        {
          name: 'category',
          path: '/categories',
          component: Category
        }
      ]
    }
  ]
});

// 路由的前置守卫
router.beforeEach((to, from, next) => {
  // 判断当前访问的路由是不是login， 如果是login直接next
  if (to.name === 'login') {
    next();
  } else {
    // 判断有没有token
    // 获取token
    const token = sessionStorage.getItem('token');
    if (!token) {
      // 如果没有跳转到login页面
      router.push({ name: 'login' });
      // 提示
      Message.warning('请先登录');
      return;
    }
    next();
  }
  next();
});

export default router;
