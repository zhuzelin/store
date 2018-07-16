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
      <!-- 一级菜单 -->
      <el-submenu
        v-for="item in menus"
        :key = "item.id"
        :index="item.id + ''">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>{{ item.authName }}</span>

        </template>
          <el-menu-item
            v-for="item1 in item.children"
            :key="item1.id"
            :index="'/' + item1.path">
            <i class="el-icon-menu"></i>
            {{ item1.authName }}
          </el-menu-item>
      </el-submenu>

      </el-menu>
    </el-aside>
    <!-- 主体部分 -->
    <el-main class="main">
      <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
</template>

<script>
export default {
  data() {
    return {
      menus: []
    };
  },
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
  created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      const { data: resData } = await this.$http.get('menus');
      const { data, meta: { status, msg } } = resData;
      if (status === 200) {
        this.menus = data;
      } else {
        this.$message.error(msg);
      }
    },
    // 退出
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
}
</style>
