<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <my-breadcrumb level1="权限管理" level2="权限列表"></my-breadcrumb>
    <!-- 表格 -->
    <el-table
      class="table"
      stripe
      border
      :data="list"
      style="width: 100%">
      <el-table-column
      width="50"
      type="index">
      </el-table-column>
      <el-table-column
        prop="authName"
        label="权限名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="path"
        label="路径"
        width="180">
      </el-table-column>
      <el-table-column
        prop="level"
        label="层级">
        <template slot-scope="scope">
          <span v-if="scope.row.level === '0'">一级</span>
          <span v-if="scope.row.level === '1'">二级</span>
          <span v-if="scope.row.level === '2'">三级</span>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      list: []
    };
  },
  // 加载完成后创建请求
  created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      // // 发送请求之前先获取token
      // const token = sessionStorage.getItem('token');
      // // 请求头中设置token
      // this.$http.defaults.headers.common['Authorization'] = token;
      const res = await this.$http.get('rights/list');
      const data = res.data;
      this.list = data.data;
    }
  }
};
</script>

<style>

  .table {
    margin-top: 10px;
  }
</style>
