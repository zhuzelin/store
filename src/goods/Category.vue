<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <my-breadcrumb level1="权限管理" level2="权限列表"></my-breadcrumb>
    <el-row class="row-add">
      <el-col :span="24">
        <el-button type="success" plain>添加分类</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table
      v-loading="loading"
      :data="list"
      style="width: 100%">
      <el-tree-grid
        prop="cat_name"
        label="分类名称"
        treeKey="cat_id"
        parentKey="cat_pid"
        levelKey="cat_level"
        childKey="children"
        :indentSize="30">
      </el-tree-grid>
      <!-- <el-table-column
        prop="cat_name"
        label="分类名称"
        width="180">
      </el-table-column> -->
      <el-table-column
        label="级别"
        width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_level === 0">一级</span>
          <span v-else-if="scope.row.cat_level === 1">二级</span>
          <span v-else-if="scope.row.cat_level === 2">三级</span>
        </template>
      </el-table-column>
      <el-table-column
        label="是否有效">
        <template slot-scope="scope">
          {{ scope.row.cat_deleted ? '无效': '有效' }}
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column
        label="操作">
        <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" plain size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" plain size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="pagenumber"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </el-card>
</template>

<script>
// 引入组件， 局部注册组件
import ElTreeGrid from 'element-tree-grid';

export default {
  data() {
    return {
      list: [],
      loading: true,
      // 分页数据
      pagenumber: 1,
      pagesize: 5,
      total: 0
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    // 加载列表数据
    async loadData() {
      const { data: resData } = await this.$http.get(`categories?type=3&pagenum=${this.pagenumber}&pagesize=${this.pagesize}`);
      // 请求结束loading消失
      this.loading = false;
      const { data: { result, total } } = resData;
      this.list = result;
      // 获取总条数
      this.total = total;
    },
    // 分页
    handleSizeChange(val) {
      this.pagesize = val;
      this.loadData();
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.pagenumber = val;
      this.loadData();
      console.log(`当前页: ${val}`);
    }
  },
  components: {
    ElTreeGrid
  }
};
</script>

<style>
  .row-add {
    margin-top: 10px;
    margin-bottom: 10px;
  }
</style>
