<template>
<el-container class="container">
  <el-header>
    <!-- 栅格系统 -->
    <el-row>
      <el-col :span="4">
        <img src="../assets/logo.png" alt="">
      </el-col>
      <el-col :span="19">
        <h2>电商后台管理系统</h2>
      </el-col>
      <el-col :span="1">
        <a href="#" @click.prevent="handleLogout">退出</a>
      </el-col>
    </el-row>
  </el-header>
  <el-container>
    <!-- 侧边栏 -->
    <el-aside width="200px">
      <el-menu
      class="menu"
      :router="true"
      :unique-opened="true">
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>用户管理</span>
        </template>
          <el-menu-item index="/users"><i class="el-icon-menu"></i>用户列表</el-menu-item>
      </el-submenu>
      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>权限管理</span>
        </template>
          <el-menu-item index="/roles"><i class="el-icon-menu"></i>角色列表</el-menu-item>
          <el-menu-item index="/rights"><i class="el-icon-menu"></i>权限列表</el-menu-item>
      </el-submenu>
      <el-submenu index="3">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>商品管理</span>
        </template>
          <el-menu-item index="3-1"><i class="el-icon-menu"></i>商品列表</el-menu-item>
          <el-menu-item index="3-2"><i class="el-icon-menu"></i>分类参数</el-menu-item>
          <el-menu-item index="3-3"><i class="el-icon-menu"></i>商品分类</el-menu-item>
      </el-submenu>
      <el-submenu index="4">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>订单管理</span>
        </template>
          <el-menu-item index="4-2"><i class="el-icon-menu"></i>订单列表</el-menu-item>
      </el-submenu>
      <el-submenu index="5">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>数据统计</span>
        </template>
          <el-menu-item index="5-1"><i class="el-icon-menu"></i>数据报表</el-menu-item>
      </el-submenu>
      </el-menu>
    </el-aside>
    <!-- 主体部分 -->
    <el-main>Main</el-main>
  </el-container>
</el-container>
</template>

<script>
export default {
  // 判断是否登陆
  beforeCreate() {
    const token = sessionStorage.getItem('token');
    if (!token) {
      // 提示登陆
      this.$message.warning('请先登陆');
      // 跳转回页面
      this.$router.push({ name: 'login' });
    }
  },
  methods: {
    handleLogout () {
      // 删除sessionStrorage
      sessionStorage.removeItem('token');
      // 跳转到登陆页
      this.$router.push({ name: 'login' });
      this.$message.success('退出成功');
    }
  }
};
</script>

<style>
.container {
  height: 100%;
}

.container a {
  text-decoration: none;
  color: red;
}

.el-header {
  background-color: #B3C0D1;
  color: #333;
  text-align: center;
  line-height: 60px;
  padding: 0;
  color: #fff;
}

.el-header img {
  height: 56px;
}

.el-aside {
  background-color: #D3DCE6;
  color: #333;
}

.el-aside {
  height: 100%;
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: center;
  line-height: 160px;
}
</style>
