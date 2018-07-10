<template>
<!-- 面包屑 -->
  <el-card class="box-card">
    <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 输入框 -->
    <el-row class="search">
    <el-col :span="24">
        <el-input v-model="searchValue" clearable placeholder="请输入内容" class="longth">
        <el-button @click="handleSearch" slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="success" plain>添加用户</el-button>
    </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table
        border
        v-loading="loading"
        stripe
        :data="list"
        style="width: 100%">
        <el-table-column
        type="index"
        width="50">
        </el-table-column>
        <el-table-column
          prop="username"
          label="姓名"
          width="100">
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          width="180">
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="电话">
        </el-table-column>
        <el-table-column
          prop="create_time"
          label="创建日期">
          <template slot-scope="scope">
            {{ scope.row.create_time | fmtDate('YYYY-MM-DD') }}
            <!-- {{scope.row}}当前行绑定的数据对象 -->
            <!-- {{scope.$index}}当前行的索引 -->
            <!-- {{scope.column}}当前列的配置内容 -->
          </template>
        </el-table-column>
        <el-table-column
          label="用户状态">
          <template slot-scope="scope">
            <!-- scope.row就是当前行绑定的数据对象 user对象 -->
            <el-switch
              @change="handleSwitchChange(scope.row)"
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" plain size="mini"></el-button>
          <el-button @click="handleDelete(scope.row.id)" type="danger" icon="el-icon-delete" plain size="mini"></el-button>
          <el-button type="success" icon="el-icon-check" plain size="mini"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <!-- layout是配置的功能 -->
      <!-- size-change每页数据发生改变 -->
      <!-- current-change当前页码发生改变 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[2, 3, 4, 5]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
  </el-card>

</template>

<script>
export default {
  data() {
    return {
    // 用户列表数据
      list: [],
      loading: true,
      // 分页相关数据
      pagenum: 1, // 页码
      pagesize: 2, // 每页条数
      total: 0, // 总共的数据条数 从服务器获取
      searchValue: ''
    };
  },
  created() {
    // 发送请求获取数据
    this.loadData();
  },
  methods: {
    // 分页方法
    handleSizeChange(val) {
      // 每条页数改变的时候
      this.pagesize = val;
      this.loadData();
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      this.loadData();
      console.log(`当前页: ${val}`);
    },
    // 搜索功能
    handleSearch() {
      this.loadData();
    },
    // 删除操作 点击确定发送请求
    async handleDelete(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        // 包裹await的函数都需要加上async
        const res = await this.$http.delete(`users/${id}`);
        const data = res.data;
        const { meta: { msg, status } } = data;
        if (status === 200) {
          // 删除成功后回到第一页
          this.pagenum = 1;
          this.loadData();
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        } else {
          this.$message.err(msg);
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 当开关的状态发生改变
    async handleSwitchChange(user) {
      const res = await this.$http.put(`users/${user.id}/state/${user.msg_state}`);
      // console.log(res.data);
      const data = res.data;
      const {meta: { msg, status }} = data;
      if (status === 200) {
        this.$message.success(msg);
      } else {
        this.$message.err(msg);
      }
    },
    // 发送异步请求，获取数据
    async loadData() {
      // 发送异步请求之前
      this.loading = true;
      // 发送请求之前 获取token
      const token = sessionStorage.getItem('token');
      // 在请求头中设置token
      this.$http.defaults.headers.common['Authorization'] = token;
      const res = await this.$http.get(`users?pagenum=${this.pagenum}&pagesize=${this.pagesize}&query=${this.searchValue}`);
      // 异步请求结束
      this.loading = false;
      // 获取响应数据
      const data = res.data;
      // meta中的msg 和 status
      const { meta: { msg, status } } = data;
      if (status === 200) {
        const { data: { users, total } } = data;
        this.list = users;
        // 获取总条数
        this.total = total;
      } else {
        this.$message.error(msg);
      }
    }
  }
};
</script>

<style>
.box-card {
  height: 100%;
}

.search {
  margin: 10px 0 10px 0;
}

.longth {
  width: 300px;
}
</style>
